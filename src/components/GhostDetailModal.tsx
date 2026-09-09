import React, { useState } from 'react';
import { X, Sparkles, Flame, Skull, Zap, Eye } from 'lucide-react';
import { GhostCharacter } from '../types';
import { GhostAvatar } from './GhostAvatar';
import { storageService } from '../data/storage';

interface GhostDetailModalProps {
  ghost: GhostCharacter | null;
  onClose: () => void;
  onSelectRegister: () => void;
  initialHorrorMode?: boolean;
}

export const GhostDetailModal: React.FC<GhostDetailModalProps> = ({
  ghost,
  onClose,
  onSelectRegister,
  initialHorrorMode,
}) => {
  const [isHorror, setIsHorror] = useState<boolean>(() => {
    if (typeof initialHorrorMode === 'boolean') return initialHorrorMode;
    return storageService.getGhostThemeMode() === 'horror';
  });

  if (!ghost) return null;

  const displayName = isHorror && ghost.scaryName ? ghost.scaryName : ghost.name;
  const displayTagline = isHorror && ghost.scaryTagline ? ghost.scaryTagline : ghost.tagline;
  const displayDescription = isHorror && ghost.scaryDescription ? ghost.scaryDescription : ghost.description;
  const displaySkill = isHorror && ghost.scarySpecialSkill ? ghost.scarySpecialSkill : ghost.specialSkill;
  const displayScore = isHorror && ghost.scaryScore ? ghost.scaryScore : ghost.cuteScore;
  const glowColor = isHorror && ghost.scaryColor ? ghost.scaryColor : ghost.color;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className={`relative w-full max-w-md bg-[#120d24] border-2 ${
          isHorror ? 'border-red-600/60 shadow-red-950/70' : 'border-purple-800/60 shadow-purple-950/70'
        } rounded-3xl p-6 sm:p-7 shadow-2xl text-slate-100 overflow-hidden transition-all duration-300`}
      >
        {/* Atmosphere glow */}
        <div
          className="absolute -top-20 -right-20 w-52 h-52 rounded-full blur-3xl opacity-30 pointer-events-none transition-colors duration-500"
          style={{ backgroundColor: glowColor }}
        />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/70 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Mode Toggle Bar */}
        <div className="flex items-center justify-center mb-3">
          <div className="inline-flex p-1 bg-black/50 backdrop-blur-sm border border-slate-700/60 rounded-full text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setIsHorror(true);
                storageService.setGhostThemeMode('horror');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
                isHorror 
                  ? 'bg-red-600 text-white shadow-md shadow-red-900/50 font-bold' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Skull className="w-3.5 h-3.5 text-red-200" />
              <span>โหมดสยองขวัญ 💀</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsHorror(false);
                storageService.setGhostThemeMode('cute');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
                !isHorror 
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-900/50 font-bold' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>โหมดแฟนซีคิ้วท์ 🎃</span>
            </button>
          </div>
        </div>

        {/* Character Avatar */}
        <div className="flex flex-col items-center text-center mt-1 mb-3">
          <div 
            className={`relative p-3 rounded-full bg-gradient-to-b ${
              isHorror ? 'from-red-950/60 via-stone-900 to-[#120a0f] border-red-600/50' : 'from-purple-900/40 to-[#100b24] border-purple-700/50'
            } border mb-3 shadow-inner transition-all duration-300`}
          >
            <GhostAvatar code={ghost.code} size={135} isScary={isHorror} />
            <span
              className="absolute bottom-1 right-2 px-3 py-0.5 rounded-full text-xs font-bold text-white shadow-md"
              style={{ backgroundColor: glowColor }}
            >
              {ghost.code}
            </span>
          </div>

          <span className={`text-[11px] uppercase font-bold tracking-wider ${isHorror ? 'text-red-400' : 'text-pink-300'}`}>
            {isHorror ? '💀 ผีไทยระดับความเฮี้ยนสูงสุด 10/10' : '🎃 คาแรกเตอร์ผีไทยแฟนซีรัน 2026'}
          </span>
          <h3 className="text-2xl font-black text-white font-heading mt-0.5 tracking-tight">
            {displayName}
          </h3>
          <p className={`text-xs sm:text-sm font-semibold italic mt-1 px-4 ${isHorror ? 'text-rose-300' : 'text-amber-300'}`}>
            “{displayTagline}”
          </p>
        </div>

        {/* Description */}
        <div className={`p-4 rounded-2xl border ${
          isHorror ? 'bg-red-950/30 border-red-900/50 text-rose-100/90' : 'bg-[#1b153b]/80 border-purple-900/50 text-slate-300'
        } mb-3 text-xs leading-relaxed transition-colors duration-300`}>
          {displayDescription}
        </div>

        {/* Special Skill */}
        {displaySkill && (
          <div className="bg-black/40 p-3 rounded-2xl border border-slate-800 mb-3 text-xs flex items-start gap-2">
            <Zap className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isHorror ? 'text-red-400' : 'text-amber-400'}`} />
            <div>
              <span className="font-bold text-white">สกิลประจำตัว: </span>
              <span className="text-slate-300">{displaySkill}</span>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          <div className="bg-[#171133] p-3 rounded-xl border border-purple-900/40">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span>ความเร็วเข้าเส้นชัย</span>
            </div>
            <div className="text-sm font-bold text-orange-300 mt-1">{ghost.speed}</div>
          </div>

          <div className={`p-3 rounded-xl border ${
            isHorror ? 'bg-red-950/40 border-red-800/40' : 'bg-[#171133] border-purple-900/40'
          }`}>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              {isHorror ? <Skull className="w-3.5 h-3.5 text-red-400" /> : <Sparkles className="w-3.5 h-3.5 text-pink-400" />}
              <span>{isHorror ? 'ระดับความสยอง' : 'ความน่ารักเป็นมิตร'}</span>
            </div>
            <div className={`text-sm font-bold mt-1 ${isHorror ? 'text-red-300' : 'text-pink-300'}`}>
              {displayScore}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={() => {
            onClose();
            onSelectRegister();
          }}
          className={`w-full py-3.5 rounded-2xl ${
            isHorror 
              ? 'bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white shadow-red-600/30' 
              : 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-orange-500/25'
          } font-black text-sm hover:brightness-110 active:scale-[0.98] transition-all shadow-lg flex items-center justify-center gap-2`}
        >
          <Skull className="w-4 h-4" />
          <span>ลงทะเบียนเพื่อสุ่มรับการ์ดผีตนนี้!</span>
        </button>
      </div>
    </div>
  );
};
