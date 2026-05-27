// Role-based permission system for admin dashboard

export type UserRole = 'ADMIN' | 'MANAGER' | 'EDITOR';

export interface Permission {
  dashboard: boolean;
  projects: boolean;
  news: boolean;
  testimonials: boolean;
  users: boolean;
  contact: boolean;
  careers: boolean;
  settings: boolean;
  deleteContent: boolean;
  publishContent: boolean;
  manageUsers: boolean;
}

const permissions: Record<UserRole, Permission> = {
  ADMIN: {
    dashboard: true,
    projects: true,
    news: true,
    testimonials: true,
    users: true,
    contact: true,
    careers: true,
    settings: true,
    deleteContent: true,
    publishContent: true,
    manageUsers: true,
  },
  MANAGER: {
    dashboard: true,
    projects: true,
    news: true,
    testimonials: true,
    users: false,
    contact: true,
    careers: true,
    settings: false,
    deleteContent: true,
    publishContent: true,
    manageUsers: false,
  },
  EDITOR: {
    dashboard: true,
    projects: true,
    news: true,
    testimonials: false,
    users: false,
    contact: false,
    careers: false,
    settings: false,
    deleteContent: false,
    publishContent: false,
    manageUsers: false,
  },
};

export function getPermissions(role: UserRole): Permission {
  return permissions[role] || permissions.EDITOR;
}

export function hasPermission(role: UserRole, permission: keyof Permission): boolean {
  return getPermissions(role)[permission];
}

// Navigation items visibility based on role
export function getVisibleNavItems(role: UserRole) {
  const perms = getPermissions(role);
  return {
    dashboard: perms.dashboard,
    careers: perms.careers,
    projects: perms.projects,
    news: perms.news,
    contact: perms.contact,
    users: perms.users,
    settings: perms.settings,
  };
}

// Role labels for UI
export const roleLabels: Record<UserRole, string> = {
  ADMIN: 'Administrator',
  MANAGER: 'Manager',
  EDITOR: 'Editor',
};

// Role descriptions
export const roleDescriptions: Record<UserRole, string> = {
  ADMIN: 'Full access to all features and settings',
  MANAGER: 'Can manage projects, news, testimonials, and contact submissions',
  EDITOR: 'Can create and edit projects and news articles only',
};
