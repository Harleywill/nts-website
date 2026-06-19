export type UserRole = 'administrator' | 'editor' | 'viewer';

const PERMISSIONS: Record<UserRole, Set<string>> = {
  administrator: new Set(['create', 'edit', 'delete', 'publish', 'manage_roles']),
  editor: new Set(['create', 'edit', 'delete', 'publish']),
  viewer: new Set(['view']),
};

const RESOURCE_PERMISSIONS: Record<string, Set<UserRole>> = {
  projects: new Set(['administrator', 'editor']),
  news: new Set(['administrator', 'editor']),
  testimonials: new Set(['administrator', 'editor']),
  users: new Set(['administrator']),
  'contact-submissions': new Set(['administrator', 'editor']),
};

export function can(role: UserRole, action: string): boolean {
  return PERMISSIONS[role]?.has(action) ?? false;
}

export function canEdit(role: UserRole): boolean {
  return can(role, 'edit');
}

export function canDelete(role: UserRole): boolean {
  return can(role, 'delete');
}

export function canCreate(role: UserRole): boolean {
  return can(role, 'create');
}

export function isAdministrator(role: UserRole): boolean {
  return role === 'administrator';
}

/**
 * Check if a user role has permission to manage a specific resource
 * Viewers are always denied write access
 */
export function hasPermission(role: UserRole | string, resource: string): boolean {
  if (role === 'viewer') {
    return false;
  }
  const allowedRoles = RESOURCE_PERMISSIONS[resource];
  if (!allowedRoles) {
    return false;
  }
  return allowedRoles.has(role as UserRole);
}
