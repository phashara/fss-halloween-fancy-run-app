import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  ShieldCheck, 
  AlertCircle, 
  Upload, 
  ShoppingBag, 
  Copy, 
  QrCode, 
  Plus, 
  Trash2, 
  Info, 
  Heart, 
  Phone, 
  Mail, 
  User, 
  Search 
} from 'lucide-react';
import { 
  Applicant, 
  ApplicantType, 
  ShirtOrder, 
  OrderItem, 
  ShirtSize, 
  GhostCharacter, 
  EventSettings, 
  SizeChartEntry 
} from '../types';
import { 
  storageService, 
  assignDeterministicGhost, 
  generateRegistrationNumber, 
  generateCheckinToken 
} from '../data/storage';
import { ParticipantCard } from './ParticipantCard';
import { EmailPreviewModal } from './EmailPreviewModal';

interface RegistrationFlowProps {
  settings: EventSettings;
  ghosts: GhostCharacter[];
  sizeChart: SizeChartEntry[];
  onComplete: (applicant: Applicant) => void;
  onNavigateStatus: () => void;
}

export const RegistrationFlow: React.FC<RegistrationFlowProps> = ({
  settings,
  ghosts,
  sizeChart,
  onComplete,
  onNavigateStatus,
}) => {
  // Wizard steps: 1: Personal Info, 2: Shirt Choice & Payment, 3: Consent & Confirmation, 4: Success/Reveal
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State - Step 1
  const [prefix, setPrefix] = useState('นาย');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nickname, setNickname] = useState('');
  const [englishName, setEnglishName] = useState('');
  const [birthDate, setBirthDate] = useState('2004-05-15');
  const [gender, setGender] = useState<'ชาย' | 'หญิง' | 'ไม่ประสงค์ระบุ'>('ชาย');
  const [applicantType, setApplicantType] = useState<ApplicantType>('นิสิตคณะสังคมศาสตร์');
  const [studentId, setStudentId] = useState('');
  const [faculty, setFaculty] = useState('คณะสังคมศาสตร์');
  const [department, setDepartment] = useState('ภาควิชารัฐศาสตร์และรัฐประศาสนศาสตร์');
  const [organization, setOrganization] = useState('');
  const [teamName, setTeamName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [province, setProvince] = useState('พิษณุโลก');

  // Emergency & Health Info
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactRelation, setEmergencyContactRelation] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [hasMedicalCondition, setHasMedicalCondition] = useState(false);
  const [medicalConditions, setMedicalConditions] = useState('');
  const [allergies, setAllergies] = useState('');

  // Step 2 - Shirt Purchase
  const [wantsShirt, setWantsShirt] = useState<boolean>(false);
  const [shirtItems, setShirtItems] = useState<OrderItem[]>([
    { style: 'เสื้อวิ่งแขนสั้น (Regular)', size: 'L', quantity: 1, unitPrice: settings.shirtPrice, totalPrice: settings.shirtPrice }
  ]);
  const [slipFile, setSlipFile] = useState<string | null>(null);
  const [slipFileName, setSlipFileName] = useState<string>('');
  const [transferDate, setTransferDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [transferTime, setTransferTime] = useState<string>('14:30');
  const [transferAmount, setTransferAmount] = useState<number>(settings.shirtPrice);
  const [bankCopied, setBankCopied] = useState(false);

  // Step 3 - Consents
  const [consentPdpa, setConsentPdpa] = useState(true);
  const [consentHealth, setConsentHealth] = useState(true);
  const [consentMedia, setConsentMedia] = useState(true);
  const [consentPublicName, setConsentPublicName] = useState(true);

  // Completion State
  const [createdApplicant, setCreatedApplicant] = useState<Applicant | null>(null);
  const [assignedGhost, setAssignedGhost] = useState<GhostCharacter | null>(null);
  const [createdOrder, setCreatedOrder] = useState<ShirtOrder | undefined>(undefined);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Calculate Shirt Subtotal
  const shirtSubtotal = shirtItems.reduce((sum, item) => sum + item.totalPrice, 0);

  // Duplicate Check Validation
  const validateStep1 = (): boolean => {
    setValidationError(null);
    if (!firstName.trim() || !lastName.trim()) {
      setValidationError('กรุณากรอกชื่อและนามสกุลจริง');
      return false;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 9) {
      setValidationError('กรุณากรอกเบอร์โทรศัพท์ที่ถูกต้อง (9-10 หลัก)');
      return false;
    }
    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      setValidationError('กรุณากรอกอีเมลที่ถูกต้องสำหรับรับการ์ดและ QR Code');
      return false;
    }
    if (applicantType === 'นิสิตคณะสังคมศาสตร์' || applicantType === 'นิสิต ม.นเรศวร ต่างคณะ') {
      if (!studentId.trim()) {
        setValidationError('กรุณาระบุรหัสนิสิต มหาวิทยาลัยนเรศวร');
        return false;
      }
    }
    if (!emergencyContactName.trim() || !emergencyContactPhone.trim()) {
      setValidationError('กรุณาระบุชื่อและเบอร์โทรศัพท์ของผู้ติดต่อฉุกเฉิน');
      return false;
    }

    // Check duplicate in database
    const existing = storageService.getApplicants();
    const isDupEmail = existing.some(a => a.email.toLowerCase() === email.trim().toLowerCase());
    const isDupPhone = existing.some(a => a.phone.replace(/\D/g, '') === phone.replace(/\D/g, ''));
    if (isDupEmail) {
      setValidationError(`อีเมล ${email} เคยลงทะเบียนในระบบแล้ว คุณสามารถกด "ตรวจสอบสถานะ" เพื่อดูข้อมูลการลงทะเบียนเดิมได้`);
      return false;
    }
    if (isDupPhone) {
      setValidationError(`เบอร์โทรศัพท์ ${phone} เคยลงทะเบียนในระบบแล้ว`);
      return false;
    }

    return true;
  };

  const validateStep2 = (): boolean => {
    setValidationError(null);
    if (wantsShirt) {
      if (shirtItems.length === 0) {
        setValidationError('กรุณาเลือกไซซ์และจำนวนเสื้ออย่างน้อย 1 ตัว');
        return false;
      }
      if (!slipFile) {
        setValidationError('กรุณาแนบภาพสลิปหลักฐานการโอนเงินค่าเสื้อที่ระลึก');
        return false;
      }
    }
    return true;
  };

  // Add a new shirt item row
  const handleAddShirtItem = () => {
    setShirtItems([
      ...shirtItems,
      { style: 'เสื้อวิ่งแขนสั้น (Regular)', size: 'M', quantity: 1, unitPrice: settings.shirtPrice, totalPrice: settings.shirtPrice }
    ]);
  };

  const handleUpdateShirtItem = (index: number, updates: Partial<OrderItem>) => {
    const next = [...shirtItems];
    const item = { ...next[index], ...updates };
    item.totalPrice = item.quantity * item.unitPrice;
    next[index] = item;
    setShirtItems(next);
  };

  const handleRemoveShirtItem = (index: number) => {
    if (shirtItems.length > 1) {
      setShirtItems(shirtItems.filter((_, i) => i !== index));
    }
  };

  // Handle Slip Upload
  const handleSlipUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('กรุณาอัปโหลดไฟล์รูปภาพ (JPG, PNG)');
      return;
    }

    setSlipFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setSlipFile(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Copy Bank Account
  const handleCopyBank = () => {
    navigator.clipboard.writeText(settings.bankAccountNo.replace(/\D/g, ''));
    setBankCopied(true);
    setTimeout(() => setBankCopied(false), 2000);
  };

  // Submit Final Registration
  const handleSubmitRegistration = () => {
    if (!consentPdpa || !consentHealth) {
      setValidationError('กรุณากดยินยอมเงื่อนไข PDPA และยืนยันข้อมูลสุขภาพ');
      return;
    }

    const applicantsList = storageService.getApplicants();
    const newRegNumber = generateRegistrationNumber(applicantsList.length);
    const checkinToken = generateCheckinToken();
    const applicantId = `app-${Date.now()}`;

    // Deterministically pick Thai Ghost character based on reg number
    const assigned = assignDeterministicGhost(newRegNumber + email, ghosts);

    const newApplicant: Applicant = {
      id: applicantId,
      registrationNumber: newRegNumber,
      title: prefix,
      prefix,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      nickname: nickname.trim(),
      englishName: englishName.trim().toUpperCase(),
      birthDate,
      ageRange: '20-29 ปี',
      gender,
      applicantType,
      studentId: studentId.trim() || undefined,
      faculty: faculty.trim() || undefined,
      department: department.trim() || undefined,
      organization: organization.trim() || undefined,
      teamName: teamName.trim() || undefined,
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      province,
      emergencyName: emergencyContactName.trim(),
      emergencyRelationship: emergencyContactRelation.trim(),
      emergencyPhone: emergencyContactPhone.trim(),
      emergencyContactName: emergencyContactName.trim(),
      emergencyContactRelation: emergencyContactRelation.trim(),
      emergencyContactPhone: emergencyContactPhone.trim(),
      medicalCondition: hasMedicalCondition ? medicalConditions.trim() : 'ไม่มีโรคประจำตัว',
      medicalConditions: hasMedicalCondition ? medicalConditions.trim() : 'ไม่มีโรคประจำตัว',
      drugAllergy: hasMedicalCondition ? allergies.trim() : 'ไม่มีประวัติแพ้ยาหรืออาหาร',
      allergies: hasMedicalCondition ? allergies.trim() : 'ไม่มีประวัติแพ้ยาหรืออาหาร',
      wantsShirt,
      ghostId: assigned.id,
      ghostCharacterId: assigned.id,
      ghostCharacterCode: assigned.code,
      checkinToken,
      checkinStatus: 'not_checked_in',
      publicNameConsent: consentPublicName,
      consentPublicName,
      pdpaConsent: consentPdpa,
      consentPdpa,
      activityConsent: consentHealth && consentMedia,
      consentHealth,
      consentMedia,
      registrationStatus: 'success',
      registeredAt: new Date().toISOString(),
      emailStatus: 'sent',
      emailSentAt: new Date().toISOString(),
      emailSendCount: 1,
      downloadCount: 0,
    };

    // Save applicant
    storageService.addApplicant(newApplicant);

    // If ordered shirt, create ShirtOrder
    let order: ShirtOrder | undefined = undefined;
    if (wantsShirt && slipFile) {
      const ordersList = storageService.getOrders();
      const orderNumber = `ORD26-${String(ordersList.length + 1).padStart(5, '0')}`;
      order = {
        id: `ord-${Date.now()}`,
        orderNumber,
        applicantId: newApplicant.id,
        applicantName: `${newApplicant.firstName} ${newApplicant.lastName}`,
        applicantPhone: newApplicant.phone,
        items: shirtItems,
        subtotal: shirtSubtotal,
        slipUrl: slipFile,
        slipName: slipFileName || 'slip.jpg',
        transferDate,
        transferTime,
        transferAmount: transferAmount || shirtSubtotal,
        paymentStatus: 'pending_review',
        orderStatus: 'payment_pending',
        deliveryType: 'pickup_event',
        createdAt: new Date().toISOString(),
      };
      storageService.addOrder(order);
    }

    setCreatedApplicant(newApplicant);
    setAssignedGhost(assigned);
    setCreatedOrder(order);
    setCurrentStep(4);
    onComplete(newApplicant);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Progress Steps Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-2xl mx-auto relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800 -translate-y-1/2 -z-0" />
          
          {[
            { num: 1, label: 'ข้อมูลผู้สมัคร' },
            { num: 2, label: 'เสื้อที่ระลึก (ฟรี/สั่งซื้อ)' },
            { num: 3, label: 'ยืนยันข้อตกลง' },
            { num: 4, label: 'รับการ์ดผี & QR' },
          ].map((s) => {
            const isDone = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            return (
              <div key={s.num} className="flex flex-col items-center relative z-10">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm transition-all ${
                    isDone
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                      : isCurrent
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-lg shadow-orange-500/40 ring-4 ring-orange-500/20'
                        : 'bg-slate-900 border border-slate-700 text-slate-400'
                  }`}
                >
                  {isDone ? <Check className="w-5 h-5" /> : s.num}
                </div>
                <span className={`text-[11px] font-semibold mt-2 hidden sm:block ${
                  isCurrent ? 'text-orange-400' : isDone ? 'text-emerald-400' : 'text-slate-500'
                }`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Error Alert Box */}
      {validationError && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs sm:text-sm flex items-start gap-3 shadow-lg">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold">กรุณาตรวจสอบข้อมูล:</span> {validationError}
          </div>
        </div>
      )}

      {/* STEP 1: PERSONAL & EMERGENCY & HEALTH INFO */}
      {currentStep === 1 && (
        <div className="bg-[#121128] border border-purple-900/50 rounded-3xl p-6 sm:p-8 shadow-xl text-slate-200 space-y-6">
          <div className="border-b border-purple-900/40 pb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>การลงทะเบียนเข้าร่วมกิจกรรม ฟรี 100%</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-heading">
              ข้อมูลผู้สมัครเข้าร่วมกิจกรรม
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              กรุณากรอกข้อมูลตามความเป็นจริง เพื่อความปลอดภัยและสิทธิประโยชน์ในการเข้าร่วมงาน
            </p>
          </div>

          {/* Personal Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                คำนำหน้าชื่อ *
              </label>
              <select
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                className="w-full bg-[#1b1738] border border-purple-800/50 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
              >
                <option value="นาย">นาย</option>
                <option value="นางสาว">นางสาว</option>
                <option value="นาง">นาง</option>
                <option value="ดร.">ดร.</option>
                <option value="ผศ.ดร.">ผศ.ดร.</option>
                <option value="อาจารย์">อาจารย์</option>
                <option value="อื่น ๆ">อื่น ๆ</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                ชื่อจริง (ภาษาไทย) *
              </label>
              <input
                type="text"
                placeholder="เช่น กานต์"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-[#1b1738] border border-purple-800/50 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 placeholder-slate-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                นามสกุล *
              </label>
              <input
                type="text"
                placeholder="เช่น วัฒนพงศ์"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full bg-[#1b1738] border border-purple-800/50 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 placeholder-slate-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                ชื่อเล่น
              </label>
              <input
                type="text"
                placeholder="เช่น โบ๊ท"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full bg-[#1b1738] border border-purple-800/50 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 placeholder-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                ชื่อ-นามสกุลภาษาอังกฤษ (พิมพ์ใหญ่)
              </label>
              <input
                type="text"
                placeholder="เช่น KARN WATTANAPONG"
                value={englishName}
                onChange={(e) => setEnglishName(e.target.value.toUpperCase())}
                className="w-full bg-[#1b1738] border border-purple-800/50 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 placeholder-slate-500 uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                เพศสภาพ *
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full bg-[#1b1738] border border-purple-800/50 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
              >
                <option value="ชาย">ชาย</option>
                <option value="หญิง">หญิง</option>
                <option value="ไม่ประสงค์ระบุ">ไม่ประสงค์ระบุ (LGBTQ+ / Prefer not to say)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                วันเกิด *
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full bg-[#1b1738] border border-purple-800/50 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                เบอร์โทรศัพท์มือถือ * (10 หลัก)
              </label>
              <input
                type="tel"
                placeholder="0812345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#1b1738] border border-purple-800/50 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 placeholder-slate-500 font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                อีเมล * (สำหรับรับการ์ด & QR เช็กอิน)
              </label>
              <input
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1b1738] border border-purple-800/50 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 placeholder-slate-500"
                required
              />
            </div>
          </div>

          {/* Academic / Affiliation Info */}
          <div className="pt-4 border-t border-purple-900/30">
            <h3 className="text-sm font-bold text-amber-400 mb-3">
              ข้อมูลสังกัด & สถานะในมหาวิทยาลัย
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  ประเภทผู้สมัคร *
                </label>
                <select
                  value={applicantType}
                  onChange={(e) => setApplicantType(e.target.value as ApplicantType)}
                  className="w-full bg-[#1b1738] border border-purple-800/50 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="นิสิตคณะสังคมศาสตร์">นิสิตคณะสังคมศาสตร์</option>
                  <option value="นิสิต ม.นเรศวร ต่างคณะ">นิสิต ม.นเรศวร ต่างคณะ</option>
                  <option value="บุคลากร / อาจารย์ ม.นเรศวร">บุคลากร / อาจารย์ ม.นเรศวร</option>
                  <option value="ศิษย์เก่า ม.นเรศวร">ศิษย์เก่า ม.นเรศวร</option>
                  <option value="ประชาชนทั่วไป">ประชาชนทั่วไป</option>
                </select>
              </div>

              {(applicantType === 'นิสิตคณะสังคมศาสตร์' || applicantType === 'นิสิต ม.นเรศวร ต่างคณะ') && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    รหัสนิสิต (8 หรือ 10 หลัก) *
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น 66012345"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full bg-[#1b1738] border border-purple-800/50 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 font-mono"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  คณะ / หน่วยงาน
                </label>
                <input
                  type="text"
                  placeholder="เช่น คณะสังคมศาสตร์"
                  value={faculty}
                  onChange={(e) => setFaculty(e.target.value)}
                  className="w-full bg-[#1b1738] border border-purple-800/50 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  ภาควิชา / สาขาวิชา
                </label>
                <input
                  type="text"
                  placeholder="เช่น รัฐศาสตร์ / ประวัติศาสตร์ / จิตวิทยา"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-[#1b1738] border border-purple-800/50 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  ทีมวิ่ง / กลุ่มเพื่อน (ถ้ามี)
                </label>
                <input
                  type="text"
                  placeholder="เช่น ก๊วนผีสาวสองแคว"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full bg-[#1b1738] border border-purple-800/50 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  จังหวัดที่พักอาศัยปัจจุบัน *
                </label>
                <input
                  type="text"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full bg-[#1b1738] border border-purple-800/50 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact & Health Section */}
          <div className="pt-4 border-t border-purple-900/30">
            <h3 className="text-sm font-bold text-pink-400 mb-1">
              ข้อมูลผู้ติดต่อฉุกเฉิน & สุขภาพ (เพื่อความปลอดภัยในการวิ่ง)
            </h3>
            <p className="text-[11px] text-slate-400 mb-3">
              ข้อมูลส่วนนี้จะถูกจัดเก็บเป็นความลับ ใช้สำหรับทีมพยาบาลและกรณีเกิดเหตุฉุกเฉินเท่านั้น
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  ชื่อ-นามสกุล ผู้ติดต่อฉุกเฉิน *
                </label>
                <input
                  type="text"
                  placeholder="เช่น นางสมศรี วัฒนพงศ์"
                  value={emergencyContactName}
                  onChange={(e) => setEmergencyContactName(e.target.value)}
                  className="w-full bg-[#1b1738] border border-purple-800/50 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  ความสัมพันธ์ *
                </label>
                <input
                  type="text"
                  placeholder="เช่น มารดา, บิดา, พี่สาว, เพื่อนสนิท"
                  value={emergencyContactRelation}
                  onChange={(e) => setEmergencyContactRelation(e.target.value)}
                  className="w-full bg-[#1b1738] border border-purple-800/50 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  เบอร์โทรศัพท์ติดต่อฉุกเฉิน *
                </label>
                <input
                  type="tel"
                  placeholder="0898765432"
                  value={emergencyContactPhone}
                  onChange={(e) => setEmergencyContactPhone(e.target.value)}
                  className="w-full bg-[#1b1738] border border-purple-800/50 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 font-mono"
                  required
                />
              </div>
            </div>

            {/* Health condition switch */}
            <div className="bg-[#171330] p-4 rounded-2xl border border-purple-900/40">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-white">
                  ท่านมีโรคประจำตัวหรือประวัติแพ้ยา/อาหารหรือไม่?
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setHasMedicalCondition(false)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      !hasMedicalCondition
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    ไม่มี (สุขภาพแข็งแรง)
                  </button>
                  <button
                    type="button"
                    onClick={() => setHasMedicalCondition(true)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      hasMedicalCondition
                        ? 'bg-rose-600 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    มีโรคประจำตัว / แพ้ยา
                  </button>
                </div>
              </div>

              {hasMedicalCondition && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      ระบุโรคประจำตัว (เช่น หอบหืด, ความดัน, หัวใจ)
                    </label>
                    <input
                      type="text"
                      placeholder="ระบุโรคประจำตัว"
                      value={medicalConditions}
                      onChange={(e) => setMedicalConditions(e.target.value)}
                      className="w-full bg-[#1c173d] border border-purple-700/50 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      ประวัติการแพ้ยาหรืออาหาร
                    </label>
                    <input
                      type="text"
                      placeholder="เช่น แพ้เพนิซิลลิน, แพ้อาหารทะเล"
                      value={allergies}
                      onChange={(e) => setAllergies(e.target.value)}
                      className="w-full bg-[#1c173d] border border-purple-700/50 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="pt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={onNavigateStatus}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span>เคยสมัครแล้ว? ตรวจสอบสถานะที่นี่</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (validateStep1()) {
                  setCurrentStep(2);
                }
              }}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold text-sm hover:from-orange-400 hover:to-amber-400 active:scale-95 transition-all shadow-lg shadow-orange-500/25 flex items-center gap-2"
            >
              <span>ถัดไป: เลือกเสื้อที่ระลึก</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: SOUVENIR SHIRT CHOICE & SLIP UPLOAD */}
      {currentStep === 2 && (
        <div className="bg-[#121128] border border-purple-900/50 rounded-3xl p-6 sm:p-8 shadow-xl text-slate-200 space-y-6">
          <div className="border-b border-purple-900/40 pb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white font-heading">
              ขั้นตอนที่ 2: เสื้อที่ระลึกประจำกิจกรรม (สินค้าทางเลือก)
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              ผู้สมัครสามารถเลือกเข้าร่วมกิจกรรม <strong>ฟรีโดยไม่ซื้อเสื้อ</strong> หรือเลือกสั่งซื้อเสื้อเพื่อสนับสนุนกิจกรรม
            </p>
          </div>

          {/* Big Clear Choice Toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Choice 1: Free Run (No Shirt) */}
            <div
              onClick={() => setWantsShirt(false)}
              className={`cursor-pointer rounded-2xl p-5 border-2 transition-all flex flex-col justify-between ${
                !wantsShirt
                  ? 'bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/30 shadow-lg'
                  : 'bg-[#181433] border-purple-900/40 hover:border-purple-600'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    แนะนำสำหรับผู้ต้องการวิ่งฟรี
                  </span>
                  {!wantsShirt && (
                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-bold text-white font-heading">
                  ไม่สั่งซื้อเสื้อ (เข้าร่วมฟรี 100%)
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  ได้รับหมายเลขผู้สมัคร (BIB), การ์ดสุ่มตัวละครผีไทย, QR Code เช็กอินหน้างาน, สิทธิ์ประกวดแฟนซี และรับอาหารเครื่องดื่มฟรีตลอดงาน
                </p>
              </div>
              <div className="text-2xl font-extrabold text-emerald-400 font-heading mt-4">
                ฿ 0 บาท (ฟรี)
              </div>
            </div>

            {/* Choice 2: Buy Souvenir Shirt */}
            <div
              onClick={() => setWantsShirt(true)}
              className={`cursor-pointer rounded-2xl p-5 border-2 transition-all flex flex-col justify-between ${
                wantsShirt
                  ? 'bg-orange-950/40 border-orange-500 ring-2 ring-orange-500/30 shadow-lg'
                  : 'bg-[#181433] border-purple-900/40 hover:border-purple-600'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-400 bg-orange-950 px-2.5 py-0.5 rounded-full border border-orange-500/30">
                    สินค้าที่ระลึกลิมิเต็ด
                  </span>
                  {wantsShirt && (
                    <div className="w-6 h-6 rounded-full bg-orange-500 text-slate-950 flex items-center justify-center font-bold">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-bold text-white font-heading">
                  ต้องการสั่งซื้อเสื้อที่ระลึก
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  เสื้อวิ่งผ้า Dry-fit สกรีนลายผีไทยเรืองแสง Glow-in-the-dark ดีไซน์พิเศษเฉพาะงาน FSS Halloween Fancy Run 2026 (รับเสื้อหน้างาน)
                </p>
              </div>
              <div className="text-2xl font-extrabold text-orange-400 font-heading mt-4">
                ฿ {settings.shirtPrice} บาท / ตัว
              </div>
            </div>
          </div>

          {/* If User wants to purchase shirt: Display Order Configurator & Payment */}
          {wantsShirt && (
            <div className="space-y-6 pt-2 animate-in fade-in duration-300">
              {/* Shirt Preview Specs Card */}
              <div className="bg-[#181435] p-5 rounded-2xl border border-purple-800/50 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div>
                  <div className="inline-block text-[11px] font-bold text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded-full mb-2">
                    ผ้าไมโครโพลีเอสเตอร์ Dry-fit 100%
                  </div>
                  <h4 className="text-base font-bold text-white">
                    เสื้อวิ่งฮาโลวีนผีไทย FSS 2026 (Neon Glow)
                  </h4>
                  <ul className="text-xs text-slate-300 space-y-1.5 mt-2">
                    <li>• เนื้อผ้าน้ำหนักเบา ระบายอากาศได้ดีเยี่ยม ไม่อมเหงื่อ</li>
                    <li>• ลายสกรีนหมึกเรืองแสงพิเศษ (Glow in the dark) ใต้แสงแบล็กไลต์</li>
                    <li>• มีให้เลือกทั้งแบบเสื้อวิ่งแขนสั้น Regular และเสื้อวิ่งแขนกุด</li>
                    <li>• มีขนาดรองรับตั้งแต่ไซซ์ XS (รอบอก 34") จนถึง 5XL (รอบอก 50")</li>
                  </ul>
                </div>

                {/* Size Chart Table Preview */}
                <div className="overflow-x-auto">
                  <table className="w-full text-center text-xs border border-purple-800/40 rounded-xl overflow-hidden">
                    <thead className="bg-purple-950/80 text-orange-300">
                      <tr>
                        <th className="py-2 px-2 border-b border-purple-800/40">ไซซ์</th>
                        <th className="py-2 px-2 border-b border-purple-800/40">รอบอก (นิ้ว)</th>
                        <th className="py-2 px-2 border-b border-purple-800/40">ความยาว (นิ้ว)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-900/30 text-slate-300">
                      {sizeChart.slice(0, 5).map((row) => (
                        <tr key={row.size} className="hover:bg-purple-900/20">
                          <td className="py-1.5 font-bold text-white">{row.size}</td>
                          <td className="py-1.5">{row.chestInches}"</td>
                          <td className="py-1.5">{row.lengthInches}"</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="text-[10px] text-slate-400 text-center mt-1">
                    *มีไซซ์ 2XL(44"), 3XL(46"), 4XL(48"), 5XL(50") ให้เลือกในเมนู
                  </div>
                </div>
              </div>

              {/* Order Items Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <ShoppingBag className="w-4 h-4 text-orange-400" />
                    <span>รายการสั่งซื้อเสื้อ (สั่งซื้อได้หลายตัว)</span>
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddShirtItem}
                    className="flex items-center gap-1 text-xs text-orange-400 hover:text-orange-300 font-semibold px-2.5 py-1 rounded-lg bg-orange-500/10 border border-orange-500/30"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>เพิ่มเสื้ออีกตัว</span>
                  </button>
                </div>

                {shirtItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-[#19153a] border border-purple-800/40 flex flex-wrap items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                      <span className="w-6 h-6 rounded-full bg-purple-900 text-purple-200 flex items-center justify-center font-bold text-[11px]">
                        {idx + 1}
                      </span>
                      <select
                        value={item.style}
                        onChange={(e) => handleUpdateShirtItem(idx, { style: e.target.value })}
                        className="bg-[#120d26] border border-purple-700/50 rounded-xl px-2.5 py-2 text-xs text-white"
                      >
                        <option value="เสื้อวิ่งแขนสั้น (Regular)">เสื้อวิ่งแขนสั้น (Regular)</option>
                        <option value="เสื้อวิ่งแขนกุด (Sleeveless)">เสื้อวิ่งแขนกุด (Sleeveless)</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <span className="text-slate-400">ไซซ์:</span>
                        <select
                          value={item.size}
                          onChange={(e) => handleUpdateShirtItem(idx, { size: e.target.value as ShirtSize })}
                          className="bg-[#120d26] border border-purple-700/50 rounded-xl px-2.5 py-2 text-xs text-white font-bold"
                        >
                          {sizeChart.map(s => (
                            <option key={s.size} value={s.size}>
                              {s.size} (อก {s.chestInches}")
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="text-slate-400">จำนวน:</span>
                        <select
                          value={item.quantity}
                          onChange={(e) => handleUpdateShirtItem(idx, { quantity: Number(e.target.value) })}
                          className="bg-[#120d26] border border-purple-700/50 rounded-xl px-2 py-2 text-xs text-white font-bold"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                            <option key={n} value={n}>{n} ตัว</option>
                          ))}
                        </select>
                      </div>

                      <div className="font-bold text-amber-300 min-w-[70px] text-right">
                        ฿{item.totalPrice}
                      </div>

                      {shirtItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveShirtItem(idx)}
                          className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/50"
                          title="ลบรายการ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {/* Subtotal Banner */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950 to-orange-950/60 border border-orange-500/40 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-300">ยอดชำระค่าเสื้อทั้งหมด ({shirtItems.reduce((s, i) => s + i.quantity, 0)} ตัว):</span>
                    <div className="text-xs text-emerald-400">
                      *รับเสื้อที่จุดลงทะเบียนในวันจัดกิจกรรม หรือก่อนวันงานตามประกาศ
                    </div>
                  </div>
                  <div className="text-2xl font-black text-orange-400 font-heading">
                    ฿ {shirtSubtotal} บาท
                  </div>
                </div>
              </div>

              {/* Payment Info & PromptPay */}
              <div className="p-5 rounded-2xl bg-[#171333] border border-purple-800/40 space-y-4">
                <h4 className="text-sm font-bold text-amber-400">
                  ช่องทางชำระเงิน (ธนาคาร / พร้อมเพย์)
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  {/* Bank Account Details */}
                  <div className="bg-[#110d26] p-4 rounded-xl border border-purple-900/50 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">ธนาคาร:</span>
                      <span className="font-bold text-white">{settings.bankName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">ชื่อบัญชี:</span>
                      <span className="font-bold text-white">{settings.bankAccountName}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1 border-t border-purple-900/40">
                      <span className="text-slate-400">เลขที่บัญชี:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-orange-400 text-sm">
                          {settings.bankAccountNo}
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyBank}
                          className="p-1 rounded bg-purple-900/60 hover:bg-purple-800 text-slate-300 hover:text-white"
                          title="คัดลอกเลขที่บัญชี"
                        >
                          {bankCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">พร้อมเพย์ (PromptPay):</span>
                      <span className="font-mono text-white">{settings.promptPayId}</span>
                    </div>
                  </div>

                  {/* Simulated PromptPay QR preview */}
                  <div className="bg-white p-3 rounded-2xl flex flex-col items-center justify-center text-slate-900 shadow-md">
                    <div className="w-32 h-32 bg-slate-100 flex items-center justify-center rounded-lg border border-slate-300">
                      <QrCode className="w-24 h-24 text-slate-800" />
                    </div>
                    <div className="text-[11px] font-bold mt-1 text-slate-700">
                      สแกนจ่ายผ่านแอปธนาคาร (฿{shirtSubtotal})
                    </div>
                  </div>
                </div>

                {/* Slip Upload & Transfer Time */}
                <div className="pt-2 border-t border-purple-900/30 space-y-3">
                  <label className="block text-xs font-semibold text-slate-300">
                    แนบภาพสลิปการโอนเงิน * (JPG, PNG)
                  </label>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <label className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-white font-medium text-xs border border-purple-700/50 cursor-pointer active:scale-95 transition-all">
                      <Upload className="w-4 h-4 text-orange-400" />
                      <span>เลือกไฟล์ภาพสลิป</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleSlipUpload}
                        className="hidden"
                      />
                    </label>

                    {slipFile && (
                      <div className="flex items-center gap-3 bg-[#110d26] p-2 rounded-xl border border-emerald-500/40">
                        <img src={slipFile} alt="Slip Preview" className="w-12 h-12 object-cover rounded-lg" />
                        <div className="text-xs">
                          <div className="text-emerald-400 font-semibold line-clamp-1">{slipFileName}</div>
                          <div className="text-[10px] text-slate-400">อัปโหลดสลิปเรียบร้อย</div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">วันที่โอนเงิน *</label>
                      <input
                        type="date"
                        value={transferDate}
                        onChange={(e) => setTransferDate(e.target.value)}
                        className="w-full bg-[#120d26] border border-purple-800/50 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">เวลาที่โอน *</label>
                      <input
                        type="time"
                        value={transferTime}
                        onChange={(e) => setTransferTime(e.target.value)}
                        className="w-full bg-[#120d26] border border-purple-800/50 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">ยอดเงินที่โอน (บาท) *</label>
                      <input
                        type="number"
                        value={transferAmount}
                        onChange={(e) => setTransferAmount(Number(e.target.value))}
                        className="w-full bg-[#120d26] border border-purple-800/50 rounded-xl px-3 py-2 text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  {/* Guaranteed Registration Reassurance */}
                  <div className="p-3 bg-amber-950/40 border border-amber-500/30 rounded-xl text-[11px] text-amber-200 flex items-start gap-2">
                    <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>ความโปร่งใส:</strong> แม้สลิปจะอยู่ระหว่างรอการตรวจสอบโดยเจ้าหน้าที่การเงิน ท่านจะยังคงได้รับการลงทะเบียนและได้รับสิทธิ์เข้าร่วมงานและ QR Code ทันที!
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="pt-4 flex items-center justify-between border-t border-purple-900/30">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>ย้อนกลับ</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (validateStep2()) {
                  setCurrentStep(3);
                }
              }}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold text-sm hover:from-orange-400 hover:to-amber-400 active:scale-95 transition-all shadow-lg shadow-orange-500/25 flex items-center gap-2"
            >
              <span>ถัดไป: ยืนยันข้อมูล & ข้อตกลง</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: SUMMARY & CONSENT AGREEMENT */}
      {currentStep === 3 && (
        <div className="bg-[#121128] border border-purple-900/50 rounded-3xl p-6 sm:p-8 shadow-xl text-slate-200 space-y-6">
          <div className="border-b border-purple-900/40 pb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white font-heading">
              ขั้นตอนที่ 3: ตรวจสอบข้อมูล & ยืนยันข้อตกลง (PDPA)
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              โปรดตรวจสอบความถูกต้องของข้อมูลก่อนกดยืนยันการลงทะเบียน
            </p>
          </div>

          {/* Applicant Data Summary Box */}
          <div className="bg-[#171436] p-5 rounded-2xl border border-purple-800/40 space-y-3 text-xs">
            <h3 className="font-bold text-orange-400 text-sm border-b border-purple-800/40 pb-2">
              สรุปข้อมูลการลงทะเบียน
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-slate-400">ชื่อ-นามสกุล:</span>{' '}
                <strong className="text-white">{prefix} {firstName} {lastName} ({nickname || '-'})</strong>
              </div>
              <div>
                <span className="text-slate-400">ประเภทผู้สมัคร:</span>{' '}
                <strong className="text-amber-300">{applicantType}</strong>
              </div>
              <div>
                <span className="text-slate-400">เบอร์โทรศัพท์:</span>{' '}
                <strong className="text-white font-mono">{phone}</strong>
              </div>
              <div>
                <span className="text-slate-400">อีเมล:</span>{' '}
                <strong className="text-white">{email}</strong>
              </div>
              <div>
                <span className="text-slate-400">ผู้ติดต่อฉุกเฉิน:</span>{' '}
                <span className="text-slate-200">{emergencyContactName} ({emergencyContactRelation} - {emergencyContactPhone})</span>
              </div>
              <div>
                <span className="text-slate-400">การสั่งซื้อเสื้อ:</span>{' '}
                <strong className={wantsShirt ? 'text-orange-400' : 'text-emerald-400'}>
                  {wantsShirt ? `สั่งซื้อเสื้อ (${shirtItems.reduce((s, i) => s + i.quantity, 0)} ตัว - ยอด ${shirtSubtotal} บาท)` : 'ไม่ซื้อเสื้อ (เข้าร่วมฟรี)'}
                </strong>
              </div>
            </div>
          </div>

          {/* 4 Standard PDPA & Health Consent Checkboxes */}
          <div className="space-y-3 bg-[#181438] p-5 rounded-2xl border border-purple-800/50">
            <h3 className="text-sm font-bold text-white mb-2">
              ข้อตกลงและความยินยอม (PDPA & กฎระเบียบ)
            </h3>

            <label className="flex items-start gap-3 cursor-pointer text-xs leading-relaxed">
              <input
                type="checkbox"
                checked={consentPdpa}
                onChange={(e) => setConsentPdpa(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-orange-500 bg-slate-900 border-purple-700 focus:ring-orange-500"
              />
              <span className="text-slate-300">
                <strong className="text-white">[จำเป็น] ยินยอมให้ประมวลผลข้อมูลส่วนบุคคล:</strong> ข้าพเจ้ายินยอมให้คณะสังคมศาสตร์ มหาวิทยาลัยนเรศวร เก็บรวบรวม ใช้ และประมวลผลข้อมูลส่วนบุคคลตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 เพื่อวัตถุประสงค์ในการจัดกิจกรรมวิ่ง FSS Halloween Fancy Run 2026
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer text-xs leading-relaxed">
              <input
                type="checkbox"
                checked={consentHealth}
                onChange={(e) => setConsentHealth(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-orange-500 bg-slate-900 border-purple-700 focus:ring-orange-500"
              />
              <span className="text-slate-300">
                <strong className="text-white">[จำเป็น] ยืนยันข้อมูลสุขภาพและความปลอดภัย:</strong> ข้าพเจ้ายืนยันว่าข้อมูลสุขภาพและโรคประจำตัวที่ระบุเป็นความจริง มีสภาพร่างกายพร้อมสำหรับการออกกำลังกาย และยอมรับความเสี่ยงที่อาจเกิดขึ้นระหว่างการร่วมกิจกรรม
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer text-xs leading-relaxed">
              <input
                type="checkbox"
                checked={consentMedia}
                onChange={(e) => setConsentMedia(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-orange-500 bg-slate-900 border-purple-700 focus:ring-orange-500"
              />
              <span className="text-slate-300">
                <strong className="text-white">[ยินยอม] การบันทึกภาพถ่ายและวิดีโอ:</strong> ยินยอมให้ผู้จัดงานบันทึกภาพนิ่ง ภาพเคลื่อนไหว หรือวิดีโอตลอดการจัดกิจกรรม เพื่อการประชาสัมพันธ์และสรุปผลโครงการ
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer text-xs leading-relaxed">
              <input
                type="checkbox"
                checked={consentPublicName}
                onChange={(e) => setConsentPublicName(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-orange-500 bg-slate-900 border-purple-700 focus:ring-orange-500"
              />
              <span className="text-slate-300">
                <strong className="text-white">[ทางเลือก] การแสดงชื่อในรายชื่อผู้สมัครสาธารณะ:</strong> ยินยอมให้แสดงชื่อ-นามสกุล และตัวละครผีไทยในหน้ารายชื่อผู้สมัครบนเว็บไซต์ (หากไม่ยินยอม ระบบจะแสดงชื่อแบบเข้ารหัส เช่น นาย ก***)
              </span>
            </label>
          </div>

          {/* Navigation Buttons */}
          <div className="pt-4 flex items-center justify-between border-t border-purple-900/30">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>ย้อนกลับ</span>
            </button>

            <button
              type="button"
              onClick={handleSubmitRegistration}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-slate-950 font-extrabold text-base hover:from-orange-400 hover:to-amber-400 active:scale-95 transition-all shadow-xl shadow-orange-500/30 flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5 text-slate-950" />
              <span>ยืนยันการลงทะเบียน & สุ่มการ์ดผี</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: REVEAL GHOST & SHOW CARD + DISPATCH EMAIL */}
      {currentStep === 4 && createdApplicant && assignedGhost && (
        <div className="bg-[#100d24] border border-purple-800/60 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-200 text-center space-y-6 animate-in zoom-in-95 duration-500">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 uppercase">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>ลงทะเบียนสำเร็จเรียบร้อยแล้ว!</span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
              ยินดีต้อนรับสู่ FSS Halloween Fancy Run 2026
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md mx-auto">
              ระบบได้ออกหมายเลขผู้สมัครและสุ่มตัวละครผีไทยประจำตัวให้คุณเรียบร้อยแล้ว
            </p>
          </div>

          {/* Participant Card Component */}
          <ParticipantCard
            applicant={createdApplicant}
            ghost={assignedGhost}
            settings={settings}
            onOpenEmailPreview={() => setShowEmailModal(true)}
            showRevealEffect={true}
          />

          {/* Email Preview Modal */}
          <EmailPreviewModal
            isOpen={showEmailModal}
            onClose={() => setShowEmailModal(false)}
            applicant={createdApplicant}
            ghost={assignedGhost}
            order={createdOrder}
            settings={settings}
          />
        </div>
      )}
    </div>
  );
};
