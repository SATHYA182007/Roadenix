"use client";

import React, { useState, useEffect } from "react";
import { useAuth, Role, VehicleType } from "@/context/AuthContext";
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Heart, 
  Car, 
  Compass, 
  Layers, 
  Lock, 
  CheckCircle2, 
  Edit3, 
  Save, 
  X, 
  LogOut, 
  Database,
  Eye,
  EyeOff
} from "lucide-react";

export default function UserSettings() {
  const { user, updateProfile, logout } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  
  // Local state variables for form inputs
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  
  // Emergency details
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [emergencyRelationship, setEmergencyRelationship] = useState("Spouse");
  const [bloodGroup, setBloodGroup] = useState("O+");
  
  // Vehicle specs
  const [vehicleType, setVehicleType] = useState<VehicleType>("CAR");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleBrand, setVehicleBrand] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");

  // Account specs
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Sync state with user profile context values on mount or user updates
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setEmail(user.email || "");
      setEmergencyName(user.emergencyContact?.name || "");
      setEmergencyPhone(user.emergencyContact?.phone || "");
      setEmergencyRelationship(user.emergencyContact?.relationship || "Spouse");
      setBloodGroup(user.bloodGroup || "O+");
      setVehicleType(user.vehicleType || "CAR");
      setVehicleNumber(user.vehicleNumber || "");
      setVehicleBrand(user.vehicleBrand || "");
      setVehicleModel(user.vehicleModel || "");
    }
  }, [user, isEditing]);

  if (!user) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // Trigger context profile updates
    updateProfile({
      name,
      phone,
      email,
      bloodGroup,
      vehicleType,
      vehicleNumber,
      vehicleBrand,
      vehicleModel,
      emergencyContact: {
        name: emergencyName,
        phone: emergencyPhone,
        relationship: emergencyRelationship
      }
    });

    setIsEditing(false);
    setShowBanner(true);
    
    // Auto-clear success banner after 3 seconds
    setTimeout(() => {
      setShowBanner(false);
    }, 3000);
  };

  const handleResetEcosystem = () => {
    if (typeof window !== "undefined") {
      const confirmReset = window.confirm("Are you sure you want to reset the ecosystem databases? This will clear all localStorage profiles and restore default mock profiles.");
      if (confirmReset) {
        localStorage.clear();
        alert("Ecosystem Database Reset Completed! Reloading telemetry feeds...");
        window.location.reload();
      }
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Banner Alert (Micro-Animation) */}
      {showBanner && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.15)] flex items-center justify-between text-brand-success text-xs font-bold animate-fadeIn">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 animate-bounce shrink-0" />
            <span>Profile and telemetry parameters synchronized successfully! Active logs updated.</span>
          </div>
          <button onClick={() => setShowBanner(false)} className="text-emerald-600 hover:text-emerald-800 transition-colors p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Profile Card Main Container */}
      <div className="glass-card p-6 bg-white border border-slate-200/60 shadow-xl relative overflow-hidden space-y-6">
        
        {/* Decorative dynamic glows */}
        <div className="absolute -top-24 -right-24 w-48 h-48 radial-glow opacity-30 pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 radial-glow opacity-30 pointer-events-none" />

        {/* Section Header Controls */}
        <div className="z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 gap-4 shrink-0">
          <div>
            <h3 className="text-base font-black text-brand-navy tracking-tight">Ecosystem Profile Configurations</h3>
            <p className="text-xs text-text-secondary mt-0.5">Manage live emergency credentials, vehicle telemetry targets, and accounts.</p>
          </div>

          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 rounded-xl text-xs font-extrabold bg-brand-navy hover:bg-slate-800 text-white shadow-md active:scale-95 transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Settings</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 text-text-secondary hover:bg-slate-50 active:scale-95 transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Cancel</span>
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-2 rounded-xl text-xs font-extrabold bg-brand-primary hover:bg-brand-light text-white shadow-md active:scale-95 transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Grid split */}
        <form onSubmit={handleSave} className="space-y-6 z-10 relative">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* COLUMN 1: Profile & Credentials */}
            <div className="space-y-4 bg-slate-50/50 border border-slate-100 p-4.5 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 border-b border-slate-100 pb-2.5 mb-3.5">
                  <User className="w-4 h-4 text-brand-primary shrink-0" />
                  <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Profile Credentials</h4>
                </div>

                <div className="space-y-3">
                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-brand-primary text-xs bg-white font-semibold text-brand-navy"
                        required
                      />
                    ) : (
                      <p className="text-xs font-bold text-brand-navy">{name || "Not Specified"}</p>
                    )}
                  </div>

                  {/* Registered Email */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Email Address</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-brand-primary text-xs bg-white font-semibold text-brand-navy"
                        required
                      />
                    ) : (
                      <p className="text-xs font-bold text-brand-navy">{email || "Not Specified"}</p>
                    )}
                  </div>

                  {/* Registered Phone */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Phone Number</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-brand-primary text-xs bg-white font-semibold text-brand-navy"
                        required
                      />
                    ) : (
                      <p className="text-xs font-bold text-brand-navy">{phone || "Not Specified"}</p>
                    )}
                  </div>

                  {/* Registered Role Badge */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Security Access Role</label>
                    <span className="inline-flex px-2 py-0.5 rounded-md text-[9px] font-black tracking-wider uppercase border border-slate-200 text-brand-primary bg-white shadow-sm">
                      {user.role.replace("_", " ")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMN 2: Emergency Profile Vitals */}
            <div className="space-y-4 bg-slate-50/50 border border-slate-100 p-4.5 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 border-b border-slate-100 pb-2.5 mb-3.5">
                  <Heart className="w-4 h-4 text-brand-emergency shrink-0 animate-pulse" />
                  <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Emergency Vitals</h4>
                </div>

                <div className="space-y-3">
                  {/* Blood Group */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Blood Group</label>
                    {isEditing ? (
                      <select
                        value={bloodGroup}
                        onChange={(e) => setBloodGroup(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-brand-primary text-xs bg-white font-bold text-brand-navy cursor-pointer h-[32px]"
                      >
                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                          <option key={bg} value={bg}>{bg}</option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-xs font-extrabold text-brand-emergency">{bloodGroup}</p>
                    )}
                  </div>

                  {/* Emergency Contact Name */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Emergency Contact Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={emergencyName}
                        onChange={(e) => setEmergencyName(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-brand-primary text-xs bg-white font-semibold text-brand-navy"
                        required
                      />
                    ) : (
                      <p className="text-xs font-bold text-brand-navy">{emergencyName || "Not Specified"}</p>
                    )}
                  </div>

                  {/* Emergency Relationship */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Relationship</label>
                    {isEditing ? (
                      <select
                        value={emergencyRelationship}
                        onChange={(e) => setEmergencyRelationship(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-brand-primary text-xs bg-white font-bold text-brand-navy cursor-pointer h-[32px]"
                      >
                        <option value="Spouse">Spouse</option>
                        <option value="Family">Family Member</option>
                        <option value="Friend">Friend</option>
                        <option value="Doctor">Doctor</option>
                        <option value="Agency Support">Agency Support</option>
                      </select>
                    ) : (
                      <p className="text-xs font-bold text-slate-600">{emergencyRelationship}</p>
                    )}
                  </div>

                  {/* Emergency Contact Phone */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Emergency Phone</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={emergencyPhone}
                        onChange={(e) => setEmergencyPhone(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-brand-primary text-xs bg-white font-semibold text-brand-navy"
                        required
                      />
                    ) : (
                      <p className="text-xs font-bold text-brand-navy">{emergencyPhone || "Not Specified"}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMN 3: Vehicle Specifications */}
            <div className="space-y-4 bg-slate-50/50 border border-slate-100 p-4.5 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 border-b border-slate-100 pb-2.5 mb-3.5">
                  <Car className="w-4 h-4 text-brand-primary shrink-0" />
                  <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Vehicle Specs</h4>
                </div>

                <div className="space-y-3">
                  {/* Vehicle Type */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Vehicle Type</label>
                    {isEditing ? (
                      <div className="grid grid-cols-3 gap-1.5">
                        {["CAR", "BIKE", "BOTH"].map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setVehicleType(type as VehicleType)}
                            className={`py-1 rounded-md border text-[9px] font-black uppercase transition-all flex items-center justify-center space-x-1 ${
                              vehicleType === type
                                ? "bg-blue-50 border-brand-primary text-brand-primary"
                                : "bg-white border-slate-200 text-text-secondary hover:bg-slate-50"
                            }`}
                          >
                            {type === "CAR" && <Car className="w-3 h-3" />}
                            {type === "BIKE" && <Compass className="w-3 h-3" />}
                            {type === "BOTH" && <Layers className="w-3 h-3" />}
                            <span>{type}</span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1.5">
                        {vehicleType === "CAR" && <Car className="w-3.5 h-3.5 text-brand-primary" />}
                        {vehicleType === "BIKE" && <Compass className="w-3.5 h-3.5 text-brand-primary animate-spin" style={{ animationDuration: "10s" }} />}
                        {vehicleType === "BOTH" && <Layers className="w-3.5 h-3.5 text-brand-primary" />}
                        <p className="text-xs font-bold text-brand-navy uppercase">{vehicleType}</p>
                      </div>
                    )}
                  </div>

                  {/* Vehicle Reg Number */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Reg Number</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={vehicleNumber}
                        onChange={(e) => setVehicleNumber(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-brand-primary text-xs bg-white font-semibold text-brand-navy"
                        required
                      />
                    ) : (
                      <p className="text-xs font-extrabold text-brand-navy font-mono">{vehicleNumber || "Not Specified"}</p>
                    )}
                  </div>

                  {/* Vehicle Brand */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Brand</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={vehicleBrand}
                        onChange={(e) => setVehicleBrand(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-brand-primary text-xs bg-white font-semibold text-brand-navy"
                      />
                    ) : (
                      <p className="text-xs font-bold text-brand-navy">{vehicleBrand || "Not Specified"}</p>
                    )}
                  </div>

                  {/* Vehicle Model */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Model</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={vehicleModel}
                        onChange={(e) => setVehicleModel(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-brand-primary text-xs bg-white font-semibold text-brand-navy"
                      />
                    ) : (
                      <p className="text-xs font-bold text-brand-navy">{vehicleModel || "Not Specified"}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Account Settings Section */}
          <div className="border-t border-slate-100 pt-5 mt-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 bg-slate-50/40 p-4.5 rounded-2xl border border-slate-100">
              
              <div className="space-y-3.5 max-w-sm">
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Account Password Change</span>
                </div>

                <div className="space-y-1 relative">
                  <label className="text-[9px] font-black text-slate-450 uppercase tracking-wider">New Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder={isEditing ? "Enter new security key" : "••••••••••••"}
                      disabled={!isEditing}
                      className="w-full pl-3 pr-9 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-brand-primary text-xs bg-white font-semibold text-brand-navy disabled:bg-slate-100/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-2 text-slate-400 hover:text-brand-navy"
                    >
                      {showPassword ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Control Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={handleResetEcosystem}
                  className="px-4 py-2.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100/70 text-brand-emergency text-xs font-black transition-all active:scale-95 flex items-center space-x-2 cursor-pointer shadow-sm"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Reset Ecosystem DB</span>
                </button>

                <button
                  type="button"
                  onClick={logout}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-xs font-black transition-all active:scale-95 flex items-center space-x-2 cursor-pointer shadow-sm"
                >
                  <LogOut className="w-3.5 h-3.5 text-slate-400" />
                  <span>Log Out Account</span>
                </button>
              </div>

            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
