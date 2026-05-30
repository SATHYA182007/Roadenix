"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, Sparkles, User, Cpu } from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "USER" | "AI";
  text: string;
  timestamp: string;
}

export default function AiAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Initial greeting
    setMessages([
      {
        id: "m1",
        sender: "AI",
        text: "Hello. I am the RoadSOS AI Safety Assistant. I monitor vehicle telemetry loops and ESP32 nodes. How can I help you optimize driver safety today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, []);

  useEffect(() => {
    // Keep chat container scrolled to bottom internally without scrolling browser window
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Math.random().toString(36).substr(2, 9)}`,
      sender: "USER",
      text: inputVal,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setIsTyping(true);

    // Simulate AI response based on keywords
    setTimeout(() => {
      const lower = userMsg.text.toLowerCase();
      let aiText = "I processed your request, but safety registers report nominal values. Ask me about crash safety protocols or ESP32 diagnostic limits.";

      if (lower.includes("crash") || lower.includes("accident") || lower.includes("rollover")) {
        aiText = "CRITICAL PROTOCOL: In a severe crash (G-Force > 4G or Tilt > 45°), RoadSOS launches a 10s countdown. If no feedback is logged, we dispatch ambulance corridors immediately. Turn off ignition to prevent fuel fire risks.";
      } else if (lower.includes("service") || lower.includes("diagnostic") || lower.includes("esp32")) {
        aiText = "SERVICE MODE PROTOCOL: Activating Service Mode bypasses MQTT G-Force thresholds, preventing false rescue triggers during repairs. Sensor health diagnostic runs continuously.";
      } else if (lower.includes("fatigue") || lower.includes("drowsy") || lower.includes("sleep")) {
        aiText = "FATIGUE ALERT: Drowsiness indices scan blink-rate limits. If blinks drop below 5/min, visual alerts trigger. I recommend routing to the nearest highway rest station.";
      } else if (lower.includes("hello") || lower.includes("hi") || lower.includes("help")) {
        aiText = "I am ready to assist. You can ask: 'What happens during a rollover?', 'Explain ESP32 calibrations', or 'How does fatigue detection work?'";
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Math.random().toString(36).substr(2, 9)}`,
        sender: "AI",
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const presetQuestions = [
    "What happens in a rollover?",
    "Explain ESP32 parameters",
    "Rest stops near me"
  ];

  const askPreset = (q: string) => {
    setInputVal(q);
  };

  return (
    <div className="glass-card p-6 bg-white flex flex-col justify-between h-[360px] border-slate-200/60 relative overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-5 h-5 text-brand-primary" />
          <div>
            <h3 className="text-sm font-black text-brand-navy leading-none">AI Safety Assistant</h3>
            <span className="text-[9px] text-muted font-bold tracking-widest uppercase mt-0.5 block">Co-Pilot Safety Loop</span>
          </div>
        </div>
        <Sparkles className="w-4 h-4 text-brand-primary animate-pulse" />
      </div>

      {/* Messages scrolling area */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto pr-1 my-3 space-y-3.5 custom-scrollbar text-xs">
        {messages.map((m) => {
          const isAi = m.sender === "AI";
          return (
            <div 
              key={m.id} 
              className={`flex items-start space-x-2.5 max-w-[85%] ${isAi ? "mr-auto" : "ml-auto flex-row-reverse space-x-reverse"}`}
            >
              <div className={`w-6.5 h-6.5 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${
                isAi ? "bg-blue-100 text-brand-primary" : "bg-slate-200 text-text-secondary"
              }`}>
                {isAi ? <Cpu className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
              </div>
              <div className={`p-3 rounded-2xl ${
                isAi 
                  ? "bg-slate-50 border border-slate-100 text-brand-navy" 
                  : "bg-brand-primary text-white"
              }`}>
                <p className="leading-relaxed font-medium">{m.text}</p>
                <span className={`text-[8px] font-bold block mt-1 text-right ${isAi ? "text-muted" : "text-white/60"}`}>
                  {m.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center space-x-2 mr-auto max-w-[80%]">
            <div className="w-6.5 h-6.5 rounded-lg bg-blue-50 text-brand-primary flex items-center justify-center shrink-0">
              <Cpu className="w-3.5 h-3.5 animate-spin" />
            </div>
            <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-2xl text-slate-400 font-bold italic animate-pulse">
              AI Copilot is thinking...
            </div>
          </div>
        )}
      </div>

      {/* Quick suggest tags & input Form */}
      <div className="shrink-0 space-y-3">
        <div className="flex flex-wrap gap-1.5 pt-2">
          {presetQuestions.map((q) => (
            <button
              key={q}
              onClick={() => askPreset(q)}
              className="px-2.5 py-1 rounded bg-slate-50 border border-slate-100 hover:bg-slate-100 text-[9px] font-extrabold text-brand-navy transition-all active:scale-95"
            >
              {q}
            </button>
          ))}
        </div>

        <form onSubmit={handleSend} className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Ask safety co-pilot..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-primary text-xs bg-slate-50/50 font-medium"
          />
          <button
            type="submit"
            className="p-2.5 rounded-xl bg-brand-primary hover:bg-brand-light text-white shadow-sm transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
}
