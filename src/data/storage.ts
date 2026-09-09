import { 
  Applicant, 
  ShirtOrder, 
  GhostCharacter, 
  EventSettings, 
  SizeChartEntry, 
  AuditLog, 
  AdminRole 
} from '../types';
import { 
  THAI_GHOSTS, 
  INITIAL_SETTINGS, 
  INITIAL_SIZE_CHART, 
  INITIAL_APPLICANTS, 
  INITIAL_ORDERS, 
  INITIAL_AUDIT_LOGS 
} from './initialData';
import {
  saveApplicantToFirebase,
  saveOrderToFirebase,
  saveAuditLogToFirebase,
  saveGhostToFirebase,
  saveSettingsToFirebase
} from '../firebase';

const STORAGE_KEYS = {
  APPLICANTS: 'fss_run_applicants_v1',
  ORDERS: 'fss_run_orders_v1',
  GHOSTS: 'fss_run_ghosts_v1',
  SETTINGS: 'fss_run_settings_v1',
  SIZE_CHART: 'fss_run_sizes_v1',
  AUDIT_LOGS: 'fss_run_logs_v1',
};

// Safe localStorage helper
function getStored<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event('fss_storage_update'));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

// Deterministic Ghost Character assignment
export function assignDeterministicGhost(seedString: string, ghosts: GhostCharacter[]): GhostCharacter {
  const activeGhosts = ghosts.filter(g => g.activeStatus);
  if (activeGhosts.length === 0) return ghosts[0] || THAI_GHOSTS[0];

  // Hash code algorithm
  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    const char = seedString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  const positiveHash = Math.abs(hash);

  // Weighted random distribution based on probability weights
  const totalWeight = activeGhosts.reduce((sum, g) => sum + (g.probabilityWeight || 10), 0);
  let threshold = positiveHash % totalWeight;

  for (const ghost of activeGhosts) {
    const weight = ghost.probabilityWeight || 10;
    if (threshold < weight) {
      return ghost;
    }
    threshold -= weight;
  }

  return activeGhosts[0];
}

// Generate unique registration number
export function generateRegistrationNumber(existingCount: number): string {
  const nextNum = existingCount + 1;
  return `FSS26-${String(nextNum).padStart(6, '0')}`;
}

// Generate secure checkin token
export function generateCheckinToken(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let token = 'FSS26-CI-';
  for (let i = 0; i < 9; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

// Data Access Layer
export const storageService = {
  // Applicants
  getApplicants(): Applicant[] {
    return getStored<Applicant[]>(STORAGE_KEYS.APPLICANTS, INITIAL_APPLICANTS);
  },

  getApplicantById(id: string): Applicant | undefined {
    return this.getApplicants().find(a => a.id === id);
  },

  getApplicantByToken(token: string): Applicant | undefined {
    const cleanToken = token.trim();
    return this.getApplicants().find(a => a.checkinToken === cleanToken || a.registrationNumber.toLowerCase() === cleanToken.toLowerCase());
  },

  searchApplicant(query: string): Applicant[] {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return this.getApplicants().filter(a => 
      a.registrationNumber.toLowerCase().includes(q) ||
      a.firstName.toLowerCase().includes(q) ||
      a.lastName.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      a.phone.includes(q) ||
      (a.studentId && a.studentId.includes(q))
    );
  },

  addApplicant(applicant: Applicant): void {
    const list = this.getApplicants();
    list.unshift(applicant);
    setStored(STORAGE_KEYS.APPLICANTS, list);
    this.addAuditLog('REGISTER_APPLICANT', applicant.firstName + ' ' + applicant.lastName, 'Registration Admin', `ลงทะเบียนใหม่ หมายเลข ${applicant.registrationNumber}`);
    saveApplicantToFirebase(applicant).catch((err) => console.warn('Background Firebase save failed:', err));
  },

  updateApplicant(id: string, updates: Partial<Applicant>, actor = 'System', role: AdminRole = 'Registration Admin'): Applicant | null {
    const list = this.getApplicants();
    const index = list.findIndex(a => a.id === id);
    if (index === -1) return null;

    list[index] = {
      ...list[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    setStored(STORAGE_KEYS.APPLICANTS, list);
    this.addAuditLog('UPDATE_APPLICANT', actor, role, `แก้ไขข้อมูลผู้สมัคร ${list[index].registrationNumber}`);
    saveApplicantToFirebase(list[index]).catch((err) => console.warn('Background Firebase save failed:', err));
    return list[index];
  },

  // Check-in Operations
  checkinApplicant(applicantId: string, staffName: string, checkinPoint = 'จุดลงทะเบียนหน้างาน'): { success: boolean; isDuplicate: boolean; applicant: Applicant } {
    const list = this.getApplicants();
    const index = list.findIndex(a => a.id === applicantId);
    if (index === -1) throw new Error('ไม่พบข้อมูลผู้สมัคร');

    const app = list[index];
    const isDuplicate = app.checkinStatus === 'checked_in';

    if (isDuplicate) {
      app.duplicateScanCount = (app.duplicateScanCount || 0) + 1;
      setStored(STORAGE_KEYS.APPLICANTS, list);
      this.addAuditLog('CHECKIN_DUPLICATE_SCAN', staffName, 'Check-in Staff', `แจ้งเตือนสแกนซ้ำครั้งที่ ${app.duplicateScanCount} ของผู้สมัคร ${app.registrationNumber} (${app.firstName} ${app.lastName})`);
      saveApplicantToFirebase(app).catch((err) => console.warn('Background Firebase save failed:', err));
      return { success: true, isDuplicate: true, applicant: app };
    }

    app.checkinStatus = 'checked_in';
    app.checkedInAt = new Date().toISOString();
    app.checkedInBy = staffName;
    app.checkinPoint = checkinPoint;

    setStored(STORAGE_KEYS.APPLICANTS, list);
    this.addAuditLog('CHECKIN_CONFIRMED', staffName, 'Check-in Staff', `ยืนยันการเช็กอินผู้สมัคร ${app.registrationNumber} (${app.firstName} ${app.lastName}) ณ ${checkinPoint}`);
    saveApplicantToFirebase(app).catch((err) => console.warn('Background Firebase save failed:', err));
    return { success: true, isDuplicate: false, applicant: app };
  },

  undoCheckin(applicantId: string, staffName: string): boolean {
    const list = this.getApplicants();
    const index = list.findIndex(a => a.id === applicantId);
    if (index === -1) return false;

    const app = list[index];
    app.checkinStatus = 'not_checked_in';
    app.checkedInAt = undefined;
    app.checkedInBy = undefined;
    setStored(STORAGE_KEYS.APPLICANTS, list);
    this.addAuditLog('CHECKIN_CANCELLED', staffName, 'Super Admin', `ยกเลิกการเช็กอินผู้สมัคร ${app.registrationNumber}`);
    saveApplicantToFirebase(app).catch((err) => console.warn('Background Firebase save failed:', err));
    return true;
  },

  // Shirt Orders
  getOrders(): ShirtOrder[] {
    return getStored<ShirtOrder[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  },

  getOrderById(id: string): ShirtOrder | undefined {
    return this.getOrders().find(o => o.id === id);
  },

  getOrderByApplicantId(applicantId: string): ShirtOrder | undefined {
    return this.getOrders().find(o => o.applicantId === applicantId);
  },

  addOrder(order: ShirtOrder): void {
    const list = this.getOrders();
    list.unshift(order);
    setStored(STORAGE_KEYS.ORDERS, list);
    saveOrderToFirebase(order).catch((err) => console.warn('Background Firebase save failed:', err));
  },

  updateOrder(id: string, updates: Partial<ShirtOrder>, actor = 'System', role: AdminRole = 'Finance Admin'): ShirtOrder | null {
    const list = this.getOrders();
    const index = list.findIndex(o => o.id === id);
    if (index === -1) return null;

    list[index] = { ...list[index], ...updates };
    setStored(STORAGE_KEYS.ORDERS, list);
    saveOrderToFirebase(list[index]).catch((err) => console.warn('Background Firebase save failed:', err));
    return list[index];
  },

  reviewSlip(orderId: string, approved: boolean, actor: string, reason?: string): { success: boolean; order: ShirtOrder } {
    const list = this.getOrders();
    const index = list.findIndex(o => o.id === orderId);
    if (index === -1) throw new Error('ไม่พบคำสั่งซื้อ');

    const ord = list[index];
    if (approved) {
      ord.paymentStatus = 'paid';
      ord.orderStatus = 'preparing';
      ord.reviewedBy = actor;
      ord.reviewedAt = new Date().toISOString();
      ord.rejectionReason = undefined;
      setStored(STORAGE_KEYS.ORDERS, list);
      this.addAuditLog('PAYMENT_APPROVED', actor, 'Finance Admin', `อนุมัติสลิปคำสั่งซื้อ ${ord.orderNumber} ยอด ${ord.subtotal} บาท`);
    } else {
      ord.paymentStatus = 'rejected';
      ord.reviewedBy = actor;
      ord.reviewedAt = new Date().toISOString();
      ord.rejectionReason = reason || 'สลิปไม่ถูกต้อง';
      setStored(STORAGE_KEYS.ORDERS, list);
      this.addAuditLog('PAYMENT_REJECTED', actor, 'Finance Admin', `ปฏิเสธสลิปคำสั่งซื้อ ${ord.orderNumber} เหตุผล: ${ord.rejectionReason}`);
    }
    saveOrderToFirebase(ord).catch((err) => console.warn('Background Firebase save failed:', err));
    return { success: true, order: ord };
  },

  reUploadSlip(orderId: string, slipUrl: string, slipName: string, transferDate: string, transferTime: string, transferAmount: number): ShirtOrder {
    const list = this.getOrders();
    const index = list.findIndex(o => o.id === orderId);
    if (index === -1) throw new Error('ไม่พบคำสั่งซื้อ');

    const ord = list[index];
    ord.slipUrl = slipUrl;
    ord.slipName = slipName;
    ord.transferDate = transferDate;
    ord.transferTime = transferTime;
    ord.transferAmount = transferAmount;
    ord.paymentStatus = 'pending_review';
    ord.rejectionReason = undefined;

    setStored(STORAGE_KEYS.ORDERS, list);
    this.addAuditLog('SLIP_REUPLOADED', 'Applicant', 'Registration Admin', `ผู้สมัครแนบสลิปใหม่สำหรับคำสั่งซื้อ ${ord.orderNumber}`);
    saveOrderToFirebase(ord).catch((err) => console.warn('Background Firebase save failed:', err));
    return ord;
  },

  pickupShirt(orderId: string, staffName: string): { success: boolean; order: ShirtOrder } {
    const list = this.getOrders();
    const index = list.findIndex(o => o.id === orderId);
    if (index === -1) throw new Error('ไม่พบคำสั่งซื้อ');

    const ord = list[index];
    ord.orderStatus = 'picked_up';
    ord.pickedUpAt = new Date().toISOString();
    ord.pickedUpBy = staffName;
    setStored(STORAGE_KEYS.ORDERS, list);
    this.addAuditLog('SHIRT_PICKUP_CONFIRMED', staffName, 'Shirt Admin', `บันทึกการรับเสื้อคำสั่งซื้อ ${ord.orderNumber}`);
    saveOrderToFirebase(ord).catch((err) => console.warn('Background Firebase save failed:', err));
    return { success: true, order: ord };
  },

  // Ghosts
  getGhosts(): GhostCharacter[] {
    const stored = getStored<GhostCharacter[]>(STORAGE_KEYS.GHOSTS, THAI_GHOSTS);
    // Ensure all stored ghosts have the horror/scary fields by merging with THAI_GHOSTS definition
    return THAI_GHOSTS.map(initialGhost => {
      const found = stored.find(g => g.id === initialGhost.id || g.code === initialGhost.code);
      if (!found) return initialGhost;
      return {
        ...initialGhost,
        ...found,
        // Always prioritize scary fields if not present on found
        scaryName: found.scaryName || initialGhost.scaryName,
        scaryDescription: found.scaryDescription || initialGhost.scaryDescription,
        scaryTagline: found.scaryTagline || initialGhost.scaryTagline,
        scaryScore: found.scaryScore || initialGhost.scaryScore,
        scarySpecialSkill: found.scarySpecialSkill || initialGhost.scarySpecialSkill,
        scaryColor: found.scaryColor || initialGhost.scaryColor,
        scaryBadgeBg: found.scaryBadgeBg || initialGhost.scaryBadgeBg,
      };
    });
  },

  getGhostThemeMode(): 'horror' | 'cute' {
    try {
      const mode = localStorage.getItem('fss_ghost_theme_mode');
      return mode === 'cute' ? 'cute' : 'horror'; // Default to 'horror' as requested by user
    } catch {
      return 'horror';
    }
  },

  setGhostThemeMode(mode: 'horror' | 'cute'): void {
    try {
      localStorage.setItem('fss_ghost_theme_mode', mode);
      window.dispatchEvent(new Event('fss_storage_update'));
    } catch (err) {
      console.error('Failed to set ghost theme mode:', err);
    }
  },

  getGhostById(id: string): GhostCharacter | undefined {
    return this.getGhosts().find(g => g.id === id);
  },

  saveGhost(ghost: GhostCharacter, actor: string): void {
    const list = this.getGhosts();
    const index = list.findIndex(g => g.id === ghost.id);
    if (index >= 0) {
      list[index] = ghost;
    } else {
      list.push(ghost);
    }
    setStored(STORAGE_KEYS.GHOSTS, list);
    this.addAuditLog('GHOST_UPDATED', actor, 'Super Admin', `อัปเดตข้อมูลตัวละครผีไทย: ${ghost.name} (${ghost.code})`);
    saveGhostToFirebase(ghost).catch((err) => console.warn('Background Firebase save failed:', err));
  },

  // Event Settings
  getSettings(): EventSettings {
    const s = getStored<EventSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
    return { ...INITIAL_SETTINGS, ...(s || {}) };
  },

  saveSettings(settings: EventSettings, actor: string): void {
    setStored(STORAGE_KEYS.SETTINGS, settings);
    this.addAuditLog('SETTINGS_SAVED', actor, 'Super Admin', 'อัปเดตการตั้งค่าระบบและกิจกรรม');
    saveSettingsToFirebase(settings).catch((err) => console.warn('Background Firebase save failed:', err));
  },

  // Size Chart & Stock
  getSizeChart(): SizeChartEntry[] {
    return getStored<SizeChartEntry[]>(STORAGE_KEYS.SIZE_CHART, INITIAL_SIZE_CHART);
  },

  saveSizeChart(chart: SizeChartEntry[], actor: string): void {
    setStored(STORAGE_KEYS.SIZE_CHART, chart);
    this.addAuditLog('STOCK_UPDATED', actor, 'Shirt Admin', 'อัปเดตจำนวนสต็อกเสื้อ');
  },

  // Audit Logs
  getAuditLogs(): AuditLog[] {
    return getStored<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  },

  addAuditLog(action: string, performedBy: string, role: AdminRole, details: string): void {
    const list = this.getAuditLogs();
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      action,
      performedBy,
      role,
      details,
      timestamp: new Date().toISOString(),
    };
    list.unshift(newLog);
    // Keep last 200 logs
    if (list.length > 200) list.length = 200;
    setStored(STORAGE_KEYS.AUDIT_LOGS, list);
    saveAuditLogToFirebase(newLog).catch((err) => console.warn('Background Firebase save failed:', err));
  },

  // Cloud Synchronization Merge
  mergeCloudData(cloudApplicants?: Applicant[], cloudOrders?: ShirtOrder[], cloudGhosts?: GhostCharacter[]): void {
    if (cloudApplicants && cloudApplicants.length > 0) {
      setStored(STORAGE_KEYS.APPLICANTS, cloudApplicants);
    }
    if (cloudOrders && cloudOrders.length > 0) {
      setStored(STORAGE_KEYS.ORDERS, cloudOrders);
    }
    if (cloudGhosts && cloudGhosts.length > 0) {
      setStored(STORAGE_KEYS.GHOSTS, cloudGhosts);
    }
  },

  // Increments
  incrementDownload(applicantId: string): void {
    const list = this.getApplicants();
    const target = list.find(a => a.id === applicantId);
    if (target) {
      target.downloadCount = (target.downloadCount || 0) + 1;
      setStored(STORAGE_KEYS.APPLICANTS, list);
    }
  },

  recordEmailSent(applicantId: string): void {
    const list = this.getApplicants();
    const target = list.find(a => a.id === applicantId);
    if (target) {
      target.emailStatus = 'sent';
      target.emailSentAt = new Date().toISOString();
      target.emailSendCount = (target.emailSendCount || 0) + 1;
      setStored(STORAGE_KEYS.APPLICANTS, list);
    }
  },

  // Reset to default demo data
  resetDemoData(): void {
    localStorage.removeItem(STORAGE_KEYS.APPLICANTS);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.GHOSTS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.SIZE_CHART);
    localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);
    window.dispatchEvent(new Event('fss_storage_update'));
  }
};
