import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import type { SanityFormBuilder, SanityFormField } from "@/lib/sanity.types";
import { validateFile, fileToBase64, MAX_FILE_SIZE } from "@/lib/fileValidation";
import { Upload, X, FileText } from "lucide-react";
import { Turnstile } from "@/components/Turnstile";

interface DynamicFormProps {
  formConfig: SanityFormBuilder;
  inline?: boolean;
}

export const DynamicForm = ({ formConfig, inline = false }: DynamicFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File>>({});
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState(false);

  // Get Turnstile site key from environment
  const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

  // Validate and filter fields
  const validFieldTypes: SanityFormField["fieldType"][] = ["text", "textarea", "boolean", "upload"];
  const validFields = (formConfig.fields || []).filter((field) => {
    if (!field.fieldName) {
      return false;
    }
    if (!validFieldTypes.includes(field.fieldType)) {
      return false;
    }
    return true;
  });

  // Build Zod schema dynamically based on form fields
  const buildSchema = () => {
    const schemaFields: Record<string, z.ZodTypeAny> = {};

    validFields.forEach((field) => {
      let fieldSchema: z.ZodTypeAny;

      switch (field.fieldType) {
        case "text":
          fieldSchema = z.string();
          break;
        case "textarea":
          fieldSchema = z.string();
          break;
        case "boolean":
          fieldSchema = z.boolean().default(false);
          break;
        case "upload":
          fieldSchema = z.instanceof(File).optional();
          break;
        default:
          fieldSchema = z.string();
      }

      if (field.required && field.fieldType !== "upload") {
        fieldSchema = fieldSchema.refine((val) => {
          if (field.fieldType === "boolean") {
            return val === true;
          }
          return val !== undefined && val !== null && val !== "";
        }, `${field.fieldName} is required`);
      }

      // For upload fields, we handle validation separately
      if (field.fieldType === "upload" && field.required) {
        fieldSchema = z.instanceof(File, {
          message: `${field.fieldName} is required`,
        });
      }

      schemaFields[field.fieldName] = fieldSchema;
    });

    return z.object(schemaFields);
  };

  const form = useForm({
    resolver: zodResolver(buildSchema()),
    defaultValues: validFields.reduce((acc, field) => {
      if (field.fieldType === "boolean") {
        acc[field.fieldName] = false;
      } else if (field.fieldType === "upload") {
        acc[field.fieldName] = undefined;
      } else {
        acc[field.fieldName] = "";
      }
      return acc;
    }, {} as Record<string, any>),
  });

  const handleFileChange = (
    fieldName: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = validateFile(file);
    if (!validation.valid) {
      toast({
        title: "File validation error",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    setUploadedFiles((prev) => ({ ...prev, [fieldName]: file }));
    form.setValue(fieldName, file);
  };

  const removeFile = (fieldName: string) => {
    setUploadedFiles((prev) => {
      const newFiles = { ...prev };
      delete newFiles[fieldName];
      return newFiles;
    });
    form.setValue(fieldName, undefined);
    // Reset file input
    const fileInput = document.getElementById(fieldName) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const onSubmit = async (data: Record<string, any>) => {
    // Validate CAPTCHA if enabled
    if (turnstileSiteKey && !captchaToken) {
      setCaptchaError(true);
      toast({
        title: "Verification required",
        description: "Please complete the security verification.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setCaptchaError(false);

    try {
      // Process file uploads - convert to base64
      const formData: Record<string, any> = { ...data };
      const fileFields: Record<string, { name: string; data: string; type: string }> = {};

      for (const [key, value] of Object.entries(data)) {
        if (value instanceof File) {
          const base64 = await fileToBase64(value);
          fileFields[key] = {
            name: value.name,
            data: base64,
            type: value.type,
          };
          // Remove file from formData, we'll send it separately
          delete formData[key];
        }
      }

      const payload = {
        formName: formConfig.formName,
        pageSlug: formConfig.pageSlug,
        googleSheetUrl: formConfig.googleSheetUrl,
        fields: formData,
        fileFields: Object.keys(fileFields).length > 0 ? fileFields : undefined,
        captchaToken: captchaToken || undefined,
      };

      const response = await fetch("/api/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || "Failed to submit form");
      }

      toast({
        title: "Form submitted successfully",
        description: "Thank you for your submission. We'll be in touch soon.",
      });

      // Reset form
      form.reset();
      setUploadedFiles({});
      setCaptchaToken(null);
    } catch (error) {
      toast({
        title: "Submission failed",
        description: error instanceof Error ? error.message : "An error occurred. Please try again.",
        variant: "destructive",
      });
      // Reset CAPTCHA on error so user can try again
      setCaptchaToken(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCaptchaVerify = (token: string) => {
    setCaptchaToken(token);
    setCaptchaError(false);
  };

  const handleCaptchaError = () => {
    setCaptchaToken(null);
    setCaptchaError(true);
  };

  // Sort fields by order (handle null orders by treating them as high numbers)
  // Secondary sort by fieldName for deterministic ordering when orders are equal
  const sortedFields = [...validFields].sort((a, b) => {
    const orderA = a.order ?? 999;
    const orderB = b.order ?? 999;
    if (orderA !== orderB) {
      return orderA - orderB;
    }
    // If orders are equal (including both null), sort alphabetically by fieldName
    return (a.fieldName || "").localeCompare(b.fieldName || "");
  });

  // If no valid fields, show a message
  if (sortedFields.length === 0) {
    const EmptyState = (
      <div className="text-center p-8 border rounded-md bg-muted">
        <p className="text-muted-foreground">
          No valid form fields found. Please check the form configuration.
        </p>
      </div>
    );

    if (inline) {
      return EmptyState;
    }

    return (
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {EmptyState}
          </div>
        </div>
      </section>
    );
  }

  const formContent = (
    <>
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{formConfig.formName}</h2>
        {formConfig.formDescription && (
          <p className="text-lg text-muted-foreground">{formConfig.formDescription}</p>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {sortedFields.map((field) => (
            <FormField
              key={field.fieldName}
              control={form.control}
              name={field.fieldName}
              render={({ field: formField }) => (
                <FormItem>
                  <FormLabel>
                    {field.fieldName}
                    {field.required && <span className="text-destructive ml-1">*</span>}
                  </FormLabel>
                  {field.fieldType === "upload" ? (
                    // Upload fields don't use FormControl (file inputs are uncontrolled)
                    <div className="space-y-2">
                      {uploadedFiles[field.fieldName] ? (
                        <div className="flex items-center justify-between p-3 border rounded-md bg-muted">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">
                                {uploadedFiles[field.fieldName].name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatFileSize(uploadedFiles[field.fieldName].size)}
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFile(field.fieldName)}
                            disabled={isSubmitting}
                            className="h-8 w-8"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Label
                              htmlFor={field.fieldName}
                              className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-accent transition-colors"
                            >
                              <Upload className="h-4 w-4" />
                              <span>Choose file</span>
                            </Label>
                            <Input
                              id={field.fieldName}
                              type="file"
                              accept=".docx,.doc,.txt,.pdf"
                              onChange={(e) => handleFileChange(field.fieldName, e)}
                              disabled={isSubmitting}
                              className="hidden"
                            />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Allowed: DOCX, DOC, TXT, PDF (max {MAX_FILE_SIZE / (1024 * 1024)}MB)
                          </p>
                        </div>
                      )}
                    </div>
                  ) : field.fieldType === "boolean" ? (
                    // Boolean fields need a single wrapper div for FormControl
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={formField.value}
                          onCheckedChange={formField.onChange}
                          disabled={isSubmitting}
                        />
                        <Label className="font-normal">
                          {field.placeholder || "I agree"}
                        </Label>
                      </div>
                    </FormControl>
                  ) : field.fieldType === "text" ? (
                    // Text fields use FormControl with Input
                    <FormControl>
                      <Input
                        {...formField}
                        placeholder={field.placeholder || undefined}
                        type="text"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                  ) : field.fieldType === "textarea" ? (
                    // Textarea fields use FormControl with Textarea
                    <FormControl>
                      <Textarea
                        {...formField}
                        placeholder={field.placeholder || undefined}
                        disabled={isSubmitting}
                        className="min-h-[120px]"
                      />
                    </FormControl>
                  ) : (
                    // Fallback for unexpected field types - render text input
                    <FormControl>
                      <Input
                        {...formField}
                        placeholder={field.placeholder || `Unexpected field type: ${field.fieldType}`}
                        type="text"
                        disabled={isSubmitting}
                        className="border-destructive"
                      />
                    </FormControl>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          {/* Cloudflare Turnstile CAPTCHA */}
          {turnstileSiteKey && (
            <div className="space-y-2">
              <Turnstile
                siteKey={turnstileSiteKey}
                onVerify={handleCaptchaVerify}
                onError={handleCaptchaError}
                theme="auto"
                size="normal"
              />
              {captchaError && (
                <p className="text-sm text-destructive">
                  Please complete the security verification to submit the form.
                </p>
              )}
            </div>
          )}

          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting || (turnstileSiteKey && !captchaToken)}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Form>
    </>
  );

  if (inline) {
    return <div>{formContent}</div>;
  }

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {formContent}
        </div>
      </div>
    </section>
  );
};
