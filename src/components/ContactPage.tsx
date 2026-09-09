import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Send, Check, MessageSquare } from 'lucide-react';
import { EventSettings } from '../types';
import { INITIAL_SETTINGS } from '../data/initialData';

interface ContactPageProps {
  settings?: EventSettings;
}

export const ContactPage: React.FC<ContactPageProps> = ({ settings }) => {
  const currentSettings = { ...INITIAL_SETTINGS, ...(settings || {}) };
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setName('');
      setEmail('');
      setMessage('');
      alert('ส่งข้อความสอบถามเรียบร้อยแล้ว เจ้าหน้าที่จะติดต่อกลับโดยเร็ว');
    }, 1200);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 uppercase">
          <Phone className="w-3.5 h-3.5" />
          <span>Contact & Support</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
          ติดต่อคณะผู้จัดงาน
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          คณะสังคมศาสตร์ มหาวิทยาลัยนเรศวร พร้อมให้ข้อมูลและตอบทุกข้อสงสัย
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left: Contact Info Cards */}
        <div className="md:col-span-6 space-y-4">
          <div className="bg-[#13102c] border border-purple-900/50 rounded-3xl p-6 shadow-xl space-y-4 text-xs sm:text-sm text-slate-200">
            <h2 className="text-lg font-bold text-white font-heading">
              สำนักงานคณะกรรมการจัดงาน
            </h2>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400 shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <strong className="text-white">สถานที่ติดต่อ:</strong>
                  <p className="text-slate-300 mt-0.5 leading-relaxed">
                    สโมสรนิสิตและงานกิจการนิสิต คณะสังคมศาสตร์<br />
                    มหาวิทยาลัยนเรศวร 99 หมู่ 9 ต.ท่าโพธิ์ อ.เมือง จ.พิษณุโลก 65000
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <strong className="text-white">เบอร์โทรศัพท์ติดต่อ:</strong>
                  <p className="font-mono text-emerald-300 mt-0.5">{currentSettings.contactPhone || '055-961900 ต่อ 1205'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 shrink-0 mt-0.5">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <strong className="text-white">อีเมล:</strong>
                  <p className="text-sky-300 mt-0.5">{currentSettings.contactEmail || 'fss-run@nu.ac.th'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <strong className="text-white">เวลาทำการ:</strong>
                  <p className="text-slate-300 mt-0.5">วันจันทร์ – ศุกร์ เวลา 08:30 – 16:30 น.</p>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="pt-4 border-t border-purple-900/30 flex items-center gap-3">
              <span className="text-xs text-slate-400 font-semibold">ช่องทางโซเชียล:</span>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-[#1b153b] hover:bg-blue-600 text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-[#1b153b] hover:bg-pink-600 text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Right: Quick Contact Message Form */}
        <div className="md:col-span-6">
          <form
            onSubmit={handleSubmit}
            className="bg-[#13102c] border border-purple-900/50 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4 text-xs sm:text-sm"
          >
            <div className="flex items-center gap-2 text-white font-bold text-base font-heading">
              <MessageSquare className="w-4 h-4 text-orange-400" />
              <span>ส่งข้อความสอบถามเจ้าหน้าที่</span>
            </div>

            <div>
              <label className="block text-slate-300 mb-1.5 font-medium">ชื่อผู้ติดต่อ *</label>
              <input
                type="text"
                placeholder="ชื่อ-นามสกุลของคุณ"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#1b163d] border border-purple-800/50 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-orange-500 placeholder-slate-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1.5 font-medium">อีเมล หรือ เบอร์โทรติดต่อกลับ *</label>
              <input
                type="text"
                placeholder="you@email.com หรือ 0812345678"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1b163d] border border-purple-800/50 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-orange-500 placeholder-slate-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1.5 font-medium">ข้อความสอบถาม *</label>
              <textarea
                rows={4}
                placeholder="ระบุข้อความหรือคำถามที่ต้องการสอบถาม..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-[#1b163d] border border-purple-800/50 rounded-xl p-3.5 text-white focus:outline-none focus:border-orange-500 placeholder-slate-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={sent}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold text-sm hover:from-orange-400 hover:to-amber-400 active:scale-95 transition-all shadow-md shadow-orange-500/25 flex items-center justify-center gap-2"
            >
              {sent ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>ส่งข้อความสำเร็จ</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>ส่งข้อความสอบถาม</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
