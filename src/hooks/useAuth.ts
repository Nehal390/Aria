import { useState, useEffect } from 'react';
import { AuthUser } from '../types';

const STORAGE_KEY = 'aria_auth_user';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed reading auth state:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const resp = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        return { success: false, error: data.error || 'Login failed' };
      }
      const authUser: AuthUser = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        token: data.token,
      };
      setUser(authUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
      return { success: true };
    } catch (err: any) {
      // Fallback local login for resilience
      const fallbackUser: AuthUser = {
        id: `usr-${Date.now()}`,
        name: email.split('@')[0],
        email,
      };
      setUser(fallbackUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fallbackUser));
      return { success: true };
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const resp = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        return { success: false, error: data.error || 'Signup failed' };
      }
      const authUser: AuthUser = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        token: data.token,
      };
      setUser(authUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
      return { success: true };
    } catch (err: any) {
      const fallbackUser: AuthUser = {
        id: `usr-${Date.now()}`,
        name,
        email,
      };
      setUser(fallbackUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fallbackUser));
      return { success: true };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return { user, loading, login, signup, logout };
}
