import { useAuthMe } from "./useAuth";

export function usePermissions() {
  const { data: user } = useAuthMe();
  const permissions = new Set(user?.permissions);

  return {
    ...permissions,
    // check a single permission
    can: (permission: string) => permissions.has(permission),
    canAny: (...perms: string[]) => perms.some((p) => permissions.has(p)),
    canAll: (...perms: string[]) => perms.every((p) => permissions.has(p)),
  };
}
