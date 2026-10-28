import React from 'react';
import { usePlacement } from '../../context/PlacementContext';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';

interface ProtectedAccessViewProps {
  requiredRole?: string;
  tabName: string;
}

export const ProtectedAccessView: React.FC<ProtectedAccessViewProps> = ({ tabName }) => {
  const { role, setActiveTab } = usePlacement();

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-xs space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-7 h-7" />
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Restricted Section Access
          </h2>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            The <strong className="text-slate-800 uppercase font-mono">{tabName}</strong> module is restricted by institutional access control policy. Your current account role (<strong className="text-slate-900 capitalize">{role}</strong>) does not have authorization to view this resource.
          </p>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 text-left space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-slate-700">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Policy Guidelines:</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-normal">
            Students cannot access internal recruiter lists or administrative analytics. Recruiters can only access candidates in their hiring pipeline.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('dashboard')}
          className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Authorized Dashboard</span>
        </button>
      </div>
    </div>
  );
};
