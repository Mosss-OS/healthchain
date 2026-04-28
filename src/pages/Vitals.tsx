import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, TrendingUp, Activity, Droplet, Thermometer } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { GlassCard } from "@/components/GlassCard";
import { mockVitals } from "@/lib/mockData";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

export default function Vitals() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");

  // Filter vitals by time range
  const filteredVitals = mockVitals.filter((v) => {
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return new Date(v.recorded_at) >= cutoff;
  });

  return (
    <div>
      <PageHeader title="Vitals" subtitle="Health metrics over time" large />

      <div className="px-4 md:px-5 space-y-4 mt-3 md:space-y-5">
        {/* Summary Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
          {[
            { label: "Heart Rate", value: "68", unit: "bpm", icon: Activity, color: "text-pink bg-pink/10" },
            { label: "Blood Pressure", value: "118/76", unit: "mmHg", icon: TrendingUp, color: "text-primary bg-primary/10" },
            { label: "SpO₂", value: "98%", unit: "", icon: Droplet, color: "text-teal bg-teal/10" },
            { label: "Temperature", value: "36.7", unit: "°C", icon: Thermometer, color: "text-warning bg-warning/10" },
          ].map((v) => (
            <GlassCard key={v.label} className="p-3 md:p-4">
              <div className={`h-8 w-8 md:h-9 md:w-9 rounded-xl flex items-center justify-center ${v.color}`}>
                <v.icon className="h-4 w-4 md:h-5 md:w-5" strokeWidth={2.4} />
              </div>
              <p className="text-xs md:text-sm text-muted-foreground mt-2 md:mt-3">{v.label}</p>
              <p className="text-xl md:text-2xl font-bold mt-0.5">
                {v.value}<span className="text-xs md:text-sm text-muted-foreground font-normal ml-1">{v.unit}</span>
              </p>
            </GlassCard>
          ))}
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-1 px-1 pb-1">
          {(["7d", "30d", "90d"] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`shrink-0 rounded-full px-3 md:px-4 py-1.5 text-xs md:text-sm font-medium transition-all min-h-[36px] md:min-h-[40px] ${
                timeRange === range
                  ? "bg-foreground text-background"
                  : "glass text-foreground"
              }`}
            >
              {range}
            </button>
          ))}
        </div>

        {/* Heart Rate Chart */}
        <GlassCard className="p-4 md:p-6">
          <h3 className="font-semibold text-sm md:text-base mb-3 md:mb-4">Heart Rate Trend</h3>
          <div className="h-48 md:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockVitals.map((v) => ({
                date: new Date(v.recorded_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                heartRate: v.heart_rate,
              }))}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  domain={['dataMin - 5', 'dataMax + 5']}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="heartRate" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ r: 4, fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Blood Pressure Chart */}
        <GlassCard className="p-4 md:p-6">
          <h3 className="font-semibold text-sm md:text-base mb-3 md:mb-4">Blood Pressure Trend</h3>
          <div className="h-48 md:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockVitals.map((v) => ({
                date: new Date(v.recorded_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                systolic: v.systolic_bp,
                diastolic: v.diastolic_bp,
              }))}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="systolic" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ r: 4, fill: 'hsl(var(--primary))' }}
                  name="Systolic"
                />
                <Line 
                  type="monotone" 
                  dataKey="diastolic" 
                  stroke="hsl(var(--pink))" 
                  strokeWidth={2}
                  dot={{ r: 4, fill: 'hsl(var(--pink))' }}
                  name="Diastolic"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* History List */}
        <div>
          <div className="flex items-center justify-between mb-2 md:mb-3 px-1">
            <h2 className="text-lg md:text-xl font-bold tracking-tight">History</h2>
            <Link to="/vitals/new" className="inline-flex items-center gap-1 text-primary text-sm font-medium min-h-[44px] flex items-center">
              <Plus className="h-4 w-4" />
              Log Vitals
            </Link>
          </div>
          <div className="space-y-2">
            {filteredVitals.map((v) => (
              <GlassCard key={v.id} className="p-3 md:p-4 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm md:text-base font-semibold">
                    {new Date(v.recorded_at).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    HR: {v.heart_rate} bpm · BP: {v.systolic_bp}/{v.diastolic_bp} · SpO₂: {v.oxygen_saturation}%
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-medium">{v.weight_kg} kg</p>
                  <p className="text-xs text-muted-foreground">{v.temperature}°C</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Add mock vitals data to mockData.ts if not exists
// This is a placeholder - the actual data should come from Supabase
const mockVitals = [
  { id: "v1", recorded_at: new Date().toISOString(), heart_rate: 68, systolic_bp: 118, diastolic_bp: 76, oxygen_saturation: 98, temperature: 36.7, weight_kg: 72.3 },
  { id: "v2", recorded_at: new Date(Date.now() - 86400000).toISOString(), heart_rate: 72, systolic_bp: 120, diastolic_bp: 78, oxygen_saturation: 97, temperature: 36.8, weight_kg: 72.5 },
  { id: "v3", recorded_at: new Date(Date.now() - 86400000 * 2).toISOString(), heart_rate: 65, systolic_bp: 115, diastolic_bp: 75, oxygen_saturation: 99, temperature: 36.6, weight_kg: 72.2 },
  { id: "v4", recorded_at: new Date(Date.now() - 86400000 * 3).toISOString(), heart_rate: 70, systolic_bp: 122, diastolic_bp: 80, oxygen_saturation: 98, temperature: 36.9, weight_kg: 72.8 },
  { id: "v5", recorded_at: new Date(Date.now() - 86400000 * 7).toISOString(), heart_rate: 68, systolic_bp: 118, diastolic_bp: 76, oxygen_saturation: 98, temperature: 36.7, weight_kg: 72.3 },
];
