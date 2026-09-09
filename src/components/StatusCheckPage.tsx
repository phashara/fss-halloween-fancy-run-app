import React, { useState } from 'react';
import { 
  Search, 
  User, 
  Check, 
  Clock, 
  AlertCircle, 
  QrCode, 
  ShoppingBag, 
  Mail, 
  Upload, 
  Calendar, 
  MapPin, 
  Sparkles, 
  FileText, 
  ShieldCheck, 
  ChevronRight 
} from 'lucide-react';
import { Applicant, ShirtOrder, GhostCharacter, EventSettings } from '../types';
import { storageService } from '../data/storage';
import { findApplicantInFirebase } from '../firebase';
import { ParticipantCard } from './ParticipantCard';
import { EmailPreviewModal } from './EmailPreviewModal';

interface StatusCheckPageProps {
  settings: EventSettings;
  ghosts: GhostCharacter[];
  onGoToRegister: () => void;
}

export const StatusCheckPage: React.FC<StatusCheckPageProps> = ({
  settings,
  ghosts,
  onGoToRegister,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [foundApplicant, setFoundApplicant] = useState<Applicant | null>(null);
  const [foundOrder, setFoundOrder] = useState<ShirtOrder | undefined>(undefined);
  const [foundGhost, setFoundGhost] = useState<GhostCharacter | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);

  // Slip Re-upload State
  const [showReuploadModal, setShowReuploadModal] = useState(false);
  const [newSlipFile, setNewSlipFile] = useState<string | null>(null);
  const [newSlipFileName, setNewSlipFileName] = useState('');
  const [reuploadDate, setReuploadDate] = useState(new Date().toISOString().split('T')[0]);
  const [reuploadTime, setReuploadTime] = useState('12:00');
  const [reuploadAmount, setReuploadAmount] = useState<number>(0);
  const [reuploadSuccess, setReuploadSuccess] = useState(false);

  const [isSearchingCloud, setIsSearchingCloud] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;

    setSearched(true);
    const applicants = storageService.getApplicants();
    
    // Search by Reg Number, Email, or Phone
    let match = applicants.find(a => 
      a.registrationNumber.toLowerCase() === q.toLowerCase() ||
      a.checkinToken.toLowerCase() === q.toLowerCase() ||
      a.email.toLowerCase() === q.toLowerCase() ||
      a.phone.replace(/\D/g, '') === q.replace(/\D/g, '') ||
      a.phone.endsWith(q)
    );

    // If not found locally, query Firebase Firestore directly
    if (!match) {
      setIsSearchingCloud(true);
      try {
        const cloudMatch = await findApplicantInFirebase(q);
        if (cloudMatch) {
          match = cloudMatch;
          // Store into local cache
          storageService.mergeCloudData([cloudMatch], undefined, undefined);
        }
      } catch (err) {
        console.warn('Direct Firebase lookup failed:', err);
      } finally {
        setIsSearchingCloud(false);
      }
    }

    if (match) {
      setFoundApplicant(match);
      const ghost = storageService.getGhostById(match.ghostId || match.ghostCharacterId || '') || ghosts[0];
      setFoundGhost(ghost);
      const order = storageService.getOrderByApplicantId(match.id);
      setFoundOrder(order);
      if (order) {
        setReuploadAmount(order.subtotal);
      }
    } else {
      setFoundApplicant(null);
      setFoundOrder(undefined);
      setFoundGhost(null);
    }
  };

  const handleNewSlipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setNewSlipFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setNewSlipFile(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleReuploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foundOrder || !newSlipFile) {
      alert('กรุณาเลือกไฟล์สลิปรูปภาพ');
      return;
    }

    const updated = storageService.reUploadSlip(
      foundOrder.id,
      newSlipFile,
      newSlipFileName,
      reuploadDate,
      reuploadTime,
      reuploadAmount || foundOrder.subtotal
    );

    setFoundOrder(updated);
    setReuploadSuccess(true);
    setTimeout(() => {
      setReuploadSuccess(false);
      setShowReuploadModal(false);
      setNewSlipFile(null);
    }, 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-sky-400 bg-sky-950/60 border border-sky-500/30 uppercase">
          <Search className="w-3.5 h-3.5" />
          <span>Status Inquiry System</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
          ตรวจสอบสถานะการลงทะเบียน & สั่งซื้อเสื้อ
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          ค้นหาด้วย <strong>หมายเลขผู้สมัคร (BIB ID)</strong>, <strong>อีเมล</strong> หรือ <strong>เบอร์โทรศัพท์</strong>
        </p>
      </div>

      {/* Search Input Box */}
      <div className="max-w-xl mx-auto">
        <form onSubmit={handleSearch} className="relative flex items-center">
          <input
            type="text"
            placeholder="เช่น FSS26-000001, your-email@gmail.com หรือ 0812345678"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#151230] border-2 border-purple-800/60 focus:border-orange-500 rounded-2xl py-3.5 pl-4 pr-32 text-sm text-white focus:outline-none shadow-xl placeholder-slate-500"
          />
          <button
            type="submit"
            disabled={isSearchingCloud}
            className="absolute right-2 px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold text-xs hover:from-orange-400 hover:to-amber-400 active:scale-95 transition-all shadow-md shadow-orange-500/30 disabled:opacity-60"
          >
            {isSearchingCloud ? 'กำลังค้นหา Cloud...' : 'ค้นหา'}
          </button>
        </form>

        <div className="flex items-center justify-center gap-1.5 mt-2.5 text-[11px] text-emerald-400/80">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>เชื่อมต่อ Firebase Cloud Database ค้นหาและตรวจสอบได้จากทุกที่ทุกอุปกรณ์</span>
        </div>

        <div className="flex items-center justify-center gap-2 mt-2 text-[11px] text-slate-400">
          <span>ตัวอย่างทดสอบ:</span>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('FSS26-000001');
            }}
            className="text-orange-400 hover:underline"
          >
            FSS26-000001
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('FSS26-000003');
            }}
            className="text-orange-400 hover:underline"
          >
            FSS26-000003
          </button>
        </div>
      </div>

      {/* Search Result Found */}
      {foundApplicant && foundGhost && (
        <div className="bg-[#121029] border border-purple-900/60 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8 animate-in fade-in duration-300">
          {/* Top Status Badges */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-purple-900/40 pb-6">
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                หมายเลขผู้สมัคร (BIB NUMBER)
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono tracking-wider">
                {foundApplicant.registrationNumber}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                ลงทะเบียนเมื่อ: {new Date(foundApplicant.registeredAt).toLocaleDateString('th-TH')}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Registration Status */}
              <span className="px-3.5 py-1.5 rounded-full text-xs font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>ลงทะเบียนสมบูรณ์ (ฟรี)</span>
              </span>

              {/* Checkin Status */}
              <span className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                foundApplicant.checkinStatus === 'checked_in'
                  ? 'text-purple-300 bg-purple-950/80 border border-purple-500/40'
                  : 'text-amber-300 bg-amber-950/80 border border-amber-500/40'
              }`}>
                <QrCode className="w-3.5 h-3.5" />
                <span>{foundApplicant.checkinStatus === 'checked_in' ? 'เช็กอินหน้างานแล้ว' : 'ยังไม่ได้เช็กอินหน้างาน'}</span>
              </span>
            </div>
          </div>

          {/* Details 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Applicant Information & Shirt Order Status */}
            <div className="lg:col-span-6 space-y-6">
              {/* Personal Data Box */}
              <div className="bg-[#181438] p-5 rounded-2xl border border-purple-800/40 space-y-3 text-xs">
                <h3 className="text-sm font-bold text-white border-b border-purple-800/40 pb-2">
                  ข้อมูลผู้ลงทะเบียน
                </h3>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div>
                    <span className="text-slate-400">ชื่อ-นามสกุล:</span><br />
                    <strong className="text-white text-sm">{foundApplicant.prefix} {foundApplicant.firstName} {foundApplicant.lastName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">ชื่อเล่น:</span><br />
                    <strong className="text-white text-sm">{foundApplicant.nickname || '-'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">ประเภทผู้สมัคร:</span><br />
                    <strong className="text-amber-300">{foundApplicant.applicantType}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">สังกัด / คณะ:</span><br />
                    <strong className="text-slate-200">{foundApplicant.faculty || '-'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">เบอร์โทรศัพท์:</span><br />
                    <span className="font-mono text-white">{foundApplicant.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">อีเมล:</span><br />
                    <span className="text-white">{foundApplicant.email}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-purple-800/30 flex items-center justify-between">
                  <span className="text-slate-400">สถานะการส่งอีเมล:</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    <span>ส่งแล้ว ({foundApplicant.emailSendCount || 1} ครั้ง)</span>
                  </span>
                </div>
              </div>

              {/* Shirt Order Status Section */}
              <div className="bg-[#181438] p-5 rounded-2xl border border-purple-800/40 space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-purple-800/40 pb-2">
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <ShoppingBag className="w-4 h-4 text-orange-400" />
                    <span>สถานะเสื้อที่ระลึก</span>
                  </h3>
                  {foundOrder && (
                    <span className="font-mono text-[11px] text-slate-400">
                      #{foundOrder.orderNumber}
                    </span>
                  )}
                </div>

                {foundOrder ? (
                  <div className="space-y-3">
                    {/* Items List */}
                    <div className="space-y-1.5 bg-[#120d28] p-3 rounded-xl">
                      {foundOrder.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-slate-200">
                          <span>{item.style} ไซซ์ <strong>{item.size}</strong> x {item.quantity} ตัว</span>
                          <span className="font-bold text-amber-300">{item.totalPrice} บาท</span>
                        </div>
                      ))}
                      <div className="pt-2 border-t border-purple-900/40 flex justify-between font-bold text-white text-sm">
                        <span>ยอดรวมทั้งสิ้น:</span>
                        <span className="text-orange-400">฿ {foundOrder.subtotal} บาท</span>
                      </div>
                    </div>

                    {/* Payment Status Alert */}
                    <div className={`p-4 rounded-xl border flex flex-col gap-2 ${
                      foundOrder.paymentStatus === 'paid'
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                        : foundOrder.paymentStatus === 'rejected'
                          ? 'bg-rose-950/60 border-rose-500/60 text-rose-200'
                          : 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs uppercase tracking-wider">
                          สถานะการชำระเงิน:
                        </span>
                        <span className="font-bold">
                          {foundOrder.paymentStatus === 'paid' ? '✅ อนุมัติแล้ว (ชำระเงินเรียบร้อย)' :
                           foundOrder.paymentStatus === 'rejected' ? '❌ ปฏิเสธสลิป / รอแก้ไข' :
                           '⏳ รอเจ้าหน้าที่การเงินตรวจสอบสลิป'}
                        </span>
                      </div>

                      {foundOrder.paymentStatus === 'rejected' && (
                        <div className="space-y-2 pt-1 border-t border-rose-800/40">
                          <div>
                            <strong>เหตุผลที่ไม่อนุมัติ:</strong> {foundOrder.rejectionReason || 'สลิปไม่ถูกต้องหรือยอดเงินไม่ตรง'}
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowReuploadModal(true)}
                            className="w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>แนบสลิปใหม่เพื่อตรวจสอบอีกครั้ง</span>
                          </button>
                        </div>
                      )}

                      {foundOrder.paymentStatus === 'paid' && (
                        <div className="text-[11px] text-emerald-300">
                          ตรวจสอบสลิปเรียบร้อยเมื่อ {foundOrder.reviewedAt ? new Date(foundOrder.reviewedAt).toLocaleString('th-TH') : 'ล่าสุด'}
                        </div>
                      )}
                    </div>

                    {/* Shirt Pickup Status */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-[#120d28] border border-purple-900/40">
                      <span className="text-slate-400">สถานะการรับเสื้อ:</span>
                      <span className={`font-bold ${
                        foundOrder.orderStatus === 'picked_up' ? 'text-emerald-400' : 'text-amber-400'
                      }`}>
                        {foundOrder.orderStatus === 'picked_up' ? 'รับเสื้อแล้วเรียบร้อย' : 'รอรับเสื้อหน้างาน หรือ 29-30 ต.ค.'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-[#120d28] text-center text-slate-400">
                    <p>ผู้สมัครไม่ได้สั่งซื้อเสื้อที่ระลึก (เข้าร่วมกิจกรรมฟรีตามปกติ)</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Participant Card Component Display */}
            <div className="lg:col-span-6 flex flex-col items-center">
              <div className="text-center mb-3">
                <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                  การ์ดสุ่มตัวละคร & QR Code เช็กอินของคุณ
                </span>
              </div>

              <ParticipantCard
                applicant={foundApplicant}
                ghost={foundGhost}
                settings={settings}
                onOpenEmailPreview={() => setShowEmailModal(true)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Searched but Not Found */}
      {searched && !foundApplicant && (
        <div className="max-w-md mx-auto p-8 rounded-3xl bg-[#14112b] border border-purple-900/60 text-center space-y-4 shadow-xl">
          <div className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white font-heading">
            ไม่พบข้อมูลการลงทะเบียน
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            ไม่พบข้อมูลที่ตรงกับ <strong>"{searchQuery}"</strong> กรุณาตรวจสอบหมายเลข BIB, อีเมล หรือเบอร์โทรศัพท์อีกครั้ง
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={onGoToRegister}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold text-xs hover:from-orange-400 hover:to-amber-400 active:scale-95 transition-all shadow-md shadow-orange-500/30 flex items-center justify-center gap-1.5 mx-auto"
            >
              <Sparkles className="w-4 h-4" />
              <span>ลงทะเบียนใหม่ฟรีทันที</span>
            </button>
          </div>
        </div>
      )}

      {/* Re-Upload Slip Modal */}
      {showReuploadModal && foundOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#161233] border border-purple-700/60 rounded-3xl p-6 shadow-2xl text-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-white font-heading">
              แนบสลิปใหม่สำหรับคำสั่งซื้อ #{foundOrder.orderNumber}
            </h3>
            <p className="text-xs text-slate-300">
              ยอดชำระที่ต้องโอน: <strong className="text-orange-400">฿ {foundOrder.subtotal} บาท</strong>
            </p>

            <form onSubmit={handleReuploadSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1.5 font-semibold">
                  เลือกไฟล์ภาพสลิปใหม่ *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleNewSlipChange}
                  className="w-full bg-[#110d26] border border-purple-800 rounded-xl p-2 text-slate-300"
                  required
                />
              </div>

              {newSlipFile && (
                <div className="flex items-center gap-3 bg-[#110d26] p-2 rounded-xl">
                  <img src={newSlipFile} alt="Preview" className="w-12 h-12 object-cover rounded-lg" />
                  <span className="text-emerald-400">{newSlipFileName}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">วันที่โอน *</label>
                  <input
                    type="date"
                    value={reuploadDate}
                    onChange={(e) => setReuploadDate(e.target.value)}
                    className="w-full bg-[#110d26] border border-purple-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">เวลาที่โอน *</label>
                  <input
                    type="time"
                    value={reuploadTime}
                    onChange={(e) => setReuploadTime(e.target.value)}
                    className="w-full bg-[#110d26] border border-purple-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowReuploadModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={!newSlipFile}
                  className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold disabled:opacity-50"
                >
                  {reuploadSuccess ? 'ส่งสลิปใหม่สำเร็จ!' : 'ยืนยันส่งสลิปใหม่'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Email Preview Modal */}
      {foundApplicant && foundGhost && (
        <EmailPreviewModal
          isOpen={showEmailModal}
          onClose={() => setShowEmailModal(false)}
          applicant={foundApplicant}
          ghost={foundGhost}
          order={foundOrder}
          settings={settings}
        />
      )}
    </div>
  );
};
