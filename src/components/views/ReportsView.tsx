import React from 'react';
import { usePlacement } from '../../context/PlacementContext';
import { 
  BarChart3, 
  Download, 
  Printer, 
  TrendingUp, 
  Award, 
  Users, 
  Building2, 
  CheckCircle,
  FileSpreadsheet
} from 'lucide-react';
import { Branch } from '../../types';

export const ReportsView: React.FC = () => {
  const { students, companies, jobs, applications, offers, showToast } = usePlacement();

  const totalStudents = students.length;
  const placedStudents = students.filter((s) => s.placementStatus === 'Placed');
  const overallRate = totalStudents > 0 ? Math.round((placedStudents.length / totalStudents) * 100) : 0;

  const totalPkg = placedStudents.reduce((acc, s) => acc + (s.packageLpa || 0), 0);
  const avgPkg = placedStudents.length > 0 ? (totalPkg / placedStudents.length).toFixed(2) : '0';

  // Department statistics
  const branches: Branch[] = [
    'Computer Science',
    'Information Technology',
    'Electronics & Comm',
    'Mechanical',
    'Electrical',
  ];

  const branchReports = branches.map((b) => {
    const total = students.filter((s) => s.branch === b).length;
    const placed = students.filter((s) => s.branch === b && s.placementStatus === 'Placed').length;
    const rate = total > 0 ? Math.round((placed / total) * 100) : 0;
    const branchOffers = offers.filter((o) => o.studentBranch === b);
    const branchPkgTotal = branchOffers.reduce((sum, o) => sum + o.ctcLpa, 0);
    const branchAvg = branchOffers.length > 0 ? (branchPkgTotal / branchOffers.length).toFixed(1) : '—';

    return {
      branch: b,
      total,
      placed,
      rate,
      avgLpa: branchAvg,
    };
  });

  // Package distribution brackets
  const packageBrackets = [
    { label: 'Super Dream (> ₹20 LPA)', count: offers.filter((o) => o.ctcLpa > 20).length, color: 'bg-emerald-600' },
    { label: 'Dream (₹15 - ₹20 LPA)', count: offers.filter((o) => o.ctcLpa >= 15 && o.ctcLpa <= 20).length, color: 'bg-blue-600' },
    { label: 'Core / Standard (< ₹15 LPA)', count: offers.filter((o) => o.ctcLpa < 15).length, color: 'bg-indigo-500' },
  ];

  // CSV Export functions
  const downloadCSV = (filename: string, csvContent: string) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('success', 'Export Downloaded', `${filename} generated successfully.`);
  };

  const exportStudentsCSV = () => {
    const headers = ['Roll No', 'Name', 'Email', 'Phone', 'Branch', 'Batch', 'CGPA', 'Backlogs', 'Status', 'Placed Company', 'Package LPA'];
    const rows = students.map((s) => [
      s.rollNo,
      `"${s.name}"`,
      s.email,
      s.phone,
      `"${s.branch}"`,
      s.batch,
      s.cgpa.toFixed(2),
      s.backlogs,
      s.placementStatus,
      `"${s.placedCompanyName || 'N/A'}"`,
      s.packageLpa || '0',
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    downloadCSV(`campus_connect_students_roster_${new Date().toISOString().split('T')[0]}.csv`, csv);
  };

  const exportOffersCSV = () => {
    const headers = ['Offer ID', 'Student Name', 'Roll No', 'Branch', 'Company', 'Designation', 'CTC LPA', 'Offer Date', 'Status'];
    const rows = offers.map((o) => [
      o.id,
      `"${o.studentName}"`,
      o.studentRollNo,
      `"${o.studentBranch}"`,
      `"${o.companyName}"`,
      `"${o.jobTitle}"`,
      o.ctcLpa.toFixed(2),
      o.offerDate,
      o.status,
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    downloadCSV(`campus_connect_placement_offers_${new Date().toISOString().split('T')[0]}.csv`, csv);
  };

  const exportApplicationsCSV = () => {
    const headers = ['App ID', 'Student Name', 'Roll No', 'Branch', 'Company', 'Job Title', 'Applied Date', 'Stage Status', 'Current Round'];
    const rows = applications.map((a) => [
      a.id,
      `"${a.studentName}"`,
      a.studentRollNo,
      `"${a.studentBranch}"`,
      `"${a.companyName}"`,
      `"${a.jobTitle}"`,
      a.appliedDate,
      a.status,
      `"${a.currentRound}"`,
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    downloadCSV(`campus_connect_applications_ledger_${new Date().toISOString().split('T')[0]}.csv`, csv);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Placement Analytics & Institutional Reports
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Department-level placement metrics, salary distribution bands, and compliance data exports
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* CSV Export Quick Action Cards */}
      <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              Download Data Ledgers (Comma Separated Values)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Download clean spreadsheet-compatible files for official university administrative reporting.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              onClick={exportStudentsCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-lg border border-slate-700 transition-colors"
            >
              <Download className="w-3 h-3 text-emerald-400" />
              Students Master ({students.length})
            </button>
            <button
              onClick={exportOffersCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-lg border border-slate-700 transition-colors"
            >
              <Download className="w-3 h-3 text-emerald-400" />
              Offer Results ({offers.length})
            </button>
            <button
              onClick={exportApplicationsCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-lg border border-slate-700 transition-colors"
            >
              <Download className="w-3 h-3 text-emerald-400" />
              Applications ({applications.length})
            </button>
          </div>
        </div>
      </div>

      {/* Department Breakdown Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Departmental Placement Statistics
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Comparative review of placement percentage and average compensation across streams
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Department / Branch</th>
                <th className="py-3 px-4 text-center">Batch Strength</th>
                <th className="py-3 px-4 text-center">Placed Count</th>
                <th className="py-3 px-4 text-center">Placement Rate (%)</th>
                <th className="py-3 px-4 text-right">Average Package (LPA)</th>
                <th className="py-3 px-4">Progress Indicator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {branchReports.map((b) => (
                <tr key={b.branch} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {b.branch}
                  </td>
                  <td className="py-3 px-4 text-center font-mono tabular-nums text-slate-800">
                    {b.total}
                  </td>
                  <td className="py-3 px-4 text-center font-mono tabular-nums text-emerald-700 font-semibold">
                    {b.placed}
                  </td>
                  <td className="py-3 px-4 text-center font-mono tabular-nums font-bold text-slate-900">
                    {b.rate}%
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-slate-900">
                    {b.avgLpa !== '—' ? `₹${b.avgLpa} LPA` : '—'}
                  </td>
                  <td className="py-3 px-4 w-48">
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full ${
                          b.rate >= 70 ? 'bg-emerald-600' : b.rate >= 40 ? 'bg-blue-600' : 'bg-amber-500'
                        }`}
                        style={{ width: `${b.rate}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2-Column Split: Salary Bands + Corporate Conversion */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CTC Distribution Brackets */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <h3 className="text-sm font-semibold text-slate-900 pb-3 border-b border-slate-100">
            Compensation Tier Distribution
          </h3>

          <div className="mt-4 space-y-4">
            {packageBrackets.map((bracket) => {
              const pct = offers.length > 0 ? Math.round((bracket.count / offers.length) * 100) : 0;
              return (
                <div key={bracket.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-800">{bracket.label}</span>
                    <span className="font-mono tabular-nums font-semibold text-slate-700">
                      {bracket.count} offers ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-2.5 rounded-full ${bracket.color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-slate-500 mt-5 pt-3 border-t border-slate-100">
            * Tiering classified per university placement regulations. Super Dream bracket consists of packages &gt; ₹20 LPA.
          </p>
        </div>

        {/* Corporate Conversion Funnel */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <h3 className="text-sm font-semibold text-slate-900 pb-3 border-b border-slate-100">
            Recruiting Partner Conversion Ratios
          </h3>

          <div className="mt-4 space-y-4">
            {companies.map((comp) => {
              const compApps = applications.filter((a) => a.companyId === comp.id);
              const compOffers = offers.filter((o) => o.companyId === comp.id);
              const convRate = compApps.length > 0 ? Math.round((compOffers.length / compApps.length) * 100) : 0;

              return (
                <div key={comp.id} className="p-3.5 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900">{comp.name}</span>
                      <span className="text-slate-400 block text-[11px]">{comp.tier} · Quota: {comp.hiringQuota}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold font-mono text-emerald-700 tabular-nums">
                        {compOffers.length} Hired
                      </span>
                      <span className="text-slate-400 block text-[10px] tabular-nums">
                        from {compApps.length} applicants ({convRate}%)
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-slate-500 mt-5 pt-3 border-t border-slate-100">
            Recruitment completion status: <strong>Ongoing</strong> through November 2025.
          </p>
        </div>
      </div>
    </div>
  );
};
