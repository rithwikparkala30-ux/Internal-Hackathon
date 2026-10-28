import React from 'react';
import { usePlacement } from '../../context/PlacementContext';
import { LoginView } from './LoginView';
import { RegisterView } from './RegisterView';
import { ForgotPasswordView } from './ForgotPasswordView';
import { ToastContainer } from '../common/Toast';
import { 
  GraduationCap, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  Award,
  Users,
  Briefcase
} from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { authScreen, students, companies, jobs, offers } = usePlacement();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center lg:flex-row antialiased selection:bg-blue-600 selection:text-white">
      {/* Left Column: Campus Connect Brand Hero (hidden on small, shown on lg+) */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-5/12 bg-slate-950 text-white flex-col justify-between p-12 relative overflow-hidden border-r border-slate-800">
        {/* Subtle background glow */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-base shadow-lg shadow-blue-500/30">
              CC
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white block leading-tight">
                Campus Connect
              </span>
              <span className="text-xs text-slate-400 font-medium tracking-wide block uppercase">
                Campus Recruitment Portal
              </span>
            </div>
          </div>

          <div className="mt-12 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-900/60 text-blue-300 border border-blue-700/40">
              <Sparkles className="w-3.5 h-3.5" />
              Academic Year 2024–2025 Central Drives
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
              Centralized Placement & Recruitment Operations
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              Streamline corporate partner hiring, automated candidate eligibility checks, multi-round interview evaluations, and verifiable offer registries in one unified platform.
            </p>
          </div>
        </div>

        {/* Live Portal Metrics Strip */}
        <div className="relative z-10 grid grid-cols-3 gap-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800 my-8">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Students</span>
            <span className="text-xl font-bold font-mono text-white mt-0.5 block">{students.length}</span>
            <span className="text-[10px] text-emerald-400 font-medium">5 Branches</span>
          </div>
          <div className="border-l border-slate-800 pl-3">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Visiting Firms</span>
            <span className="text-xl font-bold font-mono text-white mt-0.5 block">{companies.length}</span>
            <span className="text-[10px] text-blue-400 font-medium">Tier-1 Corporates</span>
          </div>
          <div className="border-l border-slate-800 pl-3">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Offers Issued</span>
            <span className="text-xl font-bold font-mono text-white mt-0.5 block">{offers.length}</span>
            <span className="text-[10px] text-amber-400 font-medium">Verified Slips</span>
          </div>
        </div>

        {/* Portal Pillars */}
        <div className="relative z-10 space-y-3 text-xs text-slate-300">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
            <span>Strict role-based segregation for Placement Admin, Candidates, and Recruiters</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Automated CGPA, backlog threshold, and graduation batch eligibility validation</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Award className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Official placement slips with verifiable CTC package records</span>
          </div>
        </div>

        {/* Institutional Footer */}
        <div className="relative z-10 pt-6 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
          <span>University Placement Directorate</span>
          <span>Prototype Edition</span>
        </div>
      </div>

      {/* Right Column: Auth Forms Container */}
      <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-8 md:p-12 overflow-y-auto">
        {/* Mobile Brand Bar */}
        <div className="flex lg:hidden items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
            CC
          </div>
          <div>
            <span className="text-base font-bold text-slate-900 block leading-tight">
              Campus Connect
            </span>
            <span className="text-[11px] text-slate-500 font-medium block">
              Recruitment Portal
            </span>
          </div>
        </div>

        {/* Card Frame */}
        <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
          {authScreen === 'login' && <LoginView />}
          {authScreen === 'register' && <RegisterView />}
          {authScreen === 'forgot-password' && <ForgotPasswordView />}
        </div>

        <p className="text-[11px] text-slate-400 mt-6 text-center">
          Campus Connect © 2025 · Fictional Prototype Demo for Recruitment Evaluation
        </p>
      </div>

      <ToastContainer />
    </div>
  );
};
