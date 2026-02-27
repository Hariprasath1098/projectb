import { useEffect, useRef, useState } from "react";
import { Home, Film, Play, ArrowUp } from "lucide-react";

const LoadingSpinner = () => (
  <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
    <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
  </div>
);

export default function InstagramClone() {
  const [view, setView] = useState("feed"); 
  const [isGlobalMuted, setIsGlobalMuted] = useState(true);
  const [loadingStates, setLoadingStates] = useState({});
  const [showBackToTop, setShowBackToTop] = useState(false);

  // --- 1. SCALABLE VIDEO SOURCE (118 Videos) ---
  const [reels] = useState(() => {
    // Dynamically generate 118 video entries
    const baseReels = Array.from({ length: 118 }, (_, i) => ({
      id: i,
      video: `/reels/reel-${String(i + 1).padStart(3, "0")}.mp4`, // Uses 3 digits for 100+ files
      views: `${(Math.random() * 10).toFixed(1)}M`,
    }));
    
    const savedOrder = localStorage.getItem("shuffledOrder");
    if (savedOrder) {
      const orderIds = JSON.parse(savedOrder);
      // Reconstruct order based on ID mapping
      return orderIds.map(id => baseReels.find(r => r.id === id)).filter(Boolean);
    }
    
    // Fisher-Yates Shuffle for a fresh experience
    let shuffled = [...baseReels];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    localStorage.setItem("shuffledOrder", JSON.stringify(shuffled.map(r => r.id)));
    return shuffled;
  });

  const [activeReelIndex, setActiveReelIndex] = useState(() => {
    const saved = localStorage.getItem("lastWatchedIndex");
    const parsed = saved ? parseInt(saved) : 0;
    return parsed < reels.length ? parsed : 0; // Guard against out-of-bounds
  });

  const videoRefs = useRef([]);
  const reelsContainerRef = useRef(null);
  const feedContainerRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("lastWatchedIndex", activeReelIndex.toString());
  }, [activeReelIndex]);

  useEffect(() => {
    const handlePopState = () => setView("feed");
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // --- 2. BACK TO TOP LOGIC ---
  const handleFeedScroll = (e) => {
    // Show button if scrolled down more than 500px
    setShowBackToTop(e.target.scrollTop > 500);
  };

  const scrollToTop = () => {
    feedContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
          <h1 className="text-xl font-bold italic tracking-tighter">Yoga's Instagram</h1>
        </div>
      )}

      <div className="flex-1 relative overflow-hidden">
        {view === "feed" && (
          <div 
            ref={feedContainerRef}
            onScroll={handleFeedScroll}
            className="h-full overflow-y-scroll no-scrollbar grid grid-cols-3 gap-[1px] pb-20"
          >
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
            
            {/* 3. Floating Back to Top Button */}
            {showBackToTop && (
              <button 
                onClick={scrollToTop}
                className="fixed bottom-20 right-4 p-3 bg-white text-black rounded-full shadow-lg z-50 active:scale-90 transition-transform"
              >
                <ArrowUp size={20} />
              </button>
            )}
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