"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRoadSos } from "@/context/RoadSosContext";
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  Cpu, 
  User, 
  MessageSquare, 
  Radio, 
  ShieldAlert, 
  MapPin, 
  Activity 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatMessage {
  id: string;
  sender: "USER" | "AI";
  text: string;
  timestamp: string;
}

export default function GlobalAiAssistant() {
  const { user } = useAuth();
  const { telemetry, incidents } = useRoadSos();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Dynamic initialization of chat based on role
  useEffect(() => {
    let greeting = "";
    if (user?.role === "SUPER_ADMIN") {
      greeting = "Greetings, Administrator. I am the RoadSOS Global Intelligence Core. I monitor global incident clusters, MQTT gateway streams, and dispatch telemetry. How may I help you analyze our response vectors today?";
    } else if (user?.role === "DRIVER") {
      greeting = "Hello! I am your RoadSOS In-Vehicle Co-Pilot. I monitor physical shock sensors, rollover tilt levels, and fatigue scans. Ask me how to calibrate your safety scores, configure crisis contacts, or toggle Service Mode.";
    } else if (user?.role === "EMERGENCY_TEAM") {
      greeting = "Operations Center AI Online. Paramedic & rescue dispatch coordinator reporting. Ready to calculate routing pathways and share victim vitals. What active incident do you need to optimize?";
    } else {
      greeting = "Welcome to RoadSOS. I am the virtual safety operator. I can explain our automated G-force crash sensors, emergency networks, and Apple-grade story workflows. Ask me how it works!";
    }

    setMessages([
      {
        id: "greet-1",
        sender: "AI",
        text: greeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [user?.role]);

  // Handle scrolling of messages
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping, isOpen]);

  // Suggested Prompts based on active role
  const getSuggestedPrompts = () => {
    if (user?.role === "SUPER_ADMIN") {
      return [
        "Show global statistics",
        "Ecosystem system health",
        "Explain emergency workflow",
        "Query accident analytics"
      ];
    } else if (user?.role === "DRIVER") {
      return [
        "Check my safety score",
        "How do G-sensors work?",
        "Explain service mode",
        "Manage crisis contacts"
      ];
    } else if (user?.role === "EMERGENCY_TEAM") {
      return [
        "Traced routing vectors",
        "Vitals telemetry scan",
        "Responder ETA lookup",
        "Active incident summaries"
      ];
    } else {
      return [
        "How does RoadSOS work?",
        "What happens in a crash?",
        "Explain AI G-force triggers",
        "How does GPS tracking work?"
      ];
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    sendMessage(inputVal);
  };

  const sendMessage = (text: string) => {
    const userMsg: ChatMessage = {
      id: `u-${Math.random().toString(36).substr(2, 9)}`,
      sender: "USER",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setIsTyping(true);

    // Dynamic responses based on role and keywords
    setTimeout(() => {
      const lower = text.toLowerCase();
      let aiText = "";

      // Role specific answers
      if (user?.role === "SUPER_ADMIN") {
        if (lower.includes("stat") || lower.includes("global") || lower.includes("registered")) {
          aiText = `SYSTEM REPORT: Currently tracking ${incidents.length} monitored incidents. AI G-Force Classification Accuracy is at 99.85%. All satellite GPS clusters reporting optimal status.`;
        } else if (lower.includes("health") || lower.includes("mqtt") || lower.includes("esp32")) {
          aiText = "SYSTEM CALIBRATION: MQTT brokers online at mqtt.roadsos.org:1883. ESP32 microcontroller logs running nominal (14% CPU load, VCC 3.31V). Firestore indices 100% synchronized.";
        } else if (lower.includes("workflow") || lower.includes("cad") || lower.includes("corridor")) {
          aiText = "CAD DISPATCH ROUTING: Intelligent lightweight light control override triggers are armed. Upon impact confirmation, optimal routing corridors are locked for EMT vehicles.";
        } else {
          aiText = "Global Commander, safety logs are normal. Ask me about MQTT stream performance, user account logs, or active dispatch queues.";
        }
      } else if (user?.role === "DRIVER") {
        if (lower.includes("score") || lower.includes("fatigue") || lower.includes("safety")) {
          aiText = `DRIVER INTELLIGENCE: Driver Safety Score is ${100 - telemetry.driverFatigueScore}/100. AI Risk Level: LOW. Fatigue eyelid blinks: ${telemetry.blinkRate} blinks/min (NOMINAL index).`;
        } else if (lower.includes("contact") || lower.includes("crisis") || lower.includes("family")) {
          aiText = "EMERGENCY CONTACTS: Persisted in secure Firestore profile database. In case of safety override failures (impact > 4.5G), custom SMS grids automatically dispatch coordinates to David Jenkins.";
        } else if (lower.includes("service") || lower.includes("diagnose") || lower.includes("maintenance")) {
          aiText = "MAINTENANCE BYPASS: Activating Service Mode stops automatic G-Force shock transmission to paramedic networks during repairs. Engine diagnostics report 100% calibrated.";
        } else if (lower.includes("g-sensor") || lower.includes("crash") || lower.includes("shock")) {
          aiText = "CRASH TRIGGER: ESP32 high-freq accelerometers detect peak impact Gs. A 10-second warning countdown sounds on your dashboard before CAD routing activates.";
        } else {
          aiText = "Co-pilot is checking. Your speed, engine heat, and tire PSI are nominal. Ask me about crash safety protocols, crisis contacts, or diagnostics.";
        }
      } else if (user?.role === "EMERGENCY_TEAM") {
        if (lower.includes("routing") || lower.includes("vector") || lower.includes("map")) {
          aiText = "EMS NAVIGATION: Dynamic GIS coordinate tracking overlays optimal light-traffic sectors. Coordinates locked at 37.7749°, -122.4194° with ±1.2m GPS precision.";
        } else if (lower.includes("vitals") || lower.includes("telemetry") || lower.includes("smoke")) {
          aiText = `INCIDENT LOGS: Victim vehicle stats showing Speed: ${telemetry.speed}km/h | Peak G-Force: ${telemetry.shockG}G. Fire cell: ${telemetry.fireSensor ? "ACTIVE" : "INACTIVE"} | Smoke Sensor: ${telemetry.smokeSensor ? "CRITICAL" : "NORMAL"}.`;
        } else if (lower.includes("eta") || lower.includes("responder") || lower.includes("ambulance")) {
          aiText = "RESCUE DISPATCH: Paramedic standbys are active. Status update triggers auto-recalculates ambulance ETAs based on traffic light override coordinates.";
        } else {
          aiText = "EMT Operator, dispatch networks are online. Ask me about active incident telemetry, dynamic ambulance routing vectors, or light controls.";
        }
      } else {
        // Guest / General safety info
        if (lower.includes("accident") || lower.includes("how") || lower.includes("work")) {
          aiText = "RoadSOS integrates custom ESP32 IoT hardware with real-time Edge AI. If a severe impact is scanned (>4.5G), the driver is checked via a 10s voice interface; if unresponsive, immediate paramedic routing triggers.";
        } else if (lower.includes("gps") || lower.includes("satellite")) {
          aiText = "RoadSOS tracks vehicles with high-resolution GPS modules (precision ±1.2 meters), delivering active accident coordinates directly to EMS teams.";
        } else {
          aiText = "Welcome to RoadSOS. I am your Virtual Operator. Try asking: 'How does accident detection work?' or 'What happens in a crash?'";
        }
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Math.random().toString(36).substr(2, 9)}`,
        sender: "AI",
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <>
      {/* 🤖 FLOATING CIRCULAR TOGGLE BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-white/90 border border-slate-200/60 shadow-[0_0_20px_rgba(59,130,246,0.35)] flex items-center justify-center text-brand-primary hover:text-brand-light transition-all hover:scale-105 active:scale-95 duration-300 group cursor-pointer"
        aria-label="RoadSOS AI Assistant"
      >
        <span className="absolute inset-0 rounded-full border border-blue-400/20 animate-ping opacity-75 pointer-events-none" />
        
        {isOpen ? (
          <X className="w-6 h-6 transition-transform group-hover:rotate-90 duration-300" />
        ) : (
          <Bot className="w-6.5 h-6.5 text-brand-primary group-hover:animate-bounce" />
        )}
      </button>

      {/* 💬 COMPACT CHATBOX WINDOW */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-6 z-50 w-[400px] h-[520px] glass-card p-0 bg-white shadow-2xl flex flex-col justify-between overflow-hidden border border-slate-200/80 font-sans"
          >
            {/* Header: Jarvis style */}
            <div className="p-4 bg-brand-navy border-b border-slate-800 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-blue-400 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-black tracking-tight flex items-center space-x-1.5">
                    <span>RoadSOS AI Assistant</span>
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  </h3>
                  <div className="flex items-center space-x-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest leading-none">Online</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Area scrolling */}
            <div 
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 text-xs custom-scrollbar bg-slate-50/20"
            >
              {messages.map((m) => {
                const isAi = m.sender === "AI";
                return (
                  <div 
                    key={m.id} 
                    className={`flex items-start space-x-2.5 max-w-[85%] ${
                      isAi ? "mr-auto" : "ml-auto flex-row-reverse space-x-reverse"
                    }`}
                  >
                    <div className={`w-7.5 h-7.5 rounded-lg flex items-center justify-center shrink-0 shadow-sm border ${
                      isAi 
                        ? "bg-blue-50 border-blue-100 text-brand-primary" 
                        : "bg-slate-200 border-slate-300 text-text-secondary"
                    }`}>
                      {isAi ? <Cpu className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>
                    
                    <div className={`p-3.5 rounded-2xl leading-relaxed shadow-sm border ${
                      isAi 
                        ? "bg-white border-slate-100 text-brand-navy" 
                        : "bg-brand-primary border-blue-600 text-white"
                    }`}>
                      <p className="font-medium whitespace-pre-line">{m.text}</p>
                      <span className={`text-[8px] font-bold block mt-1 text-right ${
                        isAi ? "text-muted" : "text-white/60"
                      }`}>
                        {m.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex items-center space-x-2 mr-auto max-w-[80%]">
                  <div className="w-7.5 h-7.5 rounded-lg bg-blue-50 border border-blue-100 text-brand-primary flex items-center justify-center shrink-0">
                    <Cpu className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="bg-white border border-slate-100 p-3 rounded-2xl text-slate-400 font-bold italic animate-pulse">
                    Jarvis operator is typing...
                  </div>
                </div>
              )}
            </div>

            {/* Suggested prompts list */}
            <div className="p-3 bg-slate-50/50 border-t border-slate-100/60 shrink-0 space-y-3">
              <div className="flex flex-wrap gap-1.5">
                {getSuggestedPrompts().map((p) => (
                  <button
                    key={p}
                    onClick={() => sendMessage(p)}
                    className="px-2.5 py-1 rounded bg-white hover:bg-blue-50/50 border border-slate-200/60 hover:border-blue-200 text-[9px] font-extrabold text-brand-navy transition-all active:scale-95 shadow-sm text-left leading-normal cursor-pointer"
                  >
                    {p}
                  </button>
                ))}
              </div>

              {/* Form Input */}
              <form onSubmit={handleSend} className="flex items-center space-x-2 pt-1 border-t border-slate-100">
                <input
                  type="text"
                  placeholder={
                    user?.role === "SUPER_ADMIN" 
                      ? "Query global dashboard..." 
                      : user?.role === "DRIVER" 
                        ? "Ask safety co-pilot..." 
                        : user?.role === "EMERGENCY_TEAM" 
                          ? "Query responder center..." 
                          : "Ask safety chatbot..."
                  }
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/80 focus:outline-none focus:border-brand-primary text-xs bg-white font-medium"
                />
                <button
                  type="submit"
                  className="p-2.5 rounded-xl bg-brand-primary hover:bg-brand-light text-white shadow-md shadow-blue-500/10 transition-all active:scale-95 cursor-pointer shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
