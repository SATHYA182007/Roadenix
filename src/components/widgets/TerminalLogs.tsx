"use client";

import React, { useEffect, useRef } from "react";
import { useRoadSos } from "@/context/RoadSosContext";
import { Terminal, Trash2, ShieldAlert } from "lucide-react";

export default function TerminalLogs() {
  const { terminalLogs, clearTerminalLogs, simulateCrash } = useRoadSos();
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Keep console container scrolled to bottom on new updates internally without scrolling browser window
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [terminalLogs]);

  return (
    <div className="glass-card bg-slate-900 border-slate-800 p-5 font-mono text-xs text-slate-300 shadow-2xl relative overflow-hidden flex flex-col justify-between h-[320px]">
      
      {/* Grid Pattern overlay for high-tech look */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" 
           style={{
             backgroundImage: 'linear-gradient(#38bdf8 1px, transparent 1px), linear-gradient(90deg, #38bdf8 1px, transparent 1px)',
             backgroundSize: '15px 15px'
           }} 
      />

      {/* Header logs console */}
      <div className="z-10 flex items-center justify-between border-b border-slate-800 pb-3 mb-3 shrink-0">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4.5 h-4.5 text-brand-primary animate-pulse" />
          <span className="font-extrabold text-[10px] uppercase text-slate-400 tracking-wider">Live System Terminal Logs</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={simulateCrash}
            className="px-2.5 py-1 rounded bg-red-950/60 border border-red-900 text-brand-emergency text-[9px] font-bold hover:bg-red-900/40 transition-colors flex items-center space-x-1"
          >
            <ShieldAlert className="w-3 h-3 text-brand-emergency" />
            <span>Spike Gs</span>
          </button>
          <button
            onClick={clearTerminalLogs}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Clear Logs Console"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Logs feed scrolling */}
      <div ref={scrollContainerRef} className="z-10 flex-1 overflow-y-auto space-y-1.5 pr-2 mb-2 custom-scrollbar">
        {terminalLogs.length === 0 ? (
          <p className="text-slate-500 italic text-[11px] py-4 text-center">Terminal cleared. Telemetry feed idle...</p>
        ) : (
          [...terminalLogs].reverse().map((log) => {
            const colors = {
              info: "text-slate-300",
              system: "text-brand-light font-bold",
              warn: "text-brand-warning font-bold",
              error: "text-brand-emergency font-extrabold animate-pulse",
              success: "text-brand-success font-semibold",
            };

            return (
              <div key={log.id} className={`flex items-start gap-2.5 leading-relaxed text-[11px] ${colors[log.type]}`}>
                <span className="text-slate-500 font-bold tracking-tight shrink-0">[{log.timestamp}]</span>
                <span className="font-mono break-all">{log.message}</span>
              </div>
            );
          })
        )}
      </div>

      {/* Terminal static cursor footer */}
      <div className="z-10 border-t border-slate-800 pt-2 shrink-0 flex items-center justify-between text-[9px] font-mono text-slate-500">
        <span>Channel: /dev/mqtt/roadsos_core</span>
        <span className="terminal-cursor">Listening</span>
      </div>

    </div>
  );
}
