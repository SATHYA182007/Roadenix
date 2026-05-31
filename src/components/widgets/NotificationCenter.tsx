"use client";

import React, { useState } from "react";
import { useRoadSos, NotificationItem } from "@/context/RoadSosContext";
import { 
  Bell, 
  Trash2, 
  CheckCheck, 
  ShieldAlert, 
  Truck, 
  Radio, 
  User, 
  MapPin, 
  CheckCircle,
  X,
  Layers,
  Heart
} from "lucide-react";

interface NotificationCenterProps {
  onClose?: () => void;
}

export default function NotificationCenter({ onClose }: NotificationCenterProps) {
  const { 
    notifications, 
    clearNotifications, 
    markNotificationsAsRead 
  } = useRoadSos();

  const [activeFilter, setActiveFilter] = useState<"All" | NotificationItem["category"]>("All");

  const filteredNotifications = notifications.filter(notif => {
    if (activeFilter === "All") return true;
    return notif.category === activeFilter;
  });

  const getCategoryStyles = (category: NotificationItem["category"]) => {
    switch (category) {
      case "Emergency":
        return {
          bg: "bg-red-50/50 hover:bg-red-50 border-red-100",
          text: "text-brand-emergency",
          dot: "bg-red-500 animate-ping",
          icon: <ShieldAlert className="w-3.5 h-3.5 text-brand-emergency" />
        };
      case "Dispatch":
        return {
          bg: "bg-indigo-50/50 hover:bg-indigo-50 border-indigo-100",
          text: "text-indigo-650",
          dot: "bg-indigo-500",
          icon: <Truck className="w-3.5 h-3.5 text-indigo-650" />
        };
      case "Responder":
        return {
          bg: "bg-amber-50/50 hover:bg-amber-50 border-amber-100",
          text: "text-amber-600",
          dot: "bg-amber-500 animate-pulse",
          icon: <Radio className="w-3.5 h-3.5 text-amber-600" />
        };
      case "Incident":
        return {
          bg: "bg-emerald-50/50 hover:bg-emerald-50 border-emerald-100",
          text: "text-brand-success",
          dot: "bg-emerald-500",
          icon: <CheckCircle className="w-3.5 h-3.5 text-brand-success" />
        };
      case "Profile":
        return {
          bg: "bg-slate-50/50 hover:bg-slate-55 border-slate-200",
          text: "text-slate-650",
          dot: "bg-slate-500",
          icon: <User className="w-3.5 h-3.5 text-slate-650" />
        };
      case "GPS":
        return {
          bg: "bg-blue-50/50 hover:bg-blue-50 border-blue-100",
          text: "text-brand-primary",
          dot: "bg-blue-500",
          icon: <MapPin className="w-3.5 h-3.5 text-brand-primary animate-pulse" />
        };
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="w-full max-w-sm glass-card bg-white border border-slate-200/60 p-4 space-y-4 shadow-2xl relative font-sans">
      
      {/* Header controls row */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2 shrink-0">
          <div className="relative">
            <Bell className="w-4.5 h-4.5 text-brand-navy shrink-0" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-brand-emergency animate-ping" />
            )}
          </div>
          <span className="font-extrabold text-xs text-brand-navy uppercase tracking-wider">Live System Logs Drawer</span>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-red-50 border border-red-100 text-[8px] font-black text-brand-emergency">
              {unreadCount} NEW
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={markNotificationsAsRead}
            disabled={unreadCount === 0}
            className="p-1 rounded bg-slate-50 hover:bg-slate-100 border border-slate-150 text-slate-600 disabled:opacity-40 transition-colors cursor-pointer"
            title="Mark all as read"
          >
            <CheckCheck className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={clearNotifications}
            disabled={notifications.length === 0}
            className="p-1 rounded bg-slate-50 hover:bg-slate-100 border border-slate-150 text-slate-600 disabled:opacity-40 transition-colors cursor-pointer"
            title="Clear all system logs"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded bg-slate-50 hover:bg-slate-100 border border-slate-150 text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Categories filters menu pill bar */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1.5 shrink-0 custom-scrollbar scrollbar-thin">
        {(["All", "Emergency", "Dispatch", "Responder", "Incident", "Profile", "GPS"] as const).map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer shrink-0 border ${
              activeFilter === filter
                ? "bg-brand-navy border-brand-navy text-white shadow-sm"
                : "bg-slate-50 border-slate-200 text-text-secondary hover:bg-slate-100"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Notifications Registry List */}
      <div className="space-y-2 max-h-72 overflow-y-auto pr-1 select-none custom-scrollbar">
        {filteredNotifications.length === 0 ? (
          <div className="py-8 text-center text-xs font-semibold text-slate-400 italic">
            Telemetry logs clean. Drawer standby.
          </div>
        ) : (
          filteredNotifications.map(notif => {
            const styles = getCategoryStyles(notif.category);
            
            return (
              <div 
                key={notif.id} 
                className={`p-2.5 rounded-xl border text-[11px] font-semibold text-text-secondary leading-normal relative transition-all ${styles.bg} ${!notif.read ? "border-brand-primary" : "border-slate-200"}`}
              >
                {/* Visual side marker dot */}
                {!notif.read && (
                  <span className={`absolute top-3.5 left-2 w-1.5 h-1.5 rounded-full ${styles.dot}`} />
                )}

                <div className="pl-2 space-y-1">
                  <div className="flex items-center justify-between border-b border-slate-200/40 pb-1 mb-1 gap-1">
                    <span className="flex items-center space-x-1 uppercase text-[8px] font-black tracking-wider text-slate-500">
                      {styles.icon}
                      <span className={styles.text}>{notif.category}</span>
                    </span>
                    <span className="text-[8px] font-bold text-slate-400 font-mono">{notif.timestamp}</span>
                  </div>

                  <div className="font-extrabold text-brand-navy text-xs">{notif.title}</div>
                  <div className="text-[10px] text-text-secondary whitespace-pre-wrap">{notif.message}</div>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
