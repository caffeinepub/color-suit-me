import { Button } from "@/components/ui/button";
import { ArrowRight, Hand, Heart, Palette, Sparkles } from "lucide-react";
import { motion } from "motion/react";

interface LandingPageProps {
  onStart: () => void;
}

const SAMPLE_SWATCHES = [
  { name: "Peach Blush", hex: "#FADADD" },
  { name: "Lavender", hex: "#C4B5D8" },
  { name: "Terracotta", hex: "#C67C5B" },
  { name: "Soft Blue", hex: "#A8C8E8" },
  { name: "Golden Yellow", hex: "#F5D06A" },
  { name: "Jade Green", hex: "#7FBFAD" },
  { name: "Dusty Mauve", hex: "#C4A0B0" },
  { name: "Warm Caramel", hex: "#C9956A" },
];

const STEPS = [
  {
    icon: Palette,
    title: "See a Color",
    description:
      "A beautiful full-screen color fills your entire screen — one at a time.",
    number: "01",
  },
  {
    icon: Hand,
    title: "Hold Your Hand Close",
    description:
      "Bring your hand or face near the screen. See how the color reflects on your skin.",
    number: "02",
  },
  {
    icon: Heart,
    title: "Swipe to Decide",
    description:
      "Swipe up if it suits you, down if it doesn't. We'll learn your perfect palette.",
    number: "03",
  },
];

export default function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-[#F6F1EA]">
      {/* Nav */}
      <header className="sticky top-0 z-50 bg-[#F6F1EA]/90 backdrop-blur-sm border-b border-[#E8D8CA]">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#E7B6B8] flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-[#5C2B2B]" />
            </div>
            <span className="font-display text-lg font-semibold text-[#111111] tracking-tight">
              Color Suit Me
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-6">
            <a
              href="#how-it-works"
              className="text-sm text-[#555555] hover:text-[#111111] transition-colors"
              data-ocid="nav.how_it_works.link"
            >
              How It Works
            </a>
            <a
              href="#palette-preview"
              className="text-sm text-[#555555] hover:text-[#111111] transition-colors"
              data-ocid="nav.features.link"
            >
              Features
            </a>
          </div>

          <Button
            onClick={onStart}
            className="rounded-full bg-[#1F1F1F] text-white text-sm px-5 h-9 hover:bg-[#333333] transition-colors"
            data-ocid="nav.get_started.button"
          >
            Get Started
          </Button>
        </nav>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 bg-[#EFE4DA] rounded-full px-4 py-1.5 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-[#C67C5B]" />
              <span className="text-xs text-[#555555] font-medium tracking-wide">
                Discover Your Color Season
              </span>
            </div>

            <h1 className="font-display text-5xl sm:text-6xl leading-[1.1] tracking-tight text-[#111111] mb-6">
              Discover Colors
              <br />
              <em className="font-display italic text-[#C67C5B] not-italic">
                That Suit You
              </em>
            </h1>

            <p className="text-[#555555] text-lg leading-relaxed mb-10 max-w-md">
              Hold your hand or face to the screen and find the shades that make
              you glow. Your personal color palette, discovered in minutes.
            </p>

            <Button
              onClick={onStart}
              className="group rounded-full bg-[#E7B6B8] hover:bg-[#D9A4A6] text-[#3D1515] text-base px-8 h-14 font-medium transition-all duration-300 shadow-sm hover:shadow-md"
              data-ocid="hero.check_colors.primary_button"
            >
              Check What Color Suits You
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>

            <p className="mt-4 text-sm text-[#888888]">
              Tap to see how different colors look on your skin tone.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="relative hidden md:block"
          >
            <div className="relative rounded-3xl overflow-hidden aspect-[5/6]">
              <img
                src="/assets/generated/hero-color-matching.dim_600x700.jpg"
                alt="Person holding color swatches near their face"
                className="w-full h-full object-cover"
              />
              {/* Floating swatches */}
              <div className="absolute top-6 right-6 grid grid-cols-2 gap-2">
                {SAMPLE_SWATCHES.slice(0, 4).map((s) => (
                  <div
                    key={s.hex}
                    className="w-10 h-10 rounded-xl shadow-sm"
                    style={{ backgroundColor: s.hex }}
                    title={s.name}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-[#EFE4DA] py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="font-display text-4xl sm:text-5xl text-[#111111] mb-4">
              How It Works
            </h2>
            <p className="text-[#555555] text-lg max-w-md mx-auto">
              Three simple steps to your perfect color palette
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="bg-[#F6F1EA] rounded-2xl p-8 relative"
              >
                <span className="absolute top-6 right-6 font-display text-4xl font-bold text-[#E8D8CA] select-none">
                  {step.number}
                </span>
                <div className="w-12 h-12 rounded-xl bg-[#E7B6B8]/40 flex items-center justify-center mb-5">
                  <step.icon className="w-6 h-6 text-[#C67C5B]" />
                </div>
                <h3 className="font-display text-xl font-semibold text-[#111111] mb-3">
                  {step.title}
                </h3>
                <p className="text-[#555555] text-sm leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Color Palette Preview */}
      <section id="palette-preview" className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-4xl sm:text-5xl text-[#111111] mb-4">
              Your Color Palette
            </h2>
            <p className="text-[#555555] text-lg max-w-md mx-auto">
              Explore 50+ carefully curated shades across warm, cool, neutral,
              and fashion tones.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="grid grid-cols-4 sm:grid-cols-8 gap-3"
          >
            {SAMPLE_SWATCHES.map((swatch, i) => (
              <motion.div
                key={swatch.hex}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group relative"
              >
                <div
                  className="aspect-square rounded-2xl shadow-sm group-hover:scale-105 transition-transform duration-200 cursor-pointer"
                  style={{ backgroundColor: swatch.hex }}
                />
                <p className="mt-2 text-xs text-center text-[#888888] truncate">
                  {swatch.name}
                </p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-12"
          >
            <Button
              onClick={onStart}
              className="rounded-full bg-[#E7B6B8] hover:bg-[#D9A4A6] text-[#3D1515] text-base px-8 h-12 font-medium"
              data-ocid="palette_preview.start.button"
            >
              Find My Colors
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#EFE4DA] border-t border-[#E8D8CA] py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-5 h-5 rounded-full bg-[#E7B6B8] flex items-center justify-center">
              <Sparkles className="w-2.5 h-2.5 text-[#5C2B2B]" />
            </div>
            <span className="font-display font-semibold text-[#111111]">
              Color Suit Me
            </span>
          </div>
          <p className="text-xs text-[#888888] mb-3">
            Discover your perfect color palette for clothing, accessories, and
            more.
          </p>
          <p className="text-xs text-[#AAAAAA]">
            © {new Date().getFullYear()}.{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#888888] transition-colors"
            >
              Built with ♥ using caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
