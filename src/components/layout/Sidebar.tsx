import React from 'react';
import { usePlacement } from '../../context/PlacementContext';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Briefcase, 
  FileText, 
  CheckCircle2, 
  CalendarClock, 
  Award, 
  BarChart3,
  GraduationCap,
  Sparkles,
  X
} from 'lucide-react';
import { ActiveTab } from '../../types';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const { 
    activeTab, 
    setActiveTab, 
    role, 
    students, 
    companies, 
    jobs, 
    applications, 
    interviews, 
    offers,
    currentUser,
    logout,
    isTabAllowed
  } = usePlacement();

  const allNavItems: { id: ActiveTab; label: string; icon: React.ElementType; badge?: number | string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Students', icon: Users, badge: students.length },
    { id: 'companies', label: 'Companies', icon: Building2, badge: companies.length },
    { id: 'jobs', label: 'Jobs', icon: Briefcase, badge: jobs.filter(j => j.status === 'Open').length },
    { id: 'applications', label: 'Applications', icon: FileText, badge: applications.length },
    { id: 'eligibility', label: 'Eligibility', icon: CheckCircle2 },
    { id: 'interviews', label: 'Interviews', icon: CalendarClock, badge: interviews.filter(i => i.status === 'Scheduled').length },
    { id: 'results', label: 'Results', icon: Award, badge: offers.length },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
  ];

  // Only render tabs permitted for active role
  const navItems = allNavItems.filter((item) => isTabAllowed(item.id));

  const handleNavClick = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800 transition-transform duration-200 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand / Logo Zone */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-500/20">
              CC
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white block leading-tight">
                Campus Connect
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide block uppercase">
                Recruitment Portal
              </span>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="md:hidden text-slate-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current User Role Banner */}
        <div className="px-5 py-3 border-b border-slate-800/50 bg-slate-800/30">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 text-[11px] font-medium">SIGNED IN ROLE</span>
            <span className={`px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide uppercase ${
              role === 'admin' 
                ? 'bg-blue-900/60 text-blue-300 border border-blue-700/40' 
                : role === 'student'
                ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/40'
                : 'bg-purple-900/60 text-purple-300 border border-purple-700/40'
            }`}>
              {role}
            </span>
          </div>
          {currentUser && (
            <div className="text-[11px] text-slate-300 font-medium truncate mt-1">
              {currentUser.name}
            </div>
          )}
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-900/30 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-md tabular-nums font-semibold ${
                      isActive
                        ? 'bg-blue-700/80 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Session Footer & Quick Logout */}
        <div className="p-3.5 border-t border-slate-800/80 bg-slate-950/50">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200 font-bold text-xs shrink-0">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-200 truncate">
                  {currentUser?.name || 'Authorized User'}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {currentUser?.email || 'Campus Directory'}
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              title="Sign Out of Campus Connect"
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors shrink-0 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
