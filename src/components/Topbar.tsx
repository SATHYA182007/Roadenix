"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRoadSos } from "@/context/RoadSosContext";
import NotificationCenter from "@/components/widgets/NotificationCenter";
import { 
  Bell, 
  Globe, 
  Volume2, 
  VolumeX, 
  AlertTriangle, 
  Radio, 
  Send,
  ShieldCheck,
  Megaphone
} from "lucide-react";

interface TopbarProps {
  activeTab: string;
}

export default function Topbar({ activeTab }: TopbarProps) {
  const { user } = useAuth();
  const { 
    telemetry, 
    activeLanguage, 
    setLanguage, 
    triggerGlobalBroadcast,
    incidents,
    notifications
  } = useRoadSos();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [broadcastMsg, setBroadcastMsg] = useState("");
  const [showBroadcastInput, setShowBroadcastInput] = useState(false);

  const activeAlerts = incidents.filter(i => i.status !== "RESOLVED");

  const pageTitles: Record<string, string> = {
    dashboard: "Ecosystem Command Dashboard",
    vehicle: "IoT Vehicle Telemetry Center",
    alerts: "Rescue Operations Dispatcher",
    gps: "GIS Real-time Asset Tracking Map",
    analytics: "AI Predictive Analytics Dashboard",
    iot: "MQTT Telemetry Broker Feed",
    service: "Vehicle Diagnosis & Service Mode",
    history: "Historical Incident Records",
    settings: "Ecosystem Configuration Console",
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMsg.trim()) return;
    triggerGlobalBroadcast(broadcastMsg);
    setBroadcastMsg("");
    setShowBroadcastInput(false);
  };

  return (
    <header className="glass-card mb-6 border-slate-200/50 p-4 flex flex-col md:flex-row items-center justify-between gap-4 relative">
      {/* Page Title & Status */}
      <div className="flex items-center space-x-3 shrink-0">
        <div>
          <h1 className="text-lg font-black text-brand-navy tracking-tight capitalize">
            {pageTitles[activeTab] || "Ecosystem Hub"}
          </h1>
          <div className="flex items-center space-x-2 mt-0.5 text-[10px] font-bold text-muted uppercase">
            <span className="flex items-center space-x-1">
              <span className={`w-2 h-2 rounded-full ${telemetry.mqttStatus === "CONNECTED" ? "bg-emerald-500" : "bg-red-500 animate-ping"}`} />
              <span>MQTT: {telemetry.mqttStatus}</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <span className={`w-2 h-2 rounded-full ${telemetry.esp32Status === "ONLINE" ? "bg-emerald-500" : "bg-red-500 animate-ping"}`} />
              <span>ESP32: {telemetry.esp32Status}</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1 text-brand-success">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>AI LOOP: OK</span>
            </span>
          </div>
        </div>
      </div>

      {/* Role Selector Toolbar & Interactive Controls */}
      <div className="flex flex-wrap items-center justify-end gap-3 w-full md:w-auto">


        {/* Global System Broadcaster (Admin Only) */}
        {user?.role === "SUPER_ADMIN" && (
          <div className="relative">
            <button
              onClick={() => setShowBroadcastInput(!showBroadcastInput)}
              className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-text-secondary hover:text-brand-emergency shadow-sm transition-colors flex items-center space-x-1.5 text-xs font-bold"
              title="Global Emergency Broadcast"
            >
              <Megaphone className="w-4 h-4 text-brand-emergency animate-bounce" />
              <span className="hidden xl:inline">Broadcast</span>
            </button>
            {showBroadcastInput && (
              <form 
                onSubmit={handleBroadcast}
                className="absolute right-0 top-12 bg-white border border-slate-200 shadow-xl rounded-xl p-3 z-50 flex items-center space-x-2 w-72"
              >
                <input
                  type="text"
                  placeholder="Broadcast emergency audio alert..."
                  value={broadcastMsg}
                  onChange={(e) => setBroadcastMsg(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs w-full focus:outline-none focus:border-brand-primary"
                />
                <button
                  type="submit"
                  className="bg-brand-primary hover:bg-brand-light text-white p-2 rounded-lg"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        )}

        {/* Language Switcher */}
        <div className="flex items-center space-x-1 border-r border-slate-200 pr-2">
          <Globe className="w-4 h-4 text-text-secondary" />
          <select
            value={activeLanguage}
            onChange={(e) => setLanguage(e.target.value as "EN" | "ES" | "FR")}
            className="text-xs font-bold text-text-secondary bg-transparent focus:outline-none cursor-pointer"
          >
            <option value="EN">EN</option>
            <option value="ES">ES</option>
            <option value="FR">FR</option>
          </select>
        </div>

        {/* Notifications Bell */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-text-secondary hover:text-brand-navy shadow-sm transition-all active:scale-95"
          >
            <Bell className="w-4 h-4" />
            {((notifications && notifications.filter(n => !n.read).length > 0) || activeAlerts.length > 0) && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-brand-emergency animate-ping" />
            )}
          </button>

          {/* Floating Unified Notification Center */}
          {showNotifications && (
            <div className="absolute right-0 top-12 z-50">
              <NotificationCenter onClose={() => setShowNotifications(false)} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
