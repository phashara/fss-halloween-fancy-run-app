import React, { useState } from 'react';
import { Mail, Check, Send, X, ExternalLink, QrCode, Calendar, MapPin, AlertCircle } from 'lucide-react';
import { Applicant, GhostCharacter, ShirtOrder, EventSettings } from '../types';
import { storageService } from '../data/storage';

interface EmailPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicant: Applicant;
  ghost: GhostCharacter;
  order?: ShirtOrder;
  settings: EventSettings;
}

export const EmailPreviewModal: React.FC<EmailPreviewModalProps> = ({
  isOpen,
  onClose,
  applicant,
  ghost,
  order,
  settings,
}) => {
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  if (!isOpen) return null;

  const handleResend = () => {
    setResending(true);
    setTimeout(() => {
      storageService.recordEmailSent(applicant.id);
      setResending(false);
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 3000);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#131124] border border-purple-800/50 rounded-3xl shadow-2xl text-slate-100 p-6 sm:p-8">
        {/* Modal Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Email Header Info */}
        <div className="flex items-center gap-3 border-b border-purple-900/40 pb-4 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">จำลองการส่งอีเมลแจ้งเตือนผู้สมัคร (PDPA Compliant)</div>
            <h3 className="text-base font-bold text-white">
              หัวข้อ: ลงทะเบียนสำเร็จ | FSS Halloween Fancy Run 2026
            </h3>
          </div>
        </div>

        {/* Dispatch Metadata status banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-purple-950/40 border border-purple-800/30 rounded-2xl mb-6 text-xs">
          <div className="space-y-0.5">
            <div className="text-slate-400">
              ส่งไปยัง: <span className="text-white font-medium">{applicant.email}</span>
            </div>
            <div className="text-slate-400">
              สถานะการส่ง:{' '}
              <span className="text-emerald-400 font-semibold">
                ส่งสำเร็จแล้ว (ส่งแล้ว {applicant.emailSendCount || 1} ครั้ง)
              </span>
            </div>
            {applicant.emailSentAt && (
              <div className="text-[11px] text-slate-500">
                ส่งล่าสุดเมื่อ: {new Date(applicant.emailSentAt).toLocaleString('th-TH')}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 active:scale-95 text-slate-950 font-bold transition-all disabled:opacity-50 text-xs"
          >
            {resending ? (
              <span>กำลังส่ง...</span>
            ) : resendSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>ส่งซ้ำสำเร็จ!</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>ส่งการ์ดเข้าอีเมลอีกครั้ง</span>
              </>
            )}
          </button>
        </div>

        {/* Email Client Simulated Container */}
        <div className="bg-[#1c1638] border border-purple-800/40 rounded-2xl p-6 shadow-inner text-slate-200 space-y-4 text-sm leading-relaxed">
          {/* Logo Brand in Email */}
          <div className="text-center pb-4 border-b border-purple-800/30">
            <div className="text-xs uppercase tracking-widest text-orange-400 font-bold">
              คณะสังคมศาสตร์ มหาวิทยาลัยนเรศวร
            </div>
            <h4 className="text-xl font-bold text-white font-heading mt-1">
              FSS HALLOWEEN FANCY RUN 2026
            </h4>
            <div className="text-xs text-slate-400">Thai Ghost Edition — ปลุกตำนานผีไทย แล้วออกวิ่งไปด้วยกัน</div>
          </div>

          {/* Salutation */}
          <div className="space-y-2">
            <p className="font-semibold text-white">
              สวัสดีคุณ {applicant.firstName} {applicant.lastName} ({applicant.nickname || applicant.firstName})
            </p>
            <p className="text-slate-300">
              การลงทะเบียนเข้าร่วมกิจกรรม <strong>FSS Halloween Fancy Run 2026</strong> ของคุณเสร็จสมบูรณ์แล้ว!
            </p>
          </div>

          {/* Ghost Card Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/40 to-pink-900/30 border border-purple-700/50 flex flex-col sm:flex-row items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-purple-950 border border-purple-500/50 flex items-center justify-center text-3xl shrink-0">
              👻
            </div>
            <div>
              <div className="text-xs text-pink-300 font-medium uppercase tracking-wider">
                ผีไทยประจำตัวของคุณคือ
              </div>
              <div className="text-xl font-bold text-white font-heading mt-0.5">
                “{ghost.name}” ({ghost.code})
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {ghost.description}
              </p>
            </div>
          </div>

          {/* Important Notice */}
          <div className="p-3.5 bg-emerald-950/40 border border-emerald-800/30 rounded-xl text-xs text-emerald-200">
            ✅ <strong>การลงทะเบียนเข้าร่วมกิจกรรมไม่มีค่าใช้จ่าย</strong> และไม่จำเป็นต้องซื้อเสื้อที่ระลึกเพื่อเข้าร่วมงาน
          </div>

          {/* Shirt Status message if ordered */}
          {order ? (
            <div className="p-4 rounded-xl bg-orange-950/30 border border-orange-800/40 space-y-2">
              <div className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                รายละเอียดคำสั่งซื้อเสื้อที่ระลึก (คำสั่งซื้อ #{order.orderNumber})
              </div>
              <div className="text-xs text-slate-300 space-y-1">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{item.style} ไซซ์ {item.size} x {item.quantity} ตัว</span>
                    <span className="font-semibold text-white">{item.totalPrice} บาท</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-orange-800/30 flex justify-between font-bold text-amber-300">
                  <span>ยอดรวมทั้งสิ้น:</span>
                  <span>{order.subtotal} บาท</span>
                </div>
              </div>
              <div className="text-xs text-slate-400">
                สถานะสลิปชำระเงิน:{' '}
                <span className={`font-semibold ${
                  order.paymentStatus === 'paid' ? 'text-emerald-400' :
                  order.paymentStatus === 'rejected' ? 'text-rose-400' : 'text-amber-400'
                }`}>
                  {order.paymentStatus === 'paid' ? 'ชำระเงินเรียบร้อยแล้ว' :
                   order.paymentStatus === 'rejected' ? 'กรุณาแนบสลิปใหม่ (เข้าไปที่เมนูตรวจสอบสถานะ)' : 'รอเจ้าหน้าที่การเงินตรวจสอบสลิป'}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400">
              สถานะเสื้อที่ระลึก: ไม่ได้สั่งซื้อเสื้อ (เข้าร่วมกิจกรรมฟรีตามปกติ)
            </p>
          )}

          {/* Key Registration details summary */}
          <div className="bg-[#120d26] p-4 rounded-xl border border-purple-900/50 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">หมายเลขผู้สมัคร (BIB ID):</span>
              <span className="font-bold text-orange-400 font-mono text-sm">{applicant.registrationNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">โทเค็นเช็กอิน (Token):</span>
              <span className="font-mono text-emerald-400">{applicant.checkinToken}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">วันและเวลาจัดงาน:</span>
              <span className="text-slate-200">วันเสาร์ที่ 31 ตุลาคม 2569 เวลา 16:30 น.</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">สถานที่:</span>
              <span className="text-slate-200">ลานหน้าคณะสังคมศาสตร์ มหาวิทยาลัยนเรศวร</span>
            </div>
          </div>

          {/* Signoff */}
          <div className="pt-2 text-xs text-slate-300 space-y-1">
            <p>
              กรุณาบันทึกการ์ดหรือ QR Code ที่แนบมานี้ และนำมาแสดงต่อเจ้าหน้าที่เพื่อเช็กอินในวันจัดกิจกรรม
            </p>
            <p className="font-medium text-white pt-2">
              แล้วพบกันในงาน FSS Halloween Fancy Run 2026!<br />
              <span className="text-slate-400">คณะสังคมศาสตร์ มหาวิทยาลัยนเรศวร</span>
            </p>
          </div>
        </div>

        {/* Modal Close Footer */}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm transition-colors"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
