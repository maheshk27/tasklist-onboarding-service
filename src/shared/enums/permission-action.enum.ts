/**
 * Permission actions exposed by the onboarding API.
 *
 * Defined at the API/DTO layer only — the persisted column
 * `mst_permissions.action_type` is a plain varchar so the database schema stays
 * decoupled from this list.
 */
export enum PermissionActionEnum {
  VIEW = 'VIEW',
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}
