import { useState, useEffect } from 'react';
import { supabase } from '@/db/supabase';
import { getCurrentUserPermissions } from '@/db/api';

/**
 * 权限管理Hook（与侧边栏使用同一套 getCurrentUserPermissions）
 */
export function usePermissions() {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPermissions = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setPermissions([]);
          setLoading(false);
          return;
        }
        const codes = await getCurrentUserPermissions();
        setPermissions(codes);
      } catch (error) {
        console.error('加载权限失败:', error);
        setPermissions([]);
      } finally {
        setLoading(false);
      }
    };
    loadPermissions();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      void loadPermissions();
    });
    return () => subscription.unsubscribe();
  }, []);

  const loadPermissions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setPermissions([]);
        setLoading(false);
        return;
      }
      const codes = await getCurrentUserPermissions();
      setPermissions(codes);
    } catch (error) {
      console.error('加载权限失败:', error);
      setPermissions([]);
    } finally {
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
