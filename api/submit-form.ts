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
  formName: string,
  token: string
): Promise<{ url: string } | { error: string }> {
  const startTime = Date.now();
  console.log(`[Blob Upload] Starting upload for file: ${fileName} (${mimeType}), size: ${fileData.length} chars (base64)`);
  
  try {
    // Convert base64 to Buffer
    const fileBuffer = Buffer.from(fileData, "base64");
    console.log(`[Blob Upload] Converted to buffer, size: ${fileBuffer.length} bytes`);
    
    // Create organized path: form-submissions/{formName}/{timestamp}-{fileName}
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const sanitizedFormName = formName.replace(/[^a-zA-Z0-9-_]/g, "-");
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9-_.]/g, "-");
    const blobPath = `form-submissions/${sanitizedFormName}/${timestamp}-${sanitizedFileName}`;
    console.log(`[Blob Upload] Blob path: ${blobPath}`);
    
    // Upload to Vercel Blob Storage
    console.log(`[Blob Upload] Calling Vercel Blob put()...`);
    const blob = await put(blobPath, fileBuffer, {
      access: "public",
      addRandomSuffix: true,
      contentType: mimeType,
      token: token,
    });
    
    const duration = Date.now() - startTime;
    console.log(`[Blob Upload] Success! Uploaded to: ${blob.url} (took ${duration}ms)`);
    return { url: blob.url };
  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.error(`[Blob Upload] Error after ${duration}ms:`, {
      message: error.message,
      name: error.name,
      stack: error.stack,
      fileName,
      mimeType,
      formName,
    });
    return { 
      error: error.message || "Failed to upload file to blob storage" 
    };
  }
}


export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const requestStartTime = Date.now();
  console.log(`[Submit Form] ${req.method} request received at ${new Date().toISOString()}`);
  console.log(`[Submit Form] Request headers:`, {
    'content-type': req.headers['content-type'],
    'content-length': req.headers['content-length'],
    'user-agent': req.headers['user-agent'],
  });

  // Only allow POST requests
  if (req.method !== "POST") {
    console.warn(`[Submit Form] Method not allowed: ${req.method}`);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    console.log(`[Submit Form] Parsing request body...`);
    const { formName, googleSheetUrl, fields, fileFields } =
      req.body as FormSubmissionPayload;

    console.log(`[Submit Form] Payload received:`, {
      formName,
      googleSheetUrl,
      fieldsCount: Object.keys(fields || {}).length,
      fileFieldsCount: fileFields ? Object.keys(fileFields).length : 0,
      fileFieldNames: fileFields ? Object.keys(fileFields) : [],
    });

    // Validate required fields
    if (!formName || !googleSheetUrl || !fields) {
      console.error(`[Submit Form] Validation failed:`, {
        hasFormName: !!formName,
        hasGoogleSheetUrl: !!googleSheetUrl,
        hasFields: !!fields,
      });
      return res.status(400).json({
        error: "Missing required fields: formName, googleSheetUrl, and fields",
      });
    }

    // Check for environment variables
    console.log(`[Submit Form] Checking environment variables...`);
    const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
    const blobToken = process.env.CCC_READ_WRITE_TOKEN;

    console.log(`[Submit Form] Environment variables status:`, {
      hasServiceAccountEmail: !!serviceAccountEmail,
      hasPrivateKey: !!privateKey,
      privateKeyLength: privateKey?.length || 0,
      hasBlobToken: !!blobToken,
      blobTokenLength: blobToken?.length || 0,
      vercelEnv: process.env.VERCEL_ENV,
    });

    if (!serviceAccountEmail || !privateKey) {
      console.error(`[Submit Form] Missing Google credentials`);
      return res.status(500).json({
        error: "Server configuration error: Missing Google credentials",
        debug: {
          hasEmail: !!serviceAccountEmail,
          hasKey: !!privateKey,
        },
      });
    }

    // Check for Blob Storage token if file uploads are present
    if (fileFields && Object.keys(fileFields).length > 0 && !blobToken) {
      console.error(`[Submit Form] Missing CCC_READ_WRITE_TOKEN for file uploads`);
      return res.status(500).json({
        error: "Server configuration error: Missing CCC_READ_WRITE_TOKEN for file uploads",
        debug: {
          hasBlobToken: !!blobToken,
          fileFieldsCount: Object.keys(fileFields).length,
        },
      });
    }

    // Authenticate with Google (only Sheets scope, no Drive)
    console.log(`[Submit Form] Authenticating with Google...`);
    const auth = new google.auth.JWT({
      email: serviceAccountEmail,
      key: privateKey,
      scopes: [
        "https://www.googleapis.com/auth/spreadsheets",
      ],
    });

    // Extract sheet ID from URL
    console.log(`[Submit Form] Extracting sheet ID from URL: ${googleSheetUrl}`);
    const sheetId = extractSheetId(googleSheetUrl);
    if (!sheetId) {
      console.error(`[Submit Form] Invalid Google Sheet URL`);
      return res.status(400).json({ error: "Invalid Google Sheet URL" });
    }
    console.log(`[Submit Form] Extracted sheet ID: ${sheetId}`);

    // Process file uploads to Vercel Blob Storage
    console.log(`[Submit Form] Processing file uploads...`);
    const fileLinks: Record<string, string> = {};
    if (fileFields && Object.keys(fileFields).length > 0) {
      console.log(`[Submit Form] Found ${Object.keys(fileFields).length} file(s) to upload`);
      for (const [fieldName, fileData] of Object.entries(fileFields)) {
        console.log(`[Submit Form] Uploading file field "${fieldName}": ${fileData.name}`);
        const uploadResult = await uploadFileToBlob(
          fileData.name,
          fileData.data,
          fileData.type,
          formName,
          blobToken!
        );
        if ("url" in uploadResult) {
          fileLinks[fieldName] = uploadResult.url;
          console.log(`[Submit Form] File "${fieldName}" uploaded successfully: ${uploadResult.url}`);
        } else {
          // If file upload fails, return error immediately
          console.error(`[Submit Form] File upload failed for "${fieldName}":`, uploadResult.error);
          return res.status(500).json({
            error: `Failed to upload file "${fileData.name}": ${uploadResult.error}`,
            fieldName,
          });
        }
      }
      console.log(`[Submit Form] All files uploaded successfully. Total: ${Object.keys(fileLinks).length}`);
    } else {
      console.log(`[Submit Form] No files to upload`);
    }

    // Prepare data row for Google Sheets
    console.log(`[Submit Form] Initializing Google Sheets API...`);
    const sheets = google.sheets({ version: "v4", auth });

    // Get existing headers or create new row
    const sheetName = "Sheet1"; // Default sheet name
    let headers: string[] = [];
    let values: any[] = [];

    console.log(`[Submit Form] Fetching existing headers from sheet "${sheetName}"...`);
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
        console.log(`[Submit Form] Found existing headers (${headers.length}):`, headers);
      } else {
        console.log(`[Submit Form] No existing headers found, will create new ones`);
      }
    } catch (error: any) {
      // If sheet doesn't exist or is empty, we'll create headers
      console.log(`[Submit Form] Could not fetch headers (will create new):`, error.message);
    }

    // Add timestamp column if not exists
    if (!headers.includes("Timestamp")) {
      headers.push("Timestamp");
      console.log(`[Submit Form] Added Timestamp column to headers`);
    }

    // Build values array matching headers
    const timestamp = new Date().toISOString();
    values.push(timestamp);
    console.log(`[Submit Form] Building values array with timestamp: ${timestamp}`);

    // Add form fields
    for (const header of headers) {
      if (header === "Timestamp") {
        continue; // Already added
      }

      // Check if this header matches a form field
      const fieldValue = fields[header];
      if (fieldValue !== undefined && fieldValue !== null) {
        const stringValue = typeof fieldValue === "boolean" ? (fieldValue ? "Yes" : "No") : String(fieldValue);
        values.push(stringValue);
        console.log(`[Submit Form] Added field "${header}": ${stringValue.substring(0, 50)}${stringValue.length > 50 ? '...' : ''}`);
      } else if (fileLinks[header]) {
        // Check if this is a file field
        values.push(fileLinks[header]);
        console.log(`[Submit Form] Added file link for "${header}": ${fileLinks[header]}`);
      } else {
        values.push("");
      }
    }
    console.log(`[Submit Form] Values array built with ${values.length} values`);

    // If headers don't exist, create them first
    if (headers.length === 0 || headers.length === 1) {
      console.log(`[Submit Form] Creating new headers...`);
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

      console.log(`[Submit Form] Created headers (${headers.length}):`, headers);

      // Write headers
      console.log(`[Submit Form] Writing headers to sheet...`);
      await sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: `${sheetName}!1:1`,
        valueInputOption: "RAW",
        requestBody: {
          values: [headers],
        },
      });
      console.log(`[Submit Form] Headers written successfully`);

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
      console.log(`[Submit Form] Rebuilt values array with ${values.length} values`);
    }

    // Append data row
    console.log(`[Submit Form] Appending data row to sheet...`);
    console.log(`[Submit Form] Data row values:`, values.map((v, i) => `${headers[i] || `[${i}]`}: ${String(v).substring(0, 50)}${String(v).length > 50 ? '...' : ''}`));
    
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: `${sheetName}!A:Z`,
      valueInputOption: "RAW",
      requestBody: {
        values: [values],
      },
    });
    console.log(`[Submit Form] Data row appended successfully`);

    const totalDuration = Date.now() - requestStartTime;
    console.log(`[Submit Form] ✅ Success! Form submitted in ${totalDuration}ms`);
    
    return res.status(200).json({
      success: true,
      message: "Form submitted successfully",
    });
  } catch (error: any) {
    const totalDuration = Date.now() - requestStartTime;
    console.error(`[Submit Form] ❌ Error after ${totalDuration}ms:`, {
      message: error.message,
      name: error.name,
      stack: error.stack,
      code: error.code,
      response: error.response?.data,
    });
    
    return res.status(500).json({
      error: error.message || "Failed to submit form",
    });
  }
}

