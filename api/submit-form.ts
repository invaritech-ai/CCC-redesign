import type { VercelRequest, VercelResponse } from "@vercel/node";
import { google } from "googleapis";
import { config } from "dotenv";
import { resolve } from "path";
import { put } from "@vercel/blob";

// Load .env.local in local development
if (!process.env.VERCEL_ENV || process.env.VERCEL_ENV === "development") {
    config({ path: resolve(process.cwd(), ".env.local") });
}

interface FormSubmissionPayload {
    formName: string;
    googleSheetUrl: string;
    fields: Record<string, string | boolean | number | null | undefined>;
    fileFields?: Record<string, { name: string; data: string; type: string }>;
}

const SHEET_NAME = "Sheet1";
const TIMESTAMP_HEADER = "Timestamp";

/**
 * Extract sheet ID from Google Sheets URL
 */
function extractSheetId(url: string): string | null {
    const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : null;
}

/**
 * Sanitize string for use in file paths
 */
function sanitizeForPath(str: string): string {
    return str.replace(/[^a-zA-Z0-9-_.]/g, "-");
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

    try {
        const fileBuffer = Buffer.from(fileData, "base64");
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const blobPath = `form-submissions/${sanitizeForPath(
            formName
        )}/${timestamp}-${sanitizeForPath(fileName)}`;

        const blob = await put(blobPath, fileBuffer, {
            access: "public",
            addRandomSuffix: true,
            contentType: mimeType,
            token,
        });

        console.log(
            `[Blob Upload] Success: ${fileName} -> ${blob.url} (${
                Date.now() - startTime
            }ms)`
        );
        return { url: blob.url };
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error
                ? error.message
                : "Failed to upload file to blob storage";
        console.error(`[Blob Upload] Failed: ${fileName}`, errorMessage);
        return { error: errorMessage };
    }
}

/**
 * Process file uploads and return file links
 */
async function processFileUploads(
    fileFields: Record<string, { name: string; data: string; type: string }>,
    formName: string,
    blobToken: string
): Promise<Record<string, string>> {
    const fileLinks: Record<string, string> = {};

    for (const [fieldName, fileData] of Object.entries(fileFields)) {
        const uploadResult = await uploadFileToBlob(
            fileData.name,
            fileData.data,
            fileData.type,
            formName,
            blobToken
        );

        if ("error" in uploadResult) {
            throw new Error(
                `Failed to upload file "${fileData.name}": ${uploadResult.error}`
            );
        }

        fileLinks[fieldName] = uploadResult.url;
    }

    return fileLinks;
}

/**
 * Get or create headers for the sheet
 */
async function getOrCreateHeaders(
    sheets: ReturnType<typeof google.sheets>,
    sheetId: string,
    existingHeaders: string[],
    allFieldNames: string[]
): Promise<string[]> {
    // Handle empty sheet
    if (existingHeaders.length === 0) {
        const headers = [TIMESTAMP_HEADER, ...allFieldNames];
        await sheets.spreadsheets.values.update({
            spreadsheetId: sheetId,
            range: `${SHEET_NAME}!1:1`,
            valueInputOption: "RAW",
            requestBody: { values: [headers] },
        });
        return headers;
    }

    // Preserve existing headers and add missing ones
    const hadTimestamp = existingHeaders.includes(TIMESTAMP_HEADER);
    const headersWithoutTimestamp = existingHeaders.filter(
        (h) => h !== TIMESTAMP_HEADER
    );
    const headersToAdd = allFieldNames.filter(
        (name) => !headersWithoutTimestamp.includes(name)
    );

    if (!hadTimestamp || headersToAdd.length > 0) {
        const finalHeaders = [
            TIMESTAMP_HEADER,
            ...headersWithoutTimestamp,
            ...headersToAdd,
        ];
        await sheets.spreadsheets.values.update({
            spreadsheetId: sheetId,
            range: `${SHEET_NAME}!1:1`,
            valueInputOption: "RAW",
            requestBody: { values: [finalHeaders] },
        });
        return finalHeaders;
    }

    return [TIMESTAMP_HEADER, ...headersWithoutTimestamp];
}

/**
 * Build values array matching headers exactly
 */
function buildValuesArray(
    headers: string[],
    timestamp: string,
    fields: Record<string, string | boolean | number | null | undefined>,
    fileLinks: Record<string, string>
): (string | number)[] {
    return headers.map((header) => {
        if (header === TIMESTAMP_HEADER) {
            return timestamp;
        }

        const fieldValue = fields[header];
        if (fieldValue !== undefined && fieldValue !== null) {
            return typeof fieldValue === "boolean"
                ? fieldValue
                    ? "Yes"
                    : "No"
                : String(fieldValue);
        }

        return fileLinks[header] || "";
    });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const requestStartTime = Date.now();

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

        // Check environment variables
        const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
        const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(
            /\\n/g,
            "\n"
        );
        const blobToken = process.env.CCC_READ_WRITE_TOKEN;

        if (!serviceAccountEmail || !privateKey) {
            return res.status(500).json({
                error: "Server configuration error: Missing Google credentials",
            });
        }

        if (fileFields && Object.keys(fileFields).length > 0 && !blobToken) {
            return res.status(500).json({
                error: "Server configuration error: Missing CCC_READ_WRITE_TOKEN for file uploads",
            });
        }

        // Authenticate with Google
        const auth = new google.auth.JWT({
            email: serviceAccountEmail,
            key: privateKey,
            scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });

        // Extract sheet ID
        const sheetId = extractSheetId(googleSheetUrl);
        if (!sheetId) {
            return res.status(400).json({ error: "Invalid Google Sheet URL" });
        }

        // Process file uploads
        const fileLinks =
            fileFields && Object.keys(fileFields).length > 0
                ? await processFileUploads(fileFields, formName, blobToken!)
                : {};

        // Initialize Google Sheets API
        const sheets = google.sheets({ version: "v4", auth });

        // Get existing headers
        let existingHeaders: string[] = [];
        try {
            const headerResponse = await sheets.spreadsheets.values.get({
                spreadsheetId: sheetId,
                range: `${SHEET_NAME}!1:1`,
            });
            if (headerResponse.data.values?.[0]) {
                existingHeaders = headerResponse.data.values[0] as string[];
            }
        } catch {
            // Sheet might be empty, continue with empty headers
        }

        // Get all field names
        const allFieldNames = [
            ...Object.keys(fields),
            ...Object.keys(fileLinks),
        ];

        // Get or create headers
        const headers = await getOrCreateHeaders(
            sheets,
            sheetId,
            existingHeaders,
            allFieldNames
        );

        // Build values array
        const timestamp = new Date().toISOString();
        const values = buildValuesArray(headers, timestamp, fields, fileLinks);

        // Append data row
        await sheets.spreadsheets.values.append({
            spreadsheetId: sheetId,
            range: `${SHEET_NAME}!A:Z`,
            valueInputOption: "RAW",
            requestBody: { values: [values] },
        });

        console.log(
            `[Submit Form] ✅ Success (${Date.now() - requestStartTime}ms)`
        );

        return res.status(200).json({
            success: true,
            message: "Form submitted successfully",
        });
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Failed to submit form";
        console.error(
            `[Submit Form] ❌ Error (${Date.now() - requestStartTime}ms):`,
            errorMessage
        );

        return res.status(500).json({
            error: errorMessage,
        });
    }
}
