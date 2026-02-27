import { useEffect, useRef, useState } from "react";
import { Home, Film, Play } from "lucide-react";

const LoadingSpinner = () => (
  <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
    <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
  </div>
);

export default function InstagramClone() {
  const [view, setView] = useState("feed");
  // --- Initialize state from LocalStorage ---
  const [activeReelIndex, setActiveReelIndex] = useState(() => {
    const saved = localStorage.getItem("lastWatchedIndex");
    return saved ? parseInt(saved) : 0;
  });
  const [isGlobalMuted, setIsGlobalMuted] = useState(true);
  const [loadingStates, setLoadingStates] = useState({});

  // --- Shuffle Logic: Preserves order across sessions ---
  const [reels] = useState(() => {
    const baseReels = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      video: `/reels/reel-${String(i + 1).padStart(2, "0")}.mp4`,
      views: `${(Math.random() * 10).toFixed(1)}M`,
    }));
    
    const savedOrder = localStorage.getItem("shuffledOrder");
    if (savedOrder) {
      const order = JSON.parse(savedOrder);
      return order.map(id => baseReels.find(r => r.id === id));
    }
    
    // Simple Shuffle (Fisher-Yates)
    const shuffled = [...baseReels].sort(() => Math.random() - 0.5);
    localStorage.setItem("shuffledOrder", JSON.stringify(shuffled.map(r => r.id)));
    return shuffled;
  });

  const videoRefs = useRef([]);
  const reelsContainerRef = useRef(null);

  // --- Save progress whenever index changes ---
  useEffect(() => {
    localStorage.setItem("lastWatchedIndex", activeReelIndex.toString());
  }, [activeReelIndex]);

  useEffect(() => {
    const handlePopState = () => setView("feed");
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const openReelFromGrid = (index) => {
    setActiveReelIndex(index);
    setView("reels");
    window.history.pushState({ view: "reels" }, "");
  };

  useEffect(() => {
    if (view !== "reels") return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);
            setActiveReelIndex(index);
          }
        });
      },
      { threshold: 0.8 }
    );
    const containers = document.querySelectorAll('.reel-container');
    containers.forEach(c => observer.observe(c));
    return () => observer.disconnect();
  }, [view]);

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (index === activeReelIndex && view === "reels") {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [activeReelIndex, view]);

  const handleVideoTap = (index) => {
    const video = videoRefs.current[index];
    if (!video) return;
    if (isGlobalMuted) setIsGlobalMuted(false);
    video.paused ? video.play() : video.pause();
  };

  return (
    <div className="h-[100dvh] w-full bg-black text-white flex flex-col overflow-hidden select-none font-sans">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {view === "feed" && (
        <div className="h-14 flex items-center justify-center border-b border-white/5 bg-black/60 backdrop-blur-lg sticky top-0 z-50">
          <h1 className="text-xl font-bold italic tracking-tighter text-center w-full">Yoga's Instagram</h1>
        </div>
      )}

      <div className="flex-1 relative overflow-hidden">
        {view === "feed" && (
          <div className="h-full overflow-y-scroll no-scrollbar grid grid-cols-3 gap-[1px] pb-20">
            {reels.map((reel, index) => (
              <div 
                key={reel.id} 
                className="relative aspect-[3/4] bg-neutral-900 cursor-pointer active:scale-95 transition-transform"
                onClick={() => openReelFromGrid(index)}
              >
                <video src={reel.video} className="w-full h-full object-cover" muted playsInline />
                <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[10px] font-bold bg-black/20 px-1 rounded">
                  <Play size={10} fill="white" />
                  {reel.views}
                </div>
              </div>
            ))}
          </div>
        )}

        {view === "reels" && (
          <div ref={reelsContainerRef} className="h-full w-full overflow-y-scroll no-scrollbar snap-y snap-mandatory snap-always">
            {reels.map((reel, index) => {
              const isWithinWindow = Math.abs(index - activeReelIndex) <= 1;
              const isCurrent = index === activeReelIndex;
              return (
                <div key={reel.id} data-index={index} className="reel-container relative h-full w-full snap-start snap-always flex items-center justify-center bg-black">
                  {isWithinWindow ? (
                    <>
                      {loadingStates[index] && <LoadingSpinner />}
                      <video
                        ref={(el) => (videoRefs.current[index] = el)}
                        src={reel.video}
                        className="h-full w-full object-cover"
                        muted={!isCurrent || isGlobalMuted}
                        loop
                        playsInline
                        onClick={() => handleVideoTap(index)}
                        onWaiting={() => setLoadingStates(p => ({ ...p, [index]: true }))}
                        onPlaying={() => setLoadingStates(p => ({ ...p, [index]: false }))}
                      />
                    </>
                  ) : (
                    <div className="h-full w-full bg-black" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="h-16 border-t border-white/10 bg-black flex items-center justify-around z-50">
        <button onClick={() => setView("feed")} className="flex flex-col items-center justify-center relative w-full h-full">
          <Home size={26} className={view === "feed" ? "text-white" : "text-white/30"} />
          {view === "feed" && <div className="absolute bottom-2 w-1 h-1 bg-white rounded-full" />}
        </button>
        <button onClick={() => setView("reels")} className="flex flex-col items-center justify-center relative w-full h-full">
          <Film size={26} className={view === "reels" ? "text-white" : "text-white/30"} />
          {view === "reels" && <div className="absolute bottom-2 w-1 h-1 bg-white rounded-full" />}
        </button>
      </div>
    </div>
  );
}