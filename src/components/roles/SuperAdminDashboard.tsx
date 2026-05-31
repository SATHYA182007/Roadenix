"use client";

import React, { useState } from "react";
import { useRoadSos, EmergencyIncident } from "@/context/RoadSosContext";
import { useAuth } from "@/context/AuthContext";
import { 
  ShieldAlert, 
  Users, 
  Activity, 
  Clock, 
  Navigation, 
  CheckCircle2, 
  AlertTriangle,
  Car,
  Compass,
  Radio,
  FileSpreadsheet,
  PhoneCall,
  FileDown,
  Volume2,
  Truck,
  Heart,
  X,
  ShieldCheck,
  UserPlus
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";

export default function SuperAdminDashboard() {
  const { incidents, telemetry, updateIncidentStatus, dispatchService } = useRoadSos();
  const { user } = useAuth();
  
  const [filter, setFilter] = useState<"ALL" | "ACTIVE" | "RESOLVED">("ALL");
  const [dialingIncident, setDialingIncident] = useState<EmergencyIncident | null>(null);
  const [dialingStatus, setDialingStatus] = useState<"CONNECTING" | "CONNECTED">("CONNECTING");
  const [copiedReportId, setCopiedReportId] = useState<string | null>(null);
  const [assigningIncident, setAssigningIncident] = useState<EmergencyIncident | null>(null);

  const activeIncidents = incidents.filter(i => i.status !== "RESOLVED");
  const totalVehiclesCount = 840; // Simulated globally
  const activeEmergenciesCount = activeIncidents.length;
  const criticalIncident = activeIncidents[0];

  const filteredIncidents = incidents.filter(inc => {
    if (filter === "ACTIVE") return inc.status !== "RESOLVED";
    if (filter === "RESOLVED") return inc.status === "RESOLVED";
    return true;
  });

  // Recharts simulation data
  const chartsData = [
    { name: "00:00", activeEmergencies: 2, confidenceAvg: 94 },
    { name: "04:00", activeEmergencies: 1, confidenceAvg: 96 },
    { name: "08:00", activeEmergencies: 4, confidenceAvg: 92 },
    { name: "12:00", activeEmergencies: 3, confidenceAvg: 95 },
    { name: "16:00", activeEmergencies: 6, confidenceAvg: 98 },
    { name: "20:00", activeEmergencies: activeEmergenciesCount, confidenceAvg: 97 },
  ];
  const handleCallDriver = (inc: EmergencyIncident) => {
    setDialingIncident(inc);
    setDialingStatus("CONNECTING");
    setTimeout(() => {
      setDialingStatus("CONNECTED");
    }, 1500);
  };

  const handleCopyReport = (inc: EmergencyIncident) => {
    const isBike = inc.vehicleType === "BIKE";
    const reportText = `🚨 ACCIDENT DETECTED
Vehicle Type: ${isBike ? "BIKE" : "CAR"}
Speed: 0 km/h (Impact deceleration event)
Impact Force: 6.8 G
Driver: ${inc.driverName}
Blood Group: O+
GPS: ${inc.latitude}, ${inc.longitude}
Status: Emergency Services Dispatched
Additional Data: [Incident ID: ${inc.id} | AI Confidence: ${inc.accidentConfidence}% | Severity: ${inc.severity} | Time: ${new Date(inc.timestamp).toLocaleTimeString()}]`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(reportText);
      setCopiedReportId(inc.id);
      setTimeout(() => {
        setCopiedReportId(null);
      }, 3000);
    }
  };

  return (
    <div className="space-y-6 relative">
      
      {/* 📞 CALL DIALER POPUP SIMULATOR OVERLAY */}
      {dialingIncident && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-lg flex items-center justify-center p-4">
          <div className="w-full max-w-sm glass-card bg-slate-900 border-slate-800 p-6 text-center space-y-6 shadow-2xl relative overflow-hidden">
            {/* Blinking Top Red Dot */}
            <div className="absolute top-4 right-4 flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-emergency animate-ping" />
              <span className="text-[9px] font-black text-slate-500 tracking-widest uppercase">EOC Encrypted</span>
            </div>

            <div className="space-y-1.5 pt-4">
              <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700/60 flex items-center justify-center mx-auto text-brand-primary animate-pulse">
                <PhoneCall className="w-7 h-7" />
              </div>
              <h3 className="text-sm font-black text-white tracking-tight uppercase">ESP32 Secure Voice Node</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Driver Terminal: {dialingIncident.driverName}</p>
            </div>

            {/* Voice frequencies micro-graphics */}
            <div className="flex items-center justify-center gap-1.5 h-12">
              {dialingStatus === "CONNECTING" ? (
                <div className="text-[10px] font-extrabold text-brand-warning animate-pulse uppercase tracking-widest">
                  SYNCHRONIZING CALL GATEWAY...
                </div>
              ) : (
                <div className="flex items-end justify-center gap-1 h-8 w-full px-6">
                  {[0.5, 0.2, 0.8, 0.4, 0.9, 0.3, 0.7, 0.1, 0.6, 0.4, 0.8].map((delay, idx) => (
                    <div 
                      key={idx} 
                      className="bg-brand-success w-1.5 rounded-full transition-all"
                      style={{ 
                        height: `${Math.floor(delay * 100)}%`,
                        animation: `pulse 1.2s infinite ease-in-out alternate`,
                        animationDelay: `${delay}s`
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-1 text-slate-350 text-[11px] font-semibold bg-slate-950/40 p-3 rounded-xl border border-slate-850">
              <div className="flex justify-between"><span>Status:</span> <span className={dialingStatus === "CONNECTED" ? "text-brand-success font-black" : "text-brand-warning font-black animate-pulse"}>{dialingStatus}</span></div>
              <div className="flex justify-between"><span>IP Payload:</span> <span>10.0.12.84:5060</span></div>
              <div className="flex justify-between"><span>Active Node:</span> <span className="font-mono">esp32_sos_core</span></div>
            </div>

            <button
              onClick={() => setDialingIncident(null)}
              className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-750 text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition-all active:scale-95 cursor-pointer"
            >
              Hang Up Secure Call
            </button>
          </div>
        </div>
      )}

      {/* 🚨 LIVE EOC ACTIVE INCIDENT CRITICAL COCKPIT */}
      {criticalIncident && (
        <div className="p-5.5 rounded-3xl bg-gradient-to-br from-red-500/10 via-slate-900/90 to-slate-950 border border-brand-emergency/35 shadow-[0_0_25px_rgba(239,68,68,0.2)] animate-pulse relative overflow-hidden space-y-5">
          {/* Overlay Grid lines */}
          <div className="absolute inset-0 opacity-5 pointer-events-none" 
               style={{
                 backgroundImage: 'linear-gradient(#ef4444 1px, transparent 1px), linear-gradient(90deg, #ef4444 1px, transparent 1px)',
                 backgroundSize: '20px 20px'
               }} 
          />

          {/* Heading */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 relative z-10">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-emergency animate-ping" />
              <h2 className="text-sm font-black uppercase text-brand-emergency tracking-widest">EOC Live Dispatch Command Center</h2>
              <span className="px-2 py-0.5 rounded text-[8px] font-black tracking-widest uppercase bg-brand-emergency/25 text-brand-emergency border border-brand-emergency/30">
                CRITICAL EMERGENCY BLOCK
              </span>
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
              Vector Lock Coordinate Packet: {criticalIncident.latitude.toFixed(4)}° N, {criticalIncident.longitude.toFixed(4)}° W
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative z-10 text-[11px] font-semibold text-slate-300">
            
            {/* Block 1: Driver Specs */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center space-x-2 border-b border-white/5 pb-2 mb-1">
                <Users className="w-4 h-4 text-brand-primary" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Driver Specs</span>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between"><span>Driver Name:</span> <span className="text-white font-extrabold">{criticalIncident.driverName}</span></div>
                <div className="flex justify-between"><span>Contact Phone:</span> <span className="text-white font-extrabold">{criticalIncident.driverPhone}</span></div>
                <div className="flex justify-between"><span>Blood Group:</span> <span className="text-brand-emergency font-black">{user?.bloodGroup || "O+"}</span></div>
                <div className="flex justify-between"><span>Vehicle Details:</span> <span className="text-brand-primary font-black uppercase">{criticalIncident.vehicleType} SPEC</span></div>
              </div>
            </div>

            {/* Block 2: Crash Metrics */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center space-x-2 border-b border-white/5 pb-2 mb-1">
                <Activity className="w-4 h-4 text-brand-warning animate-pulse" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Telemetry Vitals</span>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between"><span>G-Spike Impact:</span> <span className="text-brand-emergency font-extrabold">6.8 G</span></div>
                <div className="flex justify-between"><span>Telemetry Velocity:</span> <span className="text-white font-extrabold">0 km/h</span></div>
                <div className="flex justify-between"><span>AI Classification:</span> <span className="text-brand-warning font-extrabold">{criticalIncident.accidentConfidence}% Confident</span></div>
                <div className="flex justify-between"><span>Nearest Hospital:</span> <span className="text-brand-success font-extrabold">SF General Emergency</span></div>
              </div>
            </div>

            {/* Block 3: EOC Status & Action buttons */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 border-b border-white/5 pb-2 mb-1">
                  <ShieldAlert className="w-4 h-4 text-brand-emergency" />
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">CAD Allocation status</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between"><span>Current Phase:</span> <span className="px-2 py-0.5 rounded bg-brand-emergency/20 text-brand-emergency font-black uppercase text-[9px]">{criticalIncident.status}</span></div>
                  <div className="flex justify-between"><span>Time Elapsed:</span> <span className="text-white font-mono">03m:14s</span></div>
                </div>
              </div>
            </div>

          </div>

          {/* EOC Action Triggers buttons row */}
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-white/5 relative z-10">
            
            <button
              onClick={() => handleCallDriver(criticalIncident)}
              className="px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-light text-white font-extrabold text-[11px] uppercase tracking-wider shadow-sm flex items-center space-x-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call Voice Node</span>
            </button>

            <button
              onClick={() => dispatchService(criticalIncident.id, "ambulance")}
              className={`px-4 py-2 rounded-xl text-[11px] font-extrabold uppercase tracking-wider border transition-all flex items-center space-x-1.5 ${
                criticalIncident.servicesDispatched.ambulance 
                  ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400 shadow-inner" 
                  : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 cursor-pointer"
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>EMT Ambulance</span>
            </button>

            <button
              onClick={() => dispatchService(criticalIncident.id, "police")}
              className={`px-4 py-2 rounded-xl text-[11px] font-extrabold uppercase tracking-wider border transition-all flex items-center space-x-1.5 ${
                criticalIncident.servicesDispatched.police 
                  ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400 shadow-inner" 
                  : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 cursor-pointer"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Patrol Units</span>
            </button>

            <button
              onClick={() => dispatchService(criticalIncident.id, "fire")}
              className={`px-4 py-2 rounded-xl text-[11px] font-extrabold uppercase tracking-wider border transition-all flex items-center space-x-1.5 ${
                criticalIncident.servicesDispatched.fire 
                  ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400 shadow-inner" 
                  : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 cursor-pointer"
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Rescue Squad</span>
            </button>

            <button
              onClick={() => handleCopyReport(criticalIncident)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-[11px] uppercase tracking-wider flex items-center space-x-1.5 transition-all active:scale-95 ml-auto cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>{copiedReportId === criticalIncident.id ? "Report Copied ✓" : "Copy SOS Report"}</span>
            </button>

            {criticalIncident.assignedTeamName ? (
              <div className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-brand-success font-extrabold text-[11px] uppercase tracking-wider flex items-center space-x-1.5 shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-success" />
                <span>Assigned: {criticalIncident.assignedTeamName}</span>
              </div>
            ) : (
              <button
                onClick={() => setAssigningIncident(criticalIncident)}
                className="px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-light text-white font-extrabold text-[11px] uppercase tracking-wider shadow-md flex items-center space-x-1.5 transition-all active:scale-95 cursor-pointer animate-pulse"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Assign Job</span>
              </button>
            )}

          </div>

        </div>
      )}
      {/* Top executive KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* KPI 1: Active Emergencies */}
        <div className="glass-card p-6 border-red-500/10 flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-black text-muted uppercase tracking-wider block">Active SOS Alerts</span>
            <span className="text-3xl font-extrabold text-brand-navy block">
              {activeEmergenciesCount}
            </span>
            <span className="text-[10px] font-bold text-brand-emergency flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
              <span>Real-time Broadcast</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-brand-emergency shadow-inner">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        {/* KPI 2: Total Registered Vehicles */}
        <div className="glass-card p-6 border-blue-500/5 flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-black text-muted uppercase tracking-wider block">Monitored Fleet</span>
            <span className="text-3xl font-extrabold text-brand-navy block">
              {totalVehiclesCount}
            </span>
            <span className="text-[10px] font-bold text-brand-success">
              +12 Added This Hour
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-brand-primary shadow-inner">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 3: Global System Health */}
        <div className="glass-card p-6 border-blue-500/5 flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-black text-muted uppercase tracking-wider block">Ecosystem Health</span>
            <span className="text-3xl font-extrabold text-brand-navy block">
              99.98%
            </span>
            <span className="text-[10px] font-bold text-brand-success">
              ESP32 Ping: 14ms
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-brand-success shadow-inner">
            <Activity className="w-6 h-6 animate-bounce" />
          </div>
        </div>

        {/* KPI 4: Avg Dispatch Time */}
        <div className="glass-card p-6 border-blue-500/5 flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-black text-muted uppercase tracking-wider block">Avg Dispatch Response</span>
            <span className="text-3xl font-extrabold text-brand-navy block">
              4.2m
            </span>
            <span className="text-[10px] font-bold text-brand-success">
              Goal: &lt; 5 Minutes
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-text-secondary shadow-inner">
            <Clock className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Main Section: Operations list vs Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Active Operations List Drawer */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-card p-6 bg-white">
            
            {/* Header controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 mb-4 gap-4">
              <div>
                <h3 className="text-base font-black text-brand-navy">Ecosystem Incident Registry</h3>
                <p className="text-xs text-text-secondary mt-0.5">Track, allocate, and resolve vehicle accidents.</p>
              </div>

              {/* Filter Tabs */}
              <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => setFilter("ALL")}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    filter === "ALL" ? "bg-white text-brand-primary shadow-sm" : "text-text-secondary"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter("ACTIVE")}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    filter === "ACTIVE" ? "bg-white text-brand-primary shadow-sm" : "text-text-secondary"
                  }`}
                >
                  Active ({activeEmergenciesCount})
                </button>
                <button
                  onClick={() => setFilter("RESOLVED")}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    filter === "RESOLVED" ? "bg-white text-brand-primary shadow-sm" : "text-text-secondary"
                  }`}
                >
                  Resolved
                </button>
              </div>
            </div>

            {/* List */}
            <div className="space-y-4">
              {filteredIncidents.length === 0 ? (
                <div className="p-8 text-center text-sm font-semibold text-muted bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                  No registered incidents matched this query.
                </div>
              ) : (
                filteredIncidents.map((inc) => {
                  const isResolved = inc.status === "RESOLVED";
                  const isBike = inc.vehicleType === "BIKE";
                  
                  return (
                    <div 
                      key={inc.id} 
                      className={`p-5 rounded-2xl border transition-all ${
                        isResolved 
                          ? "bg-slate-50/50 border-slate-200/50" 
                          : "bg-red-50/20 border-red-200/40 shadow-sm"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        
                        {/* Driver info */}
                        <div className="flex items-start space-x-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-inner mt-0.5 ${
                            isResolved ? "bg-slate-100 text-text-secondary" : "bg-red-100 text-brand-emergency animate-pulse"
                          }`}>
                            {isBike ? <Compass className="w-5 h-5" /> : <Car className="w-5 h-5" />}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-extrabold text-sm text-brand-navy">{inc.driverName}</span>
                              <span className="text-[10px] font-bold text-muted font-mono bg-slate-100 px-1.5 py-0.5 rounded">
                                {inc.id}
                              </span>
                            </div>
                            <div className="text-xs text-text-secondary mt-0.5 font-semibold">
                              {inc.driverPhone} • {new Date(inc.timestamp).toLocaleTimeString()}
                            </div>
                            <div className="text-xs font-bold text-brand-emergency mt-1 flex items-center space-x-1">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              <span>{inc.accidentReason}</span>
                            </div>
                          </div>
                        </div>

                        {/* Dispatch Allocator */}
                        <div className="flex flex-col sm:items-end justify-between gap-2 shrink-0">
                          {/* Status Badge */}
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide self-start sm:self-auto ${
                            isResolved 
                              ? "bg-emerald-100 text-brand-success" 
                              : "bg-red-100 text-brand-emergency animate-pulse"
                          }`}>
                            {inc.status}
                          </span>

                          {/* Quick controls */}
                          {!isResolved && (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => dispatchService(inc.id, "ambulance")}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                                  inc.servicesDispatched.ambulance 
                                    ? "bg-emerald-50 border-brand-success text-brand-success" 
                                    : "bg-white border-slate-200 text-text-secondary hover:bg-slate-50"
                                }`}
                              >
                                EMT
                              </button>
                              <button
                                onClick={() => dispatchService(inc.id, "police")}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                                  inc.servicesDispatched.police 
                                    ? "bg-emerald-50 border-brand-success text-brand-success" 
                                    : "bg-white border-slate-200 text-text-secondary hover:bg-slate-50"
                                }`}
                              >
                                Police
                              </button>
                              <button
                                onClick={() => dispatchService(inc.id, "fire")}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                                  inc.servicesDispatched.fire 
                                    ? "bg-emerald-50 border-brand-success text-brand-success" 
                                    : "bg-white border-slate-200 text-text-secondary hover:bg-slate-50"
                                }`}
                              >
                                Fire
                              </button>
                              {inc.assignedTeamName ? (
                                <span className="px-2.5 py-1 text-[9px] font-extrabold text-brand-success bg-emerald-50 border border-emerald-100 rounded-lg">
                                  Assigned: {inc.assignedTeamName}
                                </span>
                              ) : (
                                <button
                                  onClick={() => setAssigningIncident(inc)}
                                  className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-brand-primary text-white hover:bg-brand-light shadow-sm cursor-pointer"
                                >
                                  Assign Job
                                </button>
                              )}
                            </div>
                          )}
                        </div>

                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>
        </div>

        {/* Analytics & AI reports sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-6 bg-white space-y-6">
            <div>
              <h3 className="text-base font-black text-brand-navy">AI Accident Probability</h3>
              <p className="text-xs text-text-secondary mt-0.5">Historical verification telemetry stats.</p>
            </div>

            {/* Time Chart Area */}
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartsData}>
                  <defs>
                    <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="activeEmergencies" stroke="#2563EB" fillOpacity={1} fill="url(#colorActive)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Confidence statistics bars */}
            <div className="space-y-3 border-t border-slate-100 pt-4">
              <span className="text-[10px] font-black text-muted uppercase tracking-wider block">AI Classification Factors</span>
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-brand-navy">
                  <span>Sensor Impact G-Forces</span>
                  <span>96% Accuracy</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-brand-primary h-full rounded-full" style={{ width: "96%" }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-brand-navy">
                  <span>Tilt Anomaly Detection</span>
                  <span>92% Accuracy</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-brand-light h-full rounded-full" style={{ width: "92%" }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-brand-navy">
                  <span>Telemetry Packet Stream</span>
                  <span>99% Accuracy</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-brand-success h-full rounded-full" style={{ width: "99%" }} />
                </div>
              </div>
            </div>

          </div>
        </div>

      {/* 🚑 ASSIGN HELPER TEAM MODAL POPUP */}
      {assigningIncident && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-lg flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-card bg-white/95 border-slate-200 p-6 shadow-2xl relative space-y-5 text-left text-slate-700">
            <div>
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setAssigningIncident(null)}
                  className="p-1 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-brand-navy transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <h3 className="text-sm font-black text-brand-navy tracking-tight uppercase">Assign Helper Team</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                Dispatch standby paramedic crew to Incident {assigningIncident.id}
              </p>
            </div>

            <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar">
              {[
                { id: "responder-789", name: "Rescue Helper Team Alpha (Medic-14)", type: "AMBULANCE" },
                { id: "team-beta", name: "Rescue Helper Team Beta (Medic-09)", type: "AMBULANCE" },
                { id: "team-patrol", name: "Police Patrol Squad Alpha", type: "PATROL" },
                { id: "team-engine", name: "Fire Engine Rescue Charlie", type: "ENGINE" },
              ].map((team) => {
                const busy = incidents.some(
                  (inc) =>
                    inc.assignedTeamId === team.id &&
                    inc.status !== "RESOLVED" &&
                    inc.status !== "ARCHIVED"
                );
                return (
                  <div
                    key={team.id}
                    className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-semibold ${
                      busy
                        ? "bg-slate-50/50 border-slate-100 opacity-60 text-slate-400"
                        : "bg-slate-50 border-slate-200 text-brand-navy shadow-sm"
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="font-extrabold text-brand-navy flex items-center space-x-2">
                        <span>{team.name}</span>
                        <span className="text-[8px] font-mono font-bold bg-white border border-slate-200 px-1 rounded text-slate-400">
                          {team.type}
                        </span>
                      </div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                        {busy ? "BUSY • ON MISSION" : "FREE • STANDBY"}
                      </p>
                    </div>

                    {!busy ? (
                      <button
                        onClick={() => {
                          updateIncidentStatus(assigningIncident.id, "ASSIGNED", {
                            assignedTeamId: team.id,
                            assignedTeamName: team.name,
                            helperStatus: "Assigned",
                            routeProgress: 0,
                            etaMinutes: 10,
                          });
                          setAssigningIncident(null);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-brand-primary hover:bg-brand-light text-white text-[10px] font-black uppercase tracking-wider shadow-sm transition-all active:scale-95 cursor-pointer"
                      >
                        Assign
                      </button>
                    ) : (
                      <span className="px-2 py-1 rounded bg-slate-100 text-[9px] font-black text-slate-450 uppercase tracking-widest">
                        Allocated
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => setAssigningIncident(null)}
                className="w-full py-2 rounded-xl text-xs font-bold border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel Dispatch
              </button>
            </div>
          </div>
        </div>
      )}

      </div>
    </div>
  );
}
