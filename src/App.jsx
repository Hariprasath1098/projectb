import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import introVideo from "./assets/introVideo.mp4";
import LockPage from "./LockPage";

// 🔹 Import Sections
import Home from "./sections/Home";
import Songs from "./sections/Songs";
import Reels from "./sections/Reels";
import Birthday from "./sections/Birthday";
import Letters from "./sections/Letters";

export default function App() {
  const [step, setStep] = useState("intro");
  const [fade, setFade] = useState(false);

  // Intro → Lock after 5s
  useEffect(() => {
    const timer = setTimeout(() => {
      setStep("lock");
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleUnlock = () => {
    setFade(true);

    setTimeout(() => {
      setStep("main");
      setFade(false);
    }, 1200);
  };

  return (
   <div className="w-full h-screen ...">
      
      {/* ✨ Magic Fade Overlay */}
      {fade && (
        <div className="absolute inset-0 bg-yellow-100 animate-ping z-50"></div>
      )}

      {/* --- SCENE 1: INTRO --- */}
      {step === "intro" && (
        <div className="flex justify-center items-center h-full">
          <video
            src={introVideo}
            autoPlay
            muted
            playsInline
            className="w-72 rounded-lg shadow-2xl"
          />
        </div>
      )}

      {/* --- SCENE 2: LOCK --- */}
      {step === "lock" && (
        <LockPage onUnlock={handleUnlock} />
      )}

      {/* --- SCENE 3: MAIN APP WITH ROUTES --- */}
      {step === "main" && (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/songs" element={<Songs />} />
            <Route path="/reels" element={<Reels />} />
            <Route path="/birthday" element={<Birthday />} />
            <Route path="/letters" element={<Letters />} />
          </Routes>
        </BrowserRouter>
      )}
    </div>
  );
}