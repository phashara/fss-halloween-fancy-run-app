import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import { 
  Download, 
  Share2, 
  Copy, 
  Check, 
  Mail, 
  QrCode, 
  Sparkles, 
  Eye, 
  EyeOff, 
  Calendar, 
  MapPin, 
  Flame, 
  ExternalLink,
  Skull 
} from 'lucide-react';
import { Applicant, GhostCharacter, EventSettings } from '../types';
import { GhostAvatar } from './GhostAvatar';
import { storageService } from '../data/storage';

interface ParticipantCardProps {
  applicant: Applicant;
  ghost: GhostCharacter;
  settings: EventSettings;
  onOpenEmailPreview?: () => void;
  showRevealEffect?: boolean;
}

export const ParticipantCard: React.FC<ParticipantCardProps> = ({
  applicant,
  ghost,
  settings,
  onOpenEmailPreview,
  showRevealEffect = false,
}) => {
  const [cardMode, setCardMode] = useState<'private' | 'share'>('private');
  const [isHorrorMode, setIsHorrorMode] = useState<boolean>(() => storageService.getGhostThemeMode() === 'horror');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [shareQrDataUrl, setShareQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Generate real QR code for check-in token and general share
  useEffect(() => {
    // Private QR code contains the secure check-in token
    QRCode.toDataURL(applicant.checkinToken, {
      width: 240,
      margin: 1,
      color: {
        dark: '#1e1035',
        light: '#ffffff',
      },
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('QR Error:', err));

    // Share QR links to general event registration page
    QRCode.toDataURL(window.location.origin, {
      width: 240,
      margin: 1,
      color: {
        dark: '#1e1035',
        light: '#ffffff',
      },
    })
      .then(url => setShareQrDataUrl(url))
      .catch(err => console.error('QR Error:', err));
  }, [applicant.checkinToken]);

  // Trigger celebration confetti on reveal
  useEffect(() => {
    if (showRevealEffect) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ff6b00', '#00ff9d', '#e879f9', '#ffd166'],
        });
      } catch {
        // Safe fallback
      }
    }
  }, [showRevealEffect]);

  // Copy share message to clipboard
  const handleCopyShareText = () => {
    const shareText = `ฉันคือ “${ghost.name}” 👻\nแล้วคุณล่ะคือผีอะไร?\nมาค้นหาตัวตนของคุณใน FSS Halloween Fancy Run 2026\n#FSSHalloweenFancyRun2026 #ThaiGhostEdition #คณะสังคมศาสตร์มน`;
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Download high-res PNG
  const handleDownloadCard = async () => {
    setIsDownloading(true);
    storageService.incrementDownload(applicant.id);

    try {
      const canvas = document.createElement('canvas');
      const width = 800;
      const height = 1200;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas not supported');

      // Background Gradient
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#100b24');
      grad.addColorStop(0.5, '#1e123d');
      grad.addColorStop(1, '#090514');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Atmospheric Glow circles
      const glowGrad = ctx.createRadialGradient(400, 360, 50, 400, 360, 350);
      glowGrad.addColorStop(0, ghost.color + '44');
      glowGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, width, height);

      // Card Border with neon glow
      ctx.strokeStyle = '#ff6b00';
      ctx.lineWidth = 6;
      ctx.strokeRect(30, 30, width - 60, height - 60);

      ctx.strokeStyle = '#00ff9d44';
      ctx.lineWidth = 2;
      ctx.strokeRect(40, 40, width - 80, height - 80);

      // Event Header
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 24px Prompt, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('FACULTY OF SOCIAL SCIENCES • NARESUAN UNIVERSITY', width / 2, 85);

      ctx.fillStyle = '#ff8811';
      ctx.font = '800 36px Mitr, Prompt, sans-serif';
      ctx.fillText('FSS HALLOWEEN FANCY RUN 2026', width / 2, 130);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '20px Prompt, sans-serif';
      ctx.fillText('THAI GHOST EDITION • ปลุกตำนานผีไทย แล้วออกวิ่งไปด้วยกัน', width / 2, 165);

      // Decorative divider
      ctx.strokeStyle = '#ff6b0066';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(120, 190);
      ctx.lineTo(width - 120, 190);
      ctx.stroke();

      // "คุณคือ..."
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 26px Prompt, sans-serif';
      ctx.fillText('คุณคือ...', width / 2, 240);

      // Ghost Character Name
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 48px Mitr, Prompt, sans-serif';
      ctx.fillText(ghost.name, width / 2, 295);

      // Ghost Avatar Drawing: serialize SVG
      // Draw Ghost placeholder circle & badge
      ctx.save();
      ctx.fillStyle = '#26174a';
      ctx.beginPath();
      ctx.arc(width / 2, 450, 130, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = ghost.color;
      ctx.lineWidth = 6;
      ctx.stroke();
      ctx.restore();

      // Ghost Code Badge
      ctx.fillStyle = ghost.color;
      ctx.beginPath();
      ctx.roundRect(width / 2 - 60, 560, 120, 36, 18);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px Prompt, sans-serif';
      ctx.fillText(ghost.code, width / 2, 584);

      // Ghost Tagline & Description
      ctx.fillStyle = '#fed7aa';
      ctx.font = 'bold 24px Prompt, sans-serif';
      ctx.fillText(`“${ghost.tagline}”`, width / 2, 635);

      ctx.fillStyle = '#e2e8f0';
      ctx.font = '20px Prompt, sans-serif';
      ctx.fillText(ghost.description, width / 2, 675);

      // Participant Info Box (Safe public data only)
      ctx.fillStyle = '#160d30';
      ctx.beginPath();
      ctx.roundRect(100, 715, width - 200, 75, 12);
      ctx.fill();
      ctx.strokeStyle = '#33235d';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = '16px Prompt, sans-serif';
      ctx.fillText('หมายเลขผู้สมัคร (BIB NUMBER)', 240, 745);
      ctx.fillText('ประเภทผู้สมัคร', width - 240, 745);

      ctx.fillStyle = '#00ff9d';
      ctx.font = 'bold 24px Mitr, Prompt, sans-serif';
      ctx.fillText(applicant.registrationNumber, 240, 775);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 19px Prompt, sans-serif';
      ctx.fillText(applicant.applicantType, width - 240, 775);

      // QR Code Section
      const currentQr = cardMode === 'private' ? qrDataUrl : shareQrDataUrl;
      if (currentQr) {
        const qrImage = new Image();
        qrImage.crossOrigin = 'anonymous';
        qrImage.src = currentQr;
        await new Promise((resolve) => {
          qrImage.onload = () => {
            // White card for QR
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.roundRect(width / 2 - 100, 810, 200, 200, 16);
            ctx.fill();
            ctx.drawImage(qrImage, width / 2 - 90, 820, 180, 180);
            resolve(true);
          };
          qrImage.onerror = () => resolve(false);
        });
      }

      // QR Label
      ctx.fillStyle = cardMode === 'private' ? '#00ff9d' : '#f59e0b';
      ctx.font = 'bold 20px Prompt, sans-serif';
      const qrLabel = cardMode === 'private' 
        ? 'สแกน QR Code นี้เพื่อเช็กอินวันงาน' 
        : 'สแกนเพื่อร่วมสนุกและสมัครเข้าร่วมงาน';
      ctx.fillText(qrLabel, width / 2, 1045);

      if (cardMode === 'private') {
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '15px Prompt, sans-serif';
        ctx.fillText(`TOKEN: ${applicant.checkinToken}`, width / 2, 1075);
      }

      // Footer Info
      ctx.fillStyle = '#facc15';
      ctx.font = 'bold 18px Prompt, sans-serif';
      ctx.fillText(`วันจัดกิจกรรม: เสาร์ที่ 31 ตุลาคม 2569 เวลา 16:30 น.`, width / 2, 1120);

      ctx.fillStyle = '#64748b';
      ctx.font = '15px Prompt, sans-serif';
      ctx.fillText(`คณะสังคมศาสตร์ มหาวิทยาลัยนเรศวร • www.fss.nu.ac.th`, width / 2, 1148);

      // Trigger Download
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `FSS26-GhostCard-${applicant.registrationNumber}-${cardMode}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to export card:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Mode Switcher Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-6">
        <div className="flex items-center gap-1.5 bg-[#12142b] p-1.5 rounded-2xl border border-purple-900/40 shadow-lg">
          <button
            type="button"
            onClick={() => setCardMode('private')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              cardMode === 'private'
                ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md shadow-orange-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <QrCode className="w-3.5 h-3.5 text-emerald-400" />
            <span>การ์ดส่วนตัว (มี QR)</span>
          </button>

          <button
            type="button"
            onClick={() => setCardMode('share')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              cardMode === 'share'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Share2 className="w-3.5 h-3.5 text-pink-400" />
            <span>การ์ดแชร์โซเชียล</span>
          </button>
        </div>

        {/* Horror / Cute Theme Toggle for Card */}
        <div className="flex items-center p-1 bg-black/60 backdrop-blur-sm border border-slate-700/80 rounded-2xl text-xs font-semibold shadow-lg">
          <button
            type="button"
            onClick={() => {
              setIsHorrorMode(true);
              storageService.setGhostThemeMode('horror');
            }}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
              isHorrorMode 
                ? 'bg-red-600 text-white shadow-md shadow-red-950 font-bold' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Skull className="w-3.5 h-3.5 text-red-200 animate-pulse" />
            <span>โหมดสยองขวัญ 💀</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setIsHorrorMode(false);
              storageService.setGhostThemeMode('cute');
            }}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
              !isHorrorMode 
                ? 'bg-purple-600 text-white shadow-md shadow-purple-950 font-bold' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>โหมดแฟนซี 🎃</span>
          </button>
        </div>
      </div>

      {/* Main Card View (Designed in 9:16 / vertical story format) */}
      <div
        ref={cardRef}
        className={`relative w-full max-w-[390px] rounded-3xl overflow-hidden border-2 ${
          isHorrorMode ? 'border-red-600/80 shadow-red-950/80' : 'border-orange-500/80 shadow-purple-950/80'
        } shadow-2xl bg-gradient-to-b from-[#140c2b] via-[#1a1138] to-[#0a0718] p-6 text-center text-white transition-all duration-300`}
        style={{
          boxShadow: `0 20px 50px -10px ${isHorrorMode && ghost.scaryColor ? ghost.scaryColor : ghost.color}33, 0 0 30px -5px rgba(220, 38, 38, 0.3)`,
        }}
      >
        {/* Background Atmospheric Elements */}
        <div 
          className="absolute -top-24 -left-24 w-56 h-56 rounded-full blur-3xl opacity-40 pointer-events-none transition-colors duration-500"
          style={{ backgroundColor: isHorrorMode && ghost.scaryColor ? ghost.scaryColor : ghost.color }}
        />
        <div className="absolute top-1/2 -right-24 w-56 h-56 rounded-full blur-3xl opacity-20 bg-emerald-500 pointer-events-none" />

        {/* Card Header */}
        <div className="relative z-10 mb-4">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider ${
            isHorrorMode ? 'text-rose-300 bg-red-950/40 border-red-500/40' : 'text-amber-300 bg-amber-500/10 border-amber-500/30'
          } border uppercase mb-2`}>
            {isHorrorMode ? <Skull className="w-3 h-3 text-red-400" /> : <Sparkles className="w-3 h-3 text-amber-400" />}
            คณะสังคมศาสตร์ ม.นเรศวร
          </div>
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-200 to-orange-500 font-heading tracking-wide">
            FSS HALLOWEEN FANCY RUN 2026
          </h2>
          <p className="text-[12px] text-slate-400">
            {isHorrorMode ? 'Thai Ghost Horror Edition • คืนปล่อยผีสุดหลอน' : 'Thai Ghost Edition • ปลุกตำนานผีไทย'}
          </p>
        </div>

        {/* Ghost Reveal Intro */}
        <div className="relative z-10 mb-2">
          <span className={`text-xs uppercase font-bold tracking-widest ${
            isHorrorMode ? 'text-red-400 bg-red-950/70 border-red-500/30' : 'text-sky-400 bg-sky-950/60 border-sky-500/20'
          } px-3 py-0.5 rounded-full border`}>
            {isHorrorMode ? '💀 ร่างผีเฮี้ยนสยองขวัญของคุณ' : 'คุณคือ...'}
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-white font-heading mt-1 drop-shadow-md">
            {isHorrorMode && ghost.scaryName ? ghost.scaryName : ghost.name}
          </h3>
        </div>

        {/* Ghost Avatar with Halo */}
        <div className="relative z-10 flex justify-center my-3">
          <div className={`relative p-2 rounded-full bg-gradient-to-b ${
            isHorrorMode ? 'from-red-950/70 via-stone-900 to-[#120a0f] border-red-600/60' : 'from-purple-900/60 to-purple-950/90 border-orange-500/50'
          } border-2 shadow-inner`}>
            <GhostAvatar 
              code={ghost.code} 
              size={150} 
              isScary={isHorrorMode}
              className="filter drop-shadow-lg" 
            />
            <span 
              className="absolute -bottom-2 right-4 px-3 py-0.5 rounded-full text-xs font-bold text-white shadow-md"
              style={{ backgroundColor: isHorrorMode && ghost.scaryColor ? ghost.scaryColor : ghost.color }}
            >
              {ghost.code}
            </span>
          </div>
        </div>

        {/* Ghost Tagline & Personality */}
        <div className="relative z-10 mb-4 px-2">
          <p className={`text-sm font-bold ${isHorrorMode ? 'text-rose-300' : 'text-amber-300'} italic mb-1`}>
            “{isHorrorMode && ghost.scaryTagline ? ghost.scaryTagline : ghost.tagline}”
          </p>
          <p className="text-xs text-slate-300 leading-relaxed">
            {isHorrorMode && ghost.scaryDescription ? ghost.scaryDescription : ghost.description}
          </p>
        </div>

        {/* Personality Stats Pill */}
        <div className="relative z-10 grid grid-cols-2 gap-2 mb-4 text-left">
          <div className="bg-[#1e1540]/80 p-2 rounded-xl border border-purple-800/40">
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              <Flame className="w-3 h-3 text-orange-400" />
              <span>ความเร็วเข้าเส้นชัย</span>
            </div>
            <div className="text-xs font-bold text-orange-300 mt-0.5">{ghost.speed}</div>
          </div>
          <div className={`p-2 rounded-xl border ${
            isHorrorMode ? 'bg-red-950/40 border-red-800/40' : 'bg-[#1e1540]/80 border-purple-800/40'
          }`}>
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              {isHorrorMode ? <Skull className="w-3 h-3 text-red-400" /> : <Sparkles className="w-3 h-3 text-pink-400" />}
              <span>{isHorrorMode ? 'ระดับความสยอง' : 'ความน่ารักเป็นมิตร'}</span>
            </div>
            <div className={`text-xs font-bold ${isHorrorMode ? 'text-red-300' : 'text-pink-300'} mt-0.5`}>
              {isHorrorMode && ghost.scaryScore ? ghost.scaryScore : ghost.cuteScore}
            </div>
          </div>
        </div>

        {/* Safe Participant Badge */}
        <div className="relative z-10 bg-[#160d33]/90 rounded-2xl p-3 border border-purple-700/40 mb-4 flex items-center justify-between">
          <div className="text-left">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
              หมายเลขผู้สมัคร
            </div>
            <div className="text-base font-bold text-emerald-400 font-mono tracking-wider">
              {applicant.registrationNumber}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
              ประเภทผู้สมัคร
            </div>
            <div className="text-xs font-semibold text-amber-300">
              {applicant.applicantType}
            </div>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="relative z-10 flex flex-col items-center bg-white/5 rounded-2xl p-3 border border-white/10 mb-4">
          <div className="w-36 h-36 bg-white p-2 rounded-xl shadow-lg flex items-center justify-center">
            {cardMode === 'private' ? (
              qrDataUrl ? (
                <img src={qrDataUrl} alt="Check-in QR" className="w-full h-full object-contain" />
              ) : (
                <div className="w-full h-full animate-pulse bg-slate-200 rounded" />
              )
            ) : (
              shareQrDataUrl ? (
                <img src={shareQrDataUrl} alt="Share QR" className="w-full h-full object-contain" />
              ) : (
                <div className="w-full h-full animate-pulse bg-slate-200 rounded" />
              )
            )}
          </div>

          <div className="mt-2 text-center">
            {cardMode === 'private' ? (
              <>
                <p className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1">
                  <QrCode className="w-3.5 h-3.5" />
                  แสดง QR Code นี้เพื่อเช็กอินหน้างาน
                </p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                  TOKEN: {applicant.checkinToken}
                </p>
              </>
            ) : (
              <>
                <p className="text-xs font-bold text-pink-400 flex items-center justify-center gap-1">
                  <Share2 className="w-3.5 h-3.5" />
                  การ์ดสำหรับแชร์โซเชียล
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  (ไม่แสดงโทเค็นเช็กอินส่วนตัว ปลอดภัยในการแชร์)
                </p>
              </>
            )}
          </div>
        </div>

        {/* Event Date & Location footer */}
        <div className="relative z-10 text-[11px] text-slate-300 space-y-1">
          <div className="flex items-center justify-center gap-1 text-amber-300 font-medium">
            <Calendar className="w-3 h-3 text-orange-400" />
            <span>วันเสาร์ที่ 31 ตุลาคม 2569 • 16:30 น.</span>
          </div>
          <div className="flex items-center justify-center gap-1 text-slate-400 text-[10px]">
            <MapPin className="w-3 h-3 text-pink-400" />
            <span>คณะสังคมศาสตร์ มหาวิทยาลัยนเรศวร</span>
          </div>
        </div>
      </div>

      {/* Action Buttons Below Card */}
      <div className="w-full max-w-[390px] mt-4 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          {/* Download Button */}
          <button
            type="button"
            onClick={handleDownloadCard}
            disabled={isDownloading}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold text-sm hover:from-orange-400 hover:to-amber-400 active:scale-[0.98] transition-all shadow-lg shadow-orange-500/25 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isDownloading ? 'กำลังบันทึก...' : 'ดาวน์โหลดการ์ด'}</span>
          </button>

          {/* Copy Share Text Button */}
          <button
            type="button"
            onClick={handleCopyShareText}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm hover:from-purple-500 hover:to-pink-500 active:scale-[0.98] transition-all shadow-lg shadow-purple-600/25"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span className="text-emerald-300">คัดลอกแล้ว!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>คัดลอกข้อความแชร์</span>
              </>
            )}
          </button>
        </div>

        {/* Email Preview & Resend */}
        {onOpenEmailPreview && (
          <button
            type="button"
            onClick={onOpenEmailPreview}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#17142d] hover:bg-[#201c3d] text-slate-300 text-xs font-medium border border-purple-900/40 transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-sky-400" />
            <span>เปิดดูอีเมลยืนยันการลงทะเบียน & ส่งซ้ำ</span>
          </button>
        )}
      </div>
    </div>
  );
};
