export type GenderType = 'ชาย' | 'หญิง' | 'หลากหลายทางเพศ' | 'ไม่ประสงค์ระบุ';

export type ApplicantCategory = 
  | 'นิสิตคณะสังคมศาสตร์'
  | 'นิสิตมหาวิทยาลัยนเรศวร'
  | 'นิสิต ม.นเรศวร ต่างคณะ'
  | 'บุคลากร'
  | 'บุคลากร / อาจารย์ ม.นเรศวร'
  | 'ศิษย์เก่า'
  | 'ศิษย์เก่า ม.นเรศวร'
  | 'นักเรียน'
  | 'บุคคลทั่วไป'
  | 'ประชาชนทั่วไป';

export type ApplicantType = ApplicantCategory;

export type ShirtSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | '2XL' | '3XL' | '4XL' | '5XL';

export type PaymentStatus = 
  | 'not_ordered' 
  | 'pending_payment' 
  | 'pending_review' 
  | 'paid' 
  | 'rejected' 
  | 'cancelled';

export type OrderStatus = 'pending' | 'payment_pending' | 'preparing' | 'ready' | 'ready_for_pickup' | 'picked_up';

export type CheckinStatus = 'not_checked_in' | 'checked_in';

export interface GhostCharacter {
  id: string;
  code: string; // G01 - G12
  name: string;
  description: string;
  tagline: string;
  speed: string; // e.g., '10/10'
  cuteScore: string;
  specialSkill: string;
  color: string;
  badgeBg: string;
  avatarUrl?: string;
  iconName: string;
  probabilityWeight: number;
  activeStatus: boolean;

  // Horror / Scary Mode properties
  scaryName?: string;
  scaryDescription?: string;
  scaryTagline?: string;
  scaryScore?: string;
  scarySpecialSkill?: string;
  scaryColor?: string;
  scaryBadgeBg?: string;
}

export interface ShirtItem {
  id: string;
  style: string;
  color: string;
  size: ShirtSize;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export type OrderItem = ShirtItem;

export interface ShirtOrder {
  id: string;
  applicantId: string;
  applicantName?: string;
  applicantPhone?: string;
  orderNumber: string;
  items: ShirtItem[];
  subtotal: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  deliveryType?: string;
  slipUrl?: string;
  slipName?: string;
  transferDate?: string;
  transferTime?: string;
  transferAmount?: number;
  paymentNote?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  pickedUpAt?: string;
  pickedUpBy?: string;
}

export interface Applicant {
  id: string;
  registrationNumber: string; // e.g. FSS26-000001
  checkinToken: string; // e.g. FSS26-CI-8FH3K92XZ
  title: string;
  prefix?: string;
  firstName: string;
  lastName: string;
  nickname: string;
  englishName?: string;
  birthDate?: string;
  ageRange: string;
  gender: GenderType;
  applicantType: ApplicantCategory;
  studentId?: string;
  faculty?: string;
  department?: string;
  organization?: string;
  teamName?: string;
  phone: string;
  email: string;
  province: string;
  
  // Emergency info
  emergencyName: string;
  emergencyRelationship: string;
  emergencyPhone: string;
  emergencyContactName?: string;
  emergencyContactRelation?: string;
  emergencyContactPhone?: string;
  medicalCondition?: string;
  medicalConditions?: string;
  drugAllergy?: string;
  allergies?: string;
  healthNote?: string;

  // Consents
  publicNameConsent: boolean;
  consentPublicName?: boolean;
  pdpaConsent: boolean;
  consentPdpa?: boolean;
  activityConsent: boolean;
  consentHealth?: boolean;
  consentMedia?: boolean;

  // Status & Tracking
  registrationStatus: 'success' | 'cancelled';
  registeredAt: string;
  updatedAt?: string;
  ghostId: string;
  ghostCharacterId?: string;
  ghostCharacterCode?: string;
  wantsShirt?: boolean;
  orderId?: string;
  checkinStatus: CheckinStatus;
  checkedInAt?: string;
  checkedInBy?: string;
  checkinPoint?: string;
  duplicateScanCount?: number;
  downloadCount: number;
  emailStatus: 'sent' | 'pending' | 'failed';
  emailSentAt?: string;
  emailSendCount: number;
}

export interface EventSettings {
  eventName: string;
  eventTagline: string;
  edition: string;
  eventDate: string;
  eventTime: string;
  location: string;
  registrationQuota: number;
  maxCapacity?: number;
  isRegistrationOpen: boolean;
  isPublicListOpen: boolean;
  isShirtSaleOpen: boolean;
  shirtPrice: number;
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankAccountNo?: string;
  promptpayNumber: string;
  contactEmail: string;
  contactPhone: string;
  contactFacebook: string;
  contactInstagram: string;
  contactTiktok: string;
  announcements: {
    id: string;
    title: string;
    date: string;
    content: string;
    badge?: string;
  }[];
}

export type AdminRole = 
  | 'Super Admin'
  | 'Registration Admin'
  | 'Finance Admin'
  | 'Shirt Admin'
  | 'Check-in Staff'
  | 'Report Viewer';

export interface AuditLog {
  id: string;
  action: string;
  performedBy: string;
  role: AdminRole;
  details: string;
  timestamp: string;
}

export interface SizeChartEntry {
  size: ShirtSize;
  chest: number; // inches
  length: number; // inches
  chestInches?: number;
  lengthInches?: number;
  stockRemaining: number;
}
