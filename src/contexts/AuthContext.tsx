import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { supabase } from '@/db/supabase';
import type { Session, User } from '@supabase/supabase-js';
import type { Profile } from '@/types/types';

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      role_name:roles!role_id(name)
    `)
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('获取用户信息失败:', error);
    return null;
  }
  
  if (!data) return null;
  
  // 处理join的数据结构
  const result = data as any;
  if (result.role_name && typeof result.role_name === 'object') {
    result.role_name = result.role_name.name;
  }
  
  return result as Profile;
}
interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signInWithUsername: (username: string, password: string) => Promise<{ error: Error | null }>;
  signUpWithUsername: (username: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  /** 切换登录用户时先清空 profile，避免 JWT 已是新人但 context 仍短暂保留旧人资料（菜单权限串台） */
  const authUserIdRef = useRef<string | null>(null);

  const refreshProfile = async () => {
    if (!user) {
      setProfile(null);
      return;
    }

    const profileData = await getProfile(user.id);
    setProfile(profileData);
  };

  useEffect(() => {
    const applySession = (session: Session | null) => {
      const newId = session?.user?.id ?? null;
      setUser(session?.user ?? null);
      if (!session?.user) {
        authUserIdRef.current = null;
        setProfile(null);
        return;
      }
      if (authUserIdRef.current !== newId) {
        authUserIdRef.current = newId;
        setProfile(null);
      }
      getProfile(session.user.id).then(setProfile);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      applySession(session);
      setLoading(false);
    });
    // In this function, do NOT use any await calls. Use `.then()` instead to avoid deadlocks.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      applySession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithUsername = async (username: string, password: string) => {
    try {
      // 清理username，移除空格和特殊字符
      const cleanUsername = username.trim().replace(/\s+/g, '');
      
      // 使用与createUser相同的编码逻辑
      const encodedUsername = encodeURIComponent(cleanUsername);
      // Supabase会将email转换为小写，所以这里也转换为小写
      const email = `${encodedUsername}@jiutouniao.local`.toLowerCase();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      console.error('[DEBUG_AUTH] signIn error:', error);
      if (error) throw error;
      
      // 检查用户是否被暂停
      if (data.user) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('is_active')
          .eq('id', data.user.id)
          .maybeSingle();
        
        if (profileError) {
          console.error('获取用户状态失败:', profileError);
        } else if (profileData && !(profileData as { is_active: boolean }).is_active) {
          // 用户被暂停，退出登录
          await supabase.auth.signOut();
          throw new Error('该账号已被暂停，请联系管理员');
        }
      }
      
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUpWithUsername = async (username: string, password: string) => {
    try {
      // 清理username，移除空格和特殊字符
      const cleanUsername = username.trim().replace(/\s+/g, '');
      
      // 使用与createUser相同的编码逻辑
      const encodedUsername = encodeURIComponent(cleanUsername);
      // Supabase会将email转换为小写，所以这里也转换为小写
      const email = `${encodedUsername}@jiutouniao.local`.toLowerCase();
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signInWithUsername, signUpWithUsername, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
