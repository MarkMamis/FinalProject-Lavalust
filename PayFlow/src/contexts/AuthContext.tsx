import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id?: number;
  email: string;
  name?: string;
  role?: 'admin' | 'hr' | 'employee';
  employeeId?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // On mount, try to restore session from server
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/me', { credentials: 'include' });
        if (!mounted) return;
        if (res.ok) {
          const data = await res.json();
          setUser(data.user ?? null);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      } catch (err) {
        // network or other error — leave unauthenticated
        setUser(null);
        setIsLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const refreshUser = async (): Promise<void> => {
    try {
      const res = await fetch('/api/me', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user ?? null);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // important: include session cookie
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        return false;
      }
      const data = await res.json();
      if (data && data.user) {
        setUser(data.user);
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await fetch('/api/logout', { method: 'POST', credentials: 'include' });
    } catch (e) {
      // ignore network errors
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshUser, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
