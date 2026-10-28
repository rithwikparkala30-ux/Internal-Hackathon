import React from 'react';
import { usePlacement } from '../../context/PlacementContext';
import { 
  Users, 
  Building2, 
  Briefcase, 
  Award, 
  TrendingUp, 
  Calendar, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { Branch } from '../../types';

export const DashboardView: React.FC = () => {
  const { 
    students, 
    companies, 
    jobs, 
    applications, 
    interviews, 
    offers, 
    setActiveTab, 
    role, 
    activeStudentId, 
    activeCompanyId 
  } = usePlacement();

  const totalStudents = students.length;
  const placedStudents = students.filter((s) => s.placementStatus === 'Placed');
  const inProcessStudents = students.filter((s) => s.placementStatus === 'In Process');
  const unplacedStudents = students.filter((s) => s.placementStatus === 'Unplaced');

  const placementRate = totalStudents > 0 
    ? Math.round((placedStudents.length / totalStudents) * 100) 
    : 0;

  const totalPackages = placedStudents.reduce((acc, s) => acc + (s.packageLpa || 0), 0);
  const avgPackage = placedStudents.length > 0 
    ? (totalPackages / placedStudents.length).toFixed(2) 
    : '0';

  const highestPackage = placedStudents.reduce(
    (max, s) => Math.max(max, s.packageLpa || 0), 
    0
  );

  const openJobs = jobs.filter((j) => j.status === 'Open');
  const upcomingDrives = companies.filter((c) => c.status === 'Ongoing' || c.status === 'Upcoming');

  // Branch statistics
  const branches: Branch[] = [
    'Computer Science', 
    'Information Technology', 
    'Electronics & Comm', 
    'Mechanical', 
    'Electrical'
  ];

  const branchStats = branches.map((b) => {
    const totalInBranch = students.filter((s) => s.branch === b).length;
    const placedInBranch = students.filter((s) => s.branch === b && s.placementStatus === 'Placed').length;
    const rate = totalInBranch > 0 ? Math.round((placedInBranch / totalInBranch) * 100) : 0;
    return { branch: b, total: totalInBranch, placed: placedInBranch, rate };
  });

  // Recent placements (latest offers)
  const recentOffers = [...offers].slice(0, 5);

  // Student role specific information
  const currentStudent = students.find((s) => s.id === activeStudentId);
  const studentApps = applications.filter((a) => a.studentId === activeStudentId);
  const studentInterviews = interviews.filter((i) => i.studentId === activeStudentId);

  // Recruiter role specific info
  const currentCompany = companies.find((c) => c.id === activeCompanyId);
  const companyJobs = jobs.filter((j) => j.companyId === activeCompanyId);
  const companyApps = applications.filter((a) => a.companyId === activeCompanyId);

  return (
    <div className="space-y-6">
      {/* Role Notice / Persona Context Banner */}
      {role === 'student' && currentStudent && (
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-xl p-5 shadow-sm border border-blue-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-blue-200 font-semibold">Student Portal View</span>
                <span className="text-blue-300">·</span>
                <span className="text-xs text-blue-200">{currentStudent.rollNo}</span>
              </div>
              <h2 className="text-xl font-bold mt-1">Welcome back, {currentStudent.name}</h2>
              <p className="text-xs text-blue-100 mt-1">
                {currentStudent.branch} · CGPA <span className="font-semibold tabular-nums">{currentStudent.cgpa}</span> · Status: <span className="font-semibold">{currentStudent.placementStatus}</span>
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setActiveTab('jobs')}
                className="px-4 py-2 text-xs font-semibold bg-white text-blue-950 rounded-lg hover:bg-blue-50 transition-colors shadow-xs"
              >
                Browse Open Jobs
              </button>
              <button
                onClick={() => setActiveTab('eligibility')}
                className="px-4 py-2 text-xs font-semibold bg-blue-700 hover:bg-blue-600 text-white border border-blue-500 rounded-lg transition-colors"
              >
                Check My Eligibility
              </button>
            </div>
          </div>
        </div>
      )}

      {role === 'recruiter' && currentCompany && (
        <div className="bg-gradient-to-r from-emerald-950 to-teal-900 text-white rounded-xl p-5 shadow-sm border border-emerald-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-emerald-200 font-semibold">Recruiter Portal View</span>
                <span className="text-emerald-300">·</span>
                <span className="text-xs text-emerald-200">{currentCompany.tier} Corporate Partner</span>
              </div>
              <h2 className="text-xl font-bold mt-1">{currentCompany.name} Talent Desk</h2>
              <p className="text-xs text-emerald-100 mt-1">
                Recruitment Target: <span className="font-semibold tabular-nums">{currentCompany.hiringQuota}</span> hires · Current Offers: <span className="font-semibold tabular-nums">{currentCompany.totalHired}</span>
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setActiveTab('applications')}
                className="px-4 py-2 text-xs font-semibold bg-white text-emerald-950 rounded-lg hover:bg-emerald-50 transition-colors"
              >
                Review Applicants ({companyApps.length})
              </button>
              <button
                onClick={() => setActiveTab('interviews')}
                className="px-4 py-2 text-xs font-semibold bg-emerald-800 hover:bg-emerald-700 text-white border border-emerald-600 rounded-lg transition-colors"
              >
                Manage Interview Rounds
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Stat Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Batch Strength
            </span>
            <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 tabular-nums">
              {totalStudents}
            </span>
            <span className="text-xs text-slate-500 font-medium">registered</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>{placedStudents.length} Placed</span>
            <span>·</span>
            <span>{unplacedStudents.length} Seeking</span>
          </div>
        </div>

        {/* Placement Rate */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Placement Rate
            </span>
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 tabular-nums">
              {placementRate}%
            </span>
            <span className="text-xs font-semibold text-emerald-600">
              {placedStudents.length} of {totalStudents}
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-emerald-600 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${placementRate}%` }}
            />
          </div>
        </div>

        {/* Packages */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Avg / Max Package
            </span>
            <div className="p-2 bg-blue-50 rounded-lg text-blue-700">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-900 tabular-nums">
              ₹{avgPackage}
            </span>
            <span className="text-xs text-slate-500 font-medium">LPA avg</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>Highest: <strong className="text-slate-800 tabular-nums">₹{highestPackage} LPA</strong></span>
          </div>
        </div>

        {/* Corporate Recruitment */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Companies & Openings
            </span>
            <div className="p-2 bg-purple-50 rounded-lg text-purple-700">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 tabular-nums">
              {companies.length}
            </span>
            <span className="text-xs text-slate-500 font-medium">firms</span>
            <span className="text-slate-300">·</span>
            <span className="text-2xl font-bold text-slate-900 tabular-nums">
              {openJobs.length}
            </span>
            <span className="text-xs text-slate-500 font-medium">active jobs</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>{interviews.length} Total Rounds</span>
            <span>·</span>
            <span>{offers.length} Offers</span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Split: Branch Progress + Recruitment Drives */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Branch-wise Breakdown & Pipeline Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Department Placement Breakdown */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Branch-wise Placement Performance
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Percentage of candidates placed across engineering departments
                </p>
              </div>
              <button
                onClick={() => setActiveTab('reports')}
                className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                Full Analytics <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-4 space-y-3.5">
              {branchStats.map((b) => (
                <div key={b.branch} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-800">{b.branch}</span>
                    <span className="text-slate-500 tabular-nums font-mono">
                      {b.placed}/{b.total} placed ({b.rate}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        b.rate >= 70
                          ? 'bg-emerald-600'
                          : b.rate >= 40
                          ? 'bg-blue-600'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${b.rate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Placement Selections */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Recent Campus Placement Offers
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Latest verified corporate offers extended to students
                </p>
              </div>
              <button
                onClick={() => setActiveTab('results')}
                className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                View All Results ({offers.length}) <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {recentOffers.map((offer) => (
                <div key={offer.id} className="p-4 flex items-center justify-between hover:bg-slate-50/70 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {offer.studentName.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-900">{offer.studentName}</h4>
                      <p className="text-[11px] text-slate-500">
                        {offer.studentRollNo} · {offer.studentBranch}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-semibold text-slate-900 block">
                      {offer.companyName}
                    </span>
                    <span className="text-[11px] text-emerald-600 font-bold tabular-nums">
                      ₹{offer.ctcLpa} LPA
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 span): Upcoming Drives & Quick Actions */}
        <div className="space-y-6">
          {/* Upcoming Recruitment Drives */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900">
                Corporate Campus Drives
              </h3>
              <Calendar className="w-4 h-4 text-slate-400" />
            </div>

            <div className="mt-4 space-y-4">
              {companies.map((comp) => (
                <div
                  key={comp.id}
                  className="p-3.5 rounded-lg border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{comp.name}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{comp.industry}</p>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider ${
                      comp.status === 'Ongoing'
                        ? 'bg-blue-100 text-blue-800'
                        : comp.status === 'Completed'
                        ? 'bg-slate-100 text-slate-700'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {comp.status}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-600 border-t border-slate-200/50 pt-2">
                    <span>Drive Date: <strong className="text-slate-800 tabular-nums">{comp.visitDate}</strong></span>
                    <span>Quota: <strong className="text-slate-800 tabular-nums">{comp.hiringQuota}</strong></span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveTab('companies')}
              className="w-full mt-4 py-2 text-xs font-semibold text-center text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Manage Corporate Directory
            </button>
          </div>

          {/* Quick Launch & Tools */}
          <div className="bg-slate-900 text-white rounded-xl p-5 shadow-xs">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Quick Navigation Actions
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Direct access to recruitment workflows:
            </p>

            <div className="mt-4 space-y-2">
              <button
                onClick={() => setActiveTab('eligibility')}
                className="w-full text-left px-3.5 py-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-xs font-medium text-slate-200 flex items-center justify-between transition-colors"
              >
                <span>Automated Eligibility Filter</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => setActiveTab('applications')}
                className="w-full text-left px-3.5 py-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-xs font-medium text-slate-200 flex items-center justify-between transition-colors"
              >
                <span>Application Pipeline Board</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => setActiveTab('interviews')}
                className="w-full text-left px-3.5 py-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-xs font-medium text-slate-200 flex items-center justify-between transition-colors"
              >
                <span>Schedule Interview Round</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => setActiveTab('reports')}
                className="w-full text-left px-3.5 py-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-xs font-medium text-slate-200 flex items-center justify-between transition-colors"
              >
                <span>Export Placement CSVs</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
