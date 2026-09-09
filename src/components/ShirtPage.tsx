import React, { useState } from 'react';
import { ShoppingBag, Sparkles, Check, Info, ShieldCheck, MapPin, Calendar, Clock, ChevronRight } from 'lucide-react';
import { SizeChartEntry, EventSettings } from '../types';

interface ShirtPageProps {
  settings: EventSettings;
  sizeChart: SizeChartEntry[];
  onOrderClick: () => void;
}

export const ShirtPage: React.FC<ShirtPageProps> = ({ settings, sizeChart, onOrderClick }) => {
  const [viewAngle, setViewAngle] = useState<'front' | 'back'>('front');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Top Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-bold text-orange-400 bg-orange-500/10 border border-orange-500/30 uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Official Souvenir Merch • Limited Edition</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-heading">
          เสื้อวิ่งที่ระลึก <span className="text-orange-400">FSS Halloween Run 2026</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          ดีไซน์พิเศษลิมิเต็ด “Thai Ghost Edition” ลวดลายผีไทยน่ารักพร้อมลูกเล่นหมึกเรืองแสง Glow-in-the-dark สวมใส่สบายด้วยผ้ากีฬาไมโครโพลีเอสเตอร์ Dry-fit
        </p>
        <div className="pt-1 text-xs text-amber-300 font-semibold">
          *กิจกรรมเปิดให้ลงทะเบียนฟรี เสื้อที่ระลึกเป็นสินค้าทางเลือกตามความสมัครใจเพื่อสมทบทุนจัดกิจกรรม
        </div>
      </div>

      {/* Main Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: 3D-styled Shirt Graphic Mockup */}
        <div className="lg:col-span-6 bg-[#13112b] border-2 border-purple-900/50 rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col items-center justify-center shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* View Toggle */}
          <div className="flex items-center gap-2 bg-[#1b173b] p-1.5 rounded-2xl border border-purple-800/40 mb-6 z-10">
            <button
              type="button"
              onClick={() => setViewAngle('front')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewAngle === 'front'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ด้านหน้า (Front)
            </button>
            <button
              type="button"
              onClick={() => setViewAngle('back')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewAngle === 'back'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ด้านหลัง (Back)
            </button>
          </div>

          {/* SVG Shirt Mockup */}
          <div className="relative w-full max-w-[340px] aspect-[4/5] flex items-center justify-center z-10">
            <svg viewBox="0 0 320 360" className="w-full h-full filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.7)]">
              <defs>
                <linearGradient id="shirt-base" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#0f0c22" />
                  <stop offset="50%" stopColor="#1a1438" />
                  <stop offset="100%" stopColor="#0c0a1a" />
                </linearGradient>
                <linearGradient id="glow-stripe" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff6b00" />
                  <stop offset="100%" stopColor="#ff9900" />
                </linearGradient>
              </defs>

              {/* Shirt Silhouette */}
              <path
                d="M100 40 Q130 65 160 65 Q190 65 220 40 L285 95 L255 145 L225 125 L225 330 L95 330 L95 125 L65 145 L35 95 Z"
                fill="url(#shirt-base)"
                stroke="#4a287a"
                strokeWidth="2.5"
              />

              {/* Collar Accent */}
              <path
                d="M100 40 Q130 65 160 65 Q190 65 220 40 Q190 55 160 55 Q130 55 100 40 Z"
                fill="#ff6b00"
              />

              {/* Sleeve Glow Trims */}
              <path d="M35 95 L65 145" stroke="#00ff9d" strokeWidth="4" strokeLinecap="round" />
              <path d="M285 95 L255 145" stroke="#00ff9d" strokeWidth="4" strokeLinecap="round" />

              {/* Side racing curves */}
              <path d="M105 150 Q115 240 105 325" stroke="#ff6b00" strokeWidth="3" opacity="0.6" fill="none" />
              <path d="M215 150 Q205 240 215 325" stroke="#ff6b00" strokeWidth="3" opacity="0.6" fill="none" />

              {viewAngle === 'front' ? (
                <>
                  {/* Front Graphic Art: Glowing Thai Ghosts Parade */}
                  <circle cx="160" cy="170" r="55" fill="#2d1754" opacity="0.8" />
                  <circle cx="160" cy="170" r="50" stroke="#00ff9d" strokeWidth="2" strokeDasharray="6 4" />
                  
                  {/* Glowing Krasue and Bat icons on shirt */}
                  <text x="160" y="160" textAnchor="middle" fill="#ffffff" fontSize="28">👻</text>
                  <text x="160" y="195" textAnchor="middle" fill="#ff9900" fontFamily="Prompt" fontWeight="800" fontSize="12" letterSpacing="1">
                    THAI GHOST
                  </text>
                  <text x="160" y="210" textAnchor="middle" fill="#00ff9d" fontFamily="Prompt" fontWeight="700" fontSize="9">
                    FSS HALLOWEEN RUN
                  </text>

                  {/* Logo Faculty at bottom */}
                  <text x="160" y="280" textAnchor="middle" fill="#94a3b8" fontFamily="Prompt" fontSize="8">
                    FACULTY OF SOCIAL SCIENCES • NU
                  </text>
                </>
              ) : (
                <>
                  {/* Back Graphic Art */}
                  <text x="160" y="140" textAnchor="middle" fill="#ff6b00" fontFamily="Mitr" fontWeight="800" fontSize="18">
                    FSS 2026
                  </text>
                  <text x="160" y="165" textAnchor="middle" fill="#ffffff" fontFamily="Prompt" fontWeight="700" fontSize="12">
                    ปลุกตำนานผีไทย
                  </text>
                  <text x="160" y="185" textAnchor="middle" fill="#cbd5e1" fontFamily="Prompt" fontSize="10">
                    แล้วออกวิ่งไปด้วยกัน
                  </text>

                  {/* Big Number Accent */}
                  <rect x="125" y="210" width="70" height="40" rx="8" fill="#231444" stroke="#ff6b00" strokeWidth="2" />
                  <text x="160" y="238" textAnchor="middle" fill="#facc15" fontFamily="Mitr" fontWeight="800" fontSize="22">
                    26
                  </text>

                  {/* Sponsors Line */}
                  <text x="160" y="285" textAnchor="middle" fill="#64748b" fontFamily="Prompt" fontSize="8">
                    NARESUAN UNIVERSITY
                  </text>
                </>
              )}
            </svg>

            <span className="absolute bottom-2 px-3 py-1 rounded-full text-[11px] font-bold text-amber-300 bg-amber-500/20 border border-amber-500/40">
              {viewAngle === 'front' ? 'มุมมองด้านหน้า' : 'มุมมองด้านหลัง'}
            </span>
          </div>
        </div>

        {/* Right: Specs, Pricing, and Pickup Details */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-[#121128] border border-purple-900/50 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
            <div className="flex items-baseline justify-between border-b border-purple-900/40 pb-3">
              <div>
                <span className="text-xs text-slate-400">ราคาพิเศษช่วงเปิดรับสมัคร</span>
                <div className="text-3xl font-extrabold text-orange-400 font-heading">
                  ฿ {settings.shirtPrice} <span className="text-sm font-normal text-slate-300">บาท / ตัว</span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30">
                มีสต็อกครบทุกไซซ์
              </span>
            </div>

            {/* Fabric & Printing Highlights */}
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>ผ้าไมโครโพลีเอสเตอร์ 100%:</strong> ทอพิเศษโครงสร้างรังผึ้ง ระบายเหงื่อรวดเร็ว แห้งไว ไม่เหนอะหนะ
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Glow-in-the-Dark Silk Screen:</strong> ลายผีไทยเรืองแสงชัดเจนเมื่อวิ่งผ่านอุโมงค์แบล็กไลต์ยามค่ำคืน
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>ตัวเลือก 2 แบบ:</strong> เสื้อวิ่งแขนสั้น Regular Fit ทรงสวย และเสื้อวิ่งแขนกุด Sleeveless สำหรับสายคล่องตัว
                </span>
              </div>
            </div>

            {/* Pickup Info */}
            <div className="p-4 rounded-2xl bg-[#1a153a] border border-purple-800/40 space-y-2 text-xs">
              <div className="font-bold text-amber-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>กำหนดการรับเสื้อที่ระลึก</span>
              </div>
              <div className="text-slate-300 leading-relaxed">
                • <strong>ก่อนวันงาน:</strong> วันที่ 29 - 30 ตุลาคม 2569 เวลา 10:00 - 17:00 น. ณ โถงกิจกรรม คณะสังคมศาสตร์ มหาวิทยาลัยนเรศวร<br />
                • <strong>วันจัดกิจกรรม:</strong> วันเสาร์ที่ 31 ตุลาคม 2569 เวลา 16:30 - 18:00 น. ณ ซุ้มจุดรับเสื้อหน้างาน
              </div>
            </div>

            {/* Order CTA */}
            <button
              type="button"
              onClick={onOrderClick}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-slate-950 font-extrabold text-base hover:from-orange-400 hover:to-amber-400 active:scale-95 transition-all shadow-xl shadow-orange-500/25 flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>สั่งซื้อเสื้อพร้อมลงทะเบียนฟรี</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Full Size Chart Table (XS - 5XL) */}
      <div className="bg-[#121128] border border-purple-900/50 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-900/40 pb-4">
          <div>
            <h2 className="text-xl font-bold text-white font-heading">
              ตารางขนาดเสื้อที่ระลึก (Size Chart)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              วัดรอบอกเป็นนิ้ว (Inches) กรุณาวัดรอบอกจริงเพื่อเลือกไซซ์ที่สวมใส่พอดี
            </p>
          </div>
          <span className="text-xs text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30 self-start sm:self-auto">
            ครอบคลุมทุกไซซ์ XS - 5XL
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs sm:text-sm border border-purple-800/40 rounded-2xl overflow-hidden">
            <thead className="bg-purple-950/90 text-orange-400 font-heading">
              <tr>
                <th className="py-3 px-3 border-b border-purple-800/40">ขนาด (Size)</th>
                <th className="py-3 px-3 border-b border-purple-800/40">รอบอก (Chest / นิ้ว)</th>
                <th className="py-3 px-3 border-b border-purple-800/40">ความยาวเสื้อ (Length / นิ้ว)</th>
                <th className="py-3 px-3 border-b border-purple-800/40">คำแนะนำความเหมาะสม</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-900/30 text-slate-200">
              {sizeChart.map((row) => (
                <tr key={row.size} className="hover:bg-purple-900/20 transition-colors">
                  <td className="py-2.5 px-3 font-extrabold text-white text-base font-heading">
                    {row.size}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-amber-300">
                    {row.chestInches}"
                  </td>
                  <td className="py-2.5 px-3 font-mono">
                    {row.lengthInches}"
                  </td>
                  <td className="py-2.5 px-3 text-xs text-slate-400">
                    {row.chestInches <= 36 ? 'สำหรับผู้มีรูปร่างกะทัดรัด' :
                     row.chestInches <= 40 ? 'ขนาดยอดนิยม มาตรฐานชาย-หญิง' :
                     row.chestInches <= 44 ? 'ขนาดมาตรฐาน คล่องตัวสบาย' : 'ขนาดพิเศษ สวมใส่สบายไม่อึดอัด'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
