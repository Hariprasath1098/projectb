import React, { useState, useEffect } from "react";

const LockPage = ({ onUnlock }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [unlocking, setUnlocking] = useState(false);

  const handleUnlock = () => {
    if (unlocking) return; // prevent double click

    if (!password) {
      setError("Enter the secret 😅");
      return;
    }

    const success = onUnlock(password);

    if (!success) {
      setError("Wrong secret 😅");
      return;
    }

    setError("");
    setUnlocking(true);
  };

  // 🔑 Enter key support
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleUnlock();
    }
  };

  return (
    <div
      className={`relative min-h-[100dvh] w-full flex items-center justify-center overflow-hidden transition-opacity duration-700 ${
        unlocking ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* 📖 Background */}
      <img
        src="/bg.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* 🎞️ Film strips */}
      <img
        src="/film.png"
        className="absolute top-0 w-full h-16 object-cover z-20"
      />
      <img
        src="/film.png"
        className="absolute bottom-0 w-full h-16 rotate-180 object-cover z-20"
      />

      {/* 🕯️ Candle flicker */}
      <div className="absolute inset-0 bg-amber-200/10 animate-pulse pointer-events-none"></div>

      {/* ✨ Floating sparkles */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute top-24 left-12 w-2 h-2 bg-yellow-200 rounded-full animate-ping"></div>
        <div className="absolute top-40 right-20 w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
        <div className="absolute bottom-32 left-24 w-2 h-2 bg-yellow-200 rounded-full animate-ping"></div>
      </div>

      {/* 🪄 Unlock Flash */}
      {unlocking && (
        <div className="absolute inset-0 bg-yellow-100/60 animate-ping z-40"></div>
      )}

      {/* CENTER CONTENT */}
      <div className="relative z-30 flex flex-col items-center gap-6 text-center">

        <p className="text-amber-900 font-serif italic text-xl bg-amber-100/70 px-5 py-2 rounded-md shadow-sm animate-pulse">
          Enter your secret
        </p>

        <p className="text-amber-800/70 italic text-sm">
          The diary listens only to its keeper...
        </p>

        <div className="relative flex justify-center">
          <div className="absolute w-48 h-12 bg-yellow-200/30 blur-xl rounded-full animate-pulse"></div>

          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            onKeyDown={handleKeyDown}
            placeholder="••••••"
            className="relative bg-transparent border-b-2 border-amber-900 text-center outline-none text-amber-900 text-lg w-56 pb-2 font-serif focus:border-yellow-500 transition-colors"
          />
        </div>

        {error && (
          <p className="text-red-700 text-sm animate-pulse">{error}</p>
        )}

        <button
          onClick={handleUnlock}
          disabled={unlocking}
          className={`mt-4 px-8 py-3 bg-gradient-to-b from-amber-200 to-amber-400 text-amber-900 font-serif text-lg rounded-md border border-amber-700 shadow-md shadow-amber-900/30 transition-all duration-300 relative overflow-hidden
          ${
            unlocking
              ? "opacity-50 cursor-not-allowed"
              : "hover:scale-105 hover:shadow-lg hover:shadow-amber-700/40 active:scale-95"
          }`}
        >
          {unlocking ? "Opening..." : "Open Diary"}

          <span className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity"></span>
        </button>
      </div>
    </div>
  );
};

export default LockPage;