export default function Birthday() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-purple-200 via-pink-200 to-purple-300 overflow-hidden">

      {/* Floating Glow Background */}
      <div className="absolute w-72 h-72 bg-purple-400 opacity-30 rounded-full blur-3xl top-10 left-10 animate-pulse"></div>
      <div className="absolute w-96 h-96 bg-pink-400 opacity-30 rounded-full blur-3xl bottom-10 right-10 animate-pulse"></div>

      {/* Glass Card */}
      <div className="backdrop-blur-lg bg-white/30 border border-white/40 rounded-3xl shadow-2xl p-10 text-center">

        <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-4">
          🎂 Happy Birthday My Love
        </h1>

        <p className="text-white text-lg mb-6">
          This day is special because you were born.
        </p>

        <div className="text-6xl animate-bounce">
          🎉🎂✨
        </div>

      </div>
    </div>
  );
}