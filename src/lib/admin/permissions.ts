export type UserRole = 'administrator' | 'editor' | 'viewer';

const PERMISSIONS: Record<UserRole, Set<string>> = {
  administrator: new Set(['create', 'edit', 'delete', 'publish', 'manage_roles']),
  editor: new Set(['create', 'edit', 'delete', 'publish']),
  viewer: new Set(['view']),
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
