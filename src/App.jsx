import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import introVideo from "./assets/introVideo.mp4";
import LockPage from "./LockPage";

// 🔐 PASSWORD SYSTEM
const PASSWORD = "hari123";
const PASSWORD_VERSION = "v1";

// 🔹 Import Sections
import Home from "./sections/Home";
import Songs from "./sections/Songs";
import Reels from "./sections/Reels";
import Birthday from "./sections/Birthday";
import Letters from "./sections/Letters";

export default function App() {
  const [step, setStep] = useState("intro");
  const [fade, setFade] = useState(false);

  // 🔐 Check if already unlocked (with version match)
  useEffect(() => {
    const savedVersion = localStorage.getItem("unlockVersion");

    if (savedVersion === PASSWORD_VERSION) {
      setStep("main");
    } else {
      const timer = setTimeout(() => {
        setStep("lock");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleUnlock = (enteredPassword) => {
  if (enteredPassword === PASSWORD) {
    localStorage.setItem("unlockVersion", PASSWORD_VERSION);

    setFade(true);

    setTimeout(() => {
      setStep("main");
      setFade(false);
    }, 1200);

    return true;   // ✅ success
  }

  return false;    // ❌ wrong password
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