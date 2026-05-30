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
  Users
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const { login, signup, loading } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  
  // Segmented role switch (matches the Admin Login / Staff/Authority Login in screenshot)
  const [loginSegment, setLoginSegment] = useState<Role>("DRIVER");
  const [vehicleType, setVehicleType] = useState<VehicleType>("CAR");

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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!name || !email || !phone) {
      setErrorMsg("Please fill in all details.");
      return;
    }

    const resolvedRole: Role = loginSegment;

    try {
      const success = await signup(name, email, phone, resolvedRole, vehicleType);
      if (success) {
        setSuccessMsg("Account registered. Initializing telemetry loop...");
        setTimeout(() => {
          router.push("/dashboard");
        }, 1200);
      } else {
        setErrorMsg("Registration failed. Email might be registered.");
      }
    } catch (e) {
      setErrorMsg("Registration database error.");
    }
  };

  const quickLogin = async (selectedRole: Role) => {
    const defaultEmails = {
      SUPER_ADMIN: "admin@roadsos.com",
      DRIVER: "driver@roadsos.com",
      EMERGENCY_TEAM: "responder@roadsos.com",
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

  return (
    <div className="min-h-screen bg-slate-50 relative flex items-center justify-center p-6 grid-bg">
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

      {/* Re-designed Login Card Box based on screenshot */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[520px] bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden relative"
      >
        {/* Glowing top edge border gradient bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600" />

        <div className="p-8 sm:p-10 space-y-6">
          
          {/* Logo Brand area */}
          <div className="flex items-center justify-center space-x-2 pb-2">
            <div className="w-9 h-9 rounded-lg bg-brand-primary flex items-center justify-center text-white shadow-md shadow-blue-500/10">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div className="text-left">
              <span className="font-black text-lg tracking-tight text-brand-navy">Road<span className="text-brand-primary">SOS</span></span>
              <span className="ml-1.5 px-2 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-[8px] font-bold text-brand-primary uppercase tracking-widest">
                AI + IoT Network
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-black text-brand-navy tracking-tight">
              {isSignUp ? "Create account" : "Welcome back"}
            </h2>
            <p className="text-xs text-text-secondary font-medium px-4">
              {isSignUp 
                ? "Register your vehicle and connect safety sensors in real time."
                : "Sign in to manage active emergencies and track vehicle diagnostics."}
            </p>
          </div>

          {/* Error / Success Alerts */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-100 text-xs font-bold text-brand-emergency flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 text-xs font-bold text-brand-success flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Main Form container */}
          <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-4">
            
            {/* SELECT LOGIN ROLE (Segmented Switcher exactly like screenshot but with 3 options) */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                Select login role
              </label>
              <div className="grid grid-cols-3 p-1 bg-slate-50 border border-slate-200/60 rounded-xl gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setLoginSegment("SUPER_ADMIN");
                    if (!email || email === "driver@roadsos.com" || email === "responder@roadsos.com") {
                      setEmail("admin@roadsos.com");
                    }
                  }}
                  className={`py-2.5 px-1.5 rounded-lg text-[9px] font-black transition-all flex items-center justify-center space-x-1 ${
                    loginSegment === "SUPER_ADMIN"
                      ? "bg-white text-brand-primary shadow-sm border border-slate-200/50"
                      : "text-text-secondary hover:text-brand-navy"
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginSegment("EMERGENCY_TEAM");
                    if (!email || email === "driver@roadsos.com" || email === "admin@roadsos.com") {
                      setEmail("responder@roadsos.com");
                    }
                  }}
                  className={`py-2.5 px-1.5 rounded-lg text-[9px] font-black transition-all flex items-center justify-center space-x-1 ${
                    loginSegment === "EMERGENCY_TEAM"
                      ? "bg-white text-brand-primary shadow-sm border border-slate-200/50"
                      : "text-text-secondary hover:text-brand-navy"
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Authority</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginSegment("DRIVER");
                    if (!email || email === "admin@roadsos.com" || email === "responder@roadsos.com") {
                      setEmail("driver@roadsos.com");
                    }
                  }}
                  className={`py-2.5 px-1.5 rounded-lg text-[9px] font-black transition-all flex items-center justify-center space-x-1 ${
                    loginSegment === "DRIVER"
                      ? "bg-white text-brand-primary shadow-sm border border-slate-200/50"
                      : "text-text-secondary hover:text-brand-navy"
                  }`}
                >
                  <Car className="w-3.5 h-3.5" />
                  <span>User / Driver</span>
                </button>
              </div>
            </div>

            {/* Sign Up Fields */}
            {isSignUp && (
              <div className="space-y-4">
                {/* Full name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Alex Mercer"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-primary text-xs bg-blue-50/20 font-medium transition-all"
                    />
                  </div>
                </div>

                {/* Phone number */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Emergency Contact Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      placeholder="+1 (555) 732-8924"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-primary text-xs bg-blue-50/20 font-medium transition-all"
                    />
                  </div>
                </div>

                {/* Vehicle Selector (Driver registration only) */}
                {loginSegment === "DRIVER" && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Vehicle Class Configuration</label>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setVehicleType("CAR")}
                        className={`py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
                          vehicleType === "CAR"
                            ? "bg-blue-50 border-brand-primary text-brand-primary"
                            : "bg-white border-slate-200 text-text-secondary hover:bg-slate-50"
                        }`}
                      >
                        <Car className="w-3.5 h-3.5" />
                        <span>Car Mode</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setVehicleType("BIKE")}
                        className={`py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
                          vehicleType === "BIKE"
                            ? "bg-blue-50 border-brand-primary text-brand-primary"
                            : "bg-white border-slate-200 text-text-secondary hover:bg-slate-50"
                        }`}
                      >
                        <Compass className="w-3.5 h-3.5" />
                        <span>Bike Mode</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Email field (with Light Blue Background matching demo@farmer.com field) */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  placeholder="demo@farmer.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-primary text-xs bg-blue-50/40 font-semibold text-brand-navy transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Password field (with show/hide eye toggle) */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Password</label>
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        alert("To reset password, please contact the RoadSOS Security Officer at help@roadsos.org.");
                      }
                    }}
                    className="text-[10px] font-bold text-brand-navy hover:underline bg-transparent"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-primary text-xs bg-blue-50/40 font-semibold text-brand-navy transition-all placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-brand-navy focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            {!isSignUp && (
              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 text-brand-primary border-slate-300 rounded focus:ring-brand-primary cursor-pointer accent-brand-navy"
                  defaultChecked
                />
                <label htmlFor="remember" className="text-[10px] font-bold text-slate-500 cursor-pointer select-none">
                  Remember my account
                </label>
              </div>
            )}

            {/* Solid Black Button (Sign In -> exactly like RGU screenshot) */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0F172A] hover:bg-slate-800 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center space-x-1.5 cursor-pointer mt-6 text-xs uppercase tracking-wider"
            >
              {loading ? (
                <span>Authorizing Security Key...</span>
              ) : (
                <>
                  <span>{isSignUp ? "Create account" : "Sign In"}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </>
              )}
            </button>
          </form>

          {/* OR SIGN IN WITH social buttons section */}
          <div className="space-y-4 pt-2">
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
                onClick={() => quickLogin("DRIVER")}
                className="py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all font-bold text-xs text-brand-navy flex items-center justify-center space-x-2 active:scale-95"
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
                onClick={() => quickLogin("SUPER_ADMIN")}
                className="py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all font-bold text-xs text-brand-navy flex items-center justify-center space-x-2 active:scale-95"
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

          {/* Footer switcher link */}
          <div className="text-center pt-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            <span>{isSignUp ? "Already on RoadSOS? " : "New to RoadSOS? "}</span>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className="text-brand-primary hover:underline bg-transparent font-black ml-1 uppercase"
            >
              {isSignUp ? "Sign In" : "Create account"}
            </button>
          </div>

        </div>
      </motion.div>

    </div>
  );
}
