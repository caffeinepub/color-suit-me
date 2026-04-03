export type ColorFamily = "warm" | "cool" | "neutral" | "fashion";

export interface ColorItem {
  name: string;
  hex: string;
  family: ColorFamily;
}

export const ALL_COLORS: ColorItem[] = [
  // Warm
  { name: "Soft Beige", hex: "#F5E6D3", family: "warm" },
  { name: "Peach Blush", hex: "#FADADD", family: "warm" },
  { name: "Salmon Pink", hex: "#F4A58A", family: "warm" },
  { name: "Golden Yellow", hex: "#F5D06A", family: "warm" },
  { name: "Terracotta", hex: "#C67C5B", family: "warm" },
  { name: "Burnt Orange", hex: "#CC6B2E", family: "warm" },
  { name: "Warm Caramel", hex: "#C9956A", family: "warm" },
  { name: "Dusty Peach", hex: "#E8B99A", family: "warm" },
  { name: "Mellow Yellow", hex: "#F2D98C", family: "warm" },
  { name: "Sand Dune", hex: "#D4B896", family: "warm" },
  { name: "Apricot", hex: "#F7C59F", family: "warm" },
  { name: "Honey Gold", hex: "#D4A043", family: "warm" },
  // Cool
  { name: "Soft Blue", hex: "#A8C8E8", family: "cool" },
  { name: "Icy Pink", hex: "#F2C4CE", family: "cool" },
  { name: "Lavender", hex: "#C4B5D8", family: "cool" },
  { name: "Jade Green", hex: "#7FBFAD", family: "cool" },
  { name: "Silver Gray", hex: "#B8BCC8", family: "cool" },
  { name: "Baby Blue", hex: "#C9E0F0", family: "cool" },
  { name: "Periwinkle", hex: "#A7A7D4", family: "cool" },
  { name: "Mint Ice", hex: "#B0E4DA", family: "cool" },
  { name: "Rose Quartz", hex: "#E8B4C0", family: "cool" },
  { name: "Powder Blue", hex: "#B0C8DE", family: "cool" },
  { name: "Dusty Mauve", hex: "#C4A0B0", family: "cool" },
  { name: "Steel Blue", hex: "#7E9BB5", family: "cool" },
  // Neutral
  { name: "Taupe", hex: "#B5A498", family: "neutral" },
  { name: "Greige", hex: "#C8BCAC", family: "neutral" },
  { name: "Light Brown", hex: "#A08060", family: "neutral" },
  { name: "Soft Black", hex: "#3C3C3C", family: "neutral" },
  { name: "Warm White", hex: "#F5F0E8", family: "neutral" },
  { name: "Linen", hex: "#E8DDD0", family: "neutral" },
  { name: "Khaki", hex: "#C4B898", family: "neutral" },
  { name: "Warm Gray", hex: "#A0988C", family: "neutral" },
  { name: "Off White", hex: "#EDE8DC", family: "neutral" },
  { name: "Mushroom", hex: "#B0A090", family: "neutral" },
  { name: "Parchment", hex: "#E4D8C0", family: "neutral" },
  { name: "Driftwood", hex: "#958570", family: "neutral" },
  // Fashion
  { name: "Magenta", hex: "#D45B8C", family: "fashion" },
  { name: "Emerald", hex: "#50A878", family: "fashion" },
  { name: "Royal Blue", hex: "#4A6DB5", family: "fashion" },
  { name: "Mustard", hex: "#C8A832", family: "fashion" },
  { name: "Crimson", hex: "#C44060", family: "fashion" },
  { name: "Forest Green", hex: "#4A7C60", family: "fashion" },
  { name: "Deep Purple", hex: "#7050A0", family: "fashion" },
  { name: "Cobalt", hex: "#3060B0", family: "fashion" },
  { name: "Ruby", hex: "#B03050", family: "fashion" },
  { name: "Teal", hex: "#3B8C8C", family: "fashion" },
  { name: "Plum", hex: "#8C4070", family: "fashion" },
  { name: "Fuchsia", hex: "#C040A0", family: "fashion" },
  { name: "Chartreuse", hex: "#98C038", family: "fashion" },
  { name: "Sapphire", hex: "#2850A0", family: "fashion" },
];
