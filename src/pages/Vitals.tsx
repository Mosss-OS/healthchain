import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, TrendingUp, Activity, Droplet, Thermometer, Loader2, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { GlassCard } from "@/components/GlassCard";
import { useVitals } from "@/hooks/useVitals";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

export default function Vitals() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");
  const { vitals, isLoading, error, refetch } = useVitals();

  // Filter vitals by time range
  const filteredVitals = vitals.filter((v) => {
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return new Date(v.recorded_at) >= cutoff;
  });

  const handleRefetch = async () => {
    try {
      await refetch();
    } catch (err) {
      console.error("Failed to refetch vitals:", err);
    }
  };

  // Calculate latest vitals for summary
  const latestVital = vitals.length > 0 ? vitals[0] : null;

  return (
    <div>
      <PageHeader title="Vitals" subtitle="Health metrics over time" large />

      <div className="px-4 md:px-5 space-y-4 mt-3 md:space-y-5">
        {/* Summary Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
          {[
            { 
              label: "Heart Rate", 
              value: latestVital?.heart_rate?.toString() || "N/A", 
              unit: "bpm", 
              icon: Activity, 
              color: "text-pink bg-pink/10" 
            },
            { 
              label: "Blood Pressure", 
              value: latestVital ? `${latestVital.systolic_bp}/${latestVital.diastolic_bp}` : "N/A", 
              unit: "mmHg", 
              icon: TrendingUp, 
              color: "text-primary bg-primary/10" 
            },
            { 
              label: "SpO₂", 
              value: latestVital?.oxygen_saturation ? `${latestVital.oxygen_saturation}%` : "N/A", 
              unit: "", 
              icon: Droplet, 
              color: "text-teal bg-teal/10" 
            },
            { 
              label: "Temperature", 
              value: latestVital?.temperature?.toString() || "N/A", 
              unit: "°C", 
              icon: Thermometer, 
              color: "text-warning bg-warning/10" 
            },
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
          {isLoading ? (
            <div className="h-48 md:h-64 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="h-48 md:h-64 flex items-center justify-center">
              <p className="text-destructive">Failed to load vitals data</p>
            </div>
          ) : (
            <div className="h-48 md:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredVitals.map((v) => ({
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
          )}
        </GlassCard>

        {/* Blood Pressure Chart */}
        <GlassCard className="p-4 md:p-6">
          <h3 className="font-semibold text-sm md:text-base mb-3 md:mb-4">Blood Pressure Trend</h3>
          {isLoading ? (
            <div className="h-48 md:h-64 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="h-48 md:h-64 flex items-center justify-center">
              <p className="text-destructive">Failed to load vitals data</p>
            </div>
          ) : (
            <div className="h-48 md:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredVitals.map((v) => ({
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
          )}
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
            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <GlassCard key={i} className="p-3 md:p-4 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                      <div className="mt-1 h-3 w-48 bg-muted animate-pulse rounded" />
                    </div>
                    <div className="text-right shrink-0">
                      <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                      <div className="mt-1 h-3 w-12 bg-muted animate-pulse rounded" />
                    </div>
                  </GlassCard>
                ))}
              </div>
            ) : error ? (
              <GlassCard className="p-8 text-center">
                <p className="text-destructive">Failed to load vitals history</p>
              </GlassCard>
            ) : filteredVitals.length === 0 ? (
              <GlassCard className="p-8 text-center">
                <p className="text-muted-foreground">No vitals recorded yet</p>
              </GlassCard>
            ) : (
              filteredVitals.map((v) => (
                <GlassCard key={v.id} className="p-3 md:p-4 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm md:text-base font-semibold">
                      {new Date(v.recorded_at).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      HR: {v.heart_rate || 'N/A'} bpm · BP: {v.systolic_bp || 'N/A'}/{v.diastolic_bp || 'N/A'} · SpO₂: {v.oxygen_saturation || 'N/A'}%
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-medium">{v.weight_kg || 'N/A'} kg</p>
                    <p className="text-xs text-muted-foreground">{v.temperature || 'N/A'}°C</p>
                  </div>
                </GlassCard>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
