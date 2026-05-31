"use client";

import React, { useState } from "react";
import { useRoadSos, EmergencyIncident } from "@/context/RoadSosContext";
import { useAuth } from "@/context/AuthContext";
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
  ArrowRight,
  Plus,
  Camera,
  FileText,
  Sparkles,
  Building,
  History
} from "lucide-react";
import GisTrackingMap from "@/components/maps/GisTrackingMap";

export default function ResponderDashboard() {
  const { incidents, updateIncidentStatus, addTerminalLog } = useRoadSos();
  const { user } = useAuth();

  // Helper features: Filter active cases assigned to paramedics (ASSIGNED, IN_PROGRESS, NEEDS_SUPPORT)
  const assignedCases = incidents.filter(i => 
    (i.status === "ASSIGNED" || 
     i.status === "IN_PROGRESS" || 
     i.status === "NEEDS_SUPPORT") &&
    (!i.assignedTeamId || i.assignedTeamId === user?.id || i.assignedTeamName === user?.name)
  );

  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  
  // Resolve active mission
  const activeMission = incidents.find(i => i.id === (selectedIncidentId || assignedCases[0]?.id)) || assignedCases[0];

  // Helper action states
  const [noteInput, setNoteInput] = useState("");
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState("SF General Emergency");

  // Crew standby registry
  const paramedicCrews = [
    { name: "Rescue Team Alpha (Medic-14)", type: "AMBULANCE", status: "ON SCENE", incident: "inc-104", color: "text-brand-emergency bg-red-100" },
    { name: "Paramedics Division 4B", type: "AMBULANCE", status: "ROUTING", incident: "inc-103", color: "text-brand-warning bg-amber-100" },
    { name: "Rescue Team Beta (Medic-09)", type: "AMBULANCE", status: "STANDBY", incident: "None", color: "text-brand-success bg-emerald-100" },
    { name: "Police Patrol Squad Alpha", type: "PATROL", status: "STANDBY", incident: "None", color: "text-brand-success bg-emerald-100" },
    { name: "Fire Engine Rescue Charlie", type: "ENGINE", status: "STANDBY", incident: "None", color: "text-brand-success bg-emerald-100" },
  ];

  // Completed cases count for KPIs
  const completedCasesCount = incidents.filter(i => i.status === "RESOLVED" || i.status === "ARCHIVED").length;
  // Active cases count
  const activeCasesCount = incidents.filter(i => i.status === "IN_PROGRESS" || i.status === "NEEDS_SUPPORT").length;

  const currentHelperStatus = activeMission?.helperStatus || "Assigned";

  // Actions transitions
  const handleAcceptMission = () => {
    if (!activeMission) return;
    updateIncidentStatus(activeMission.id, "IN_PROGRESS", { 
      helperStatus: "Accepted",
      hospitalName: selectedHospital
    });
    addTerminalLog(`[Helper Event] Accepted Mission for Incident ${activeMission.id}. Rescue team routing confirmed.`, "success");
  };

  const handleStartRoute = () => {
    if (!activeMission) return;
    updateIncidentStatus(activeMission.id, "IN_PROGRESS", { 
      helperStatus: "Travelling",
      routeProgress: 15,
      etaMinutes: 8
    });
    addTerminalLog(`[Helper Event] Started dynamic navigation route for incident ${activeMission.id}. Pre-clearing smart traffic lights.`, "info");
  };

  const handleReachSite = () => {
    if (!activeMission) return;
    updateIncidentStatus(activeMission.id, "IN_PROGRESS", { 
      helperStatus: "Reached",
      routeProgress: 100,
      etaMinutes: 0
    });
    addTerminalLog(`[Helper Event] Rescue team reached accident scene for incident ${activeMission.id}. Initiating primary support loop.`, "success");
  };

  const handleProvideSupport = () => {
    if (!activeMission) return;
    updateIncidentStatus(activeMission.id, "IN_PROGRESS", { 
      helperStatus: "Helping"
    });
    addTerminalLog(`[Helper Event] Providing immediate medical/chassis support for incident ${activeMission.id}.`, "info");
  };

  const handleRequestBackup = () => {
    if (!activeMission) return;
    updateIncidentStatus(activeMission.id, "NEEDS_SUPPORT", { 
      helperStatus: "Need Backup"
    });
    addTerminalLog(`[Helper Event] WARNING: Additional rescue resources requested for incident ${activeMission.id}. Set EOC status to NEEDS SUPPORT.`, "error");
  };

  const handleMarkResolved = () => {
    if (!activeMission) return;
    updateIncidentStatus(activeMission.id, "RESOLVED", { 
      helperStatus: "Resolved"
    });
    addTerminalLog(`[Helper Event] Case successfully closed and marked RESOLVED for incident ${activeMission.id}. Driver secure.`, "success");
  };

  const handleSaveNotes = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMission || !noteInput.trim()) return;
    
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const existingNotes = activeMission.helperNotes ? activeMission.helperNotes + "\n" : "";
    const newNotes = existingNotes + `[${timeString}] ${noteInput}`;
    
    updateIncidentStatus(activeMission.id, activeMission.status, { 
      helperNotes: newNotes
    });
    addTerminalLog(`[Helper Event] Saved progress note for incident ${activeMission.id}: "${noteInput}"`, "success");
    setNoteInput("");
  };

  const handleUploadMockPhoto = () => {
    if (!activeMission) return;
    setIsUploadingPhoto(true);
    setTimeout(() => {
      const mockPhoto = `https://images.unsplash.com/photo-1516513809596-e233b54430e3?auto=format&fit=crop&w=400&q=80`;
      const photos = activeMission.helperPhotos ? [...activeMission.helperPhotos, mockPhoto] : [mockPhoto];
      updateIncidentStatus(activeMission.id, activeMission.status, {
        helperPhotos: photos
      });
      setIsUploadingPhoto(false);
      addTerminalLog(`[Helper Event] Accident scene photo uploaded for incident ${activeMission.id}`, "success");
    }, 1200);
  };

  const helperStatuses: ("Assigned" | "Accepted" | "Travelling" | "Reached" | "Helping" | "Need Backup" | "Resolved")[] = [
    "Assigned", "Accepted", "Travelling", "Reached", "Helping", "Resolved"
  ];

  return (
    <div className="space-y-6 font-sans">
      
      {/* 🚀 HELPER KPIs GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        
        {/* KPI 1: Assigned Cases */}
        <div className="glass-card p-5 bg-white border-slate-200/60 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Assigned Cases</span>
            <div className="text-2xl font-black text-brand-navy leading-none">
              {assignedCases.length} Cases
            </div>
            <span className="text-[9px] font-bold text-brand-primary block uppercase tracking-wider">
              EOC Assigned Vectors
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-primary flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5.5 h-5.5" />
          </div>
        </div>

        {/* KPI 2: Completed Cases */}
        <div className="glass-card p-5 bg-white border-slate-200/60 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Completed Cases</span>
            <div className="text-2xl font-black text-brand-success leading-none">
              {completedCasesCount} Resolved
            </div>
            <span className="text-[9px] font-bold text-brand-success block uppercase tracking-wider">
              Saved Drivers List
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-brand-success flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5.5 h-5.5 animate-pulse" />
          </div>
        </div>

        {/* KPI 3: Active Cases */}
        <div className="glass-card p-5 bg-white border-slate-200/60 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Active Cases</span>
            <div className="text-2xl font-black text-brand-warning leading-none">
              {activeCasesCount} In Transit
            </div>
            <span className="text-[9px] font-bold text-brand-warning block uppercase tracking-wider">
              Live Rescues
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-brand-warning flex items-center justify-center shrink-0">
            <Truck className="w-5.5 h-5.5 animate-bounce" />
          </div>
        </div>

        {/* KPI 4: Current Mission ETA */}
        <div className="glass-card p-5 bg-white border-slate-200/60 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Current Mission ETA</span>
            <div className="text-2xl font-black text-brand-navy leading-none">
              {activeMission && activeMission.status !== "RESOLVED" ? `${activeMission.etaMinutes} Mins` : "0 Mins"}
            </div>
            <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">
              Optimal Corridor Lock
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-50 text-brand-navy flex items-center justify-center shrink-0">
            <Clock className="w-5.5 h-5.5 animate-pulse" />
          </div>
        </div>

        {/* KPI 5: Success Rate */}
        <div className="glass-card p-5 bg-white border-slate-200/60 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Rescue Success Rate</span>
            <div className="text-2xl font-black text-brand-success leading-none">
              100.0%
            </div>
            <span className="text-[9px] font-bold text-brand-success block uppercase tracking-wider font-mono">
              0 Failures
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-brand-success flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5.5 h-5.5" />
          </div>
        </div>

      </div>

      {/* 🚨 LIVE ROADENIX FIELD RESPONSE CENTER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Assigned Cases & Details */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Active Mission Cockpit */}
          {activeMission ? (
            <div className="glass-card p-6 border-red-500/25 bg-gradient-to-br from-red-500/[0.03] to-white relative overflow-hidden space-y-6 shadow-2xl">
              
              {/* Accent top gradient indicator bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 animate-pulse" />

              {/* Heading */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3.5 mb-2 gap-3">
                <div className="flex items-center space-x-2">
                  <Truck className="w-5 h-5 text-brand-emergency animate-bounce shrink-0" />
                  <h2 className="text-sm font-black text-brand-navy uppercase tracking-widest">ROADENIX FIELD RESPONSE CENTER</h2>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black tracking-widest border uppercase animate-pulse ${
                    activeMission.status === "NEEDS_SUPPORT" 
                      ? "bg-red-100 text-brand-emergency border-red-200" 
                      : "bg-amber-100 text-brand-warning border-amber-200"
                  }`}>
                    {currentHelperStatus}
                  </span>
                </div>
                
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                  Mission ID: {activeMission.id} • Target GPS: {activeMission.latitude.toFixed(4)}°, {activeMission.longitude.toFixed(4)}°
                </div>
              </div>

              {/* Split Details view */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[11px] font-semibold text-text-secondary">
                
                {/* Left block: Driver Details */}
                <div className="p-4 rounded-2xl bg-white border border-slate-150 space-y-3 flex flex-col justify-between shadow-sm">
                  <div>
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2 flex items-center space-x-1.5 border-b border-slate-100 pb-1">
                      <Heart className="w-3.5 h-3.5 text-brand-emergency shrink-0" />
                      <span>Rescue Target Profile</span>
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between border-b border-slate-50 pb-1">
                        <span>Driver Name:</span> 
                        <span className="text-brand-navy font-extrabold">{activeMission.driverName}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-50 pb-1">
                        <span>Vehicle Info:</span> 
                        <span className="text-brand-navy font-extrabold uppercase">{activeMission.vehicleType} Spec</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-50 pb-1">
                        <span>Blood Group:</span> 
                        <span className="text-brand-emergency font-black">{activeMission.driverName === "Sarah Jenkins" ? "A+" : "O+"} (Emergency Advisory)</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-50 pb-1">
                        <span>Emergency Contact:</span> 
                        <span className="text-brand-navy font-extrabold">David Jenkins (Spouse)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Contact Phone:</span> 
                        <span className="text-brand-navy font-extrabold font-mono">{activeMission.driverPhone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right block: EOC & Navigation Details */}
                <div className="p-4 rounded-2xl bg-white border border-slate-150 space-y-3 flex flex-col justify-between shadow-sm">
                  <div>
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2 flex items-center space-x-1.5 border-b border-slate-100 pb-1">
                      <Compass className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                      <span>EOC Case Tracker Details</span>
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between border-b border-slate-50 pb-1">
                        <span>EOC Severity Index:</span> 
                        <span className="text-brand-emergency font-extrabold">{activeMission.severity}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-50 pb-1">
                        <span>AI G-Force Spiker:</span> 
                        <span className="text-brand-emergency font-extrabold">6.8G Acceleration</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-50 pb-1">
                        <span>AI Confidence Ratio:</span> 
                        <span className="text-brand-success font-black">{activeMission.accidentConfidence}% Confirmed</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-50 pb-1">
                        <span>Nearest Emergency Hospital:</span> 
                        <span className="text-brand-primary font-extrabold flex items-center space-x-1">
                          <Building className="w-3 h-3 text-brand-primary shrink-0" />
                          <span>{activeMission.hospitalName || selectedHospital}</span>
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Accident Vector Reason:</span> 
                        <span className="text-slate-500 font-bold truncate max-w-[170px]" title={activeMission.accidentReason}>
                          {activeMission.accidentReason}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Status Timeline Progress Stepper */}
              <div className="p-4 bg-white border border-slate-150 rounded-2xl space-y-3.5 shadow-sm">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                  Field Response Status Timeline
                </span>
                <div className="relative">
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -translate-y-1/2 -z-10" />
                  <div className="flex justify-between">
                    {helperStatuses.map((hStatus, index) => {
                      const statusWeights: Record<string, number> = {
                        Assigned: 0,
                        Accepted: 20,
                        Travelling: 40,
                        Reached: 60,
                        Helping: 80,
                        "Need Backup": 80,
                        Resolved: 100
                      };
                      const currentWeight = statusWeights[currentHelperStatus] || 0;
                      const thisWeight = statusWeights[hStatus];
                      const isDone = currentWeight >= thisWeight;
                      const isActive = currentHelperStatus === hStatus || (hStatus === "Helping" && currentHelperStatus === "Need Backup");

                      return (
                        <div key={hStatus} className="flex flex-col items-center space-y-1.5 relative">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[9px] font-bold transition-all ${
                            isDone 
                              ? "bg-brand-primary border-brand-primary text-white" 
                              : "bg-white border-slate-200 text-slate-400"
                          } ${isActive ? "ring-4 ring-blue-500/20 scale-105 animate-pulse" : ""}`}>
                            {isActive && currentHelperStatus === "Need Backup" ? (
                              <AlertTriangle className="w-2.5 h-2.5 text-white" />
                            ) : (
                              <span>{index + 1}</span>
                            )}
                          </div>
                          <span className={`text-[8px] font-black uppercase tracking-wider ${
                            isActive 
                              ? currentHelperStatus === "Need Backup" 
                                ? "text-brand-emergency font-black" 
                                : "text-brand-primary font-black"
                              : "text-slate-450"
                          }`}>
                            {hStatus.replace("_", " ")}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100">
                
                {/* Accept Assignment */}
                {currentHelperStatus === "Assigned" && (
                  <button
                    onClick={handleAcceptMission}
                    className="px-4 py-2.5 rounded-xl bg-brand-navy hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider flex items-center space-x-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 text-brand-success" />
                    <span>Accept Assignment</span>
                  </button>
                )}

                {/* Start Route */}
                {currentHelperStatus === "Accepted" && (
                  <button
                    onClick={handleStartRoute}
                    className="px-4 py-2.5 rounded-xl bg-brand-navy hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider flex items-center space-x-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    <Navigation className="w-4 h-4 text-brand-primary animate-pulse" />
                    <span>Start Route</span>
                  </button>
                )}

                {/* Reach Site */}
                {currentHelperStatus === "Travelling" && (
                  <button
                    onClick={handleReachSite}
                    className="px-4 py-2.5 rounded-xl bg-brand-navy hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider flex items-center space-x-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    <MapPin className="w-4 h-4 text-brand-warning animate-bounce" />
                    <span>Reach Site</span>
                  </button>
                )}

                {/* Provide Support */}
                {currentHelperStatus === "Reached" && (
                  <button
                    onClick={handleProvideSupport}
                    className="px-4 py-2.5 rounded-xl bg-brand-navy hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider flex items-center space-x-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    <Activity className="w-4 h-4 text-brand-success animate-pulse" />
                    <span>Provide Support</span>
                  </button>
                )}

                {/* Upload Scene Notes & Photos triggers */}
                {currentHelperStatus !== "Assigned" && currentHelperStatus !== "Resolved" && (
                  <>
                    <button
                      onClick={handleUploadMockPhoto}
                      disabled={isUploadingPhoto}
                      className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-extrabold text-xs uppercase tracking-wider flex items-center space-x-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
                    >
                      <Camera className="w-4 h-4 text-brand-primary" />
                      <span>{isUploadingPhoto ? "Uploading..." : "Upload Photo"}</span>
                    </button>

                    <button
                      onClick={handleRequestBackup}
                      disabled={currentHelperStatus === "Need Backup"}
                      className={`px-4 py-2.5 rounded-xl border text-xs font-extrabold uppercase tracking-wider flex items-center space-x-1.5 transition-all active:scale-95 ${
                        currentHelperStatus === "Need Backup"
                          ? "bg-red-50 border-red-200 text-brand-emergency"
                          : "bg-white border-slate-200 text-slate-750 hover:bg-red-50 hover:text-brand-emergency hover:border-red-200 cursor-pointer"
                      }`}
                    >
                      <AlertTriangle className="w-4 h-4" />
                      <span>Request Backup</span>
                    </button>
                  </>
                )}

                {/* Mark Resolved */}
                {currentHelperStatus !== "Assigned" && currentHelperStatus !== "Resolved" && (
                  <button
                    onClick={handleMarkResolved}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-md flex items-center space-x-1.5 transition-all active:scale-95 ml-auto cursor-pointer animate-pulse"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mark Resolved</span>
                  </button>
                )}

              </div>

              {/* Hospital Selector Input Tab */}
              {currentHelperStatus === "Accepted" && (
                <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl space-y-2 text-xs">
                  <label className="text-[9px] font-black uppercase text-slate-400 block">Designate Target Hospital</label>
                  <select
                    value={selectedHospital}
                    onChange={(e) => setSelectedHospital(e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-brand-navy bg-white cursor-pointer w-full max-w-sm focus:outline-none focus:border-brand-primary"
                  >
                    <option value="SF General Emergency">SF General Emergency</option>
                    <option value="Smart City Trauma Hub">Smart City Trauma Hub</option>
                    <option value="Bay Area Medical Center">Bay Area Medical Center</option>
                    <option value="St. Francis Hospital Care">St. Francis Hospital Care</option>
                  </select>
                </div>
              )}

              {/* Progress Notes & Scene Photos Registries */}
              {currentHelperStatus !== "Assigned" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                  
                  {/* Notes Registry Form */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                      Incident Case Updates Notes
                    </span>
                    
                    {/* Notes listing */}
                    <div className="bg-slate-50/70 border border-slate-100 p-3 rounded-xl max-h-[110px] overflow-y-auto space-y-2 text-[10px] font-mono text-slate-500 leading-normal custom-scrollbar">
                      {activeMission.helperNotes ? (
                        activeMission.helperNotes.split("\n").map((note, idx) => (
                          <div key={idx} className="border-b border-slate-200/40 pb-1 last:border-0 last:pb-0">
                            {note}
                          </div>
                        ))
                      ) : (
                        <span className="text-slate-400 italic">No notes uploaded yet. Enter notes below to sync.</span>
                      )}
                    </div>

                    {/* Form input */}
                    <form onSubmit={handleSaveNotes} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add vitals/chassis progress note..."
                        value={noteInput}
                        onChange={(e) => setNoteInput(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold focus:outline-none focus:border-brand-primary bg-white"
                      />
                      <button
                        type="submit"
                        className="px-3.5 bg-brand-primary hover:bg-brand-light text-white text-xs font-bold rounded-lg transition-all active:scale-95 shadow-sm shrink-0 flex items-center justify-center cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </form>
                  </div>

                  {/* Scene Photos Grid */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                      Accident Scene Photos Uploads
                    </span>

                    <div className="bg-slate-50/70 border border-slate-100 p-3 rounded-xl min-h-[148px] flex items-center justify-center flex-wrap gap-2.5">
                      {activeMission.helperPhotos && activeMission.helperPhotos.length > 0 ? (
                        activeMission.helperPhotos.map((photo, index) => (
                          <div key={index} className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200/50 shadow-sm shrink-0 group">
                            <img src={photo} alt="Accident scene" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[8px] font-bold">
                              Photo #{index + 1}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-slate-400 text-[10px] flex flex-col items-center gap-1.5">
                          <Camera className="w-6 h-6 text-slate-350" />
                          <span>No photos uploaded. Click "Upload Photo" above to sync.</span>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              )}

            </div>
          ) : (
            <div className="glass-card p-8 bg-white min-h-[480px] flex flex-col items-center justify-center text-center space-y-4 border-slate-200/60">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-brand-success flex items-center justify-center shadow-inner">
                <Heart className="w-8 h-8 animate-pulse" />
              </div>
              <h3 className="text-lg font-black text-brand-navy">All Assigned Cases Resolved</h3>
              <p className="text-xs text-text-secondary max-w-sm">
                No active emergencies require field helper dispatch on your team's grid. Excellent monitoring!
              </p>
            </div>
          )}

        </div>

        {/* Right Side: Active Case List Switcher & Crew list */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Active Cases Switcher Box */}
          <div className="glass-card p-5 bg-white space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-1.5">
              <div className="flex items-center space-x-1.5">
                <ShieldAlert className="w-4 h-4 text-brand-emergency" />
                <h3 className="text-xs font-black text-brand-navy uppercase tracking-wider">Assigned Cases Directory</h3>
              </div>
              <span className="text-[8px] font-black text-brand-primary bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                {assignedCases.length} Active
              </span>
            </div>
            
            <div className="space-y-2.5 overflow-y-auto max-h-[360px] pr-1 custom-scrollbar">
              {assignedCases.length === 0 ? (
                <div className="text-center py-6 space-y-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-brand-success flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">No active dispatches</p>
                  <p className="text-[9px] text-slate-350 italic">EOC will push new assignments here.</p>
                </div>
              ) : (
                assignedCases.map(inc => {
                  const isSelected = activeMission?.id === inc.id;
                  const missionStatus = inc.helperStatus || "Assigned";
                  const needsAccept = missionStatus === "Assigned";
                  const needsBackup = missionStatus !== "Assigned" && missionStatus !== "Resolved" && inc.status !== "NEEDS_SUPPORT";
                  const isBackupRequested = inc.status === "NEEDS_SUPPORT";

                  return (
                    <div
                      key={inc.id}
                      className={`p-3 rounded-xl border transition-all text-xs font-semibold ${
                        isSelected 
                          ? "bg-blue-50/70 border-brand-primary shadow-sm" 
                          : "bg-slate-50 border-slate-100"
                      }`}
                    >
                      {/* Top row: Driver info + select */}
                      <button
                        onClick={() => setSelectedIncidentId(inc.id)}
                        className="w-full text-left flex items-center justify-between mb-2"
                      >
                        <div className="min-w-0">
                          <div className={`font-extrabold flex items-center space-x-1.5 ${isSelected ? "text-brand-primary" : "text-brand-navy"}`}>
                            <span className="truncate">{inc.driverName}</span>
                            <span className="text-[8px] font-mono text-slate-400 bg-white border border-slate-200 px-1 rounded">
                              {inc.id}
                            </span>
                          </div>
                          <div className="text-[9px] text-slate-400 font-mono mt-0.5 truncate max-w-[180px]">{inc.accidentReason}</div>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider shrink-0 ml-2 ${
                          isBackupRequested
                            ? "bg-red-100 text-brand-emergency animate-pulse"
                            : needsAccept
                              ? "bg-amber-100 text-amber-600"
                              : isSelected 
                                ? "bg-blue-100 text-brand-primary" 
                                : "bg-slate-200 text-slate-550"
                        }`}>
                          {missionStatus}
                        </span>
                      </button>

                      {/* Action buttons row */}
                      <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100">
                        {/* Accept Mission — shown when status is Assigned */}
                        {needsAccept && (
                          <button
                            onClick={() => {
                              setSelectedIncidentId(inc.id);
                              updateIncidentStatus(inc.id, "IN_PROGRESS", { 
                                helperStatus: "Accepted",
                                hospitalName: selectedHospital
                              });
                              addTerminalLog(`[Helper Event] Accepted Mission for Incident ${inc.id}. Rescue team routing confirmed.`, "success");
                            }}
                            className="flex-1 px-2.5 py-1.5 rounded-lg bg-brand-navy hover:bg-slate-800 text-white text-[9px] font-black uppercase tracking-wider flex items-center justify-center space-x-1 transition-all active:scale-95 cursor-pointer shadow-sm"
                          >
                            <CheckCircle2 className="w-3 h-3 text-brand-success" />
                            <span>Accept Mission</span>
                          </button>
                        )}

                        {/* Request More Team (Backup) */}
                        {needsBackup && (
                          <button
                            onClick={() => {
                              setSelectedIncidentId(inc.id);
                              updateIncidentStatus(inc.id, "NEEDS_SUPPORT", { 
                                helperStatus: "Need Backup"
                              });
                              addTerminalLog(`[Helper Event] WARNING: Additional rescue resources requested for incident ${inc.id}. EOC status set to NEEDS SUPPORT.`, "error");
                            }}
                            className="flex-1 px-2.5 py-1.5 rounded-lg bg-red-50 border border-red-200 hover:bg-red-100 text-brand-emergency text-[9px] font-black uppercase tracking-wider flex items-center justify-center space-x-1 transition-all active:scale-95 cursor-pointer"
                          >
                            <AlertTriangle className="w-3 h-3" />
                            <span>Need More Team</span>
                          </button>
                        )}

                        {/* Backup already requested indicator */}
                        {isBackupRequested && (
                          <span className="flex-1 px-2.5 py-1.5 rounded-lg bg-red-50 border border-red-200 text-brand-emergency text-[9px] font-black uppercase tracking-wider flex items-center justify-center space-x-1">
                            <AlertTriangle className="w-3 h-3 animate-pulse" />
                            <span>Backup Requested</span>
                          </span>
                        )}

                        {/* View/Select button always present */}
                        <button
                          onClick={() => setSelectedIncidentId(inc.id)}
                          className={`px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center justify-center space-x-1 transition-all active:scale-95 cursor-pointer border ${
                            isSelected 
                              ? "bg-blue-50 border-blue-200 text-brand-primary" 
                              : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                          }`}
                        >
                          <ArrowRight className="w-3 h-3" />
                          <span>{isSelected ? "Active" : "View"}</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Rescue crew registry list */}
          <div className="glass-card p-5 bg-white flex flex-col justify-between min-h-[300px]">
            <div>
              <h3 className="text-xs font-black text-brand-navy mb-1 uppercase tracking-wider">Standby Responders Registry</h3>
              <p className="text-[10px] text-text-secondary">Ecosystem fleets standby allocation.</p>

              <div className="space-y-2.5 mt-3">
                {paramedicCrews.map((crew) => (
                  <div key={crew.name} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-[11px] font-semibold text-brand-navy">
                    <div className="min-w-0">
                      <div className="font-extrabold truncate">{crew.name}</div>
                      <div className="text-[8px] font-mono text-slate-400 mt-0.5 tracking-wider uppercase">{crew.type}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black tracking-wider uppercase ${crew.color}`}>
                        {crew.status}
                      </span>
                      {crew.incident !== "None" && (
                        <span className="text-[8px] font-mono text-slate-450 block mt-0.5">ID: {crew.incident}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3 mt-4 text-[9px] font-mono text-slate-400 flex items-center space-x-1 select-none">
              <Activity className="w-3.5 h-3.5 text-brand-primary animate-pulse shrink-0" />
              <span>Helper networks fully linked to EOC dispatcher loops.</span>
            </div>
          </div>

        </div>

      </div>

      {/* 📍 LIVE NAVIGATION MAP VECTOR */}
      {activeMission && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-12">
            <GisTrackingMap />
          </div>
        </div>
      )}

    </div>
  );
}
