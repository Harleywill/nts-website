export type UserRole = 'ADMIN' | 'MANAGER' | 'EDITOR' | 'VIEWER';

const PERMISSIONS: Record<UserRole, Set<string>> = {
  ADMIN: new Set(['create', 'edit', 'delete', 'publish', 'manage_roles']),
  MANAGER: new Set(['create', 'edit', 'delete', 'publish']),
  EDITOR: new Set(['create', 'edit', 'delete', 'publish']),
  VIEWER: new Set(['view']),
};

const RESOURCE_PERMISSIONS: Record<string, Set<UserRole>> = {
  projects: new Set(['ADMIN', 'EDITOR']),
  news: new Set(['ADMIN', 'EDITOR']),
  testimonials: new Set(['ADMIN', 'EDITOR']),
  users: new Set(['ADMIN']),
  'contact-submissions': new Set(['ADMIN', 'EDITOR']),
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
  return role === 'ADMIN';
}

/**
 * Check if a user role has permission to manage a specific resource
 * Viewers are always denied write access
 */
export function hasPermission(role: UserRole | string, resource: string): boolean {
  if (role === 'VIEWER') {
    return false;
  }
  const allowedRoles = RESOURCE_PERMISSIONS[resource];
  if (!allowedRoles) {
    return false;
  }
  return allowedRoles.has(role as UserRole);
}
