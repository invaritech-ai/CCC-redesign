import type { VercelRequest, VercelResponse } from "@vercel/node";
import { google } from "googleapis";
import { config } from "dotenv";
import { resolve } from "path";
import { put } from "@vercel/blob";
import { Resend } from "resend";

// Load .env.local in local development
if (!process.env.VERCEL_ENV || process.env.VERCEL_ENV === "development") {
    config({ path: resolve(process.cwd(), ".env.local") });
}

interface FormSubmissionPayload {
    formName: string;
    pageSlug?: string;
    googleSheetUrl: string;
    fields: Record<string, string | boolean | number | null | undefined>;
    fileFields?: Record<string, { name: string; data: string; type: string }>;
    captchaToken?: string;
}

const SHEET_NAME = "Sheet1";
const TIMESTAMP_HEADER = "Timestamp";

// Initialize Resend client (only if API key is available)
const resend = process.env.RESEND_API_KEY
    ? new Resend(process.env.RESEND_API_KEY)
    : null;

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
 * Verify Cloudflare Turnstile CAPTCHA token
 */
async function verifyTurnstileToken(token: string): Promise<boolean> {
    const secretKey = process.env.TURNSTILE_SECRET_KEY;
    if (!secretKey) {
        console.warn("[Turnstile] Secret key not configured, skipping verification");
        return true; // Allow submission if Turnstile is not configured
    }

    try {
        const response = await fetch(
            "https://challenges.cloudflare.com/turnstile/v0/siteverify",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    secret: secretKey,
                    response: token,
                }),
            }
        );

        const data = (await response.json()) as { success?: boolean };
        return data.success === true;
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        console.error("[Turnstile] Verification error:", errorMessage);
        return false;
    }
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

/**
 * Send email notification via Resend
 * Only sends for contact form submissions
 */
async function sendEmailNotification(
    formName: string,
    pageSlug: string | undefined,
    fields: Record<string, string | boolean | number | null | undefined>,
    fileLinks: Record<string, string>
): Promise<void> {
    console.log("[Email] ===== Email notification function called =====");
    console.log("[Email] Input parameters:", {
        formName,
        pageSlug,
        fieldsCount: Object.keys(fields).length,
        fileLinksCount: Object.keys(fileLinks).length,
    });

    // Only send emails for contact form (check pageSlug first, then form name as fallback)
    const pageSlugLower = pageSlug?.toLowerCase();
    const formNameLower = formName.toLowerCase();
    const isContactForm =
        pageSlugLower === "contact" || formNameLower.includes("contact");


    if (!isContactForm) {
        console.log("[Email] ⏭️  Not a contact form, skipping email notification");
        return;
    }

    // Skip if Resend is not configured
    console.log("[Email] Checking Resend configuration:", {
        resendClientExists: !!resend,
        hasApiKey: !!process.env.RESEND_API_KEY,
        apiKeyLength: process.env.RESEND_API_KEY?.length || 0,
    });

    if (!resend || !process.env.RESEND_API_KEY) {

        return;
    }

    console.log("[Email] ✅ Resend is configured, proceeding with email preparation");

    // Build email body
    const fieldLines = Object.entries(fields)
        .map(([key, value]) => {
            if (value === null || value === undefined) {
                return `${key}: (empty)`;
            }
            if (typeof value === "boolean") {
                return `${key}: ${value ? "Yes" : "No"}`;
            }
            return `${key}: ${String(value)}`;
        })
        .filter((line) => line.trim() !== "");

    const fileLines = Object.entries(fileLinks).map(
        ([key, url]) => `${key} (file): ${url}`
    );

    const emailBody = [
        `Form: ${formName}`,
        `Submitted: ${new Date().toISOString()}`,
        "",
        "--- Form Fields ---",
        ...fieldLines,
        ...(fileLines.length > 0 ? ["", "--- File Uploads ---", ...fileLines] : []),
    ].join("\n");

    console.log("[Email] Email body constructed:", {
        bodyLength: emailBody.length,
        fieldLinesCount: fieldLines.length,
        fileLinesCount: fileLines.length,
        bodyPreview: emailBody.substring(0, 200) + "...",
    });

    // Get sender email from env or use default
    const fromEmail =
        process.env.RESEND_FROM_EMAIL || "noreply@notifications.invaritech.ai";
    const toEmail = process.env.RESEND_TO_EMAIL || "community@biznetvigator.com";

    const emailPayload = {
        from: fromEmail,
        to: toEmail,
        replyTo: toEmail,
        subject: `New form submission: ${formName}`,
        text: emailBody,
    };

    try {
        await resend.emails.send(emailPayload);
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        console.error(`[Email] Failed to send notification: ${errorMessage}`);

        // Don't throw - email failure shouldn't break form submission
    }
    
    console.log("[Email] ===== Email notification function completed =====");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== "POST") {
        console.log("[Submit Form] ❌ Invalid method:", req.method);
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const {
            formName,
            pageSlug,
            googleSheetUrl,
            fields,
            fileFields,
            captchaToken,
        } = req.body as FormSubmissionPayload;

        console.log("[Submit Form] Request payload received:", {
            formName,
            pageSlug,
            hasGoogleSheetUrl: !!googleSheetUrl,
            fieldsCount: fields ? Object.keys(fields).length : 0,
            fileFieldsCount: fileFields ? Object.keys(fileFields).length : 0,
            hasCaptchaToken: !!captchaToken,
        });

        // Validate required fields
        if (!formName || !googleSheetUrl || !fields) {
            return res.status(400).json({
                error: "Missing required fields: formName, googleSheetUrl, and fields",
            });
        }

        // Verify CAPTCHA token if provided
        if (captchaToken) {
            const isValid = await verifyTurnstileToken(captchaToken);
            if (!isValid) {
                console.warn(
                    `[Submit Form] ❌ CAPTCHA verification failed for form: ${formName}`
                );
                return res.status(400).json({
                    error: "CAPTCHA verification failed. Please try again.",
                });
            }
        } else if (process.env.TURNSTILE_SECRET_KEY) {
            // If Turnstile is configured but no token provided, reject
            console.warn(
                `[Submit Form] ❌ Missing CAPTCHA token for form: ${formName}`
            );
            return res.status(400).json({
                error: "Security verification required. Please complete the CAPTCHA.",
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

        // Send email notification (only for contact form)
        // Await to ensure Vercel waits for completion, but don't fail on error
        await sendEmailNotification(formName, pageSlug, fields, fileLinks);

        return res.status(200).json({
            success: true,
            message: "Form submitted successfully",
        });
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Failed to submit form";
        console.error(`[Submit Form] Error: ${errorMessage}`);

        return res.status(500).json({
            error: errorMessage,
        });
    }
}
