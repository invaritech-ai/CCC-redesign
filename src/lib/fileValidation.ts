/**
 * File validation utilities for form uploads
 */

export const ALLOWED_FILE_TYPES = [".docx", ".doc", ".txt", ".pdf"];
export const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates file type
 */
export const validateFileType = (file: File): FileValidationResult => {
  const fileName = file.name.toLowerCase();
  const hasValidExtension = ALLOWED_FILE_TYPES.some((ext) =>
    fileName.endsWith(ext)
  );

  if (!hasValidExtension) {
    return {
      valid: false,
      error: `File type not allowed. Allowed types: ${ALLOWED_FILE_TYPES.join(", ")}`,
    };
  }

  return { valid: true };
};

/**
 * Validates file size
 */
export const validateFileSize = (file: File): FileValidationResult => {
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`,
    };
  }

  return { valid: true };
};

/**
 * Validates both file type and size
 */
export const validateFile = (file: File): FileValidationResult => {
  const typeValidation = validateFileType(file);
  if (!typeValidation.valid) {
    return typeValidation;
  }

  const sizeValidation = validateFileSize(file);
  if (!sizeValidation.valid) {
    return sizeValidation;
  }

  return { valid: true };
};

/**
 * Converts file to base64 string
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix (e.g., "data:application/pdf;base64,")
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

