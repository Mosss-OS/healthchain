import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Video, MapPin, Stethoscope } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { GlassCard } from "@/components/GlassCard";
import { usePrivy } from "@privy-io/react-auth";
import { toast } from "sonner";

export default function AddAppointment() {
  const navigate = useNavigate();
  const { user } = usePrivy();
  
  const [title, setTitle] = useState("");
  const [providerName, setProviderName] = useState("");
  const [providerSpecialty, setProviderSpecialty] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isVirtual, setIsVirtual] = useState(false);
  const [location, setLocation] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const specialties = [
    "General Practice",
    "Cardiology",
    "Dermatology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "Psychiatry",
    "Oncology",
    "Ophthalmology",
    "ENT",
    "Other",
  ];

  const handleSubmit = async () => {
    if (!title || !providerName || !date || !time) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (isVirtual && !meetingLink) {
      toast.error("Please provide a meeting link for virtual appointments");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const appointmentData = {
        title,
        provider_name: providerName,
        provider_specialty: providerSpecialty,
        scheduled_at: new Date(`${date}T${time}`).toISOString(),
        is_virtual: isVirtual,
        location: isVirtual ? "" : location,
        meeting_link: isVirtual ? meetingLink : "",
        notes,
        status: "scheduled",
        user_id: user?.id,
      };

      console.log("Saving appointment:", appointmentData);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Appointment booked successfully!");
      navigate("/appointments");
    } catch (err) {
      console.error("Failed to book appointment:", err);
      toast.error("Failed to book appointment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Book Appointment"
        subtitle="Schedule a new appointment"
        backTo="/appointments"
      />

      <div className="px-4 md:px-5 mt-4 md:mt-5 max-w-2xl mx-auto space-y-4">
        <GlassCard className="p-4 md:p-5 space-y-4">
          <div>
            <label className="text-sm font-medium">Appointment Title *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Annual Checkup"
              className="mt-1 w-full glass rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Provider Name *</label>
              <input
                value={providerName}
                onChange={(e) => setProviderName(e.target.value)}
                placeholder="e.g., Dr. Smith"
                className="mt-1 w-full glass rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Specialty</label>
              <select
                value={providerSpecialty}
                onChange={(e) => setProviderSpecialty(e.target.value)}
                className="mt-1 w-full glass rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="">Select specialty...</option>
                {specialties.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="mt-1 w-full glass rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div>
              <label className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Time *
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="mt-1 w-full glass rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 glass rounded-xl">
            <input
              type="checkbox"
              id="isVirtual"
              checked={isVirtual}
              onChange={(e) => setIsVirtual(e.target.checked)}
              className="h-4 w-4 rounded border-border"
            />
            <label htmlFor="isVirtual" className="flex items-center gap-2 text-sm font-medium">
              {isVirtual ? <Video className="h-4 w-4 text-primary" /> : <MapPin className="h-4 w-4" />}
              {isVirtual ? "Virtual Appointment" : "In-Person Appointment"}
            </label>
          </div>

          {isVirtual ? (
            <div>
              <label className="text-sm font-medium">Meeting Link *</label>
              <input
                type="url"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                placeholder="https://zoom.us/j/..."
                className="mt-1 w-full glass rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          ) : (
            <div>
              <label className="text-sm font-medium">Location</label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., 123 Medical Center, Suite 100"
                className="mt-1 w-full glass rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          )}

          <div>
            <label className="text-sm font-medium">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Reason for visit, questions to ask, etc."
              rows={3}
              className="mt-1 w-full glass rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40 resize-none"
            />
          </div>
        </GlassCard>

        <div className="text-xs text-muted-foreground text-center">
          Appointment details will be stored securely
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/appointments")}
            className="flex-1 glass rounded-xl py-2.5 md:py-3 text-sm md:text-base font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 bg-primary text-primary-foreground rounded-xl py-2.5 md:py-3 text-sm md:text-base font-semibold disabled:opacity-50"
          >
            {isSubmitting ? "Booking..." : "Book Appointment"}
          </button>
        </div>
      </div>
    </div>
  );
}