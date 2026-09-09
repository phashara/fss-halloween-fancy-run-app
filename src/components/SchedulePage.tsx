import React from 'react';
import { Calendar, Clock, Sparkles, Flag, Award, Music, Coffee, MapPin } from 'lucide-react';
import { EVENT_SCHEDULE } from '../data/initialData';

export const SchedulePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 uppercase">
          <Calendar className="w-3.5 h-3.5" />
          <span>Timeline & Schedule</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
          กำหนดการจัดกิจกรรม (31 ตุลาคม 2569)
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          สถานที่: ลานหน้าคณะสังคมศาสตร์ มหาวิทยาลัยนเรศวร จ.พิษณุโลก
        </p>
      </div>

      {/* Summary Highlight Box */}
      <div className="bg-gradient-to-r from-purple-950/80 to-[#120f2b] p-6 rounded-3xl border border-purple-800/50 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs text-orange-400 font-bold uppercase tracking-wider">
            วันเสาร์ที่ 31 ตุลาคม 2569 (คืนวันฮาโลวีน)
          </div>
          <div className="text-xl font-bold text-white font-heading">
            16:30 – 21:00 น.
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-pink-400" />
            <span>ลานหน้าคณะสังคมศาสตร์ มหาวิทยาลัยนเรศวร</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-center">
            <div className="text-xs text-slate-400">ปล่อยตัว (Gun Start)</div>
            <div className="text-lg font-bold text-orange-400 font-mono">18:00 น.</div>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-pink-500/10 border border-pink-500/30 text-center">
            <div className="text-xs text-slate-400">ประกวดแฟนซี</div>
            <div className="text-lg font-bold text-pink-400 font-mono">19:30 น.</div>
          </div>
        </div>
      </div>

      {/* Vertical Interactive Timeline */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-orange-500 before:via-purple-500 before:to-emerald-500">
        {EVENT_SCHEDULE.map((item, idx) => (
          <div key={idx} className="relative group">
            {/* Timeline Icon Node */}
            <div className="absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full bg-[#160d33] border-2 border-orange-400 group-hover:border-emerald-400 flex items-center justify-center -translate-x-1/2 transition-colors shadow-md shadow-orange-500/20">
              <div className="w-2 h-2 rounded-full bg-orange-400 group-hover:bg-emerald-400 transition-colors" />
            </div>

            {/* Content Card */}
            <div className="bg-[#13112b] hover:bg-[#1a163a] border border-purple-900/50 hover:border-orange-500/50 rounded-2xl p-4 sm:p-5 transition-all shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                <span className="text-sm sm:text-base font-extrabold text-amber-300 font-mono flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-orange-400" />
                  <span>{item.time}</span>
                </span>
                <span className="text-[11px] font-semibold text-slate-400 bg-purple-950/60 px-2.5 py-0.5 rounded-full border border-purple-800/40">
                  {idx === 0 ? 'จุดลงทะเบียน' : idx === 3 ? 'จุดปล่อยตัว' : idx === 5 ? 'เวทีกลาง' : 'กิจกรรม'}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-white font-heading">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
