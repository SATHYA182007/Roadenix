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
  FileSpreadsheet
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

  const activeIncidents = incidents.filter(i => i.status !== "RESOLVED");
  const totalVehiclesCount = 840; // Simulated globally
  const activeEmergenciesCount = activeIncidents.length;

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

  return (
    <div className="space-y-6">
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
                              <button
                                onClick={() => updateIncidentStatus(inc.id, "RESOLVED")}
                                className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-brand-primary text-white hover:bg-brand-light shadow-sm"
                              >
                                Resolve
                              </button>
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

      </div>
    </div>
  );
}
