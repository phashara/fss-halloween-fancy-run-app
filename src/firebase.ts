import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  onSnapshot, 
  query, 
  orderBy, 
  limit, 
  Firestore,
  writeBatch
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { Applicant, ShirtOrder, GhostCharacter, EventSettings, AuditLog } from './types';
import { 
  INITIAL_APPLICANTS, 
  INITIAL_ORDERS, 
  THAI_GHOSTS, 
  INITIAL_SETTINGS, 
  INITIAL_AUDIT_LOGS 
} from './data/initialData';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with custom database ID specified in config
let dbInstance: Firestore | null = null;
try {
  if (firebaseConfig.firestoreDatabaseId) {
    dbInstance = getFirestore(app, firebaseConfig.firestoreDatabaseId);
  } else {
    dbInstance = getFirestore(app);
  }
} catch (error) {
  console.warn('Fallback to default Firestore initialization:', error);
  dbInstance = getFirestore(app);
}

export const db = dbInstance;

// Collections constants
export const COLLECTIONS = {
  APPLICANTS: 'applicants',
  ORDERS: 'orders',
  GHOSTS: 'ghosts',
  SETTINGS: 'settings',
  AUDIT_LOGS: 'audit_logs',
};

// Clean object helper to remove undefined fields which Firestore rejects
export function sanitizeForFirestore<T extends Record<string, any>>(obj: T): Record<string, any> {
  const result: Record<string, any> = {};
  for (const key of Object.keys(obj)) {
    const value = obj[key];
    if (value !== undefined) {
      if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
        result[key] = sanitizeForFirestore(value);
      } else {
        result[key] = value;
      }
    }
  }
  return result;
}

// 1. Sync Applicant to Firebase
export async function saveApplicantToFirebase(applicant: Applicant): Promise<void> {
  if (!db) return;
  try {
    const docRef = doc(db, COLLECTIONS.APPLICANTS, applicant.id);
    const sanitized = sanitizeForFirestore(applicant);
    await setDoc(docRef, sanitized, { merge: true });
    console.log(`[Firebase] Successfully synced applicant ${applicant.registrationNumber}`);
  } catch (error) {
    console.error('[Firebase] Error saving applicant:', error);
  }
}

// 2. Sync Order to Firebase
export async function saveOrderToFirebase(order: ShirtOrder): Promise<void> {
  if (!db) return;
  try {
    const docRef = doc(db, COLLECTIONS.ORDERS, order.id);
    const sanitized = sanitizeForFirestore(order);
    await setDoc(docRef, sanitized, { merge: true });
    console.log(`[Firebase] Successfully synced order ${order.orderNumber}`);
  } catch (error) {
    console.error('[Firebase] Error saving order:', error);
  }
}

// 3. Sync Audit Log to Firebase
export async function saveAuditLogToFirebase(log: AuditLog): Promise<void> {
  if (!db) return;
  try {
    const docRef = doc(db, COLLECTIONS.AUDIT_LOGS, log.id);
    const sanitized = sanitizeForFirestore(log);
    await setDoc(docRef, sanitized, { merge: true });
  } catch (error) {
    console.error('[Firebase] Error saving audit log:', error);
  }
}

// 4. Sync Ghost Character to Firebase
export async function saveGhostToFirebase(ghost: GhostCharacter): Promise<void> {
  if (!db) return;
  try {
    const docRef = doc(db, COLLECTIONS.GHOSTS, ghost.id);
    const sanitized = sanitizeForFirestore(ghost);
    await setDoc(docRef, sanitized, { merge: true });
  } catch (error) {
    console.error('[Firebase] Error saving ghost:', error);
  }
}

// 5. Sync Event Settings to Firebase
export async function saveSettingsToFirebase(settings: EventSettings): Promise<void> {
  if (!db) return;
  try {
    const docRef = doc(db, COLLECTIONS.SETTINGS, 'current');
    const sanitized = sanitizeForFirestore(settings);
    await setDoc(docRef, sanitized, { merge: true });
  } catch (error) {
    console.error('[Firebase] Error saving settings:', error);
  }
}

// 6. Seed initial documents if cloud collections are empty
export async function seedFirebaseIfEmpty(): Promise<void> {
  if (!db) return;
  try {
    const applicantsSnap = await getDocs(query(collection(db, COLLECTIONS.APPLICANTS), limit(1)));
    if (applicantsSnap.empty) {
      console.log('[Firebase] Seeding initial applicants to Firestore...');
      const batch = writeBatch(db);
      INITIAL_APPLICANTS.forEach((app) => {
        const ref = doc(db, COLLECTIONS.APPLICANTS, app.id);
        batch.set(ref, sanitizeForFirestore(app));
      });
      await batch.commit();
    }

    const ordersSnap = await getDocs(query(collection(db, COLLECTIONS.ORDERS), limit(1)));
    if (ordersSnap.empty) {
      console.log('[Firebase] Seeding initial orders to Firestore...');
      const batch = writeBatch(db);
      INITIAL_ORDERS.forEach((ord) => {
        const ref = doc(db, COLLECTIONS.ORDERS, ord.id);
        batch.set(ref, sanitizeForFirestore(ord));
      });
      await batch.commit();
    }

    const ghostsSnap = await getDocs(query(collection(db, COLLECTIONS.GHOSTS), limit(1)));
    if (ghostsSnap.empty) {
      console.log('[Firebase] Seeding initial ghost characters to Firestore...');
      const batch = writeBatch(db);
      THAI_GHOSTS.forEach((ghost) => {
        const ref = doc(db, COLLECTIONS.GHOSTS, ghost.id);
        batch.set(ref, sanitizeForFirestore(ghost));
      });
      await batch.commit();
    }

    const settingsDoc = await getDoc(doc(db, COLLECTIONS.SETTINGS, 'current'));
    if (!settingsDoc.exists()) {
      console.log('[Firebase] Seeding event settings to Firestore...');
      await setDoc(doc(db, COLLECTIONS.SETTINGS, 'current'), sanitizeForFirestore(INITIAL_SETTINGS));
    }
  } catch (error) {
    console.warn('[Firebase] Initial seeding skipped or not required:', error);
  }
}

// 7. Realtime Listeners
export function subscribeToFirebaseApplicants(
  onUpdate: (applicants: Applicant[]) => void
): () => void {
  if (!db) return () => {};
  try {
    const q = query(collection(db, COLLECTIONS.APPLICANTS), orderBy('registeredAt', 'desc'));
    return onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Applicant[] = [];
          snapshot.forEach((docSnap) => {
            list.push(docSnap.data() as Applicant);
          });
          onUpdate(list);
        }
      },
      (err) => {
        console.warn('[Firebase] Applicants subscription warning:', err);
      }
    );
  } catch (e) {
    console.error('[Firebase] Failed to set up applicants listener:', e);
    return () => {};
  }
}

export function subscribeToFirebaseOrders(
  onUpdate: (orders: ShirtOrder[]) => void
): () => void {
  if (!db) return () => {};
  try {
    const q = query(collection(db, COLLECTIONS.ORDERS), orderBy('createdAt', 'desc'));
    return onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: ShirtOrder[] = [];
          snapshot.forEach((docSnap) => {
            list.push(docSnap.data() as ShirtOrder);
          });
          onUpdate(list);
        }
      },
      (err) => {
        console.warn('[Firebase] Orders subscription warning:', err);
      }
    );
  } catch (e) {
    console.error('[Firebase] Failed to set up orders listener:', e);
    return () => {};
  }
}

export function subscribeToFirebaseGhosts(
  onUpdate: (ghosts: GhostCharacter[]) => void
): () => void {
  if (!db) return () => {};
  try {
    const colRef = collection(db, COLLECTIONS.GHOSTS);
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: GhostCharacter[] = [];
          snapshot.forEach((docSnap) => {
            list.push(docSnap.data() as GhostCharacter);
          });
          onUpdate(list);
        }
      },
      (err) => {
        console.warn('[Firebase] Ghosts subscription warning:', err);
      }
    );
  } catch (e) {
    console.error('[Firebase] Failed to set up ghosts listener:', e);
    return () => {};
  }
}

// 8. Direct Cloud Lookup by Registration No, Email, or Phone
export async function findApplicantInFirebase(queryStr: string): Promise<Applicant | null> {
  if (!db) return null;
  const clean = queryStr.trim();
  if (!clean) return null;

  try {
    const colRef = collection(db, COLLECTIONS.APPLICANTS);
    const snap = await getDocs(colRef);
    let found: Applicant | null = null;
    const cleanLower = clean.toLowerCase();
    const cleanDigits = clean.replace(/\D/g, '');

    snap.forEach((docSnap) => {
      if (found) return;
      const data = docSnap.data() as Applicant;
      if (
        data.registrationNumber?.toLowerCase() === cleanLower ||
        data.email?.toLowerCase() === cleanLower ||
        (cleanDigits && data.phone?.replace(/\D/g, '') === cleanDigits) ||
        data.checkinToken?.toLowerCase() === cleanLower
      ) {
        found = data;
      }
    });

    return found;
  } catch (err) {
    console.error('[Firebase] Direct lookup failed:', err);
    return null;
  }
}

