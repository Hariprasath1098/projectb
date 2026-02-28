import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

// Assets
import popSound from "../assets/pop.mp3"; 
import finalVideo from "../assets/introVideo.mp4"; 

const Birthday = () => {
  const totalBalloons = 21;
  const [stage, setStage] = useState("popping"); // popping, rotate, wish
  const [poppedCount, setPoppedCount] = useState(0);
  const [isTearing, setIsTearing] = useState(false);
  const [wishPhase, setWishPhase] = useState("matrix");
  const [countdown, setCountdown] = useState(3);
  const [wordIndex, setWordIndex] = useState(0);

  const canvasRef = useRef(null);
  const clickLock = useRef(false);
  const audio = useRef(new Audio(popSound));

  const themes = [
    { bg: "#A3FF33", balloon: "#9133FF" },
    { bg: "#F0F0F0", balloon: "#82CD01" },
    { bg: "#FFD433", balloon: "#3357FF" },
    { bg: "#33FFF5", balloon: "#F333FF" }
  ];

  const [currentTheme, setCurrentTheme] = useState(themes[0]);
  const words = ["HAPPY", "BIRTHDAY", "DR.", "YOGA"];

  // --- RECONSTRUCTED LOGIC ---

  useEffect(() => {
    if (stage === "wish") {
      const timer = setTimeout(() => setWishPhase("countdown"), 4000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  useEffect(() => {
    if (wishPhase === "countdown" && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (wishPhase === "countdown" && countdown === 0) {
      setWishPhase("text");
    }
  }, [wishPhase, countdown]);

  useEffect(() => {
    if (wishPhase === "text") {
      if (wordIndex < words.length - 1) {
        const timer = setTimeout(() => setWordIndex(wordIndex + 1), 1200);
        return () => clearTimeout(timer);
      } else {
        setTimeout(() => setWishPhase("final"), 1500);
      }
    }
  }, [wishPhase, wordIndex]);

  // Optimized Matrix
  useEffect(() => {
    if (stage !== "wish" || wishPhase === "final") return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();

    const letters = "HAPPYBIRTHDAYYOGAA";
    const fontSize = 18;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)"; // Darker trail for smoothness
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#B57EDC";
      ctx.font = `bold ${fontSize}px monospace`;

      drops.forEach((y, i) => {
        const text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillText(text, i * fontSize, y * fontSize);
        if (y * fontSize > canvas.height && Math.random() > 0.98) drops[i] = 0;
        drops[i]++;
      });
    };

    const interval = setInterval(draw, 35);
    window.addEventListener('resize', handleResize);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, [stage, wishPhase]);

  const handlePop = (e) => {
    if (clickLock.current) return;
    clickLock.current = true;

    audio.current.currentTime = 0;
    audio.current.play().catch(() => {});

    setIsTearing(true);

    confetti({
      particleCount: poppedCount >= 19 ? 200 : 80,
      spread: 70,
      origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
      colors: ['#B57EDC', '#ffffff']
    });

    setTimeout(() => {
      if (poppedCount === totalBalloons - 1) {
        setStage("rotate");
      } else {
        setPoppedCount((prev) => prev + 1);
        setCurrentTheme(themes[Math.floor(Math.random() * themes.length)]);
      }
      setIsTearing(false);
      clickLock.current = false;
    }, 450);
  };

  const balloonColor = poppedCount === 20 ? "#B57EDC" : currentTheme.balloon;

  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden transition-colors duration-700"
      style={{ backgroundColor: stage === "popping" ? currentTheme.bg : "#000" }}
    >
      {stage === "popping" && (
        <div className="flex flex-col items-center w-full">
          <AnimatePresence>
            {poppedCount === 0 && (
              <motion.h2 
                exit={{ opacity: 0, y: -20 }}
                className="text-black text-4xl md:text-5xl mb-12 font-serif font-light text-center px-4"
              >
                Hari sent you a surprise
              </motion.h2>
            )}
          </AnimatePresence>

          <div className="relative h-[60vh] w-full flex items-end justify-center">
            <AnimatePresence mode="wait">
              {!isTearing && (
                <motion.button
                  key={poppedCount}
                  onClick={handlePop}
                  initial={{ y: 500, opacity: 0, scale: 0.5 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ scale: 2, opacity: 0, filter: "blur(10px)" }}
                  transition={{ type: "spring", damping: 15, stiffness: 100 }}
                  className="relative group outline-none"
                >
                  <motion.div
                    animate={{ y: [0, -15, 0], rotate: [-1, 1, -1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="flex flex-col items-center"
                  >
                    <div 
                      className="w-32 h-40 relative shadow-xl flex items-center justify-center transition-transform group-hover:scale-105"
                      style={{
                        backgroundColor: balloonColor,
                        borderRadius: "50% 50% 50% 50% / 40% 40% 60% 60%",
                      }}
                    >
                      <div className="absolute top-4 left-6 w-6 h-10 bg-white/20 rounded-full rotate-[20deg]" />
                      <span className="text-white text-6xl font-bold drop-shadow-md">{poppedCount + 1}</span>
                      <div 
                        className="absolute -bottom-1 w-4 h-3" 
                        style={{ 
                          backgroundColor: balloonColor, 
                          clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)" 
                        }} 
                      />
                    </div>
                    <div className="w-[2px] h-48 bg-gray-400/30" />
                  </motion.div>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {stage === "rotate" && (
        <motion.div 
          onClick={() => setStage("wish")}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
          className="text-center text-white cursor-pointer z-50"
        >
          <motion.div animate={{ rotate: [0, 90, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="w-16 h-28 border-2 border-white rounded-lg mx-auto mb-6 flex items-end justify-center pb-2">
            <div className="w-1 h-1 bg-white rounded-full" />
          </motion.div>
          <p className="tracking-widest uppercase text-xs">Rotate & Tap to Begin</p>
        </motion.div>
      )}

      {stage === "wish" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <canvas ref={canvasRef} className="absolute inset-0" />
          <AnimatePresence mode="wait">
            {wishPhase === "countdown" && (
              <motion.h1 key="c" initial={{ scale: 3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} className="text-white text-9xl font-bold z-10">{countdown}</motion.h1>
            )}
            {wishPhase === "text" && (
              <motion.h1 key={wordIndex} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -30, opacity: 0 }} className="text-white text-6xl md:text-8xl font-bold z-10 px-4 text-center">{words[wordIndex]}</motion.h1>
            )}
            {wishPhase === "final" && (
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="z-10 flex flex-col items-center">
                <video src={finalVideo} autoPlay loop muted playsInline className="w-72 h-72 object-contain mb-6 drop-shadow-[0_0_15px_rgba(181,126,220,0.6)]" />
                <h1 className="text-white text-5xl md:text-6xl font-bold tracking-widest uppercase">Dr. Yoga</h1>
                <p className="text-lavender-200 mt-4 tracking-[0.4em] text-xs font-light" style={{ color: '#E6E6FA' }}>21 YEARS OF AWESOME</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Birthday;