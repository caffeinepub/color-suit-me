import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import ColorChecker from "./components/ColorChecker";
import LandingPage from "./components/LandingPage";
import ResultsPage from "./components/ResultsPage";
import type { ColorItem } from "./data/colors";
import { useSession } from "./hooks/useSession";

type View = "landing" | "checker" | "results";

export default function App() {
  const sessionId = useSession();
  const [view, setView] = useState<View>("landing");
  const [likedColors, setLikedColors] = useState<ColorItem[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);

  const handleStart = () => {
    setView("checker");
  };

  const handleShowResults = (liked: ColorItem[], votes: number) => {
    setLikedColors(liked);
    setTotalVotes(votes);
    setView("results");
  };

  const handleTryMore = () => {
    setView("checker");
  };

  const handleExit = () => {
    setView("landing");
  };

  return (
    <AnimatePresence mode="wait">
      {view === "landing" && (
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <LandingPage onStart={handleStart} />
        </motion.div>
      )}

      {view === "checker" && (
        <motion.div
          key="checker"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.35 }}
          className="w-full"
        >
          <ColorChecker
            sessionId={sessionId}
            onShowResults={handleShowResults}
            onExit={handleExit}
            initialVoteCount={totalVotes}
            initialLiked={likedColors}
          />
        </motion.div>
      )}

      {view === "results" && (
        <motion.div
          key="results"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.4 }}
        >
          <ResultsPage
            likedColors={likedColors}
            sessionId={sessionId}
            onTryMore={handleTryMore}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
