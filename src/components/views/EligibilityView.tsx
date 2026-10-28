import React, { useState } from 'react';
import { usePlacement } from '../../context/PlacementContext';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Briefcase, 
  Users, 
  Filter, 
  Check, 
  ArrowRight,
  ShieldCheck,
  Building2,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { Job, Student } from '../../types';

export const EligibilityView: React.FC = () => {
  const { 
    jobs, 
    students, 
    applications, 
    bulkApplyOrShortlist, 
    applyForJob, 
    role, 
    activeStudentId, 
    setActiveStudentId 
  } = usePlacement();

  const [selectedJobId, setSelectedJobId] = useState<string>(jobs[0]?.id || '');
  const [eligibilityFilter, setEligibilityFilter] = useState<'All' | 'Eligible' | 'Ineligible'>('All');
  const [inspectMode, setInspectMode] = useState<'byJob' | 'byStudent'>('byJob');

  const selectedJob = jobs.find((j) => j.id === selectedJobId) || jobs[0];
  const inspectedStudent = students.find((s) => s.id === activeStudentId) || students[0];

  // Evaluate all students against selectedJob
  const evaluationResults = students.map((student) => {
    const passCgpa = student.cgpa >= selectedJob.minCgpa;
    const passBacklogs = student.backlogs <= selectedJob.allowedBacklogs;
    const passBranch = selectedJob.eligibleBranches.includes(student.branch);
    const passBatch =
      !selectedJob.graduationYears ||
      selectedJob.graduationYears.length === 0 ||
      selectedJob.graduationYears.includes(student.batch);
    const isOverallEligible = passCgpa && passBacklogs && passBranch && passBatch;

    const failureReasons: string[] = [];
    if (!passCgpa) failureReasons.push(`CGPA ${student.cgpa.toFixed(2)} < required ${selectedJob.minCgpa.toFixed(1)}`);
    if (!passBacklogs) failureReasons.push(`Backlogs ${student.backlogs} > allowed ${selectedJob.allowedBacklogs}`);
    if (!passBranch) failureReasons.push(`Branch ${student.branch} not in eligible list (${selectedJob.eligibleBranches.join(', ')})`);
    if (!passBatch) failureReasons.push(`Batch ${student.batch} not in eligible graduation years (${(selectedJob.graduationYears || []).join(', ')})`);

    const existingApp = applications.find(
      (a) => a.studentId === student.id && a.jobId === selectedJob.id
    );

    return {
      student,
      passCgpa,
      passBacklogs,
      passBranch,
      passBatch,
      isOverallEligible,
      failureReasons,
      existingApp,
    };
  });

  const eligibleCount = evaluationResults.filter((r) => r.isOverallEligible).length;
  const ineligibleCount = evaluationResults.length - eligibleCount;
  const eligibleRate = Math.round((eligibleCount / evaluationResults.length) * 100);

  const displayedResults = evaluationResults.filter((r) => {
    if (eligibilityFilter === 'Eligible') return r.isOverallEligible;
    if (eligibilityFilter === 'Ineligible') return !r.isOverallEligible;
    return true;
  });

  // Evaluate single student against all jobs (Mode 2)
  const studentJobEvaluations = jobs.map((job) => {
    const passCgpa = inspectedStudent.cgpa >= job.minCgpa;
    const passBacklogs = inspectedStudent.backlogs <= job.allowedBacklogs;
    const passBranch = job.eligibleBranches.includes(inspectedStudent.branch);
    const passBatch =
      !job.graduationYears ||
      job.graduationYears.length === 0 ||
      job.graduationYears.includes(inspectedStudent.batch);
    const isOverallEligible = passCgpa && passBacklogs && passBranch && passBatch;

    const failureReasons: string[] = [];
    if (!passCgpa) failureReasons.push(`CGPA ${inspectedStudent.cgpa.toFixed(2)} < required ${job.minCgpa.toFixed(1)}`);
    if (!passBacklogs) failureReasons.push(`Backlogs ${inspectedStudent.backlogs} > allowed ${job.allowedBacklogs}`);
    if (!passBranch) failureReasons.push(`Branch ${inspectedStudent.branch} not in eligible departments`);
    if (!passBatch) failureReasons.push(`Batch ${inspectedStudent.batch} not in graduation batches (${(job.graduationYears || []).join(', ')})`);

    const existingApp = applications.find(
      (a) => a.studentId === inspectedStudent.id && a.jobId === job.id
    );

    return {
      job,
      passCgpa,
      passBacklogs,
      passBranch,
      passBatch,
      isOverallEligible,
      failureReasons,
      existingApp,
    };
  });

  const handleBulkAction = (targetStatus: 'Shortlisted' | 'Applied') => {
    const eligibleStudentIds = evaluationResults
      .filter((r) => r.isOverallEligible)
      .map((r) => r.student.id);

    bulkApplyOrShortlist(selectedJob.id, eligibleStudentIds, targetStatus);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Recruitment Eligibility Engine
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Automated matrix validating CGPA thresholds, backlogs limits, and degree branch criteria
          </p>
        </div>

        {/* View Switcher: Inspect by Job vs Inspect by Student */}
        <div className="flex items-center p-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium self-start sm:self-auto">
          <button
            onClick={() => setInspectMode('byJob')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              inspectMode === 'byJob'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Check by Job Opening
          </button>
          <button
            onClick={() => setInspectMode('byStudent')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              inspectMode === 'byStudent'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Check by Individual Student
          </button>
        </div>
      </div>

      {inspectMode === 'byJob' ? (
        <>
          {/* Active Job Selector & Criteria Overview Banner */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Selected Job Opening to Evaluate
                </label>
                <div className="relative">
                  <select
                    value={selectedJob.id}
                    onChange={(e) => setSelectedJobId(e.target.value)}
                    className="w-full text-sm font-bold bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-3 pr-10 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer"
                  >
                    {jobs.map((job) => (
                      <option key={job.id} value={job.id}>
                        {job.companyName} — {job.title} (₹{job.ctcLpa} LPA)
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-3 top-3 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Summary Scorecard */}
              <div className="flex items-center gap-4 bg-slate-50 px-4 py-3 rounded-lg border border-slate-200/60 shrink-0">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Batch Fit</span>
                  <span className="text-xl font-bold font-mono tabular-nums text-slate-900">
                    {eligibleCount} / {students.length}
                  </span>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Eligibility Rate</span>
                  <span className="text-xl font-bold font-mono tabular-nums text-emerald-600">
                    {eligibleRate}%
                  </span>
                </div>
              </div>
            </div>

            {/* Threshold Parameters Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                <span>CGPA Cutoff: <strong className="text-slate-900 font-mono">≥ {selectedJob.minCgpa.toFixed(1)}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                <span>Max Backlogs: <strong className="text-slate-900 font-mono">≤ {selectedJob.allowedBacklogs}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                <span className="truncate">Eligible Branches: <strong className="text-slate-900">{selectedJob.eligibleBranches.join(', ')}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                <span className="truncate">Batches: <strong className="text-slate-900 font-mono">{(selectedJob.graduationYears || ['2025']).join(', ')}</strong></span>
              </div>
            </div>
          </div>

          {/* Action Bar & Filtering */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            {/* Filter buttons */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">Show:</span>
              <button
                onClick={() => setEligibilityFilter('All')}
                className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                  eligibilityFilter === 'All'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All Students ({students.length})
              </button>
              <button
                onClick={() => setEligibilityFilter('Eligible')}
                className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                  eligibilityFilter === 'Eligible'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-slate-100 text-emerald-800 hover:bg-slate-200'
                }`}
              >
                Eligible Only ({eligibleCount})
              </button>
              <button
                onClick={() => setEligibilityFilter('Ineligible')}
                className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                  eligibilityFilter === 'Ineligible'
                    ? 'bg-rose-700 text-white'
                    : 'bg-slate-100 text-rose-800 hover:bg-slate-200'
                }`}
              >
                Ineligible ({ineligibleCount})
              </button>
            </div>

            {/* Bulk Actions for Admin/Recruiter */}
            {(role === 'admin' || role === 'recruiter') && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleBulkAction('Shortlisted')}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-xs"
                >
                  Bulk Shortlist ({eligibleCount})
                </button>
                <button
                  onClick={() => handleBulkAction('Applied')}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-900 text-white rounded-lg transition-colors"
                >
                  Bulk Apply ({eligibleCount})
                </button>
              </div>
            )}
          </div>

          {/* Matrix Evaluation Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4 text-center">CGPA</th>
                    <th className="py-3 px-4 text-center">Backlogs</th>
                    <th className="py-3 px-4 text-center">Branch</th>
                    <th className="py-3 px-4 text-center">Batch</th>
                    <th className="py-3 px-4 text-center">Eligibility Decision</th>
                    <th className="py-3 px-4">Application Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {displayedResults.map((res) => {
                    return (
                      <tr
                        key={res.student.id}
                        className={`hover:bg-slate-50/70 transition-colors ${
                          !res.isOverallEligible ? 'bg-slate-50/30' : ''
                        }`}
                      >
                        {/* Student info */}
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900 whitespace-nowrap">
                            {res.student.name}
                          </div>
                          <div className="text-[11px] font-mono text-slate-500">
                            {res.student.rollNo} · {res.student.branch}
                          </div>
                        </td>

                        {/* CGPA check */}
                        <td className="py-3 px-4 text-center">
                          <div className="inline-flex items-center gap-1.5">
                            {res.passCgpa ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            ) : (
                              <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                            )}
                            <span className="font-mono tabular-nums font-semibold text-slate-900">
                              {res.student.cgpa.toFixed(2)}
                            </span>
                          </div>
                        </td>

                        {/* Backlogs check */}
                        <td className="py-3 px-4 text-center">
                          <div className="inline-flex items-center gap-1.5">
                            {res.passBacklogs ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            ) : (
                              <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                            )}
                            <span className="font-mono tabular-nums font-semibold text-slate-900">
                              {res.student.backlogs}
                            </span>
                          </div>
                        </td>

                        {/* Branch match */}
                        <td className="py-3 px-4 text-center">
                          <div className="inline-flex items-center gap-1.5">
                            {res.passBranch ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            ) : (
                              <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                            )}
                            <span className="text-slate-800">
                              {res.passBranch ? 'Matched' : 'Excluded'}
                            </span>
                          </div>
                        </td>

                        {/* Batch match */}
                        <td className="py-3 px-4 text-center">
                          <div className="inline-flex items-center gap-1.5">
                            {res.passBatch ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            ) : (
                              <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                            )}
                            <span className="text-slate-800 font-mono">
                              {res.student.batch}
                            </span>
                          </div>
                        </td>

                        {/* Decision */}
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          {res.isOverallEligible ? (
                            <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              Eligible
                            </span>
                          ) : (
                            <div className="inline-block text-left">
                              <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold bg-rose-100 text-rose-800 border border-rose-200">
                                Ineligible ({res.failureReasons.length})
                              </span>
                              <div
                                className="text-[10px] text-rose-600 mt-0.5 max-w-[200px] truncate"
                                title={res.failureReasons.join('; ')}
                              >
                                {res.failureReasons.join(' • ')}
                              </div>
                            </div>
                          )}
                        </td>

                        {/* Existing App */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          {res.existingApp ? (
                            <span className="text-xs font-semibold text-blue-700">
                              {res.existingApp.status}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400 italic">
                              Not Applied
                            </span>
                          )}
                        </td>

                        {/* Action */}
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          {res.isOverallEligible && !res.existingApp && (
                            <button
                              onClick={() => applyForJob(res.student.id, selectedJob.id)}
                              className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
                            >
                              Apply Candidate
                            </button>
                          )}
                          {res.existingApp && (
                            <span className="text-[11px] text-slate-400 font-medium">
                              In Pipeline
                            </span>
                          )}
                          {!res.isOverallEligible && (
                            <span className="text-[11px] text-slate-400">
                              Criteria unmet
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Mode 2: Check by Individual Student */
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Select Student to Inspect Eligibility
                </label>
                <div className="relative">
                  <select
                    value={inspectedStudent.id}
                    onChange={(e) => setActiveStudentId(e.target.value)}
                    className="text-sm font-bold bg-slate-50 border border-slate-200 rounded-lg py-2 pl-3 pr-10 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer"
                  >
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.rollNo} · {s.branch})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-3 top-3 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Student credentials card */}
              <div className="flex items-center gap-6 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Branch</span>
                  <span className="font-semibold text-slate-900">{inspectedStudent.branch}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">CGPA</span>
                  <span className="font-bold font-mono text-slate-900 tabular-nums">
                    {inspectedStudent.cgpa.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Backlogs</span>
                  <span className="font-bold font-mono text-slate-900 tabular-nums">
                    {inspectedStudent.backlogs}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Job Eligibility Cards for this Student */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studentJobEvaluations.map(({ job, passCgpa, passBacklogs, passBranch, passBatch, isOverallEligible, existingApp }) => (
              <div
                key={job.id}
                className={`p-5 rounded-xl border bg-white shadow-xs flex flex-col justify-between ${
                  isOverallEligible ? 'border-emerald-200' : 'border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
                        {job.companyName}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 mt-0.5">{job.title}</h4>
                      <p className="text-xs text-slate-500">{job.location} · ₹{job.ctcLpa} LPA</p>
                    </div>

                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                      isOverallEligible
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {isOverallEligible ? 'Eligible' : 'Not Eligible'}
                    </span>
                  </div>

                  {/* Requirements Breakdown */}
                  <div className="mt-4 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">CGPA ≥ {job.minCgpa.toFixed(1)}:</span>
                      <span className={`font-medium ${passCgpa ? 'text-emerald-700' : 'text-rose-600'}`}>
                        {passCgpa ? 'Passed' : 'Failed'} ({inspectedStudent.cgpa.toFixed(2)})
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Backlogs ≤ {job.allowedBacklogs}:</span>
                      <span className={`font-medium ${passBacklogs ? 'text-emerald-700' : 'text-rose-600'}`}>
                        {passBacklogs ? 'Passed' : 'Failed'} ({inspectedStudent.backlogs})
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Eligible Branch:</span>
                      <span className={`font-medium ${passBranch ? 'text-emerald-700' : 'text-rose-600'}`}>
                        {passBranch ? 'Match' : 'Excluded'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Graduation Batch:</span>
                      <span className={`font-medium ${passBatch ? 'text-emerald-700' : 'text-rose-600'}`}>
                        {passBatch ? 'Match' : `Excluded (${inspectedStudent.batch})`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  {existingApp ? (
                    <span className="text-xs font-semibold text-emerald-700">
                      Already Applied ({existingApp.status})
                    </span>
                  ) : isOverallEligible ? (
                    <button
                      onClick={() => applyForJob(inspectedStudent.id, job.id)}
                      className="px-4 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-xs ml-auto"
                    >
                      Apply for Candidate
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400 italic">
                      Ineligible for this drive
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
