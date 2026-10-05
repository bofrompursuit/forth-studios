import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { GalleryItem } from "../components/gallery-item";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { ArrowLeft, ArrowRight, ArrowUpRight, Plus, Minus } from "lucide-react";
import { apiRequest } from "../lib/api";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import heroVideo from "@/imports/12987890-hd_1920_1080_30fps.mp4";
import wedding1 from "@/imports/Baker_Editorial_02.jpg";
import wedding2 from "@/imports/Baker_Editorial_05-1.jpg";
import wedding3 from "@/imports/Baker_Editorial_07-1.jpg";
import wedding4 from "@/imports/Baker_Editorial_13-1.jpg";
import wedding5 from "@/imports/Baker_Editorial_20-1.jpg";
import { Wordmark } from "../components/wordmark";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import img1 from "figma:asset/9a9e69e074d15f946ec91a7352461b00c7fcb328.png";
import img2 from "figma:asset/0e15055a14db443cd39e3a8c6c91c4c22d032a53.png";
import img3 from "figma:asset/f13061442a9bddc4e03e9456d675072170f43503.png";
import img4 from "figma:asset/5ef67bc06467239ceee48488bbbd2d0704a9bf3a.png";
import snapshot1 from "figma:asset/b965d1822697d2cf93149bb649337ec519c29077.png";
import snapshot2 from "figma:asset/92eab599f9e2c94a509931f4cabd4b0a34ae6cf5.png";
import snapshot3 from "figma:asset/98aea84634895b3e9231563ef4a8234ddf16593e.png";

const defaultCreations = [
  {
    id: 1,
    title: "Skincare Essentials",
    image: img1,
    category: "Beauty",
    description: "A serene promotional shot showcasing natural skincare products in warm, inviting lighting that emphasizes wellness and self-care.",
    date: "February 15, 2026",
    prompt: "Natural beauty product photography, warm lighting, cozy home setting, authentic lifestyle"
  },
  {
    id: 2,
    title: "Avant-Garde Fashion",
    image: img2,
    category: "Fashion",
    description: "Bold, futuristic fashion editorial featuring dramatic silhouettes and architectural design in an industrial setting.",
    date: "February 12, 2026",
    prompt: "High fashion editorial, avant-garde clothing, industrial warehouse, dramatic lighting, luxury aesthetics"
  },
  {
    id: 3,
    title: "Artisan Beverage",
    image: img3,
    category: "Food & Drink",
    description: "Artisanal beverage photography capturing the essence of craft drinks in a bright, natural kitchen environment.",
    date: "February 10, 2026",
    prompt: "Artisan beverage product shot, natural kitchen lighting, breakfast setting, healthy lifestyle"
  },
  {
    id: 4,
    title: "Post-Gym Vibes",
    image: img4,
    category: "Fitness",
    description: "Energetic fitness content showcasing post-workout wellness and healthy lifestyle in a modern gym environment.",
    date: "February 8, 2026",
    prompt: "Fitness lifestyle, post-workout, modern gym, athletic wear, wellness and health"
  }
];

/** Section header: big expanded title with an optional mono kicker and intro. */
function SectionHeader({
  index,
  title,
  intro,
}: {
  index: string;
  title: React.ReactNode;
  intro?: string;
}) {
  return (
    <div className="mb-10 grid gap-6 md:mb-14 md:grid-cols-12 md:items-end">
      <div className="min-w-0 md:col-span-8">
        <p className="mb-3 text-sm">({index})</p>
        <h2 className="font-wide text-[2rem] uppercase leading-[0.9] sm:text-5xl md:text-6xl lg:text-7xl">{title}</h2>
      </div>
      {intro && <p className="max-w-md text-base leading-relaxed md:col-span-4">{intro}</p>}
    </div>
  );
}

/**
 * Horizontally scrollable, snap-aligned strip. Works with touch swipe,
 * trackpad, shift+wheel and mouse drag; arrows and numbers jump between slides.
 */
function ScrollCarousel({
  count,
  label,
  children,
}: {
  count: number;
  label: string;
  children: React.ReactNode;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: false });

  const slides = () => Array.from(trackRef.current?.children ?? []) as HTMLElement[];

  const scrollToIndex = (i: number) => {
    const track = trackRef.current;
    const slide = slides()[(i + count) % count];
    if (!track || !slide) return;
    track.scrollTo({ left: slide.offsetLeft - track.offsetLeft, behavior: "smooth" });
  };

  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    if (atEnd) return setActiveIndex(count - 1);
    let closest = 0;
    slides().forEach((s, i) => {
      const d = Math.abs(s.offsetLeft - track.offsetLeft - track.scrollLeft);
      const best = Math.abs(slides()[closest].offsetLeft - track.offsetLeft - track.scrollLeft);
      if (d < best) closest = i;
    });
    setActiveIndex(closest);
  };

  // Mouse drag-to-scroll for desktop (touch devices scroll natively).
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !trackRef.current) return;
    drag.current = { active: true, startX: e.clientX, startScroll: trackRef.current.scrollLeft, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const track = trackRef.current;
    if (!drag.current.active || !track) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 5 && !drag.current.moved) {
      drag.current.moved = true;
      track.style.scrollSnapType = "none";
    }
    if (drag.current.moved) track.scrollLeft = drag.current.startScroll - dx;
  };
  const endDrag = () => {
    const track = trackRef.current;
    if (!drag.current.active || !track) return;
    drag.current.active = false;
    if (drag.current.moved) {
      track.style.scrollSnapType = "";
      scrollToIndex(activeIndex);
    }
  };
  // Swallow the click that ends a drag so linked slides don't open.
  const onClickCapture = (e: React.MouseEvent) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  };

  return (
    <div>
      <div
        ref={trackRef}
        onScroll={onScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onClickCapture={onClickCapture}
        onDragStart={(e) => e.preventDefault()}
        className="-mx-5 flex cursor-grab snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-2 select-none [scrollbar-width:none] active:cursor-grabbing sm:-mx-12 sm:scroll-px-12 sm:gap-6 sm:px-12 [&::-webkit-scrollbar]:hidden"
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
        tabIndex={0}
      >
        {children}
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-current pt-4">
        <div className="flex gap-1">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              className={`px-1.5 font-mono text-sm tabular-nums ${i === activeIndex ? "underline underline-offset-4" : "opacity-50 hover:opacity-100"}`}
              aria-label={`Go to ${label} ${i + 1}`}
            >
              {String(i + 1).padStart(2, "0")}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => scrollToIndex(activeIndex - 1)}
            className="border border-current p-2 transition hover:bg-current/10"
            aria-label={`Previous ${label}`}
          >
            <ArrowLeft className="size-5" />
          </button>
          <button
            onClick={() => scrollToIndex(activeIndex + 1)}
            className="border border-current p-2 transition hover:bg-current/10"
            aria-label={`Next ${label}`}
          >
            <ArrowRight className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

const slideClass = "relative aspect-[4/5] w-[78vw] shrink-0 snap-start overflow-hidden sm:w-80 md:w-[24rem]";

function SnapshotsCarousel({ snapshots }: { snapshots: any[] }) {
  if (snapshots.length === 0) return null;

  return (
    <section className="bg-ink px-5 py-20 text-sun sm:px-12 md:py-28">
      <SectionHeader
        index="03"
        title="Snapshots by Bo"
        intro="Candid moments, creative inspiration, and personal photography from my journey."
      />

      <ScrollCarousel count={snapshots.length} label="snapshot">
        {snapshots.map((snap, i) => (
          <figure key={snap.id ?? i} className={slideClass}>
            <img
              src={snap.image}
              alt={snap.caption || "Snapshot"}
              className="size-full object-cover"
              draggable={false}
            />
            {snap.caption && (
              <figcaption className="absolute bottom-0 left-0 bg-sun px-3 py-1.5 text-sm text-ink">
                {snap.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </ScrollCarousel>
    </section>
  );
}

const weddingPhotos = [
  { src: wedding1, caption: "Baker Editorial" },
  { src: wedding2, caption: "Baker Editorial" },
  { src: wedding3, caption: "Baker Editorial" },
  { src: wedding4, caption: "Baker Editorial" },
  { src: wedding5, caption: "Baker Editorial" },
];

const ADOBE_WEDDING_URL = "https://adobe.ly/4hyhss4";
const DJ_URL = "https://jonnyverse.vercel.app/";

function DestinationWeddingCarousel() {
  return (
    <section className="border-t border-ink px-5 py-20 sm:px-12 md:py-28">
      <SectionHeader
        index="01"
        title={<>Destination Weddings+<wbr />Events</>}
        intro="A curated collection of intimate ceremonies in breathtaking locations. Click any image to explore the full album."
      />

      <ScrollCarousel count={weddingPhotos.length} label="photo">
        {weddingPhotos.map((photo, i) => (
          <a
            key={i}
            href={ADOBE_WEDDING_URL}
            target="_blank"
            rel="noopener noreferrer"
            draggable={false}
            className={`group ${slideClass}`}
          >
            <ImageWithFallback
              src={photo.src}
              alt={photo.caption}
              draggable={false}
              className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <span className="absolute bottom-0 left-0 inline-flex items-center gap-1 bg-ink px-3 py-1.5 text-sm text-sun">
              {photo.caption} <ArrowUpRight className="size-4" />
            </span>
          </a>
        ))}
      </ScrollCarousel>

      <div className="mt-10">
        <a
          href={ADOBE_WEDDING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="label-caps inline-flex items-center gap-2 bg-ink px-6 py-4 text-sun transition hover:bg-charcoal"
        >
          View Full Wedding Album
          <ArrowUpRight className="size-4" />
        </a>
      </div>
    </section>
  );
}

/** Add-on band: book DJ Jonnypurse alongside a wedding or event. */
function DjAddOn() {
  return (
    <a
      href={DJ_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="group block border-t border-ink bg-paper px-5 py-12 transition-colors hover:bg-ink hover:text-sun sm:px-12 md:py-14"
    >
      <div className="grid items-center gap-6 md:grid-cols-12">
        <p className="text-sm md:col-span-1">(02)</p>
        <div className="md:col-span-7">
          <p className="label-caps mb-2 text-sm">Add-on</p>
          <h2 className="font-wide text-3xl uppercase leading-[0.9] sm:text-5xl">Add a DJ to your package</h2>
        </div>
        <div className="flex items-end justify-between gap-6 md:col-span-4">
          <p className="max-w-xs leading-relaxed">
            Keep the dance floor full — pair your photography with a set from DJ Jonnypurse.
          </p>
          <span className="shrink-0 border border-current p-3 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1">
            <ArrowUpRight className="size-6" />
          </span>
        </div>
      </div>
    </a>
  );
}

/** Full-width accordion row in the editorial style. */
function Collapsible({
  index,
  eyebrow,
  title,
  open,
  onToggle,
  children,
}: {
  index: string;
  eyebrow: string;
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-ink">
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="group flex w-full items-center justify-between gap-6 px-5 py-8 text-left sm:px-12"
      >
        <div className="flex items-baseline gap-4 sm:gap-8">
          <span className="font-mono text-sm">({index})</span>
          <div>
            <p className="label-caps mb-1 text-sm">{eyebrow}</p>
            <h2 className="text-3xl uppercase group-hover:underline group-hover:decoration-2 group-hover:underline-offset-4 sm:text-4xl md:text-5xl">
              {title}
            </h2>
          </div>
        </div>
        <span className="shrink-0 border border-ink p-2 transition group-hover:bg-ink group-hover:text-sun">
          {open ? <Minus className="size-5" /> : <Plus className="size-5" />}
        </span>
      </button>
      {open && <div className="border-t border-ink">{children}</div>}
    </div>
  );
}

export function Home() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [creations, setCreations] = useState<any[]>(defaultCreations);
  const [snapshots, setSnapshots] = useState<any[]>([]);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    async function loadPortfolio() {
      try {
        const data = await apiRequest('/portfolio');
        if (data.items && data.items.length > 0) {
          // Combine default items with database items
          setCreations([...defaultCreations, ...data.items]);
        }
      } catch (error) {
        console.error('Failed to load portfolio:', error);
      }
    }

    async function loadSnapshots() {
      try {
        const data = await apiRequest('/snapshots');
        if (data.snapshots && data.snapshots.length > 0) {
          setSnapshots(data.snapshots);
        } else {
          // Default snapshots
          setSnapshots([
            { id: 1, image: snapshot1, caption: "Fashion Editorial" },
            { id: 2, image: snapshot2, caption: "Creative Expression" },
            { id: 3, image: snapshot3, caption: "Lifestyle Moments" },
          ]);
        }
      } catch (error) {
        console.error('Failed to load snapshots:', error);
        // Set default snapshots on error
        setSnapshots([
          { id: 1, image: snapshot1, caption: "Fashion Editorial" },
          { id: 2, image: snapshot2, caption: "Creative Expression" },
          { id: 3, image: snapshot3, caption: "Lifestyle Moments" },
        ]);
      }
    }

    loadPortfolio();
    loadSnapshots();
  }, []);

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    setSubscribing(true);

    try {
      await apiRequest('/newsletter', {
        method: 'POST',
        body: JSON.stringify({ email, name }),
      });
      setSubscribed(true);
      setEmail('');
      setName('');
    } catch (error) {
      console.error('Failed to subscribe:', error);
      alert('Failed to subscribe. Please try again.');
    } finally {
      setSubscribing(false);
    }
  }

  const filteredCreations = selectedCategory === "all"
    ? creations
    : creations.filter(creation => creation.category.toLowerCase().replace(/\s+/g, '') === selectedCategory);

  const [amplifOpen, setAmplifOpen] = useState(false);
  const [ugcOpen, setUgcOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);

  const categories = [
    { value: "all", label: "All" },
    { value: "beauty", label: "Beauty" },
    { value: "fashion", label: "Fashion" },
    { value: "food&drink", label: "Food" },
    { value: "fitness", label: "Fitness" },
  ];

  return (
    <div>
      {/* Hero — giant wordmark over a two-column intro */}
      <header className="px-5 pt-10 pb-20 sm:px-12 sm:pt-16 md:pb-28">
        <h1 className="sr-only">Forth Studios</h1>
        <Wordmark text="FORTH" />

        <div className="mt-10 grid gap-10 sm:mt-14 md:grid-cols-12 md:gap-12">
          <div className="relative aspect-[4/5] overflow-hidden bg-charcoal md:col-span-7">
            <video
              src={heroVideo}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 size-full object-cover"
            />
          </div>

          <div className="flex flex-col md:col-span-5">
            <p className="text-3xl font-extrabold uppercase leading-[1.02] tracking-[-0.05em] font-display sm:text-4xl lg:text-5xl">
              Photography, storytelling &amp; AI content by Bo Moldenhauer
            </p>
            <p className="mt-8 max-w-md text-base leading-relaxed">
              A creative studio where photography, storytelling, and AI-powered content converge. Destination weddings, editorial portraits, and brand visuals — crafted with intention.
            </p>
            <div className="mt-auto flex flex-wrap gap-3 pt-10">
              <a href="#work" className="label-caps bg-ink px-6 py-4 text-sun transition hover:bg-charcoal">
                See the work
              </a>
              <Link to="/book" className="label-caps border border-ink px-6 py-4 transition hover:bg-ink hover:text-sun">
                Book a shoot
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div id="work" className="scroll-mt-24">
        {/* Destination Wedding Section */}
        <DestinationWeddingCarousel />
      </div>

      {/* DJ add-on */}
      <DjAddOn />

      {/* Snapshots by Bo — carousel */}
      <SnapshotsCarousel snapshots={snapshots} />

      {/* Collapsible: amplif.AI */}
      <Collapsible
        index="04"
        eyebrow="AI Portfolio"
        title="amplif.AI by Bo Moldenhauer"
        open={amplifOpen}
        onToggle={() => setAmplifOpen((o) => !o)}
      >
        <div className="grid gap-6 px-5 py-14 sm:px-12 md:grid-cols-12">
          <p className="text-xl leading-relaxed md:col-span-7 md:text-2xl">
            Welcome to my AI content portfolio. I specialize in creating compelling visuals for brands across beauty, fashion, food, and fitness industries using cutting-edge artificial intelligence tools.
          </p>
          <p className="text-base leading-relaxed md:col-span-4 md:col-start-9">
            Each piece demonstrates the powerful synergy between human creativity and AI capabilities, delivering professional-grade content for modern marketing needs.
          </p>
        </div>
      </Collapsible>

      {/* Collapsible: UGC Samples */}
      <Collapsible
        index="05"
        eyebrow="Gallery"
        title="UGC Samples"
        open={ugcOpen}
        onToggle={() => setUgcOpen((o) => !o)}
      >
        <div className="px-5 py-12 sm:px-12 md:py-16">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-10">
            <TabsList className="h-auto flex-wrap justify-start gap-0 rounded-none border border-ink bg-transparent p-0">
              {categories.map((c) => (
                <TabsTrigger
                  key={c.value}
                  value={c.value}
                  className="label-caps h-auto flex-none rounded-none border-0 border-r border-ink px-5 py-3 text-sm last:border-r-0 data-[state=active]:bg-ink data-[state=active]:text-sun data-[state=active]:shadow-none"
                >
                  {c.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredCreations.map((creation) => (
              <GalleryItem key={creation.id} {...creation} />
            ))}
          </div>
          {filteredCreations.length === 0 && (
            <div className="border border-ink py-20 text-center">
              <h3 className="mb-2 text-xl uppercase">No creations found</h3>
              <p>Try selecting a different category</p>
            </div>
          )}
        </div>
      </Collapsible>

      {/* Collapsible: Get Your Free AI Guide */}
      <Collapsible
        index="06"
        eyebrow="Free Resource"
        title="Get Your Free AI Content Guide"
        open={guideOpen}
        onToggle={() => setGuideOpen((o) => !o)}
      >
        <div className="grid gap-10 bg-paper px-5 py-14 sm:px-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <h3 className="font-wide text-3xl uppercase leading-[0.95] sm:text-4xl">10 Best AI Prompts for Product Photography</h3>
            <p className="mt-6 text-base leading-relaxed">
              Download the guide and receive monthly tips, industry insights, and exclusive content creation strategies directly to your inbox.
            </p>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            {subscribed ? (
              <div className="border border-ink bg-sun p-6">
                <p>Thank you for subscribing! Check your email for the free guide.</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="h-12 rounded-none border-ink bg-paper font-mono"
                  />
                  <Input
                    type="email"
                    placeholder="Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 rounded-none border-ink bg-paper font-mono"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={subscribing}
                  className="label-caps h-14 w-full rounded-none"
                >
                  {subscribing ? "Subscribing..." : "Get Free Guide & Subscribe"}
                </Button>
                <p className="text-sm text-charcoal">
                  No spam, unsubscribe anytime. Your email is safe with us.
                </p>
              </form>
            )}
          </div>
        </div>
      </Collapsible>
    </div>
  );
}
