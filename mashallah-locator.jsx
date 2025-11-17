import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Radar, Zap } from 'lucide-react';

export default function MashallahLocator() {
  const [stage, setStage] = useState('welcome');
  const [location, setLocation] = useState('');
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioContextRef = useRef(null);

  const locations = [
    'Dorm',
    'Campus',
    'Coca-Cola Factory',
    'Gym',
    'Supermarket free supply spot',
    'Jail',
    'Port Baku',
    "William Wallace's Daşşaq"
  ];

  // Initialize audio context
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
  }, []);

  // Play clap sound
  const playClap = () => {
    if (!audioContextRef.current) return;
    
    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(800, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
    
    filter.type = 'bandpass';
    filter.frequency.value = 1000;
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.1);
  };

  useEffect(() => {
    if (scanning) {
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            setScanning(false);
            if (stage === 'radar') {
              setStage('noResults');
            } else if (stage === 'ograshRadar') {
              setStage('ograshResult');
            }
            return 100;
          }
          
          // Play clap every 20% (5 times during scan)
          if (prev % 20 === 0 && prev > 0) {
            playClap();
          }
          
          return prev + 1;
        });
      }, 100);
      return () => clearInterval(timer);
    }
  }, [scanning, stage]);

  const handleLocationSelect = (loc) => {
    setLocation(loc);
    setStage('radar');
    setScanning(true);
    setProgress(0);
  };

  const handleOgrashSearch = () => {
    setStage('ograshRadar');
    setScanning(true);
    setProgress(0);
  };

  const reset = () => {
    setStage('welcome');
    setLocation('');
    setProgress(0);
    setScanning(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes radarSweep {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(236, 72, 153, 0.5); }
          50% { box-shadow: 0 0 40px rgba(236, 72, 153, 0.8), 0 0 60px rgba(236, 72, 153, 0.4); }
        }
        
        @keyframes glowGreen {
          0%, 100% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.5); }
          50% { box-shadow: 0 0 40px rgba(34, 197, 94, 0.8), 0 0 60px rgba(34, 197, 94, 0.4); }
        }
        
        .radar-sweep {
          animation: radarSweep 2s linear infinite;
        }
        
        .pulse {
          animation: pulse 2s ease-in-out infinite;
        }
        
        .fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .glow-pink {
          animation: glow 2s ease-in-out infinite;
        }
        
        .glow-green {
          animation: glowGreen 2s ease-in-out infinite;
        }
        
        .radar-circle {
          border: 2px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
        }
      `}</style>

      {/* Welcome Stage */}
      {stage === 'welcome' && (
        <div className="max-w-3xl w-full fade-in relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block mb-6 p-4 bg-gradient-to-r from-pink-500/20 to-orange-500/20 rounded-full backdrop-blur-sm border border-pink-500/30">
              <Radar size={48} className="text-pink-400" />
            </div>
            <h1 className="text-7xl font-black text-white mb-6 tracking-tight">
              Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-400 to-orange-400 animate-pulse">Suad</span>
            </h1>
            <p className="text-2xl text-gray-300 font-light">Select your current location to begin scanning</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {locations.map((loc, idx) => (
              <button
                key={idx}
                onClick={() => handleLocationSelect(loc)}
                className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md hover:from-white/20 hover:to-white/10 text-white p-7 rounded-3xl transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-white/20 hover:border-pink-400/50 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-pink-500/10 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <MapPin className="inline-block mr-3 mb-1 group-hover:text-pink-400 transition-colors" size={24} />
                <span className="text-xl font-semibold relative z-10">{loc}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mashallah Radar Stage */}
      {stage === 'radar' && (
        <div className="text-center fade-in relative z-10">
          <div className="mb-8">
            <h2 className="text-5xl font-black text-white mb-3 tracking-tight">Mashallah Locator</h2>
            <p className="text-2xl text-gray-300 mb-1">Scanning near:</p>
            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-400">{location}</p>
          </div>
          
          <div className="relative w-96 h-96 mx-auto mb-10">
            {/* Outer glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-orange-500/20 rounded-full blur-3xl" />
            
            {/* Radar circles */}
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="absolute radar-circle rounded-full transition-all duration-500"
                style={{
                  width: `${i * 20}%`,
                  height: `${i * 20}%`,
                  left: `${50 - (i * 10)}%`,
                  top: `${50 - (i * 10)}%`,
                  borderColor: `rgba(255, ${150 - i * 20}, ${120 - i * 15}, ${0.4 - i * 0.06})`
                }}
              />
            ))}
            
            {/* Center dot */}
            <div className="absolute top-1/2 left-1/2 w-6 h-6 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 pulse glow-pink z-10" />
            
            {/* Radar sweep */}
            <div className="absolute top-1/2 left-1/2 w-full h-1 origin-left radar-sweep">
              <div className="h-full bg-gradient-to-r from-pink-500 via-orange-400/60 to-transparent" />
            </div>
            
            {/* Grid lines */}
            <div className="absolute top-1/2 left-0 w-full h-px bg-white/10" />
            <div className="absolute top-0 left-1/2 w-px h-full bg-white/10" />
          </div>
          
          <div className="space-y-4">
            <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-400">
              Searching for Mashallahs...
            </div>
            <div className="w-80 h-3 bg-white/10 rounded-full mx-auto overflow-hidden border border-white/20">
              <div 
                className="h-full bg-gradient-to-r from-pink-500 via-rose-400 to-orange-400 transition-all duration-100 shadow-lg"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-gray-400 text-lg">{progress}% Complete</p>
          </div>
        </div>
      )}

      {/* No Results Stage */}
      {stage === 'noResults' && (
        <div className="text-center fade-in max-w-xl relative z-10">
          <div className="text-8xl mb-8 animate-bounce">😔</div>
          <h2 className="text-5xl font-black text-white mb-6 tracking-tight">No Mashallahs Found</h2>
          <p className="text-2xl text-gray-300 mb-12 font-light">Unfortunately, there are no Mashallahs in your vicinity.</p>
          
          <button
            onClick={handleOgrashSearch}
            className="group relative bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 hover:from-green-600 hover:via-emerald-600 hover:to-green-700 text-white px-10 py-5 rounded-2xl text-xl font-bold transition-all duration-300 hover:scale-105 shadow-2xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <span className="relative flex items-center justify-center gap-2">
              <Radar size={24} />
              Search for Oğrashs instead?
            </span>
          </button>
          
          <button
            onClick={reset}
            className="block mx-auto mt-6 text-gray-400 hover:text-white transition-colors text-lg"
          >
            ← Go back
          </button>
        </div>
      )}

      {/* Ogrash Radar Stage */}
      {stage === 'ograshRadar' && (
        <div className="text-center fade-in relative z-10">
          <div className="mb-8">
            <h2 className="text-5xl font-black text-white mb-3 tracking-tight">Oğrash Locator</h2>
            <p className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 font-semibold">
              Expanding global search radius...
            </p>
          </div>
          
          <div className="relative w-96 h-96 mx-auto mb-10">
            {/* Outer glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-3xl" />
            
            {/* Radar circles */}
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="absolute radar-circle rounded-full transition-all duration-500"
                style={{
                  width: `${i * 20}%`,
                  height: `${i * 20}%`,
                  left: `${50 - (i * 10)}%`,
                  top: `${50 - (i * 10)}%`,
                  borderColor: `rgba(34, 197, 94, ${0.4 - i * 0.06})`
                }}
              />
            ))}
            
            {/* Center dot */}
            <div className="absolute top-1/2 left-1/2 w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 pulse glow-green z-10" />
            
            {/* Radar sweep */}
            <div className="absolute top-1/2 left-1/2 w-full h-1 origin-left radar-sweep">
              <div className="h-full bg-gradient-to-r from-green-500 via-emerald-400/60 to-transparent" />
            </div>
            
            {/* Grid lines */}
            <div className="absolute top-1/2 left-0 w-full h-px bg-white/10" />
            <div className="absolute top-0 left-1/2 w-px h-full bg-white/10" />
          </div>
          
          <div className="space-y-4">
            <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
              Searching for Oğrashs...
            </div>
            <div className="w-80 h-3 bg-white/10 rounded-full mx-auto overflow-hidden border border-white/20">
              <div 
                className="h-full bg-gradient-to-r from-green-500 via-emerald-400 to-green-600 transition-all duration-100 shadow-lg"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-gray-400 text-lg">{progress}% Complete</p>
          </div>
        </div>
      )}

      {/* Ogrash Result Stage */}
      {stage === 'ograshResult' && (
        <div className="text-center fade-in max-w-2xl relative z-10">
          <div className="text-8xl mb-8">📍</div>
          <h2 className="text-5xl font-black text-white mb-8 tracking-tight">Oğrash Located!</h2>
          
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-10 mb-8 shadow-2xl">
            <div className="mb-8">
              <p className="text-xl text-gray-300 mb-2">Nearest Oğrash:</p>
              <p className="text-5xl text-white font-black mb-6 flex items-center justify-center gap-3">
                <span className="text-6xl">🇺🇸</span> Arizona, USA
              </p>
            </div>
            
            <div className="flex items-center justify-center gap-2 mb-8">
              <Zap className="text-orange-400" size={32} />
              <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                8,552 km
              </p>
              <span className="text-2xl text-gray-400">away</span>
            </div>
            
            <div className="border-t border-white/20 pt-8">
              <p className="text-sm text-gray-400 uppercase tracking-wider mb-4">Subject Profile</p>
              <div className="grid grid-cols-2 gap-6 text-left">
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <p className="text-gray-400 text-sm mb-1">Initials</p>
                  <p className="text-3xl font-bold text-green-400">MM</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <p className="text-gray-400 text-sm mb-1">Power Level</p>
                  <p className="text-xl font-bold text-orange-400">800 Quadrillion HP</p>
                </div>
              </div>
            </div>
          </div>
          
          <button
            onClick={reset}
            className="bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 text-white px-10 py-4 rounded-2xl text-xl font-semibold transition-all duration-300 hover:scale-105 border border-white/20 backdrop-blur-sm"
          >
            Search Again
          </button>
        </div>
      )}
    </div>
  );
}
