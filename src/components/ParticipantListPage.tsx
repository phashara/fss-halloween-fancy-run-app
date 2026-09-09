import React, { useState, useMemo } from 'react';
import { Users, Search, Filter, Sparkles, Ghost, ShieldCheck, Download } from 'lucide-react';
import { Applicant, GhostCharacter, ApplicantType } from '../types';
import { GhostAvatar } from './GhostAvatar';
import { storageService } from '../data/storage';

interface ParticipantListPageProps {
  applicants: Applicant[];
  ghosts: GhostCharacter[];
}

export const ParticipantListPage: React.FC<ParticipantListPageProps> = ({ applicants, ghosts }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [ghostFilter, setGhostFilter] = useState<string>('all');

  // Filter logic
  const filteredApplicants = useMemo(() => {
    return applicants.filter((a) => {
      // Category filter
      if (categoryFilter !== 'all' && a.applicantType !== categoryFilter) {
        return false;
      }
      // Ghost filter
      if (ghostFilter !== 'all' && a.ghostCharacterCode !== ghostFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchesName = `${a.firstName} ${a.lastName} ${a.nickname || ''}`.toLowerCase().includes(q);
        const matchesReg = a.registrationNumber.toLowerCase().includes(q);
        const matchesFaculty = (a.faculty || '').toLowerCase().includes(q);
        const matchesTeam = (a.teamName || '').toLowerCase().includes(q);
        return matchesName || matchesReg || matchesFaculty || matchesTeam;
      }
      return true;
    });
  }, [applicants, categoryFilter, ghostFilter, searchQuery]);

  // PDPA masking helper
  const renderDisplayName = (a: Applicant) => {
    if (a.consentPublicName === false) {
      const firstChar = a.firstName.charAt(0);
      const lastChar = a.lastName.charAt(0);
      return `${a.prefix} ${firstChar}*** ${lastChar}*** (ปกปิดชื่อตาม PDPA)`;
    }
    return `${a.prefix} ${a.firstName} ${a.lastName} ${a.nickname ? `(${a.nickname})` : ''}`;
  };

  const getGhostByCode = (code: string) => {
    return ghosts.find(g => g.code === code) || ghosts[0];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 uppercase">
          <Users className="w-3.5 h-3.5" />
          <span>Official Participant Roster</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
          ประกาศรายชื่อผู้ลงทะเบียนเข้าร่วมกิจกรรม
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          ตรวจสอบรายชื่อ หมายเลข BIB และตัวละครผีไทยประจำตัว (ระบบคุ้มครองข้อมูลส่วนบุคคลตามมาตรฐาน PDPA)
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#121028] border border-purple-900/50 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ค้นหาชื่อ, นามสกุล, BIB, คณะ หรือทีมวิ่ง..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#181438] border border-purple-800/50 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-orange-500 placeholder-slate-500"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-[#181438] border border-purple-800/50 rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-orange-500"
            >
              <option value="all">ทุกประเภทผู้สมัคร</option>
              <option value="นิสิตคณะสังคมศาสตร์">นิสิตคณะสังคมศาสตร์</option>
              <option value="นิสิต ม.นเรศวร ต่างคณะ">นิสิต ม.นเรศวร ต่างคณะ</option>
              <option value="บุคลากร / อาจารย์ ม.นเรศวร">บุคลากร / อาจารย์ ม.นเรศวร</option>
              <option value="ศิษย์เก่า ม.นเรศวร">ศิษย์เก่า ม.นเรศวร</option>
              <option value="ประชาชนทั่วไป">ประชาชนทั่วไป</option>
            </select>
          </div>

          {/* Ghost Filter */}
          <div>
            <select
              value={ghostFilter}
              onChange={(e) => setGhostFilter(e.target.value)}
              className="w-full bg-[#181438] border border-purple-800/50 rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-orange-500"
            >
              <option value="all">ทุกตัวละครผีไทย (12 แบบ)</option>
              {ghosts.map((g) => (
                <option key={g.code} value={g.code}>
                  {g.code}: {g.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Counter Banner */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-purple-900/30">
          <div>
            พบผู้สมัครทั้งหมด <strong className="text-orange-400">{filteredApplicants.length}</strong> คน (จากทั้งหมด {applicants.length} คน)
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>PDPA Verified (ซ่อนข้อมูลติดต่อและข้อมูลสุขภาพ)</span>
          </div>
        </div>
      </div>

      {/* Participants Table View */}
      <div className="bg-[#121028] border border-purple-900/50 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#19143a] text-slate-300 font-heading border-b border-purple-800/40">
              <tr>
                <th className="py-3.5 px-4">BIB ID</th>
                <th className="py-3.5 px-4">ชื่อ - นามสกุล</th>
                <th className="py-3.5 px-4">ประเภทผู้สมัคร</th>
                <th className="py-3.5 px-4">คณะ / หน่วยงาน</th>
                <th className="py-3.5 px-4">ตัวละครผีไทย</th>
                <th className="py-3.5 px-4 text-center">สถานะเช็กอิน</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-900/30 text-slate-200">
              {filteredApplicants.length > 0 ? (
                filteredApplicants.map((applicant) => {
                  const ghost = getGhostByCode(applicant.ghostCharacterCode);
                  return (
                    <tr key={applicant.id} className="hover:bg-purple-900/20 transition-colors">
                      {/* BIB Number */}
                      <td className="py-3.5 px-4 font-mono font-bold text-orange-400">
                        {applicant.registrationNumber}
                      </td>

                      {/* Name */}
                      <td className="py-3.5 px-4 font-medium text-white">
                        <div>{renderDisplayName(applicant)}</div>
                        {applicant.teamName && (
                          <span className="text-[10px] text-pink-300 bg-pink-950/60 px-2 py-0.5 rounded-full border border-pink-500/20">
                            ทีม: {applicant.teamName}
                          </span>
                        )}
                      </td>

                      {/* Type */}
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                          applicant.applicantType.includes('สังคมศาสตร์')
                            ? 'bg-orange-950/80 text-orange-300 border border-orange-500/30'
                            : 'bg-purple-950/80 text-purple-300 border border-purple-500/30'
                        }`}>
                          {applicant.applicantType}
                        </span>
                      </td>

                      {/* Faculty / Dept */}
                      <td className="py-3.5 px-4 text-slate-300 text-xs">
                        {applicant.faculty || '-'}
                      </td>

                      {/* Ghost Character */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-purple-950 border border-purple-800 flex items-center justify-center shrink-0">
                            <GhostAvatar code={ghost.code} size={30} />
                          </div>
                          <div>
                            <div className="font-bold text-white text-xs">
                              {storageService.getGhostThemeMode() === 'horror' && ghost.scaryName ? ghost.scaryName : ghost.name}
                            </div>
                            <span 
                              className="px-1.5 py-0.2 rounded text-[10px] font-bold text-white"
                              style={{ backgroundColor: ghost.color }}
                            >
                              {ghost.code}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Check-in Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          applicant.checkinStatus === 'checked_in'
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40'
                            : 'bg-slate-800/80 text-slate-400'
                        }`}>
                          {applicant.checkinStatus === 'checked_in' ? 'เช็กอินแล้ว' : 'ยังไม่เช็กอิน'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    ไม่พบรายชื่อผู้สมัครที่ตรงกับเงื่อนไขการค้นหา
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
