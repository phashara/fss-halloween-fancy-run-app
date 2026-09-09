import React, { useState } from 'react';
import { Map, MapPin, Droplets, HeartPulse, Camera, Sparkles, Navigation } from 'lucide-react';
import { ROUTE_CHECKPOINTS } from '../data/initialData';

export const RoutePage: React.FC = () => {
  const [activeDistance, setActiveDistance] = useState<'3.5' | '5.5'>('3.5');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-pink-400 bg-pink-950/60 border border-pink-500/30 uppercase">
          <Map className="w-3.5 h-3.5" />
          <span>Running Route & Map</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
          เส้นทางวิ่งรอบมหาวิทยาลัยนเรศวร
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          สัมผัสบรรยากาศยามค่ำคืนในรั้ว มน. จุดบริการน้ำดื่มทุก 1.5 กม. ปลอดภัยด้วยทีมงานรักษาความปลอดภัย
        </p>
      </div>

      {/* Distance Switcher */}
      <div className="flex justify-center">
        <div className="bg-[#14102d] p-1.5 rounded-2xl border border-purple-800/40 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveDistance('3.5')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeDistance === '3.5'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            3.5 KM • Fun Run (วิ่งชิล ๆ แฟนซี)
          </button>
          <button
            type="button"
            onClick={() => setActiveDistance('5.5')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeDistance === '5.5'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            5.5 KM • Fancy Mini Run (วิ่งรอบ มน.)
          </button>
        </div>
      </div>

      {/* Interactive Campus SVG Map */}
      <div className="bg-[#110e28] border-2 border-purple-900/50 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-bold text-white font-heading">
              แผนผังเส้นทาง {activeDistance === '3.5' ? '3.5 KM Fun Run' : '5.5 KM Fancy Mini Run'}
            </h2>
            <p className="text-xs text-slate-400">จุดเริ่มต้นและเส้นชัย ณ ลานหน้าคณะสังคมศาสตร์ ม.นเรศวร</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="flex items-center gap-1 text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
              <Droplets className="w-3.5 h-3.5" /> จุดบริการน้ำดื่ม (Water)
            </span>
            <span className="flex items-center gap-1 text-pink-400 bg-pink-950/60 px-2.5 py-1 rounded-full border border-pink-500/30">
              <Camera className="w-3.5 h-3.5" /> จุดถ่ายรูปผีเรืองแสง (Photo)
            </span>
          </div>
        </div>

        {/* High-Fidelity SVG Route Illustration */}
        <div className="relative w-full aspect-[16/9] bg-[#0c0a1f] rounded-2xl border border-purple-800/40 p-4 flex items-center justify-center overflow-hidden">
          <svg viewBox="0 0 800 450" className="w-full h-full">
            <defs>
              <linearGradient id="route-path-3" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ff6b00" />
                <stop offset="100%" stopColor="#ffd166" />
              </linearGradient>
              <linearGradient id="route-path-5" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#00ff9d" />
              </linearGradient>
            </defs>

            {/* Campus Base Road Grid */}
            <path d="M 80 80 L 720 80 L 720 370 L 80 370 Z" stroke="#1f1842" strokeWidth="24" fill="none" rx="20" />
            <path d="M 240 80 L 240 370" stroke="#1f1842" strokeWidth="16" fill="none" />
            <path d="M 520 80 L 520 370" stroke="#1f1842" strokeWidth="16" fill="none" />
            <path d="M 80 225 L 720 225" stroke="#1f1842" strokeWidth="16" fill="none" />

            {/* Campus Landmark Buildings */}
            <rect x="120" y="240" width="90" height="90" rx="12" fill="#24174d" stroke="#6d28d9" strokeWidth="2" />
            <text x="165" y="280" textAnchor="middle" fill="#facc15" fontFamily="Prompt" fontWeight="700" fontSize="12">
              คณะสังคมศาสตร์
            </text>
            <text x="165" y="300" textAnchor="middle" fill="#cbd5e1" fontFamily="Prompt" fontSize="10">
              (START / FINISH)
            </text>

            <rect x="300" y="110" width="160" height="80" rx="12" fill="#1b153b" stroke="#4c1d95" strokeWidth="1.5" />
            <text x="380" y="150" textAnchor="middle" fill="#e2e8f0" fontFamily="Prompt" fontSize="12">
              อาคาร QS (เฉลิมพระเกียรติ)
            </text>

            <rect x="580" y="250" width="100" height="80" rx="12" fill="#1b153b" stroke="#4c1d95" strokeWidth="1.5" />
            <text x="630" y="295" textAnchor="middle" fill="#e2e8f0" fontFamily="Prompt" fontSize="12">
              ประตู 1 ม.นเรศวร
            </text>

            {/* Selected Route Line */}
            {activeDistance === '3.5' ? (
              <path
                d="M 165 330 L 165 370 L 520 370 L 520 225 L 240 225 L 240 285 L 165 285"
                stroke="url(#route-path-3)"
                strokeWidth="7"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-pulse"
              />
            ) : (
              <path
                d="M 165 330 L 165 370 L 720 370 L 720 80 L 240 80 L 240 225 L 165 285"
                stroke="url(#route-path-5)"
                strokeWidth="7"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-pulse"
              />
            )}

            {/* Checkpoint Markers */}
            <circle cx="165" cy="330" r="14" fill="#ff6b00" />
            <text x="165" y="335" textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="12">★</text>

            {/* Water Point 1 */}
            <circle cx="380" cy="370" r="10" fill="#0284c7" />
            <text x="380" y="365" textAnchor="middle" fill="#38bdf8" fontSize="18">💧</text>

            {/* Photo Spot 1 */}
            <circle cx="520" cy="300" r="10" fill="#ec4899" />
            <text x="520" y="295" textAnchor="middle" fill="#f472b6" fontSize="18">📸</text>

            {/* Water Point 2 (for 5.5K) */}
            {activeDistance === '5.5' && (
              <>
                <circle cx="720" cy="225" r="10" fill="#0284c7" />
                <text x="720" y="220" textAnchor="middle" fill="#38bdf8" fontSize="18">💧</text>
                <circle cx="480" cy="80" r="10" fill="#ec4899" />
                <text x="480" y="75" textAnchor="middle" fill="#f472b6" fontSize="18">📸</text>
              </>
            )}
          </svg>
        </div>
      </div>

      {/* Checkpoints & Facilities List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ROUTE_CHECKPOINTS.map((cp) => (
          <div
            key={cp.step}
            className="bg-[#13102b] border border-purple-900/40 rounded-2xl p-4 flex items-start gap-3 shadow-lg"
          >
            <div className={`p-2.5 rounded-xl shrink-0 ${
              cp.type === 'start' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
              cp.type === 'water' ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' :
              cp.type === 'photo' ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' :
              'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            }`}>
              {cp.type === 'water' ? <Droplets className="w-5 h-5" /> :
               cp.type === 'photo' ? <Camera className="w-5 h-5" /> :
               <MapPin className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-sm">{cp.name}</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-950 text-amber-300">
                  {cp.distance}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">{cp.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
