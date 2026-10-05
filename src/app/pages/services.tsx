import { Check, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
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

export function Services() {
  return (
    <div className="min-h-[calc(100vh-180px)] px-4 sm:px-6 py-12 md:py-20">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-800/50 px-4 py-2">
            <Sparkles className="size-4 text-purple-400" />
            <span className="text-xs sm:text-sm text-neutral-300">Professional AI Content Services</span>
          </div>
          <h1 className="mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-4xl sm:text-5xl md:text-6xl text-transparent">
            Services & Pricing
          </h1>
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-neutral-400">
            High-quality AI-generated content tailored to your brand. No subscriptions to expensive tools, 
            no learning curve—just professional results delivered fast.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="mb-20 flex justify-center">
          {services.map((service, index) => (
            <Card
              key={index}
              className="w-full max-w-md border-neutral-800 bg-neutral-900/50"
            >
              <CardHeader>
                <CardTitle className="text-2xl text-white">{service.name}</CardTitle>
                <CardDescription className="text-neutral-400">{service.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl text-white">{service.price}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="mt-0.5 size-5 shrink-0 text-green-500" />
                      <span className="text-sm text-neutral-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/contact">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Industries Section */}
        <div className="mb-20">
          <h2 className="mb-8 text-center text-3xl text-white">Industries I Serve</h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {industries.map((industry, index) => (
              <Card key={index} className="border-neutral-800 bg-neutral-900/50 text-center">
                <CardContent className="p-6">
                  <div className="mb-2 text-3xl">{industry.icon}</div>
                  <p className="text-sm text-neutral-300">{industry.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-3xl text-white">Why Choose AI Content?</h2>
          <div className="space-y-6">
            <Card className="border-neutral-800 bg-neutral-900/50">
              <CardHeader>
                <CardTitle className="text-xl text-white">Cost-Effective</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-400">
                  Get professional-grade content at a fraction of traditional photography costs. 
                  No studio rentals, no model fees, no travel expenses.
                </p>
              </CardContent>
            </Card>

            <Card className="border-neutral-800 bg-neutral-900/50">
              <CardHeader>
                <CardTitle className="text-xl text-white">Fast Turnaround</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-400">
                  Need content yesterday? AI generation means you get results in hours or days, 
                  not weeks. Perfect for urgent campaigns and seasonal promotions.
                </p>
              </CardContent>
            </Card>

            <Card className="border-neutral-800 bg-neutral-900/50">
              <CardHeader>
                <CardTitle className="text-xl text-white">Unlimited Variations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-400">
                  Experiment with different styles, backgrounds, and compositions without 
                  additional photoshoot costs. Test what resonates with your audience.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 rounded-lg border border-neutral-800 bg-gradient-to-r from-purple-900/20 to-blue-900/20 p-8 text-center md:p-12">
          <h2 className="mb-4 text-3xl text-white">Ready to Transform Your Content?</h2>
          <p className="mb-6 text-lg text-neutral-400">
            Let's discuss your project and find the perfect package for your needs.
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
              Schedule a Consultation
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}