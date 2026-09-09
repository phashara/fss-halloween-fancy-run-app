import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  QrCode, 
  CreditCard, 
  ShoppingBag, 
  Settings, 
  FileText, 
  Users, 
  Check, 
  X, 
  AlertTriangle, 
  Search, 
  Download, 
  Filter, 
  RefreshCw, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  Save, 
  Sparkles 
} from 'lucide-react';
import { 
  Applicant, 
  ShirtOrder, 
  GhostCharacter, 
  EventSettings, 
  SizeChartEntry, 
  AdminRole, 
  AuditLog 
} from '../types';
import { storageService } from '../data/storage';
import { GhostAvatar } from './GhostAvatar';

interface AdminPortalProps {
  applicants: Applicant[];
  orders: ShirtOrder[];
  ghosts: GhostCharacter[];
  settings: EventSettings;
  sizeChart: SizeChartEntry[];
  auditLogs: AuditLog[];
  onRefreshData: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  applicants,
  orders,
  ghosts,
  settings,
  sizeChart,
  auditLogs,
  onRefreshData,
}) => {
  // Current active admin role
  const [currentRole, setCurrentRole] = useState<AdminRole>('Super Admin');
  const [staffName, setStaffName] = useState('อาจารย์ สมศักดิ์ (Staff)');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'checkin' | 'finance' | 'registration' | 'shirts' | 'ghosts' | 'settings' | 'logs'>('dashboard');

  // Checkin Scanner State
  const [scanInput, setScanInput] = useState('');
  const [scanResult, setScanResult] = useState<{
    applicant: Applicant | null;
    isDuplicate: boolean;
    order?: ShirtOrder;
  } | null>(null);

  // Finance Slip Review State
  const [selectedOrderForReview, setSelectedOrderForReview] = useState<ShirtOrder | null>(null);
  const [rejectReasonModalOpen, setRejectReasonModalOpen] = useState(false);
  const [selectedRejectReason, setSelectedRejectReason] = useState('ภาพสลิปไม่ชัดเจน / ไม่สามารถตรวจสอบยอดได้');
  const [customRejectReason, setCustomRejectReason] = useState('');
  const [financeFilter, setFinanceFilter] = useState<'all' | 'pending_review' | 'paid' | 'rejected'>('pending_review');

  // Ghost Character Editor State
  const [editingGhost, setEditingGhost] = useState<GhostCharacter | null>(null);

  // Settings Editor State
  const [settingsForm, setSettingsForm] = useState<EventSettings>(settings);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Dashboard Metrics
  const metrics = useMemo(() => {
    const totalApplicants = applicants.length;
    const checkedInCount = applicants.filter(a => a.checkinStatus === 'checked_in').length;
    const checkinPercentage = totalApplicants > 0 ? Math.round((checkedInCount / totalApplicants) * 100) : 0;
    const totalOrders = orders.length;
    const totalShirtsOrdered = orders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0);
    const paidOrders = orders.filter(o => o.paymentStatus === 'paid');
    const totalRevenue = paidOrders.reduce((sum, o) => sum + o.subtotal, 0);
    const pendingSlips = orders.filter(o => o.paymentStatus === 'pending_review').length;
    const pickedUpShirts = orders.filter(o => o.orderStatus === 'picked_up').length;

    return {
      totalApplicants,
      checkedInCount,
      checkinPercentage,
      totalOrders,
      totalShirtsOrdered,
      totalRevenue,
      pendingSlips,
      pickedUpShirts,
    };
  }, [applicants, orders]);

  // Handle Manual or QR Checkin Scan
  const handlePerformCheckin = (tokenOrReg: string) => {
    const clean = tokenOrReg.trim();
    if (!clean) return;

    const applicant = storageService.getApplicantByToken(clean);
    if (!applicant) {
      alert(`ไม่พบผู้สมัครที่ตรงกับ "${clean}" กรุณาตรวจสอบ QR Code หรือหมายเลข BIB`);
      return;
    }

    const res = storageService.checkinApplicant(applicant.id, staffName, 'จุดลงทะเบียนหน้างาน ซุ้ม A');
    const order = storageService.getOrderByApplicantId(applicant.id);
    setScanResult({
      applicant: res.applicant,
      isDuplicate: res.isDuplicate,
      order,
    });
    setScanInput('');
    onRefreshData();
  };

  // Confirm Shirt Pickup
  const handleConfirmShirtPickup = (orderId: string) => {
    storageService.pickupShirt(orderId, staffName);
    onRefreshData();
    if (scanResult && scanResult.order && scanResult.order.id === orderId) {
      setScanResult({
        ...scanResult,
        order: { ...scanResult.order, orderStatus: 'picked_up' },
      });
    }
  };

  // Finance Slip Review Action
  const handleApproveSlip = (orderId: string) => {
    storageService.reviewSlip(orderId, true, staffName);
    setSelectedOrderForReview(null);
    onRefreshData();
  };

  const handleOpenRejectModal = (order: ShirtOrder) => {
    setSelectedOrderForReview(order);
    setRejectReasonModalOpen(true);
  };

  const handleConfirmRejectSlip = () => {
    if (!selectedOrderForReview) return;
    const finalReason = selectedRejectReason === 'อื่น ๆ' ? customRejectReason : selectedRejectReason;
    storageService.reviewSlip(selectedOrderForReview.id, false, staffName, finalReason);
    setRejectReasonModalOpen(false);
    setSelectedOrderForReview(null);
    onRefreshData();
  };

  // Save Ghost Character
  const handleSaveGhost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGhost) return;
    storageService.saveGhost(editingGhost, staffName);
    setEditingGhost(null);
    onRefreshData();
  };

  // Save Event Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.saveSettings(settingsForm, staffName);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
    onRefreshData();
  };

  // CSV Exporter
  const handleExportCSV = (type: 'applicants' | 'checkedin' | 'shirts') => {
    let headers: string[] = [];
    let rows: string[][] = [];
    let filename = '';

    if (type === 'applicants' || type === 'checkedin') {
      const data = type === 'checkedin' 
        ? applicants.filter(a => a.checkinStatus === 'checked_in')
        : applicants;

      headers = ['BIB_ID', 'Prefix', 'FirstName', 'LastName', 'Type', 'Faculty', 'Phone', 'Email', 'GhostCode', 'CheckinStatus', 'CheckedInAt', 'WantsShirt'];
      rows = data.map(a => [
        a.registrationNumber,
        a.prefix,
        a.firstName,
        a.lastName,
        a.applicantType,
        a.faculty || '',
        a.phone,
        a.email,
        a.ghostCharacterCode,
        a.checkinStatus,
        a.checkedInAt || '',
        a.wantsShirt ? 'YES' : 'NO'
      ]);
      filename = `FSS26_${type}_${new Date().toISOString().slice(0, 10)}.csv`;
    } else {
      headers = ['OrderNumber', 'ApplicantName', 'Phone', 'Items', 'Subtotal', 'PaymentStatus', 'OrderStatus', 'TransferDate', 'TransferTime'];
      rows = orders.map(o => [
        o.orderNumber,
        o.applicantName,
        o.applicantPhone,
        o.items.map(i => `${i.style} ${i.size}x${i.quantity}`).join('; '),
        String(o.subtotal),
        o.paymentStatus,
        o.orderStatus,
        o.transferDate || '',
        o.transferTime || ''
      ]);
      filename = `FSS26_shirt_orders_${new Date().toISOString().slice(0, 10)}.csv`;
    }

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + 
      [headers.join(','), ...rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Admin Control Bar */}
      <div className="bg-[#120f2b] border border-purple-800/60 rounded-3xl p-5 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-900/80 border border-purple-500/40 flex items-center justify-center text-purple-300">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                PORTAL เจ้าหน้าที่ผู้จัดงาน
              </span>
              <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-700/50 px-2 py-0.5 rounded-full">
                {currentRole}
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-white font-heading">
              ระบบบริหารจัดการ FSS Halloween Fancy Run 2026
            </h1>
          </div>
        </div>

        {/* Role Selector & Staff Profile */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 bg-[#181438] px-3 py-1.5 rounded-xl border border-purple-800/40">
            <span className="text-slate-400">บทบาท:</span>
            <select
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value as AdminRole)}
              className="bg-transparent text-amber-300 font-bold focus:outline-none"
            >
              <option value="Super Admin">Super Admin (ผู้ดูแลระบบหลัก)</option>
              <option value="Check-in Staff">Check-in Staff (เจ้าหน้าที่จุดเช็กอิน)</option>
              <option value="Finance Admin">Finance Admin (ฝ่ายการเงิน & สลิป)</option>
              <option value="Shirt Admin">Shirt Admin (ฝ่ายจัดการเสื้อที่ระลึก)</option>
              <option value="Registration Admin">Registration Admin (ฝ่ายทะเบียน)</option>
              <option value="Report Viewer">Report Viewer (ฝ่ายติดตามสถิติ)</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-[#181438] px-3 py-1.5 rounded-xl border border-purple-800/40">
            <span className="text-slate-400">ผู้ใช้งาน:</span>
            <input
              type="text"
              value={staffName}
              onChange={(e) => setStaffName(e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none w-36"
            />
          </div>

          <button
            type="button"
            onClick={onRefreshData}
            className="p-2 rounded-xl bg-purple-900/50 hover:bg-purple-800 text-slate-300 hover:text-white transition-colors"
            title="รีเฟรชข้อมูล"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Admin Sub Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-purple-900/40 text-xs sm:text-sm font-medium">
        {[
          { id: 'dashboard', label: 'แดชบอร์ด & รายงาน', icon: FileText },
          { id: 'checkin', label: 'สแกนเช็กอินหน้างาน (QR Check-in)', icon: QrCode },
          { id: 'finance', label: `ตรวจสอบสลิปการเงิน (${metrics.pendingSlips})`, icon: CreditCard },
          { id: 'shirts', label: 'จัดการสต็อก & ส่งมอบเสื้อ', icon: ShoppingBag },
          { id: 'ghosts', label: 'จัดการตัวละครผีไทย & โควตา', icon: Sparkles },
          { id: 'settings', label: 'ตั้งค่าระบบ & ธนาคาร', icon: Settings },
          { id: 'logs', label: 'ประวัติการทำงาน (Audit Logs)', icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl flex items-center gap-2 whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold shadow-md shadow-orange-500/20'
                  : 'text-slate-300 hover:bg-purple-950/60 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. DASHBOARD & OVERVIEW TAB */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          {/* KPI Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#13102c] border border-purple-900/40 rounded-3xl p-5 shadow-xl">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>ผู้ลงทะเบียนทั้งหมด</span>
                <Users className="w-4 h-4 text-sky-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                {metrics.totalApplicants} <span className="text-xs font-normal text-slate-400">/ 2,000 คน</span>
              </div>
              <div className="text-[11px] text-emerald-400 mt-1">
                สมัครฟรีตามเงื่อนไขกิจกรรม
              </div>
            </div>

            <div className="bg-[#13102c] border border-purple-900/40 rounded-3xl p-5 shadow-xl">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>เช็กอินหน้างานแล้ว</span>
                <QrCode className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-heading">
                {metrics.checkedInCount} <span className="text-xs font-normal text-slate-400">({metrics.checkinPercentage}%)</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                ยังไม่เช็กอิน: {metrics.totalApplicants - metrics.checkedInCount} คน
              </div>
            </div>

            <div className="bg-[#13102c] border border-purple-900/40 rounded-3xl p-5 shadow-xl">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>เสื้อที่สั่งซื้อทั้งหมด</span>
                <ShoppingBag className="w-4 h-4 text-orange-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-orange-400 font-heading">
                {metrics.totalShirtsOrdered} <span className="text-xs font-normal text-slate-400">ตัว</span>
              </div>
              <div className="text-[11px] text-amber-300 mt-1">
                รับเสื้อแล้ว: {metrics.pickedUpShirts} ตัว
              </div>
            </div>

            <div className="bg-[#13102c] border border-purple-900/40 rounded-3xl p-5 shadow-xl">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>รายได้ค่าเสื้อ (อนุมัติแล้ว)</span>
                <CreditCard className="w-4 h-4 text-pink-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-pink-400 font-heading">
                ฿ {metrics.totalRevenue.toLocaleString()}
              </div>
              <div className="text-[11px] text-orange-300 mt-1">
                สลิปรอตรวจ: {metrics.pendingSlips} รายการ
              </div>
            </div>
          </div>

          {/* Export Center Actions */}
          <div className="bg-[#13102c] border border-purple-900/50 rounded-3xl p-6 shadow-xl space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2 font-heading">
              <Download className="w-4 h-4 text-orange-400" />
              <span>ส่งออกข้อมูลสำหรับรายงานและการจัดพิมพ์ (CSV / Excel)</span>
            </h2>
            <div className="flex flex-wrap gap-3 pt-1">
              <button
                type="button"
                onClick={() => handleExportCSV('applicants')}
                className="px-4 py-2.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 text-white text-xs font-semibold border border-purple-700/50 flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5 text-sky-400" />
                <span>ดาวน์โหลดรายชื่อผู้สมัครทั้งหมด (CSV)</span>
              </button>
              <button
                type="button"
                onClick={() => handleExportCSV('checkedin')}
                className="px-4 py-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 text-xs font-semibold border border-emerald-700/50 flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>ดาวน์โหลดเฉพาะผู้เช็กอินแล้ว (CSV)</span>
              </button>
              <button
                type="button"
                onClick={() => handleExportCSV('shirts')}
                className="px-4 py-2.5 rounded-xl bg-orange-950/80 hover:bg-orange-900 text-orange-200 text-xs font-semibold border border-orange-700/50 flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5 text-orange-400" />
                <span>ดาวน์โหลดรายการสั่งซื้อเสื้อ & ไซซ์ (CSV)</span>
              </button>
            </div>
          </div>

          {/* Ghost Distribution Overview */}
          <div className="bg-[#13102c] border border-purple-900/50 rounded-3xl p-6 shadow-xl space-y-4">
            <h2 className="text-base font-bold text-white font-heading">
              สถิติการสุ่มตัวละครผีไทย (Ghost Popularity Distribution)
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {ghosts.map((g) => {
                const count = applicants.filter(a => a.ghostCharacterCode === g.code).length;
                const percent = applicants.length > 0 ? Math.round((count / applicants.length) * 100) : 0;
                return (
                  <div key={g.id} className="bg-[#191438] p-3 rounded-2xl border border-purple-800/40 text-center">
                    <div className="w-12 h-12 mx-auto rounded-full bg-purple-950 border border-purple-800/50 flex items-center justify-center mb-1">
                      <GhostAvatar code={g.code} size={40} />
                    </div>
                    <div className="text-xs font-bold text-white line-clamp-1">{g.name}</div>
                    <div className="text-sm font-black text-amber-300 font-mono mt-0.5">{count} คน</div>
                    <div className="text-[10px] text-slate-400">{percent}% ของผู้สมัคร</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. LIVE ON-SITE CHECK-IN SCANNER TAB */}
      {activeTab === 'checkin' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-[#13102c] border-2 border-purple-800/60 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="text-center space-y-1">
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-3 py-0.5 rounded-full border border-emerald-500/30">
                จุดลงทะเบียนหน้างาน
              </span>
              <h2 className="text-2xl font-bold text-white font-heading">
                สแกน QR Code เช็กอินผู้สมัคร
              </h2>
              <p className="text-xs text-slate-300">
                สแกนด้วยเครื่องอ่านบาร์โค้ด หรือพิมพ์ Token / หมายเลข BIB เช่น FSS26-000001
              </p>
            </div>

            {/* Token Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handlePerformCheckin(scanInput);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="สแกน QR Code หรือกรอก Token / BIB ID..."
                value={scanInput}
                onChange={(e) => setScanInput(e.target.value)}
                className="flex-1 bg-[#181438] border-2 border-purple-700/60 focus:border-emerald-500 rounded-2xl py-3 px-4 text-sm text-white focus:outline-none font-mono"
                autoFocus
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-sm hover:from-emerald-400 hover:to-teal-400 active:scale-95 transition-all shadow-md shadow-emerald-500/30"
              >
                ยืนยันเช็กอิน
              </button>
            </form>

            {/* Scan Quick Action Chips */}
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
              <span>คลิกเพื่อทดสอบสแกน:</span>
              {applicants.slice(0, 3).map(a => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => handlePerformCheckin(a.checkinToken)}
                  className="px-2.5 py-1 rounded-lg bg-purple-950 hover:bg-purple-900 text-amber-300 border border-purple-800/50 font-mono"
                >
                  {a.registrationNumber} ({a.firstName})
                </button>
              ))}
            </div>

            {/* Checkin Result Box */}
            {scanResult && scanResult.applicant && (
              <div className={`p-6 rounded-3xl border-2 space-y-4 animate-in zoom-in-95 duration-300 ${
                scanResult.isDuplicate
                  ? 'bg-rose-950/60 border-rose-500 text-rose-100'
                  : 'bg-emerald-950/50 border-emerald-500 text-emerald-100'
              }`}>
                {/* Result Title */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {scanResult.isDuplicate ? (
                      <>
                        <AlertTriangle className="w-6 h-6 text-rose-400 animate-bounce" />
                        <h3 className="text-lg font-bold text-white">
                          ⚠️ แจ้งเตือน: สแกนซ้ำ! ผู้สมัครท่านนี้เช็กอินไปแล้ว
                        </h3>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                        <h3 className="text-lg font-bold text-white">
                          ✅ เช็กอินสำเร็จเรียบร้อย!
                        </h3>
                      </>
                    )}
                  </div>
                  <span className="font-mono font-bold text-sm bg-black/40 px-3 py-1 rounded-full">
                    {scanResult.applicant.registrationNumber}
                  </span>
                </div>

                {scanResult.isDuplicate && (
                  <div className="p-3 bg-rose-900/60 rounded-xl text-xs space-y-1">
                    <div>เคยเช็กอินครั้งแรกเมื่อ: <strong>{new Date(scanResult.applicant.checkedInAt || '').toLocaleString('th-TH')}</strong></div>
                    <div>โดยเจ้าหน้าที่: <strong>{scanResult.applicant.checkedInBy || 'Staff'}</strong> ณ {scanResult.applicant.checkinPoint}</div>
                    <div className="text-rose-300 font-bold">สแกนซ้ำไปแล้ว: {scanResult.applicant.duplicateScanCount || 1} ครั้ง</div>
                  </div>
                )}

                {/* Participant Details */}
                <div className="grid grid-cols-2 gap-3 bg-black/30 p-4 rounded-2xl text-xs">
                  <div>
                    <span className="text-slate-400">ชื่อ-นามสกุล:</span><br />
                    <strong className="text-white text-sm">{scanResult.applicant.prefix} {scanResult.applicant.firstName} {scanResult.applicant.lastName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">ประเภท:</span><br />
                    <strong className="text-amber-300">{scanResult.applicant.applicantType}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">ตัวละครผีไทย:</span><br />
                    <span className="text-white font-bold">{scanResult.applicant.ghostCharacterCode}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">เบอร์โทรศัพท์:</span><br />
                    <span className="font-mono text-white">{scanResult.applicant.phone}</span>
                  </div>
                </div>

                {/* Shirt Pickup Status & Confirmation button right here */}
                {scanResult.order ? (
                  <div className="p-4 bg-orange-950/40 border border-orange-500/40 rounded-2xl space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-orange-300">
                        📦 มีคำสั่งซื้อเสื้อที่ระลึก (#{scanResult.order.orderNumber})
                      </span>
                      <span className={`font-bold px-2 py-0.5 rounded ${
                        scanResult.order.paymentStatus === 'paid' ? 'bg-emerald-900 text-emerald-300' : 'bg-rose-900 text-rose-300'
                      }`}>
                        {scanResult.order.paymentStatus === 'paid' ? 'ชำระเงินแล้ว' : 'ยังไม่ชำระ / สลิปไม่ผ่าน'}
                      </span>
                    </div>

                    <div className="text-slate-200">
                      รายการ: {scanResult.order.items.map(i => `${i.style} ไซซ์ ${i.size} (${i.quantity} ตัว)`).join(', ')}
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-slate-300">
                        สถานะการรับเสื้อ: <strong>{scanResult.order.orderStatus === 'picked_up' ? 'รับเสื้อไปแล้ว' : 'ยังไม่ได้รับเสื้อ'}</strong>
                      </span>
                      {scanResult.order.orderStatus !== 'picked_up' && scanResult.order.paymentStatus === 'paid' && (
                        <button
                          type="button"
                          onClick={() => handleConfirmShirtPickup(scanResult.order!.id)}
                          className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold"
                        >
                          บันทึกการส่งมอบเสื้อทันที
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-300">
                    ไม่ได้สั่งซื้อเสื้อที่ระลึก (รับเฉพาะเบอร์ BIB หน้างาน)
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. FINANCE SLIP REVIEW TAB */}
      {activeTab === 'finance' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#13102c] p-4 rounded-2xl border border-purple-900/40 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-semibold">กรองตามสถานะ:</span>
              <button
                type="button"
                onClick={() => setFinanceFilter('all')}
                className={`px-3 py-1.5 rounded-xl ${financeFilter === 'all' ? 'bg-purple-800 text-white font-bold' : 'bg-purple-950 text-slate-400'}`}
              >
                ทั้งหมด ({orders.length})
              </button>
              <button
                type="button"
                onClick={() => setFinanceFilter('pending_review')}
                className={`px-3 py-1.5 rounded-xl ${financeFilter === 'pending_review' ? 'bg-amber-600 text-white font-bold' : 'bg-purple-950 text-slate-400'}`}
              >
                รอตรวจสอบ ({orders.filter(o => o.paymentStatus === 'pending_review').length})
              </button>
              <button
                type="button"
                onClick={() => setFinanceFilter('paid')}
                className={`px-3 py-1.5 rounded-xl ${financeFilter === 'paid' ? 'bg-emerald-600 text-white font-bold' : 'bg-purple-950 text-slate-400'}`}
              >
                อนุมัติแล้ว ({orders.filter(o => o.paymentStatus === 'paid').length})
              </button>
              <button
                type="button"
                onClick={() => setFinanceFilter('rejected')}
                className={`px-3 py-1.5 rounded-xl ${financeFilter === 'rejected' ? 'bg-rose-600 text-white font-bold' : 'bg-purple-950 text-slate-400'}`}
              >
                ปฏิเสธสลิป ({orders.filter(o => o.paymentStatus === 'rejected').length})
              </button>
            </div>
          </div>

          {/* Orders Review Table */}
          <div className="bg-[#13102c] border border-purple-900/50 rounded-3xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#19143a] text-slate-300 font-heading border-b border-purple-800/40">
                  <tr>
                    <th className="py-3 px-4">คำสั่งซื้อ</th>
                    <th className="py-3 px-4">ผู้สั่งซื้อ</th>
                    <th className="py-3 px-4">รายการเสื้อ & ไซซ์</th>
                    <th className="py-3 px-4">ยอดเงิน (บาท)</th>
                    <th className="py-3 px-4">สลิปโอนเงิน</th>
                    <th className="py-3 px-4">สถานะการเงิน</th>
                    <th className="py-3 px-4 text-center">การดำเนินการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-900/30 text-slate-200">
                  {orders
                    .filter(o => financeFilter === 'all' || o.paymentStatus === financeFilter)
                    .map((order) => (
                      <tr key={order.id} className="hover:bg-purple-900/20">
                        <td className="py-3.5 px-4 font-mono font-bold text-orange-400">
                          {order.orderNumber}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white">{order.applicantName}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{order.applicantPhone}</div>
                        </td>
                        <td className="py-3.5 px-4 text-xs">
                          {order.items.map((i, idx) => (
                            <div key={idx}>
                              {i.style} <strong>{i.size}</strong> x {i.quantity}
                            </div>
                          ))}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-amber-300 text-sm">
                          ฿ {order.subtotal}
                        </td>
                        <td className="py-3.5 px-4">
                          {order.slipUrl ? (
                            <button
                              type="button"
                              onClick={() => setSelectedOrderForReview(order)}
                              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-950 border border-purple-700 hover:border-orange-500 text-xs text-orange-300"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>ดูภาพสลิป</span>
                            </button>
                          ) : (
                            <span className="text-slate-500 text-xs">ไม่มีสลิป</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            order.paymentStatus === 'paid' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' :
                            order.paymentStatus === 'rejected' ? 'bg-rose-950 text-rose-400 border border-rose-500/40' :
                            'bg-amber-950 text-amber-400 border border-amber-500/40'
                          }`}>
                            {order.paymentStatus === 'paid' ? 'อนุมัติแล้ว' :
                             order.paymentStatus === 'rejected' ? 'ปฏิเสธสลิป' : 'รอตรวจสลิป'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          {order.paymentStatus === 'pending_review' ? (
                            <div className="flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleApproveSlip(order.id)}
                                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                              >
                                อนุมัติ
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenRejectModal(order)}
                                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                              >
                                ปฏิเสธ
                              </button>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-xs">
                              {order.reviewedBy || '-'}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Slip Viewer Modal */}
          {selectedOrderForReview && !rejectReasonModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="relative w-full max-w-lg bg-[#14102c] border border-purple-800 rounded-3xl p-6 shadow-2xl text-slate-200 space-y-4">
                <div className="flex items-center justify-between border-b border-purple-900 pb-3">
                  <h3 className="font-bold text-white text-base">
                    สลิปการโอนเงิน #{selectedOrderForReview.orderNumber}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setSelectedOrderForReview(null)}
                    className="p-1 rounded-lg hover:bg-slate-800 text-slate-400"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="text-xs space-y-1">
                  <div>ผู้สั่งซื้อ: <strong>{selectedOrderForReview.applicantName}</strong></div>
                  <div>ยอดชำระ: <strong className="text-orange-400">฿ {selectedOrderForReview.subtotal} บาท</strong></div>
                  <div>วัน/เวลาที่ระบุ: {selectedOrderForReview.transferDate} {selectedOrderForReview.transferTime}</div>
                </div>

                <div className="max-h-[380px] overflow-auto bg-black/50 p-2 rounded-2xl flex items-center justify-center">
                  <img src={selectedOrderForReview.slipUrl} alt="Slip" className="max-h-[350px] object-contain rounded-xl" />
                </div>

                {selectedOrderForReview.paymentStatus === 'pending_review' && (
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => handleOpenRejectModal(selectedOrderForReview)}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                    >
                      ปฏิเสธสลิปนี้
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApproveSlip(selectedOrderForReview.id)}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                    >
                      อนุมัติสลิปนี้
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reject Reason Modal (Standard 8 reasons) */}
          {rejectReasonModalOpen && selectedOrderForReview && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="relative w-full max-w-md bg-[#161233] border border-rose-800/80 rounded-3xl p-6 shadow-2xl text-slate-200 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                  <span>ระบุเหตุผลในการปฏิเสธสลิป</span>
                </h3>
                <p className="text-xs text-slate-300">
                  คำสั่งซื้อ #{selectedOrderForReview.orderNumber} ({selectedOrderForReview.applicantName})
                </p>

                <div className="space-y-2 text-xs">
                  {[
                    'ภาพสลิปไม่ชัดเจน / ไม่สามารถตรวจสอบยอดได้',
                    'ยอดเงินที่โอนไม่ตรงกับยอดที่สั่งซื้อ',
                    'วันที่หรือเวลาที่โอนไม่ตรงกับในสลิป',
                    'โอนเงินเข้าบัญชีไม่ถูกต้อง',
                    'ภาพสลิปซ้ำกับรายการอื่นในระบบ',
                    'ไม่พบยอดเงินเข้าบัญชีธนาคารของผู้จัดงาน',
                    'อื่น ๆ (ระบุเอง)',
                  ].map((r) => (
                    <label key={r} className="flex items-center gap-2 cursor-pointer p-2 rounded-xl bg-[#1c173d] hover:bg-[#231d4d]">
                      <input
                        type="radio"
                        name="rejectReason"
                        value={r}
                        checked={selectedRejectReason === r}
                        onChange={(e) => setSelectedRejectReason(e.target.value)}
                        className="text-rose-500"
                      />
                      <span className="text-slate-200">{r}</span>
                    </label>
                  ))}

                  {selectedRejectReason === 'อื่น ๆ (ระบุเอง)' && (
                    <textarea
                      rows={2}
                      placeholder="ระบุเหตุผลเพิ่มเติม..."
                      value={customRejectReason}
                      onChange={(e) => setCustomRejectReason(e.target.value)}
                      className="w-full bg-[#120d26] border border-purple-800 rounded-xl p-2 text-white text-xs mt-2"
                    />
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setRejectReasonModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmRejectSlip}
                    className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                  >
                    ยืนยันปฏิเสธสลิป
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. SHIRT INVENTORY & PICKUP TAB */}
      {activeTab === 'shirts' && (
        <div className="space-y-6">
          <div className="bg-[#13102c] border border-purple-900/50 rounded-3xl p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-white font-heading">
              สรุปจำนวนสต็อกและยอดสั่งซื้อเสื้อแต่ละไซซ์ (XS - 5XL)
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {sizeChart.map((s) => {
                // Count ordered for this size
                const orderedCount = orders.reduce((sum, o) => {
                  const match = o.items.filter(i => i.size === s.size);
                  return sum + match.reduce((sub, item) => sub + item.quantity, 0);
                }, 0);

                return (
                  <div key={s.size} className="bg-[#191438] p-4 rounded-2xl border border-purple-800/40 text-center">
                    <div className="text-xl font-black text-white font-heading">{s.size}</div>
                    <div className="text-xs text-slate-400">อก {s.chestInches}"</div>
                    <div className="mt-2 text-base font-extrabold text-orange-400 font-mono">
                      {orderedCount} <span className="text-xs font-normal text-slate-400">ตัว</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 5. GHOST CHARACTERS MANAGER & PROBABILITY WEIGHTS TAB */}
      {activeTab === 'ghosts' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white font-heading">
              จัดการตัวละครผีไทย 12 แบบ & ปรับน้ำหนักการสุ่ม (Weights)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ghosts.map((g) => (
              <div key={g.id} className="bg-[#13102c] border border-purple-900/40 rounded-3xl p-5 shadow-xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-purple-950 border border-purple-800 flex items-center justify-center shrink-0">
                    <GhostAvatar code={g.code} size={50} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold text-white" style={{ backgroundColor: g.color }}>
                        {g.code}
                      </span>
                      <span className="text-[11px] text-emerald-400 font-bold">
                        {g.activeStatus ? 'เปิดใช้งาน' : 'ปิดชั่วคราว'}
                      </span>
                    </div>
                    <h3 className="font-bold text-white text-sm mt-0.5">{g.name}</h3>
                  </div>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2">
                  {g.description}
                </p>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-purple-900/40">
                  <span className="text-slate-400">น้ำหนักการสุ่ม (Weight):</span>
                  <span className="font-bold text-amber-300 font-mono">{g.probabilityWeight || 10}</span>
                </div>

                <button
                  type="button"
                  onClick={() => setEditingGhost({ ...g })}
                  className="w-full py-2 rounded-xl bg-purple-950 hover:bg-purple-900 text-slate-200 font-semibold text-xs border border-purple-700/50 flex items-center justify-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>แก้ไขข้อมูล / น้ำหนัก</span>
                </button>
              </div>
            ))}
          </div>

          {/* Edit Ghost Modal */}
          {editingGhost && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <form onSubmit={handleSaveGhost} className="relative w-full max-w-md bg-[#161233] border border-purple-700 rounded-3xl p-6 shadow-2xl space-y-4 text-xs">
                <h3 className="text-base font-bold text-white">
                  แก้ไขตัวละคร {editingGhost.name} ({editingGhost.code})
                </h3>

                <div>
                  <label className="block text-slate-300 mb-1">ชื่อตัวละคร</label>
                  <input
                    type="text"
                    value={editingGhost.name}
                    onChange={(e) => setEditingGhost({ ...editingGhost, name: e.target.value })}
                    className="w-full bg-[#110d26] border border-purple-800 rounded-xl p-2.5 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">สโลแกน (Tagline)</label>
                  <input
                    type="text"
                    value={editingGhost.tagline}
                    onChange={(e) => setEditingGhost({ ...editingGhost, tagline: e.target.value })}
                    className="w-full bg-[#110d26] border border-purple-800 rounded-xl p-2.5 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">คำอธิบายบุคลิก</label>
                  <textarea
                    rows={3}
                    value={editingGhost.description}
                    onChange={(e) => setEditingGhost({ ...editingGhost, description: e.target.value })}
                    className="w-full bg-[#110d26] border border-purple-800 rounded-xl p-2.5 text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1">น้ำหนักสุ่ม (1-100)</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={editingGhost.probabilityWeight || 10}
                      onChange={(e) => setEditingGhost({ ...editingGhost, probabilityWeight: Number(e.target.value) })}
                      className="w-full bg-[#110d26] border border-purple-800 rounded-xl p-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">สถานะ</label>
                    <select
                      value={editingGhost.activeStatus ? 'active' : 'inactive'}
                      onChange={(e) => setEditingGhost({ ...editingGhost, activeStatus: e.target.value === 'active' })}
                      className="w-full bg-[#110d26] border border-purple-800 rounded-xl p-2 text-white"
                    >
                      <option value="active">เปิดให้สุ่ม</option>
                      <option value="inactive">ปิดชั่วคราว</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setEditingGhost(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-orange-500 text-slate-950 font-bold"
                  >
                    บันทึกข้อมูล
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* 6. SETTINGS TAB */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSaveSettings} className="bg-[#13102c] border border-purple-900/50 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4 text-xs sm:text-sm">
            <h2 className="text-lg font-bold text-white font-heading border-b border-purple-900/40 pb-3">
              ตั้งค่าระบบกิจกรรม & บัญชีธนาคาร
            </h2>

            <div>
              <label className="block text-slate-300 mb-1">ชื่องานกิจกรรม</label>
              <input
                type="text"
                value={settingsForm.eventName}
                onChange={(e) => setSettingsForm({ ...settingsForm, eventName: e.target.value })}
                className="w-full bg-[#181438] border border-purple-800 rounded-xl p-2.5 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 mb-1">ราคาเสื้อที่ระลึก (บาท)</label>
                <input
                  type="number"
                  value={settingsForm.shirtPrice}
                  onChange={(e) => setSettingsForm({ ...settingsForm, shirtPrice: Number(e.target.value) })}
                  className="w-full bg-[#181438] border border-purple-800 rounded-xl p-2.5 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">ความจุผู้สมัครสูงสุด (คน)</label>
                <input
                  type="number"
                  value={settingsForm.maxCapacity}
                  onChange={(e) => setSettingsForm({ ...settingsForm, maxCapacity: Number(e.target.value) })}
                  className="w-full bg-[#181438] border border-purple-800 rounded-xl p-2.5 text-white font-mono"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-purple-900/40 space-y-3">
              <h3 className="font-bold text-amber-300">ข้อมูลบัญชีธนาคารรับโอนค่าเสื้อ</h3>
              <div>
                <label className="block text-slate-300 mb-1">ธนาคาร</label>
                <input
                  type="text"
                  value={settingsForm.bankName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, bankName: e.target.value })}
                  className="w-full bg-[#181438] border border-purple-800 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">ชื่อบัญชี</label>
                <input
                  type="text"
                  value={settingsForm.bankAccountName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, bankAccountName: e.target.value })}
                  className="w-full bg-[#181438] border border-purple-800 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">เลขที่บัญชี</label>
                <input
                  type="text"
                  value={settingsForm.bankAccountNo}
                  onChange={(e) => setSettingsForm({ ...settingsForm, bankAccountNo: e.target.value })}
                  className="w-full bg-[#181438] border border-purple-800 rounded-xl p-2.5 text-white font-mono"
                />
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{settingsSaved ? 'บันทึกการตั้งค่าสำเร็จ!' : 'บันทึกการตั้งค่า'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 7. AUDIT LOGS TAB */}
      {activeTab === 'logs' && (
        <div className="bg-[#13102c] border border-purple-900/50 rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-purple-900/40 pb-3">
            <h2 className="text-base font-bold text-white font-heading">
              ประวัติการดำเนินงานของระบบ (Security & Audit Trail)
            </h2>
            <span className="text-xs text-slate-400">บันทึกล่าสุด 200 รายการ</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#19143a] text-slate-300 font-heading">
                <tr>
                  <th className="py-2.5 px-3">วันและเวลา</th>
                  <th className="py-2.5 px-3">การกระทำ (Action)</th>
                  <th className="py-2.5 px-3">ผู้ดำเนินการ</th>
                  <th className="py-2.5 px-3">บทบาท</th>
                  <th className="py-2.5 px-3">รายละเอียด</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-900/30 text-slate-200 font-mono text-[11px]">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-purple-900/20">
                    <td className="py-2.5 px-3 text-slate-400">
                      {new Date(log.timestamp).toLocaleString('th-TH')}
                    </td>
                    <td className="py-2.5 px-3 text-orange-400 font-bold">
                      {log.action}
                    </td>
                    <td className="py-2.5 px-3 text-white">
                      {log.performedBy}
                    </td>
                    <td className="py-2.5 px-3 text-purple-300">
                      {log.role}
                    </td>
                    <td className="py-2.5 px-3 text-slate-300 font-sans">
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
