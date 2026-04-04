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
 * 检查用户是否有「旧版」管理员身份（仅看 profiles.role，不替代 RBAC）
 * 注意：菜单、接口权限应以 role_permissions 为准；勿再把「有 role_id」当作管理员。
 */
export function isAdmin(profile: Profile | null): boolean {
  if (!profile) return false;
  return profile.role === 'super_admin' || profile.role === 'manager';
}

/**
 * 检查用户是否是超级管理员
 */
export function isSuperAdmin(profile: Profile | null): boolean {
  if (!profile) return false;
  return profile.role === 'super_admin';
}
