"use client";

import React, { useState } from "react";
import { useRoadSos } from "@/context/RoadSosContext";
import { 
  Users, 
  Car, 
  ShieldCheck, 
  Activity, 
  FileSpreadsheet, 
  UserPlus, 
  Search,
  Database,
  Trash2,
  Lock,
  Unlock,
  CheckCircle,
  FileText
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function AdminDashboard() {
  const { incidents } = useRoadSos();
  const [activeSubTab, setActiveSubTab] = useState<"users" | "authorities" | "teams" | "vehicles">("users");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form states for Create User
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState("USER");

  // Mock Registries data
  const [users, setUsers] = useState([
    { id: "usr-456", name: "Sarah Jenkins", email: "driver@roadsos.com", role: "USER", status: "ACTIVE", date: "2026-05-30" },
    { id: "usr-101", name: "Robert Miller", email: "robert@gmail.com", role: "USER", status: "ACTIVE", date: "2026-05-28" },
    { id: "usr-102", name: "Diana Ross", email: "diana@gmail.com", role: "USER", status: "SUSPENDED", date: "2026-05-27" },
    { id: "usr-103", name: "Jack Mercer", email: "jack@gmail.com", role: "USER", status: "ACTIVE", date: "2026-05-25" },
  ]);

  const [authorities, setAuthorities] = useState([
    { id: "auth-123", name: "EOC Emergency Controller Director", email: "authority@roadsos.com", status: "APPROVED" },
    { id: "auth-456", name: "Paramedics Division 4B", email: "dispatcher4b@roadsos.com", status: "APPROVED" },
    { id: "auth-789", name: "City Safety Dispatch Support", email: "citysos@roadsos.com", status: "PENDING_APPROVAL" },
  ]);

  const [teams, setTeams] = useState([
    { id: "team-alpha", name: "Rescue Helper Team Alpha (Medic-14)", type: "AMBULANCE", status: "STANDBY" },
    { id: "team-beta", name: "Rescue Helper Team Beta (Medic-09)", type: "AMBULANCE", status: "ACTIVE_MISSION" },
    { id: "team-patrol", name: "Police Patrol Squad Alpha", type: "PATROL", status: "STANDBY" },
    { id: "team-engine", name: "Fire Engine Rescue Charlie", type: "ENGINE", status: "STANDBY" },
  ]);

  const [vehicles, setVehicles] = useState([
    { id: "veh-101", brand: "Toyota", model: "Supra", type: "CAR", plate: "DRV-101", owner: "Sarah Jenkins" },
    { id: "veh-102", brand: "Tesla", model: "Model S", type: "CAR", plate: "ADM-911", owner: "Platform Admin" },
    { id: "veh-103", brand: "Ford", model: "F-350 Ambulance", type: "CAR", plate: "MED-014", owner: "Rescue Alpha" },
    { id: "veh-104", brand: "Yamaha", model: "R15", type: "BIKE", plate: "MOCK-123", owner: "Jack Mercer" },
  ]);

  const [auditLogs, setAuditLogs] = useState([
    { id: "log-1", time: "13:12:04", action: "Admin approved dispatcher citysos@roadsos.com credentials", category: "AUTHORITY" },
    { id: "log-2", time: "13:08:52", action: "Driver settings update synchronized: david@jenkins relationship Spouse", category: "USER" },
    { id: "log-3", time: "12:54:12", action: "System health check initiated: MQTT Broker channels nominal", category: "SYSTEM" },
    { id: "log-4", time: "12:15:00", action: "Audit logs backup exported to CSV spreadsheet format", category: "REPORTS" },
  ]);

  const chartsData = [
    { name: "Mon", registrations: 4 },
    { name: "Tue", registrations: 8 },
    { name: "Wed", registrations: 12 },
    { name: "Thu", registrations: 6 },
    { name: "Fri", registrations: 15 },
    { name: "Sat", registrations: 2 },
    { name: "Sun", registrations: 5 },
  ];

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;

    const newUser = {
      id: `usr-${Math.floor(100 + Math.random() * 900)}`,
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      status: "ACTIVE",
      date: new Date().toISOString().split("T")[0],
    };

    setUsers([newUser, ...users]);
    setAuditLogs([
      { id: `log-${Date.now()}`, time: new Date().toLocaleTimeString(), action: `Admin created new ${newUserRole} account: ${newUserEmail}`, category: "USER" },
      ...auditLogs
    ]);

    setNewUserName("");
    setNewUserEmail("");
    setShowCreateModal(false);
  };

  const handleToggleSuspend = (id: string) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        const nextStatus = u.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
        setAuditLogs([
          { id: `log-${Date.now()}`, time: new Date().toLocaleTimeString(), action: `Admin toggled ${u.email} status to ${nextStatus}`, category: "USER" },
          ...auditLogs
        ]);
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const handleDeleteUser = (id: string) => {
    const u = users.find(x => x.id === id);
    if (!u) return;
    setUsers(users.filter(x => x.id !== id));
    setAuditLogs([
      { id: `log-${Date.now()}`, time: new Date().toLocaleTimeString(), action: `Admin deleted user account: ${u.email}`, category: "USER" },
      ...auditLogs
    ]);
  };

  const handleApproveAuthority = (id: string) => {
    setAuthorities(authorities.map(a => {
      if (a.id === id) {
        setAuditLogs([
          { id: `log-${Date.now()}`, time: new Date().toLocaleTimeString(), action: `Admin approved authority account: ${a.email}`, category: "AUTHORITY" },
          ...auditLogs
        ]);
        return { ...a, status: "APPROVED" };
      }
      return a;
    }));
  };

  return (
    <div className="space-y-6 font-sans relative">
      
      {/* ➕ CREATE USER MODAL SCREEN */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-lg flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-card bg-slate-900 border-slate-800 p-6 shadow-2xl relative space-y-5 text-left text-slate-300">
            <div>
              <h3 className="text-sm font-black text-white tracking-tight uppercase">Platform Account Creation</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Initialize new vehicle safety node credentials.</p>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400">Full Name</label>
                <input
                  type="text"
                  placeholder="Diana Prince"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 focus:outline-none focus:border-brand-primary text-xs font-semibold text-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400">Email Address</label>
                <input
                  type="email"
                  placeholder="diana@roadsos.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 focus:outline-none focus:border-brand-primary text-xs font-semibold text-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400 block">Security Role</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 focus:outline-none focus:border-brand-primary text-xs font-bold text-white bg-slate-900 cursor-pointer h-[36px]"
                >
                  <option value="USER">User / Vehicle Owner</option>
                  <option value="AUTHORITY">Authority EOC Dispatcher</option>
                  <option value="EMERGENCY_TEAM">Field Helper Squad</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2 rounded-xl text-xs font-bold border border-slate-700 text-slate-400 hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl text-xs font-extrabold bg-brand-primary hover:bg-brand-light text-white shadow-md transition-colors cursor-pointer"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🚀 EXECUTIVE KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* KPI 1: Active Users */}
        <div className="glass-card p-5 border-blue-500/5 flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-sans">Ecosystem Users</span>
            <div className="text-2xl font-black text-brand-navy leading-none">{users.length + authorities.length} Registered</div>
            <span className="text-[9px] font-bold text-brand-success block uppercase tracking-wider font-mono">+4 Added this week</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-primary flex items-center justify-center shrink-0 shadow-inner">
            <Users className="w-5.5 h-5.5 animate-pulse" />
          </div>
        </div>

        {/* KPI 2: Total Vehicles */}
        <div className="glass-card p-5 border-blue-500/5 flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Registered Fleet</span>
            <div className="text-2xl font-black text-brand-navy leading-none">{vehicles.length} Monitored</div>
            <span className="text-[9px] font-bold text-brand-success block uppercase tracking-wider">Tire calibrations Active</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-50 text-brand-navy flex items-center justify-center shrink-0 shadow-inner">
            <Car className="w-5.5 h-5.5" />
          </div>
        </div>

        {/* KPI 3: System Health */}
        <div className="glass-card p-5 border-blue-500/5 flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-sans">Platform Health</span>
            <div className="text-2xl font-black text-brand-success leading-none">99.98%</div>
            <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider font-mono">Esp32 core: online</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-brand-success flex items-center justify-center shrink-0 shadow-inner">
            <ShieldCheck className="w-5.5 h-5.5 animate-bounce" />
          </div>
        </div>

        {/* KPI 4: Global Incidents */}
        <div className="glass-card p-5 border-blue-500/5 flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Accidents Resolved</span>
            <div className="text-2xl font-black text-brand-navy leading-none">
              {incidents.filter(i => i.status === "RESOLVED").length} Incidents
            </div>
            <span className="text-[9px] font-bold text-brand-emergency block uppercase tracking-wider animate-pulse">EOC active pipeline</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-50 text-brand-emergency flex items-center justify-center shrink-0 shadow-inner">
            <Activity className="w-5.5 h-5.5" />
          </div>
        </div>

      </div>

      {/* 📍 REGISTRIES DIRECTORY MODULE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Directories Card */}
        <div className="lg:col-span-8 glass-card p-5 bg-white space-y-4">
          
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3 gap-3">
            <div>
              <h3 className="text-sm font-black text-brand-navy uppercase tracking-wider">ROADENIX ADMIN CONTROL CENTER</h3>
              <p className="text-[11px] text-text-secondary">Ecosystem registries directories and platforms permissions controller.</p>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-brand-navy hover:bg-slate-800 text-white font-extrabold text-[10px] uppercase tracking-wider flex items-center space-x-1.5 shadow-md active:scale-95 transition-all cursor-pointer self-start sm:self-auto"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Node</span>
            </button>
          </div>

          {/* Subtab menu switches */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-100 select-none custom-scrollbar shrink-0">
            {(["users", "authorities", "teams", "vehicles"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => {
                  setActiveSubTab(tab);
                  setSearchQuery("");
                }}
                className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all border ${
                  activeSubTab === tab
                    ? "bg-blue-50 border-brand-primary text-brand-primary"
                    : "bg-slate-50 border-slate-200 text-text-secondary hover:bg-slate-100"
                }`}
              >
                {tab === "users" && "User Owners"}
                {tab === "authorities" && "EOC Authorities"}
                {tab === "teams" && "Helper Crews"}
                {tab === "vehicles" && "Fleet Registry"}
              </button>
            ))}
          </div>

          {/* Search filter input */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder={`Filter registries directories by name or ID...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-brand-primary text-xs bg-slate-50/50 font-semibold text-brand-navy"
            />
          </div>

          {/* List display based on selected subtab */}
          <div className="space-y-2.5 overflow-y-auto max-h-[300px] pr-1">
            
            {/* Tab 1: User Owners */}
            {activeSubTab === "users" && (
              users
                .filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()))
                .map(u => (
                  <div key={u.id} className="p-3 bg-slate-50/70 border border-slate-100 rounded-xl flex items-center justify-between text-xs font-semibold text-brand-navy transition-all">
                    <div>
                      <div className="font-extrabold text-brand-navy flex items-center space-x-1.5">
                        <span>{u.name}</span>
                        <span className="text-[8px] font-mono font-bold bg-white border border-slate-200 px-1 rounded text-slate-400">{u.id}</span>
                      </div>
                      <div className="text-[10px] text-text-secondary mt-0.5">{u.email} • Joined {u.date}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                        u.status === "ACTIVE" ? "bg-emerald-100 text-brand-success" : "bg-amber-100 text-brand-warning"
                      }`}>
                        {u.status}
                      </span>
                      <button
                        onClick={() => handleToggleSuspend(u.id)}
                        className="p-1 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-550 transition-all cursor-pointer"
                        title={u.status === "ACTIVE" ? "Suspend Account" : "Approve Account"}
                      >
                        {u.status === "ACTIVE" ? <Lock className="w-3 h-3 text-brand-warning" /> : <Unlock className="w-3 h-3 text-brand-success" />}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="p-1 rounded bg-white hover:bg-red-50 border border-slate-200 hover:border-red-200 text-slate-550 hover:text-brand-emergency transition-all cursor-pointer"
                        title="Delete User"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
            )}

            {/* Tab 2: EOC Authorities */}
            {activeSubTab === "authorities" && (
              authorities
                .filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.email.toLowerCase().includes(searchQuery.toLowerCase()))
                .map(a => (
                  <div key={a.id} className="p-3 bg-slate-50/70 border border-slate-100 rounded-xl flex items-center justify-between text-xs font-semibold text-brand-navy">
                    <div>
                      <div className="font-extrabold text-brand-navy flex items-center space-x-1.5">
                        <span>{a.name}</span>
                        <span className="text-[8px] font-mono font-bold bg-white border border-slate-200 px-1 rounded text-slate-400">{a.id}</span>
                      </div>
                      <div className="text-[10px] text-text-secondary mt-0.5">{a.email}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                        a.status === "APPROVED" ? "bg-emerald-100 text-brand-success" : "bg-amber-100 text-brand-warning animate-pulse"
                      }`}>
                        {a.status.replace("_", " ")}
                      </span>
                      {a.status === "PENDING_APPROVAL" && (
                        <button
                          onClick={() => handleApproveAuthority(a.id)}
                          className="px-2 py-1 rounded bg-brand-primary hover:bg-brand-light text-white text-[9px] font-extrabold uppercase transition-all flex items-center space-x-1 cursor-pointer"
                        >
                          <CheckCircle className="w-3 h-3 text-white" />
                          <span>Approve</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))
            )}

            {/* Tab 3: Helper Crews */}
            {activeSubTab === "teams" && (
              teams
                .filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map(t => (
                  <div key={t.id} className="p-3 bg-slate-50/70 border border-slate-100 rounded-xl flex items-center justify-between text-xs font-semibold text-brand-navy">
                    <div>
                      <div className="font-extrabold text-brand-navy flex items-center space-x-1.5">
                        <span>{t.name}</span>
                        <span className="text-[8px] font-mono font-bold bg-white border border-slate-200 px-1 rounded text-slate-400">{t.id}</span>
                      </div>
                      <div className="text-[9px] font-mono text-slate-400 mt-0.5 tracking-wider uppercase">{t.type}</div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                      t.status === "STANDBY" ? "bg-emerald-100 text-brand-success" : "bg-amber-100 text-brand-warning"
                    }`}>
                      {t.status.replace("_", " ")}
                    </span>
                  </div>
                ))
            )}

            {/* Tab 4: Fleet Registry */}
            {activeSubTab === "vehicles" && (
              vehicles
                .filter(v => v.plate.toLowerCase().includes(searchQuery.toLowerCase()) || v.brand.toLowerCase().includes(searchQuery.toLowerCase()))
                .map(v => (
                  <div key={v.id} className="p-3 bg-slate-50/70 border border-slate-100 rounded-xl flex items-center justify-between text-xs font-semibold text-brand-navy">
                    <div>
                      <div className="font-extrabold text-brand-navy flex items-center space-x-1.5">
                        <span>{v.brand} {v.model}</span>
                        <span className="text-[8px] font-mono font-bold bg-white border border-slate-200 px-1 rounded text-slate-400">{v.plate}</span>
                      </div>
                      <div className="text-[10px] text-text-secondary mt-0.5">Owner Node: {v.owner}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-brand-primary text-[8px] font-black uppercase tracking-wider">
                      {v.type} SPEC
                    </span>
                  </div>
                ))
            )}

          </div>

        </div>

        {/* 📊 PLATFORM AUDIT LOGS & WEEKLY ANALYSIS */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Weekly Growth Chart */}
          <div className="glass-card p-5 bg-white space-y-3">
            <div>
              <h3 className="text-xs font-black text-brand-navy uppercase tracking-wider">Ecosystem Registrations</h3>
              <p className="text-[10px] text-text-secondary font-semibold">Weekly nodes enrollment stats.</p>
            </div>
            
            <div className="h-32 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartsData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={9} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="registrations" fill="#2563EB" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* System Audit logs */}
          <div className="glass-card p-5 bg-white flex flex-col justify-between h-[230px]">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                <span className="text-[10px] font-black text-brand-navy uppercase tracking-wider flex items-center space-x-1">
                  <Database className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                  <span>Platform Audit Logs</span>
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              </div>

              <div className="space-y-2 overflow-y-auto max-h-[140px] pr-1 font-mono text-[9px] text-slate-500 leading-relaxed custom-scrollbar">
                {auditLogs.map(log => (
                  <div key={log.id} className="border-b border-slate-50 pb-1.5 last:border-b-0 flex items-start gap-2">
                    <span className="text-slate-400 font-bold shrink-0">[{log.time}]</span>
                    <span className="break-all">{log.action}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-2 text-[9px] font-mono text-slate-400 flex items-center space-x-1">
              <FileSpreadsheet className="w-3.5 h-3.5 text-brand-primary animate-pulse" />
              <span>Audit registry logging automatically published to /var/log/roadsos/audit.</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
