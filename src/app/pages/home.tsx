import { useState, useEffect, useRef } from "react";
import { GalleryItem } from "../components/gallery-item";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Sparkles, ShoppingBag, Shirt, Salad, Dumbbell, Mail, Download, Camera, ChevronLeft, ChevronRight, Heart, ExternalLink, ChevronDown } from "lucide-react";
import { apiRequest } from "../lib/api";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import heroVideo from "@/imports/12987890-hd_1920_1080_30fps.mp4";
import wedding1 from "@/imports/Baker_Editorial_02.jpg";
import wedding2 from "@/imports/Baker_Editorial_05-1.jpg";
import wedding3 from "@/imports/Baker_Editorial_07-1.jpg";
import wedding4 from "@/imports/Baker_Editorial_13-1.jpg";
import wedding5 from "@/imports/Baker_Editorial_20-1.jpg";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
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

function SnapshotsCarousel({ snapshots }: { snapshots: any[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);

  const count = snapshots.length;
  const prev = () => setActiveIndex((i) => (i - 1 + count) % count);
  const next = () => setActiveIndex((i) => (i + 1) % count);

  const onMouseDown = (e: React.MouseEvent) => { setIsDragging(false); dragStartX.current = e.clientX; };
  const onMouseUp = (e: React.MouseEvent) => {
    const delta = e.clientX - dragStartX.current;
    if (Math.abs(delta) > 40) { setIsDragging(true); delta < 0 ? next() : prev(); }
  };
  const onTouchStart = (e: React.TouchEvent) => { dragStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    const delta = e.changedTouches[0].clientX - dragStartX.current;
    if (Math.abs(delta) > 40) delta < 0 ? next() : prev();
  };

  if (count === 0) return null;

  const visibleIndices = [
    (activeIndex - 1 + count) % count,
    activeIndex,
    (activeIndex + 1) % count,
  ];

  return (
    <section className="border-t border-neutral-800 bg-neutral-950 px-4 sm:px-6 py-16 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-800/50 px-4 py-2">
            <Camera className="size-4 text-purple-400" />
            <span className="text-sm text-neutral-300">Behind the Scenes</span>
          </div>
          <h2 className="mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-4xl sm:text-5xl text-transparent">
            Snapshots by Bo
          </h2>
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-neutral-400">
            Candid moments, creative inspiration, and personal photography from my journey.
          </p>
        </div>

        <div
          className="relative select-none"
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="flex items-center justify-center gap-3 sm:gap-5 overflow-hidden py-4">
            {visibleIndices.map((photoIdx, position) => {
              const isCenter = position === 1;
              const snap = snapshots[photoIdx];
              return (
                <div
                  key={`${photoIdx}-${position}`}
                  className={`relative flex-shrink-0 overflow-hidden rounded-xl transition-all duration-500 ${
                    isCenter
                      ? "w-64 h-80 sm:w-80 sm:h-96 md:w-96 md:h-[28rem] opacity-100 scale-100 ring-2 ring-purple-400/30 shadow-2xl shadow-purple-900/20 z-10"
                      : "w-48 h-64 sm:w-56 sm:h-72 md:w-64 md:h-80 opacity-40 scale-95"
                  }`}
                >
                  <img
                    src={snap.image}
                    alt={snap.caption || "Snapshot"}
                    className="size-full object-cover"
                    draggable={false}
                  />
                  {isCenter && snap.caption && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <p className="text-sm font-medium text-white">{snap.caption}</p>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full border border-neutral-700 bg-neutral-900/80 p-2 text-neutral-300 backdrop-blur-sm transition hover:bg-neutral-800 hover:text-white"
            aria-label="Previous snapshot"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full border border-neutral-700 bg-neutral-900/80 p-2 text-neutral-300 backdrop-blur-sm transition hover:bg-neutral-800 hover:text-white"
            aria-label="Next snapshot"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>

        <div className="mt-8 flex justify-center gap-2">
          {snapshots.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIndex ? "w-6 bg-purple-400" : "w-1.5 bg-neutral-600 hover:bg-neutral-400"
              }`}
              aria-label={`Go to snapshot ${i + 1}`}
            />
          ))}
        </div>
      </div>
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

const ADOBE_WEDDING_URL = "https://adobe.ly/4AOAaVe";

function DestinationWeddingCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);

  const prev = () => setActiveIndex((i) => (i - 1 + weddingPhotos.length) % weddingPhotos.length);
  const next = () => setActiveIndex((i) => (i + 1) % weddingPhotos.length);

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(false);
    dragStartX.current = e.clientX;
  };
  const onMouseUp = (e: React.MouseEvent) => {
    const delta = e.clientX - dragStartX.current;
    if (Math.abs(delta) > 40) {
      setIsDragging(true);
      delta < 0 ? next() : prev();
    }
  };
  const onTouchStart = (e: React.TouchEvent) => {
    dragStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const delta = e.changedTouches[0].clientX - dragStartX.current;
    if (Math.abs(delta) > 40) delta < 0 ? next() : prev();
  };

  const visibleIndices = [
    (activeIndex - 1 + weddingPhotos.length) % weddingPhotos.length,
    activeIndex,
    (activeIndex + 1) % weddingPhotos.length,
  ];

  return (
    <section className="border-t border-neutral-800 bg-gradient-to-b from-neutral-950 to-neutral-900 px-4 sm:px-6 py-16 md:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-rose-800/60 bg-rose-900/20 px-4 py-2">
            <Heart className="size-4 text-rose-400" />
            <span className="text-sm text-rose-300">Photography Collection</span>
          </div>
          <h2 className="mb-4 bg-gradient-to-r from-rose-300 via-pink-300 to-amber-200 bg-clip-text text-4xl sm:text-5xl text-transparent font-light tracking-wide">
            Destination Wedding
          </h2>
          <p className="mx-auto max-w-xl text-base text-neutral-400">
            A curated collection of intimate ceremonies in breathtaking locations. Click any image to explore the full album.
          </p>
        </div>

        {/* Carousel */}
        <div
          className="relative select-none"
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="flex items-center justify-center gap-3 sm:gap-5 overflow-hidden py-4">
            {visibleIndices.map((photoIdx, position) => {
              const isCenter = position === 1;
              const photo = weddingPhotos[photoIdx];
              return (
                <a
                  key={`${photoIdx}-${position}`}
                  href={ADOBE_WEDDING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => isDragging && e.preventDefault()}
                  className={`relative flex-shrink-0 overflow-hidden rounded-xl cursor-pointer transition-all duration-500 ${
                    isCenter
                      ? "w-64 h-80 sm:w-80 sm:h-96 md:w-96 md:h-[28rem] opacity-100 scale-100 ring-2 ring-rose-400/40 shadow-2xl shadow-rose-900/20 z-10"
                      : "w-48 h-64 sm:w-56 sm:h-72 md:w-64 md:h-80 opacity-50 scale-95 hover:opacity-70"
                  }`}
                >
                  <ImageWithFallback
                    src={photo.src}
                    alt={photo.caption}
                    className="size-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  {isCenter && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <p className="text-sm font-medium text-white">{photo.caption}</p>
                        <span className="mt-1 inline-flex items-center gap-1 text-xs text-rose-300">
                          <ExternalLink className="size-3" /> View Full Album
                        </span>
                      </div>
                    </>
                  )}
                </a>
              );
            })}
          </div>

          {/* Nav buttons */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full border border-neutral-700 bg-neutral-900/80 p-2 text-neutral-300 backdrop-blur-sm transition hover:bg-neutral-800 hover:text-white"
            aria-label="Previous photo"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full border border-neutral-700 bg-neutral-900/80 p-2 text-neutral-300 backdrop-blur-sm transition hover:bg-neutral-800 hover:text-white"
            aria-label="Next photo"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>

        {/* Dot indicators */}
        <div className="mt-8 flex justify-center gap-2">
          {weddingPhotos.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIndex ? "w-6 bg-rose-400" : "w-1.5 bg-neutral-600 hover:bg-neutral-400"
              }`}
              aria-label={`Go to photo ${i + 1}`}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <a
            href={ADOBE_WEDDING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-rose-700/50 bg-rose-900/20 px-6 py-3 text-sm text-rose-300 transition hover:bg-rose-900/40 hover:text-rose-200"
          >
            <Heart className="size-4" />
            View Full Wedding Album
            <ExternalLink className="size-4" />
          </a>
        </div>
      </div>
    </section>
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

  return (
    <div>
      {/* Hero Section — video background */}
      <header className="relative h-screen min-h-[560px] overflow-hidden border-b border-neutral-800">
        {/* Background video */}
        <video
          src={heroVideo}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 size-full object-cover"
        />
        {/* Scrim */}
        <div className="absolute inset-0 bg-gradient-to-tl from-black/80 via-black/30 to-transparent" />

        {/* Text — bottom-right */}
        <div className="absolute bottom-10 right-6 max-w-sm text-right sm:bottom-14 sm:right-12 md:max-w-md lg:max-w-lg lg:right-16 lg:bottom-16">
          <h1 className="mb-2 text-5xl font-light tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
            Forth Studios
          </h1>
          <p className="mb-4 text-base font-light tracking-widest text-white/70 sm:text-lg">
            by Bo Moldenhauer
          </p>
          <p className="text-sm leading-relaxed text-white/50 sm:text-base">
            A creative studio where photography, storytelling, and AI-powered content converge. Destination weddings, editorial portraits, and brand visuals — crafted with intention.
          </p>
        </div>
      </header>

      {/* Destination Wedding Section */}
      <DestinationWeddingCarousel />

      {/* Snapshots by Bo — carousel */}
      <SnapshotsCarousel snapshots={snapshots} />

      {/* Collapsible: amplif.AI */}
      <div className="border-t border-neutral-800">
        <button
          onClick={() => setAmplifOpen((o) => !o)}
          className="flex w-full items-center justify-between px-6 py-6 text-left transition hover:bg-neutral-900/50"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-full border border-neutral-700 bg-neutral-800/50 p-2">
              <Sparkles className="size-4 text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-widest mb-0.5">AI Portfolio</p>
              <h2 className="text-xl font-medium text-white">amplif.AI by Bo Moldenhauer</h2>
            </div>
          </div>
          <ChevronDown
            className={`size-5 text-neutral-400 transition-transform duration-300 ${amplifOpen ? "rotate-180" : ""}`}
          />
        </button>
        {amplifOpen && (
          <div className="border-t border-neutral-800 bg-gradient-to-b from-neutral-900 to-black px-6 py-16">
            <div className="mx-auto max-w-3xl text-center">
              <p className="mb-4 text-lg text-neutral-400 md:text-xl">
                Welcome to my AI content portfolio. I specialize in creating compelling visuals for brands across beauty, fashion, food, and fitness industries using cutting-edge artificial intelligence tools.
              </p>
              <p className="text-base text-neutral-500">
                Each piece demonstrates the powerful synergy between human creativity and AI capabilities, delivering professional-grade content for modern marketing needs.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Collapsible: UGC Samples */}
      <div className="border-t border-neutral-800">
        <button
          onClick={() => setUgcOpen((o) => !o)}
          className="flex w-full items-center justify-between px-6 py-6 text-left transition hover:bg-neutral-900/50"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-full border border-neutral-700 bg-neutral-800/50 p-2">
              <ShoppingBag className="size-4 text-pink-400" />
            </div>
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-widest mb-0.5">Gallery</p>
              <h2 className="text-xl font-medium text-white">UGC Samples</h2>
            </div>
          </div>
          <ChevronDown
            className={`size-5 text-neutral-400 transition-transform duration-300 ${ugcOpen ? "rotate-180" : ""}`}
          />
        </button>
        {ugcOpen && (
          <div className="border-t border-neutral-800">
            <main className="mx-auto max-w-7xl px-4 sm:px-6 py-12 md:py-20">
              <div className="mb-12 flex justify-center">
                <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full max-w-3xl">
                  <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 bg-neutral-900 gap-1">
                    <TabsTrigger value="all" className="data-[state=active]:bg-neutral-800 text-xs sm:text-sm">
                      <Sparkles className="mr-1 sm:mr-2 size-3 sm:size-4" />All
                    </TabsTrigger>
                    <TabsTrigger value="beauty" className="data-[state=active]:bg-neutral-800 text-xs sm:text-sm">
                      <ShoppingBag className="mr-1 sm:mr-2 size-3 sm:size-4" />Beauty
                    </TabsTrigger>
                    <TabsTrigger value="fashion" className="data-[state=active]:bg-neutral-800 text-xs sm:text-sm">
                      <Shirt className="mr-1 sm:mr-2 size-3 sm:size-4" />Fashion
                    </TabsTrigger>
                    <TabsTrigger value="food&drink" className="data-[state=active]:bg-neutral-800 text-xs sm:text-sm">
                      <Salad className="mr-1 sm:mr-2 size-3 sm:size-4" />Food
                    </TabsTrigger>
                    <TabsTrigger value="fitness" className="data-[state=active]:bg-neutral-800 text-xs sm:text-sm">
                      <Dumbbell className="mr-1 sm:mr-2 size-3 sm:size-4" />Fitness
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredCreations.map((creation) => (
                  <GalleryItem key={creation.id} {...creation} />
                ))}
              </div>
              {filteredCreations.length === 0 && (
                <div className="py-20 text-center">
                  <Sparkles className="mx-auto mb-4 size-12 text-neutral-600" />
                  <h3 className="mb-2 text-xl text-neutral-400">No creations found</h3>
                  <p className="text-neutral-500">Try selecting a different category</p>
                </div>
              )}
            </main>
          </div>
        )}
      </div>

      {/* Collapsible: Get Your Free AI Guide */}
      <div className="border-t border-neutral-800">
        <button
          onClick={() => setGuideOpen((o) => !o)}
          className="flex w-full items-center justify-between px-6 py-6 text-left transition hover:bg-neutral-900/50"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-full border border-neutral-700 bg-neutral-800/50 p-2">
              <Download className="size-4 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-widest mb-0.5">Free Resource</p>
              <h2 className="text-xl font-medium text-white">Get Your Free AI Content Guide</h2>
            </div>
          </div>
          <ChevronDown
            className={`size-5 text-neutral-400 transition-transform duration-300 ${guideOpen ? "rotate-180" : ""}`}
          />
        </button>
        {guideOpen && (
          <div className="border-t border-neutral-800 px-6 py-16">
            <div className="mx-auto max-w-4xl">
              <Card className="border-neutral-800 bg-gradient-to-br from-purple-900/20 to-blue-900/20">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 w-fit rounded-full bg-purple-500/10 p-4">
                    <Download className="size-8 text-purple-400" />
                  </div>
                  <CardTitle className="text-3xl text-white">Get Your Free AI Content Guide</CardTitle>
                  <CardDescription className="text-lg">
                    Download "10 Best AI Prompts for Product Photography" and receive monthly tips,
                    industry insights, and exclusive content creation strategies directly to your inbox.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {subscribed ? (
                    <div className="rounded-lg bg-green-950/50 border border-green-900 p-6 text-center">
                      <p className="text-green-400">
                        Thank you for subscribing! Check your email for the free guide.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubscribe} className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <Input
                          type="text"
                          placeholder="Your Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          className="bg-neutral-800 border-neutral-700 text-white"
                        />
                        <Input
                          type="email"
                          placeholder="Your Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="bg-neutral-800 border-neutral-700 text-white"
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={subscribing}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                      >
                        {subscribing ? "Subscribing..." : "Get Free Guide & Subscribe"}
                      </Button>
                      <p className="text-center text-xs text-neutral-500">
                        No spam, unsubscribe anytime. Your email is safe with us.
                      </p>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}