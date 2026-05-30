"use client";

import React, { useState } from "react";
import { useRoadSos, EmergencyIncident } from "@/context/RoadSosContext";
import { 
  ShieldAlert, 
  MapPin, 
  Phone, 
  Navigation, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Heart,
  PlusCircle,
  Truck,
  Car,
  Compass
} from "lucide-react";

export default function EmergencyTeamDashboard() {
  const { incidents, updateIncidentStatus, dispatchService } = useRoadSos();
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);

  const activeIncidents = incidents.filter(i => i.status !== "RESOLVED");
  const selectedIncident = incidents.find(i => i.id === (selectedIncidentId || activeIncidents[0]?.id));

  const handleStatusStep = (incident: EmergencyIncident) => {
    const statusMap: Record<EmergencyIncident["status"], EmergencyIncident["status"]> = {
      REPORTED: "DISPATCHED",
      DISPATCHED: "ON_SCENE",
      ON_SCENE: "PATIENT_SECURED",
      PATIENT_SECURED: "RESOLVED",
      RESOLVED: "RESOLVED",
    };
    const nextStatus = statusMap[incident.status];
    updateIncidentStatus(incident.id, nextStatus);
  };

  return (
    <div className="space-y-6">
      
      {/* Active Incident overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Active Emergencies Incident list */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-card p-6 bg-white space-y-4 min-h-[500px]">
            <div>
              <h3 className="text-base font-black text-brand-navy">Incident Dispatch Queue</h3>
              <p className="text-xs text-text-secondary mt-0.5">High G-spikes awaiting paramedic allocation.</p>
            </div>

            <div className="space-y-3">
              {activeIncidents.length === 0 ? (
                <div className="p-8 text-center text-xs font-semibold text-muted bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                  Queue Empty. All drivers safe and resolved.
                </div>
              ) : (
                activeIncidents.map(inc => {
                  const isSelected = selectedIncident?.id === inc.id;
                  const isBike = inc.vehicleType === "BIKE";

                  return (
                    <button
                      key={inc.id}
                      onClick={() => setSelectedIncidentId(inc.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex items-start space-x-3 ${
                        isSelected 
                          ? "bg-red-50/20 border-red-500/20 shadow-sm" 
                          : "bg-white border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected ? "bg-brand-emergency text-white animate-pulse" : "bg-slate-100 text-text-secondary"
                      }`}>
                        {isBike ? <Compass className="w-4.5 h-4.5" /> : <Car className="w-4.5 h-4.5" />}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="font-extrabold text-xs text-brand-navy">{inc.driverName}</span>
                          <span className="text-[9px] font-mono text-muted uppercase tracking-wider">({inc.id})</span>
                        </div>
                        <div className="text-[10px] text-text-secondary mt-0.5 truncate">{inc.accidentReason}</div>
                        
                        {/* Status timeline mini gauge */}
                        <div className="flex items-center space-x-1.5 mt-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-emergency animate-ping" />
                          <span className="text-[8px] font-black text-brand-emergency uppercase tracking-wider">{inc.status}</span>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Dispatch Action HUD */}
        <div className="lg:col-span-8 space-y-6">
          {selectedIncident ? (
            <div className="glass-card p-6 bg-white flex flex-col justify-between min-h-[500px]">
              
              {/* Top details card */}
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 gap-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="text-lg font-black text-brand-navy">Active Rescue Log</h2>
                      <span className="px-2 py-0.5 rounded bg-red-100 text-[10px] font-bold text-brand-emergency uppercase font-mono">
                        {selectedIncident.id}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary mt-0.5">EOC coordinate targeting active.</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-muted font-bold">ACCIDENT CONFIDENCE:</span>
                    <span className="px-2 py-0.5 rounded bg-red-50 text-xs font-bold text-brand-emergency">
                      {selectedIncident.accidentConfidence}% Verified
                    </span>
                  </div>
                </div>

                {/* Driver information deck */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[9px] font-black text-muted uppercase">Driver Profile</span>
                    <div className="font-extrabold text-sm text-brand-navy">{selectedIncident.driverName}</div>
                    <div className="text-[10px] text-text-secondary font-bold flex items-center space-x-1">
                      <Phone className="w-3 h-3" />
                      <span>{selectedIncident.driverPhone}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[9px] font-black text-muted uppercase">GPS Incident Node</span>
                    <div className="font-mono text-xs text-brand-navy truncate">
                      {selectedIncident.latitude.toFixed(4)}°, {selectedIncident.longitude.toFixed(4)}°
                    </div>
                    <div className="text-[10px] text-brand-primary font-bold flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>Request Ambulance Vector</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[9px] font-black text-muted uppercase">Log Trigger Reason</span>
                    <div className="text-xs font-bold text-brand-emergency truncate">
                      {selectedIncident.accidentReason}
                    </div>
                    <div className="text-[10px] text-muted font-semibold">
                      Registered: {new Date(selectedIncident.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>

                {/* CAD Dispatch status timeline */}
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-muted uppercase">Rescue Workflow Progress</span>
                    <span className="text-xs font-bold text-brand-primary">{selectedIncident.routeProgress}% Route Progress</span>
                  </div>

                  {/* Horizontal progress bar with nodes */}
                  <div className="relative">
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 -z-10" />
                    <div 
                      className="absolute top-1/2 left-0 h-1 bg-brand-primary -translate-y-1/2 -z-10 transition-all duration-500" 
                      style={{ width: `${selectedIncident.routeProgress}%` }}
                    />
                    
                    <div className="flex justify-between">
                      {["REPORTED", "DISPATCHED", "ON_SCENE", "PATIENT_SECURED", "RESOLVED"].map((node, idx) => {
                        const statusWeights = { REPORTED: 0, DISPATCHED: 25, ON_SCENE: 50, PATIENT_SECURED: 75, RESOLVED: 100 };
                        const currentWeight = statusWeights[selectedIncident.status];
                        const nodeWeight = statusWeights[node as EmergencyIncident["status"]];
                        
                        const isDone = currentWeight >= nodeWeight;
                        const isActive = selectedIncident.status === node;

                        return (
                          <div key={node} className="flex flex-col items-center space-y-2">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold transition-all ${
                              isDone 
                                ? "bg-brand-primary border-brand-primary text-white" 
                                : "bg-white border-slate-300 text-muted"
                            } ${isActive ? "ring-4 ring-blue-500/20" : ""}`}>
                              {idx + 1}
                            </div>
                            <span className={`text-[8px] font-black uppercase tracking-wider ${
                              isActive ? "text-brand-primary" : "text-muted"
                            }`}>
                              {node.replace("_", " ")}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Dispatch allocating toggles */}
                <div className="space-y-3 pt-2">
                  <span className="text-[10px] font-black text-muted uppercase tracking-wider block">Responders Allocated</span>
                  <div className="grid grid-cols-3 gap-3">
                    
                    <button
                      onClick={() => dispatchService(selectedIncident.id, "ambulance")}
                      className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                        selectedIncident.servicesDispatched.ambulance 
                          ? "bg-emerald-50 border-brand-success text-brand-success shadow-inner" 
                          : "bg-white border-slate-200 text-text-secondary hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Truck className="w-5 h-5" />
                        <span className="text-xs font-bold">Ambulance squad</span>
                      </div>
                      {selectedIncident.servicesDispatched.ambulance && <CheckCircle2 className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => dispatchService(selectedIncident.id, "police")}
                      className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                        selectedIncident.servicesDispatched.police 
                          ? "bg-emerald-50 border-brand-success text-brand-success shadow-inner" 
                          : "bg-white border-slate-200 text-text-secondary hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Navigation className="w-5 h-5 animate-pulse" />
                        <span className="text-xs font-bold">Police patrol</span>
                      </div>
                      {selectedIncident.servicesDispatched.police && <CheckCircle2 className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => dispatchService(selectedIncident.id, "fire")}
                      className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                        selectedIncident.servicesDispatched.fire 
                          ? "bg-emerald-50 border-brand-success text-brand-success shadow-inner" 
                          : "bg-white border-slate-200 text-text-secondary hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="w-5 h-5" />
                        <span className="text-xs font-bold">Fire engine squad</span>
                      </div>
                      {selectedIncident.servicesDispatched.fire && <CheckCircle2 className="w-4 h-4" />}
                    </button>

                  </div>
                </div>

              </div>

              {/* Bottom actionable triggers */}
              <div className="border-t border-slate-100 pt-6 mt-6 flex items-center justify-between gap-4">
                <div className="flex items-center space-x-2 text-xs text-text-secondary font-semibold">
                  <Clock className="w-4.5 h-4.5 text-brand-primary" />
                  <span>Ambulance ETA: {selectedIncident.status === "RESOLVED" ? "Arrived" : `${selectedIncident.etaMinutes} minutes`}</span>
                </div>

                <button
                  onClick={() => handleStatusStep(selectedIncident)}
                  className="px-6 py-3 rounded-xl font-bold bg-brand-primary hover:bg-brand-light text-white shadow-md shadow-blue-500/10 flex items-center space-x-2 transition-all active:scale-95 cursor-pointer text-xs uppercase tracking-wider"
                >
                  <span>Advance Status (➔ {
                    selectedIncident.status === "REPORTED" ? "DISPATCH" :
                    selectedIncident.status === "DISPATCHED" ? "ON SCENE" :
                    selectedIncident.status === "ON_SCENE" ? "PATIENT SECURED" : "RESOLVED"
                  })</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="glass-card p-8 bg-white min-h-[500px] flex flex-col items-center justify-center text-center space-y-4 border-slate-200/60">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-brand-success flex items-center justify-center shadow-inner">
                <Heart className="w-8 h-8 animate-pulse" />
              </div>
              <h3 className="text-lg font-black text-brand-navy">All Incidents Resolved</h3>
              <p className="text-xs text-text-secondary max-w-sm">No vehicles on the RoadSOS network are reporting crash impacts. Excellent monitoring.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
