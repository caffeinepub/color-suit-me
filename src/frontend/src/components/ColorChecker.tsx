import { BarChart2, ChevronDown, ChevronUp, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ColorFamily, ColorItem } from "../data/colors";
import { ALL_COLORS } from "../data/colors";
import { useActor } from "../hooks/useActor";
import {
  buildColorQueue,
  getDominantFamily,
  shouldUseWhiteText,
} from "../utils/colorUtils";

interface ColorCheckerProps {
  sessionId: string;
  onShowResults: (likedColors: ColorItem[], voteCount: number) => void;
  onExit: () => void;
  initialVoteCount?: number;
  initialLiked?: ColorItem[];
}

type FamilyVotes = Record<ColorFamily, { likes: number; total: number }>;

const INITIAL_FAMILY_VOTES: FamilyVotes = {
  warm: { likes: 0, total: 0 },
  cool: { likes: 0, total: 0 },
  neutral: { likes: 0, total: 0 },
  fashion: { likes: 0, total: 0 },
};

function initQueue(): ColorItem[] {
  const shuffled = [...ALL_COLORS].sort(() => Math.random() - 0.5);
  return shuffled;
}

export default function ColorChecker({
  sessionId,
  onShowResults,
  onExit,
  initialVoteCount = 0,
  initialLiked = [],
}: ColorCheckerProps) {
  const { actor } = useActor();
  const [queue, setQueue] = useState<ColorItem[]>(() => initQueue());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedColors, setLikedColors] = useState<ColorItem[]>(initialLiked);
  const [voteCount, setVoteCount] = useState(initialVoteCount);
  const [familyVotes, setFamilyVotes] =
    useState<FamilyVotes>(INITIAL_FAMILY_VOTES);
  const [transitioning, setTransitioning] = useState(false);
  const [voteAnimation, setVoteAnimation] = useState<"yes" | "no" | null>(null);
  const [isLandscape, setIsLandscape] = useState(false);

  const touchStartY = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const mouseStartY = useRef<number | null>(null);
  const isDragging = useRef(false);

  const currentColor = queue[currentIndex] ?? ALL_COLORS[0];
  const useWhite = shouldUseWhiteText(currentColor.hex);
  const textColor = useWhite ? "#FFFFFF" : "#1F1F1F";
  const canSeeResults = voteCount + initialVoteCount >= 10;

  // Landscape detection
  useEffect(() => {
    const check = () => {
      setIsLandscape(
        window.innerWidth > window.innerHeight && window.innerWidth > 600,
      );
    };
    check();
    window.addEventListener("resize", check);
    window.addEventListener("orientationchange", check);
    return () => {
      window.removeEventListener("resize", check);
      window.removeEventListener("orientationchange", check);
    };
  }, []);

  const vote = useCallback(
    async (liked: boolean) => {
      if (transitioning) return;
      setTransitioning(true);
      setVoteAnimation(liked ? "yes" : "no");

      const color = currentColor;
      const newVoteCount = voteCount + 1;
      const newLiked = liked ? [...likedColors, color] : likedColors;

      const newFamilyVotes = { ...familyVotes };
      newFamilyVotes[color.family] = {
        likes: familyVotes[color.family].likes + (liked ? 1 : 0),
        total: familyVotes[color.family].total + 1,
      };

      setFamilyVotes(newFamilyVotes);
      setVoteCount(newVoteCount);
      if (liked) setLikedColors(newLiked);

      // Fire-and-forget backend vote
      if (actor) {
        try {
          await actor.addVote(
            sessionId,
            { name: color.name, hex: color.hex, family: color.family },
            liked,
          );
        } catch {
          // silent fail
        }
      }

      // Every 5 votes, get recommended family from backend
      if (newVoteCount % 5 === 0 && actor) {
        try {
          const recommendedFamily = await actor.getRecommendedFamily(sessionId);
          if (
            recommendedFamily &&
            ["warm", "cool", "neutral", "fashion"].includes(recommendedFamily)
          ) {
            const seen = new Set(
              queue.slice(0, currentIndex + 1).map((c) => c.hex),
            );
            const newQueue = buildColorQueue(
              newFamilyVotes,
              seen,
              recommendedFamily as ColorFamily,
            );
            setQueue(newQueue);
            setCurrentIndex(0);
            setTimeout(() => setTransitioning(false), 400);
            setTimeout(() => setVoteAnimation(null), 600);
            return;
          }
        } catch {
          // silent fail
        }
      }

      // Move to next color
      setTimeout(() => {
        const nextIdx = currentIndex + 1;
        if (nextIdx >= queue.length) {
          // Rebuild queue
          const seen = new Set(
            queue.slice(0, currentIndex + 1).map((c) => c.hex),
          );
          const dominant = getDominantFamily(newFamilyVotes);
          const newQueue = buildColorQueue(newFamilyVotes, seen, dominant);
          setQueue(newQueue.length > 0 ? newQueue : initQueue());
          setCurrentIndex(0);
        } else {
          setCurrentIndex(nextIdx);
        }
        setTransitioning(false);
        setVoteAnimation(null);
      }, 350);
    },
    [
      actor,
      transitioning,
      currentColor,
      voteCount,
      likedColors,
      familyVotes,
      sessionId,
      queue,
      currentIndex,
    ],
  );

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null || touchStartX.current === null) return;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;

    if (Math.abs(deltaX) < Math.abs(deltaY) && Math.abs(deltaY) > 50) {
      if (deltaY < -50) {
        vote(true); // swipe up = yes
      } else if (deltaY > 50) {
        vote(false); // swipe down = no
      }
    }
    touchStartY.current = null;
    touchStartX.current = null;
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    mouseStartY.current = e.clientY;
    isDragging.current = true;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging.current || mouseStartY.current === null) return;
    const deltaY = e.clientY - mouseStartY.current;
    if (Math.abs(deltaY) > 50) {
      if (deltaY < -50) vote(true);
      else if (deltaY > 50) vote(false);
    }
    mouseStartY.current = null;
    isDragging.current = false;
  };

  const totalVotes = voteCount + initialVoteCount;

  return (
    <div className="relative w-full h-dvh overflow-hidden">
      {/* Landscape Overlay */}
      {isLandscape && (
        <div className="absolute inset-0 z-50 bg-[#1F1F1F] flex flex-col items-center justify-center gap-4">
          <div className="text-white text-4xl">↺</div>
          <p className="text-white text-lg font-medium">
            Please rotate your device
          </p>
          <p className="text-white/60 text-sm">Portrait mode works best</p>
        </div>
      )}

      {/* Color Background */}
      <div
        className="absolute inset-0 select-none cursor-grab active:cursor-grabbing"
        style={{
          backgroundColor: currentColor.hex,
          transition: "background-color 0.35s ease",
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      />

      {/* Vote animation overlay */}
      <AnimatePresence>
        {voteAnimation && (
          <motion.div
            key={voteAnimation}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
          >
            <div
              className="text-7xl"
              style={{ filter: "drop-shadow(0 4px 20px rgba(0,0,0,0.3))" }}
            >
              {voteAnimation === "yes" ? "✅" : "❌"}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exit button */}
      <button
        type="button"
        onClick={onExit}
        className="absolute top-4 left-4 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all"
        style={{
          backgroundColor: "rgba(0,0,0,0.2)",
          color: "#FFFFFF",
        }}
        data-ocid="checker.exit.button"
        aria-label="Exit color checker"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Progress indicator */}
      <div
        className="absolute top-4 right-4 z-20 flex items-center gap-1.5 rounded-full px-3 py-1.5"
        style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
      >
        <BarChart2 className="w-3.5 h-3.5 text-white" />
        <span className="text-white text-xs font-medium">
          {totalVotes} checked
        </span>
      </div>

      {/* Center text overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none z-10 px-8">
        <motion.p
          key={currentColor.hex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-2xl font-medium tracking-[0.08em] uppercase text-center"
          style={{ color: textColor }}
        >
          {currentColor.name}
        </motion.p>
        <p
          className="text-sm opacity-70 text-center"
          style={{ color: textColor }}
        >
          Hold your hand close to the screen
        </p>
      </div>

      {/* Bottom bar */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20 px-4 pt-4 pb-8"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)",
        }}
      >
        {/* Swipe hint */}
        <div className="flex flex-col items-center gap-1 mb-4">
          <div className="flex items-center gap-3 text-white/80">
            <div className="flex items-center gap-1 text-xs">
              <ChevronUp className="w-4 h-4" />
              <span>Swipe up = suits me</span>
            </div>
            <span className="text-white/40">·</span>
            <div className="flex items-center gap-1 text-xs">
              <ChevronDown className="w-4 h-4" />
              <span>Swipe down = doesn't suit me</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => vote(false)}
            className="flex-1 h-12 rounded-full border-2 border-white/60 text-white font-medium text-sm hover:bg-white/10 transition-all active:scale-95"
            data-ocid="checker.no.button"
          >
            ❌ No
          </button>

          {canSeeResults && (
            <button
              type="button"
              onClick={() => onShowResults(likedColors, totalVotes)}
              className="flex-shrink-0 h-12 px-4 rounded-full text-white/80 text-xs font-medium hover:text-white border border-white/30 hover:border-white/60 transition-all"
              data-ocid="checker.see_results.button"
            >
              See Results
            </button>
          )}

          <button
            type="button"
            onClick={() => vote(true)}
            className="flex-1 h-12 rounded-full bg-[#1F1F1F] text-white font-medium text-sm hover:bg-[#333] transition-all active:scale-95"
            data-ocid="checker.yes.button"
          >
            ✅ Yes
          </button>
        </div>
      </div>
    </div>
  );
}
