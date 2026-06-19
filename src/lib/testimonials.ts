// Testimonials validation and helper functions

export interface TestimonialInput {
  quote: string;
  author: string;
  company?: string;
  logo?: string;
  projectId?: number;
  order?: number;
  featured?: boolean;
}

export interface TestimonialData extends TestimonialInput {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Validates testimonial input data
 * @param data - Input data to validate
 * @returns Object with isValid boolean and errors array
 */
export function validateTestimonial(data: any) {
  const errors: string[] = [];

  // Check required fields
  if (!data.quote || typeof data.quote !== "string" || data.quote.trim().length === 0) {
    errors.push("Quote is required and must be a non-empty string");
  } else if (data.quote.trim().length < 10) {
    errors.push("Quote must be at least 10 characters long");
  } else if (data.quote.trim().length > 1000) {
    errors.push("Quote must not exceed 1000 characters");
  }

  if (!data.author || typeof data.author !== "string" || data.author.trim().length === 0) {
    errors.push("Author is required and must be a non-empty string");
  } else if (data.author.trim().length < 2) {
    errors.push("Author name must be at least 2 characters long");
  } else if (data.author.trim().length > 100) {
    errors.push("Author name must not exceed 100 characters");
  }

  // Check optional fields
  if (data.company !== undefined && data.company !== null) {
    if (typeof data.company !== "string" || (data.company.trim().length > 0 && data.company.trim().length < 2)) {
      errors.push("Company name must be at least 2 characters long if provided");
    } else if (data.company.trim().length > 100) {
      errors.push("Company name must not exceed 100 characters");
    }
  }

  if (data.logo !== undefined && data.logo !== null) {
    if (typeof data.logo !== "string" || (data.logo.trim().length > 0 && !isValidFilePath(data.logo))) {
      errors.push("Logo must be a valid file path");
    }
  }

  if (data.projectId !== undefined && data.projectId !== null) {
    if (!Number.isInteger(data.projectId) || data.projectId <= 0) {
      errors.push("Project ID must be a positive integer");
    }
  }

  if (data.order !== undefined && data.order !== null) {
    if (!Number.isInteger(data.order) || data.order < 0) {
      errors.push("Order must be a non-negative integer");
    }
  }

  if (data.featured !== undefined && data.featured !== null) {
    if (typeof data.featured !== "boolean") {
      errors.push("Featured must be a boolean");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Checks if a string is a valid file path
 */
function isValidFilePath(path: string): boolean {
  // Basic check for common file path patterns
  return /^[\w\-./]+\.[\w]+$/.test(path);
}

/**
 * Sanitizes testimonial data for storage
 */
export function sanitizeTestimonial(data: any): TestimonialInput {
  return {
    quote: (data.quote || "").trim(),
    author: (data.author || "").trim(),
    company: data.company ? data.company.trim() || null : null,
    logo: data.logo ? data.logo.trim() || null : null,
    projectId: data.projectId ? parseInt(data.projectId) : undefined,
    order: data.order ? parseInt(data.order) : 0,
    featured: typeof data.featured === "boolean" ? data.featured : false,
  };
}

/**
 * Handles partial updates for testimonials
 */
export function applyPartialUpdate(
  existing: any,
  updates: any
): TestimonialInput {
  const result: any = { ...existing };

  // Only update fields that are provided
  if (updates.quote !== undefined) {
    result.quote = updates.quote;
  }
  if (updates.author !== undefined) {
    result.author = updates.author;
  }
  if (updates.company !== undefined) {
    result.company = updates.company;
  }
  if (updates.logo !== undefined) {
    result.logo = updates.logo;
  }
  if (updates.projectId !== undefined) {
    result.projectId = updates.projectId;
  }
  if (updates.order !== undefined) {
    result.order = updates.order;
  }
  if (updates.featured !== undefined) {
    result.featured = updates.featured;
  }

  return result;
}
