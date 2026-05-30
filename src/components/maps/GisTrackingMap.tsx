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

  const lat = primaryIncident ? primaryIncident.latitude : baseLat;
  const lng = primaryIncident ? primaryIncident.longitude : baseLng;

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

      {/* Interactive Google Map embed */}
      <div className="flex-1 w-full bg-slate-900/60 rounded-xl relative overflow-hidden border border-slate-900 flex items-center justify-center">
        <iframe
          className="w-full h-full border-0 rounded-xl opacity-90 shadow-inner"
          src={`https://maps.google.com/maps?q=${lat},${lng}&t=${mapType === "SATELLITE" ? "k" : "m"}&z=${zoom}&ie=UTF8&iwloc=&output=embed`}
          allowFullScreen
          loading="lazy"
        />

        {/* Side Floating Zoom Utilities */}
        <div className="absolute right-3 top-3 z-30 flex flex-col bg-slate-950 border border-slate-900 rounded-lg overflow-hidden shadow-lg">
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
