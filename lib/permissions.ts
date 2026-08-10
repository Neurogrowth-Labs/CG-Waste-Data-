import { View } from '../types';

export type PlatformRole = 'admin' | 'executive' | 'regulator' | 'site_manager' | 'transporter' | 'recycler' | 'investor' | 'auditor' | 'manager';

export type Permission =
  | 'dashboard.read'
  | 'projects.read'
  | 'projects.write'
  | 'field_ops.use'
  | 'manifests.read'
  | 'manifests.create'
  | 'manifests.transport_update'
  | 'manifests.verify_receipt'
  | 'compliance.review'
  | 'marketplace.use'
  | 'education.read'
  | 'settings.manage_self'
  | 'kyc.review';

const ROLE_PERMISSIONS: Record<PlatformRole, Permission[]> = {
  admin: ['dashboard.read', 'projects.read', 'projects.write', 'field_ops.use', 'manifests.read', 'manifests.create', 'manifests.transport_update', 'manifests.verify_receipt', 'compliance.review', 'marketplace.use', 'education.read', 'settings.manage_self', 'kyc.review'],
  executive: ['dashboard.read', 'projects.read', 'manifests.read', 'compliance.review', 'education.read', 'settings.manage_self'],
  regulator: ['dashboard.read', 'projects.read', 'manifests.read', 'compliance.review', 'education.read', 'settings.manage_self', 'kyc.review'],
  site_manager: ['dashboard.read', 'projects.read', 'projects.write', 'field_ops.use', 'manifests.read', 'manifests.create', 'marketplace.use', 'education.read', 'settings.manage_self'],
  transporter: ['dashboard.read', 'field_ops.use', 'manifests.read', 'manifests.transport_update', 'education.read', 'settings.manage_self'],
  recycler: ['dashboard.read', 'manifests.read', 'manifests.verify_receipt', 'marketplace.use', 'education.read', 'settings.manage_self'],
  investor: ['dashboard.read', 'projects.read', 'marketplace.use', 'education.read', 'settings.manage_self'],
  auditor: ['dashboard.read', 'projects.read', 'manifests.read', 'compliance.review', 'education.read', 'settings.manage_self', 'kyc.review'],
  manager: ['dashboard.read', 'projects.read', 'projects.write', 'field_ops.use', 'manifests.read', 'manifests.create', 'compliance.review', 'marketplace.use', 'education.read', 'settings.manage_self', 'kyc.review']
};

const VIEW_PERMISSIONS: Partial<Record<View, Permission>> = {
  [View.DASHBOARD]: 'dashboard.read',
  [View.FIELD_OPS]: 'field_ops.use',
  [View.PROJECTS]: 'projects.read',
  [View.TRACKING]: 'manifests.read',
  [View.COMPLIANCE]: 'compliance.review',
  [View.MARKETPLACE]: 'marketplace.use',
  [View.EDUCATION]: 'education.read',
  [View.SETTINGS]: 'settings.manage_self',
  [View.KYC_SECURITY]: 'kyc.review'
};

export const normalizeRole = (role?: string): PlatformRole => {
  const normalized = (role || 'manager').toLowerCase().replace(/\s+/g, '_') as PlatformRole;
  return normalized in ROLE_PERMISSIONS ? normalized : 'manager';
};

export const hasPermission = (role: string | undefined, permission: Permission): boolean => {
  return ROLE_PERMISSIONS[normalizeRole(role)].includes(permission);
};

export const canAccessView = (role: string | undefined, view: View): boolean => {
  const requiredPermission = VIEW_PERMISSIONS[view];
  return requiredPermission ? hasPermission(role, requiredPermission) : hasPermission(role, 'dashboard.read');
};
