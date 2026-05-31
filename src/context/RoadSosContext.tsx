"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useAuth, VehicleType } from "./AuthContext";

export interface Telemetry {
  speed: number;
  shockG: number;
  engineTemp: number;
  fuelLevel: number;
  tirePressure: { fl: number; fr: number; rl: number; rr: number };
  fireSensor: boolean;
  smokeSensor: boolean;
  helmetDetected: boolean;
  tiltAngle: number;
  batteryHealth: number;
  connectivity: "EXCELLENT" | "WEAK" | "DISCONNECTED";
  gpsSignal: "STRONG" | "WEAK" | "LOST";
  sensorHealth: "HEALTHY" | "DEGRADED" | "CRITICAL";
  mqttStatus: "CONNECTED" | "DISCONNECTED" | "RECONNECTING";
  esp32Status: "ONLINE" | "OFFLINE";
  driverFatigueScore: number; // 0 to 100
  blinkRate: number; // blinks/min
  yawnCount: number;
}

export interface EmergencyIncident {
  id: string;
  driverName: string;
  driverPhone: string;
  vehicleType: "CAR" | "BIKE";
  timestamp: string;
  latitude: number;
  longitude: number;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "NEW" | "UNDER_REVIEW" | "ASSIGNED" | "IN_PROGRESS" | "NEEDS_SUPPORT" | "RESOLVED" | "ARCHIVED";
  servicesDispatched: { ambulance: boolean; police: boolean; fire: boolean };
  etaMinutes: number;
  routeProgress: number; // 0 to 100
  accidentConfidence: number; // %
  accidentReason: string;
  helperNotes?: string;
  helperPhotos?: string[];
  helperStatus?: "Assigned" | "Accepted" | "Travelling" | "Reached" | "Helping" | "Need Backup" | "Resolved" | "Cancelled";
  hospitalName?: string;
  assignedTeamId?: string;
  assignedTeamName?: string;
}

export interface TerminalLog {
  id: string;
  timestamp: string;
  message: string;
  type: "info" | "warn" | "error" | "success" | "system";
}

export interface NotificationItem {
  id: string;
  timestamp: string;
  category: "Emergency" | "Dispatch" | "Responder" | "Incident" | "Profile" | "GPS";
  title: string;
  message: string;
  read: boolean;
}

interface RoadSosContextType {
  telemetry: Telemetry;
  serviceMode: boolean;
  incidents: EmergencyIncident[];
  terminalLogs: TerminalLog[];
  notifications: NotificationItem[];
  showEmergencyModal: boolean;
  countdown: number;
  voiceActive: boolean;
  activeLanguage: "EN" | "ES" | "FR";
  fatigueAlert: boolean;
  simulateCrash: () => void;
  confirmSafety: (isSafe: boolean) => void;
  toggleServiceMode: () => void;
  dispatchService: (incidentId: string, service: "ambulance" | "police" | "fire") => void;
  updateIncidentStatus: (incidentId: string, status: EmergencyIncident["status"], extraFields?: Partial<EmergencyIncident>) => void;
  addTerminalLog: (message: string, type: TerminalLog["type"]) => void;
  clearTerminalLogs: () => void;
  addNotification: (category: NotificationItem["category"], title: string, message: string) => void;
  clearNotifications: () => void;
  markNotificationsAsRead: () => void;
  toggleVoiceAssistant: () => void;
  setLanguage: (lang: "EN" | "ES" | "FR") => void;
  simulateFatigue: () => void;
  triggerGlobalBroadcast: (message: string) => void;
}

const RoadSosContext = createContext<RoadSosContextType | undefined>(undefined);

// Initial telemetry state
const initialTelemetry = (vehicleType: VehicleType = "CAR"): Telemetry => ({
  speed: 64,
  shockG: 1.0,
  engineTemp: 88,
  fuelLevel: 78,
  tirePressure: { fl: 32, fr: 32, rl: 34, rr: 34 },
  fireSensor: false,
  smokeSensor: false,
  helmetDetected: true,
  tiltAngle: 2,
  batteryHealth: 94,
  connectivity: "EXCELLENT",
  gpsSignal: "STRONG",
  sensorHealth: "HEALTHY",
  mqttStatus: "CONNECTED",
  esp32Status: "ONLINE",
  driverFatigueScore: 12,
  blinkRate: 15,
  yawnCount: 0,
});

export function RoadSosProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [telemetry, setTelemetry] = useState<Telemetry>(initialTelemetry(user?.vehicleType || "CAR"));
  const [serviceMode, setServiceMode] = useState<boolean>(false);
  const [incidents, setIncidents] = useState<EmergencyIncident[]>([]);
  const [terminalLogs, setTerminalLogs] = useState<TerminalLog[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [voiceActive, setVoiceActive] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState<"EN" | "ES" | "FR">("EN");
  const [fatigueAlert, setFatigueAlert] = useState(false);

  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Helper to add notification log
  const addNotification = (
    category: NotificationItem["category"],
    title: string,
    message: string
  ) => {
    const newNotif: NotificationItem = {
      id: `notif-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      category,
      title,
      message,
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev].slice(0, 100));
  };

  const clearNotifications = () => setNotifications([]);
  
  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Helper to add terminal logs
  const addTerminalLog = (message: string, type: TerminalLog["type"] = "info") => {
    const newLog: TerminalLog = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      message,
      type,
    };
    setTerminalLogs((prev) => [newLog, ...prev].slice(0, 100)); // Cap logs at 100 items
  };

  const clearTerminalLogs = () => setTerminalLogs([]);

  // Initialize with some standard logs and dummy incident data
  useEffect(() => {
    addTerminalLog("RoadSOS IoT Smart Core initialized successfully.", "system");
    addTerminalLog("Establishing connection to MQTT Broker: mqtt.roadsos.org:1883...", "system");
    addTerminalLog("ESP32 IoT Module detected: Version 3.4.1 [MAC: 3F:4A:BC:12:88].", "info");
    addTerminalLog("MQTT Client: Connected to topic '/vehicle/telemetry/#'", "success");
    addTerminalLog("Sensor integrity scan: 100% functional. Driver safe.", "success");

    // Seed premium notifications
    addNotification("GPS", "GPS Lock Established", "Satellites locked: 11. Coordinates: 37.7749° N, -122.4194° W");
    addNotification("Profile", "Security Session Active", "Authorized as Marcus (Director Role)");
    addNotification("Dispatch", "EMS Core Standby", "Ambulance Sectors 4 & 5 reporting ready");
    addNotification("Incident", "History Logs Consolidated", "Merged prior resolved incident telemetry sets");

    // Add a couple of initial resolved incidents to build premium history dashboard
    setIncidents([
      {
        id: "inc-101",
        driverName: "Robert Miller",
        driverPhone: "+1 (555) 234-9081",
        vehicleType: "BIKE",
        timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
        latitude: 37.7749,
        longitude: -122.4194,
        severity: "HIGH",
        status: "RESOLVED",
        servicesDispatched: { ambulance: true, police: true, fire: false },
        etaMinutes: 0,
        routeProgress: 100,
        accidentConfidence: 94,
        accidentReason: "Rollover & High-Impact Tilt Angle",
      },
      {
        id: "inc-102",
        driverName: "Diana Ross",
        driverPhone: "+1 (555) 890-3412",
        vehicleType: "CAR",
        timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
        latitude: 37.7833,
        longitude: -122.4167,
        severity: "CRITICAL",
        status: "RESOLVED",
        servicesDispatched: { ambulance: true, police: true, fire: true },
        etaMinutes: 0,
        routeProgress: 100,
        accidentConfidence: 98,
        accidentReason: "Frontal Impact G-Force & Smoke Detected",
      },
      {
        id: "inc-103",
        driverName: "Diana Prince",
        driverPhone: "+1 (555) 304-9811",
        vehicleType: "CAR",
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        latitude: 37.7725,
        longitude: -122.4221,
        severity: "CRITICAL",
        status: "NEW",
        servicesDispatched: { ambulance: false, police: false, fire: false },
        etaMinutes: 10,
        routeProgress: 0,
        accidentConfidence: 97,
        accidentReason: "G-Spike (6.2G) & Airbag Deployment",
      },
      {
        id: "inc-104",
        driverName: "Jack Mercer",
        driverPhone: "+1 (555) 762-1088",
        vehicleType: "BIKE",
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        latitude: 37.7760,
        longitude: -122.4180,
        severity: "HIGH",
        status: "ASSIGNED",
        servicesDispatched: { ambulance: true, police: false, fire: false },
        etaMinutes: 8,
        routeProgress: 15,
        accidentConfidence: 92,
        accidentReason: "Extreme Tilt Angle (74°) & Velocity Drop",
      },
    ]);
  }, []);

  // Update telemetry when vehicleType changes
  useEffect(() => {
    setTelemetry(initialTelemetry(user?.vehicleType || "CAR"));
  }, [user?.vehicleType]);

  // Continuous background telemetry loop
  useEffect(() => {
    const interval = setInterval(() => {
      if (showEmergencyModal) return; // Freeze normal telemetry updates during crash countdown

      setTelemetry((prev) => {
        // Safe natural oscillations
        const speedDelta = (Math.random() - 0.5) * 4;
        const speed = Math.max(0, Math.min(140, Math.round(prev.speed + speedDelta)));

        const engineTempDelta = (Math.random() - 0.5) * 1.5;
        const engineTemp = Math.round(
          Math.max(75, Math.min(105, prev.engineTemp + (speed > 100 ? 0.5 : -0.2) + engineTempDelta))
        );

        // Slow fuel drainage
        const fuelLevel = Math.max(1, parseFloat((prev.fuelLevel - 0.005).toFixed(3)));

        // G force variations
        const shockG = parseFloat((1.0 + (Math.random() - 0.5) * 0.15).toFixed(2));

        // Tilt variations
        const tiltAngle = Math.max(0, Math.min(90, prev.tiltAngle + (Math.random() - 0.5) * 0.5));

        // Fatigue drift
        const driverFatigueScore = Math.max(5, Math.min(100, prev.driverFatigueScore + (Math.random() - 0.5) * 1));

        // Periodically log updates across GPS, AI, MQTT, Emergency, Service, and Vehicle events
        if (Math.random() > 0.6) {
          const logCategories = [
            // GPS Events
            {
              msg: `[GPS Event] Satellites locked: 11 | Coordinates: 37.7749° N, -122.4194° W | Accuracy: ±1.2 meters | Signal: EXCELLENT`,
              type: "success" as const
            },
            {
              msg: `[GPS Event] Active route navigation update: Recalculated path using real-time smart city road clearance data.`,
              type: "info" as const
            },
            // AI Events
            {
              msg: `[AI Event] Eyelid scanner checks blink rates: 14 blinks/min. Driver fatigue score: ${Math.round(driverFatigueScore)}% [NOMINAL]`,
              type: "info" as const
            },
            {
              msg: `[AI Event] Analyzing rollover tilt sensors. Current tilt angle: ${Math.round(tiltAngle)}°. Rollover probability: <0.01%`,
              type: "success" as const
            },
            {
              msg: `[AI Event] Peak impact acceleration scan: telemetry shock G-force at stable ${shockG}G.`,
              type: "success" as const
            },
            // MQTT Events
            {
              msg: `[MQTT Event] Payload published to topic /vehicle/telemetry/data: [JSON: 248 bytes] | Speed: ${speed}km/h | Gs: ${shockG}G | Temp: ${engineTemp}°C`,
              type: "info" as const
            },
            {
              msg: `[MQTT Event] Subscribed to topic /roadsos/dispatch/incident/+ [QoS 2] | Connection Status: stable`,
              type: "system" as const
            },
            // Emergency Events
            {
              msg: `[Emergency Event] CAD Dispatch corridors refreshed. Ambulance Sectors 4 & 5 reporting ready status.`,
              type: "success" as const
            },
            {
              msg: `[Emergency Event] Smart city traffic light override API validated. Pre-clearing routing pathways.`,
              type: "system" as const
            },
            // Service Events
            {
              msg: `[Service Event] ESP32 Microcontroller Diagnostics: CPU load 14% | Heap memory free: 184 KB | VCC: 3.31V`,
              type: "info" as const
            },
            {
              msg: `[Service Event] Hardware safety watchdogs active. Autonomous alert countdown trigger status: armed`,
              type: "success" as const
            },
            // Vehicle Events
            {
              msg: `[Vehicle Event] Engine oil pressure & coolant temp stabilized at ${engineTemp}°C. Fuel injector loop nominal.`,
              type: "info" as const
            },
            {
              msg: `[Vehicle Event] Tire pressure sensors reporting FL: ${prev.tirePressure.fl} | FR: ${prev.tirePressure.fr} | RL: ${prev.tirePressure.rl} | RR: ${prev.tirePressure.fr} PSI. Status: STABLE`,
              type: "success" as const
            }
          ];

          const selectedLog = logCategories[Math.floor(Math.random() * logCategories.length)];
          addTerminalLog(selectedLog.msg, selectedLog.type);
        }

        return {
          ...prev,
          speed,
          engineTemp,
          fuelLevel,
          shockG,
          tiltAngle: Math.round(tiltAngle),
          driverFatigueScore: Math.round(driverFatigueScore),
        };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [showEmergencyModal]);

  // Route updates loop for active emergency dispatch tracking
  useEffect(() => {
    const routeInterval = setInterval(() => {
      setIncidents((prev) =>
        prev.map((inc) => {
          if (inc.status === "ASSIGNED" || inc.status === "IN_PROGRESS" || inc.status === "NEEDS_SUPPORT") {
            const hasDispatched = Object.values(inc.servicesDispatched).some((x) => x);
            if (!hasDispatched) return inc; // Responders not selected yet

            if (inc.routeProgress < 100) {
              const nextProgress = Math.min(100, inc.routeProgress + 4);
              const etaMinutes = Math.max(0, Math.ceil((100 - nextProgress) / 10));
              const status = nextProgress === 100 ? "IN_PROGRESS" : inc.status;

              if (nextProgress % 20 === 0 || nextProgress === 100) {
                addTerminalLog(
                  `Dispatch [${inc.id}] Update: Route Progress: ${nextProgress}% | Status: ${status} | ETA: ${etaMinutes} mins`,
                  nextProgress === 100 ? "success" : "info"
                );
              }

              return {
                ...inc,
                routeProgress: nextProgress,
                etaMinutes,
                status,
              };
            }
          }
          return inc;
        })
      );
    }, 3000);

    return () => clearInterval(routeInterval);
  }, []);

  // Simulating countdown decrement when active
  useEffect(() => {
    if (showEmergencyModal) {
      countdownIntervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownIntervalRef.current!);
            setShowEmergencyModal(false);
            triggerAccidentDispatch();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [showEmergencyModal]);

  // Service Mode logic
  const toggleServiceMode = () => {
    setServiceMode((prev) => {
      const next = !prev;
      addTerminalLog(
        next ? "⚠️ SERVICE MODE ACTIVATED. AI Accident Detection & Autothrottle DISABLED." : "✅ SERVICE MODE DEACTIVATED. AI Accident Detection System is fully ACTIVE.",
        next ? "warn" : "success"
      );
      return next;
    });
  };

  // Simulate G-Force Spike / Shock Crash trigger
  const simulateCrash = () => {
    if (serviceMode) {
      addTerminalLog("Crash detected, but ignored because SERVICE MODE is ACTIVE.", "warn");
      return;
    }

    addTerminalLog("🚨 IoT SENSOR SPIKE! High impact shock sensor detected: 6.8G. Speed dropped: 95 ➔ 0 km/h.", "error");

    setTelemetry((prev) => ({
      ...prev,
      speed: 0,
      shockG: 6.8,
      tiltAngle: user?.vehicleType === "BIKE" ? 68 : 5,
      fireSensor: Math.random() > 0.5,
      smokeSensor: true,
      gpsSignal: "WEAK",
      connectivity: "WEAK",
    }));

    setCountdown(10);
    setShowEmergencyModal(true);

    // Speak alert
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        const text = "Warning. Accident detected. Emergency dispatch will trigger in 10 seconds. Are you safe?";
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = activeLanguage === "ES" ? "es-ES" : activeLanguage === "FR" ? "fr-FR" : "en-US";
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.error("SpeechSynthesis error", e);
      }
    }
  };

  // Driver responds to countdown
  const confirmSafety = (isSafe: boolean) => {
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    setShowEmergencyModal(false);

    if (isSafe) {
      addTerminalLog("Driver checked: 'I AM SAFE'. Emergency dispatcher aborted false alarm.", "success");
      // Reset telemetry
      setTelemetry((prev) => ({
        ...prev,
        shockG: 1.0,
        fireSensor: false,
        smokeSensor: false,
        gpsSignal: "STRONG",
        connectivity: "EXCELLENT",
        speed: 40,
      }));
    } else {
      addTerminalLog("🚨 Driver checked: 'I AM IN DANGER'. Triggering emergency rescue instantly!", "error");
      triggerAccidentDispatch();
    }
  };

  // Create an active emergency incident
  const triggerAccidentDispatch = () => {
    const isBike = user?.vehicleType === "BIKE";
    const driverName = user?.name || "Sarah Jenkins";
    const driverPhone = user?.phone || "+1 (555) 732-8924";
    const bloodGroup = user?.bloodGroup || "O+";
    const vehicleName = `${user?.vehicleBrand || "Toyota"} ${user?.vehicleModel || "Supra"} (${user?.vehicleNumber || "DRV-101"})`;
    const emergencyName = user?.emergencyContact?.name || "David Jenkins";
    const emergencyPhone = user?.emergencyContact?.phone || "+1 (555) 732-4412";
    
    const lat = parseFloat((37.7749 + (Math.random() - 0.5) * 0.02).toFixed(5));
    const lng = parseFloat((-122.4194 + (Math.random() - 0.5) * 0.02).toFixed(5));
    const incidentId = `inc-${Math.floor(100 + Math.random() * 900)}`;

    const newIncident: EmergencyIncident = {
      id: incidentId,
      driverName,
      driverPhone,
      vehicleType: isBike ? "BIKE" : "CAR",
      timestamp: new Date().toISOString(),
      latitude: lat,
      longitude: lng,
      severity: "CRITICAL",
      status: "NEW",
      servicesDispatched: { ambulance: false, police: false, fire: false },
      etaMinutes: 12,
      routeProgress: 0,
      accidentConfidence: 97,
      accidentReason: isBike ? "Helmet ejection & High impact G-Spike" : "G-Spike (6.8G) & Smoke density trigger",
    };

    setIncidents((prev) => [newIncident, ...prev]);

    // 1. GENERATE INCIDENT REPORT IN MONOSPACE TERMINAL
    addTerminalLog("==================================================", "error");
    addTerminalLog("🚨 ACCIDENT DETECTED", "error");
    addTerminalLog(`Vehicle Type: ${isBike ? "BIKE" : "CAR"} (${vehicleName})`, "warn");
    addTerminalLog(`Speed: 0 km/h (Impact deceleration event)`, "warn");
    addTerminalLog(`Impact Force: 6.8 G`, "error");
    addTerminalLog(`Driver: ${driverName}`, "info");
    addTerminalLog(`Blood Group: ${bloodGroup}`, "error");
    addTerminalLog(`GPS: ${lat}, ${lng}`, "success");
    addTerminalLog(`Status: Emergency Services Dispatched`, "success");
    addTerminalLog(`Additional Data: [ID: ${incidentId} | AI Confidence: 97% | Severity: CRITICAL | Nearest Hospital: SF General Emergency | Time: ${new Date().toLocaleTimeString()} | Date: ${new Date().toLocaleDateString()}]`, "info");
    addTerminalLog("==================================================", "error");

    // 2. SIMULATE WHATSAPP EMERGENCY AUTOMATIONS
    const mapLink = `https://maps.google.com/?q=${lat},${lng}`;
    
    // WA Message Template Formatter
    const makeWaMessage = (recipientName: string) => `🚨 ROADENIX EMERGENCY ALERT

Accident Detected

Driver:
${driverName}

Blood Group:
${bloodGroup}

Vehicle:
${isBike ? "BIKE" : "CAR"}

Speed:
0 km/h

Impact:
6.8 G

GPS:
${lat},
${lng}

Status:
Emergency Services Dispatched

Location:
${mapLink}`;

    // Log simulated dispatches
    addTerminalLog(`📲 [WhatsApp Simulator] Dispatching automated alert to Emergency Contact (${emergencyName} - ${emergencyPhone})...`, "system");
    addTerminalLog(`[WA Alert ➔ Contact]:\n${makeWaMessage(emergencyName)}`, "success");

    addTerminalLog(`📲 [WhatsApp Simulator] Dispatching automated alert to Admin Emergency Group...`, "system");
    addTerminalLog(`[WA Alert ➔ Admins]:\n${makeWaMessage("Admin Group")}`, "success");

    addTerminalLog(`📲 [WhatsApp Simulator] Dispatching automated alert to Responder Team...`, "system");
    addTerminalLog(`[WA Alert ➔ Responders]:\n${makeWaMessage("Responder Team")}`, "success");

    // 3. PUSH NOTIFICATION DRAWER ENTRIES
    addNotification("Emergency", "Crash Detected - 6.8G Spike", `Driver ${driverName} crashed. Gs: 6.8 | Blood: ${bloodGroup}`);
    addNotification("Incident", "Accident Report Generated", `Formulated incident telemetry package for ${incidentId}`);
    addNotification("GPS", "Emergency Vectors Locked", `Map pinpoint routing targeted to coordinates: ${lat}, ${lng}`);

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        const text = `SOS Alert. Accident confirmed. WhatsApp alerts simulated. Responders routing.`;
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
      } catch (e) {}
    }
  };

  // Dispatch Emergency squads
  const dispatchService = (incidentId: string, service: "ambulance" | "police" | "fire") => {
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === incidentId) {
          const nextServices = { ...inc.servicesDispatched, [service]: true };
          const status = (inc.status === "NEW" || inc.status === "UNDER_REVIEW") ? "ASSIGNED" : inc.status;

          addTerminalLog(`Dispatch Action: Allocated [${service.toUpperCase()}] squad to incident ${incidentId}.`, "success");
          addNotification("Dispatch", `${service.toUpperCase()} Assigned`, `Allocated crew to incident ${incidentId}. ETA adjusted.`);

          return {
            ...inc,
            servicesDispatched: nextServices,
            status,
            routeProgress: Math.max(inc.routeProgress, 5),
          };
        }
        return inc;
      })
    );
  };

  // Update status workflow
  const updateIncidentStatus = (incidentId: string, status: EmergencyIncident["status"], extraFields?: Partial<EmergencyIncident>) => {
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === incidentId) {
          const isResolved = status === "RESOLVED";
          addTerminalLog(
            `Incident [${incidentId}] workflow updated ➔ ${status.replace("_", " ")}`,
            isResolved ? "success" : "info"
          );

          addNotification(
            isResolved ? "Incident" : "Responder",
            `Incident Status: ${status}`,
            `Incident ${incidentId} updated to ${status.replace("_", " ")}`
          );

          if (isResolved) {
            // Restore safe driving state if the current user was the driver of this incident
            if (inc.driverName === user?.name) {
              setTelemetry((prevTel) => ({
                ...prevTel,
                shockG: 1.0,
                fireSensor: false,
                smokeSensor: false,
                gpsSignal: "STRONG",
                connectivity: "EXCELLENT",
                speed: 60,
              }));
            }
          }

          return {
            ...inc,
            status,
            etaMinutes: isResolved ? 0 : inc.etaMinutes,
            routeProgress: isResolved ? 100 : inc.routeProgress,
            ...extraFields,
          };
        }
        return inc;
      })
    );
  };

  // Voice assistant toggle
  const toggleVoiceAssistant = () => {
    setVoiceActive((prev) => {
      const next = !prev;
      addTerminalLog(
        next ? "🎙️ AI Voice Command Mode activated. Speak 'SOS' or 'Diagnostics' to verify." : "🎙️ AI Voice Command Mode deactivated.",
        "system"
      );
      return next;
    });
  };

  const setLanguage = (lang: "EN" | "ES" | "FR") => {
    setActiveLanguage(lang);
    addTerminalLog(`System language toggled to: ${lang}`, "system");
  };

  // Fatigue visual simulation
  const simulateFatigue = () => {
    addTerminalLog("⚠️ FATIGUE SIMULATOR: Spiking eye closure duration. Blink rate: 4 blinks/min. Yawn detected.", "warn");
    setTelemetry((prev) => ({
      ...prev,
      driverFatigueScore: 88,
      blinkRate: 3,
      yawnCount: prev.yawnCount + 1,
    }));
    setFatigueAlert(true);

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.speak(new SpeechSynthesisUtterance("Alert. Drowsiness detected. Please pull over safely."));
      } catch (e) {}
    }

    setTimeout(() => {
      setFatigueAlert(false);
      setTelemetry((prev) => ({
        ...prev,
        driverFatigueScore: 24,
        blinkRate: 14,
      }));
      addTerminalLog("Fatigue simulator reset: Driver metrics returned to nominal.", "success");
    }, 7000);
  };

  // Super Admin global broadcast
  const triggerGlobalBroadcast = (message: string) => {
    addTerminalLog(`📢 SYSTEM BROADCAST: "${message}"`, "error");
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(`Broadcast: ${message}`));
      } catch (e) {}
    }
  };

  return (
    <RoadSosContext.Provider
      value={{
        telemetry,
        serviceMode,
        incidents,
        terminalLogs,
        notifications,
        showEmergencyModal,
        countdown,
        voiceActive,
        activeLanguage,
        fatigueAlert,
        simulateCrash,
        confirmSafety,
        toggleServiceMode,
        dispatchService,
        updateIncidentStatus,
        addTerminalLog,
        clearTerminalLogs,
        addNotification,
        clearNotifications,
        markNotificationsAsRead,
        toggleVoiceAssistant,
        setLanguage,
        simulateFatigue,
        triggerGlobalBroadcast,
      }}
    >
      {children}
    </RoadSosContext.Provider>
  );
}

export function useRoadSos() {
  const context = useContext(RoadSosContext);
  if (context === undefined) {
    throw new Error("useRoadSos must be used within a RoadSosProvider");
  }
  return context;
}
