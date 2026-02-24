import { useNavigate } from "react-router-dom";
import momentsImg from "../assets/moments.jpg";

export default function Home() {
  const navigate = useNavigate();

  const cards = [
    { title: "Songs", path: "/songs", image: momentsImg, delay: "0s" },
    { title: "Reels", path: "/reels", image: momentsImg, delay: "0.2s" },
    { title: "Letters", path: "/letters", image: momentsImg, delay: "0.4s" },
    { title: "Birthday", path: "/birthday", image: momentsImg, delay: "0.6s" },
    { title: "Memories", path: "/memories", image: momentsImg, delay: "0.8s" },
    { title: "Dreams", path: "/dreams", image: momentsImg, delay: "1s" },
  ];

  return (
    <div className="relative min-h-screen w-full bg-[#fdf2ff] flex flex-col items-center px-6 pt-12 pb-16 overflow-hidden">

    {/* 🩺 Medical Doodle Overlay */}
<div
  className="absolute inset-0 pointer-events-none"
  style={{
    backgroundImage: "url('/medical-doodle.png')",
    backgroundRepeat: "repeat",
    backgroundSize: "240px",   // denser pattern
    opacity: 0.20,             // stronger visibility
    mixBlendMode: "multiply",
    filter: "contrast(140%) brightness(85%)", // darkens lines slightly
    zIndex: 1,
  }}
/>

      {/* 🌸 Soft Paper Texture */}
      <div
        className="absolute inset-0 opacity-[0.02] mix-blend-multiply pointer-events-none"
        style={{
          backgroundImage:
            "url('https://www.transparenttextures.com/patterns/paper-1.png')",
          zIndex: 0,
        }}
      />

      {/* 💡 Enhanced Emotional Glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute top-[35%] left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-gradient-to-r from-pink-300/30 via-purple-300/30 to-white/40 rounded-full blur-[200px]" />
      </div>

      {/* 🌷 Soft Moving Gradient Wash */}
      <div className="absolute inset-0 pointer-events-none opacity-30" style={{ zIndex: 0 }}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-pink-200/30 to-purple-200/40 animate-gradient-slow" />
      </div>

      {/* ✨ Floating Shapes */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <span className="absolute top-[15%] left-[10%] text-purple-300/20 text-2xl animate-float-slow">💜</span>
        <span className="absolute top-[60%] right-[15%] text-pink-300/20 text-xl animate-float-slow delay-2000">✨</span>
        <span className="absolute bottom-[20%] left-[20%] text-purple-200/20 text-xl animate-float-slow delay-4000">♡</span>
      </div>

      {/* 🌫 Ambient Blobs */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-300/30 rounded-full blur-[120px] animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-pink-200/30 rounded-full blur-[130px] animate-blob [animation-delay:2s]"></div>
        <div className="absolute top-[30%] left-[20%] w-80 h-80 bg-white/40 rounded-full blur-[120px] animate-blob [animation-delay:4s]"></div>
      </div>

     {/* 💜 Header */}
<div className="relative z-10 text-center mb-10 px-6 py-6">

  {/* Soft Highlight Background */}
  <div className="absolute inset-0 -z-10 bg-gradient-to-r from-pink-200/30 via-purple-200/30 to-pink-200/30 blur-2xl rounded-full"></div>

  <h1 className="text-[20px] sm:text-2xl md:text-3xl font-serif font-light text-purple-950 tracking-tight relative">
    <span className="relative z-10">
      For My{" "}
      <span className="italic font-semibold text-purple-900 relative">
        Favorite Doctor
        <span className="absolute -bottom-1 left-0 w-full h-[6px] bg-gradient-to-r from-pink-300/40 to-purple-300/40 blur-sm"></span>
      </span>
    </span>
  </h1>
</div>

      {/* 🟪 2 Column Grid */}
      <div className="grid grid-cols-2 gap-6 md:gap-10 max-w-4xl mx-auto relative z-10">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={() => navigate(card.path)}
            style={{ animationDelay: card.delay }}
            className={`group relative cursor-pointer animate-float ${
              card.title === "Memories" ? "scale-105" : ""
            }`}
          >
            {/* Glow on Hover */}
            <div
              className={`absolute -inset-1 rounded-[2.5rem] blur-2xl transition-opacity duration-700 ${
                card.title === "Memories"
                  ? "bg-gradient-to-r from-pink-400/30 to-purple-400/30 opacity-100"
                  : "bg-gradient-to-r from-purple-400/20 to-pink-300/20 opacity-0 group-hover:opacity-100"
              }`}
            />

            <div className="relative rounded-[2.5rem] p-[2px] bg-gradient-to-b from-white/70 via-white/20 to-purple-200/40 shadow-xl backdrop-blur-sm">
              <div className="relative rounded-[2.4rem] overflow-hidden aspect-[4/5] md:w-72">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                />

                <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black/30 to-transparent"></div>

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
                  <p className="text-[#F8F3FF] text-[11px] md:text-sm font-light tracking-[0.28em] uppercase drop-shadow-md">
                    {card.title}
                  </p>
                  <div className="w-0 group-hover:w-12 h-[1px] bg-[#F8F3FF]/70 transition-all duration-500 mx-auto mt-2"></div>
                </div>

                <div className="absolute top-5 left-5 w-6 h-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-sm">
                  <span className="text-[8px] opacity-70">✨</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

     {/* Footer */}
<div className="mt-16 relative z-10 px-6 py-6">

  {/* Soft Footer Highlight */}
  <div className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-200/20 via-pink-200/20 to-purple-200/20 blur-2xl rounded-full"></div>

  <p className="text-purple-900 text-[10px] tracking-widest uppercase italic opacity-60 text-center">
    Every memory is for you
  </p>
</div>

    </div>
  );
}