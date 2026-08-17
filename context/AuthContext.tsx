import React, { createContext, useContext, useState, useEffect } from "react";
import { tokenStorage } from "@/folder/tokenStorage";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "superadmin";
  documentStatus: string;
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isSignedIn: boolean;
  loginWithGoogle: (idToken: string) => Promise<void>;
  loginWithApple: (identityToken: string | null, appleId: string, name: string, email: string, profileImage?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state on app load
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = await tokenStorage.getToken();
        const storedUser = await tokenStorage.getUser();

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(storedUser as User);
        }
      } catch (error) {
        console.error("Auth init error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const loginWithGoogle = async (
    idToken: string
  ): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_URL?.replace("/users", "")}/auth/google`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Google login failed");
      }

      await tokenStorage.setToken(data.token);
      await tokenStorage.setUser(data.user);

      setToken(data.token);
      setUser(data.user);
    } catch (error) {
      console.error("Google login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithApple = async (
    identityToken: string | null,
    appleId: string,
    name: string,
    email: string,
    profileImage?: string
  ): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_URL?.replace("/users", "")}/auth/apple`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identityToken, appleId, name, email, profileImage }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Apple login failed");
      }

      await tokenStorage.setToken(data.token);
      await tokenStorage.setUser(data.user);

      setToken(data.token);
      setUser(data.user);
    } catch (error) {
      console.error("Apple login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await tokenStorage.clear();
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      if (!token) return;

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_URL?.replace("/users", "")}/auth/me`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        await tokenStorage.setUser(data.user);
        setUser(data.user);
      } else {
        // Token expired, logout
        await logout();
      }
    } catch (error) {
      console.error("Refresh user error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isSignedIn: !!token && !!user,
        loginWithGoogle,
        loginWithApple,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
