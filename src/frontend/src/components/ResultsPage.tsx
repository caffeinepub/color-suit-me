import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { ColorItem } from "../data/colors";
import { useActor } from "../hooks/useActor";
import {
  computeSeason,
  generateCombos,
  shouldUseWhiteText,
} from "../utils/colorUtils";

interface ResultsPageProps {
  likedColors: ColorItem[];
  sessionId: string;
  onTryMore: () => void;
}

const SEASON_DESCRIPTIONS: Record<
  string,
  { emoji: string; description: string; tip: string }
> = {
  Spring: {
    emoji: "🌸",
    description: "Warm & bright",
    tip: "You glow in warm, clear, and bright colors. Try peach, coral, golden yellow, and warm greens.",
  },
  Summer: {
    emoji: "🌊",
    description: "Cool & soft",
    tip: "Muted, cool tones work beautifully for you. Try powder blue, dusty rose, lavender, and soft grays.",
  },
  Autumn: {
    emoji: "🍂",
    description: "Warm & muted",
    tip: "You shine in earthy, rich tones. Try terracotta, burnt orange, warm caramel, and forest green.",
  },
  Winter: {
    emoji: "❄️",
    description: "Cool & bold",
    tip: "Bold, high-contrast colors suit you best. Try sapphire, crimson, deep purple, and pure white.",
  },
};

export default function ResultsPage({
  likedColors,
  sessionId,
  onTryMore,
}: ResultsPageProps) {
  const { actor } = useActor();
  const [saving, setSaving] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const displayColors = likedColors.slice(0, 8);
  const season = computeSeason(likedColors);
  const combos = generateCombos(likedColors);
  const seasonInfo = SEASON_DESCRIPTIONS[season];

  useEffect(() => {
    if (!actor) return;
    // Save season to backend
    (async () => {
      try {
        await actor.setSeason(sessionId, season);
      } catch {
        // silent
      }
    })();
  }, [actor, sessionId, season]);

  const savePalette = () => {
    setSaving(true);

    const canvas = document.createElement("canvas");
    const cols = 4;
    const rows = Math.ceil(displayColors.length / cols);
    const swatchW = 180;
    const swatchH = 220;
    const padding = 24;
    const titleHeight = 100;

    canvas.width = cols * swatchW + padding * 2;
    canvas.height = titleHeight + rows * swatchH + padding * 2;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setSaving(false);
      return;
    }

    // Background
    ctx.fillStyle = "#F6F1EA";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Title
    ctx.fillStyle = "#111111";
    ctx.font = "bold 28px Georgia, serif";
    ctx.textAlign = "center";
    ctx.fillText("My Color Palette", canvas.width / 2, 48);
    ctx.font = "16px Arial, sans-serif";
    ctx.fillStyle = "#555555";
    ctx.fillText(`${season} Season · Color Suit Me`, canvas.width / 2, 76);

    // Color swatches
    displayColors.forEach((color, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = padding + col * swatchW;
      const y = titleHeight + padding + row * swatchH;

      // Rounded rect swatch
      const radius = 16;
      ctx.beginPath();
      ctx.roundRect(x + 8, y, swatchW - 16, swatchH - 50, radius);
      ctx.fillStyle = color.hex;
      ctx.fill();

      // Shadow
      ctx.shadowColor = "rgba(0,0,0,0.1)";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 4;
      ctx.fill();
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      // Name
      ctx.fillStyle = "#111111";
      ctx.font = "bold 13px Arial, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(color.name, x + 14, y + swatchH - 34);

      // Hex
      ctx.fillStyle = "#888888";
      ctx.font = "11px monospace";
      ctx.fillText(color.hex, x + 14, y + swatchH - 16);
    });

    // Download
    const link = document.createElement("a");
    link.download = "my-color-palette.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-[#F6F1EA] pb-20">
      <canvas ref={canvasRef} className="hidden" />

      {/* Header */}
      <div className="bg-[#EFE4DA] border-b border-[#E8D8CA] px-4 py-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C67C5B]" />
            <span className="font-display font-semibold text-[#111111]">
              Color Suit Me
            </span>
          </div>
          <Button
            onClick={onTryMore}
            variant="outline"
            size="sm"
            className="rounded-full border-[#C67C5B] text-[#C67C5B] hover:bg-[#E7B6B8]/20 text-xs"
            data-ocid="results.try_more.button"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Try More
          </Button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-10">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="font-display text-4xl sm:text-5xl text-[#111111] mb-3">
            Your Best Colors
          </h1>
          <p className="text-[#555555] text-base">
            Based on your choices, here's your personal color palette
          </p>
        </motion.div>

        {/* Season badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-[#EFE4DA] rounded-2xl p-6 mb-8 text-center"
          data-ocid="results.season.card"
        >
          <div className="text-4xl mb-2">{seasonInfo.emoji}</div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Badge className="bg-[#E7B6B8] text-[#3D1515] text-sm px-4 py-1 rounded-full font-medium">
              {season} Season
            </Badge>
            <span className="text-[#888888] text-sm">
              {seasonInfo.description}
            </span>
          </div>
          <p className="text-sm text-[#555555] leading-relaxed mt-3">
            {seasonInfo.tip}
          </p>
        </motion.div>

        {/* Color grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="font-display text-xl text-[#111111] mb-4">
            Your Liked Colors
          </h2>

          {displayColors.length === 0 ? (
            <div
              className="text-center py-12 text-[#888888]"
              data-ocid="results.colors.empty_state"
            >
              No liked colors yet. Try more colors!
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {displayColors.map((color, i) => (
                <motion.div
                  key={color.hex}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  className="rounded-2xl overflow-hidden shadow-sm bg-white"
                  data-ocid={`results.color.item.${i + 1}`}
                >
                  <div
                    className="aspect-square"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="p-2.5">
                    <p className="font-medium text-xs text-[#111111] leading-tight">
                      {color.name}
                    </p>
                    <p className="font-mono text-[10px] text-[#888888] mt-0.5">
                      {color.hex}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Wear It Together */}
        {combos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-8"
          >
            <h2 className="font-display text-xl text-[#111111] mb-4">
              Wear It Together
            </h2>
            <div className="space-y-3">
              {combos.map((combo, comboIdx) => (
                <div
                  key={combo.map((c) => c.hex).join("-")}
                  className="flex items-center gap-3 bg-[#EFE4DA] rounded-2xl p-4"
                  data-ocid={`results.combo.item.${comboIdx + 1}`}
                >
                  {combo.map((c) => {
                    const isWhite = shouldUseWhiteText(c.hex);
                    return (
                      <div
                        key={c.hex}
                        className="flex-1 rounded-xl p-3 flex flex-col gap-0.5"
                        style={{ backgroundColor: c.hex }}
                      >
                        <span
                          className="text-xs font-medium"
                          style={{ color: isWhite ? "#fff" : "#111" }}
                        >
                          {c.name}
                        </span>
                        <span
                          className="text-[10px] font-mono"
                          style={{
                            color: isWhite
                              ? "rgba(255,255,255,0.7)"
                              : "rgba(0,0,0,0.5)",
                          }}
                        >
                          {c.hex}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Tip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-[#EFE4DA] rounded-2xl p-5 mb-8 text-sm text-[#555555] leading-relaxed"
        >
          💡 <strong className="text-[#111111]">Style tip:</strong> Wear these
          colors in shirts, dresses, or jackets for a fresh, natural look that
          complements your skin tone.
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Button
            onClick={savePalette}
            disabled={saving || displayColors.length === 0}
            className="flex-1 rounded-full bg-[#1F1F1F] text-white h-12 font-medium hover:bg-[#333]"
            data-ocid="results.save_palette.button"
          >
            <Download className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save My Palette"}
          </Button>

          <Button
            onClick={onTryMore}
            variant="outline"
            className="flex-1 rounded-full border-[#C67C5B] text-[#C67C5B] h-12 font-medium hover:bg-[#E7B6B8]/20"
            data-ocid="results.try_more_colors.button"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try More Colors
          </Button>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="text-center mt-16 pb-4">
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
    </div>
  );
}
