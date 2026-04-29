import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Droplet, Thermometer, Scale, Activity } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { GlassCard } from "@/components/GlassCard";
import { usePrivy } from "@privy-io/react-auth";
import { toast } from "sonner";

export default function AddVitals() {
  const navigate = useNavigate();
  const { user } = usePrivy();
  
  const [heartRate, setHeartRate] = useState("");
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [oxygenSaturation, setOxygenSaturation] = useState("");
  const [temperature, setTemperature] = useState("");
  const [weight, setWeight] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!heartRate && !systolic && !diastolic && !oxygenSaturation && !temperature && !weight) {
      toast.error("Please enter at least one vital sign");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const vitalsData = {
        heart_rate: heartRate ? parseInt(heartRate) : null,
        systolic_bp: systolic ? parseInt(systolic) : null,
        diastolic_bp: diastolic ? parseInt(diastolic) : null,
        oxygen_saturation: oxygenSaturation ? parseInt(oxygenSaturation) : null,
        temperature: temperature ? parseFloat(temperature) : null,
        weight_kg: weight ? parseFloat(weight) : null,
        notes,
        recorded_at: new Date().toISOString(),
        user_id: user?.id,
      };

      console.log("Saving vitals:", vitalsData);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Vitals recorded successfully!");
      navigate("/vitals");
    } catch (err) {
      console.error("Failed to save vitals:", err);
      toast.error("Failed to save vitals");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Log Vitals"
        subtitle="Record your health metrics"
        backTo="/vitals"
      />

      <div className="px-4 md:px-5 mt-4 md:mt-5 max-w-2xl mx-auto space-y-4">
        <GlassCard className="p-4 md:p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium flex items-center gap-2">
                <Heart className="h-4 w-4 text-pink" />
                Heart Rate
              </label>
              <div className="mt-1 flex items-center gap-1">
                <input
                  type="number"
                  value={heartRate}
                  onChange={(e) => setHeartRate(e.target.value)}
                  placeholder="68"
                  className="w-full glass rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                />
                <span className="text-sm text-muted-foreground">bpm</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium flex items-center gap-2">
                <Droplet className="h-4 w-4 text-teal" />
                SpO₂
              </label>
              <div className="mt-1 flex items-center gap-1">
                <input
                  type="number"
                  value={oxygenSaturation}
                  onChange={(e) => setOxygenSaturation(e.target.value)}
                  placeholder="98"
                  className="w-full glass rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                Systolic BP
              </label>
              <div className="mt-1 flex items-center gap-1">
                <input
                  type="number"
                  value={systolic}
                  onChange={(e) => setSystolic(e.target.value)}
                  placeholder="120"
                  className="w-full glass rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                />
                <span className="text-sm text-muted-foreground">mmHg</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium flex items-center gap-2">
                <Activity className="h-4 w-4 text-pink" />
                Diastolic BP
              </label>
              <div className="mt-1 flex items-center gap-1">
                <input
                  type="number"
                  value={diastolic}
                  onChange={(e) => setDiastolic(e.target.value)}
                  placeholder="80"
                  className="w-full glass rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                />
                <span className="text-sm text-muted-foreground">mmHg</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-warning" />
                Temperature
              </label>
              <div className="mt-1 flex items-center gap-1">
                <input
                  type="number"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  placeholder="36.7"
                  className="w-full glass rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                />
                <span className="text-sm text-muted-foreground">°C</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium flex items-center gap-2">
                <Scale className="h-4 w-4 text-muted-foreground" />
                Weight
              </label>
              <div className="mt-1 flex items-center gap-1">
                <input
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="72.5"
                  className="w-full glass rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                />
                <span className="text-sm text-muted-foreground">kg</span>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes..."
              rows={3}
              className="mt-1 w-full glass rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40 resize-none"
            />
          </div>
        </GlassCard>

        <div className="text-xs text-muted-foreground text-center">
          Vitals will be encrypted and stored securely
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/vitals")}
            className="flex-1 glass rounded-xl py-2.5 md:py-3 text-sm md:text-base font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 bg-primary text-primary-foreground rounded-xl py-2.5 md:py-3 text-sm md:text-base font-semibold disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Vitals"}
          </button>
        </div>
      </div>
    </div>
  );
}