import React from 'react';
import { Ghost, Heart, Mail, Phone, MapPin, Facebook, Instagram, Share2, Shield, Calendar } from 'lucide-react';
import { EventSettings } from '../types';
import { INITIAL_SETTINGS } from '../data/initialData';

interface FooterProps {
  settings?: EventSettings;
  onSelectTab?: (tab: string) => void;
  onNavigate?: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onSelectTab, onNavigate }) => {
  const currentSettings = { ...INITIAL_SETTINGS, ...(settings || {}) };
  const handleNav = (tabId: string) => {
    const target = tabId === 'shirt' ? 'shirts' : tabId;
    if (onNavigate) onNavigate(target);
    if (onSelectTab) onSelectTab(target);
  };
  return (
    <footer className="relative bg-[#07080f] border-t border-purple-900/30 text-slate-300 pt-16 pb-12 overflow-hidden">
      {/* Subtle background fog element */}
      <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[800px] h-48 bg-orange-600/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-purple-600 p-0.5 shadow-md shadow-orange-500/20">
                <div className="w-full h-full bg-[#0c0d1b] rounded-[14px] flex items-center justify-center">
                  <Ghost className="w-5 h-5 text-orange-400" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-white font-heading text-lg">FSS Fancy Run 2026</h3>
                <p className="text-xs text-orange-400 font-medium">Thai Ghost Edition</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              กิจกรรมวิ่งฮาโลวีนแฟนซีเพื่อสุขภาพ ภายใต้ธีม “ผีไทยน่ารัก” ปลุกตำนานผีไทย แล้วออกวิ่งไปด้วยกัน จัดโดยสโมสรนิสิตและคณะสังคมศาสตร์ มหาวิทยาลัยนเรศวร
            </p>
            <div className="text-xs text-slate-500">
              📌 การลงทะเบียนเข้าร่วมกิจกรรมไม่มีค่าใช้จ่าย (ฟรี 100%) เสื้อที่ระลึกเป็นสินค้าทางเลือกตามความสมัครใจ
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-heading">
              เมนูแนะนำ
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  type="button" 
                  onClick={() => handleNav('register')}
                  className="hover:text-orange-400 transition-colors flex items-center gap-1.5"
                >
                  <span>• ลงทะเบียนเข้าร่วมงานฟรี</span>
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => handleNav('shirts')}
                  className="hover:text-orange-400 transition-colors flex items-center gap-1.5"
                >
                  <span>• สั่งซื้อเสื้อที่ระลึก (XS - 5XL)</span>
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => handleNav('status')}
                  className="hover:text-orange-400 transition-colors flex items-center gap-1.5"
                >
                  <span>• ตรวจสอบสถานะ & แนบสลิปใหม่</span>
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => handleNav('participants')}
                  className="hover:text-orange-400 transition-colors flex items-center gap-1.5"
                >
                  <span>• ประกาศรายชื่อผู้ลงทะเบียน</span>
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => handleNav('schedule')}
                  className="hover:text-orange-400 transition-colors flex items-center gap-1.5"
                >
                  <span>• กำหนดการ & เส้นทางวิ่งรอบ มน.</span>
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => handleNav('rules')}
                  className="hover:text-orange-400 transition-colors flex items-center gap-1.5"
                >
                  <span>• กติกาประกวดแฟนซี & คำถามที่พบบ่อย</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-heading">
              ข้อมูลการติดต่อ
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
                <span>
                  คณะสังคมศาสตร์ มหาวิทยาลัยนเรศวร<br />
                  99 หมู่ 9 ต.ท่าโพธิ์ อ.เมือง จ.พิษณุโลก 65000
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{currentSettings.contactPhone || '055-961900 ต่อ 1205'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <span>{currentSettings.contactEmail || 'fss-run@nu.ac.th'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                <span>เสาร์ที่ 31 ตุลาคม 2569 (16:30 - 21:00 น.)</span>
              </div>
            </div>
          </div>

          {/* Social Media & Sponsors */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-heading">
              ติดตามข่าวสาร
            </h4>
            <div className="flex items-center gap-2.5">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-purple-950/60 border border-purple-800/40 flex items-center justify-center text-slate-300 hover:text-white hover:bg-blue-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-purple-950/60 border border-purple-800/40 flex items-center justify-center text-slate-300 hover:text-white hover:bg-pink-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-purple-950/60 border border-purple-800/40 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="TikTok"
              >
                <span className="text-xs font-bold font-mono">TT</span>
              </a>
            </div>

            <div className="pt-2 border-t border-purple-900/30">
              <div className="text-[11px] text-slate-400 font-semibold mb-1.5">ผู้สนับสนุนกิจกรรม:</div>
              <div className="flex flex-wrap gap-2 text-[10px] text-slate-400">
                <span className="bg-purple-950/50 px-2 py-1 rounded border border-purple-900/40">มหาวิทยาลัยนเรศวร</span>
                <span className="bg-purple-950/50 px-2 py-1 rounded border border-purple-900/40">คณะสังคมศาสตร์</span>
                <span className="bg-purple-950/50 px-2 py-1 rounded border border-purple-900/40">สโมสรนิสิต FSS</span>
                <span className="bg-purple-950/50 px-2 py-1 rounded border border-purple-900/40">ชมรมวิ่งเมืองสองแคว</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar & PDPA Notice */}
        <div className="pt-8 border-t border-purple-900/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 text-center sm:text-left">
          <div>
            © 2026 คณะสังคมศาสตร์ มหาวิทยาลัยนเรศวร. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1 text-emerald-400">
              <Shield className="w-3.5 h-3.5" />
              PDPA Compliant (คุ้มครองข้อมูลส่วนบุคคล)
            </span>
            <button
              type="button"
              onClick={() => onSelectTab('admin')}
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              เจ้าหน้าที่เข้าสู่ระบบ
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
