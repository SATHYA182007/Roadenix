"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useRoadSos } from "@/context/RoadSosContext";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

// Role-based Dashboards
import SuperAdminDashboard from "@/components/roles/SuperAdminDashboard";
import DriverDashboard from "@/components/roles/DriverDashboard";
import EmergencyTeamDashboard from "@/components/roles/EmergencyTeamDashboard";
import ResponderDashboard from "@/components/roles/ResponderDashboard";
import VehicleMonitoringDashboard from "@/components/roles/VehicleMonitoringDashboard";
import AdminDashboard from "@/components/roles/AdminDashboard";

// Widgets
import TerminalLogs from "@/components/widgets/TerminalLogs";
import FatigueDetection from "@/components/widgets/FatigueDetection";
import AiAssistant from "@/components/widgets/AiAssistant";
import GisTrackingMap from "@/components/maps/GisTrackingMap";
import UserSettings from "@/components/widgets/UserSettings";

import { 
  ShieldAlert, 
  MapPin, 
  CheckCircle2, 
  Radio, 
  Activity,
  Compass,
  Car,
  Volume2,
  Trash2,
  Phone,
  Wrench,
  LineChart,
  Clock,
  AlertTriangle,
  Building,
  TrendingDown,
  Cpu,
  Database
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function DashboardRouter() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { 
    showEmergencyModal, 
    countdown, 
    confirmSafety, 
    serviceMode, 
    toggleServiceMode,
    telemetry,
    incidents
  } = useRoadSos();

  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Reset activeTab to "dashboard" upon role changes to prevent tab state contamination
  useEffect(() => {
    if (user?.role) {
      setActiveTab("dashboard");
    }
  }, [user?.role]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="text-center space-y-4">
          <Activity className="w-12 h-12 text-brand-primary animate-spin mx-auto" />
          <h2 className="font-extrabold text-sm text-brand-navy uppercase tracking-widest">Verifying Auth Tokens...</h2>
        </div>
      </div>
    );
  }

  // Helper to render current active views
  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            {user.role === "ADMIN" && <AdminDashboard />}
            {user.role === "AUTHORITY" && <SuperAdminDashboard />}
            {user.role === "EMERGENCY_TEAM" && <ResponderDashboard />}
            {user.role === "USER" && <DriverDashboard />}
          </div>
        );
      
      case "vehicle":
        // Dedicated OBD-II diagnostics & tire calibration hardware cluster
        return (
          <div className="space-y-6">
            <VehicleMonitoringDashboard />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Vehicle Health Overview */}
              <div className="glass-card p-5 bg-white border-slate-200/60">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Vehicle Health Overview</h4>
                <div className="space-y-2 text-xs font-semibold text-text-secondary">
                  <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>Engine Condition:</span> <span className="text-brand-success font-bold">STABLE (96%)</span></div>
                  <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>Fuel Efficiency:</span> <span className="text-brand-primary font-bold">14.2 km/L</span></div>
                  <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>Tire Status:</span> <span className="text-brand-success font-bold">OPTIMAL (32 PSI)</span></div>
                  <div className="flex justify-between"><span>Battery Status:</span> <span className="text-brand-success font-bold">HEALTHY (12.8V)</span></div>
                </div>
              </div>

              {/* Maintenance Suggestions */}
              <div className="glass-card p-5 bg-white border-slate-200/60">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Maintenance Suggestions</h4>
                <div className="space-y-2 text-xs text-text-secondary font-semibold">
                  <div className="flex items-start space-x-2 border-b border-slate-100 pb-1.5">
                    <span className="text-brand-warning font-bold">!</span>
                    <span>Tire Inspection Recommended (Scheduled interval reached).</span>
                  </div>
                  <div className="flex items-start space-x-2 border-b border-slate-100 pb-1.5">
                    <span className="text-brand-success font-bold">✓</span>
                    <span>Fuel System Healthy. Pressure loops verified nominal.</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-brand-success font-bold">✓</span>
                    <span>Engine Temperature Stable ({telemetry.engineTemp}°C). Cooling loop functional.</span>
                  </div>
                </div>
              </div>

              {/* Recent Vehicle Events */}
              <div className="glass-card p-5 bg-white border-slate-200/60">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Recent Vehicle Events</h4>
                <div className="space-y-2 text-xs font-semibold text-text-secondary font-mono">
                  <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>Engine Started:</span> <span className="text-brand-primary font-bold">08:14:02 AM</span></div>
                  <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>GPS Active:</span> <span className="text-brand-success">Satellites Locked</span></div>
                  <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>Speed Threshold Reached:</span> <span className="text-slate-500">Nominal Velocity Check</span></div>
                  <div className="flex justify-between"><span>Sensor Calibration Completed:</span> <span className="text-brand-success">100% Calibrated</span></div>
                </div>
              </div>

            </div>
          </div>
        );

      case "alerts":
        // Incident operations feeds
        return (
          <div className="space-y-6">
            <EmergencyTeamDashboard />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Dispatch Analytics */}
              <div className="glass-card p-6 bg-white border-slate-200/60 flex flex-col justify-between min-h-[220px]">
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Dispatch Analytics</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4.5 h-4.5 text-brand-primary animate-pulse shrink-0" />
                        <span className="text-xs font-bold text-text-secondary">Avg Response Time</span>
                      </div>
                      <span className="text-sm font-black text-brand-navy">4.2 minutes</span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-text-secondary">
                        <span>Dispatch Success Rate</span>
                        <span className="text-brand-success font-black">99.85%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/40">
                        <div className="bg-brand-success h-full rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)]" style={{ width: "99.85%" }} />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-brand-emergency animate-ping shrink-0" />
                        <span className="text-xs font-bold text-text-secondary">Active Incident Load</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-red-50 text-brand-emergency font-black text-[10px] uppercase border border-red-100">
                        {incidents.filter(i => i.status !== "RESOLVED").length} Alerts Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Response Readiness */}
              <div className="glass-card p-6 bg-white border-slate-200/60 flex flex-col justify-between min-h-[220px]">
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Response Readiness</h4>
                  <div className="space-y-3">
                    
                    {/* Ambulances */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-text-secondary">
                        <span className="flex items-center space-x-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                          <span>Ambulances Standby</span>
                        </span>
                        <span className="text-brand-navy font-mono">14 / 20 Units</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: "70%" }} />
                      </div>
                    </div>

                    {/* Police */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-text-secondary">
                        <span className="flex items-center space-x-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                          <span>Police Patrol Squads</span>
                        </span>
                        <span className="text-brand-navy font-mono">8 / 10 Squads</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-full" style={{ width: "80%" }} />
                      </div>
                    </div>

                    {/* Fire */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-text-secondary">
                        <span className="flex items-center space-x-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                          <span>Fire Engine Squads</span>
                        </span>
                        <span className="text-brand-navy font-mono">4 / 5 Squads</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-red-500 h-full rounded-full" style={{ width: "80%" }} />
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* Emergency Event Feed */}
              <div className="glass-card p-6 bg-white border-slate-200/60 flex flex-col justify-between min-h-[220px]">
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Emergency Event Feed</h4>
                  
                  {/* Timeline */}
                  <div className="space-y-3.5 relative pl-3.5 border-l border-slate-100 ml-1.5">
                    
                    {/* Item 1 */}
                    <div className="relative text-xs">
                      <span className="absolute -left-5 top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping pointer-events-none" />
                      <span className="absolute -left-5 top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <div className="font-extrabold text-brand-navy">Dispatch Corridors Active</div>
                      <p className="text-[9px] text-slate-400 font-semibold mt-0.5">Optimal corridor signals locked. Received & Processing.</p>
                    </div>

                    {/* Item 2 */}
                    <div className="relative text-xs">
                      <span className="absolute -left-5 top-1.5 w-2.5 h-2.5 rounded-full bg-brand-emergency animate-pulse pointer-events-none" />
                      <span className="absolute -left-5 top-1.5 w-2.5 h-2.5 rounded-full bg-brand-emergency" />
                      <div className="font-extrabold text-brand-navy">Global SOS Broadcast</div>
                      <p className="text-[9px] text-slate-400 font-semibold mt-0.5">EOC Alert Active broadcasts streams.</p>
                    </div>

                    {/* Item 3 */}
                    <div className="relative text-xs">
                      <span className="absolute -left-5 top-1.5 w-2.5 h-2.5 rounded-full bg-brand-primary" />
                      <div className="font-extrabold text-brand-navy">Traffic Lights Bypassed</div>
                      <p className="text-[9px] text-slate-400 font-semibold mt-0.5">Corridor Sector 4 pre-cleared for ambulance vectors.</p>
                    </div>

                  </div>
                </div>
              </div>

            </div>
          </div>
        );

      case "gps":
        // GIS command mapping full screen view
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8">
                <GisTrackingMap />
              </div>
              <div className="lg:col-span-4 glass-card p-6 bg-white space-y-4">
                <h3 className="text-sm font-black text-brand-navy uppercase">Tracking Telemetrics</h3>
                <div className="space-y-3 font-mono text-xs text-text-secondary">
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span>GPS Status</span>
                    <span className="text-brand-success font-bold">STRONG</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span>Active Nodes</span>
                    <span className="font-bold">{incidents.length} Monitored</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span>Coordinates</span>
                    <span className="font-bold">37.7749, -122.4194</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Route Analytics */}
              <div className="glass-card p-5 bg-white border-slate-200/60">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Route Analytics</h4>
                <div className="space-y-2 text-xs font-semibold text-text-secondary">
                  <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>Distance Traveled:</span> <span className="font-bold">24.5 km</span></div>
                  <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>Average Speed:</span> <span className="font-bold">{telemetry.speed} km/h</span></div>
                  <div className="flex justify-between"><span>Estimated Arrival Time:</span> <span className="font-bold">4.2 Minutes</span></div>
                </div>
              </div>

              {/* Nearby Emergency Services */}
              <div className="glass-card p-5 bg-white border-slate-200/60">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Nearby Emergency Services</h4>
                <div className="space-y-2 text-xs font-semibold text-text-secondary">
                  <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>Hospitals:</span> <span className="text-brand-primary font-bold">0.8 km</span></div>
                  <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>Police Stations:</span> <span className="text-brand-primary font-bold">1.4 km</span></div>
                  <div className="flex justify-between"><span>Fire Stations:</span> <span className="text-brand-primary font-bold">2.1 km</span></div>
                </div>
              </div>

              {/* GPS Accuracy Report */}
              <div className="glass-card p-5 bg-white border-slate-200/60">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">GPS Accuracy Report</h4>
                <div className="space-y-2 text-xs font-semibold text-text-secondary">
                  <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>Signal Strength:</span> <span className="text-brand-success font-bold">STRONG</span></div>
                  <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>Last Sync Time:</span> <span className="font-mono">{new Date().toLocaleTimeString()}</span></div>
                  <div className="flex justify-between"><span>Location Accuracy:</span> <span className="text-brand-success font-bold">±1.8 meters</span></div>
                </div>
              </div>

              {/* Travel History */}
              <div className="glass-card p-5 bg-white border-slate-200/60">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Travel History</h4>
                <div className="space-y-2 text-xs font-semibold text-text-secondary font-mono">
                  <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>Current Route:</span> <span>Vector Targets Locked</span></div>
                  <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>Previous Route:</span> <span>Hwy 101 South Corridor</span></div>
                  <div className="flex justify-between"><span>Last Known Location:</span> <span>Coordinate Centered</span></div>
                </div>
              </div>
            </div>

          </div>
        );

      case "analytics":
        // AI diagnostic Recharts panel
        return (
          <div className="space-y-6">
            <div className="glass-card p-6 bg-white space-y-6">
              <div>
                <h3 className="text-base font-black text-brand-navy">AI Incident & Acceleration Analytics</h3>
                <p className="text-xs text-text-secondary mt-0.5 font-medium">Monthly calibration records.</p>
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { month: "Jan", safe: 120, alerts: 2 },
                    { month: "Feb", safe: 180, alerts: 1 },
                    { month: "Mar", safe: 240, alerts: 4 },
                    { month: "Apr", safe: 190, alerts: 3 },
                    { month: "May", safe: 210, alerts: 0 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                    <YAxis stroke="#94A3B8" fontSize={11} />
                    <Tooltip />
                    <Bar dataKey="safe" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="alerts" fill="#EF4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* AI Decision Insights */}
              <div className="glass-card p-5 bg-white border-slate-200/60">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">AI Decision Insights</h4>
                <div className="space-y-2 text-xs font-semibold text-text-secondary">
                  <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>Current Threat Level:</span> <span className="text-brand-success font-bold">NORMAL</span></div>
                  <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>Safety Classification:</span> <span className="text-brand-success font-bold">SECURE DRIVE</span></div>
                  <div className="flex justify-between"><span>Confidence Explanation:</span> <span className="text-brand-success font-bold">99.8% Nominal (Zero Spikes)</span></div>
                </div>
              </div>

              {/* Risk Prediction */}
              <div className="glass-card p-5 bg-white border-slate-200/60">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Risk Prediction</h4>
                <div className="space-y-2 text-xs font-semibold text-text-secondary">
                  <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>Collision Risk:</span> <span className="font-bold text-brand-navy">LOW (0.02%)</span></div>
                  <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>Fire Risk:</span> <span className="font-bold text-brand-navy">LOW (0.01%)</span></div>
                  <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>Fatigue Risk:</span> <span className="font-bold text-brand-navy">LOW ({telemetry.driverFatigueScore}%)</span></div>
                  <div className="flex justify-between"><span>Mechanical Failure Risk:</span> <span className="font-bold text-brand-navy">LOW (0.04%)</span></div>
                </div>
              </div>

              {/* AI Recommendations */}
              <div className="glass-card p-5 bg-white border-slate-200/60">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">AI Recommendations</h4>
                <div className="space-y-2 text-xs text-text-secondary font-semibold">
                  <div className="flex items-start space-x-1.5 border-b border-slate-100 pb-1.5">
                    <span className="text-brand-success">✓</span>
                    <span>Continue Monitoring active telemetry feeds.</span>
                  </div>
                  <div className="flex items-start space-x-1.5 border-b border-slate-100 pb-1.5">
                    <span className="text-brand-success">✓</span>
                    <span>Driver Fatigue Low (Alertness is optimal).</span>
                  </div>
                  <div className="flex items-start space-x-1.5">
                    <span className="text-brand-success">✓</span>
                    <span>No Emergency Required at present.</span>
                  </div>
                </div>
              </div>

              {/* Recent AI Events */}
              <div className="glass-card p-5 bg-white border-slate-200/60">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Recent AI Events</h4>
                <div className="space-y-2 text-xs font-semibold text-text-secondary font-mono">
                  <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>Accident Anomaly Check:</span> <span>Passed</span></div>
                  <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>Roll Angle Anomaly:</span> <span>2° (Passed)</span></div>
                  <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>Fatigue Indicator:</span> <span>Passed</span></div>
                  <div className="flex justify-between"><span>Sensor Health Loop:</span> <span className="text-brand-success">Nominal</span></div>
                </div>
              </div>
            </div>

          </div>
        );

      case "iot":
        // IoT Streams
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TerminalLogs />
              <div className="glass-card p-6 bg-white space-y-4">
                <h3 className="text-sm font-black text-brand-navy uppercase">MQTT Payload broker</h3>
                <p className="text-xs text-text-secondary leading-relaxed font-semibold">
                  Aggregating telemetry packages via topic <span className="font-bold font-mono text-brand-primary">/vehicle/telemetry/+</span>. High frequency ESP32 accelerometer registers spike triggers in real-time.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Sensor Performance */}
              <div className="glass-card p-5 bg-white border-slate-200/60">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Sensor Performance</h4>
                <div className="space-y-2 text-xs font-semibold text-text-secondary">
                  <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>Sensor Reliability:</span> <span className="text-brand-success font-bold">99.85%</span></div>
                  <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>Data Consistency:</span> <span className="text-brand-success font-bold">EXCELLENT</span></div>
                  <div className="flex justify-between"><span>Update Frequency:</span> <span className="font-bold">100Hz (ESP32 Node)</span></div>
                </div>
              </div>

              {/* ESP32 Diagnostics */}
              <div className="glass-card p-5 bg-white border-slate-200/60">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">ESP32 Diagnostics</h4>
                <div className="space-y-2 text-xs font-semibold text-text-secondary">
                  <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>CPU Status:</span> <span className="text-brand-success font-bold">NOMINAL (14% Load)</span></div>
                  <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>Memory Usage:</span> <span className="font-bold">184 KB Free / 520 KB</span></div>
                  <div className="flex justify-between"><span>Connection Stability:</span> <span className="text-brand-success font-bold">99.9% Online</span></div>
                </div>
              </div>

              {/* MQTT Statistics */}
              <div className="glass-card p-5 bg-white border-slate-200/60">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">MQTT Statistics</h4>
                <div className="space-y-2 text-xs font-semibold text-text-secondary font-mono">
                  <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>Messages Sent:</span> <span>1,424 packets</span></div>
                  <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>Messages Received:</span> <span>1,424 packets</span></div>
                  <div className="flex justify-between"><span>Packet Success Rate:</span> <span className="text-brand-success font-bold">100.0%</span></div>
                </div>
              </div>

              {/* Sensor Event History */}
              <div className="glass-card p-5 bg-white border-slate-200/60">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Recent Sensor Activities</h4>
                <div className="space-y-2 text-xs font-semibold text-text-secondary font-mono">
                  <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>Accelerometer Sync:</span> <span>OK</span></div>
                  <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>Decelerometer Sync:</span> <span>OK</span></div>
                  <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>Gyroscope Sync:</span> <span>OK</span></div>
                  <div className="flex justify-between"><span>Helmet Lock Sensor:</span> <span className="text-brand-success">OK</span></div>
                </div>
              </div>
            </div>

          </div>
        );

      case "service":
        // Service mode toggle panel
        return (
          <div className="space-y-6">
            <div className={`glass-card p-8 border transition-all ${
              serviceMode ? "bg-amber-50/20 border-amber-200" : "bg-white border-slate-200"
            }`}>
              <div className="flex items-center space-x-4 mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  serviceMode ? "bg-amber-100 text-brand-warning animate-pulse" : "bg-slate-100 text-text-secondary"
                }`}>
                  <Wrench className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-brand-navy">Service Mode Console</h2>
                  <p className="text-xs text-text-secondary mt-0.5">Pause automated G-Force emergency dispatches during maintenance.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl">
                  <div>
                    <div className="text-sm font-bold text-brand-navy">Service Mode Override Trigger</div>
                    <p className="text-xs text-text-secondary mt-0.5">Toggle to prevent CAD routing.</p>
                  </div>
                  <button
                    onClick={toggleServiceMode}
                    className={`px-5 py-2.5 rounded-lg text-xs font-bold text-white transition-all shadow-sm ${
                      serviceMode ? "bg-brand-warning hover:bg-amber-600" : "bg-brand-primary hover:bg-brand-light"
                    }`}
                  >
                    {serviceMode ? "DEACTIVATE OVERRIDE" : "ACTIVATE SERVICE OVERRIDE"}
                  </button>
                </div>

                {serviceMode && (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 text-xs text-brand-warning font-bold flex items-center space-x-2">
                    <ShieldAlert className="w-4 h-4 animate-bounce" />
                    <span>SERVICE OVERRIDE ACTIVE: Crash detection triggers bypassed. CAD routing locked.</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Diagnostic Summary */}
              <div className="glass-card p-5 bg-white border-slate-200/60">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Diagnostic Summary</h4>
                <div className="space-y-2 text-xs font-semibold text-text-secondary">
                  <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>Engine Condition:</span> <span className="text-brand-success font-bold">NOMINAL</span></div>
                  <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>Battery Condition:</span> <span className="text-brand-success font-bold">12.8V (Healthy)</span></div>
                  <div className="flex justify-between"><span>Sensor Status:</span> <span className="text-brand-success font-bold">100% CALIBRATED</span></div>
                </div>
              </div>

              {/* Maintenance Timeline */}
              <div className="glass-card p-5 bg-white border-slate-200/60">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Maintenance Timeline</h4>
                <div className="space-y-2 text-xs font-semibold text-text-secondary">
                  <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>Last Service Date:</span> <span className="font-bold">2026-05-15</span></div>
                  <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>Upcoming Service Date:</span> <span className="font-bold">2026-08-15</span></div>
                  <div className="flex justify-between"><span>Completed Repairs:</span> <span className="text-brand-success font-bold">Chassis G-sensor Re-calib</span></div>
                </div>
              </div>

              {/* Vehicle Diagnostics Report */}
              <div className="glass-card p-5 bg-white border-slate-200/60">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Vehicle Diagnostics Report</h4>
                <div className="space-y-2 text-xs font-semibold text-text-secondary font-mono">
                  <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>Fuel System Healthy:</span> <span className="text-brand-success font-bold">YES (NOMINAL)</span></div>
                  <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>Tire Pressure Normal:</span> <span className="text-brand-success font-bold">YES (32 PSI)</span></div>
                  <div className="flex justify-between"><span>Battery Stable:</span> <span className="text-brand-success font-bold">YES (12.8V / 94%)</span></div>
                </div>
              </div>
            </div>

          </div>
        );

      case "history":
        // Accident History
        return (
          <div className="space-y-6">
            <div className="glass-card p-6 bg-white space-y-4">
              <div>
                <h3 className="text-base font-black text-brand-navy">Accident History Archive</h3>
                <p className="text-xs text-text-secondary mt-0.5 font-medium">Historical verification records saved to Firestore.</p>
              </div>
              <div className="space-y-3">
                {incidents.filter(i => i.status === "RESOLVED").map((inc) => (
                  <div key={inc.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-extrabold text-brand-navy">{inc.driverName} ({inc.id})</div>
                      <div className="text-[10px] text-brand-emergency font-bold mt-1">{inc.accidentReason}</div>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-emerald-100 text-brand-success font-black uppercase tracking-wider text-[9px]">
                      Resolved
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Incident Statistics */}
              <div className="glass-card p-5 bg-white border-slate-200/60">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Incident Statistics</h4>
                <div className="space-y-2 text-xs font-semibold text-text-secondary">
                  <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>Monthly Incidents:</span> <span className="font-bold">14 Crashes Logged</span></div>
                  <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>Severity Trends:</span> <span className="text-brand-emergency font-bold">100% Dispatch Successful</span></div>
                  <div className="flex justify-between"><span>False Alert Trends:</span> <span className="text-brand-success font-bold">4 False alarms aborted</span></div>
                </div>
              </div>

              {/* Location Insights */}
              <div className="glass-card p-5 bg-white border-slate-200/60">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Location Insights</h4>
                <div className="space-y-2 text-xs font-semibold text-text-secondary">
                  <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>Most Frequent Incident Areas:</span> <span className="font-bold">Interstate 80 Corridor</span></div>
                  <div className="flex justify-between"><span>High-Risk Zones:</span> <span className="text-brand-emergency font-bold">3 Smart-City flagged segments</span></div>
                </div>
              </div>

              {/* AI Performance */}
              <div className="glass-card p-5 bg-white border-slate-200/60">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">AI Performance</h4>
                <div className="space-y-2 text-xs font-semibold text-text-secondary">
                  <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>Detection Accuracy:</span> <span className="text-brand-success font-bold">99.8%</span></div>
                  <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>False Positive Rate:</span> <span className="text-brand-success font-bold">0.01%</span></div>
                  <div className="flex justify-between"><span>Average Confidence:</span> <span className="text-brand-success font-bold">96.8% Verified</span></div>
                </div>
              </div>

              {/* Historical Trends */}
              <div className="glass-card p-5 bg-white border-slate-200/60">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Historical Trends</h4>
                <div className="space-y-2 text-xs font-semibold text-text-secondary font-mono">
                  <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>Accident Growth Analysis:</span> <span className="text-brand-success">-38% YoY Decreased Trauma</span></div>
                  <div className="flex justify-between"><span>Response optimization:</span> <span className="text-brand-primary">4x faster medical help</span></div>
                </div>
              </div>
            </div>

          </div>
        );

      case "user_management":
        return (
          <div className="glass-card p-6 bg-white space-y-6">
            <div>
              <h3 className="text-base font-black text-brand-navy">Registered User Directories</h3>
              <p className="text-xs text-text-secondary mt-0.5 font-medium">Manage driver metadata profiles and active EMT responder allocations.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Drivers grid list */}
              <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-xl space-y-3">
                <h4 className="text-xs font-black text-brand-navy uppercase tracking-wider">Registered Driver Profiles</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-white rounded-lg border border-slate-150 flex items-center justify-between text-xs font-semibold text-brand-navy">
                    <div>
                      <div className="font-extrabold">Sarah Jenkins</div>
                      <div className="text-[10px] text-slate-400 mt-0.5 font-medium font-mono">driver@roadsos.com | CAR TYPE</div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-brand-success font-black text-[9px] uppercase tracking-wider">Active</span>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-150 flex items-center justify-between text-xs font-semibold text-brand-navy">
                    <div>
                      <div className="font-extrabold">Robert Miller</div>
                      <div className="text-[10px] text-slate-400 mt-0.5 font-medium font-mono">robert@roadsos.com | BIKE TYPE</div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-brand-success font-black text-[9px] uppercase tracking-wider">Active</span>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-150 flex items-center justify-between text-xs font-semibold text-brand-navy">
                    <div>
                      <div className="font-extrabold">Diana Ross</div>
                      <div className="text-[10px] text-slate-400 mt-0.5 font-medium font-mono">diana@roadsos.com | CAR TYPE</div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-500 font-black text-[9px] uppercase tracking-wider">Standby</span>
                  </div>
                </div>
              </div>

              {/* Responders grid list */}
              <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-xl space-y-3">
                <h4 className="text-xs font-black text-brand-navy uppercase tracking-wider">Rescue Squad Allocations</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-white rounded-lg border border-slate-150 flex items-center justify-between text-xs font-semibold text-brand-navy">
                    <div>
                      <div className="font-extrabold">Rescue Team Alpha (Medic-14)</div>
                      <div className="text-[10px] text-slate-400 mt-0.5 font-medium font-mono">responder@roadsos.com | AMBULANCE</div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-brand-success font-black text-[9px] uppercase tracking-wider">On Standby</span>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-150 flex items-center justify-between text-xs font-semibold text-brand-navy">
                    <div>
                      <div className="font-extrabold">Paramedics Division 4B</div>
                      <div className="text-[10px] text-slate-400 mt-0.5 font-medium font-mono">paramedic4b@roadsos.com | AMBULANCE</div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-red-100 text-brand-emergency font-black text-[9px] uppercase tracking-wider">Active Routing</span>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-150 flex items-center justify-between text-xs font-semibold text-brand-navy">
                    <div>
                      <div className="font-extrabold">Fire Rescue Squad Charlie</div>
                      <div className="text-[10px] text-slate-400 mt-0.5 font-medium font-mono">firecharlie@roadsos.com | FIRE ENGINE</div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-brand-success font-black text-[9px] uppercase tracking-wider">On Standby</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "system":
        return (
          <div className="glass-card p-6 bg-white space-y-6">
            <div>
              <h3 className="text-base font-black text-brand-navy">Ecosystem System Health</h3>
              <p className="text-xs text-text-secondary mt-0.5 font-medium">Live connectivity signals across IoT streams and cloud databases.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* MQTT Broker Status */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black text-slate-400 uppercase">MQTT Gateway</span>
                  <span className="w-2 h-2 rounded-full bg-brand-success animate-pulse" />
                </div>
                <div>
                  <div className="text-sm font-black text-brand-navy leading-none">CONNECTED</div>
                  <span className="text-[10px] font-mono text-muted block mt-1.5">mqtt.roadsos.org:1883</span>
                </div>
              </div>

              {/* ESP32 Watchdog loop */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black text-slate-400 uppercase">ESP32 Watchdog</span>
                  <span className="w-2 h-2 rounded-full bg-brand-success animate-pulse" />
                </div>
                <div>
                  <div className="text-sm font-black text-brand-navy leading-none">ARMED & NOMINAL</div>
                  <span className="text-[10px] font-mono text-muted block mt-1.5">CPU Load: 14% | VCC: 3.31V</span>
                </div>
              </div>

              {/* Firestore database index */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black text-slate-400 uppercase">Cloud Firestore</span>
                  <span className="w-2 h-2 rounded-full bg-brand-success animate-pulse" />
                </div>
                <div>
                  <div className="text-sm font-black text-brand-navy leading-none">SYNCHRONIZED</div>
                  <span className="text-[10px] font-mono text-muted block mt-1.5">Indices: 100% active | 14ms latency</span>
                </div>
              </div>

              {/* CAD API health */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black text-slate-400 uppercase">CAD Routing Router</span>
                  <span className="w-2 h-2 rounded-full bg-brand-success animate-pulse" />
                </div>
                <div>
                  <div className="text-sm font-black text-brand-navy leading-none">ONLINE (QoS 2)</div>
                  <span className="text-[10px] font-mono text-muted block mt-1.5">API response: 18ms nominal</span>
                </div>
              </div>

            </div>
          </div>
        );

      case "reports":
        return (
          <div className="glass-card p-6 bg-white space-y-6">
            <div>
              <h3 className="text-base font-black text-brand-navy">Ecosystem Consolidated Analytics Logs</h3>
              <p className="text-xs text-text-secondary mt-0.5 font-medium">Consolidated quarterly report matrices compiled dynamically.</p>
            </div>
            
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-4">
              <h4 className="text-xs font-black text-brand-navy uppercase tracking-wider">Fleet Calibration Statistics</h4>
              <div className="space-y-2 text-xs font-semibold text-text-secondary">
                <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>Average Paramedic Response Time:</span> <span className="text-brand-primary font-bold">4.2 Minutes</span></div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>CAD Rescue Dispatch Success Rate:</span> <span className="text-brand-success font-bold">99.85%</span></div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>Total System Safety Calibrations:</span> <span className="font-mono">1,424 packets</span></div>
                <div className="flex justify-between"><span>Annual Decreased Traumatic Trauma:</span> <span className="text-brand-success font-bold">-38% YoY</span></div>
              </div>
            </div>
          </div>
        );

      case "contacts":
        // Standalone Emergency Contacts Manager for Drivers
        return (
          <div className="glass-card p-6 bg-white space-y-6">
            <div>
              <h3 className="text-base font-black text-brand-navy">Designated Emergency Contacts Manager</h3>
              <p className="text-xs text-text-secondary mt-0.5 font-medium">Register and delete crisis contacts automatically notified during accident triggers.</p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl max-w-xl mx-auto space-y-4">
              <h4 className="text-xs font-black text-brand-navy uppercase tracking-wider block">Crisis Contacts Directory</h4>
              <div className="space-y-2">
                <div className="p-3.5 bg-white border border-slate-150 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <div className="font-extrabold text-brand-navy flex items-center space-x-2">
                      <span>David Jenkins</span>
                      <span className="px-1.5 py-0.5 rounded bg-blue-100 text-[8px] font-bold text-brand-primary uppercase">Spouse</span>
                    </div>
                    <div className="text-[10px] text-text-secondary mt-0.5 font-bold font-mono">+1 (555) 732-4412</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-brand-primary text-[8px] font-bold">Auto-SMS armed</span>
                </div>

                <div className="p-3.5 bg-white border border-slate-150 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <div className="font-extrabold text-brand-navy flex items-center space-x-2">
                      <span>Medical Coordinator Helpline</span>
                      <span className="px-1.5 py-0.5 rounded bg-blue-100 text-[8px] font-bold text-brand-primary uppercase">First Responder Help</span>
                    </div>
                    <div className="text-[10px] text-text-secondary mt-0.5 font-bold font-mono">+1 (555) 911-0800</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-brand-primary text-[8px] font-bold">Auto-SMS armed</span>
                </div>
              </div>
            </div>
          </div>
        );

      case "ai_safety":
        // Driver Safety Score tab
        return (
          <div className="glass-card p-6 bg-white space-y-6">
            <div>
              <h3 className="text-base font-black text-brand-navy">AI Driving Safety Analysis</h3>
              <p className="text-xs text-text-secondary mt-0.5 font-medium">Cognitive fatigue records, drowsiness indicators, and accident risk values.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Driver Safety Score */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
                <span className="text-[9px] font-black text-slate-400 uppercase block">Driver Safety Score</span>
                <div>
                  <div className="text-2xl font-black text-brand-primary">98 / 100</div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2">
                    <div className="bg-brand-primary h-full rounded-full" style={{ width: "98%" }} />
                  </div>
                </div>
              </div>

              {/* Drowsiness Quotient */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
                <span className="text-[9px] font-black text-slate-400 uppercase block">Drowsiness Alert Index</span>
                <div>
                  <div className="text-2xl font-black text-brand-success leading-none">NOMINAL</div>
                  <span className="text-[10px] text-muted block mt-1.5 font-semibold">Cognitive response within limits</span>
                </div>
              </div>

              {/* Accident Probability */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
                <span className="text-[9px] font-black text-slate-400 uppercase block">Accident Collision Risk</span>
                <div>
                  <div className="text-2xl font-black text-brand-navy leading-none">LOW (0.01%)</div>
                  <span className="text-[10px] text-muted block mt-1.5 font-semibold">Peak G-forces loops stable</span>
                </div>
              </div>

            </div>
          </div>
        );

      case "dispatch":
        // Responder dispatch controls
        return (
          <div className="glass-card p-6 bg-white space-y-6">
            <div>
              <h3 className="text-base font-black text-brand-navy">EMT Dispatch Center Console</h3>
              <p className="text-xs text-text-secondary mt-0.5 font-medium">Verify victim vitals, select ambulance corridors, and allocate response vectors.</p>
            </div>
            
            <div className="p-5 bg-slate-50 border border-slate-100 rounded-xl space-y-4 max-w-xl mx-auto">
              <h4 className="text-xs font-black text-brand-navy uppercase tracking-wider">Active Coordinate Dispatch Controls</h4>
              
              <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-text-secondary border-b border-slate-150 pb-3">
                <div>Selected Incident ID: <span className="font-extrabold text-brand-navy font-mono">inc-104</span></div>
                <div>G-Force Peak: <span className="font-extrabold text-brand-emergency font-mono">6.8G</span></div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button 
                  onClick={() => alert("Rescue Incident Accepted! Pre-clearing dynamic corridor light routes...")}
                  className="px-4 py-2.5 bg-brand-success hover:bg-emerald-600 text-white font-bold rounded-lg text-xs transition-all active:scale-95 shadow-sm cursor-pointer"
                >
                  Accept Incident
                </button>
                <button 
                  onClick={() => alert("Incident Declined. Rerouting dispatch packet back to supervisor queue.")}
                  className="px-4 py-2.5 bg-red-100 hover:bg-red-200 text-brand-emergency font-bold rounded-lg text-xs transition-all active:scale-95 border border-red-200 cursor-pointer"
                >
                  Reject Incident
                </button>
                <button 
                  onClick={() => alert("Status update: Paramedics corridor routing complete. Team on-scene.")}
                  className="px-4 py-2.5 bg-brand-primary hover:bg-brand-light text-white font-bold rounded-lg text-xs transition-all active:scale-95 shadow-sm cursor-pointer"
                >
                  Update Paramedics Status
                </button>
              </div>
            </div>
          </div>
        );

      case "performance":
        // Responder performance stats
        return (
          <div className="glass-card p-6 bg-white space-y-6">
            <div>
              <h3 className="text-base font-black text-brand-navy">Paramedic Performance & Dispatch Analytics</h3>
              <p className="text-xs text-text-secondary mt-0.5 font-medium">Review monthly EMT response times and incident resolution ratios.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Avg Response Time */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <span className="text-[9px] font-black text-slate-400 uppercase block">Average Response Time</span>
                <div className="text-2xl font-black text-brand-primary leading-none">4.2 Minutes</div>
                <span className="text-[9px] font-bold text-brand-success block mt-0.5">45% faster than city average</span>
              </div>

              {/* Resolved cases */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <span className="text-[9px] font-black text-slate-400 uppercase block">Total Incidents Resolved</span>
                <div className="text-2xl font-black text-brand-success leading-none">100% SUCCESS</div>
                <span className="text-[9px] font-semibold text-muted block mt-0.5">All 14 crashes cleared safely</span>
              </div>

              {/* Pending emergencies */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <span className="text-[9px] font-black text-slate-400 uppercase block">Pending Emergency Queue</span>
                <div className="text-2xl font-black text-brand-navy leading-none">0 Pending</div>
                <span className="text-[9px] font-semibold text-brand-success block mt-0.5 font-mono">All drivers verified safe</span>
              </div>

            </div>
          </div>
        );

      case "settings":
        // Settings panel
        return (
          <UserSettings />
        );

      default:
        return <div className="p-4 text-sm font-semibold">Under Development</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans antialiased text-slate-900 relative">
      
      {/* Col 1: Sidebar Drawer */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Col 2: Main Content block (adjust padding for collapsible sidebar) */}
      <main className="flex-1 min-w-0 pl-24 pr-6 py-6 xl:pl-[304px] transition-all duration-300">
        
        {/* Top Header Controls */}
        <Topbar activeTab={activeTab} />

        {/* Dynamic Inner Tab Content */}
        {renderTabContent()}

        {/* Grid panel for secondary simulators in Dashboard — USER role only */}
        {activeTab === "dashboard" && user.role === "USER" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
              
              {/* GIS command tracker map */}
              <div className="xl:col-span-2">
                <GisTrackingMap />
              </div>

              {/* Fatigue camera visual mesh */}
              <div className="xl:col-span-1">
                <FatigueDetection />
              </div>


            </div>

            {/* Dashboard Content-Rich Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Vehicle Health Summary */}
              <div className="glass-card p-5 bg-white border-slate-200/60">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Vehicle Health Summary</h4>
                <div className="space-y-2 text-xs font-semibold text-text-secondary">
                  <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>Overall Score:</span> <span className="text-brand-success font-bold">98/100</span></div>
                  <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>Sensor Reliability:</span> <span className="text-brand-success font-bold">99.85%</span></div>
                  <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>Engine Status:</span> <span className="text-brand-success font-bold">STABLE</span></div>
                  <div className="flex justify-between"><span>GPS Accuracy:</span> <span className="text-brand-success font-bold">±1.8 meters</span></div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="glass-card p-5 bg-white border-slate-200/60">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Recent Activity</h4>
                <div className="space-y-2 text-xs font-semibold text-text-secondary font-mono">
                  <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>Latest GPS Update:</span> <span>37.7749°, -122.4194°</span></div>
                  <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>Last Sensor Reading:</span> <span>1.02G | {telemetry.speed}km/h</span></div>
                  <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>Last AI Analysis:</span> <span>Nominal Classification</span></div>
                  <div className="flex justify-between"><span>Last System Check:</span> <span className="text-brand-success">100% Calibrated</span></div>
                </div>
              </div>

              {/* Emergency Readiness */}
              <div className="glass-card p-5 bg-white border-slate-200/60">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Emergency Readiness</h4>
                <div className="space-y-2 text-xs font-semibold text-text-secondary">
                  <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>Ambulance Availability:</span> <span className="text-brand-success font-bold">14 Units Ready</span></div>
                  <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>Police Availability:</span> <span className="text-brand-success font-bold">8 Squads Ready</span></div>
                  <div className="flex justify-between"><span>Fire Response Availability:</span> <span className="text-brand-success font-bold">4 Squads Ready</span></div>
                </div>
              </div>

              {/* AI Insights */}
              <div className="glass-card p-5 bg-white border-slate-200/60">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">AI Insights</h4>
                <div className="space-y-2 text-xs font-semibold text-text-secondary">
                  <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>Current Risk Level:</span> <span className="text-brand-success font-bold">ZERO THREAT</span></div>
                  <div className="flex justify-between border-b border-slate-100 pb-1.5"><span>Driver Safety Score:</span> <span className="text-brand-primary font-bold">98/100</span></div>
                  <div className="flex justify-between"><span>Crash Probability Trend:</span> <span className="font-bold text-text-secondary">STABLE (0.01%)</span></div>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* 🚨 PREMIUM EMERGENCIES VERIFICATION MODAL 🚨 */}
      {showEmergencyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6">
          <div className="glass-card p-8 border-red-500 bg-white shadow-2xl shadow-red-500/20 max-w-md w-full text-center space-y-6 relative overflow-hidden">
            
            {/* Blinking alarm background glow */}
            <div className="absolute inset-0 bg-red-500/5 animate-pulse pointer-events-none" />

            <div className="w-16 h-16 rounded-full bg-red-100 text-brand-emergency flex items-center justify-center mx-auto shadow-inner animate-bounce">
              <ShieldAlert className="w-8 h-8 text-brand-emergency" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-brand-navy">🚨 Are You Safe?</h2>
              <p className="text-sm text-text-secondary leading-relaxed font-semibold">
                RoadSOS Edge AI sensors detected a critical impact G-spike of <span className="font-extrabold text-brand-emergency">6.8G</span>. 
              </p>
              <p className="text-xs text-muted leading-relaxed">
                If you do not reply, we will automatically confirm the crash and dispatch immediate Ambulance, Police, and Fire squad coordinates.
              </p>
            </div>

            {/* Circular Countdown Ring */}
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  className="text-slate-100"
                  strokeWidth="6"
                  stroke="currentColor"
                  fill="transparent"
                  r="34"
                  cx="48"
                  cy="48"
                />
                <circle
                  className="text-brand-emergency transition-all duration-1000"
                  strokeWidth="6"
                  strokeDasharray={`${2 * Math.PI * 34}`}
                  style={{ strokeDashoffset: `${((10 - countdown) / 10) * (2 * Math.PI * 34)}` }}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="34"
                  cx="48"
                  cy="48"
                />
              </svg>
              <span className="absolute text-2xl font-extrabold text-brand-navy leading-none">
                {countdown}s
              </span>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => confirmSafety(true)}
                className="flex-1 bg-brand-success hover:bg-emerald-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer text-sm"
              >
                Yes, I am Safe
              </button>
              <button
                onClick={() => confirmSafety(false)}
                className="flex-1 bg-brand-emergency hover:bg-red-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer text-sm animate-pulse"
              >
                No, Send Help!
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
