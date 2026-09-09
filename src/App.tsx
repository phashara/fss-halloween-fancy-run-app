import React, { useState, useEffect, useCallback } from 'react';
import { 
  Applicant, 
  ShirtOrder, 
  GhostCharacter, 
  EventSettings, 
  SizeChartEntry, 
  AuditLog 
} from './types';
import { storageService } from './data/storage';
import { 
  seedFirebaseIfEmpty, 
  subscribeToFirebaseApplicants, 
  subscribeToFirebaseOrders, 
  subscribeToFirebaseGhosts 
} from './firebase';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { RegistrationFlow } from './components/RegistrationFlow';
import { ShirtPage } from './components/ShirtPage';
import { StatusCheckPage } from './components/StatusCheckPage';
import { ParticipantListPage } from './components/ParticipantListPage';
import { SchedulePage } from './components/SchedulePage';
import { RoutePage } from './components/RoutePage';
import { RulesFaqPage } from './components/RulesFaqPage';
import { ContactPage } from './components/ContactPage';
import { AdminPortal } from './components/AdminPortal';
import { GhostDetailModal } from './components/GhostDetailModal';
import { EmailPreviewModal } from './components/EmailPreviewModal';

export default function App() {
  // Navigation State
  const [currentPage, setCurrentPage] = useState<string>('home');

  // Application Data State from storage
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [orders, setOrders] = useState<ShirtOrder[]>([]);
  const [ghosts, setGhosts] = useState<GhostCharacter[]>([]);
  const [settings, setSettings] = useState<EventSettings>(storageService.getSettings());
  const [sizeChart, setSizeChart] = useState<SizeChartEntry[]>(storageService.getSizeChart());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Modals State
  const [selectedGhostForModal, setSelectedGhostForModal] = useState<GhostCharacter | null>(null);
  const [emailModalApplicant, setEmailModalApplicant] = useState<Applicant | null>(null);

  // Load / Reload Data from storage
  const refreshAllData = useCallback(() => {
    setApplicants(storageService.getApplicants());
    setOrders(storageService.getOrders());
    setGhosts(storageService.getGhosts());
    setSettings(storageService.getSettings());
    setSizeChart(storageService.getSizeChart());
    setAuditLogs(storageService.getAuditLogs());
  }, []);

  useEffect(() => {
    refreshAllData();

    // Listen to storage update events (local & multi-tab)
    const handleStorageUpdate = () => {
      refreshAllData();
    };
    window.addEventListener('fss_storage_update', handleStorageUpdate);

    // Initialize Firebase Firestore and populate seed if needed
    seedFirebaseIfEmpty().catch((err) => console.warn('[Firebase Seed Error]', err));

    // Subscribe to cloud applicants in real time
    const unsubApplicants = subscribeToFirebaseApplicants((cloudApplicants) => {
      storageService.mergeCloudData(cloudApplicants, undefined, undefined);
      setApplicants(cloudApplicants);
    });

    // Subscribe to cloud orders in real time
    const unsubOrders = subscribeToFirebaseOrders((cloudOrders) => {
      storageService.mergeCloudData(undefined, cloudOrders, undefined);
      setOrders(cloudOrders);
    });

    // Subscribe to cloud ghosts in real time
    const unsubGhosts = subscribeToFirebaseGhosts((cloudGhosts) => {
      storageService.mergeCloudData(undefined, undefined, cloudGhosts);
      setGhosts(cloudGhosts);
    });

    return () => {
      window.removeEventListener('fss_storage_update', handleStorageUpdate);
      unsubApplicants();
      unsubOrders();
      unsubGhosts();
    };
  }, [refreshAllData]);

  // Handle successful registration
  const handleRegistrationComplete = (applicant: Applicant, order?: ShirtOrder) => {
    refreshAllData();
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Scroll to top on page change
  const navigateTo = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0c16] text-slate-100 font-sans selection:bg-orange-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentPage={currentPage}
        activeTab={currentPage}
        onNavigate={navigateTo}
        onSelectTab={navigateTo}
        onQuickRegister={() => navigateTo('register')}
        registeredCount={applicants.length}
        maxCapacity={settings.maxCapacity}
      />

      {/* Main Page Routing */}
      <main className="flex-1">
        {/* 1. HOME VIEW */}
        {currentPage === 'home' && (
          <div className="space-y-12">
            <HeroSection
              settings={settings}
              ghosts={ghosts}
              applicantCount={applicants.length}
              registeredCount={applicants.length}
              onRegisterClick={() => navigateTo('register')}
              onShirtClick={() => navigateTo('shirts')}
              onViewShirtClick={() => navigateTo('shirts')}
              onStatusClick={() => navigateTo('status')}
              onSelectGhost={(ghost) => setSelectedGhostForModal(ghost)}
              onSelectGhostPreview={(ghost) => setSelectedGhostForModal(ghost)}
            />

            {/* Quick Links Banner */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => navigateTo('schedule')}
                  className="bg-[#13112b] hover:bg-[#1a163a] border border-purple-900/50 hover:border-orange-500/40 p-5 rounded-2xl text-left transition-all group"
                >
                  <div className="text-orange-400 font-bold text-sm mb-1 group-hover:translate-x-1 transition-transform">
                    กำหนดการ & กิจกรรม →
                  </div>
                  <div className="text-xs text-slate-300">
                    พิธีเปิด 18:00 น., ปล่อยตัวนักวิ่ง, คอนเสิร์ต และการประกวดแฟนซี
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => navigateTo('route')}
                  className="bg-[#13112b] hover:bg-[#1a163a] border border-purple-900/50 hover:border-pink-500/40 p-5 rounded-2xl text-left transition-all group"
                >
                  <div className="text-pink-400 font-bold text-sm mb-1 group-hover:translate-x-1 transition-transform">
                    แผนผังเส้นทางวิ่ง มน. →
                  </div>
                  <div className="text-xs text-slate-300">
                    ระยะ 3.5 KM Fun Run & 5.5 KM Fancy Run พร้อมจุดน้ำและถ่ายภาพเรืองแสง
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => navigateTo('rules')}
                  className="bg-[#13112b] hover:bg-[#1a163a] border border-purple-900/50 hover:border-emerald-500/40 p-5 rounded-2xl text-left transition-all group"
                >
                  <div className="text-emerald-400 font-bold text-sm mb-1 group-hover:translate-x-1 transition-transform">
                    กติกาประกวดแฟนซี 20,000฿ →
                  </div>
                  <div className="text-xs text-slate-300">
                    ประเภทเดี่ยว, ประเภททีม 3-5 คน และขวัญใจผีไทยน่ารัก
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. REGISTRATION FLOW */}
        {currentPage === 'register' && (
          <RegistrationFlow
            settings={settings}
            ghosts={ghosts}
            sizeChart={sizeChart}
            onComplete={handleRegistrationComplete}
            onViewShirtClick={() => navigateTo('shirts')}
          />
        )}

        {/* 3. SOUVENIR SHIRT SHOWCASE */}
        {currentPage === 'shirts' && (
          <ShirtPage
            settings={settings}
            sizeChart={sizeChart}
            onOrderClick={() => navigateTo('register')}
          />
        )}

        {/* 4. STATUS CHECK & CARD REVEAL */}
        {currentPage === 'status' && (
          <StatusCheckPage
            settings={settings}
            ghosts={ghosts}
            onGoToRegister={() => navigateTo('register')}
          />
        )}

        {/* 5. PUBLIC PARTICIPANT ROSTER */}
        {currentPage === 'participants' && (
          <ParticipantListPage
            applicants={applicants}
            ghosts={ghosts}
          />
        )}

        {/* 6. SCHEDULE TIMELINE */}
        {currentPage === 'schedule' && <SchedulePage />}

        {/* 7. RUNNING ROUTE & MAP */}
        {currentPage === 'route' && <RoutePage />}

        {/* 8. RULES, CONTEST & FAQ */}
        {currentPage === 'rules' && <RulesFaqPage />}

        {/* 9. CONTACT FACULTY */}
        {currentPage === 'contact' && <ContactPage settings={settings} />}

        {/* 10. ADMIN & CHECK-IN PORTAL */}
        {currentPage === 'admin' && (
          <AdminPortal
            applicants={applicants}
            orders={orders}
            ghosts={ghosts}
            settings={settings}
            sizeChart={sizeChart}
            auditLogs={auditLogs}
            onRefreshData={refreshAllData}
          />
        )}
      </main>

      {/* Global Modals */}
      {selectedGhostForModal && (
        <GhostDetailModal
          ghost={selectedGhostForModal}
          isOpen={!!selectedGhostForModal}
          onClose={() => setSelectedGhostForModal(null)}
          onSelectForRegistration={() => {
            setSelectedGhostForModal(null);
            navigateTo('register');
          }}
        />
      )}

      {emailModalApplicant && (
        <EmailPreviewModal
          applicant={emailModalApplicant}
          ghost={storageService.getGhostById(emailModalApplicant.ghostCharacterId) || ghosts[0]}
          order={storageService.getOrderByApplicantId(emailModalApplicant.id)}
          settings={settings}
          isOpen={!!emailModalApplicant}
          onClose={() => setEmailModalApplicant(null)}
        />
      )}

      {/* Footer */}
      <Footer 
        settings={settings} 
        onNavigate={navigateTo} 
        onSelectTab={navigateTo} 
      />
    </div>
  );
}
