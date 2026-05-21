// src/lib/api.ts
// ─────────────────────────────────────────────────────────────
// Capa central de comunicación con el backend real.
// Cambiar API_BASE si la URL del tunnel cambia.
// ─────────────────────────────────────────────────────────────

export const API_BASE = "https://rhtnmsvd-5000.use.devtunnels.ms";

// ── Tipos que devuelve el backend ─────────────────────────────

export type ApiAppointment = {
  id: string;
  hour: number;
  name: string;
  procedure: string;
  value: number;
  status: "confirmed" | "at-risk" | "cancelled" | "recovered" | "doubtful";
  note?: string;
  risk?: number;
};

export type ApiAlert = {
  level: "danger" | "warning";
  patient: string;
  procedure: string;
  value: number;
  when: string;
  reason: string;
  risk: number;
  cta: string;
};

export type ApiKpis = {
  revenue_recovered: number;
  appointments_saved: number;
  appointments_cancelled: number;
  no_show_rate: number;
  original_no_show_rate: number;
  avg_recovery_time_min: number;
  total_appointments: number;
};

export type DashboardData = {
  kpis: ApiKpis;
  appointments: ApiAppointment[];
  alerts: ApiAlert[];
};

export type WaitlistCandidate = {
  id: string;
  name: string;
  days_waiting: number;
  priority: number;
  status: "active" | "notified" | "accepted" | "expired";
  phone?: string;
};

export type CommissionItem = {
  id: string;
  patient: string;
  procedure: string;
  amount: number;
  commission: number;
  status: string;
  date: string;
};

export type ProjectionPoint = {
  month: string;
  revenue: number;
  clinics?: number;
};

export type SemanticSignal = {
  text: string;
  type: "impediment" | "uncertainty" | "postponement" | "positive";
  label: string;
  start: number;
  end: number;
};

export type AnalyzeResponse = {
  risk_score: number;
  risk_level: "low" | "medium" | "high" | "critical";
  classification: string;
  signals: SemanticSignal[];
  action: string;
  action_taken: string;
  latency_ms: number;
};

// ── Funciones de fetch ────────────────────────────────────────

export async function fetchDashboard(): Promise<DashboardData> {
  const res = await fetch(`${API_BASE}/api/dashboard`);
  if (!res.ok) throw new Error("Error al cargar dashboard");
  return res.json();
}

export async function fetchWaitlist(): Promise<WaitlistCandidate[]> {
  const res = await fetch(`${API_BASE}/api/waitlist`);
  if (!res.ok) throw new Error("Error al cargar lista de espera");
  return res.json();
}

export async function fetchCommissions(): Promise<CommissionItem[]> {
  const res = await fetch(`${API_BASE}/api/commissions`);
  if (!res.ok) throw new Error("Error al cargar comisiones");
  return res.json();
}

export async function fetchProjections(): Promise<ProjectionPoint[]> {
  const res = await fetch(`${API_BASE}/api/projections`);
  if (!res.ok) throw new Error("Error al cargar proyecciones");
  return res.json();
}

// Análisis de mensaje de texto
export async function analyzeText(message: string): Promise<AnalyzeResponse> {
  const res = await fetch(`${API_BASE}/api/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  if (!res.ok) throw new Error("Error en análisis semántico");
  return res.json();
}

// Análisis de ghosting (sin respuesta)
export async function analyzeGhosting(hours_without_reply: number): Promise<AnalyzeResponse> {
  const res = await fetch(`${API_BASE}/api/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ hours_without_reply }),
  });
  if (!res.ok) throw new Error("Error en análisis de ghosting");
  return res.json();
}