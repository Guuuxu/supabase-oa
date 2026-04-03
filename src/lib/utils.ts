import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Profile } from "@/types/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type Params = Partial<
  Record<keyof URLSearchParams, string | number | null | undefined>
>;

export function createQueryString(
  params: Params,
  searchParams: URLSearchParams
) {
  const newSearchParams = new URLSearchParams(searchParams?.toString());

  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined) {
      newSearchParams.delete(key);
    } else {
      newSearchParams.set(key, String(value));
    }
  }

  return newSearchParams.toString();
}

export function formatDate(
  date: Date | string | number,
  opts: Intl.DateTimeFormatOptions = {}
) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: opts.month ?? "long",
    day: opts.day ?? "numeric",
    year: opts.year ?? "numeric",
    ...opts,
  }).format(new Date(date));
}

/**
 * 检查用户是否有管理员权限
 * 规则：
 * 1. 超级管理员（super_admin）有管理员权限
 * 2. 主管（manager）有管理员权限
 * 3. 有自定义角色（role_id）的用户假设有管理员权限
 */
export function isAdmin(profile: Profile | null): boolean {
  if (!profile) return false;
  
  // 如果有自定义角色，假设有管理员权限
  if (profile.role_id) return true;
  
  // 检查role字段
  return profile.role === 'super_admin' || profile.role === 'manager';
}

/**
 * 检查用户是否是超级管理员
 */
export function isSuperAdmin(profile: Profile | null): boolean {
  if (!profile) return false;
  return profile.role === 'super_admin';
}
