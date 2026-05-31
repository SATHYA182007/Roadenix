"use client";

import React, { useState, useEffect } from "react";
import { useRoadSos } from "@/context/RoadSosContext";
import { useAuth } from "@/context/AuthContext";
import { 
  Cpu, 
  ShieldAlert, 
  MapPin, 
  PhoneCall, 
  Wrench, 
  Compass, 
  Plus, 
  Trash2,
  AlertTriangle,
  Flame,
  Radio,
  Clock,
  Sparkles,
  CheckCircle2,
  Truck
} from "lucide-react";

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relation: string;
}

export default function DriverDashboard() {
  const { user } = useAuth();
  const { 
    telemetry, 
    serviceMode, 
    toggleServiceMode, 
    simulateCrash,
    simulateFatigue,
    fatigueAlert,
    incidents
  } = useRoadSos();

  const isBike = user?.vehicleType === "BIKE";

  // State-driven emergency contacts persisted to LocalStorage
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [newContactName, setNewContactName] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");
  const [newContactRelation, setNewContactRelation] = useState("Family");

  useEffect(() => {
    const saved = localStorage.getItem("roadsos_contacts");
    if (saved) {
      try { setContacts(JSON.parse(saved)); } catch (e) {}
    } else {
      const defaults = [
        { id: "c1", name: "David Jenkins", phone: "+1 (555) 732-4412", relation: "Spouse" },
        { id: "c2", name: "Medical Coordinator Helpline", phone: "+1 (555) 911-0800", relation: "First Responder Help" },
      ];
      setContacts(defaults);
      localStorage.setItem("roadsos_contacts", JSON.stringify(defaults));
    }
  }, []);

  const addContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName.trim() || !newContactPhone.trim()) return;
    const newC: EmergencyContact = {
      id: `cnt-${Math.random().toString(36).substr(2, 9)}`,
      name: newContactName,
      phone: newContactPhone,
      relation: newContactRelation,
    };
    const next = [...contacts, newC];
    setContacts(next);
    localStorage.setItem("roadsos_contacts", JSON.stringify(next));
    setNewContactName("");
    setNewContactPhone("");
  };

  const removeContact = (id: string) => {
    const next = contacts.filter(c => c.id !== id);
    setContacts(next);
    localStorage.setItem("roadsos_contacts", JSON.stringify(next));
  };

  // SVG Gauge helpers
  const radius = 50;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const getStrokeOffset = (value: number, max: number) => {
    const ratio = Math.max(0, Math.min(max, value)) / max;
    return circumference - ratio * circumference;
  };

  // Find active incident for the logged-in user
  const activeIncident = incidents.find(i => 
    (i.driverName === user?.name || i.driverPhone === user?.phone) && 
    i.status !== "ARCHIVED"
  );

  const incidentStatus = activeIncident?.status;
  const isResolvedStatus = incidentStatus === "RESOLVED";

  return (
    <div className="space-y-6">
      
      {/* 🚨 ACTIVE EOC INCIDENT STEP TIMELINE */}
      {activeIncident && incidentStatus && (
        <div className="glass-card p-6 border-red-500/20 bg-gradient-to-br from-red-500/[0.02] to-white relative overflow-hidden space-y-4">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 to-emerald-500 animate-pulse" />
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-emergency animate-ping shrink-0" />
              <h3 className="text-xs font-black text-brand-navy uppercase tracking-widest">Active Incident EOC CAD Tracking</h3>
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-400">Incident ID: {activeIncident.id}</span>
          </div>

          <div className="grid grid-cols-5 gap-2 text-center select-none pt-2">
            {[
              { label: "Emergency Sent", active: incidentStatus === "NEW" || incidentStatus === "UNDER_REVIEW" || incidentStatus === "ASSIGNED" || incidentStatus === "IN_PROGRESS" || incidentStatus === "NEEDS_SUPPORT" || isResolvedStatus },
              { label: "Authority Assigned", active: incidentStatus === "ASSIGNED" || incidentStatus === "IN_PROGRESS" || incidentStatus === "NEEDS_SUPPORT" || isResolvedStatus },
              { label: "Team Assigned", active: (incidentStatus === "IN_PROGRESS" || incidentStatus === "NEEDS_SUPPORT" || isResolvedStatus) && (activeIncident.helperStatus !== undefined && activeIncident.helperStatus !== "Assigned") },
              { label: "Helper Arriving", active: (incidentStatus === "IN_PROGRESS" || incidentStatus === "NEEDS_SUPPORT") && activeIncident.routeProgress > 0 && (activeIncident.helperStatus === "Travelling" || activeIncident.helperStatus === "Reached" || activeIncident.helperStatus === "Helping" || activeIncident.helperStatus === "Need Backup") },
              { label: "Emergency Resolved", active: isResolvedStatus }
            ].map((step, idx) => (
              <div key={idx} className="flex flex-col items-center space-y-2">
                <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-[10px] font-black transition-all ${
                  step.active 
                    ? "bg-brand-primary border-brand-primary text-white shadow-md shadow-blue-500/10" 
                    : "bg-white border-slate-200 text-slate-400"
                } ${step.active && !isResolvedStatus && idx === Math.max(0, [
                  incidentStatus === "NEW" || incidentStatus === "UNDER_REVIEW",
                  incidentStatus === "ASSIGNED",
                  (incidentStatus === "IN_PROGRESS" || incidentStatus === "NEEDS_SUPPORT") && activeIncident.helperStatus !== "Assigned",
                  (incidentStatus === "IN_PROGRESS" || incidentStatus === "NEEDS_SUPPORT") && activeIncident.routeProgress > 0 && (activeIncident.helperStatus === "Travelling" || activeIncident.helperStatus === "Reached"),
                  isResolvedStatus
                ].lastIndexOf(true)) ? "ring-4 ring-blue-500/20 animate-pulse scale-105" : ""}`}>
                  {step.active ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>
                <span className={`text-[9px] font-black uppercase tracking-wider block ${
                  step.active ? "text-brand-navy font-bold" : "text-slate-450"
                }`}>{step.label}</span>
              </div>
            ))}
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs text-text-secondary">
            <div className="flex items-center space-x-2.5">
              <Truck className="w-4.5 h-4.5 text-brand-primary animate-pulse shrink-0" />
              <span>
                {activeIncident.status === "RESOLVED" ? (
                  <strong className="text-brand-success">Your emergency is RESOLVED. Dynamic telemetry core stabilized.</strong>
                ) : activeIncident.helperStatus === "Travelling" ? (
                  <span>Rescue Team Alpha is en-route. <strong>ETA: {activeIncident.etaMinutes} mins</strong> (Corridor routes pre-cleared)</span>
                ) : activeIncident.helperStatus === "Reached" ? (
                  <strong className="text-brand-primary">Rescue Team Alpha has reached your site. Assistance is active.</strong>
                ) : activeIncident.helperStatus === "Helping" ? (
                  <strong className="text-brand-success">First aid and vehicle recovery support are being provided on-scene.</strong>
                ) : activeIncident.helperStatus === "Need Backup" ? (
                  <strong className="text-brand-warning">Additional support teams and emergency backup resources are arriving.</strong>
                ) : activeIncident.status === "ASSIGNED" ? (
                  <span>Authority has dispatched a responder squad. Awaiting helper crew acceptance...</span>
                ) : (
                  <span>Accident detected. EOC Dispatcher is reviewing telemetry packets...</span>
                )}
              </span>
            </div>
            {activeIncident.hospitalName && (
              <span className="text-[9px] font-bold text-brand-primary bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Destination: {activeIncident.hospitalName}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Simulation triggers panel */}
      <div className="glass-card p-6 bg-gradient-to-r from-blue-50/50 to-indigo-50/30 border-blue-500/10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-blue-100 text-[10px] font-bold text-brand-primary uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-brand-primary animate-pulse" />
            <span>Telemetry Simulation Center</span>
          </div>
          <h2 className="text-base font-black text-brand-navy">AI Crash & Fatigue Tester</h2>
          <p className="text-xs text-text-secondary">Simulate high-impact telemetry loops to verify automated dispatch CAD systems.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={simulateCrash}
            disabled={serviceMode}
            className={`px-5 py-3 rounded-xl text-xs font-bold text-white shadow-md transition-all active:scale-95 flex items-center space-x-2 ${
              serviceMode 
                ? "bg-slate-300 cursor-not-allowed shadow-none" 
                : "bg-brand-emergency hover:bg-red-600 shadow-red-500/10"
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Simulate Anomaly (Crash)</span>
          </button>

          <button
            onClick={simulateFatigue}
            className="px-5 py-3 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/10 transition-all active:scale-95 flex items-center space-x-2"
          >
            <Clock className="w-4 h-4" />
            <span>Simulate Fatigue (Eye Blink)</span>
          </button>

          <button
            onClick={toggleServiceMode}
            className={`px-5 py-3 rounded-xl text-xs font-bold transition-all border active:scale-95 flex items-center space-x-2 ${
              serviceMode 
                ? "bg-brand-warning text-white border-brand-warning shadow-md shadow-amber-500/10" 
                : "bg-white text-text-secondary border-slate-200 hover:bg-slate-50 shadow-sm"
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>{serviceMode ? "Disable Service Mode" : "Enable Service Mode"}</span>
          </button>
        </div>
      </div>

      {/* Primary Gauges & Metrics display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Core HUD Cluster */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="glass-card p-6 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-6">
              <div>
                <h3 className="text-base font-black text-brand-navy">Ecosystem Telemetry Cluster</h3>
                <p className="text-xs text-text-secondary mt-0.5">Live MQTT payload streamed at 10Hz.</p>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                isBike ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-brand-primary"
              }`}>
                {isBike ? "BIKE MODULE" : "CAR MODULE"}
              </span>
            </div>

            {/* Circular vector gauges cluster */}
            <div className="flex flex-col sm:flex-row items-center justify-around gap-8 mb-6 py-4">
              
              {/* Gauge 1: Speed */}
              <div className="flex flex-col items-center space-y-2">
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 116 116">
                    <circle
                      className="text-slate-100"
                      strokeWidth={stroke}
                      stroke="currentColor"
                      fill="transparent"
                      r={normalizedRadius}
                      cx={radius + stroke}
                      cy={radius + stroke}
                    />
                    <circle
                      className="text-brand-primary transition-all duration-500"
                      strokeWidth={stroke}
                      strokeDasharray={circumference + " " + circumference}
                      style={{ strokeDashoffset: getStrokeOffset(telemetry.speed, 140) }}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r={normalizedRadius}
                      cx={radius + stroke}
                      cy={radius + stroke}
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-3xl font-extrabold text-brand-navy block leading-none">{telemetry.speed}</span>
                    <span className="text-[10px] font-black text-muted uppercase tracking-wider">KM/H</span>
                  </div>
                </div>
                <span className="text-xs font-black text-text-secondary tracking-wide uppercase">Speedometer</span>
              </div>

              {/* Gauge 2: Shock force */}
              <div className="flex flex-col items-center space-y-2">
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 116 116">
                    <circle
                      className="text-slate-100"
                      strokeWidth={stroke}
                      stroke="currentColor"
                      fill="transparent"
                      r={normalizedRadius}
                      cx={radius + stroke}
                      cy={radius + stroke}
                    />
                    <circle
                      className="text-brand-light transition-all duration-500"
                      strokeWidth={stroke}
                      strokeDasharray={circumference + " " + circumference}
                      style={{ strokeDashoffset: getStrokeOffset(telemetry.shockG, 8) }}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r={normalizedRadius}
                      cx={radius + stroke}
                      cy={radius + stroke}
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-3xl font-extrabold text-brand-navy block leading-none">{telemetry.shockG}</span>
                    <span className="text-[10px] font-black text-muted uppercase tracking-wider">G Load</span>
                  </div>
                </div>
                <span className="text-xs font-black text-text-secondary tracking-wide uppercase">Shock Sensor</span>
              </div>

            </div>

            {/* Bottom Telemetry Metrics grid (Car vs Bike differences) */}
            {isBike ? (
              // BIKE MODE UI
              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-6">
                
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black text-muted uppercase block">Tilt Angle</span>
                    <span className="text-lg font-black text-brand-navy block mt-0.5">{telemetry.tiltAngle}°</span>
                  </div>
                  <Compass className="w-6 h-6 text-brand-primary" />
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black text-muted uppercase block">Helmet Safety</span>
                    <span className={`text-xs font-extrabold block mt-1 ${
                      telemetry.helmetDetected ? "text-brand-success" : "text-brand-emergency animate-pulse"
                    }`}>
                      {telemetry.helmetDetected ? "HELMET SECURED" : "HELMET EJECTED / NO COMPLIANCE"}
                    </span>
                  </div>
                  <Radio className={`w-6 h-6 ${telemetry.helmetDetected ? "text-brand-success" : "text-brand-emergency"}`} />
                </div>

              </div>
            ) : (
              // CAR MODE UI
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 pt-6">
                
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black text-muted uppercase block">Fuel Level</span>
                    <span className="text-lg font-black text-brand-navy block mt-0.5">{Math.round(telemetry.fuelLevel)}%</span>
                  </div>
                  <div className="w-1.5 h-8 bg-slate-200 rounded-full overflow-hidden">
                    <div className="bg-brand-primary h-full" style={{ height: `${telemetry.fuelLevel}%` }} />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black text-muted uppercase block">Engine Heat</span>
                    <span className="text-lg font-black text-brand-navy block mt-0.5">{telemetry.engineTemp}°C</span>
                  </div>
                  <span className={`text-[10px] font-bold ${telemetry.engineTemp > 100 ? "text-brand-emergency" : "text-brand-success"}`}>
                    {telemetry.engineTemp > 100 ? "OVERHEAT" : "NOMINAL"}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                  <span className="text-[10px] font-black text-muted uppercase block">Tire Pressures (PSI)</span>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs font-semibold text-brand-navy">
                    <div className="flex justify-between"><span>FL:</span> <span>{telemetry.tirePressure.fl}</span></div>
                    <div className="flex justify-between"><span>FR:</span> <span>{telemetry.tirePressure.fr}</span></div>
                    <div className="flex justify-between"><span>RL:</span> <span>{telemetry.tirePressure.rl}</span></div>
                    <div className="flex justify-between"><span>RR:</span> <span>{telemetry.tirePressure.rr}</span></div>
                  </div>
                </div>

              </div>
            )}

            {/* Fire and Smoke Indicator banners if active */}
            {(telemetry.fireSensor || telemetry.smokeSensor) && (
              <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs font-bold text-brand-emergency flex items-center space-x-2 animate-pulse">
                <Flame className="w-4 h-4 text-brand-emergency animate-bounce" />
                <span>🚨 HAZARD TRIGGERED: {telemetry.fireSensor ? "FIRE CELL ACTIVE" : ""} {telemetry.smokeSensor ? "SMOKE LEVEL Spiked (800ppm)" : ""}</span>
              </div>
            )}

          </div>
        </div>

        {/* Emergency Contacts Sidebar Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-6 bg-white space-y-6">
            <div>
              <h3 className="text-base font-black text-brand-navy">Designated Contacts</h3>
              <p className="text-xs text-text-secondary mt-0.5">Notified automatically upon verified accident triggers.</p>
            </div>

            {/* Add Contact Form */}
            <form onSubmit={addContact} className="space-y-3">
              <input
                type="text"
                placeholder="Full Name"
                value={newContactName}
                onChange={(e) => setNewContactName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-brand-primary"
              />
              <div className="flex gap-2">
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={newContactPhone}
                  onChange={(e) => setNewContactPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-brand-primary"
                />
                <select
                  value={newContactRelation}
                  onChange={(e) => setNewContactRelation(e.target.value)}
                  className="px-2 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-brand-primary cursor-pointer font-bold text-text-secondary bg-white"
                >
                  <option value="Family">Family</option>
                  <option value="Friend">Friend</option>
                  <option value="Doctor">Doctor</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-brand-primary hover:bg-brand-light text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Crisis Contact</span>
              </button>
            </form>

            {/* Contacts list */}
            <div className="space-y-2 border-t border-slate-100 pt-4">
              {contacts.length === 0 ? (
                <p className="text-xs text-muted text-center py-2">No emergency contacts saved.</p>
              ) : (
                contacts.map(cnt => (
                  <div key={cnt.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="text-xs font-extrabold text-brand-navy flex items-center space-x-1.5">
                        <span>{cnt.name}</span>
                        <span className="px-1.5 py-0.5 rounded bg-blue-100 text-[8px] font-bold text-brand-primary uppercase">
                          {cnt.relation}
                        </span>
                      </div>
                      <div className="text-[10px] text-text-secondary mt-0.5 font-bold">{cnt.phone}</div>
                    </div>
                    <button
                      onClick={() => removeContact(cnt.id)}
                      className="p-1.5 rounded-lg text-text-secondary hover:text-brand-emergency hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
