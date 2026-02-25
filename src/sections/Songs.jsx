import React, { useState, useRef, useEffect } from "react";

export default function Songs() {
  const [artists, setArtists] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [appSection, setAppSection] = useState("home");

  const [currentSong, setCurrentSong] = useState(null);
  const [currentArtistSongs, setCurrentArtistSongs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);

  const [recentSongs, setRecentSongs] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [search, setSearch] = useState("");

  const [playlists, setPlaylists] = useState(() => {
    const saved = localStorage.getItem("my_playlists");
    return saved ? JSON.parse(saved) : [];
  });
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [showAddMenu, setShowAddMenu] = useState(null);

  const audioRef = useRef(null);
  const searchInputRef = useRef(null);
  const lastTap = useRef(0);
  const touchStart = useRef(0);

  const covers = ["chibi1.jpg", "chibi2.jpg", "chibi3.jpg", "chibi4.jpg", "chibi5.jpg"];

  useEffect(() => {
    fetch("/songs.json")
      .then(res => res.json())
      .then(data => setArtists(data));
  }, []);

  useEffect(() => {
    localStorage.setItem("my_playlists", JSON.stringify(playlists));
  }, [playlists]);

  const allSongs = artists.flatMap(artist =>
    artist.songs.map(song => ({
      ...song,
      artist: artist.artist,
      artistSongs: artist.songs
    }))
  );

  const filteredSongs = allSongs.filter(song =>
    song.title.toLowerCase().includes(search.toLowerCase())
  );

  const playSong = (song, songsList, index) => {
    if (!audioRef.current) return;
    if (currentSong?.id === song.id) {
      isPlaying ? audioRef.current.pause() : audioRef.current.play();
      setIsPlaying(!isPlaying);
    } else {
      audioRef.current.src = `/songs/${song.file}`;
      audioRef.current.play();
      setCurrentSong(song);
      setCurrentArtistSongs(songsList);
      setCurrentIndex(index);
      setIsPlaying(true);
      setRecentSongs(prev => [song, ...prev.filter(s => s.id !== song.id)].slice(0, 4));
    }
  };

  const nextSong = () => {
    if (!currentArtistSongs.length) return;
    const next = (currentIndex + 1) % currentArtistSongs.length;
    playSong(currentArtistSongs[next], currentArtistSongs, next);
  };

  const prevSong = () => {
    if (!currentArtistSongs.length) return;
    const prev = (currentIndex - 1 + currentArtistSongs.length) % currentArtistSongs.length;
    playSong(currentArtistSongs[prev], currentArtistSongs, prev);
  };

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) setIsFullScreen(false);
    lastTap.current = now;
  };

  const handleTouchStart = (e) => (touchStart.current = e.touches[0].clientX);
  const handleTouchEnd = (e) => {
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart.current - touchEnd;
    if (Math.abs(diff) > 70) diff > 0 ? nextSong() : prevSong();
  };

  // ⭐ FIX: CREATE PLAYLIST
  const createPlaylist = () => {
    if (!newPlaylistName.trim()) return;
    const newList = { id: Date.now(), name: newPlaylistName, songs: [] };
    setPlaylists([...playlists, newList]);
    setNewPlaylistName("");
    setAppSection("library");
  };

  const deletePlaylist = (id) => setPlaylists(playlists.filter(pl => pl.id !== id));

  const addSongToPlaylist = (playlistId, song) => {
    setPlaylists(prev => prev.map(pl => 
      pl.id === playlistId && !pl.songs.find(s => s.id === song.id) 
      ? { ...pl, songs: [...pl.songs, song] } : pl
    ));
    setShowAddMenu(null);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const update = () => { setCurrentTime(audio.currentTime); setDuration(audio.duration); };
    audio.addEventListener("timeupdate", update);
    audio.addEventListener("ended", nextSong);
    return () => { audio.removeEventListener("timeupdate", update); audio.removeEventListener("ended", nextSong); };
  }, [currentIndex, currentArtistSongs]);

  const formatTime = time => {
    if (!time) return "0:00";
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-[#0f0f14] to-black text-white px-6 pt-10 pb-40 overflow-x-hidden font-sans">
      
      {(appSection === "home" || appSection === "search") && (
        <>
          <h1 className="text-3xl font-bold text-center mb-6">DR Music</h1>
          
          <div className="flex gap-3 mb-6 justify-center">
            {["all", "music", "artists"].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-2 rounded-full text-sm font-semibold transition ${activeTab === tab ? "bg-white text-black" : "bg-[#181825] text-gray-300"}`}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <input ref={searchInputRef} type="text" placeholder="Search songs..." value={search} onChange={e => setSearch(e.target.value)} className="mb-8 bg-[#181825] px-4 py-2 rounded-lg border border-purple-800 w-full outline-none" />

          {/* ⭐ HOME CONTENT (Original Structure) */}
          <div className="space-y-8">
            {activeTab === "all" && (
              <>
                {recentSongs.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-3">Recents</h2>
                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                      {recentSongs.map((song, i) => (
                        <div key={song.id} onClick={() => playSong(song, recentSongs, i)} className="min-w-[140px] bg-[#181825] p-3 rounded-xl cursor-pointer">
                          <img src={`/covers/${covers[i % covers.length]}`} className="w-full h-32 object-cover rounded-lg mb-2" />
                          <p className="text-sm font-medium truncate">{song.title}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h2 className="text-xl font-semibold mb-3">Artists</h2>
                  <div className="grid grid-cols-3 gap-4">
                    {artists.map((artistObj, i) => (
                      <div key={i} className="text-center">
                        <img src="/artists/pradeep.jpg" className="w-20 h-20 mx-auto rounded-full object-cover mb-2" />
                        <p className="text-sm">{artistObj.artist}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-3">Songs</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {filteredSongs.slice(0, 6).map((song, i) => (
                      <div key={song.id} className="relative">
                        <div onClick={() => playSong(song, filteredSongs, i)} className="bg-[#181825] p-3 rounded-xl cursor-pointer">
                          <img src={`/covers/${covers[i % covers.length]}`} className="w-full h-32 object-cover rounded-lg mb-2" />
                          <p className="text-sm font-medium truncate">{song.title}</p>
                          <p className="text-xs text-gray-400">{song.artist}</p>
                        </div>
                        <button onClick={() => setShowAddMenu(showAddMenu === song.id ? null : song.id)} className="absolute top-2 right-2 bg-black/60 w-8 h-8 rounded-full flex items-center justify-center text-xl text-purple-400">+</button>
                        {showAddMenu === song.id && (
                          <div className="absolute right-0 top-12 w-40 bg-[#1e1e2e] border border-purple-800 rounded-lg shadow-2xl z-50 p-2">
                            {playlists.map(pl => (
                              <button key={pl.id} onClick={() => addSongToPlaylist(pl.id, song)} className="w-full text-left px-2 py-1 text-sm hover:bg-purple-600 rounded">To: {pl.name}</button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === "music" && (
              <div className="grid grid-cols-2 gap-4">
                {filteredSongs.map((song, i) => (
                  <div key={song.id} onClick={() => playSong(song, filteredSongs, i)} className="bg-[#181825] p-3 rounded-xl cursor-pointer">
                    <img src={`/covers/${covers[i % covers.length]}`} className="w-full h-32 object-cover rounded-lg mb-2" />
                    <p className="text-sm font-medium truncate">{song.title}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "artists" && (
              <div className="grid grid-cols-3 gap-4">
                {artists.map((artistObj, i) => (
                  <div key={i} className="text-center">
                    <img src="/artists/pradeep.jpg" className="w-24 h-24 mx-auto rounded-full object-cover mb-2" />
                    <p className="text-sm">{artistObj.artist}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* ⭐ LIBRARY SECTION (Play All & Delete Buttons Fix) */}
      {appSection === "library" && (
        <div className="mt-10 space-y-6">
          <h2 className="text-2xl font-bold">Library</h2>
          {playlists.map(pl => (
            <div key={pl.id} className="bg-[#181825] p-5 rounded-3xl border border-purple-900/30">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-purple-300">{pl.name}</h3>
                <div className="flex gap-3">
                  <button onClick={() => deletePlaylist(pl.id)} className="text-gray-500 text-xs hover:text-red-500 uppercase">Delete</button>
                  <button onClick={() => pl.songs.length > 0 && playSong(pl.songs[0], pl.songs, 0)} className="bg-purple-600 px-4 py-1.5 rounded-full text-[10px] font-bold">PLAY ALL</button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {pl.songs.map((ps, idx) => (
                  <div key={ps.id} onClick={() => playSong(ps, pl.songs, idx)} className="flex items-center gap-2 bg-black/20 p-2 rounded-xl text-xs truncate">🎵 {ps.title}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ⭐ CREATE SECTION (Fixed Action) */}
      {appSection === "create" && (
        <div className="mt-20 text-center">
          <h2 className="text-2xl font-bold mb-6">New Playlist</h2>
          <input type="text" placeholder="Name..." value={newPlaylistName} onChange={(e) => setNewPlaylistName(e.target.value)} className="bg-[#181825] px-6 py-4 rounded-2xl border border-purple-800 w-full text-center mb-6" />
          <button onClick={createPlaylist} className="bg-white text-black px-12 py-3 rounded-full font-bold">Create</button>
        </div>
      )}

      {/* 🎵 PLAYER (Minute Glow & Double Tap Minimize) */}
      {currentSong && (
        <div 
          onClick={isFullScreen ? handleDoubleTap : undefined}
          onTouchStart={isFullScreen ? handleTouchStart : undefined}
          onTouchEnd={isFullScreen ? handleTouchEnd : undefined}
          className={`fixed left-4 right-4 bg-[#181825]/95 backdrop-blur-xl border border-purple-800 shadow-2xl transition-all duration-500 z-50 overflow-hidden ${isFullScreen ? "top-0 left-0 right-0 bottom-0 rounded-none p-8 flex flex-col items-center justify-center bg-black" : "bottom-20 rounded-2xl p-4 flex items-center justify-between"}`}
        >
          {isFullScreen && <div className="absolute inset-0 z-[-1] opacity-10 bg-gradient-to-b from-purple-900 to-transparent pointer-events-none" />}
          
          <div className={`flex items-center gap-4 cursor-pointer ${isFullScreen ? "flex-col w-full text-center" : "flex-row"}`} onClick={() => !isFullScreen && setIsFullScreen(true)}>
            <img src={`/covers/${covers[currentIndex % covers.length]}`} className={`object-cover rounded-xl transition-all duration-700 ${isFullScreen ? "w-72 h-72 mb-8 shadow-2xl" : "w-12 h-12"}`} />
            <div>
              <h3 className={`font-bold truncate ${isFullScreen ? "text-2xl mb-1" : "text-sm w-32"}`}>{currentSong.title}</h3>
              <p className="text-gray-400 text-xs">{currentSong.artist}</p>
            </div>
          </div>

          {isFullScreen && (
            <div className="w-full mt-6 px-4" onClick={(e) => e.stopPropagation()}>
              <input type="range" className="w-full h-1 bg-gray-700 rounded-lg appearance-none accent-purple-500" value={currentTime} max={duration || 0} onChange={(e) => { audioRef.current.currentTime = e.target.value; }} />
              <div className="flex justify-between text-xs mt-3 text-gray-400"><span>{formatTime(currentTime)}</span><span>{formatTime(duration)}</span></div>
            </div>
          )}

          <div className={`flex items-center gap-8 ${isFullScreen ? "mt-10" : ""}`}>
            <button onClick={(e) => { e.stopPropagation(); prevSong(); }} className={isFullScreen ? "text-4xl" : "text-2xl"}>⏮️</button>
            <button onClick={(e) => { e.stopPropagation(); isPlaying ? audioRef.current.pause() : audioRef.current.play(); setIsPlaying(!isPlaying); }} className={`bg-white text-black rounded-full flex items-center justify-center ${isFullScreen ? "w-20 h-20 text-4xl" : "w-10 h-10 text-xl"}`}>{isPlaying ? "⏸️" : "▶️"}</button>
            <button onClick={(e) => { e.stopPropagation(); nextSong(); }} className={isFullScreen ? "text-4xl" : "text-2xl"}>⏭️</button>
          </div>
        </div>
      )}

      {/* 🧭 BOTTOM NAV */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-md border-t border-white/10 flex justify-around items-center z-40">
        <button onClick={() => setAppSection("home")} className={`flex flex-col items-center ${appSection === "home" ? "text-white" : "text-gray-500"}`}>🏠<span className="text-[10px]">Home</span></button>
        <button onClick={() => { setAppSection("home"); setTimeout(() => searchInputRef.current?.focus(), 100); }} className={`flex flex-col items-center ${appSection === "search" ? "text-white" : "text-gray-500"}`}>🔍<span className="text-[10px]">Search</span></button>
        <button onClick={() => setAppSection("library")} className={`flex flex-col items-center ${appSection === "library" ? "text-white" : "text-gray-500"}`}>📚<span className="text-[10px]">Library</span></button>
        <button onClick={() => setAppSection("create")} className={`flex flex-col items-center ${appSection === "create" ? "text-white" : "text-gray-500"}`}>➕<span className="text-[10px]">Create</span></button>
      </div>

      <audio ref={audioRef} />
      <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
}