"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Role = "SUPER_ADMIN" | "DRIVER" | "EMERGENCY_TEAM";
export type VehicleType = "CAR" | "BIKE" | "BOTH";

export interface UserProfile {
  id: string; // uid
  role: Role;
  name: string; // fullName
  email: string;
  phone: string;
  bloodGroup: string;
  vehicleType: VehicleType;
  vehicleNumber: string;
  vehicleBrand: string;
  vehicleModel: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  createdAt: string;
  updatedAt?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  role: Role | null;
  loading: boolean;
  login: (email: string, role: Role) => Promise<boolean>;
  signup: (
    name: string,
    email: string,
    phone: string,
    role: Role,
    vehicleType: VehicleType,
    bloodGroup?: string,
    vehicleNumber?: string,
    vehicleBrand?: string,
    vehicleModel?: string,
    emergencyContact?: { name: string; phone: string; relationship: string }
  ) => Promise<boolean>;
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
    bloodGroup: "O+",
    vehicleNumber: "ADM-911",
    vehicleBrand: "Tesla",
    vehicleModel: "Model S",
    emergencyContact: {
      name: "Marcus Jr.",
      phone: "+1 (555) 911-0002",
      relationship: "Child"
    },
    createdAt: "2026-05-30T10:00:00Z",
  },
  DRIVER: {
    id: "driver-456",
    name: "Sarah Jenkins",
    email: "driver@roadsos.com",
    role: "DRIVER",
    vehicleType: "CAR",
    phone: "+1 (555) 732-8924",
    bloodGroup: "A+",
    vehicleNumber: "DRV-101",
    vehicleBrand: "Toyota",
    vehicleModel: "Supra",
    emergencyContact: {
      name: "David Jenkins",
      phone: "+1 (555) 732-4412",
      relationship: "Spouse"
    },
    createdAt: "2026-05-30T11:30:00Z",
  },
  EMERGENCY_TEAM: {
    id: "responder-789",
    name: "Rescue Team Alpha (Medic-14)",
    email: "responder@roadsos.com",
    role: "EMERGENCY_TEAM",
    vehicleType: "CAR",
    phone: "+1 (555) 911-0114",
    bloodGroup: "B+",
    vehicleNumber: "MED-014",
    vehicleBrand: "Ford",
    vehicleModel: "F-350 Ambulance",
    emergencyContact: {
      name: "EOC Operations Control",
      phone: "+1 (555) 911-0800",
      relationship: "Agency Support"
    },
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
    vehicleType: VehicleType,
    bloodGroup?: string,
    vehicleNumber?: string,
    vehicleBrand?: string,
    vehicleModel?: string,
    emergencyContact?: { name: string; phone: string; relationship: string }
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
      bloodGroup: bloodGroup || "O+",
      vehicleNumber: vehicleNumber || "MOCK-123",
      vehicleBrand: vehicleBrand || "Generic",
      vehicleModel: vehicleModel || "Standard",
      emergencyContact: emergencyContact || {
        name: "Default Contact",
        phone: "+1 (555) 000-0000",
        relationship: "Family"
      },
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
