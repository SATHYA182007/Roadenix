"use client";

import React, { useState } from "react";
import { useRoadSos } from "@/context/RoadSosContext";
import { 
  MapPin, 
  Navigation, 
  Layers, 
  Plus, 
  Minus, 
  Maximize2, 
  Radio,
  Truck,
  Heart
} from "lucide-react";

export default function GisTrackingMap() {
  const { incidents, telemetry } = useRoadSos();
  const [mapType, setMapType] = useState<"VECTOR" | "SATELLITE" | "TERRAIN">("VECTOR");
  const [zoom, setZoom] = useState(14);

  const activeIncidents = incidents.filter(i => i.status !== "RESOLVED");
  const primaryIncident = activeIncidents[0] || incidents[0];

  // Base coordinates
  const baseLat = 37.7749;
  const baseLng = -122.4194;

  const getRelativeXY = (lat: number, lng: number) => {
    // Math to project lat/lng onto our SVG map box (width: 500, height: 260)
    const scale = 2200 * (zoom / 14);
    const x = 250 + (lng - baseLng) * scale;
    const y = 130 - (lat - baseLat) * scale;
    return { x: Math.max(20, Math.min(480, x)), y: Math.max(20, Math.min(240, y)) };
  };

  const currentVehiclePos = primaryIncident 
    ? getRelativeXY(primaryIncident.latitude, primaryIncident.longitude)
    : { x: 250, y: 130 };

  // Nearest hospital coordinates
  const hospitalPos = { x: 100, y: 70 };

  // Responder ambulance position (moves closer to vehicle based on route progress)
  const routeProgress = primaryIncident?.routeProgress || 0;
  const responderPos = {
    x: hospitalPos.x + (currentVehiclePos.x - hospitalPos.x) * (routeProgress / 100),
    y: hospitalPos.y + (currentVehiclePos.y - hospitalPos.y) * (routeProgress / 100),
  };

  return (
    <div className="glass-card bg-slate-950 border-slate-900 p-4 h-[380px] shadow-2xl relative overflow-hidden flex flex-col justify-between">
      
      {/* Top Floating Map Controls */}
      <div className="z-10 flex items-center justify-between border-b border-slate-900 pb-3 mb-2 shrink-0">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-brand-primary" />
          <span className="font-extrabold text-[10px] uppercase text-slate-400 tracking-wider">GIS COMMAND RADAR</span>
        </div>

        <div className="flex items-center bg-slate-900 border border-slate-800 p-0.5 rounded-lg">
          <button
            onClick={() => setMapType("VECTOR")}
            className={`px-2 py-1 rounded text-[9px] font-extrabold transition-all uppercase ${
              mapType === "VECTOR" ? "bg-brand-primary text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Vector
          </button>
          <button
            onClick={() => setMapType("SATELLITE")}
            className={`px-2 py-1 rounded text-[9px] font-extrabold transition-all uppercase ${
              mapType === "SATELLITE" ? "bg-brand-primary text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Sat
          </button>
        </div>
      </div>

      {/* Interactive Vector Coordinate HUD */}
      <div className="flex-1 w-full bg-slate-900/60 rounded-xl relative overflow-hidden border border-slate-900 flex items-center justify-center">
        
        {/* Topographic Lines grid overlay */}
        <div className="absolute inset-0 opacity-15" 
             style={{
               backgroundImage: mapType === "SATELLITE" 
                 ? 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 1px, transparent 1px)' 
                 : 'linear-gradient(rgba(56, 189, 248, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.05) 1px, transparent 1px)',
               backgroundSize: '30px 30px'
             }} 
        />

        {/* Vector SVG Canvas */}
        <svg className="w-full h-full absolute inset-0 z-10">
          {/* Custom street/grid graphics for Vector style */}
          {mapType === "VECTOR" && (
            <>
              {/* Main Roads */}
              <line x1="50" y1="20" x2="480" y2="220" stroke="#1e293b" strokeWidth="4" />
              <line x1="100" y1="230" x2="400" y2="30" stroke="#1e293b" strokeWidth="4" />
              <line x1="30" y1="120" x2="470" y2="120" stroke="#1e293b" strokeWidth="3" />
              
              {/* Secondary avenues */}
              <line x1="150" y1="10" x2="150" y2="250" stroke="#0f172a" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="350" y1="10" x2="350" y2="250" stroke="#0f172a" strokeWidth="1" strokeDasharray="3 3" />
            </>
          )}

          {/* Active Incident Routing Line */}
          {primaryIncident && primaryIncident.status !== "RESOLVED" && (
            <>
              {/* Route connecting line */}
              <line
                x1={hospitalPos.x}
                y1={hospitalPos.y}
                x2={currentVehiclePos.x}
                y2={currentVehiclePos.y}
                stroke="#ef4444"
                strokeWidth="2.5"
                strokeDasharray="4 4"
                className="animate-pulse"
              />
              <line
                x1={hospitalPos.x}
                y1={hospitalPos.y}
                x2={responderPos.x}
                y2={responderPos.y}
                stroke="#10b981"
                strokeWidth="2.5"
                className="transition-all duration-500"
              />
            </>
          )}

          {/* Render Nearest Hospital Hub */}
          <circle cx={hospitalPos.x} cy={hospitalPos.y} r="6" fill="#2563eb" />
          <circle cx={hospitalPos.x} cy={hospitalPos.y} r="14" fill="none" stroke="#2563eb" strokeWidth="1.5" className="animate-ping" />

          {/* Render Moving Emergency Responder Ambulance */}
          {primaryIncident && primaryIncident.status !== "RESOLVED" && (
            <g transform={`translate(${responderPos.x - 10}, ${responderPos.y - 10})`}>
              <circle cx="10" cy="10" r="10" fill="#10b981" />
              <circle cx="10" cy="10" r="16" fill="none" stroke="#10b981" strokeWidth="1" className="animate-pulse" />
            </g>
          )}

          {/* Render Pulse Target Lock (Accident Location) */}
          {primaryIncident && (
            <g transform={`translate(${currentVehiclePos.x - 12}, ${currentVehiclePos.y - 12})`}>
              <circle cx="12" cy="12" r="6" fill={primaryIncident.status === "RESOLVED" ? "#10b981" : "#ef4444"} />
              <circle 
                cx="12" 
                cy="12" 
                r="18" 
                fill="none" 
                stroke={primaryIncident.status === "RESOLVED" ? "#10b981" : "#ef4444"} 
                strokeWidth="1.5" 
                className="animate-ping" 
              />
            </g>
          )}
        </svg>

        {/* Dynamic Vector Labels */}
        <div className="absolute inset-0 z-20 pointer-events-none text-[9px] font-mono">
          {/* Hospital pin text */}
          <div className="absolute flex flex-col items-center" style={{ left: `${hospitalPos.x - 25}px`, top: `${hospitalPos.y - 30}px` }}>
            <span className="bg-blue-950/90 border border-blue-800 text-brand-light px-1.5 py-0.5 rounded font-extrabold uppercase flex items-center space-x-0.5">
              <Heart className="w-2.5 h-2.5 fill-brand-light" />
              <span>EMT HUB-1</span>
            </span>
          </div>

          {/* Vehicle target pin text */}
          {primaryIncident && (
            <div className="absolute flex flex-col items-center" style={{ left: `${currentVehiclePos.x - 45}px`, top: `${currentVehiclePos.y - 30}px` }}>
              <span className={`px-1.5 py-0.5 border rounded font-extrabold uppercase flex items-center space-x-1 ${
                primaryIncident.status === "RESOLVED" 
                  ? "bg-emerald-950/90 border-emerald-800 text-brand-success" 
                  : "bg-red-950/90 border-red-800 text-brand-emergency"
              }`}>
                <MapPin className="w-2.5 h-2.5 animate-bounce" />
                <span>{primaryIncident.driverName.split(" ")[0]} ({primaryIncident.status})</span>
              </span>
            </div>
          )}

          {/* Responder text banner */}
          {primaryIncident && primaryIncident.status !== "RESOLVED" && (
            <div className="absolute flex items-center space-x-1" style={{ left: `${responderPos.x + 12}px`, top: `${responderPos.y - 8}px` }}>
              <span className="bg-emerald-950/90 border border-emerald-800 text-brand-success px-1.5 py-0.5 rounded font-extrabold uppercase flex items-center space-x-0.5">
                <Truck className="w-2.5 h-2.5 text-brand-success" />
                <span>Medic-{primaryIncident.id.replace("inc-", "")}</span>
              </span>
            </div>
          )}
        </div>

        {/* Side Floating Zoom Utilities */}
        <div className="absolute right-3 top-3 z-30 flex flex-col bg-slate-950 border border-slate-900 rounded-lg overflow-hidden">
          <button onClick={() => setZoom(z => Math.min(18, z + 1))} className="p-2 border-b border-slate-900 text-slate-400 hover:text-white transition-colors">
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setZoom(z => Math.max(10, z - 1))} className="p-2 text-slate-400 hover:text-white transition-colors">
            <Minus className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Map Footer telemetrics details */}
      <div className="z-10 border-t border-slate-900 pt-2 shrink-0 flex items-center justify-between text-[9px] font-mono text-slate-500">
        <div className="flex items-center space-x-1">
          <Radio className="w-3.5 h-3.5 text-brand-primary animate-pulse" />
          <span>GPS COORDINATES: 37.7749° N, 122.4194° W</span>
        </div>
        <span>ACCURACY: ±2m</span>
      </div>

    </div>
  );
}
