export type Status = "confirmed" | "at-risk" | "cancelled" | "recovered" | "doubtful";

export type Appointment = {
  hour: number; // 7..19
  name: string;
  procedure: string;
  value: number;
  status: Status;
  note?: string;
};

export const appointments: Appointment[] = [
  { hour: 8, name: "María L.", procedure: "Botox", value: 450, status: "confirmed" },
  { hour: 9, name: "Ana R.", procedure: "Ácido Hialurónico", value: 380, status: "at-risk", note: "Sin respuesta (6h)" },
  { hour: 10, name: "VACÍO", procedure: "Cancelado", value: 0, status: "cancelled" },
  { hour: 11, name: "Carlos M.", procedure: "Botox", value: 450, status: "recovered" },
  { hour: 12, name: "Laura S.", procedure: "Hilos Tensores", value: 600, status: "confirmed" },
  { hour: 14, name: "Patricia V.", procedure: "Laser", value: 350, status: "doubtful", note: "Respuesta dudosa" },
];

export type AlertItem = {
  level: "danger" | "warning";
  patient: string;
  procedure: string;
  value: number;
  when: string;
  reason: string;
  risk: number;
  cta: string;
};

export const alerts: AlertItem[] = [
  {
    level: "danger",
    patient: "Ana R.",
    procedure: "Ácido Hialurónico",
    value: 380,
    when: "Mañana 9:00 AM",
    reason: "Sin respuesta hace 6h",
    risk: 85,
    cta: "Activar Lista de Espera",
  },
  {
    level: "warning",
    patient: "Patricia V.",
    procedure: "Laser",
    value: 350,
    when: "Mañana 2:00 PM",
    reason: "Respuesta dudosa",
    risk: 65,
    cta: "Ver Análisis",
  },
];

export const projections = [
  { month: "Mes 1", revenue: 1395 },
  { month: "Mes 2", revenue: 2790 },
  { month: "Mes 3", revenue: 4185 },
  { month: "Mes 4", revenue: 7000 },
  { month: "Mes 5", revenue: 11000 },
  { month: "Mes 6", revenue: 16740 },
  { month: "Mes 7", revenue: 22000 },
  { month: "Mes 8", revenue: 28000 },
  { month: "Mes 9", revenue: 34000 },
  { month: "Mes 10", revenue: 42000 },
  { month: "Mes 11", revenue: 49000 },
  { month: "Mes 12", revenue: 55800 },
];
