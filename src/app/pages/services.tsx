import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";

const services = [
  {
    name: "Custom Brand Content",
    description: "Tailored AI visuals for your specific needs",
    price: "Custom pricing",
    features: [
      "Unlimited image generation",
      "Custom style development",
      "Brand guidelines integration",
      "Dedicated account manager",
      "Weekly strategy calls",
      "Full commercial license",
      "Same-day rush available",
      "Exclusive brand rights",
    ],
    popular: false,
  },
];

const industries = [
  { name: "Beauty & Skincare", icon: "💄" },
  { name: "Fashion & Apparel", icon: "👔" },
  { name: "Food & Beverage", icon: "🍽️" },
  { name: "Fitness & Wellness", icon: "💪" },
  { name: "Home & Lifestyle", icon: "🏠" },
  { name: "Technology", icon: "💻" },
];

const reasons = [
  {
    title: "Cost-Effective",
    body: "Get professional-grade content at a fraction of traditional photography costs. No studio rentals, no model fees, no travel expenses.",
  },
  {
    title: "Fast Turnaround",
    body: "Need content yesterday? AI generation means you get results in hours or days, not weeks. Perfect for urgent campaigns and seasonal promotions.",
  },
  {
    title: "Unlimited Variations",
    body: "Experiment with different styles, backgrounds, and compositions without additional photoshoot costs. Test what resonates with your audience.",
  },
];

export function Services() {
  return (
    <div>
      {/* Header */}
      <header className="grid gap-8 px-5 pt-14 pb-16 sm:px-12 md:grid-cols-12 md:pt-20 md:pb-24">
        <div className="min-w-0 md:col-span-8">
          <p className="label-caps mb-4 text-sm">Professional AI Content Services</p>
          <h1 className="font-wide text-5xl uppercase leading-[0.88] sm:text-7xl lg:text-8xl">
            Services &amp; Pricing
          </h1>
        </div>
        <p className="self-end text-base leading-relaxed md:col-span-4">
          High-quality AI-generated content tailored to your brand. No subscriptions to expensive tools,
          no learning curve—just professional results delivered fast.
        </p>
      </header>

      {/* Pricing */}
      {services.map((service, index) => (
        <section key={index} className="grid border-t border-ink md:grid-cols-12">
          <div className="border-b border-ink px-5 py-12 sm:px-12 md:col-span-5 md:border-r md:border-b-0 md:py-16">
            <p className="mb-3 text-sm">(0{index + 1})</p>
            <h2 className="text-4xl uppercase sm:text-5xl">{service.name}</h2>
            <p className="mt-4 leading-relaxed">{service.description}</p>
            <p className="font-wide mt-10 text-3xl uppercase">{service.price}</p>
            <Link
              to="/contact"
              className="label-caps mt-8 inline-flex items-center gap-2 bg-ink px-6 py-4 text-sun transition hover:bg-charcoal"
            >
              Get Started <ArrowUpRight className="size-4" />
            </Link>
          </div>
          <ul className="grid sm:grid-cols-2 md:col-span-7">
            {service.features.map((feature, idx) => (
              <li
                key={idx}
                className="flex gap-4 border-b border-ink px-5 py-5 sm:px-8 sm:odd:border-r"
              >
                <span className="text-sm tabular-nums">{String(idx + 1).padStart(2, "0")}</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {/* Industries */}
      <section className="bg-ink px-5 py-20 text-sun sm:px-12 md:py-28">
        <h2 className="font-wide mb-12 text-4xl uppercase leading-[0.9] sm:text-6xl">Industries I Serve</h2>
        <ul className="grid border-t border-sun/40 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry, index) => (
            <li key={index} className="flex items-center gap-4 border-b border-sun/40 py-6 text-xl font-display font-bold uppercase sm:pr-6">
              <span className="text-2xl" aria-hidden>{industry.icon}</span>
              {industry.name}
            </li>
          ))}
        </ul>
      </section>

      {/* Why AI */}
      <section className="px-5 py-20 sm:px-12 md:py-28">
        <h2 className="font-wide mb-12 text-4xl uppercase leading-[0.9] sm:text-6xl">Why Choose AI Content?</h2>
        <div className="grid border-t border-ink md:grid-cols-3">
          {reasons.map((reason, index) => (
            <div key={reason.title} className="border-b border-ink py-8 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0">
              <p className="mb-6 text-sm">(0{index + 1})</p>
              <h3 className="mb-4 text-2xl uppercase">{reason.title}</h3>
              <p className="leading-relaxed">{reason.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-ink bg-paper px-5 py-20 sm:px-12 md:py-24">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <h2 className="font-wide text-4xl uppercase leading-[0.9] sm:text-6xl md:col-span-8">
            Ready to Transform Your Content?
          </h2>
          <div className="md:col-span-4">
            <p className="mb-6 leading-relaxed">
              Let's discuss your project and find the perfect package for your needs.
            </p>
            <Link
              to="/contact"
              className="label-caps inline-flex items-center gap-2 bg-ink px-6 py-4 text-sun transition hover:bg-charcoal"
            >
              Schedule a Consultation <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
