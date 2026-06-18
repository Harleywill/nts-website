// Accreditations validation and helper functions

export interface AccreditationInput {
  label: string;
  order?: number;
}

export interface AccreditationData extends AccreditationInput {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Validates accreditation input data
 * @param data - Input data to validate
 * @returns Object with isValid boolean and errors array
 */
export function validateAccreditation(data: any) {
  const errors: string[] = [];

  // Check required fields
  if (!data.label || typeof data.label !== "string" || data.label.trim().length === 0) {
    errors.push("Label is required and must be a non-empty string");
  } else if (data.label.trim().length < 2) {
    errors.push("Label must be at least 2 characters long");
  } else if (data.label.trim().length > 100) {
    errors.push("Label must not exceed 100 characters");
  }

  // Check optional fields
  if (data.order !== undefined && data.order !== null) {
    if (!Number.isInteger(data.order) || data.order < 0) {
      errors.push("Order must be a non-negative integer");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Sanitizes accreditation data for storage
 */
export function sanitizeAccreditation(data: any): AccreditationInput {
  return {
    label: (data.label || "").trim(),
    order: data.order ? parseInt(data.order) : 0,
  };
}

/**
 * Handles partial updates for accreditations
 */
export function applyPartialUpdate(
  existing: any,
  updates: any
): AccreditationInput {
  const result: any = { ...existing };

  // Only update fields that are provided
  if (updates.label !== undefined) {
    result.label = updates.label;
  }
  if (updates.order !== undefined) {
    result.order = updates.order;
  }

  return result;
}
