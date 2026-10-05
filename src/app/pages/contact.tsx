import QRCode from "react-qr-code";
import { ArrowUpRight } from "lucide-react";

export function Contact() {
  const whatsappNumber = "16469669675";
  const email = "bo.moldenhauer@pursuit.org";
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;
  const emailUrl = `mailto:${email}`;

  const channels = [
    {
      index: "01",
      name: "WhatsApp",
      blurb: "Quick response via messaging",
      qrValue: whatsappUrl,
      qrHint: "Scan to chat on WhatsApp",
      detail: "+1 (646) 966-9675",
      href: whatsappUrl,
      cta: "Open WhatsApp",
    },
    {
      index: "02",
      name: "Email",
      blurb: "Send me a detailed message",
      qrValue: emailUrl,
      qrHint: "Scan to send an email",
      detail: email,
      href: emailUrl,
      cta: "Send Email",
    },
  ];

  return (
    <div>
      {/* Header */}
      <header className="grid gap-8 px-5 pt-14 pb-16 sm:px-12 md:grid-cols-12 md:pt-20 md:pb-24">
        <div className="min-w-0 md:col-span-8">
          <p className="label-caps mb-4 text-sm">Contact</p>
          <h1 className="font-wide text-5xl uppercase leading-[0.88] sm:text-7xl lg:text-8xl">
            Get in Touch
          </h1>
        </div>
        <p className="self-end text-base leading-relaxed md:col-span-4">
          Interested in working together or have questions about my AI-generated content?
          Feel free to reach out via WhatsApp or email.
        </p>
      </header>

      {/* Contact Channels */}
      <section className="grid border-t border-ink md:grid-cols-2">
        {channels.map((c) => (
          <div
            key={c.name}
            className="flex flex-col gap-8 border-b border-ink px-5 py-12 sm:px-12 md:py-16 md:odd:border-r"
          >
            <div>
              <p className="mb-3 text-sm">({c.index})</p>
              <h2 className="font-wide text-4xl uppercase sm:text-5xl">{c.name}</h2>
              <p className="mt-2">{c.blurb}</p>
            </div>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
              <div className="w-fit border border-ink bg-paper p-4">
                <QRCode value={c.qrValue} size={160} level="H" className="h-auto w-[140px] sm:w-[160px]" />
              </div>
              <div className="min-w-0">
                <p className="text-sm">{c.qrHint}</p>
                <p className="mt-1 break-all text-lg font-bold">{c.detail}</p>
              </div>
            </div>
            <a
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              className="label-caps inline-flex w-fit items-center gap-2 bg-ink px-6 py-4 text-sun transition hover:bg-charcoal"
            >
              {c.cta} <ArrowUpRight className="size-4" />
            </a>
          </div>
        ))}
      </section>

      {/* Response Time */}
      <section className="grid gap-4 px-5 py-14 sm:px-12 md:grid-cols-12">
        <h3 className="text-2xl uppercase md:col-span-4">Response Time</h3>
        <p className="leading-relaxed md:col-span-6 md:col-start-7">
          I typically respond to WhatsApp messages within a few hours and emails within 24 hours.
        </p>
      </section>
    </div>
  );
}
