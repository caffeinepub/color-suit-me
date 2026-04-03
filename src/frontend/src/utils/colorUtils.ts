import type { ColorFamily, ColorItem } from "../data/colors";
import { ALL_COLORS } from "../data/colors";

/**
 * Calculate relative luminance from a hex color
 */
export function getLuminance(hex: string): number {
  const r = Number.parseInt(hex.slice(1, 3), 16) / 255;
  const g = Number.parseInt(hex.slice(3, 5), 16) / 255;
  const b = Number.parseInt(hex.slice(5, 7), 16) / 255;

  const toLinear = (c: number) =>
    c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;

  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/**
 * Returns true if text on this color background should be white (dark bg)
 */
export function shouldUseWhiteText(hex: string): boolean {
  return getLuminance(hex) < 0.4;
}

/**
 * Shuffle an array (Fisher-Yates)
 */
export function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Build a biased color queue.
 * After 5 votes, show 60% from top family, 40% random.
 */
export function buildColorQueue(
  familyVotes: Record<ColorFamily, { likes: number; total: number }>,
  seen: Set<string>,
  biasFamily: ColorFamily | null,
): ColorItem[] {
  const unseen = ALL_COLORS.filter((c) => !seen.has(c.hex));

  if (!biasFamily || Object.values(familyVotes).every((v) => v.total === 0)) {
    return shuffleArray(unseen);
  }

  const biased = unseen.filter((c) => c.family === biasFamily);
  const rest = unseen.filter((c) => c.family !== biasFamily);

  const biasCount = Math.ceil(unseen.length * 0.6);
  const restCount = unseen.length - biasCount;

  const biasedPick = shuffleArray(biased).slice(0, biasCount);
  const restPick = shuffleArray(rest).slice(0, restCount);

  return shuffleArray([...biasedPick, ...restPick]);
}

/**
 * Get the dominant liked family from vote stats
 */
export function getDominantFamily(
  familyVotes: Record<ColorFamily, { likes: number; total: number }>,
): ColorFamily | null {
  const families: ColorFamily[] = ["warm", "cool", "neutral", "fashion"];
  let best: ColorFamily | null = null;
  let bestRate = -1;

  for (const f of families) {
    const { likes, total } = familyVotes[f];
    if (total === 0) continue;
    const rate = likes / total;
    if (rate > bestRate) {
      bestRate = rate;
      best = f;
    }
  }

  return best;
}

/**
 * Compute season type from liked colors.
 * warm dominant => Autumn/Spring
 * cool dominant => Winter/Summer
 */
export function computeSeason(
  likedColors: ColorItem[],
): "Spring" | "Summer" | "Autumn" | "Winter" {
  const counts: Record<ColorFamily, number> = {
    warm: 0,
    cool: 0,
    neutral: 0,
    fashion: 0,
  };
  for (const c of likedColors) {
    counts[c.family]++;
  }

  const warmTotal = counts.warm + counts.neutral * 0.5;
  const coolTotal = counts.cool + counts.neutral * 0.5;

  if (warmTotal >= coolTotal) {
    // Check brightness: lighter => Spring, darker => Autumn
    const avgLum =
      likedColors
        .filter((c) => c.family === "warm")
        .reduce((acc, c) => acc + getLuminance(c.hex), 0) /
      Math.max(1, counts.warm);
    return avgLum > 0.3 ? "Spring" : "Autumn";
  }
  // Check brightness: lighter => Summer, darker => Winter
  const avgLum =
    likedColors
      .filter((c) => c.family === "cool")
      .reduce((acc, c) => acc + getLuminance(c.hex), 0) /
    Math.max(1, counts.cool);
  return avgLum > 0.3 ? "Summer" : "Winter";
}

/**
 * Generate 2-3 color combo pairs from liked colors
 */
export function generateCombos(likedColors: ColorItem[]): ColorItem[][] {
  if (likedColors.length < 2) return [];

  const combos: ColorItem[][] = [];

  // Try to pick pairs from different families
  const byFamily: Partial<Record<ColorFamily, ColorItem[]>> = {};
  for (const c of likedColors) {
    if (!byFamily[c.family]) byFamily[c.family] = [];
    byFamily[c.family]!.push(c);
  }

  const families = Object.keys(byFamily) as ColorFamily[];

  if (families.length >= 2) {
    for (let i = 0; i < Math.min(3, families.length - 1); i++) {
      const a = byFamily[families[i]]![0];
      const b = byFamily[families[i + 1]]![0];
      if (a && b) combos.push([a, b]);
    }
  }

  // Fallback: just pick sequential pairs
  if (combos.length === 0) {
    for (let i = 0; i < Math.min(3, likedColors.length - 1); i++) {
      combos.push([likedColors[i], likedColors[i + 1]]);
    }
  }

  return combos.slice(0, 3);
}
