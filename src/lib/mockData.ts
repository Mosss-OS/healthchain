export type RecordType =
  | "consultation" | "lab_result" | "prescription" | "imaging"
  | "surgery" | "vaccination" | "allergy" | "vitals" | "discharge_summary";

export interface MedicalRecord {
  id: string;
  type: RecordType;
  title: string;
  provider: string;
  institution: string;
  date: string;
  description: string;
  onChain: boolean;
  encrypted: boolean;
  ipfsHash: string;
  txHash: string;
}

export interface Provider {
  id: string;
  name: string;
  specialty: string;
  institution: string;
  verified: boolean;
  rating: number;
  avatar: string;
}

export interface AccessGrant {
  id: string;
  providerName: string;
  providerSpecialty: string;
  recordTitle: string;
  grantedAt: string;
  expiresAt: string;
  fee?: number;
  status: "active" | "pending" | "revoked";
}

export interface Notification {
  id: string;
  type: "access_request" | "access_granted" | "record_added" | "payment_received";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export const mockUser = {
  name: "Alex Morgan",
  email: "alex.morgan@healthchain.io",
  wallet: "0x7a3F9B2c8E4d1A5F6B9C2e3D4f5A6B7C8D9E0F1a",
  avatar: "AM",
  bloodType: "O+",
  dob: "1992-04-18",
  healthScore: 87,
};

export const mockRecords: MedicalRecord[] = [
  { id: "1", type: "lab_result", title: "Complete Blood Count", provider: "Dr. Sarah Johnson", institution: "Metro Health Center", date: "2026-04-20", description: "Routine annual CBC panel — all values within normal range.", onChain: true, encrypted: true, ipfsHash: "QmXf5a...k9bC", txHash: "0x8a4f...92e1" },
  { id: "2", type: "consultation", title: "Cardiology Follow-up", provider: "Dr. Michael Chen", institution: "Heart & Vascular Institute", date: "2026-04-12", description: "Post-stress test review. Patient responding well to medication.", onChain: true, encrypted: true, ipfsHash: "QmA2b3...pL8x", txHash: "0x3f2c...a481" },
  { id: "3", type: "prescription", title: "Atorvastatin 20mg", provider: "Dr. Michael Chen", institution: "Heart & Vascular Institute", date: "2026-04-12", description: "90-day supply. Take once daily with evening meal.", onChain: true, encrypted: true, ipfsHash: "QmR7d1...n4Vz", txHash: "0x9c2d...b735" },
  { id: "4", type: "imaging", title: "Chest X-Ray", provider: "Radiology Dept.", institution: "Metro Health Center", date: "2026-03-28", description: "Clear lung fields. No abnormalities detected.", onChain: true, encrypted: true, ipfsHash: "QmK9s5...x2Qw", txHash: "0x5e8b...c024" },
  { id: "5", type: "vaccination", title: "Influenza Vaccine 2026", provider: "Nurse Practitioner Lee", institution: "Community Clinic", date: "2026-02-14", description: "Seasonal flu vaccination administered in left deltoid.", onChain: true, encrypted: true, ipfsHash: "QmT4b8...y7Dm", txHash: "0x1a6f...d913" },
  { id: "6", type: "vitals", title: "Quarterly Vitals", provider: "Self-reported", institution: "Home", date: "2026-04-25", description: "HR: 68 bpm · BP: 118/76 · SpO2: 98% · Temp: 36.7°C", onChain: true, encrypted: true, ipfsHash: "QmV2n6...r8Kp", txHash: "0x7d3e...a250" },
];

export const mockProviders: Provider[] = [
  { id: "p1", name: "Dr. Sarah Johnson", specialty: "General Practice", institution: "Metro Health Center", verified: true, rating: 4.9, avatar: "SJ" },
  { id: "p2", name: "Dr. Michael Chen", specialty: "Cardiology", institution: "Heart & Vascular Institute", verified: true, rating: 4.8, avatar: "MC" },
  { id: "p3", name: "Dr. Aisha Patel", specialty: "Neurology", institution: "Neuroscience Hospital", verified: true, rating: 4.9, avatar: "AP" },
  { id: "p4", name: "Dr. David Okafor", specialty: "Pediatrics", institution: "Children's Medical", verified: true, rating: 5.0, avatar: "DO" },
  { id: "p5", name: "Dr. Elena Rossi", specialty: "Oncology", institution: "Cancer Research Center", verified: true, rating: 4.7, avatar: "ER" },
];

export const mockGrants: AccessGrant[] = [
  { id: "g1", providerName: "Dr. Michael Chen", providerSpecialty: "Cardiology", recordTitle: "Cardiology Follow-up", grantedAt: "2026-04-12", expiresAt: "2026-07-12", fee: 0, status: "active" },
  { id: "g2", providerName: "Dr. Sarah Johnson", providerSpecialty: "General Practice", recordTitle: "Complete Blood Count", grantedAt: "2026-04-20", expiresAt: "2026-05-20", fee: 2, status: "active" },
  { id: "g3", providerName: "Dr. Aisha Patel", providerSpecialty: "Neurology", recordTitle: "All Records", grantedAt: "2026-04-25", expiresAt: "2026-04-26", status: "pending", fee: 5 },
];

export const mockNotifications: Notification[] = [
  { id: "n1", type: "access_request", title: "New access request", message: "Dr. Aisha Patel requested access to your records.", time: "2h ago", read: false },
  { id: "n2", type: "record_added", title: "Record added on-chain", message: "Complete Blood Count is now secured on Base.", time: "5d ago", read: false },
  { id: "n3", type: "payment_received", title: "Payment received", message: "+2 USDC from Metro Health Center.", time: "5d ago", read: true },
  { id: "n4", type: "access_granted", title: "Access granted", message: "You shared records with Dr. Michael Chen.", time: "14d ago", read: true },
];

export const recordTypeMeta: Record<RecordType, { label: string; color: string; icon: string }> = {
  consultation:      { label: "Consultation",      color: "primary", icon: "stethoscope" },
  lab_result:        { label: "Lab Result",        color: "teal",    icon: "flask" },
  prescription:      { label: "Prescription",      color: "accent",  icon: "pill" },
  imaging:           { label: "Imaging",           color: "pink",    icon: "scan" },
  surgery:           { label: "Surgery",           color: "warning", icon: "scissors" },
  vaccination:       { label: "Vaccination",       color: "success", icon: "syringe" },
  allergy:           { label: "Allergy",           color: "destructive", icon: "alert" },
  vitals:            { label: "Vitals",            color: "primary", icon: "activity" },
  discharge_summary: { label: "Discharge",         color: "muted",   icon: "file" },
};

export const usdcBalance = 42.5;
export const baseBalance = 0.0125;
