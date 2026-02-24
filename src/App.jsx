import React, { useState, useEffect, useRef } from "react";
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
  const lastTapRef = useRef(0);

  // 🎬 Handle Intro End (normal or skipped)
  const handleIntroEnd = () => {
    const savedVersion = localStorage.getItem("unlockVersion");

    if (savedVersion === PASSWORD_VERSION) {
      setStep("main");
    } else {
      setStep("lock");
    }
  };

  // 🔐 Handle Unlock
  const handleUnlock = (enteredPassword) => {
    if (enteredPassword === PASSWORD) {
      localStorage.setItem("unlockVersion", PASSWORD_VERSION);

      setFade(true);

      setTimeout(() => {
        setStep("main");
        setFade(false);
      }, 1200);

      return true;
    }

    return false;
  };

  return (
   <div className="w-full min-h-screen relative">

      {/* ✨ Magic Fade Overlay */}
      {fade && (
        <div className="absolute inset-0 bg-yellow-100 animate-ping z-50"></div>
      )}

      {/* --- SCENE 1: INTRO --- */}
      {step === "intro" && (
        <div
          className="flex justify-center items-center h-full bg-black"
          onDoubleClick={handleIntroEnd} // 💻 Desktop double click
          onTouchEnd={() => {
            const now = Date.now();
            if (now - lastTapRef.current < 300) {
              handleIntroEnd(); // 📱 Mobile double tap
            }
            lastTapRef.current = now;
          }}
        >
          <video
            src={introVideo}
            autoPlay
            muted
            playsInline
            onEnded={handleIntroEnd} // 🎬 When video finishes
            className="w-72 rounded-lg shadow-2xl"
          />
        </div>
      )}

      {/* --- SCENE 2: LOCK --- */}
      {step === "lock" && (
        <LockPage onUnlock={handleUnlock} />
      )}

      {/* --- SCENE 3: MAIN APP --- */}
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