import React, { useState } from 'react';
import { HelpCircle, Award, ShieldAlert, ChevronDown, ChevronUp, Sparkles, Check } from 'lucide-react';
import { FAQS } from '../data/initialData';

export const RulesFaqPage: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-orange-400 bg-orange-500/10 border border-orange-500/30 uppercase">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Rules & Guidelines & FAQ</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
          กติกาการประกวด & คำถามที่พบบ่อย
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          รายละเอียดการประกวดชุดแฟนซีชิงเงินรางวัลรวมกว่า 20,000 บาท และคำถามเกี่ยวกับการเข้าร่วมงาน
        </p>
      </div>

      {/* Fancy Contest Categories & Prizes Card */}
      <div className="bg-[#13102c] border-2 border-purple-800/60 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center gap-3 border-b border-purple-900/40 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 p-0.5 shadow-lg shadow-pink-500/20">
            <div className="w-full h-full bg-[#150e30] rounded-[14px] flex items-center justify-center">
              <Award className="w-6 h-6 text-pink-400" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white font-heading">
              การประกวดชุดแฟนซี “Thai Ghost Fancy Contest 2026”
            </h2>
            <p className="text-xs text-amber-300 font-semibold">
              ชิงเงินรางวัลรวมกว่า 20,000 บาท พร้อมถ้วยเกียรติยศและของที่ระลึก
            </p>
          </div>
        </div>

        {/* Contest Types Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#1a143d] p-4 rounded-2xl border border-purple-800/40 space-y-2">
            <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">ประเภทที่ 1</span>
            <h3 className="font-bold text-white text-base">ประเภทเดี่ยว (Individual)</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              แต่งกายธีมผีไทยหรือฮาโลวีนแฟนซี โดดเด่น มีเอกลักษณ์ สวมใส่ง่ายและวิ่งได้อย่างปลอดภัย
            </p>
            <div className="pt-2 text-xs font-bold text-emerald-400">
              รางวัลชนะเลิศ: 5,000 บาท
            </div>
          </div>

          <div className="bg-[#1a143d] p-4 rounded-2xl border border-purple-800/40 space-y-2">
            <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">ประเภทที่ 2</span>
            <h3 className="font-bold text-white text-base">ประเภททีม (Team 3-5 คน)</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              แต่งกายเข้าธีมเป็นกลุ่ม เล่าเรื่องราวสนุกสนาน มีความคิดสร้างสรรค์ และมีความพร้อมเพรียง
            </p>
            <div className="pt-2 text-xs font-bold text-emerald-400">
              รางวัลชนะเลิศ: 8,000 บาท
            </div>
          </div>

          <div className="bg-[#1a143d] p-4 rounded-2xl border border-purple-800/40 space-y-2">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">ประเภทที่ 3</span>
            <h3 className="font-bold text-white text-base">ขวัญใจผีไทยน่ารัก (Popular Vote)</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              ชุดแฟนซีผีไทยที่น่ารัก เป็นมิตร โดนใจคณะกรรมการและผู้ชมในงานมากที่สุด
            </p>
            <div className="pt-2 text-xs font-bold text-emerald-400">
              รางวัลพิเศษ: 3,000 บาท
            </div>
          </div>
        </div>

        {/* Judging Criteria */}
        <div className="bg-[#171236] p-4 rounded-2xl border border-purple-900/40 space-y-2 text-xs text-slate-300">
          <h4 className="font-bold text-amber-300 text-sm">เกณฑ์การให้คะแนน (100 คะแนนเต็ม)</h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <li className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>ความตรงตามธีม “ผีไทยน่ารัก” (30 คะแนน)</span>
            </li>
            <li className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>ความคิดสร้างสรรค์และรายละเอียดของชุด (30 คะแนน)</span>
            </li>
            <li className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>ความปลอดภัยและความคล่องตัวในการวิ่ง (20 คะแนน)</span>
            </li>
            <li className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>การนำเสนอ บุคลิกภาพ และความบันเทิง (20 คะแนน)</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Safety Guidelines */}
      <div className="bg-[#150f29] border border-amber-500/30 rounded-3xl p-6 shadow-xl space-y-3">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
          <ShieldAlert className="w-5 h-5" />
          <span>มาตรการความปลอดภัยและข้อพึงระวังในการวิ่งแฟนซี</span>
        </div>
        <ul className="text-xs text-slate-300 space-y-1.5 leading-relaxed">
          <li>• ชุดแฟนซีต้องไม่บดบังทัศนวิสัยการมองเห็นขณะวิ่ง เพื่อป้องกันการสะดุดหรือชนผู้อื่น</li>
          <li>• หลีกเลี่ยงอุปกรณ์ที่มีคม วัตถุไวไฟ หรือวัสดุที่อาจก่อให้เกิดอันตรายต่อเพื่อนนักวิ่ง</li>
          <li>• มีรถพยาบาลฉุกเฉินและหน่วยปฐมพยาบาลเคลื่อนที่ประจำตลอดเส้นทางวิ่ง</li>
          <li>• หากรู้สึกหน้ามืด เวียนศีรษะ หรือมีอาการผิดปกติ สามารถแจ้งเจ้าหน้าที่ Marshal ได้ทันที</li>
        </ul>
      </div>

      {/* Interactive FAQ Accordion */}
      <div className="space-y-4">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-white font-heading">
            คำถามที่พบบ่อย (FAQ)
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((item, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-[#121028] border border-purple-900/50 rounded-2xl overflow-hidden transition-all shadow-md"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-3 text-white font-semibold text-sm sm:text-base hover:text-orange-400 transition-colors"
                >
                  <span>{item.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-orange-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-purple-900/30 pt-3">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
