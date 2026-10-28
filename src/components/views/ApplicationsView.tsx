import React, { useState, useMemo } from 'react';
import { usePlacement } from '../../context/PlacementContext';
import { 
  Search, 
  Filter, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Award, 
  ChevronDown,
  Kanban,
  Table as TableIcon,
  MessageSquare
} from 'lucide-react';
import { Application, ApplicationStatus } from '../../types';
import { Modal } from '../common/Modal';

export const ApplicationsView: React.FC = () => {
  const { 
    applications, 
    jobs, 
    companies, 
    updateApplicationStatus, 
    role, 
    activeStudentId, 
    activeCompanyId 
  } = usePlacement();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJobFilter, setSelectedJobFilter] = useState('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'table' | 'pipeline'>('table');

  // Status change modal
  const [statusModalApp, setStatusModalApp] = useState<Application | null>(null);
  const [targetStatus, setTargetStatus] = useState<ApplicationStatus>('Shortlisted');
  const [newRoundTitle, setNewRoundTitle] = useState('');
  const [newRemarks, setNewRemarks] = useState('');

  const allStatuses: ApplicationStatus[] = [
    'Applied',
    'Shortlisted',
    'Assessment Passed',
    'Interview Scheduled',
    'Offered',
    'Rejected',
  ];

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      // Role filtering
      if (role === 'student' && app.studentId !== activeStudentId) {
        return false;
      }
      if (role === 'recruiter' && app.companyId !== activeCompanyId) {
        return false;
      }

      const matchesSearch =
        app.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.studentRollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesJob = selectedJobFilter === 'All' || app.jobId === selectedJobFilter;
      const matchesStatus = selectedStatusFilter === 'All' || app.status === selectedStatusFilter;

      return matchesSearch && matchesJob && matchesStatus;
    });
  }, [applications, searchQuery, selectedJobFilter, selectedStatusFilter, role, activeStudentId, activeCompanyId]);

  const openStatusModal = (app: Application, status: ApplicationStatus) => {
    setStatusModalApp(app);
    setTargetStatus(status);
    setNewRoundTitle(
      status === 'Shortlisted'
        ? 'Technical Screening'
        : status === 'Assessment Passed'
        ? 'Coding Assessment Complete'
        : status === 'Interview Scheduled'
        ? 'Round 1: Technical Panel'
        : status === 'Offered'
        ? 'Final Placement Offer'
        : 'Disqualified'
    );
    setNewRemarks(app.remarks || '');
  };

  const handleConfirmStatusChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusModalApp) return;

    updateApplicationStatus(
      statusModalApp.id,
      targetStatus,
      newRoundTitle,
      newRemarks
    );
    setStatusModalApp(null);
  };

  // Pipeline metrics
  const countsByStatus = allStatuses.reduce((acc, status) => {
    acc[status] = applications.filter((a) => a.status === status).length;
    return acc;
  }, {} as Record<ApplicationStatus, number>);

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Recruitment Applications & Pipeline
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Tracking {filteredApplications.length} candidate applications across selection stages
          </p>
        </div>

        {/* View Switcher: Table vs Pipeline Board */}
        <div className="flex items-center p-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium self-start sm:self-auto">
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              viewMode === 'table'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Table View</span>
          </button>
          <button
            onClick={() => setViewMode('pipeline')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              viewMode === 'pipeline'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Kanban className="w-3.5 h-3.5" />
            <span>Pipeline Board</span>
          </button>
        </div>
      </div>

      {/* Stage Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        {allStatuses.map((st) => (
          <div
            key={st}
            onClick={() => setSelectedStatusFilter(selectedStatusFilter === st ? 'All' : st)}
            className={`p-3 rounded-lg border text-center cursor-pointer transition-all ${
              selectedStatusFilter === st
                ? 'bg-blue-50 border-blue-400 ring-1 ring-blue-400'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className="block text-[11px] text-slate-500 truncate font-medium">
              {st}
            </span>
            <span className="text-lg font-bold font-mono tabular-nums text-slate-900">
              {countsByStatus[st] || 0}
            </span>
          </div>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative md:col-span-2">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidate name, roll number, or company..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="relative">
          <select
            value={selectedJobFilter}
            onChange={(e) => setSelectedJobFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
          >
            <option value="All">All Jobs & Openings</option>
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.companyName} — {j.title}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-3 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Mode 1: Table View */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Candidate</th>
                  <th className="py-3 px-4">Branch & CGPA</th>
                  <th className="py-3 px-4">Company & Role</th>
                  <th className="py-3 px-4">Applied Date</th>
                  <th className="py-3 px-4">Current Round</th>
                  <th className="py-3 px-4">Status</th>
                  {(role === 'admin' || role === 'recruiter') && (
                    <th className="py-3 px-4 text-right">Update Status</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      No applications found for current selection.
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((app) => {
                    const statusColor = {
                      Applied: 'bg-slate-100 text-slate-700',
                      Shortlisted: 'bg-blue-100 text-blue-800',
                      'Assessment Passed': 'bg-indigo-100 text-indigo-800',
                      'Interview Scheduled': 'bg-amber-100 text-amber-800',
                      Offered: 'bg-emerald-100 text-emerald-800 font-bold',
                      Rejected: 'bg-rose-100 text-rose-800',
                    }[app.status];

                    return (
                      <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900 whitespace-nowrap">
                            {app.studentName}
                          </div>
                          <div className="text-[11px] font-mono text-slate-500">
                            {app.studentRollNo}
                          </div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="text-slate-800">{app.studentBranch}</div>
                          <div className="text-[11px] font-mono tabular-nums text-slate-500">
                            CGPA {app.studentCgpa.toFixed(2)}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900 whitespace-nowrap">
                            {app.companyName}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate max-w-xs">
                            {app.jobTitle}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono tabular-nums text-slate-600 whitespace-nowrap">
                          {app.appliedDate}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="font-medium text-slate-800 block">
                            {app.currentRound}
                          </span>
                          {app.remarks && (
                            <span className="text-[10px] text-slate-400 block truncate max-w-xs">
                              {app.remarks}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${statusColor}`}>
                            {app.status}
                          </span>
                        </td>
                        {(role === 'admin' || role === 'recruiter') && (
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <select
                              value={app.status}
                              onChange={(e) => openStatusModal(app, e.target.value as ApplicationStatus)}
                              className="text-xs bg-slate-50 border border-slate-200 text-slate-800 rounded-lg py-1 px-2 font-medium hover:bg-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                            >
                              {allStatuses.map((st) => (
                                <option key={st} value={st}>
                                  Move to {st}
                                </option>
                              ))}
                            </select>
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Mode 2: Kanban Pipeline View */
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {allStatuses.map((st) => {
            const stageApps = filteredApplications.filter((a) => a.status === st);
            return (
              <div key={st} className="bg-slate-100/70 p-3 rounded-xl border border-slate-200 flex flex-col min-h-[400px]">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-800 truncate">{st}</span>
                  <span className="text-xs font-mono font-semibold bg-white px-2 py-0.5 rounded text-slate-600 border border-slate-200">
                    {stageApps.length}
                  </span>
                </div>

                <div className="space-y-2 flex-1 overflow-y-auto">
                  {stageApps.map((app) => (
                    <div
                      key={app.id}
                      className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs hover:border-slate-300 transition-all text-xs"
                    >
                      <div className="font-semibold text-slate-900">{app.studentName}</div>
                      <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                        {app.studentRollNo} · {app.studentBranch.split(' ')[0]}
                      </div>
                      <div className="mt-2 pt-2 border-t border-slate-100">
                        <div className="font-medium text-blue-700 truncate">{app.companyName}</div>
                        <div className="text-[10px] text-slate-500 truncate">{app.jobTitle}</div>
                      </div>

                      {(role === 'admin' || role === 'recruiter') && (
                        <div className="mt-2 pt-2 border-t border-slate-100 flex justify-end">
                          <button
                            onClick={() => openStatusModal(app, 'Interview Scheduled')}
                            className="text-[10px] text-blue-600 hover:text-blue-800 font-semibold"
                          >
                            Update Stage →
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  {stageApps.length === 0 && (
                    <div className="text-[11px] text-slate-400 text-center py-6">
                      No candidates in {st}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Status Update Confirmation Modal with Remarks */}
      {statusModalApp && (
        <Modal
          isOpen={true}
          onClose={() => setStatusModalApp(null)}
          title={`Update Application: ${statusModalApp.studentName}`}
          subtitle={`Moving application to "${targetStatus}" for ${statusModalApp.companyName}`}
          maxWidth="md"
        >
          <form onSubmit={handleConfirmStatusChange} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Status
              </label>
              <select
                value={targetStatus}
                onChange={(e) => setTargetStatus(e.target.value as ApplicationStatus)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-medium focus:ring-1 focus:ring-blue-500"
              >
                {allStatuses.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Current Round / Pipeline Phase
              </label>
              <input
                type="text"
                value={newRoundTitle}
                onChange={(e) => setNewRoundTitle(e.target.value)}
                placeholder="e.g. Technical Round 2, HR Final, Direct Offer"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Recruiter Remarks & Notes
              </label>
              <textarea
                rows={3}
                value={newRemarks}
                onChange={(e) => setNewRemarks(e.target.value)}
                placeholder="Candidate feedback, assessment score, or next steps..."
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {targetStatus === 'Offered' && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-950 text-xs">
                <strong>Placement Confirmation Notice:</strong> Marking this application as <em>Offered</em> will update student placement status to <strong>Placed</strong> and generate an official entry in the placement results registry.
              </div>
            )}

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStatusModalApp(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs"
              >
                Update Application Status
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
