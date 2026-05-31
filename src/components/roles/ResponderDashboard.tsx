"use client";

import React, { useState } from "react";
import { useRoadSos, EmergencyIncident } from "@/context/RoadSosContext";
import { 
  ShieldAlert, 
  Truck, 
  MapPin, 
  Clock, 
  Activity, 
  Heart, 
  CheckCircle2, 
  AlertTriangle,
  Navigation,
  Phone,
  Compass,
  ArrowRight
} from "lucide-react";
import GisTrackingMap from "@/components/maps/GisTrackingMap";

export default function ResponderDashboard() {
  const { incidents, updateIncidentStatus, addTerminalLog } = useRoadSos();
  const activeAlerts = incidents.filter(i => i.status !== "RESOLVED");
  const activeMission = activeAlerts[0]; // Active critical mission

  const [navigationLocked, setNavigationLocked] = useState(false);

  // Paramedic crew standby registry
  const paramedicCrews = [
    { name: "Rescue Team Alpha (Medic-14)", type: "AMBULANCE", status: "ON SCENE", incident: "inc-104", color: "text-brand-emergency bg-red-100" },
    { name: "Paramedics Division 4B", type: "AMBULANCE", status: "ROUTING", incident: "inc-103", color: "text-brand-warning bg-amber-100" },
    { name: "Rescue Team Beta (Medic-09)", type: "AMBULANCE", status: "STANDBY", incident: "None", color: "text-brand-success bg-emerald-100" },
    { name: "Police Patrol Squad Alpha", type: "PATROL", status: "STANDBY", incident: "None", color: "text-brand-success bg-emerald-100" },
    { name: "Fire Engine Rescue Charlie", type: "ENGINE", status: "STANDBY", incident: "None", color: "text-brand-success bg-emerald-100" },
  ];

  const handleAcceptMission = () => {
    if (!activeMission) return;
    updateIncidentStatus(activeMission.id, "DISPATCHED");
    addTerminalLog(`Responder Action: Mission Accepted for Incident ${activeMission.id}. Routing initiated.`, "success");
  };

  const handleLockNavigation = () => {
    if (!activeMission) return;
    setNavigationLocked(true);
    addTerminalLog(`GPS Link Synchronized: Vector targets locked to coordinates: ${activeMission.latitude.toFixed(4)}° N, ${activeMission.longitude.toFixed(4)}° W. Smart city lights pre-cleared.`, "success");
    setTimeout(() => {
      setNavigationLocked(false);
    }, 4000);
  };

  const handleAdvanceStatus = () => {
    if (!activeMission) return;
    const flow: Record<EmergencyIncident["status"], EmergencyIncident["status"]> = {
      REPORTED: "DISPATCHED",
      DISPATCHED: "ON_SCENE",
      ON_SCENE: "PATIENT_SECURED",
      PATIENT_SECURED: "RESOLVED",
      RESOLVED: "RESOLVED",
    };
    const nextStatus = flow[activeMission.status];
    updateIncidentStatus(activeMission.id, nextStatus);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* 🚨 LIVE EMS ACTIVE MISSION DESK */}
      {activeMission && (
        <div className="glass-card p-6 border-red-500/25 bg-gradient-to-br from-red-500/[0.03] to-white relative overflow-hidden space-y-5 shadow-2xl">
          
          {/* Accent top gradient indicator bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 to-amber-500 animate-pulse" />

          {/* Heading */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3.5 mb-2 gap-3">
            <div className="flex items-center space-x-2">
              <Truck className="w-5 h-5 text-brand-emergency animate-bounce shrink-0" />
              <h2 className="text-sm font-black text-brand-navy uppercase tracking-widest">Active Dispatch Mission Cockpit</h2>
              <span className="px-2 py-0.5 rounded text-[8px] font-black tracking-widest bg-red-150 text-brand-emergency border border-red-200/50 uppercase">
                Assigned
              </span>
            </div>
            
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">
              Target ID: {activeMission.id} • Lat: {activeMission.latitude.toFixed(4)}° • Lng: {activeMission.longitude.toFixed(4)}°
            </div>
          </div>

          {/* Layout Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[11px] font-semibold text-text-secondary">
            
            {/* Left: Driver profile */}
            <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-3 flex flex-col justify-between">
              <div>
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2 flex items-center space-x-1.5">
                  <Heart className="w-3.5 h-3.5 text-brand-emergency" />
                  <span>Target Driver Profile</span>
                </h4>
                <div className="space-y-1.5">
                  <div className="flex justify-between border-b border-slate-100 pb-1"><span>Full Name:</span> <span className="text-brand-navy font-extrabold">{activeMission.driverName}</span></div>
                  <div className="flex justify-between border-b border-slate-100 pb-1"><span>Contact Phone:</span> <span className="text-brand-navy font-extrabold">{activeMission.driverPhone}</span></div>
                  <div className="flex justify-between border-b border-slate-100 pb-1"><span>Emergency Contact:</span> <span className="text-brand-navy font-extrabold">David Jenkins (Spouse)</span></div>
                  <div className="flex justify-between"><span>Blood Group:</span> <span className="text-brand-emergency font-extrabold">O+ (CRITICAL ADVISORY)</span></div>
                </div>
              </div>
            </div>

            {/* Right: Stepper and vectors */}
            <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-3 flex flex-col justify-between">
              <div>
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2 flex items-center space-x-1.5">
                  <Compass className="w-3.5 h-3.5 text-brand-primary" />
                  <span>EOC Stage Stepper</span>
                </h4>
                
                {/* Stepper Graphic */}
                <div className="grid grid-cols-4 p-1.5 bg-white border border-slate-200/50 rounded-xl text-center text-[9px] font-black tracking-tight text-slate-400">
                  <div className={`py-1 rounded-lg ${activeMission.status === "REPORTED" ? "bg-red-500 text-white shadow-sm" : "text-brand-emergency font-bold"}`}>REPORTED</div>
                  <div className={`py-1 rounded-lg ${activeMission.status === "DISPATCHED" ? "bg-amber-500 text-white shadow-sm" : activeMission.status !== "REPORTED" ? "text-amber-600 font-bold" : ""}`}>DISPATCHED</div>
                  <div className={`py-1 rounded-lg ${activeMission.status === "ON_SCENE" ? "bg-blue-500 text-white shadow-sm" : activeMission.status === "PATIENT_SECURED" ? "text-blue-600 font-bold" : ""}`}>ON SCENE</div>
                  <div className={`py-1 rounded-lg ${activeMission.status === "PATIENT_SECURED" ? "bg-emerald-500 text-white shadow-sm" : ""}`}>SECURED</div>
                </div>

                <div className="space-y-1.5 mt-3.5">
                  <div className="flex justify-between border-b border-slate-100 pb-1"><span>Current Stage:</span> <span className="text-brand-navy font-black uppercase text-[10px]">{activeMission.status.replace("_", " ")}</span></div>
                  <div className="flex justify-between"><span>Accident Trigger:</span> <span className="text-brand-emergency font-extrabold truncate max-w-[190px]">{activeMission.accidentReason}</span></div>
                </div>
              </div>
            </div>

          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100">
            
            {activeMission.status === "REPORTED" && (
              <button
                onClick={handleAcceptMission}
                className="px-4 py-2.5 rounded-xl bg-brand-navy hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider flex items-center space-x-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-brand-success" />
                <span>Accept Incident Mission</span>
              </button>
            )}

            {activeMission.status !== "REPORTED" && (
              <button
                onClick={handleAdvanceStatus}
                className="px-4 py-2.5 rounded-xl bg-brand-navy hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider flex items-center space-x-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <span>Advance Rescue Status</span>
                <ArrowRight className="w-4 h-4 text-brand-primary animate-pulse" />
              </button>
            )}

            <button
              onClick={handleLockNavigation}
              className={`px-4 py-2.5 rounded-xl border text-xs font-extrabold uppercase tracking-wider flex items-center space-x-1.5 transition-all active:scale-95 ${
                navigationLocked 
                  ? "bg-emerald-50 border-brand-success text-brand-success shadow-inner" 
                  : "bg-white border-slate-200 text-slate-650 hover:bg-slate-50 cursor-pointer"
              }`}
            >
              <Navigation className="w-4 h-4 text-brand-primary animate-pulse" />
              <span>{navigationLocked ? "Vectors Locked" : "Lock Map GPS Vector"}</span>
            </button>

            <button
              onClick={() => updateIncidentStatus(activeMission.id, "RESOLVED")}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-md flex items-center space-x-1.5 transition-all active:scale-95 ml-auto cursor-pointer animate-pulse"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Rescue Complete (Mark Safe)</span>
            </button>

          </div>

        </div>
      )}

      {/* 🚀 EMT Operational Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Active emergencies load */}
        <div className="glass-card p-5 bg-white border-slate-200/60 flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Active Alarm Load</span>
            <div className="text-2xl font-black text-brand-navy leading-none">
              {activeAlerts.length} Active
            </div>
            <span className="text-[9px] font-bold text-brand-emergency block uppercase tracking-wider animate-pulse">
              Corridors Armed
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-50 text-brand-emergency flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5.5 h-5.5 animate-bounce" />
          </div>
        </div>

        {/* Avg Response Time */}
        <div className="glass-card p-5 bg-white border-slate-200/60 flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Avg Response Latency</span>
            <div className="text-2xl font-black text-brand-primary leading-none">
              4.2 Minutes
            </div>
            <span className="text-[9px] font-bold text-brand-success block uppercase tracking-wider">
              Optimal Sector 4
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-primary flex items-center justify-center shrink-0">
            <Clock className="w-5.5 h-5.5 animate-pulse" />
          </div>
        </div>

        {/* Dispatch success */}
        <div className="glass-card p-5 bg-white border-slate-200/60 flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Dispatch Success Rate</span>
            <div className="text-2xl font-black text-brand-success leading-none">
              99.85%
            </div>
            <span className="text-[9px] font-bold text-muted block uppercase tracking-wider font-mono">
              1,424 Safety Logs
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-brand-success flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5.5 h-5.5" />
          </div>
        </div>

        {/* Active Responders */}
        <div className="glass-card p-5 bg-white border-slate-200/60 flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Active Responders</span>
            <div className="text-2xl font-black text-brand-navy leading-none">
              5 Crews
            </div>
            <span className="text-[9px] font-bold text-brand-success block uppercase tracking-wider">
              100% Standby Loop
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-50 text-brand-navy flex items-center justify-center shrink-0">
            <Truck className="w-5.5 h-5.5" />
          </div>
        </div>

      </div>

      {/* 📍 Live Topographic Map and Standby crew list */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Live GPS Map */}
        <div className="lg:col-span-7">
          <GisTrackingMap />
        </div>

        {/* Crew list */}
        <div className="lg:col-span-5 glass-card p-6 bg-white flex flex-col justify-between min-h-[380px]">
          <div>
            <h3 className="text-base font-black text-brand-navy mb-1">Rescue Crew Directory</h3>
            <p className="text-xs text-text-secondary">Standby registries and active EMS incident allocations.</p>

            <div className="space-y-3 mt-4">
              {paramedicCrews.map((crew) => (
                <div key={crew.name} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs font-semibold text-brand-navy">
                  <div className="min-w-0">
                    <div className="font-extrabold truncate">{crew.name}</div>
                    <div className="text-[9px] font-mono text-slate-400 mt-0.5 tracking-wider uppercase">{crew.type}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black tracking-wider uppercase ${crew.color}`}>
                      {crew.status}
                    </span>
                    {crew.incident !== "None" && (
                      <span className="text-[8px] font-mono text-muted block mt-1">Incident: {crew.incident}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3 mt-4 text-[9px] font-mono text-slate-400 flex items-center space-x-1">
            <Activity className="w-3.5 h-3.5 text-brand-primary animate-pulse" />
            <span>Response networks 100% synchronized with smart-city override signals.</span>
          </div>
        </div>

      </div>
    </div>
  );
}
