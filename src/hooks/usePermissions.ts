import { useState, useEffect } from 'react';
import { supabase } from '@/db/supabase';

/**
 * 权限管理Hook
 * 用于检查当前用户是否拥有特定权限
 */
export function usePermissions() {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPermissions();
  }, []);

  const loadPermissions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setPermissions([]);
        setLoading(false);
        return;
      }

      // 获取用户的角色ID
      const { data: profile } = await supabase
        .from('profiles')
        .select('role_id')
        .eq('id', user.id)
        .maybeSingle();

      const roleId = (profile as any)?.role_id;
      if (!roleId) {
        setPermissions([]);
        setLoading(false);
        return;
      }

      // 获取角色的权限列表
      const { data: rolePermissions } = await supabase
        .from('role_permissions')
        .select('permission_id, permissions!permission_id(code)')
        .eq('role_id', roleId);

      if (rolePermissions && Array.isArray(rolePermissions)) {
        const permissionCodes = rolePermissions
          .map((rp: any) => rp.permissions?.code)
          .filter(Boolean) as string[];
        setPermissions(permissionCodes);
      }

      setLoading(false);
    } catch (error) {
      console.error('加载权限失败:', error);
      setPermissions([]);
      setLoading(false);
    }
  };

  /**
   * 检查是否拥有指定权限
   */
  const hasPermission = (permissionCode: string): boolean => {
    return permissions.includes(permissionCode);
  };

  /**
   * 检查是否拥有任意一个权限
   */
  const hasAnyPermission = (permissionCodes: string[]): boolean => {
    return permissionCodes.some(code => permissions.includes(code));
  };

  /**
   * 检查是否拥有所有权限
   */
  const hasAllPermissions = (permissionCodes: string[]): boolean => {
    return permissionCodes.every(code => permissions.includes(code));
  };

  return {
    permissions,
    loading,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    reload: loadPermissions
  };
}
