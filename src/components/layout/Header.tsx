import React, { useState, useRef, useEffect } from 'react';
import { usePlacement } from '../../context/PlacementContext';
import { 
  RotateCcw, 
  GraduationCap, 
  Building2, 
  ShieldCheck, 
  Menu,
  ChevronDown,
  LogOut,
  User,
  Check,
  Sparkles
} from 'lucide-react';
import { UserRole } from '../../types';

interface HeaderProps {
  onToggleMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileSidebar }) => {
  const { 
    role, 
    setRole, 
    activeTab, 
    students, 
    companies, 
    activeStudentId, 
    setActiveStudentId, 
    activeCompanyId, 
    setActiveCompanyId,
    resetToDemoData,
    currentUser,
    logout,
    switchDemoRole
  } = usePlacement();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Placement Overview & Executive KPIs';
      case 'students': return 'Student Directory & Profiles';
      case 'companies': return 'Corporate Partners & Recruitment Tiers';
      case 'jobs': return 'Active Job Openings & Requirements';
      case 'applications': return 'Recruitment Pipeline & Applications';
      case 'eligibility': return 'Interactive Eligibility Matrix Engine';
      case 'interviews': return 'Interview Schedules & Rounds Evaluation';
      case 'results': return 'Final Offers & Placed Candidates Register';
      case 'reports': return 'Department Analytics & Placement Insights';
      default: return 'Recruitment Portal';
    }
  };

  const currentStudent = students.find((s) => s.id === activeStudentId) || students[0];
  const currentCompany = companies.find((c) => c.id === activeCompanyId) || companies[0];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-8 bg-white border-b border-slate-200">
      {/* Left zone: Mobile hamburger + breadcrumb */}
      <div className="flex items-center gap-3 md:gap-4 min-w-0">
        <button
          onClick={onToggleMobileSidebar}
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg md:hidden cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs md:text-sm text-slate-500 truncate">
          <span className="font-semibold text-slate-900 hidden sm:inline">Campus Connect</span>
          <span className="text-slate-300 hidden sm:inline">/</span>
          <span className="text-slate-700 font-medium truncate">{getTabTitle()}</span>
        </div>
      </div>

      {/* Right zone: Session, Demo Switcher & Profile Dropdown */}
      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        {/* Demo persona quick switcher for testing convenience */}
        <div className="hidden lg:flex items-center p-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium">
          <button
            onClick={() => switchDemoRole('admin')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              role === 'admin'
                ? 'bg-slate-900 text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Switch active session to Administrator persona"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>

          <button
            onClick={() => switchDemoRole('student')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              role === 'student'
                ? 'bg-blue-600 text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Switch active session to Student candidate persona"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Student</span>
          </button>

          <button
            onClick={() => switchDemoRole('recruiter')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              role === 'recruiter'
                ? 'bg-emerald-700 text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Switch active session to Corporate Recruiter persona"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Recruiter</span>
          </button>
        </div>

        {/* Reset Demo Data button */}
        <button
          onClick={() => {
            if (window.confirm('Reset all demo student, company, job, and application data back to default?')) {
              resetToDemoData();
            }
          }}
          className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          title="Reset database back to default 20 students and 3 companies"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Reset Demo</span>
        </button>

        {/* User Profile Dropdown Button */}
        <div className="relative" ref={profileMenuRef}>
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-2 p-1.5 pl-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-100/70 transition-all text-left cursor-pointer"
          >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0 ${
              role === 'admin'
                ? 'bg-slate-900'
                : role === 'student'
                ? 'bg-blue-600'
                : 'bg-emerald-700'
            }`}>
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
            </div>

            <div className="hidden sm:block min-w-0 pr-1">
              <div className="text-xs font-semibold text-slate-900 leading-tight truncate max-w-[130px]">
                {currentUser?.name || 'Logged In User'}
              </div>
              <div className="text-[10px] text-slate-500 font-medium capitalize flex items-center gap-1">
                <span>{role}</span>
                <span>·</span>
                <span className="text-emerald-700 font-semibold">Active</span>
              </div>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-slate-200 shadow-lg py-2 z-50 text-xs text-slate-700 divide-y divide-slate-100">
              {/* Profile Card Header */}
              <div className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0 ${
                    role === 'admin'
                      ? 'bg-slate-900'
                      : role === 'student'
                      ? 'bg-blue-600'
                      : 'bg-emerald-700'
                  }`}>
                    {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 truncate">
                      {currentUser?.name || 'User Name'}
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono truncate">
                      {currentUser?.email || 'user@campusconnect.edu'}
                    </p>
                  </div>
                </div>

                <div className="mt-2.5 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-medium">Account Access:</span>
                  <span className={`px-2 py-0.5 rounded font-semibold uppercase tracking-wider text-[10px] ${
                    role === 'admin'
                      ? 'bg-slate-100 text-slate-800'
                      : role === 'student'
                      ? 'bg-blue-50 text-blue-800'
                      : 'bg-emerald-50 text-emerald-800'
                  }`}>
                    {role}
                  </span>
                </div>

                {role === 'student' && currentUser?.rollNo && (
                  <div className="mt-1 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-medium">Roll Number:</span>
                    <span className="font-mono text-slate-700 font-semibold">{currentUser.rollNo}</span>
                  </div>
                )}

                {role === 'recruiter' && currentUser?.companyName && (
                  <div className="mt-1 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-medium">Organization:</span>
                    <span className="text-slate-800 font-semibold truncate">{currentUser.companyName}</span>
                  </div>
                )}
              </div>

              {/* Persona Switcher Section inside dropdown */}
              <div className="px-4 py-2.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Simulate Role Persona
                </p>
                <div className="grid grid-cols-3 gap-1">
                  <button
                    onClick={() => {
                      switchDemoRole('admin');
                      setIsProfileMenuOpen(false);
                    }}
                    className={`px-2 py-1.5 rounded-lg text-center font-medium transition-colors cursor-pointer ${
                      role === 'admin' ? 'bg-slate-900 text-white font-semibold' : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    Admin
                  </button>
                  <button
                    onClick={() => {
                      switchDemoRole('student');
                      setIsProfileMenuOpen(false);
                    }}
                    className={`px-2 py-1.5 rounded-lg text-center font-medium transition-colors cursor-pointer ${
                      role === 'student' ? 'bg-blue-600 text-white font-semibold' : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    Student
                  </button>
                  <button
                    onClick={() => {
                      switchDemoRole('recruiter');
                      setIsProfileMenuOpen(false);
                    }}
                    className={`px-2 py-1.5 rounded-lg text-center font-medium transition-colors cursor-pointer ${
                      role === 'recruiter' ? 'bg-emerald-700 text-white font-semibold' : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    Recruiter
                  </button>
                </div>
              </div>

              {/* Logout Action */}
              <div className="p-1.5">
                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl font-semibold transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Sign Out of Portal</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

