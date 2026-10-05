import { useState } from "react";
import { Link } from "react-router";
import { ArrowUpRight, ChevronDown } from "lucide-react";

const BOOKING_EMAIL = "bo.moldenhauer@pursuit.org";
const DJ_URL = "https://jonnyverse.vercel.app/";

const referralOptions = [
  "Instagram",
  "TikTok",
  "Google search",
  "Friend or family referral",
  "Wedding vendor or planner",
  "Other",
];

const shootTypes = [
  "Destination wedding",
  "Wedding",
  "Event",
  "Portrait / editorial",
  "Brand / AI content",
];

type FormState = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  shootType: string;
  date: string;
  ceremonyVenue: string;
  receptionVenue: string;
  referral: string;
  addDj: boolean;
  message: string;
};

const emptyForm: FormState = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  shootType: "",
  date: "",
  ceremonyVenue: "",
  receptionVenue: "",
  referral: "",
  addDj: false,
  message: "",
};

/** Underline-only field with a small tracked uppercase label. */
function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="font-display text-xs font-semibold uppercase tracking-[0.14em] text-charcoal">
        {label}
        {required && " *"}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "mt-3 block w-full rounded-none border-0 border-b border-charcoal bg-transparent px-0 pb-3 font-mono text-lg text-ink outline-none transition-colors placeholder:italic placeholder:text-charcoal/40 focus:border-b-2 focus:border-ink";

function formatDate(value: string) {
  if (!value) return "";
  const [y, m, d] = value.split("-");
  return `${m}/${d}/${y}`;
}

export function Book() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [sent, setSent] = useState(false);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const fullName = [form.firstName, form.lastName].filter(Boolean).join(" ");
    const lines = [
      `Name: ${fullName}`,
      `Email: ${form.email}`,
      `Contact number: ${form.phone || "—"}`,
      `Shoot type: ${form.shootType || "—"}`,
      `Date: ${formatDate(form.date) || "—"}`,
      `Ceremony venue: ${form.ceremonyVenue || "—"}`,
      `Reception venue: ${form.receptionVenue || "—"}`,
      `Add a DJ (DJ Jonnypurse): ${form.addDj ? "Yes" : "No"}`,
      `Heard about Forth via: ${form.referral}`,
      "",
      form.message,
    ];
    const subject = `Booking inquiry — ${fullName}${form.shootType ? ` (${form.shootType})` : ""}`;
    window.location.href = `mailto:${BOOKING_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
    setSent(true);
  }

  return (
    <div className="grid md:grid-cols-12">
      {/* Intro */}
      <header className="px-5 pt-14 pb-12 sm:px-12 md:col-span-5 md:pt-20 md:pb-24">
        <div className="md:sticky md:top-32">
          <p className="label-caps mb-4 text-sm">Book a Shoot</p>
          <h1 className="font-wide text-5xl uppercase leading-[0.88] sm:text-6xl lg:text-7xl">
            Let's make it
          </h1>
          <p className="mt-8 max-w-sm leading-relaxed">
            Tell me about your day — weddings, events, portraits, or brand work. Fill in what you know
            and I'll get back to you within 24 hours.
          </p>
          <p className="mt-6 text-sm">Fields marked * are required.</p>
        </div>
      </header>

      {/* Form */}
      <section className="bg-mist px-5 py-12 sm:px-12 md:col-span-7 md:py-20">
        {sent ? (
          <div className="max-w-xl">
            <h2 className="font-wide text-4xl uppercase leading-[0.9]">Almost there</h2>
            <p className="mt-6 leading-relaxed">
              Your email app should have opened with your details filled in — just hit send. If it didn't,
              email{" "}
              <a href={`mailto:${BOOKING_EMAIL}`} className="font-bold underline underline-offset-4">
                {BOOKING_EMAIL}
              </a>{" "}
              or message me on{" "}
              <Link to="/contact" className="font-bold underline underline-offset-4">
                WhatsApp
              </Link>
              .
            </p>
            <button
              onClick={() => { setSent(false); setForm(emptyForm); }}
              className="label-caps mt-8 border border-ink px-6 py-4 transition hover:bg-ink hover:text-sun"
            >
              Start a new inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-xl space-y-12">
            <Field label="First name" required>
              <input
                className={inputClass}
                value={form.firstName}
                onChange={(e) => set("firstName", e.target.value)}
                autoComplete="given-name"
                required
              />
            </Field>
            <Field label="Last name">
              <input
                className={inputClass}
                value={form.lastName}
                onChange={(e) => set("lastName", e.target.value)}
                autoComplete="family-name"
              />
            </Field>
            <Field label="Contact number">
              <input
                type="tel"
                className={inputClass}
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                autoComplete="tel"
              />
            </Field>
            <Field label="Email address" required>
              <input
                type="email"
                className={inputClass}
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                autoComplete="email"
                required
              />
            </Field>
            <Field label="What are we shooting?">
              <div className="relative">
                <select
                  className={`${inputClass} appearance-none pr-8 ${form.shootType ? "" : "italic text-charcoal/40"}`}
                  value={form.shootType}
                  onChange={(e) => set("shootType", e.target.value)}
                >
                  <option value="">Select option</option>
                  {shootTypes.map((t) => (
                    <option key={t} value={t} className="not-italic text-ink">{t}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-0 bottom-4 size-5" />
              </div>
            </Field>
            <Field label="Wedding / event date">
              <input
                type="date"
                className={inputClass}
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
              />
            </Field>
            <Field label="Ceremony venue">
              <input
                className={inputClass}
                value={form.ceremonyVenue}
                onChange={(e) => set("ceremonyVenue", e.target.value)}
              />
            </Field>
            <Field label="Reception venue">
              <input
                className={inputClass}
                value={form.receptionVenue}
                onChange={(e) => set("receptionVenue", e.target.value)}
              />
            </Field>
            <Field label="How did you first hear about us?" required>
              <div className="relative">
                <select
                  className={`${inputClass} appearance-none pr-8 ${form.referral ? "" : "italic text-charcoal/40"}`}
                  value={form.referral}
                  onChange={(e) => set("referral", e.target.value)}
                  required
                >
                  <option value="" disabled>Select option</option>
                  {referralOptions.map((o) => (
                    <option key={o} value={o} className="not-italic text-ink">{o}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-0 bottom-4 size-5" />
              </div>
            </Field>

            {/* DJ add-on */}
            <div className="flex items-start gap-4 border border-ink bg-paper p-5">
              <input
                id="add-dj"
                type="checkbox"
                checked={form.addDj}
                onChange={(e) => set("addDj", e.target.checked)}
                className="mt-1 size-5 shrink-0 accent-ink"
              />
              <div>
                <label htmlFor="add-dj" className="block text-lg font-bold uppercase leading-tight">
                  Add a DJ to my package
                </label>
                <p className="mt-1 text-sm leading-relaxed">
                  Pair your shoot with a set from DJ Jonnypurse.{" "}
                  <a href={DJ_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 font-bold underline underline-offset-4">
                    See JonnyVerse <ArrowUpRight className="size-3.5" />
                  </a>
                </p>
              </div>
            </div>

            <Field label="Anything else?">
              <textarea
                rows={3}
                className={`${inputClass} resize-y`}
                value={form.message}
                onChange={(e) => set("message", e.target.value)}
              />
            </Field>

            <button
              type="submit"
              className="label-caps inline-flex w-full items-center justify-center gap-2 bg-ink px-6 py-5 text-sun transition hover:bg-charcoal"
            >
              Send inquiry <ArrowUpRight className="size-4" />
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
