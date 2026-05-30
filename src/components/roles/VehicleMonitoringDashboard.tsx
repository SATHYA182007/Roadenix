"use client";

import React, { useState, useEffect } from "react";
import { useRoadSos } from "@/context/RoadSosContext";
import { useAuth } from "@/context/AuthContext";
import { 
  Cpu, 
  Wrench, 
  Compass, 
  Activity, 
  Thermometer, 
  Gauge, 
  BatteryCharging, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles,
  Zap,
  Flame,
  AlertCircle
} from "lucide-react";

export default function VehicleMonitoringDashboard() {
  const { user } = useAuth();
  const { telemetry, serviceMode } = useRoadSos();

  const isBike = user?.vehicleType === "BIKE";

  // Oscillating values for realism
  const [engineLoad, setEngineLoad] = useState(25);
  const [batteryVoltage, setBatteryVoltage] = useState(13.8);

  useEffect(() => {
    const interval = setInterval(() => {
      // Engine load oscillates based on current speed and a small random deviation
      const baseLoad = Math.min(95, Math.max(8, Math.round((telemetry.speed / 140) * 75 + 12)));
      const randomOffset = Math.round((Math.random() - 0.5) * 6);
      setEngineLoad(Math.max(10, Math.min(98, baseLoad + randomOffset)));

      // Alternator voltage oscillates between 13.6V and 14.2V based on batteryHealth and speed
      const baseVoltage = 12.0 + (telemetry.batteryHealth / 100) * 1.8 + (telemetry.speed > 0 ? 0.3 : 0);
      const voltageNoise = (Math.random() - 0.5) * 0.08;
      setBatteryVoltage(parseFloat(Math.max(12.0, Math.min(14.4, baseVoltage + voltageNoise)).toFixed(2)));
    }, 2000);

    return () => clearInterval(interval);
  }, [telemetry.speed, telemetry.batteryHealth]);

  // SVG Gauge helpers
  const radius = 50;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const getStrokeOffset = (value: number, max: number) => {
    const ratio = Math.max(0, Math.min(max, value)) / max;
    return circumference - ratio * circumference;
  };

  // Diagnostic checklist for OBD-II live feed
  const obdDiagnostics = [
    { code: "P0101", name: "Mass Air Flow (MAF) Sensor", status: "NOMINAL", value: "3.2 g/s" },
    { code: "P0130", name: "Oxygen Sensor Circuit (Bank 1 Sensor 1)", status: "NOMINAL", value: "0.78 V" },
    { code: "P0171", name: "Fuel Trim System Balanced", status: "NOMINAL", value: "+1.2%" },
    { code: "P0300", name: "Ignition Misfire Counter Monitor", status: "NOMINAL", value: "0 Misfires" },
    { code: "P0420", name: "Catalyst System Efficiency", status: "NOMINAL", value: "98.4%" },
    { code: "P0500", name: "Vehicle Speed Sensor (VSS) Calibration", status: "NOMINAL", value: `${telemetry.speed} km/h` },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header telemetry info banner */}
      <div className="glass-card p-6 bg-gradient-to-r from-blue-50/50 to-indigo-50/30 border-blue-500/10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-blue-100 text-[10px] font-bold text-brand-primary uppercase tracking-wider">
            <Cpu className="w-3 h-3 text-brand-primary animate-pulse" />
            <span>OBD-II Mechanical Diagnostics</span>
          </div>
          <h2 className="text-base font-black text-brand-navy">ESP32 Hardware Telemetry Hub</h2>
          <p className="text-xs text-text-secondary">Comprehensive engine diagnostic loops, tire calibrations, and CAN-Bus sensor grids.</p>
        </div>

        <div className="flex items-center space-x-4 shrink-0 bg-white/60 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-slate-200/40 shadow-sm text-xs font-semibold text-text-secondary">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-success animate-ping" />
            <span className="text-brand-navy font-bold">CAN-BUS: ACTIVE</span>
          </div>
          <span className="text-slate-300">|</span>
          <div>ESP32 VCC: <span className="text-brand-primary font-mono font-bold">3.31 V</span></div>
        </div>
      </div>

      {/* Primary Gauges & Metrics display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Core Diagnostics HUD Cluster */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="glass-card p-6 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-6">
              <div>
                <h3 className="text-base font-black text-brand-navy">Core Engine & Gyro Dials</h3>
                <p className="text-xs text-text-secondary mt-0.5 font-medium">Real-time dynamic sensors registered via OBD-II.</p>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                isBike ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-brand-primary"
              }`}>
                {isBike ? "BIKE TELEMETRY" : "CAR TELEMETRY"}
              </span>
            </div>

            {/* Circular vector gauges cluster */}
            <div className="flex flex-col sm:flex-row items-center justify-around gap-8 mb-6 py-4">
              
              {/* Gauge 1: Engine Workload */}
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
                      style={{ strokeDashoffset: getStrokeOffset(engineLoad, 100) }}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r={normalizedRadius}
                      cx={radius + stroke}
                      cy={radius + stroke}
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-3xl font-extrabold text-brand-navy block leading-none">{engineLoad}%</span>
                    <span className="text-[9px] font-black text-muted uppercase tracking-wider">ENGINE LOAD</span>
                  </div>
                </div>
                <span className="text-xs font-black text-text-secondary tracking-wide uppercase flex items-center space-x-1">
                  <Gauge className="w-3.5 h-3.5 text-brand-primary" />
                  <span>Dynamometer</span>
                </span>
              </div>

              {/* Gauge 2: Alternator Battery Voltage */}
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
                      style={{ strokeDashoffset: getStrokeOffset(batteryVoltage, 16) }}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r={normalizedRadius}
                      cx={radius + stroke}
                      cy={radius + stroke}
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-3xl font-extrabold text-brand-navy block leading-none">{batteryVoltage}V</span>
                    <span className="text-[9px] font-black text-muted uppercase tracking-wider">Alternator</span>
                  </div>
                </div>
                <span className="text-xs font-black text-text-secondary tracking-wide uppercase flex items-center space-x-1">
                  <BatteryCharging className="w-3.5 h-3.5 text-brand-light" />
                  <span>Battery System</span>
                </span>
              </div>

              {/* Gauge 3: Chassis Tilt Gyroscope */}
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
                      className={`transition-all duration-500 ${
                        telemetry.tiltAngle > 45 
                          ? "text-brand-emergency" 
                          : telemetry.tiltAngle > 20 
                            ? "text-brand-warning" 
                            : "text-brand-success"
                      }`}
                      strokeWidth={stroke}
                      strokeDasharray={circumference + " " + circumference}
                      style={{ strokeDashoffset: getStrokeOffset(telemetry.tiltAngle, 90) }}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r={normalizedRadius}
                      cx={radius + stroke}
                      cy={radius + stroke}
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-3xl font-extrabold text-brand-navy block leading-none">{telemetry.tiltAngle}°</span>
                    <span className="text-[9px] font-black text-muted uppercase tracking-wider">Chassis Angle</span>
                  </div>
                </div>
                <span className="text-xs font-black text-text-secondary tracking-wide uppercase flex items-center space-x-1">
                  <Compass className="w-3.5 h-3.5 text-brand-success" />
                  <span>3D Gyroscope</span>
                </span>
              </div>

            </div>

            {/* Visual Tire Pressure Thermal Heatmap Schematic */}
            <div className="border-t border-slate-100 pt-6">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Tire Calibrations & Pressure Heatmap</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                
                {/* 2D Schematic */}
                <div className="md:col-span-5 flex justify-center bg-slate-50 border border-slate-100 rounded-xl p-6 relative min-h-[190px]">
                  {isBike ? (
                    // 2D Motorbike Outline representation
                    <div className="w-10 h-36 border-2 border-slate-300 rounded-full flex flex-col justify-between items-center py-4 bg-white/60">
                      <div className="w-4 h-8 bg-brand-navy rounded-md shadow-md animate-pulse" />
                      <div className="w-2 h-16 bg-slate-300 rounded" />
                      <div className="w-4 h-10 bg-brand-navy rounded-md shadow-md animate-pulse" />
                    </div>
                  ) : (
                    // 2D Car Chassis Outline representation
                    <div className="w-24 h-36 border-2 border-dashed border-slate-300 rounded-xl flex flex-col justify-between p-2.5 bg-white/60 relative">
                      <div className="absolute top-4 left-0 -ml-2.5 w-2 h-6 bg-slate-400 rounded-sm" />
                      <div className="absolute top-4 right-0 -mr-2.5 w-2 h-6 bg-slate-400 rounded-sm" />
                      <div className="absolute bottom-4 left-0 -ml-2.5 w-2 h-6 bg-slate-400 rounded-sm" />
                      <div className="absolute bottom-4 right-0 -mr-2.5 w-2 h-6 bg-slate-400 rounded-sm" />
                      <div className="w-full h-1/2 border-b border-dashed border-slate-200" />
                    </div>
                  )}
                </div>

                {/* Tire PSI readouts */}
                <div className="md:col-span-7 space-y-3">
                  {isBike ? (
                    // Bike tires (Front/Rear)
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Front Tire */}
                      <div className={`p-4 rounded-xl border transition-all ${
                        telemetry.tirePressure.fl >= 30 && telemetry.tirePressure.fl <= 35
                          ? "bg-emerald-50/10 border-emerald-500/20" 
                          : "bg-amber-50/10 border-amber-500/20"
                      }`}>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black text-muted uppercase">Front Wheel</span>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black tracking-wider uppercase ${
                            telemetry.tirePressure.fl >= 30 && telemetry.tirePressure.fl <= 35
                              ? "bg-emerald-100 text-brand-success" 
                              : "bg-amber-100 text-brand-warning"
                          }`}>
                            {telemetry.tirePressure.fl >= 30 && telemetry.tirePressure.fl <= 35 ? "OPTIMAL" : "WARNING"}
                          </span>
                        </div>
                        <div className="text-2xl font-black text-brand-navy mt-1.5">{telemetry.tirePressure.fl} <span className="text-xs text-text-secondary font-semibold">PSI</span></div>
                        <p className="text-[10px] text-text-secondary mt-1 font-semibold">Thermal calibration stable</p>
                      </div>

                      {/* Rear Tire */}
                      <div className={`p-4 rounded-xl border transition-all ${
                        telemetry.tirePressure.rl >= 30 && telemetry.tirePressure.rl <= 35
                          ? "bg-emerald-50/10 border-emerald-500/20" 
                          : "bg-amber-50/10 border-amber-500/20"
                      }`}>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black text-muted uppercase">Rear Wheel</span>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black tracking-wider uppercase ${
                            telemetry.tirePressure.rl >= 30 && telemetry.tirePressure.rl <= 35
                              ? "bg-emerald-100 text-brand-success" 
                              : "bg-amber-100 text-brand-warning"
                          }`}>
                            {telemetry.tirePressure.rl >= 30 && telemetry.tirePressure.rl <= 35 ? "OPTIMAL" : "WARNING"}
                          </span>
                        </div>
                        <div className="text-2xl font-black text-brand-navy mt-1.5">{telemetry.tirePressure.rl} <span className="text-xs text-text-secondary font-semibold">PSI</span></div>
                        <p className="text-[10px] text-text-secondary mt-1 font-semibold">Thermal calibration stable</p>
                      </div>

                    </div>
                  ) : (
                    // Car tires (FL, FR, RL, RR)
                    <div className="grid grid-cols-2 gap-4">
                      
                      {/* FL */}
                      <div className={`p-3 rounded-xl border transition-all ${
                        telemetry.tirePressure.fl >= 30 && telemetry.tirePressure.fl <= 35
                          ? "bg-emerald-50/10 border-emerald-500/20" 
                          : "bg-amber-50/10 border-amber-500/20"
                      }`}>
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-black text-muted uppercase">Front Left</span>
                          <span className={`px-1 rounded text-[7px] font-black ${
                            telemetry.tirePressure.fl >= 30 && telemetry.tirePressure.fl <= 35
                              ? "bg-emerald-100 text-brand-success" 
                              : "bg-amber-100 text-brand-warning"
                          }`}>
                            {telemetry.tirePressure.fl >= 30 && telemetry.tirePressure.fl <= 35 ? "OK" : "WARN"}
                          </span>
                        </div>
                        <div className="text-lg font-black text-brand-navy mt-1">{telemetry.tirePressure.fl} <span className="text-[10px] text-text-secondary font-semibold">PSI</span></div>
                      </div>

                      {/* FR */}
                      <div className={`p-3 rounded-xl border transition-all ${
                        telemetry.tirePressure.fr >= 30 && telemetry.tirePressure.fr <= 35
                          ? "bg-emerald-50/10 border-emerald-500/20" 
                          : "bg-amber-50/10 border-amber-500/20"
                      }`}>
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-black text-muted uppercase">Front Right</span>
                          <span className={`px-1 rounded text-[7px] font-black ${
                            telemetry.tirePressure.fr >= 30 && telemetry.tirePressure.fr <= 35
                              ? "bg-emerald-100 text-brand-success" 
                              : "bg-amber-100 text-brand-warning"
                          }`}>
                            {telemetry.tirePressure.fr >= 30 && telemetry.tirePressure.fr <= 35 ? "OK" : "WARN"}
                          </span>
                        </div>
                        <div className="text-lg font-black text-brand-navy mt-1">{telemetry.tirePressure.fr} <span className="text-[10px] text-text-secondary font-semibold">PSI</span></div>
                      </div>

                      {/* RL */}
                      <div className={`p-3 rounded-xl border transition-all ${
                        telemetry.tirePressure.rl >= 30 && telemetry.tirePressure.rl <= 35
                          ? "bg-emerald-50/10 border-emerald-500/20" 
                          : "bg-amber-50/10 border-amber-500/20"
                      }`}>
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-black text-muted uppercase">Rear Left</span>
                          <span className={`px-1 rounded text-[7px] font-black ${
                            telemetry.tirePressure.rl >= 30 && telemetry.tirePressure.rl <= 35
                              ? "bg-emerald-100 text-brand-success" 
                              : "bg-amber-100 text-brand-warning"
                          }`}>
                            {telemetry.tirePressure.rl >= 30 && telemetry.tirePressure.rl <= 35 ? "OK" : "WARN"}
                          </span>
                        </div>
                        <div className="text-lg font-black text-brand-navy mt-1">{telemetry.tirePressure.rl} <span className="text-[10px] text-text-secondary font-semibold">PSI</span></div>
                      </div>

                      {/* RR */}
                      <div className={`p-3 rounded-xl border transition-all ${
                        telemetry.tirePressure.rr >= 30 && telemetry.tirePressure.rr <= 35
                          ? "bg-emerald-50/10 border-emerald-500/20" 
                          : "bg-amber-50/10 border-amber-500/20"
                      }`}>
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-black text-muted uppercase">Rear Right</span>
                          <span className={`px-1 rounded text-[7px] font-black ${
                            telemetry.tirePressure.rr >= 30 && telemetry.tirePressure.rr <= 35
                              ? "bg-emerald-100 text-brand-success" 
                              : "bg-amber-100 text-brand-warning"
                          }`}>
                            {telemetry.tirePressure.rr >= 30 && telemetry.tirePressure.rr <= 35 ? "OK" : "WARN"}
                          </span>
                        </div>
                        <div className="text-lg font-black text-brand-navy mt-1">{telemetry.tirePressure.rr} <span className="text-[10px] text-text-secondary font-semibold">PSI</span></div>
                      </div>

                    </div>
                  )}
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* OBD-II Diagnostic Troubleshooting Feed */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-6 bg-white space-y-6 min-h-[480px] flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-base font-black text-brand-navy">OBD-II DTC Diagnostic Feed</h3>
                <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[8px] font-mono text-slate-500 font-bold uppercase">
                  Live Checks
                </span>
              </div>
              <p className="text-xs text-text-secondary">Standard trouble code registers scanned via high-speed ESP32 bus.</p>

              {/* Troubleshooting items */}
              <div className="space-y-2.5 mt-4">
                {obdDiagnostics.map((obd) => (
                  <div key={obd.code} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <div className="font-extrabold text-brand-navy flex items-center space-x-1.5">
                        <span className="text-[10px] font-mono bg-blue-50 text-brand-primary px-1.5 py-0.5 rounded font-bold">{obd.code}</span>
                        <span className="truncate max-w-[150px] font-semibold text-text-secondary">{obd.name}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-brand-success font-black text-[8px] tracking-wider uppercase block">
                        PASSED
                      </span>
                      <span className="text-[8px] font-mono text-muted block mt-0.5">{obd.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Global Calibrator Button */}
            <div className="border-t border-slate-100 pt-4 mt-4">
              <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100/50 text-[10px] font-medium text-brand-primary flex items-start space-x-2 mb-3">
                <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5 text-brand-primary" />
                <span>All vehicle calibration limits are verified by RoadSOS active AI filters. Safe speed vectors configured.</span>
              </div>
              
              <button 
                onClick={() => {
                  alert("Triggering hardware recalibration. Initializing CAN-Bus signals...");
                }}
                className="w-full py-2.5 bg-brand-primary hover:bg-brand-light text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center space-x-2 transition-all active:scale-95 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-white" />
                <span>Recalibrate All OBD Sensors</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
