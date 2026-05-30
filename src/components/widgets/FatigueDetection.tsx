"use client";

import React from "react";
import { useRoadSos } from "@/context/RoadSosContext";
import { useAuth } from "@/context/AuthContext";
import { Eye, ShieldAlert, Sparkles, Clock, Compass } from "lucide-react";

export default function FatigueDetection() {
  const { user } = useAuth();
  const { telemetry, fatigueAlert, simulateFatigue } = useRoadSos();

  const isDrowsy = telemetry.driverFatigueScore > 75;

  return (
    <div className="glass-card p-6 bg-white relative overflow-hidden flex flex-col justify-between h-[360px] border-slate-200/60">
      
      {/* Blinking Hazard background glow if Alert */}
      {isDrowsy && (
        <div className="absolute inset-0 bg-red-500/5 animate-pulse pointer-events-none" />
      )}

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
        <div className="flex items-center space-x-2">
          <Eye className={`w-5 h-5 ${isDrowsy ? "text-brand-emergency animate-pulse" : "text-brand-primary"}`} />
          <div>
            <h3 className="text-sm font-black text-brand-navy leading-none">AI Fatigue Analyzer</h3>
            <span className="text-[9px] text-muted font-bold tracking-widest uppercase mt-0.5 block">Cabin Mesh Scanner</span>
          </div>
        </div>
        <span className={`w-2.5 h-2.5 rounded-full ${isDrowsy ? "bg-red-500 animate-ping" : "bg-emerald-500 animate-pulse"}`} />
      </div>

      {/* Simulated Scanner Viewport */}
      <div className="flex-1 my-4 bg-slate-950 rounded-xl relative overflow-hidden flex items-center justify-center border border-slate-800">
        
        {/* Dynamic Scan Line Grid */}
        <div className="absolute inset-0 opacity-10" 
             style={{
               backgroundImage: 'linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)',
               backgroundSize: '12px 12px'
             }} 
        />

        {/* Pulsing Target Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`w-24 h-24 rounded-full border border-dashed transition-colors duration-500 ${
            isDrowsy ? "border-red-500/50 animate-ping" : "border-emerald-500/30 animate-pulse"
          }`} />
          <div className={`w-32 h-32 absolute rounded-full border transition-colors duration-500 ${
            isDrowsy ? "border-red-500/20" : "border-emerald-500/10"
          }`} />
        </div>

        {/* Cabin scanning text overlays */}
        <div className="absolute left-3 top-3 font-mono text-[9px] text-slate-400 space-y-0.5">
          <div className="flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>IRIS TRACKER: ENABLED</span>
          </div>
          <div>SCAN LATENCY: 2ms</div>
        </div>

        <div className="absolute right-3 bottom-3 font-mono text-[9px] text-slate-400 text-right space-y-0.5">
          <div>FPS: 60.0</div>
          <div className={isDrowsy ? "text-brand-emergency font-bold" : "text-emerald-400 font-semibold"}>
            STATUS: {isDrowsy ? "DROWSINESS DETECTED" : "DRIVER ALERT"}
          </div>
        </div>

        {/* Reticle face box */}
        <div className={`w-28 h-28 border-2 rounded-lg relative flex flex-col items-center justify-center ${
          isDrowsy ? "border-red-500 animate-pulse" : "border-emerald-500/60"
        }`}>
          {/* Corner brackets */}
          <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-inherit" />
          <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-inherit" />
          <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-inherit" />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-inherit" />
          
          <Eye className={`w-8 h-8 ${isDrowsy ? "text-brand-emergency animate-bounce" : "text-emerald-400"}`} />
          <span className="text-[8px] font-mono font-bold text-slate-300 mt-1 uppercase">Mesh Synced</span>
        </div>

      </div>

      {/* Metrics Row & Trigger */}
      <div className="shrink-0 flex items-center justify-between border-t border-slate-100 pt-3 gap-4">
        <div className="grid grid-cols-3 gap-4 w-full">
          <div className="text-center">
            <span className="text-[9px] font-black text-muted uppercase block">Risk Index</span>
            <span className={`text-base font-extrabold block ${isDrowsy ? "text-brand-emergency" : "text-brand-navy"}`}>
              {telemetry.driverFatigueScore}%
            </span>
          </div>
          <div className="text-center">
            <span className="text-[9px] font-black text-muted uppercase block">Blink Rate</span>
            <span className="text-base font-extrabold text-brand-navy block">
              {telemetry.blinkRate}/min
            </span>
          </div>
          <div className="text-center">
            <span className="text-[9px] font-black text-muted uppercase block">Yawn Count</span>
            <span className="text-base font-extrabold text-brand-navy block">
              {telemetry.yawnCount} yawns
            </span>
          </div>
        </div>

        <button
          onClick={simulateFatigue}
          className="px-4 py-2.5 rounded-lg text-[10px] font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shrink-0 uppercase tracking-wider"
        >
          Simulate
        </button>
      </div>

    </div>
  );
}
