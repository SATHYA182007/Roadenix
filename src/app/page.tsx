"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { 
  Activity, 
  ShieldAlert, 
  MapPin, 
  Navigation, 
  Radio, 
  Cpu, 
  LineChart, 
  ArrowRight, 
  Play, 
  Zap, 
  CheckCircle2, 
  Heart,
  Server,
  Database,
  ArrowRightLeft,
  Flame,
  Truck,
  Eye,
  Volume2,
  Clock,
  Skull,
  PhoneCall,
  UserX,
  Compass,
  AlertTriangle,
  Building,
  Sparkles,
  Layers,
  ChevronRight,
  TrendingDown,
  Wrench,
  Car
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LandingPage() {
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  
  // Interactive Timeline state
  const [timelineStep, setTimelineStep] = useState(0);

  // AI Decision Engine Interactive State
  const [aiAnalysisType, setAiAnalysisType] = useState<"IMPACT" | "TILT" | "FATIGUE">("IMPACT");

  // Simulated Telemetry Dials for Hero visual
  const [telemetry, setTelemetry] = useState({
    speed: 98,
    gForce: 1.05,
    tilt: 2,
    status: "SCANNING",
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTelemetry((prev) => {
        if (prev.status === "CRASH_TRIGGERED") return prev;
        const speedOsc = Math.max(80, Math.min(120, Math.round(prev.speed + (Math.random() - 0.5) * 5)));
        const gForceOsc = parseFloat((1.0 + (Math.random() - 0.5) * 0.05).toFixed(2));
        return {
          speed: speedOsc,
          gForce: gForceOsc,
          tilt: 2 + Math.floor(Math.random() * 3),
          status: "SCANNING",
        };
      });
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  const triggerHeroCrash = () => {
    setTelemetry({
      speed: 0,
      gForce: 6.82,
      tilt: 58,
      status: "CRASH_TRIGGERED"
    });
    setTimeout(() => {
      setTelemetry({
        speed: 84,
        gForce: 1.02,
        tilt: 3,
        status: "SCANNING"
      });
    }, 6000);
  };

  const problemPoints = [
    { title: "Unconscious Victims", desc: "Drivers knocked unconscious cannot call for help, leading to delayed medical attention.", icon: UserX },
    { title: "Inaccessible Phones", desc: "In high-impact crashes, mobile devices are frequently thrown, crushed, or lost inside the cabin.", icon: Skull },
    { title: "No Witnesses Present", desc: "Crashes on highway routes or during late-night intervals frequently go unreported for hours.", icon: Eye },
    { title: "Unknown Coordinates", desc: "Panicked observers or disoriented passengers struggle to describe exact highway markers.", icon: MapPin },
  ];

  const comparisonTraditional = [
    "Crash occurs silently with no external indicators",
    "Requires a conscious occupant or passing witness to spot it",
    "Observer calls 911 and tries to explain the approximate location",
    "Dispatcher routes request to nearest local responder office",
    "Ambulance sets off with vague, unverified coordinates",
  ];

  const comparisonRoadSos = [
    "IoT sensors log instant 6.8G impact deceleration anomaly",
    "AI assesses roll angle and triggers 10s voice safe-check",
    "No response automatically confirms critical accident status",
    "Encrypted CAD packet immediately routes coordinates to dispatchers",
    "Medics route directly along optimal traffic-cleared corridors",
  ];

  const timelineSteps = [
    { label: "Step 1", title: "Sensor Anomaly Logged", desc: "ESP32 micro-units detect physical impact spikes or rollover angles in 10ms.", icon: Cpu },
    { label: "Step 2", title: "Edge AI Classification", desc: "Decision tree algorithms parse deceleration rates to differentiate bumps from crashes.", icon: Activity },
    { label: "Step 3", title: "In-Cabin Safety Inquiry", desc: "Displays a priority countdown warnings dialog and speaks out voice check-ins.", icon: Volume2 },
    { label: "Step 4", title: "Automated SOS Triggers", desc: "Unanswered countdown confirms occupant crisis, locking coordinates instantly.", icon: ShieldAlert },
    { label: "Step 5", title: "Telemetry Dispatch", desc: "Broadcasts JSON telemetry payload directly to the Emergency Response network.", icon: Navigation },
    { label: "Step 6", title: "GIS Route Navigation", desc: "Calculates optimal responder vectors and tracks medic ETA maps live.", icon: Truck },
    { label: "Step 7", title: "Incident Closure", desc: "Tracks operations progress continuously until medics verify patient safety.", icon: CheckCircle2 },
  ];

  const bentoGrid = [
    { 
      title: "AI Verification Loop", 
      desc: "Uses circular 10s countdowns and voice synthesis checkups to safely filter out false alarms during minor bumps.", 
      tag: "Zero False Positives",
      icon: Radio 
    },
    { 
      title: "GIS Mapping HUD", 
      desc: "Overlays target vehicles, responder nodes, and coordinate routes on custom-styled vector GIS dashboards.", 
      tag: "Live Route Tracking",
      icon: MapPin 
    },
    { 
      title: "Automated Dispatch System", 
      desc: "Aggregates ambulance, police, and fire engine dispatches, reducing coordinator call-time structures to zero.", 
      tag: "Immediate Response",
      icon: Navigation 
    },
    { 
      title: "Sensor Diagnostics Core", 
      desc: "Aggregates engine temperature, tire PSI, helmet lock status, and fuel parameters at 100Hz intervals.", 
      tag: "High Frequency Telemetry",
      icon: Cpu 
    },
    { 
      title: "Service Override Shield", 
      desc: "Locks out sensor alerts and ignores crash simulations during scheduled mechanics work, keeping logs clean.", 
      tag: "Maintenance Safe",
      icon: Wrench 
    },
    { 
      title: "Multi-Role Dashboards", 
      desc: "Provides optimized UI viewports dedicated to Admins, Rescue responders, and Vehicle owners from one portal.", 
      tag: "3-Role Synchronization",
      icon: Layers 
    },
  ];

  const aiFractions = {
    IMPACT: { title: "G-Force Impact Analyzer", probability: 96, G: telemetry.gForce, desc: "Monitors structural chassis strain. Spikes above 4.0G trigger automated EOC verification packages instantly." },
    TILT: { title: "Chassis Tilt Scanner", probability: 92, G: telemetry.tilt, desc: "Aggregates digital gyroscopes. Roll angles exceeding 45° trigger active rollover emergency timeline tracking." },
    FATIGUE: { title: "AI Driver Fatigue Scanner", probability: 88, G: 14, desc: "Cabin mesh sensors scan eyelid blink intervals and yawn frequencies, warning drivers before microsleep occurs." },
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden font-sans text-slate-900">
      
      {/* Ambient background blur elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] radial-glow -z-10 opacity-70 pointer-events-none" />
      <div className="absolute top-[1200px] left-0 w-[500px] h-[500px] radial-glow -z-10 opacity-40 pointer-events-none" />
      <div className="absolute bottom-24 right-0 w-[550px] h-[550px] radial-glow -z-10 opacity-50 pointer-events-none" />

      {/* Corporate Header Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="h-32 flex items-center pl-4">
            <img 
              src="/roadenix2.png" 
              alt="Roadenix Logo" 
              className="h-32 w-auto object-contain transition-transform duration-300 hover:scale-105" 
            />
          </Link>

          <div className="hidden lg:flex items-center space-x-8">
            <a href="#problem" className="text-xs font-black uppercase tracking-wider text-slate-500 hover:text-brand-primary transition-colors">The Challenge</a>
            <a href="#solution" className="text-xs font-black uppercase tracking-wider text-slate-500 hover:text-brand-primary transition-colors">Ecosystem</a>
            <a href="#timeline" className="text-xs font-black uppercase tracking-wider text-slate-500 hover:text-brand-primary transition-colors">Rescue Loop</a>
            <a href="#innovations" className="text-xs font-black uppercase tracking-wider text-slate-500 hover:text-brand-primary transition-colors">Bento Specs</a>
            <a href="#ai-engine" className="text-xs font-black uppercase tracking-wider text-slate-500 hover:text-brand-primary transition-colors">AI Core</a>
          </div>

          <div className="flex items-center space-x-4">
            <Link 
              href="/login"
              className="px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase border border-slate-200 text-brand-navy bg-white hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
            >
              Sign In
            </Link>
            <Link 
              href="/login"
              className="px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase bg-brand-primary text-white hover:bg-brand-light transition-all active:scale-95 shadow-md shadow-blue-500/10 flex items-center space-x-2"
            >
              <span>Launch Platform</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* SECTION 1 — HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-28 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        <div className="lg:col-span-6 space-y-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-brand-emergency text-xs font-bold animate-pulse">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>CRITICAL RESCUE CHANNEL ACTIVE</span>
          </div>

          <h1 className="text-5xl md:text-[56px] font-black text-brand-navy leading-[1.05] tracking-tight">
            Every Minute Delayed Can <span className="emergency-text-gradient">Cost a Life</span>.
          </h1>

          <p className="text-lg text-text-secondary leading-relaxed font-medium">
            Road accidents happen in seconds, but emergency response often takes critical minutes. RoadSOS uses Artificial Intelligence, IoT sensors, and real-time GPS intelligence to automatically detect accidents, verify emergencies, and coordinate rescue operations when victims cannot call for help.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link 
              href="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-black uppercase bg-brand-primary text-white hover:bg-brand-light transition-all active:scale-95 text-center shadow-lg shadow-blue-500/20 flex items-center justify-center space-x-2"
            >
              <span>Launch Platform</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a 
              href="#problem"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-black uppercase border border-slate-200 text-brand-navy hover:bg-slate-50 bg-white transition-all active:scale-95 flex items-center justify-center space-x-2 shadow-sm text-center"
            >
              <span>Explore Solution</span>
            </a>
          </div>
        </div>

        {/* Hero Interactive Visualization Canvas */}
        <div className="lg:col-span-6">
          <div className="glass-card p-6 border-blue-500/10 relative overflow-hidden bg-white">
            
            {/* HUD Status bar */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center space-x-2">
                <span className={`w-2.5 h-2.5 rounded-full ${telemetry.status === "CRASH_TRIGGERED" ? "bg-red-500 animate-ping" : "bg-emerald-500 animate-pulse"}`} />
                <span className="text-xs font-black text-slate-700 tracking-wide uppercase">
                  {telemetry.status === "CRASH_TRIGGERED" ? "ACCIDENT DETECTION EVENT" : "AI ENGINE ACTIVE"}
                </span>
              </div>
              <button 
                onClick={triggerHeroCrash}
                className="px-2.5 py-1 bg-red-50 hover:bg-red-100 border border-red-100 rounded-lg text-[9px] font-black text-brand-emergency uppercase tracking-wider animate-pulse"
              >
                Trigger Crash Spike
              </button>
            </div>

            {/* Speeds and Gs cluster */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100/80 flex flex-col justify-between h-24">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Velocity Log</span>
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-extrabold text-brand-navy">{telemetry.speed}</span>
                  <span className="text-[10px] text-muted font-bold">KM/H</span>
                </div>
              </div>

              <div className={`p-4 rounded-xl border flex flex-col justify-between h-24 transition-colors duration-300 ${
                telemetry.status === "CRASH_TRIGGERED" ? "bg-red-50 border-red-200" : "bg-slate-50 border-slate-100/80"
              }`}>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Decelerometer</span>
                <div className="flex items-baseline space-x-1">
                  <span className={`text-3xl font-extrabold ${telemetry.status === "CRASH_TRIGGERED" ? "text-brand-emergency" : "text-brand-navy"}`}>
                    {telemetry.gForce}
                  </span>
                  <span className="text-[10px] text-muted font-bold">G</span>
                </div>
              </div>
            </div>

            {/* Live GIS Command Map HUD */}
            <div className="bg-slate-950 rounded-xl p-4 h-48 border border-slate-900 relative overflow-hidden flex flex-col justify-between">
              {/* GIS Grid pattern overlay */}
              <div className="absolute inset-0 opacity-15" 
                   style={{
                     backgroundImage: 'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)',
                     backgroundSize: '20px 20px'
                   }} 
              />
              
              {/* Radar sweep shimmer effect */}
              {telemetry.status !== "CRASH_TRIGGERED" && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent w-full h-full -translate-x-full animate-[shimmer_2.5s_infinite]" />
              )}

              {/* Holographic Street Paths SVG */}
              <svg className="w-full h-full absolute inset-0 z-10 opacity-70">
                {/* Custom City Highway nodes */}
                <line x1="50" y1="40" x2="450" y2="160" stroke="#1e293b" strokeWidth="5" strokeLinecap="round" />
                <line x1="80" y1="180" x2="380" y2="20" stroke="#1e293b" strokeWidth="5" strokeLinecap="round" />
                
                {/* Active Glowing Corridors */}
                <line x1="80" y1="50" x2="400" y2="146" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
                <line x1="80" y1="50" x2="160" y2="120" stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="3 3" />
                
                {/* Pulsing distress G-Force target ring around vehicle */}
                {telemetry.status === "CRASH_TRIGGERED" ? (
                  <>
                    <circle cx="400" cy="146" r="16" fill="none" stroke="#ef4444" strokeWidth="1.5" className="animate-ping" />
                    <circle cx="400" cy="146" r="8" fill="#ef4444" opacity="0.8" />
                  </>
                ) : (
                  <circle cx="400" cy="146" r="6" fill="#3b82f6" />
                )}
                
                {/* EOC Medic Hospital Node */}
                <circle cx="80" cy="50" r="6" fill="#10b981" />
                <circle cx="80" cy="50" r="14" fill="none" stroke="#10b981" strokeWidth="1.5" className="animate-pulse" />

                {/* Live Animating Ambulance Node */}
                <motion.circle
                  cx={80}
                  cy={50}
                  animate={telemetry.status === "CRASH_TRIGGERED" ? { cx: 400, cy: 146 } : { cx: 80, cy: 50 }}
                  transition={{ duration: 4, ease: "easeInOut" }}
                  r="5"
                  fill="#10b981"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
              </svg>

              {/* Floating Labels HUD */}
              <div className="z-20 flex items-center justify-between text-[9px] font-mono text-white/80 select-none">
                <div className="flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-ping" />
                  <span>GPS TRACKING FEED: ON</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-slate-400">Hub: EMT-Sector 4</span>
                  <span>Conf: 98%</span>
                </div>
              </div>

              {/* Overlay Label overlays */}
              <div className="z-20 flex items-center justify-between text-[8px] font-mono text-slate-500 select-none">
                <div className="flex items-center space-x-2">
                  <span className="text-brand-light font-bold">Medic-12</span>
                  <span>➔</span>
                  <span className={telemetry.status === "CRASH_TRIGGERED" ? "text-brand-emergency font-bold animate-pulse" : ""}>
                    {telemetry.status === "CRASH_TRIGGERED" ? "EN ROUTE (ETA: 4M)" : "STANDBY"}
                  </span>
                </div>
                <span className={telemetry.status === "CRASH_TRIGGERED" ? "text-brand-emergency font-bold animate-pulse" : "text-emerald-400 font-bold"}>
                  {telemetry.status === "CRASH_TRIGGERED" ? "DISTRESS ACTIVE" : "NOMINAL"}
                </span>
              </div>
            </div>

            {/* Custom overlay logs */}
            <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-100 font-mono text-[9px] text-text-secondary space-y-1">
              <div className="flex items-center justify-between">
                <span>[MQTT CLIENT] publishes /vehicle/telemetry packet</span>
                <span className="text-brand-primary font-bold">ACK</span>
              </div>
              <div className="flex items-center justify-between">
                <span>[AI ENGINE] evaluates structural strain limits</span>
                <span className="text-emerald-500 font-bold">NOMINAL</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2 — THE PROBLEM */}
      <section id="problem" className="bg-slate-50 border-t border-slate-100 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Description content */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-black uppercase tracking-widest text-brand-emergency block">The Crisis</span>
              <h2 className="text-4xl font-extrabold text-brand-navy tracking-tight leading-tight">
                The Problem: Accident Response Challenges & The Critical Golden Hour
              </h2>
              <p className="text-base text-text-secondary leading-relaxed font-medium">
                Traditional emergency services face fatal systemic delays. When high-impact crashes occur, victims are frequently knocked unconscious, mobile devices are crushed or lost inside the wreckage, and observers struggle to describe coordinates on dark highway corridors. Bypassing these bottlenecks is the difference between survival and tragedy.
              </p>
              
              <div className="p-5 rounded-2xl bg-white border border-slate-200/60 shadow-sm space-y-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Survival Probability Window</span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-extrabold text-brand-emergency">-56%</span>
                  <span className="text-xs text-text-secondary font-bold">chance of survival for every 10 minutes medical dispatch response is delayed.</span>
                </div>
              </div>
            </div>

            {/* Problems list cards */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {problemPoints.map((item, idx) => {
                const IconComp = item.icon;
                return (
                  <div key={idx} className="glass-card p-5 bg-white border-slate-200/50 flex flex-col justify-between space-y-4">
                    <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-brand-emergency shrink-0 shadow-inner">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-sm text-brand-navy leading-tight">{item.title}</h4>
                      <p className="text-xs text-text-secondary leading-relaxed font-medium">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 3 — WHY ROADSOS */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-black uppercase tracking-widest text-brand-primary">Why RoadSOS</span>
          <h2 className="text-4xl font-extrabold text-brand-navy tracking-tight leading-tight">
            How RoadSOS Solves Critical Emergency Delays
          </h2>
          <p className="text-text-secondary font-medium">
            By shifting emergency logs from human-dependent reporting to automatic Edge AI verification, we eliminate coordinate descriptions delays completely.
          </p>
        </div>

        {/* Split screen comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Traditional Card */}
          <div className="glass-card p-8 bg-slate-50/50 border-slate-200/60 flex flex-col justify-between min-h-[360px] space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200/40 pb-4">
              <h3 className="font-extrabold text-base text-text-secondary uppercase tracking-wider">Traditional Reporting Loop</h3>
              <span className="px-2 py-0.5 rounded bg-slate-200 text-[9px] font-bold text-text-secondary uppercase">Highly Delayed</span>
            </div>

            <ul className="space-y-3.5 text-xs text-text-secondary font-semibold">
              {comparisonTraditional.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-2.5">
                  <span className="w-5 h-5 rounded-full bg-red-100 text-brand-emergency font-extrabold flex items-center justify-center shrink-0 text-[10px]">
                    ✕
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-center space-x-3 text-xs text-brand-emergency font-bold mt-2">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>Panics, coordinate errors, and unverified reports compromise routing.</span>
            </div>
          </div>

          {/* RoadSOS Card */}
          <div className="glass-card p-8 bg-white border-blue-500/10 flex flex-col justify-between min-h-[360px] space-y-6 shadow-md shadow-blue-500/5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-extrabold text-base text-brand-primary uppercase tracking-wider">RoadSOS Automated CAD</h3>
              <span className="px-2 py-0.5 rounded bg-blue-100 text-[9px] font-bold text-brand-primary uppercase animate-pulse">Zero latency</span>
            </div>

            <ul className="space-y-3.5 text-xs text-brand-navy font-semibold">
              {comparisonRoadSos.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-brand-success font-extrabold flex items-center justify-center shrink-0 text-[10px]">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 flex items-center space-x-3 text-xs text-brand-primary font-bold mt-2">
              <CheckCircle2 className="w-5 h-5 shrink-0 animate-pulse" />
              <span>Verifies sensor anomalies and coordinates EOC dispatches in 10s.</span>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 4 — EMERGENCY WORKFLOW */}
      <section id="solution" className="bg-slate-50 border-t border-b border-slate-100 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Text description */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-black uppercase tracking-widest text-brand-primary block">Emergency Workflow</span>
              <h2 className="text-4xl font-extrabold text-brand-navy tracking-tight leading-tight">
                The Detection-to-Rescue Process
              </h2>
              <h3 className="text-base font-extrabold text-brand-primary leading-tight">
                End-to-End Automated Alert Pipelines
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed font-medium">
                RoadSOS transforms standard vehicles into highly intelligent safety environments. When physical sensor spikes or critical rollover thresholds are reached, the system executes an automated safe-check voice loop, logs target coordinate packages, and dispatches rescuers instantly.
              </p>
              
              <div className="p-4 rounded-xl bg-brand-navy text-white flex items-center space-x-3 text-xs font-bold shadow-sm">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500 shrink-0" />
                <span>RoadSOS acts when occupants cannot speak.</span>
              </div>
            </div>

            {/* Visual pipeline graph */}
            <div className="lg:col-span-7">
              <div className="glass-card bg-white p-6 border-slate-200/50 relative overflow-hidden flex flex-col justify-between">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-6">Autonomous Alert Chain</span>
                
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4 relative">
                  
                  {/* Vehicle */}
                  <div className="flex flex-col items-center p-3.5 bg-slate-50 border border-slate-100 rounded-xl w-32 text-center shrink-0">
                    <Car className="w-5 h-5 text-brand-primary mb-1" />
                    <span className="font-bold text-[10px] text-brand-navy block uppercase">1. Vehicle</span>
                  </div>

                  <ArrowRightLeft className="w-5 h-5 text-slate-300 hidden md:block" />

                  {/* AI Detection */}
                  <div className="flex flex-col items-center p-3.5 bg-slate-50 border border-slate-100 rounded-xl w-32 text-center shrink-0">
                    <Activity className="w-5 h-5 text-brand-primary mb-1 animate-pulse" />
                    <span className="font-bold text-[10px] text-brand-navy block uppercase">2. AI Detection</span>
                  </div>

                  <ArrowRightLeft className="w-5 h-5 text-slate-300 hidden md:block" />

                  {/* Verification */}
                  <div className="flex flex-col items-center p-3.5 bg-slate-50 border border-slate-100 rounded-xl w-32 text-center shrink-0">
                    <Radio className="w-5 h-5 text-brand-primary mb-1" />
                    <span className="font-bold text-[10px] text-brand-navy block uppercase">3. Verification</span>
                  </div>

                  <ArrowRightLeft className="w-5 h-5 text-slate-300 hidden md:block" />

                  {/* Dispatch */}
                  <div className="flex flex-col items-center p-3.5 bg-brand-primary border border-brand-primary/20 rounded-xl w-32 text-center shrink-0 shadow-md">
                    <Truck className="w-5 h-5 text-white mb-1 animate-bounce" />
                    <span className="font-bold text-[10px] text-white block uppercase">4. Dispatch</span>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 5 — DETAILED RESCUE WORKFLOW */}
      <section id="timeline" className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-black uppercase tracking-widest text-brand-primary">Workflow Timeline</span>
          <h2 className="text-4xl font-extrabold text-brand-navy tracking-tight leading-tight">
            The Golden Hour Milestones
          </h2>
          <p className="text-text-secondary font-medium">
            Walk through the chronological operations milestone workflow, from the initial impact spike to coordinate rescue closure.
          </p>
        </div>

        {/* High-fidelity interactive process stepper timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Stepper buttons */}
          <div className="lg:col-span-5 space-y-3.5">
            {timelineSteps.map((step, idx) => {
              const IconComp = step.icon;
              const isActive = timelineStep === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setTimelineStep(idx)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center space-x-3.5 ${
                    isActive 
                      ? "bg-white border-blue-500/20 shadow-md text-brand-navy" 
                      : "bg-transparent border-transparent text-text-secondary hover:bg-white/40"
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    isActive ? "bg-brand-primary text-white" : "bg-slate-200/70 text-text-secondary"
                  }`}>
                    <IconComp className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">{step.label}</span>
                    <span className="font-extrabold text-xs block mt-0.5 leading-tight">{step.title}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Stepper active detail panel */}
          <div className="lg:col-span-7 flex">
            <AnimatePresence mode="wait">
              <motion.div
                key={timelineStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="glass-card bg-white p-8 border-blue-500/10 flex-1 flex flex-col justify-between shadow-lg shadow-blue-500/5"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <span className="text-xs font-black text-brand-primary tracking-widest uppercase">
                      Timeline Milestone: {timelineStep + 1} of 7
                    </span>
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-primary animate-ping" />
                  </div>
                  
                  <h3 className="text-2xl font-extrabold text-brand-navy leading-tight">
                    {timelineSteps[timelineStep].title}
                  </h3>
                  
                  <p className="text-text-secondary text-sm leading-relaxed font-medium">
                    {timelineSteps[timelineStep].desc} Our redundant MQTT networks maintain encrypted queue channels in local browser memory grids, guaranteeing responder dispatch coordinates bypass cell-tower latency.
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-6 mt-8 flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
                  <span>Safety loop active</span>
                  <span className="flex items-center space-x-1 text-brand-success font-black">
                    <CheckCircle2 className="w-4.5 h-4.5" />
                    <span>Verified</span>
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* SECTION 6 — REAL-TIME MONITORING */}
      <section id="innovations" className="bg-slate-50 border-t border-slate-100 py-24">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-black uppercase tracking-widest text-brand-primary">Telemetry stream</span>
            <h2 className="text-4xl font-extrabold text-brand-navy tracking-tight leading-tight">
              Real-Time Monitoring Capabilities
            </h2>
            <p className="text-text-secondary font-medium">
              RoadSOS continuously aggregates speed, g-forces, engine temperature, fuel efficiency, tire pressure, helmet logs, and eyelid drowsiness indicators.
            </p>
          </div>

          {/* Premium Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bentoGrid.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div key={idx} className="glass-card p-6 bg-white border-slate-200/50 flex flex-col justify-between space-y-6">
                  
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-brand-primary shrink-0 shadow-inner">
                      <IconComp className="w-5 h-5 animate-pulse" />
                    </div>
                    <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-100 text-[8px] font-black text-brand-primary uppercase tracking-widest">
                      {item.tag}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-extrabold text-sm text-brand-navy leading-tight">{item.title}</h3>
                    <p className="text-xs text-text-secondary leading-relaxed font-medium">{item.desc}</p>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* SECTION 7 — AI INTELLIGENCE */}
      <section id="ai-engine" className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Text descriptions */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-black uppercase tracking-widest text-brand-primary block">Decision loop</span>
            <h2 className="text-4xl font-extrabold text-brand-navy tracking-tight leading-tight">
              AI Intelligence: Decision-Making Process
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed font-medium">
              False dispatches degrade emergency networks. RoadSOS maps physical impact accelerations, gyroscopic rollover tilt spikes, and webcam-based facial blink frequency indices to verify accidents mathematically before coordinates are routed.
            </p>

            {/* Selector tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setAiAnalysisType("IMPACT")}
                className={`flex-1 py-2 rounded-lg text-xs font-extrabold transition-all ${
                  aiAnalysisType === "IMPACT" ? "bg-white text-brand-primary shadow-sm" : "text-text-secondary"
                }`}
              >
                G-Forces
              </button>
              <button
                onClick={() => setAiAnalysisType("TILT")}
                className={`flex-1 py-2 rounded-lg text-xs font-extrabold transition-all ${
                  aiAnalysisType === "TILT" ? "bg-white text-brand-primary shadow-sm" : "text-text-secondary"
                }`}
              >
                Roll Angles
              </button>
              <button
                onClick={() => setAiAnalysisType("FATIGUE")}
                className={`flex-1 py-2 rounded-lg text-xs font-extrabold transition-all ${
                  aiAnalysisType === "FATIGUE" ? "bg-white text-brand-primary shadow-sm" : "text-text-secondary"
                }`}
              >
                Vigilance Eye
              </button>
            </div>
          </div>

          {/* Futuristic AI Dashboard Interface widget */}
          <div className="lg:col-span-7">
            <div className="glass-card bg-slate-950 border-slate-900 p-6 shadow-2xl relative overflow-hidden h-[300px] flex flex-col justify-between text-slate-300">
              
              {/* Scan grid line overlay */}
              <div className="absolute inset-0 opacity-10 pointer-events-none" 
                   style={{
                     backgroundImage: 'linear-gradient(#2563eb 1px, transparent 1px), linear-gradient(90deg, #2563eb 1px, transparent 1px)',
                     backgroundSize: '16px 16px'
                   }} 
              />

              <div className="z-10 flex items-center justify-between border-b border-slate-900 pb-3 mb-2">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4.5 h-4.5 text-brand-primary animate-pulse" />
                  <span className="font-extrabold text-[9px] uppercase tracking-wider text-slate-400 font-mono">
                    AI CALIBRATION FEED // {aiAnalysisType}
                  </span>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              </div>

              <div className="z-10 flex-1 flex flex-col justify-around py-2">
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">AI Analyzer Focus</span>
                  <div className="text-lg font-extrabold text-white">{aiFractions[aiAnalysisType].title}</div>
                  <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                    {aiFractions[aiAnalysisType].desc}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-slate-900 pt-3 mt-2">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Telemetry Spike Index</span>
                    <div className="text-lg font-black text-brand-light font-mono">{aiFractions[aiAnalysisType].G} units</div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Classification Accuracy</span>
                    <div className="text-lg font-black text-emerald-400 font-mono">{aiFractions[aiAnalysisType].probability}% Verified</div>
                  </div>
                </div>
              </div>

              <div className="z-10 border-t border-slate-900 pt-2 flex items-center justify-between text-[8px] font-mono text-slate-500">
                <span>Core: DecisionTree / Classifier v3</span>
                <span>Active Safety Loop</span>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* SECTION 8 — IMPACT */}
      <section className="bg-slate-50 border-t border-slate-100 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-black uppercase tracking-widest text-brand-primary">System Performance</span>
            <h2 className="text-4xl font-extrabold text-brand-navy tracking-tight leading-tight">
              RoadSOS Impact Metrics
            </h2>
            <p className="text-text-secondary font-medium">
              We leverage real-time IoT pipelines to optimize dispatcher communications, drastically decreasing latency metrics.
            </p>
          </div>

          {/* Impact cards with animated counter grids (4-column layout for the 4 explicit metrics) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="glass-card p-8 bg-white border-slate-200/50 flex flex-col justify-between space-y-6">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-brand-primary shrink-0 shadow-inner">
                <TrendingDown className="w-5 h-5 animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-3xl font-black text-brand-navy">-45%</span>
                  <span className="text-[10px] font-black uppercase text-slate-400">Response Latency</span>
                </div>
                <h4 className="font-extrabold text-sm text-brand-navy leading-tight">Response Time Reduction</h4>
                <p className="text-xs text-text-secondary leading-relaxed font-medium">
                  Automating alerts cuts out coordinates description gaps, clearing paramedic paths immediately.
                </p>
              </div>
            </div>

            <div className="glass-card p-8 bg-white border-slate-200/50 flex flex-col justify-between space-y-6">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-brand-primary shrink-0 shadow-inner">
                <MapPin className="w-5 h-5 animate-bounce" />
              </div>
              <div className="space-y-2">
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-3xl font-black text-brand-navy">±1.2m</span>
                  <span className="text-[10px] font-black uppercase text-slate-400">HDOP accuracy</span>
                </div>
                <h4 className="font-extrabold text-sm text-brand-navy leading-tight">GPS Accuracy</h4>
                <p className="text-xs text-text-secondary leading-relaxed font-medium">
                  High-fidelity satellite coordinates log pinpoint locations even in deep tunnels or dense environments.
                </p>
              </div>
            </div>

            <div className="glass-card p-8 bg-white border-slate-200/50 flex flex-col justify-between space-y-6">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-brand-primary shrink-0 shadow-inner">
                <Clock className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-3xl font-black text-brand-navy">99.98%</span>
                  <span className="text-[10px] font-black uppercase text-slate-400">Uptime stream</span>
                </div>
                <h4 className="font-extrabold text-sm text-brand-navy leading-tight">Monitoring Reliability</h4>
                <p className="text-xs text-text-secondary leading-relaxed font-medium">
                  Edge ESP32 diagnostic nodes run loops continuously at 100Hz intervals, ensuring steady stream loops.
                </p>
              </div>
            </div>

            <div className="glass-card p-8 bg-white border-slate-200/50 flex flex-col justify-between space-y-6">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-brand-primary shrink-0 shadow-inner">
                <Activity className="w-5 h-5 animate-bounce" />
              </div>
              <div className="space-y-2">
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-3xl font-black text-brand-navy">99.85%</span>
                  <span className="text-[10px] font-black uppercase text-slate-400">Classification</span>
                </div>
                <h4 className="font-extrabold text-sm text-brand-navy leading-tight">AI Detection Accuracy</h4>
                <p className="text-xs text-text-secondary leading-relaxed font-medium">
                  Verification check countdowns and speech engines filter false reports, achieving optimal dispatches.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 9 — EMERGENCY NETWORK */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-black uppercase tracking-widest text-brand-primary">Rescue Coordination</span>
          <h2 className="text-4xl font-extrabold text-brand-navy tracking-tight leading-tight">
            Emergency Network: Ambulance, Police, and Fire Coordination
          </h2>
          <p className="text-text-secondary font-medium">
            RoadSOS links vehicles directly to civil authorities, organizing multi-agency emergency operations in real-time.
          </p>
        </div>

        {/* Stakeholder cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="p-6 rounded-2xl border border-slate-200/60 bg-white space-y-4">
            <Truck className="w-8 h-8 text-brand-primary animate-pulse" />
            <h4 className="font-extrabold text-sm text-brand-navy leading-tight">Ambulance Services</h4>
            <p className="text-xs text-text-secondary leading-relaxed font-medium font-semibold">
              Bypasses standard traffic light sequences via coordinate overrides, streaming live driver impact telemetry to triage medics.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200/60 bg-white space-y-4">
            <ShieldAlert className="w-8 h-8 text-brand-primary" />
            <h4 className="font-extrabold text-sm text-brand-navy leading-tight">Police Patrols</h4>
            <p className="text-xs text-text-secondary leading-relaxed font-medium font-semibold">
              Locks secure highway perimeter vectors, coordinates lane diversions, and logs precise rollover acceleration indexes automatically.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200/60 bg-white space-y-4">
            <Flame className="w-8 h-8 text-brand-emergency" />
            <h4 className="font-extrabold text-sm text-brand-navy leading-tight">Fire Responders</h4>
            <p className="text-xs text-text-secondary leading-relaxed font-medium font-semibold">
              Receives instant smoke gas density alerts and engine thermal spikes, warnings crews of structural cockpit hazards before arrival.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200/60 bg-white space-y-4">
            <Building className="w-8 h-8 text-brand-primary" />
            <h4 className="font-extrabold text-sm text-brand-navy leading-tight">Civil Authorities</h4>
            <p className="text-xs text-text-secondary leading-relaxed font-medium font-semibold">
              Aggregates municipal crash heatmaps, optimizes smart-city medical corridors, and calculates response success metrics.
            </p>
          </div>

        </div>
      </section>

      {/* SECTION 10 — LIVE PLATFORM PREVIEW */}
      <section className="bg-slate-50 border-t border-b border-slate-100 py-24">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-black uppercase tracking-widest text-brand-primary">Live Platform Showcase</span>
            <h2 className="text-4xl font-extrabold text-brand-navy tracking-tight leading-tight">
              SaaS Operations Center Preview
            </h2>
            <p className="text-text-secondary font-medium">
              Explore the premium, unified Command HUD, GPS vector tracker, and Speed dial widgets.
            </p>
          </div>

          {/* Interactive Mockup Container */}
          <div className="glass-card p-4 sm:p-6 border-slate-200/80 bg-white shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-6">
              <div className="flex space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <span className="text-[9px] font-black font-mono text-slate-400 uppercase tracking-widest">
                RoadSOS Operational Preview // dashboard
              </span>
            </div>

            {/* Dashboard Mockup Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
                <div className="flex justify-between items-center text-brand-navy">
                  <span className="font-extrabold text-[10px] uppercase">Super Admin EOC</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <div className="h-24 bg-white border border-slate-200/50 rounded-lg p-2.5 flex flex-col justify-between font-mono text-[9px] text-text-secondary">
                  <div>► Enrolled Fleet: 840 units</div>
                  <div>► Active Emergencies: 00</div>
                  <div className="text-brand-success font-bold">► AI Loop Security status: NOMINAL</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
                <div className="flex justify-between items-center text-brand-navy">
                  <span className="font-extrabold text-[10px] uppercase">Telemetry Cluster</span>
                  <span className="text-[8px] font-mono text-brand-primary">Streaming</span>
                </div>
                <div className="h-24 bg-white border border-slate-200/50 rounded-lg p-2.5 flex items-center justify-around">
                  <div className="text-center">
                    <span className="text-lg font-black text-brand-navy block">72</span>
                    <span className="text-[8px] text-muted block uppercase">Speed</span>
                  </div>
                  <div className="w-[1px] h-8 bg-slate-200" />
                  <div className="text-center">
                    <span className="text-lg font-black text-brand-navy block">1.02</span>
                    <span className="text-[8px] text-muted block uppercase">Gs</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
                <div className="flex justify-between items-center text-brand-navy">
                  <span className="font-extrabold text-[10px] uppercase">GIS Routing GPS</span>
                  <span className="w-2 h-2 rounded-full bg-brand-primary animate-ping" />
                </div>
                <div className="h-24 bg-slate-950 border border-slate-900 rounded-lg p-2 flex items-center justify-center font-mono text-[8px] text-emerald-400 text-center">
                  <div>
                    GPS CONNECTED<br/>
                    <span className="text-[7px] text-slate-500 block mt-1">37.7749° N, -122.4194° W</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom launcher prompt */}
            <div className="border-t border-slate-100 pt-6 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-text-secondary font-medium">
                Try the full simulation yourself. Instantly switch dashboard roles in our developer sandbox.
              </p>
              <Link 
                href="/login"
                className="px-6 py-3 bg-brand-primary hover:bg-brand-light text-white text-xs font-black uppercase rounded-xl transition-all shadow-md shadow-blue-500/10"
              >
                Launch Sandbox HUD
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 11 — FUTURE VISION */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-black uppercase tracking-widest text-brand-primary">Topological Roadmap</span>
          <h2 className="text-4xl font-extrabold text-brand-navy tracking-tight leading-tight">
            The Future of Road Safety
          </h2>
          <p className="text-text-secondary font-medium">
            Explore the future specifications in our smart city deployment timeline.
          </p>
        </div>

        {/* Future Specifications grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-3">
            <Eye className="w-7 h-7 text-brand-primary" />
            <h4 className="font-extrabold text-sm text-brand-navy leading-tight">Driver Fatigue Detection</h4>
            <p className="text-xs text-text-secondary leading-relaxed font-medium">
              Visual iris analyzers that evaluate blink duration limits, sending drowsiness warning triggers before fatigue pings occur.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-3">
            <LineChart className="w-7 h-7 text-brand-primary" />
            <h4 className="font-extrabold text-sm text-brand-navy leading-tight">AI Crash Prediction</h4>
            <p className="text-xs text-text-secondary leading-relaxed font-medium">
              Uses historic city traffic logs to alert drivers of high-probability incident nodes on their active route.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-3">
            <Volume2 className="w-7 h-7 text-brand-primary" />
            <h4 className="font-extrabold text-sm text-brand-navy leading-tight">Voice Emergency Assistant</h4>
            <p className="text-xs text-text-secondary leading-relaxed font-medium">
              Integrates in-cabin voice processors that verify driver consciousness through auditory safe check responses.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-3">
            <Building className="w-7 h-7 text-brand-primary" />
            <h4 className="font-extrabold text-sm text-brand-navy leading-tight">Hospital Integration API</h4>
            <p className="text-xs text-text-secondary leading-relaxed font-medium">
              Routes vehicle diagnostic and speed telemetry directly to operating rooms, speeding up surgeon calibrations.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-3">
            <Compass className="w-7 h-7 text-brand-primary" />
            <h4 className="font-extrabold text-sm text-brand-navy leading-tight">Smart Helmet Integrations</h4>
            <p className="text-xs text-text-secondary leading-relaxed font-medium">
              Locks motorcycle ignition controls if safety helmet locks are uncoupled, enforcing maximum riders safety.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-3">
            <Activity className="w-7 h-7 text-brand-primary" />
            <h4 className="font-extrabold text-sm text-brand-navy leading-tight">Smart City Connected Corridors</h4>
            <p className="text-xs text-text-secondary leading-relaxed font-medium">
              Bypasses standard city traffic lights during an emergency alert, locking traffic lines green for oncoming ambulance paths.
            </p>
          </div>

        </div>
      </section>

      {/* SECTION 12 — FINAL CALL TO ACTION */}
      <section className="bg-brand-navy text-white py-24 relative overflow-hidden">
        {/* Glow background */}
        <div className="absolute inset-0 bg-blue-600/10 pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center px-6 space-y-8 relative z-10">
          <span className="text-xs font-black uppercase tracking-widest text-brand-light block">Ecosystem Invitation</span>
          
          <h2 className="text-4xl md:text-5xl font-black leading-tight tracking-tight">
            Technology Should Save Lives Before It's Too Late.
          </h2>
          
          <p className="text-slate-300 max-w-2xl mx-auto text-sm leading-relaxed font-semibold">
            RoadSOS is redefining emergency response by combining Artificial Intelligence, IoT, and real-time rescue coordination into one intelligent ecosystem.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link 
              href="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-white text-brand-navy hover:bg-slate-50 transition-all text-center shadow-md text-xs uppercase tracking-wider"
            >
              Launch Dashboard
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold border border-slate-700 bg-brand-navy/60 hover:bg-brand-navy text-white transition-all text-center shadow-sm text-xs uppercase tracking-wider"
            >
              Explore Technology
            </Link>
            <button
              onClick={() => {
                if (typeof window !== "undefined") {
                  alert("Connecting to the RoadSOS Security and Partnership EOC... Email: partner@roadsos.org");
                }
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-transparent border-none text-brand-light hover:text-white transition-all text-center text-xs uppercase tracking-wider"
            >
              Contact Team
            </button>
          </div>
        </div>
      </section>

      {/* Footer copyright */}
      <footer className="bg-slate-950 text-slate-500 py-12 border-t border-slate-900 text-xs font-mono text-center">
        <div className="max-w-7xl mx-auto px-6 space-y-2">
          <p>© 2026 RoadSOS Inc. saving road accident lives globally through AI and IoT coordination networks.</p>
          <p className="text-[10px] text-slate-700 uppercase font-bold tracking-widest">Autonomous Safety Standard Compliant</p>
        </div>
      </footer>

    </div>
  );
}
