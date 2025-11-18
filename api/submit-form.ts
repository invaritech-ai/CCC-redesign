import type { VercelRequest, VercelResponse } from "@vercel/node";
import { google } from "googleapis";
import { config } from "dotenv";
import { resolve } from "path";
import { put } from "@vercel/blob";

// Load .env.local in local development (not in production where Vercel handles env vars)
// VERCEL_ENV is not set when running `vercel dev` locally, or is set to "development"
if (!process.env.VERCEL_ENV || process.env.VERCEL_ENV === "development") {
  config({ path: resolve(process.cwd(), ".env.local") });
}

interface FormSubmissionPayload {
  formName: string;
  googleSheetUrl: string;
  fields: Record<string, any>;
  fileFields?: Record<string, { name: string; data: string; type: string }>;
}

/**
 * Extract sheet ID from Google Sheets URL
 */
function extractSheetId(url: string): string | null {
  try {
    const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

/**
 * Upload file to Vercel Blob Storage
 */
async function uploadFileToBlob(
  fileName: string,
  fileData: string,
  mimeType: string,
  formName: string
): Promise<string | null> {
  try {
    // Convert base64 to Buffer
    const fileBuffer = Buffer.from(fileData, "base64");
    
    // Create organized path: form-submissions/{formName}/{timestamp}-{fileName}
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const sanitizedFormName = formName.replace(/[^a-zA-Z0-9-_]/g, "-");
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9-_.]/g, "-");
    const blobPath = `form-submissions/${sanitizedFormName}/${timestamp}-${sanitizedFileName}`;
    
    // Upload to Vercel Blob Storage
    const blob = await put(blobPath, fileBuffer, {
      access: "public",
      addRandomSuffix: true,
      contentType: mimeType,
    });
    
    return blob.url;
  } catch (error: any) {
    return null;
  }
}


export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { formName, googleSheetUrl, fields, fileFields } =
      req.body as FormSubmissionPayload;

    // Validate required fields
    if (!formName || !googleSheetUrl || !fields) {
      return res.status(400).json({
        error: "Missing required fields: formName, googleSheetUrl, and fields",
      });
    }

    // Check for environment variables
    const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

    if (!serviceAccountEmail || !privateKey) {
      return res.status(500).json({
        error: "Server configuration error: Missing Google credentials",
        debug: {
          hasEmail: !!serviceAccountEmail,
          hasKey: !!privateKey,
        },
      });
    }

    // Authenticate with Google (only Sheets scope, no Drive)
    const auth = new google.auth.JWT({
      email: serviceAccountEmail,
      key: privateKey,
      scopes: [
        "https://www.googleapis.com/auth/spreadsheets",
      ],
    });

    // Extract sheet ID from URL
    const sheetId = extractSheetId(googleSheetUrl);
    if (!sheetId) {
      return res.status(400).json({ error: "Invalid Google Sheet URL" });
    }

    // Process file uploads to Vercel Blob Storage
    const fileLinks: Record<string, string> = {};
    if (fileFields && Object.keys(fileFields).length > 0) {
      for (const [fieldName, fileData] of Object.entries(fileFields)) {
        const fileLink = await uploadFileToBlob(
          fileData.name,
          fileData.data,
          fileData.type,
          formName
        );
        if (fileLink) {
          fileLinks[fieldName] = fileLink;
        }
      }
    }

    // Prepare data row for Google Sheets
    const sheets = google.sheets({ version: "v4", auth });

    // Get existing headers or create new row
    const sheetName = "Sheet1"; // Default sheet name
    let headers: string[] = [];
    let values: any[] = [];

    try {
      // Try to get existing headers
      const headerResponse = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: `${sheetName}!1:1`,
      });

      if (
        headerResponse.data.values &&
        headerResponse.data.values.length > 0
      ) {
        headers = headerResponse.data.values[0] as string[];
      }
    } catch (error) {
      // If sheet doesn't exist or is empty, we'll create headers
    }

    // Add timestamp column if not exists
    if (!headers.includes("Timestamp")) {
      headers.push("Timestamp");
    }

    // Build values array matching headers
    const timestamp = new Date().toISOString();
    values.push(timestamp);

    // Add form fields
    for (const header of headers) {
      if (header === "Timestamp") {
        continue; // Already added
      }

      // Check if this header matches a form field
      const fieldValue = fields[header];
      if (fieldValue !== undefined && fieldValue !== null) {
        values.push(
          typeof fieldValue === "boolean" ? (fieldValue ? "Yes" : "No") : String(fieldValue)
        );
      } else if (fileLinks[header]) {
        // Check if this is a file field
        values.push(fileLinks[header]);
      } else {
        values.push("");
      }
    }

    // If headers don't exist, create them first
    if (headers.length === 0 || headers.length === 1) {
      // Create headers from form fields and file fields
      headers = ["Timestamp"];
      const formFieldNames = Object.keys(fields);
      const fileFieldNames = Object.keys(fileLinks);

      // Add all field names as headers
      [...formFieldNames, ...fileFieldNames].forEach((fieldName) => {
        if (!headers.includes(fieldName)) {
          headers.push(fieldName);
        }
      });

      // Write headers
      await sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: `${sheetName}!1:1`,
        valueInputOption: "RAW",
        requestBody: {
          values: [headers],
        },
      });

      // Rebuild values array with correct order
      values = [timestamp];
      headers.slice(1).forEach((header) => {
        if (fields[header] !== undefined && fields[header] !== null) {
          const fieldValue = fields[header];
          values.push(
            typeof fieldValue === "boolean" ? (fieldValue ? "Yes" : "No") : String(fieldValue)
          );
        } else if (fileLinks[header]) {
          values.push(fileLinks[header]);
        } else {
          values.push("");
        }
      });
    }

    // Append data row
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: `${sheetName}!A:Z`,
      valueInputOption: "RAW",
      requestBody: {
        values: [values],
      },
    });

    return res.status(200).json({
      success: true,
      message: "Form submitted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      error: error.message || "Failed to submit form",
    });
  }
}

