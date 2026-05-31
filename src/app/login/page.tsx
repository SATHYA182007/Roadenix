"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, Role, VehicleType } from "@/context/AuthContext";
import { 
  Activity, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Car, 
  Compass, 
  Zap, 
  ArrowRight,
  ArrowLeft,
  Shield,
  Eye,
  EyeOff,
  Users,
  Layers,
  Heart,
  Wrench,
  CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const { login, signup, loading } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Account details
  const [email, setEmail] = useState("admin@roadsos.com");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // Step 2: Emergency details
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [emergencyRelationship, setEmergencyRelationship] = useState("Spouse");
  const [bloodGroup, setBloodGroup] = useState("O+");

  // Step 3: Vehicle details
  const [vehicleType, setVehicleType] = useState<VehicleType>("CAR");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleBrand, setVehicleBrand] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");

  // Selected login role segment
  const [loginSegment, setLoginSegment] = useState<Role>("ADMIN");

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const resolvedRole: Role = loginSegment;

    try {
      const success = await login(email, resolvedRole);
      if (success) {
        setSuccessMsg("Access authorized. Syncing credentials...");
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } else {
        setErrorMsg("Failed to authenticate. Please check your credentials.");
      }
    } catch (e) {
      setErrorMsg("Authentication server error.");
    }
  };

  const handleSignUp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    // Validate overall signup
    if (!name || !email || !phone || !password || !confirmPassword) {
      setErrorMsg("Step 1 details are incomplete.");
      setCurrentStep(1);
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      setCurrentStep(1);
      return;
    }
    if (!emergencyName || !emergencyPhone) {
      setErrorMsg("Step 2 Emergency details are incomplete.");
      setCurrentStep(2);
      return;
    }
    if (!vehicleNumber) {
      setErrorMsg("Step 3 Vehicle Registration number is incomplete.");
      setCurrentStep(3);
      return;
    }

    try {
      const success = await signup(
        name,
        email,
        phone,
        loginSegment,
        vehicleType,
        bloodGroup,
        vehicleNumber,
        vehicleBrand || "Standard",
        vehicleModel || "Generic",
        {
          name: emergencyName,
          phone: emergencyPhone,
          relationship: emergencyRelationship
        }
      );
      if (success) {
        setSuccessMsg("Account registered. Initializing telemetry loop...");
        setTimeout(() => {
          router.push("/dashboard");
        }, 1200);
      } else {
        setErrorMsg("Registration failed. Email might already be registered.");
      }
    } catch (e) {
      setErrorMsg("Registration server error.");
    }
  };

  const quickLogin = async (selectedRole: Role) => {
    const defaultEmails = {
      ADMIN: "admin@roadsos.com",
      AUTHORITY: "authority@roadsos.com",
      EMERGENCY_TEAM: "responder@roadsos.com",
      USER: "driver@roadsos.com",
    };
    setErrorMsg("");
    setSuccessMsg("");
    
    setEmail(defaultEmails[selectedRole]);
    setLoginSegment(selectedRole);

    try {
      const success = await login(defaultEmails[selectedRole], selectedRole);
      if (success) {
        setSuccessMsg(`Welcome. Authorized as ${selectedRole.replace("_", " ")}.`);
        setTimeout(() => {
          router.push("/dashboard");
        }, 800);
      }
    } catch (e) {
      setErrorMsg("Quick auth failed.");
    }
  };

  // Helper to validate and advance step
  const handleNextStep = () => {
    setErrorMsg("");
    if (currentStep === 1) {
      if (!name || !email || !phone || !password || !confirmPassword) {
        setErrorMsg("All Step 1 fields are required.");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg("Passwords do not match.");
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!emergencyName || !emergencyPhone) {
        setErrorMsg("Emergency contact name and phone are required.");
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (!vehicleNumber) {
        setErrorMsg("Vehicle Number is required.");
        return;
      }
      setCurrentStep(4);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-slate-50 relative flex items-center justify-center p-4 grid-bg font-sans">
      {/* Floating Back Button */}
      <Link 
        href="/"
        className="absolute top-6 left-6 z-20 px-4 py-2 rounded-xl text-xs font-bold bg-white/70 backdrop-blur-md border border-slate-200/60 text-brand-navy hover:bg-slate-50 hover:border-blue-500/30 transition-all active:scale-95 shadow-sm flex items-center space-x-1.5"
      >
        <ArrowLeft className="w-3.5 h-3.5 text-brand-primary" />
        <span>Back to Home</span>
      </Link>

      {/* Decorative Glows */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] radial-glow -z-10 opacity-70" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] radial-glow -z-10 opacity-70" />

      {/* Re-designed Login Card Box */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[540px] bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden relative"
      >
        {/* Glowing top edge border gradient bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600" />

        <div className="py-8 px-6 sm:py-10 sm:px-8 space-y-6">
          
          {/* Logo Brand area */}
          <div className="flex items-center justify-center pb-1.5 pt-1">
            <img 
              src="/roadenix2.png" 
              alt="Roadenix Logo" 
              className="h-24 w-auto object-contain" 
            />
          </div>

          {/* Heading */}
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-black text-brand-navy tracking-tight leading-none">
              {isSignUp ? `Registration — Step ${currentStep} of 4` : "Welcome back"}
            </h2>
            <p className="text-[11px] text-text-secondary font-bold px-4 leading-normal mt-0.5">
              {isSignUp 
                ? "Setup your multi-agency emergency telemetry profile."
                : "Sign in to manage active emergencies and track vehicle diagnostics."}
            </p>
          </div>

          {/* Error / Success Alerts */}
          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-red-50 border border-red-100 text-[10px] font-bold text-brand-emergency flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 text-[10px] font-bold text-brand-success flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          {!isSignUp ? (
            // SIGN IN FORM
            <form onSubmit={handleLogin} className="space-y-3">
              {/* SELECT LOGIN ROLE */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">
                  Select login role
                </label>
                <div className="grid grid-cols-4 p-1 bg-slate-50 border border-slate-200/60 rounded-xl gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginSegment("ADMIN");
                      if (!email || email === "driver@roadsos.com" || email === "responder@roadsos.com" || email === "authority@roadsos.com") {
                        setEmail("admin@roadsos.com");
                      }
                    }}
                    className={`py-2 px-0.5 rounded-lg text-[8px] font-black transition-all flex items-center justify-center space-x-0.5 ${
                      loginSegment === "ADMIN"
                        ? "bg-white text-brand-primary shadow-sm border border-slate-200/50"
                        : "text-text-secondary hover:text-brand-navy"
                    }`}
                  >
                    <Shield className="w-3 h-3" />
                    <span>Admin</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginSegment("AUTHORITY");
                      if (!email || email === "driver@roadsos.com" || email === "admin@roadsos.com" || email === "responder@roadsos.com") {
                        setEmail("authority@roadsos.com");
                      }
                    }}
                    className={`py-2 px-0.5 rounded-lg text-[8px] font-black transition-all flex items-center justify-center space-x-0.5 ${
                      loginSegment === "AUTHORITY"
                        ? "bg-white text-brand-primary shadow-sm border border-slate-200/50"
                        : "text-text-secondary hover:text-brand-navy"
                    }`}
                  >
                    <Activity className="w-3 h-3" />
                    <span>Authority</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginSegment("EMERGENCY_TEAM");
                      if (!email || email === "driver@roadsos.com" || email === "admin@roadsos.com" || email === "authority@roadsos.com") {
                        setEmail("responder@roadsos.com");
                      }
                    }}
                    className={`py-2 px-0.5 rounded-lg text-[8px] font-black transition-all flex items-center justify-center space-x-0.5 ${
                      loginSegment === "EMERGENCY_TEAM"
                        ? "bg-white text-brand-primary shadow-sm border border-slate-200/50"
                        : "text-text-secondary hover:text-brand-navy"
                    }`}
                  >
                    <Users className="w-3 h-3" />
                    <span>Helper</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginSegment("USER");
                      if (!email || email === "admin@roadsos.com" || email === "responder@roadsos.com" || email === "authority@roadsos.com") {
                        setEmail("driver@roadsos.com");
                      }
                    }}
                    className={`py-2 px-0.5 rounded-lg text-[8px] font-black transition-all flex items-center justify-center space-x-0.5 ${
                      loginSegment === "USER"
                        ? "bg-white text-brand-primary shadow-sm border border-slate-200/50"
                        : "text-text-secondary hover:text-brand-navy"
                    }`}
                  >
                    <Car className="w-3 h-3" />
                    <span>User</span>
                  </button>
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="email"
                    placeholder="email@roadsos.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-brand-primary text-xs bg-slate-50/50 font-semibold text-brand-navy"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-9 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-brand-primary text-xs bg-slate-50/50 font-semibold text-brand-navy"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-brand-navy"
                  >
                    {showPassword ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Remember Checkbox */}
              <div className="flex items-center space-x-2 pt-0.5">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-3.5 h-3.5 text-brand-primary border-slate-350 rounded accent-brand-navy"
                  defaultChecked
                />
                <label htmlFor="remember" className="text-[10px] text-slate-500 font-bold uppercase tracking-wide cursor-pointer select-none">
                  Remember my account
                </label>
              </div>

              {/* Sign In Trigger */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-navy hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center space-x-1.5 mt-2 text-xs uppercase tracking-wider cursor-pointer"
              >
                {loading ? (
                  <span>Authorizing Security Key...</span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </>
                )}
              </button>
            </form>
          ) : (
            // MULTI-STEP SIGN UP FLOW
            <div className="space-y-3.5">
              
              {/* Progress Indicator Bar */}
              <div className="w-full bg-slate-100 h-1.5 rounded-full flex overflow-hidden">
                <div 
                  className="bg-brand-primary h-full transition-all duration-300"
                  style={{ width: `${(currentStep / 4) * 100}%` }}
                />
              </div>

              {/* STEP 1: Account details */}
              {currentStep === 1 && (
                <div className="space-y-2.5">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Full Name *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Sarah Jenkins"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-brand-primary text-xs bg-slate-50/50 font-semibold text-brand-navy"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Email Address *</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                        <input
                          type="email"
                          placeholder="driver@roadsos.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-brand-primary text-xs bg-slate-50/50 font-semibold text-brand-navy"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Phone Number *</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                        <input
                          type="tel"
                          placeholder="+1 (555) 732-8924"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-brand-primary text-xs bg-slate-50/50 font-semibold text-brand-navy"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Password *</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-9 pr-9 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-brand-primary text-xs bg-slate-50/50 font-semibold text-brand-navy"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 text-slate-400 hover:text-brand-navy animate-pulse"
                        >
                          {showPassword ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Confirm Password *</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-brand-primary text-xs bg-slate-50/50 font-semibold text-brand-navy"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Emergency Details */}
              {currentStep === 2 && (
                <div className="space-y-2.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Emergency Contact Name *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                        <input
                          type="text"
                          placeholder="David Jenkins"
                          value={emergencyName}
                          onChange={(e) => setEmergencyName(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-brand-primary text-xs bg-slate-50/50 font-semibold text-brand-navy"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Relationship *</label>
                      <select
                        value={emergencyRelationship}
                        onChange={(e) => setEmergencyRelationship(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-brand-primary text-xs bg-slate-50/50 font-bold text-text-secondary bg-white cursor-pointer h-[34px]"
                      >
                        <option value="Spouse">Spouse</option>
                        <option value="Family">Family Member</option>
                        <option value="Friend">Friend</option>
                        <option value="Doctor">Doctor</option>
                        <option value="Agency Support">Agency Support</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Contact Phone *</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                        <input
                          type="tel"
                          placeholder="+1 (555) 732-4412"
                          value={emergencyPhone}
                          onChange={(e) => setEmergencyPhone(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-brand-primary text-xs bg-slate-50/50 font-semibold text-brand-navy"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Blood Group *</label>
                      <select
                        value={bloodGroup}
                        onChange={(e) => setBloodGroup(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-brand-primary text-xs bg-slate-50/50 font-bold text-brand-navy bg-white cursor-pointer h-[34px]"
                      >
                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
                          <option key={bg} value={bg}>{bg}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Vehicle Details */}
              {currentStep === 3 && (
                <div className="space-y-2.5">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Vehicle Type *</label>
                    <div className="grid grid-cols-3 gap-2">
                      {["CAR", "BIKE", "BOTH"].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setVehicleType(type as VehicleType)}
                          className={`py-1.5 rounded-lg border text-[10px] font-black uppercase transition-all flex items-center justify-center space-x-1 ${
                            vehicleType === type
                              ? "bg-blue-50 border-brand-primary text-brand-primary"
                              : "bg-white border-slate-200 text-text-secondary hover:bg-slate-50"
                          }`}
                        >
                          {type === "CAR" && <Car className="w-3.5 h-3.5" />}
                          {type === "BIKE" && <Compass className="w-3.5 h-3.5" />}
                          {type === "BOTH" && <Layers className="w-3.5 h-3.5" />}
                          <span>{type}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1 col-span-1">
                      <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Reg Number *</label>
                      <input
                        type="text"
                        placeholder="DRV-101"
                        value={vehicleNumber}
                        onChange={(e) => setVehicleNumber(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-brand-primary text-xs bg-slate-50/50 font-semibold text-brand-navy"
                      />
                    </div>
                    <div className="space-y-1 col-span-1">
                      <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Brand</label>
                      <input
                        type="text"
                        placeholder="Toyota"
                        value={vehicleBrand}
                        onChange={(e) => setVehicleBrand(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-brand-primary text-xs bg-slate-50/50 font-semibold text-brand-navy"
                      />
                    </div>
                    <div className="space-y-1 col-span-1">
                      <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Model</label>
                      <input
                        type="text"
                        placeholder="Supra"
                        value={vehicleModel}
                        onChange={(e) => setVehicleModel(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-brand-primary text-xs bg-slate-50/50 font-semibold text-brand-navy"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Review Summary */}
              {currentStep === 4 && (
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/50 text-[10px] font-semibold text-brand-navy space-y-2 max-h-[160px] overflow-y-auto">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                    <div><span className="text-[8px] font-bold text-slate-450 uppercase block">Full Name:</span> <span className="font-extrabold">{name}</span></div>
                    <div><span className="text-[8px] font-bold text-slate-450 uppercase block">Email Address:</span> <span className="font-extrabold truncate block max-w-[180px]">{email}</span></div>
                    <div><span className="text-[8px] font-bold text-slate-450 uppercase block">Phone Number:</span> <span className="font-extrabold">{phone}</span></div>
                    <div><span className="text-[8px] font-bold text-slate-450 uppercase block">Blood Group:</span> <span className="font-extrabold text-brand-primary">{bloodGroup}</span></div>
                    <div><span className="text-[8px] font-bold text-slate-450 uppercase block">Emergency Contact:</span> <span className="font-extrabold">{emergencyName} ({emergencyRelationship})</span></div>
                    <div><span className="text-[8px] font-bold text-slate-450 uppercase block">Contact Phone:</span> <span className="font-extrabold">{emergencyPhone}</span></div>
                    <div><span className="text-[8px] font-bold text-slate-450 uppercase block">Vehicle Type:</span> <span className="font-extrabold text-brand-primary">{vehicleType}</span></div>
                    <div><span className="text-[8px] font-bold text-slate-450 uppercase block">Vehicle Reg:</span> <span className="font-extrabold">{vehicleNumber}</span></div>
                    <div><span className="text-[8px] font-bold text-slate-450 uppercase block">Brand / Model:</span> <span className="font-extrabold">{vehicleBrand || "Standard"} {vehicleModel || "Generic"}</span></div>
                  </div>
                </div>
              )}

              {/* Step Navigation Button Footer Row */}
              <div className="flex items-center justify-between gap-3 pt-1">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep((prev) => prev - 1)}
                    className="flex-1 py-2 rounded-xl text-xs font-bold border border-slate-200 text-text-secondary hover:bg-slate-50 transition-all flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(false);
                      setErrorMsg("");
                      setSuccessMsg("");
                    }}
                    className="flex-1 py-2 rounded-xl text-xs font-bold border border-slate-200 text-text-secondary hover:bg-slate-50 transition-all flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <span>Sign In Portal</span>
                  </button>
                )}

                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="flex-1 py-2 rounded-xl text-xs font-bold bg-brand-primary text-white hover:bg-brand-light shadow-sm transition-all flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <span>Next Step</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSignUp()}
                    disabled={loading}
                    className="flex-1 py-2 rounded-xl text-xs font-bold bg-brand-navy hover:bg-slate-800 text-white shadow-md transition-all flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    {loading ? (
                      <span>Syncing profile...</span>
                    ) : (
                      <>
                        <span>Create Account</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-success" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Social Sign In Actions Divider (Only in Signin Mode or Step 1 of Signup) */}
          {(!isSignUp || currentStep === 1) && (
            <>
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-center space-x-3">
                  <div className="h-[1px] bg-slate-200 w-full" />
                  <span className="text-[8px] font-black text-slate-400 tracking-widest whitespace-nowrap uppercase">
                    Or sign in with
                  </span>
                  <div className="h-[1px] bg-slate-200 w-full" />
                </div>

                {/* Split Column Buttons Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => quickLogin(loginSegment)}
                    className="py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all font-bold text-xs text-brand-navy flex items-center justify-center space-x-2 active:scale-95 cursor-pointer"
                  >
                    {/* Google Colored Logo */}
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M12 5.04c1.62 0 3.08.56 4.22 1.65l3.15-3.15C17.45 1.74 14.94 1 12 1 7.37 1 3.44 3.66 1.5 7.56l3.82 2.96c.92-2.76 3.5-4.48 6.68-4.48z" />
                      <path fill="#4285F4" d="M23.49 12.27c0-.82-.07-1.61-.21-2.38H12v4.51h6.44c-.28 1.48-1.12 2.73-2.38 3.58l3.7 2.87c2.16-1.99 3.43-4.92 3.43-8.58z" />
                      <path fill="#FBBC05" d="M5.32 10.52c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29L1.5 2.98C.54 4.89 0 7.07 0 9.38s.54 4.49 1.5 6.4l3.82-2.96c-.24-.72-.38-1.49-.38-2.3z" />
                      <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.7-2.87c-1.03.69-2.34 1.1-3.96 1.1-3.18 0-5.76-1.72-6.68-4.48L1.5 16.8c1.94 3.9 5.87 6.2 10.5 6.2z" />
                    </svg>
                    <span>Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => quickLogin(loginSegment)}
                    className="py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all font-bold text-xs text-brand-navy flex items-center justify-center space-x-2 active:scale-95 cursor-pointer"
                  >
                    {/* Microsoft Colored Logo */}
                    <svg className="w-3.5 h-3.5" viewBox="0 0 23 23">
                      <path fill="#f35325" d="M0 0h11v11H0z" />
                      <path fill="#80bb0a" d="M12 0h11v11H12z" />
                      <path fill="#00a4ef" d="M0 12h11v11H0z" />
                      <path fill="#ffb900" d="M12 12h11v11H12z" />
                    </svg>
                    <span>Microsoft</span>
                  </button>
                </div>
              </div>

              {/* Footer Switcher toggler */}
              <div className="text-center pt-1.5 text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                <span>{isSignUp ? "Already on Roadenix? " : "New to Roadenix? "}</span>
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setCurrentStep(1);
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                  className="text-brand-primary hover:underline bg-transparent font-black ml-1 uppercase cursor-pointer"
                >
                  {isSignUp ? "Sign In" : "Create account"}
                </button>
              </div>
            </>
          )}

        </div>
      </motion.div>
    </div>
  );
}
