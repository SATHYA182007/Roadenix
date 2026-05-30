"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRoadSos } from "@/context/RoadSosContext";
import { 
  Activity, 
  ChevronLeft, 
  ChevronRight, 
  LayoutDashboard, 
  Cpu, 
  ShieldAlert, 
  Map, 
  LineChart, 
  Radio, 
  Wrench, 
  History, 
  Settings, 
  LogOut 
} from "lucide-react";
import { motion } from "framer-motion";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { logout, user } = useAuth();
  const { serviceMode } = useRoadSos();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "vehicle", label: "Vehicle Monitoring", icon: Cpu },
    { id: "alerts", label: "Emergency Alerts", icon: ShieldAlert, badge: true },
    { id: "gps", label: "GPS Tracking", icon: Map },
    { id: "analytics", label: "AI Analytics", icon: LineChart },
    { id: "iot", label: "IoT Sensors", icon: Radio },
    { id: "service", label: "Service Mode", icon: Wrench, warnBadge: true },
    { id: "history", label: "Accident History", icon: History },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const { incidents } = useRoadSos();
  const activeAlertsCount = incidents.filter(i => i.status !== "RESOLVED").length;

  return (
    <motion.aside
      animate={{ width: collapsed ? "80px" : "280px" }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="h-[calc(100vh-2rem)] fixed left-4 top-4 z-40 bg-white/80 backdrop-blur-md border border-slate-200/60 shadow-lg rounded-2xl flex flex-col justify-between overflow-hidden"
    >
      {/* Sidebar Header */}
      <div>
        <div className={`p-6 flex items-center justify-between border-b border-slate-100 ${collapsed ? "justify-center" : ""}`}>
          {!collapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Activity className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight text-brand-navy">Road<span className="text-brand-primary">SOS</span></span>
                <div className="text-[8px] text-muted font-bold tracking-widest uppercase">AI Core v3.4</div>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
          )}

          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="w-6 h-6 rounded-full bg-slate-50 border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-text-secondary transition-colors"
          >
            {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Menu Navigation */}
        <nav className="p-3 space-y-1.5 mt-4">
          {menuItems.map((item) => {
            const IconComp = item.icon;
            const isActive = activeTab === item.id;
            const hasAlertBadge = item.badge && activeAlertsCount > 0;
            const hasWarnBadge = item.warnBadge && serviceMode;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center rounded-xl p-3 text-sm font-semibold transition-all group relative ${
                  isActive 
                    ? "bg-blue-50/70 text-brand-primary border-l-2 border-brand-primary shadow-sm" 
                    : "text-text-secondary hover:bg-slate-50 hover:text-brand-navy"
                } ${collapsed ? "justify-center" : "space-x-3.5"}`}
              >
                <IconComp className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
                  isActive ? "text-brand-primary" : "text-text-secondary group-hover:text-brand-navy"
                }`} />

                {!collapsed && (
                  <span className="truncate flex-1 text-left">{item.label}</span>
                )}

                {/* Badges */}
                {hasAlertBadge && (
                  <span className={`w-5 h-5 rounded-full bg-brand-emergency text-[10px] font-bold text-white flex items-center justify-center animate-pulse ${
                    collapsed ? "absolute top-1.5 right-1.5" : ""
                  }`}>
                    {activeAlertsCount}
                  </span>
                )}
                {hasWarnBadge && (
                  <span className={`w-2.5 h-2.5 rounded-full bg-brand-warning ${
                    collapsed ? "absolute top-1.5 right-1.5" : ""
                  }`} />
                )}

                {/* Collapsed Tooltip */}
                {collapsed && (
                  <div className="absolute left-20 bg-brand-navy text-white text-xs px-2.5 py-1.5 rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md z-50">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Info / Logout */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
        {!collapsed && user && (
          <div className="p-3 rounded-xl bg-white border border-slate-100 flex items-center justify-between mb-2 shadow-sm">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-xs font-bold text-brand-primary shrink-0">
                {user.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-brand-navy truncate">{user.name}</div>
                <div className="text-[9px] text-muted font-semibold truncate capitalize">{user.role.replace("_", " ")}</div>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={logout}
          className={`w-full flex items-center rounded-xl p-3 text-sm font-semibold text-text-secondary hover:bg-red-50 hover:text-brand-emergency transition-all group ${
            collapsed ? "justify-center" : "space-x-3.5"
          }`}
        >
          <LogOut className="w-5 h-5 group-hover:text-brand-emergency" />
          {!collapsed && <span className="truncate">Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
}
