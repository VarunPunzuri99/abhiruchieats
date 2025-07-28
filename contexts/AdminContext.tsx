import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Admin {
  id: string;
  email: string;
  name: string;
  role: string;
  isDefaultPassword: boolean;
}

interface AdminContextType {
  admin: Admin | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; admin?: Admin }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  console.log('AdminProvider: Component rendered');
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    console.log('AdminContext: Component mounted, checking auth once');
    checkAuth();

    // Cleanup function to log unmount
    return () => {
      console.log('AdminProvider: Component unmounted');
    };
  }, []); // Empty dependency array - only run once on mount

  const checkAuth = async () => {
    if (isChecking) {
      console.log('AdminContext: checkAuth skipped - already checking');
      return; // Prevent multiple calls
    }

    console.log('AdminContext: Starting checkAuth');
    try {
      setIsChecking(true);
      setLoading(true);
      const response = await fetch('/api/admin/auth/me');
      console.log('AdminContext: checkAuth response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        setAdmin(data.data.admin);
        console.log('AdminContext: Admin authenticated:', data.data.admin.email);
      } else {
        setAdmin(null);
        console.log('AdminContext: Admin not authenticated');
      }
    } catch (error) {
      console.log('AdminContext: checkAuth error:', error);
      setAdmin(null);
    } finally {
      setLoading(false);
      setIsChecking(false);
      console.log('AdminContext: checkAuth completed');
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; admin?: Admin }> => {
    if (isChecking) return { success: false }; // Prevent multiple simultaneous login attempts

    try {
      setIsChecking(true);
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setAdmin(data.data.admin);
        return { success: true, admin: data.data.admin };
      } else {
        return { success: false };
      }
    } catch (error) {
      return { success: false };
    } finally {
      setIsChecking(false);
    }
  };

  const logout = async () => {
    try {
      setIsChecking(true);
      await fetch('/api/admin/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAdmin(null);
      setIsChecking(false);
    }
  };

  const value: AdminContextType = {
    admin,
    loading,
    login,
    logout,
    checkAuth,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = (): AdminContextType => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
