"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Role = "SUPER_ADMIN" | "DRIVER" | "EMERGENCY_TEAM";
export type VehicleType = "CAR" | "BIKE";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: Role;
  vehicleType: VehicleType;
  phone: string;
  createdAt: string;
}

interface AuthContextType {
  user: UserProfile | null;
  role: Role | null;
  loading: boolean;
  login: (email: string, role: Role) => Promise<boolean>;
  signup: (name: string, email: string, phone: string, role: Role, vehicleType: VehicleType) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: Role) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const MOCK_USERS: Record<Role, UserProfile> = {
  SUPER_ADMIN: {
    id: "admin-123",
    name: "Command Director Marcus",
    email: "admin@roadsos.com",
    role: "SUPER_ADMIN",
    vehicleType: "CAR",
    phone: "+1 (555) 911-0001",
    createdAt: "2026-05-30T10:00:00Z",
  },
  DRIVER: {
    id: "driver-456",
    name: "Sarah Jenkins",
    email: "driver@roadsos.com",
    role: "DRIVER",
    vehicleType: "CAR",
    phone: "+1 (555) 732-8924",
    createdAt: "2026-05-30T11:30:00Z",
  },
  EMERGENCY_TEAM: {
    id: "responder-789",
    name: "Rescue Team Alpha (Medic-14)",
    email: "responder@roadsos.com",
    role: "EMERGENCY_TEAM",
    vehicleType: "CAR",
    phone: "+1 (555) 911-0114",
    createdAt: "2026-05-30T12:00:00Z",
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session from localStorage if available
    const savedUser = localStorage.getItem("roadsos_user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser) as UserProfile;
        setUser(parsed);
        setRole(parsed.role);
      } catch (e) {
        console.error("Error loading user session", e);
      }
    } else {
      setUser(null);
      setRole(null);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, selectedRole: Role): Promise<boolean> => {
    setLoading(true);
    // Simulating Firebase auth latency
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Resolve user based on selectedRole or email template
    const templateProfile = MOCK_USERS[selectedRole];
    const userProfile: UserProfile = {
      ...templateProfile,
      email: email || templateProfile.email,
    };

    setUser(userProfile);
    setRole(selectedRole);
    localStorage.setItem("roadsos_user", JSON.stringify(userProfile));
    setLoading(false);
    return true;
  };

  const signup = async (
    name: string,
    email: string,
    phone: string,
    selectedRole: Role,
    vehicleType: VehicleType
  ): Promise<boolean> => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newUser: UserProfile = {
      id: `usr-${Math.random().toString(36).substr(2, 9)}`,
      name,
      email,
      role: selectedRole,
      vehicleType,
      phone,
      createdAt: new Date().toISOString(),
    };

    setUser(newUser);
    setRole(selectedRole);
    localStorage.setItem("roadsos_user", JSON.stringify(newUser));
    setLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem("roadsos_user");
  };

  const switchRole = (newRole: Role) => {
    if (!user) return;
    const updatedUser = {
      ...user,
      name: MOCK_USERS[newRole].name,
      email: MOCK_USERS[newRole].email,
      role: newRole,
    };
    setUser(updatedUser);
    setRole(newRole);
    localStorage.setItem("roadsos_user", JSON.stringify(updatedUser));
  };

  const updateProfile = (profile: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...profile };
    setUser(updated);
    if (profile.role) setRole(profile.role);
    localStorage.setItem("roadsos_user", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        login,
        signup,
        logout,
        switchRole,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
