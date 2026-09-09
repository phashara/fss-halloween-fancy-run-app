import React, { useState } from 'react';
import { 
  Ghost, 
  Menu, 
  X, 
  UserCheck, 
  ShoppingBag, 
  Search, 
  Users, 
  Calendar, 
  Map, 
  HelpCircle, 
  Phone, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';

interface NavbarProps {
  activeTab?: string;
  currentPage?: string;
  onSelectTab?: (tab: string) => void;
  onNavigate?: (tab: string) => void;
  onQuickRegister?: () => void;
  registeredCount?: number;
  maxCapacity?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  currentPage, 
  onSelectTab, 
  onNavigate, 
  onQuickRegister 
}) => {
  const currentTab = activeTab || currentPage || 'home';
  const handleNav = (tabId: string) => {
    const target = tabId === 'shirt' ? 'shirts' : tabId;
    if (onSelectTab) onSelectTab(target);
    if (onNavigate) onNavigate(target);
  };
  const handleRegister = onQuickRegister || (() => handleNav('register'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'หน้าแรก', icon: Ghost },
    { id: 'register', label: 'ลงทะเบียนฟรี', icon: Sparkles, highlight: true },
    { id: 'shirts', label: 'เสื้อที่ระลึก', icon: ShoppingBag },
    { id: 'status', label: 'ตรวจสอบสถานะ', icon: Search },
    { id: 'participants', label: 'ประกาศรายชื่อ', icon: Users },
    { id: 'schedule', label: 'กำหนดการ', icon: Calendar },
    { id: 'route', label: 'เส้นทางวิ่ง', icon: Map },
    { id: 'rules', label: 'กติกา & คำถาม', icon: HelpCircle },
    { id: 'contact', label: 'ติดต่อเรา', icon: Phone },
    { id: 'admin', label: 'ระบบเจ้าหน้าที่', icon: ShieldCheck, admin: true },
  ];

  const handleItemClick = (id: string) => {
    if (id === 'register') {
      handleRegister();
    } else {
      handleNav(id);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#0b0c16]/90 border-b border-purple-900/40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Name */}
          <button
            type="button"
            onClick={() => handleItemClick('home')}
            className="flex items-center gap-3 group text-left"
          >
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-600 via-purple-600 to-amber-500 p-0.5 shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0d0d1a] rounded-[14px] flex items-center justify-center">
                <Ghost className="w-6 h-6 text-orange-400 group-hover:rotate-12 transition-transform" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">
                  FSS 2026
                </span>
                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  คณะสังคมศาสตร์ ม.นเรศวร
                </span>
                <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-2 py-0.5 rounded-full" title="เชื่อมต่อฐานข้อมูล Firebase Realtime Cloud แล้ว">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Firebase Cloud
                </span>
              </div>
              <div className="text-base sm:text-lg font-extrabold text-white font-heading tracking-wide group-hover:text-orange-300 transition-colors">
                Halloween Fancy Run
              </div>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1 text-sm font-medium">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              
              if (item.highlight) {
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleItemClick(item.id)}
                    className="relative group ml-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold hover:from-orange-400 hover:to-amber-400 active:scale-95 transition-all shadow-md shadow-orange-500/30 flex items-center gap-1.5"
                  >
                    <Icon className="w-4 h-4 text-slate-950" />
                    <span>{item.label}</span>
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleItemClick(item.id)}
                  className={`px-3 py-2 rounded-xl text-xs lg:text-sm transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-purple-950/80 text-orange-400 border border-purple-700/50 shadow-sm'
                      : item.admin 
                        ? 'text-purple-300 hover:text-white hover:bg-purple-900/30 border border-purple-800/30'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-orange-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-2 xl:hidden">
            <button
              type="button"
              onClick={handleRegister}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-orange-500/20 active:scale-95"
            >
              สมัครฟรี
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-900 border border-purple-900/40 text-slate-300 hover:text-white hover:bg-purple-900/30 transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#0d0e1f] border-b border-purple-900/50 px-4 pt-3 pb-6 space-y-1 animate-in slide-in-from-top-2 duration-200">
          <div className="text-xs font-semibold text-slate-400 px-3 py-1">
            เมนูหลัก FSS Halloween Run 2026
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-purple-900/60 text-orange-400 font-bold'
                    : item.highlight
                      ? 'bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-300 border border-orange-500/30'
                      : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-orange-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.highlight && (
                  <span className="text-[10px] bg-orange-500 text-slate-950 font-bold px-2 py-0.5 rounded-full">
                    FREE
                  </span>
                )}
                {item.admin && (
                  <span className="text-[10px] bg-purple-900/80 text-purple-300 px-2 py-0.5 rounded-full border border-purple-700/50">
                    Staff
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
