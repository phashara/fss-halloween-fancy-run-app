import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Award, 
  Users, 
  ShoppingBag, 
  Search, 
  ChevronRight, 
  Flame, 
  Gift,
  Skull
} from 'lucide-react';
import { GhostCharacter, EventSettings } from '../types';
import { GhostAvatar } from './GhostAvatar';
import { storageService } from '../data/storage';

interface HeroSectionProps {
  settings: EventSettings;
  ghosts: GhostCharacter[];
  applicantCount?: number;
  registeredCount?: number;
  onRegisterClick: () => void;
  onShirtClick?: () => void;
  onViewShirtClick?: () => void;
  onStatusClick?: () => void;
  onSelectGhostPreview?: (ghost: GhostCharacter) => void;
  onSelectGhost?: (ghost: GhostCharacter) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  settings,
  ghosts,
  applicantCount,
  registeredCount,
  onRegisterClick,
  onShirtClick,
  onViewShirtClick,
  onStatusClick,
  onSelectGhostPreview,
  onSelectGhost,
}) => {
  const currentCount = applicantCount ?? registeredCount ?? 0;
  const maxCap = settings.maxCapacity || settings.registrationQuota || 2000;
  const handleShirtClick = onShirtClick || onViewShirtClick || (() => {});
  const handleSelectGhost = onSelectGhostPreview || onSelectGhost || (() => {});
  // Countdown calculation to October 31, 2026 16:30:00
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [isHorrorMode, setIsHorrorMode] = useState<boolean>(() => {
    return storageService.getGhostThemeMode() === 'horror';
  });

  useEffect(() => {
    const handleStorageUpdate = () => {
      setIsHorrorMode(storageService.getGhostThemeMode() === 'horror');
    };
    window.addEventListener('fss_storage_update', handleStorageUpdate);
    return () => window.removeEventListener('fss_storage_update', handleStorageUpdate);
  }, []);

  useEffect(() => {
    const targetDate = new Date('2026-10-31T16:30:00+07:00').getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const progressPercent = Math.min(100, Math.round((currentCount / maxCap) * 100));

  return (
    <div className="relative overflow-hidden pt-6 pb-16 lg:pb-24">
      {/* Background Animated Atmosphere */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[500px] bg-gradient-to-b from-purple-900/30 via-orange-600/10 to-transparent blur-[140px] pointer-events-none -z-10 rounded-full" />

      {/* Floating Ghost Moon */}
      <div className="absolute top-12 right-6 lg:right-24 w-28 h-28 sm:w-44 sm:h-44 rounded-full bg-gradient-to-br from-amber-100 via-amber-200 to-amber-400 opacity-20 blur-sm pointer-events-none -z-10 animate-pulse" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Trust Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-950/80 to-slate-900/90 border border-purple-600/40 text-xs sm:text-sm text-purple-200 shadow-lg backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-semibold text-white">เปิดรับสมัครอย่างเป็นทางการ</span>
            <span className="text-slate-400">•</span>
            <span className="text-amber-300 font-bold">สมัครฟรี 100% ไม่บังคับซื้อเสื้อ</span>
          </div>
        </div>

        {/* Main Hero Typography & Callout */}
        <div className="text-center max-w-4xl mx-auto space-y-5">
          <div className="inline-block">
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-orange-400 bg-orange-500/10 px-4 py-1 rounded-full border border-orange-500/20">
              FACULTY OF SOCIAL SCIENCES • NARESUAN UNIVERSITY
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white font-heading tracking-tight leading-tight">
            FSS HALLOWEEN <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500">
              FANCY RUN 2026
            </span>
          </h1>

          <div className="flex items-center justify-center gap-2 text-lg sm:text-2xl font-bold text-slate-200">
            <span className="text-pink-400">“THAI GHOST EDITION”</span>
            <span className="text-slate-500">|</span>
            <span className="text-emerald-300">ปลุกตำนานผีไทย แล้วออกวิ่งไปด้วยกัน!</span>
          </div>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            วิ่งฮาโลวีนสุดคิวท์รอบมหาวิทยาลัยนเรศวร สนุกกับระบบ <strong className="text-white">สุ่มการ์ดตัวละครผีไทย 12 แบบ</strong> พร้อม QR Code เช็กอินหน้างาน ชิงรางวัลประกวดแต่งกายแฟนซีกว่า 20,000 บาท ฟรีอาหาร เครื่องดื่ม และมินิคอนเสิร์ตสุดพิเศษ!
          </p>

          {/* Core Free Registration Guarantee Box */}
          <div className="max-w-xl mx-auto p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-purple-950/60 border border-emerald-500/40 text-xs sm:text-sm text-emerald-200 flex items-center gap-3 text-left shadow-lg">
            <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
            <div>
              <div className="font-bold text-white">เงื่อนไขชัดเจน โปร่งใส</div>
              <div>
                กิจกรรมนี้เปิดให้ลงทะเบียน <strong>ฟรีโดยสมบูรณ์</strong> ผู้สมัครไม่จำเป็นต้องซื้อเสื้อ ส่วนเสื้อที่ระลึกเป็นสินค้าทางเลือกตามความสมัครใจเพื่อสมทบทุนจัดกิจกรรม
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={onRegisterClick}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-slate-950 font-extrabold text-base sm:text-lg hover:from-orange-400 hover:to-amber-400 active:scale-95 transition-all shadow-xl shadow-orange-500/30 flex items-center gap-2 group"
            >
              <Sparkles className="w-5 h-5 text-slate-950 group-hover:rotate-12 transition-transform" />
              <span>ลงทะเบียนฟรี & สุ่มการ์ดผี</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              type="button"
              onClick={handleShirtClick}
              className="px-6 py-4 rounded-2xl bg-purple-950/80 hover:bg-purple-900/90 text-white font-bold text-sm sm:text-base border border-purple-700/60 transition-all flex items-center gap-2 shadow-lg hover:border-orange-500/50"
            >
              <ShoppingBag className="w-5 h-5 text-pink-400" />
              <span>ดูเสื้อที่ระลึก (ทางเลือก)</span>
            </button>

            <button
              type="button"
              onClick={onStatusClick}
              className="px-5 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 font-semibold text-sm border border-slate-700/60 transition-all flex items-center gap-2"
            >
              <Search className="w-4 h-4 text-sky-400" />
              <span>ตรวจสอบสถานะ</span>
            </button>
          </div>
        </div>

        {/* Live Registration Capacity & Countdown Stats Card */}
        <div className="mt-12 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Live Progress Box */}
          <div className="bg-[#121128]/90 border border-purple-900/50 rounded-3xl p-6 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  ยอดผู้ลงทะเบียนขณะนี้
                </h2>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-500/30">
                รับได้อีก {Math.max(0, maxCap - currentCount).toLocaleString()} คน
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
                {currentCount.toLocaleString()}
              </span>
              <span className="text-sm text-slate-400">
                / {maxCap.toLocaleString()} คน ({progressPercent}%)
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800/80 h-3.5 rounded-full overflow-hidden p-0.5 border border-purple-900/40">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-orange-400 transition-all duration-1000 shadow-sm"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
              <span>เป้าหมาย 2,000 คน</span>
              <span className="text-orange-400 font-semibold">
                {progressPercent >= 80 ? '⚡ ยอดสมัครใกล้เต็มแล้ว' : 'เปิดรับสมัครจนถึง 25 ต.ค. 2569'}
              </span>
            </div>
          </div>

          {/* Countdown Clock Box */}
          <div className="bg-[#121128]/90 border border-purple-900/50 rounded-3xl p-6 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  นับถอยหลังสู่วันงาน 31 ต.ค. 2569
                </h2>
              </div>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-orange-400" /> 16:30 น.
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center my-2">
              <div className="bg-purple-950/60 border border-purple-800/40 rounded-2xl p-2.5">
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono">
                  {timeLeft.days}
                </div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">วัน</div>
              </div>

              <div className="bg-purple-950/60 border border-purple-800/40 rounded-2xl p-2.5">
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono">
                  {String(timeLeft.hours).padStart(2, '0')}
                </div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">ชั่วโมง</div>
              </div>

              <div className="bg-purple-950/60 border border-purple-800/40 rounded-2xl p-2.5">
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">นาที</div>
              </div>

              <div className="bg-purple-950/60 border border-purple-800/40 rounded-2xl p-2.5">
                <div className="text-2xl sm:text-3xl font-extrabold text-orange-400 font-mono animate-pulse">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">วินาที</div>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 text-center mt-2 flex items-center justify-center gap-1">
              <MapPin className="w-3 h-3 text-pink-400" />
              <span>ลานหน้าคณะสังคมศาสตร์ มหาวิทยาลัยนเรศวร จ.พิษณุโลก</span>
            </div>
          </div>
        </div>

        {/* 12 Thai Ghost Characters Carousel Preview */}
        <div className="mt-16 text-center">
          {/* Mode Switcher Banner */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-rose-300 bg-rose-950/60 border border-rose-500/40">
              <Gift className="w-3.5 h-3.5" />
              <span>สุ่มรับ 1 ใน 12 คาแรกเตอร์ผีไทยประจำตัวคุณ</span>
            </div>

            {/* Horror / Cute Mode Pill Toggle */}
            <div className="inline-flex p-1 bg-black/60 backdrop-blur-md border border-slate-700/80 rounded-full text-xs font-semibold shadow-xl">
              <button
                type="button"
                onClick={() => {
                  setIsHorrorMode(true);
                  storageService.setGhostThemeMode('horror');
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all ${
                  isHorrorMode 
                    ? 'bg-red-600 text-white shadow-lg shadow-red-950 font-bold' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Skull className="w-3.5 h-3.5 text-red-200 animate-pulse" />
                <span>โหมดผีเฮี้ยนสยองขวัญ 💀</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsHorrorMode(false);
                  storageService.setGhostThemeMode('cute');
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all ${
                  !isHorrorMode 
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-950 font-bold' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>โหมดแฟนซีคิ้วท์ 🎃</span>
              </button>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight">
            {isHorrorMode ? (
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-amber-500">
                12 คาแรกเตอร์ผีไทยสุดเฮี้ยน สยองขวัญสมจริง! 💀
              </span>
            ) : (
              <span>ทำความรู้จักเหล่า “ผีไทยน่ารัก” ทั้ง 12 คาแรกเตอร์</span>
            )}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5 max-w-2xl mx-auto">
            {isHorrorMode 
              ? 'จัดเต็มความหลอนรับฮาโลวีน ทั้งหัวกระสือไส้โชกเลือด กระหังทมิฬ นางรำคอหัก และเปรตขุมนรก (คลิกที่การ์ดเพื่ออ่านประวัติความเฮี้ยน)'
              : 'เมื่อลงทะเบียนสำเร็จ ระบบจะสุ่มการ์ดผีไทยประจำตัวพร้อม QR Code เช็กอินให้คุณทันที! (คลิกที่การ์ดเพื่อดูข้อมูล)'
            }
          </p>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {ghosts.map((ghost) => {
              const name = isHorrorMode && ghost.scaryName ? ghost.scaryName : ghost.name;
              const tagline = isHorrorMode && ghost.scaryTagline ? ghost.scaryTagline : ghost.tagline;
              const score = isHorrorMode && ghost.scaryScore ? ghost.scaryScore : ghost.cuteScore;
              const color = isHorrorMode && ghost.scaryColor ? ghost.scaryColor : ghost.color;

              return (
                <button
                  key={ghost.id}
                  type="button"
                  onClick={() => handleSelectGhost(ghost)}
                  className={`group relative ${
                    isHorrorMode 
                      ? 'bg-[#150d18] hover:bg-[#201020] border-red-900/40 hover:border-red-500/70 shadow-red-950/40' 
                      : 'bg-[#131126] hover:bg-[#1c1738] border-purple-900/40 hover:border-orange-500/60 shadow-purple-950/50'
                  } p-4 rounded-2xl border transition-all text-center flex flex-col items-center hover:-translate-y-1.5 shadow-lg`}
                >
                  <div className="relative mb-2">
                    <GhostAvatar 
                      code={ghost.code} 
                      size={85} 
                      isScary={isHorrorMode}
                      className="group-hover:scale-110 transition-transform duration-300" 
                    />
                    <span
                      className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow-sm"
                      style={{ backgroundColor: color }}
                    >
                      {ghost.code}
                    </span>
                  </div>
                  <h3 className={`text-xs font-black text-white ${
                    isHorrorMode ? 'group-hover:text-red-400' : 'group-hover:text-orange-300'
                  } transition-colors line-clamp-1`}>
                    {name}
                  </h3>
                  <span className={`text-[10px] ${
                    isHorrorMode ? 'text-red-300/80' : 'text-amber-300/80'
                  } font-medium line-clamp-1 mt-0.5`}>
                    {tagline}
                  </span>
                  <div className="mt-2 text-[9px] px-2 py-0.5 rounded-full bg-black/40 text-slate-400 font-semibold border border-white/5">
                    {score}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3 Key Highlights Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#121024] p-6 rounded-3xl border border-purple-900/40 relative overflow-hidden group hover:border-purple-600/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-heading mb-1">
              ระบบสุ่มการ์ดผีไทย & เช็กอิน
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              ผู้สมัครทุกคนได้รับภาพการ์ดสุดน่ารักสัดส่วน Story สำหรับแชร์ลงโซเชียล พร้อม QR Code เช็กอินเข้าร่วมกิจกรรมอย่างสะดวกรวดเร็ว
            </p>
          </div>

          <div className="bg-[#121024] p-6 rounded-3xl border border-purple-900/40 relative overflow-hidden group hover:border-purple-600/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 mb-4">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-heading mb-1">
              ประกวดแฟนซี ชิงเงินรางวัล 20,000 บาท
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              แต่งกายธีมผีไทยหรือฮาโลวีนแฟนซี ชิงรางวัลประเภทเดี่ยว ประเภททีม และรางวัลขวัญใจผีไทยสุดน่ารัก มีจุดถ่ายรูปเรืองแสงตลอดเส้นทาง
            </p>
          </div>

          <div className="bg-[#121024] p-6 rounded-3xl border border-purple-900/40 relative overflow-hidden group hover:border-purple-600/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-heading mb-1">
              ฟรีอาหาร เครื่องดื่ม & มินิคอนเสิร์ต
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              มีจุดบริการน้ำดื่มทุก 1.5 กม. ขนมฮาโลวีนแจกไม่อั้นหลังเข้าเส้นชัย และมันส์ไปกับดนตรีสดจากวงดนตรีมหาวิทยาลัยนเรศวร
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
