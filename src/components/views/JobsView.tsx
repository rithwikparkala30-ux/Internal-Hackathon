import React, { useState, useMemo } from 'react';
import { usePlacement } from '../../context/PlacementContext';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Calendar, 
  Award, 
  Plus, 
  Edit2, 
  Trash2,
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  Filter,
  ChevronDown,
  Tag,
  AlertCircle
} from 'lucide-react';
import { Job, Branch } from '../../types';
import { Modal } from '../common/Modal';

export const JobsView: React.FC = () => {
  const { 
    jobs, 
    companies, 
    students, 
    applications, 
    addJob, 
    updateJob, 
    deleteJob,
    applyForJob, 
    withdrawApplication,
    role, 
    activeStudentId, 
    setActiveTab 
  } = usePlacement();

  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState<string>('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('Open');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  const [formData, setFormData] = useState<Omit<Job, 'id'>>({
    companyId: 'comp-001',
    companyName: 'NexaTech Systems',
    title: '',
    department: 'Software Engineering',
    ctcLpa: 18.0,
    minCgpa: 7.5,
    allowedBacklogs: 0,
    eligibleBranches: ['Computer Science', 'Information Technology'],
    graduationYears: ['2025'],
    openings: 5,
    deadline: '2025-11-20',
    driveDate: '2025-11-22',
    location: 'Bengaluru',
    type: 'Full-time',
    description: '',
    skillsRequired: ['Python', 'SQL', 'Git'],
    status: 'Open',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [skillInput, setSkillInput] = useState('');

  const currentStudent = students.find((s) => s.id === activeStudentId);

  const filteredJobs = useMemo(() => {
    return jobs.filter((j) => {
      const matchComp = selectedCompanyFilter === 'All' || j.companyId === selectedCompanyFilter;
      const matchStatus = selectedStatusFilter === 'All' || j.status === selectedStatusFilter;
      return matchComp && matchStatus;
    });
  }, [jobs, selectedCompanyFilter, selectedStatusFilter]);

  const openAddModal = () => {
    const comp = companies[0];
    setFormData({
      companyId: comp?.id || 'comp-001',
      companyName: comp?.name || 'NexaTech Systems',
      title: '',
      department: 'Software Engineering',
      ctcLpa: 16.0,
      category: 'Regular',
      minCgpa: 7.5,
      allowedBacklogs: 0,
      eligibleBranches: ['Computer Science', 'Information Technology'],
      graduationYears: ['2025'],
      openings: 4,
      deadline: '2025-11-25',
      driveDate: '2025-11-27',
      location: 'Bengaluru / Hyderabad',
      type: 'Full-time',
      description: '',
      skillsRequired: ['Python', 'Docker', 'REST APIs'],
      status: 'Open',
    });
    setSkillInput('');
    setIsAddModalOpen(true);
  };

  const openEditModal = (job: Job) => {
    setEditingJob(job);
    setFormData({ ...job });
    setSkillInput('');
  };

  const validateJobForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.title.trim()) errors.title = 'Job designation title is required.';
    if (formData.ctcLpa <= 0) errors.ctcLpa = 'Annual package must be greater than 0 LPA.';
    if (formData.minCgpa < 0 || formData.minCgpa > 10) errors.minCgpa = 'Minimum CGPA cutoff must be between 0.0 and 10.0.';
    if (formData.eligibleBranches.length === 0) errors.branches = 'Select at least one eligible engineering department.';
    if (!formData.graduationYears || formData.graduationYears.length === 0) errors.years = 'Select at least one eligible graduation batch year.';
    if (!formData.deadline) errors.deadline = 'Application deadline date is required.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleBranchToggle = (branch: Branch) => {
    setFormData((prev) => {
      const exists = prev.eligibleBranches.includes(branch);
      const newBranches = exists 
        ? prev.eligibleBranches.filter((b) => b !== branch)
        : [...prev.eligibleBranches, branch];
      if (formErrors.branches && newBranches.length > 0) {
        setFormErrors({ ...formErrors, branches: '' });
      }
      return { ...prev, eligibleBranches: newBranches };
    });
  };

  const handleGradYearToggle = (year: string) => {
    setFormData((prev) => {
      const current = prev.graduationYears || [];
      const exists = current.includes(year);
      const newYears = exists ? current.filter((y) => y !== year) : [...current, year];
      if (formErrors.years && newYears.length > 0) {
        setFormErrors({ ...formErrors, years: '' });
      }
      return { ...prev, graduationYears: newYears };
    });
  };

  const handleAddSkill = () => {
    if (!skillInput.trim()) return;
    if (!formData.skillsRequired.includes(skillInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        skillsRequired: [...prev.skillsRequired, skillInput.trim()],
      }));
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skillsRequired: prev.skillsRequired.filter((s) => s !== skill),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateJobForm()) return;

    const matchedComp = companies.find((c) => c.id === formData.companyId);
    const finalData = {
      ...formData,
      companyName: matchedComp ? matchedComp.name : formData.companyName,
    };

    if (editingJob) {
      updateJob(editingJob.id, finalData);
      setEditingJob(null);
    } else {
      addJob(finalData);
      setIsAddModalOpen(false);
    }
  };

  const allBranches: Branch[] = [
    'Computer Science',
    'Information Technology',
    'Electronics & Comm',
    'Mechanical',
    'Electrical',
  ];

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Job Openings & Requirements
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Browse campus job postings, check eligibility criteria, and track submission deadlines
          </p>
        </div>

        {(role === 'admin' || role === 'recruiter') && (
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors shadow-xs shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Job Opening</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Filter by Partner:</span>
          <button
            onClick={() => setSelectedCompanyFilter('All')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              selectedCompanyFilter === 'All'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Companies ({jobs.length})
          </button>
          {companies.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCompanyFilter(c.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                selectedCompanyFilter === c.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Status:</span>
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
          >
            <option value="All">All Jobs</option>
            <option value="Open">Open Only</option>
            <option value="Closed">Closed Only</option>
          </select>
        </div>
      </div>

      {/* Job Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredJobs.map((job) => {
          const applied = applications.find(
            (a) => a.jobId === job.id && a.studentId === activeStudentId
          );

          // Real-time eligibility evaluation for current student (including batch year)
          const isEligible = currentStudent
            ? currentStudent.cgpa >= job.minCgpa &&
              currentStudent.backlogs <= job.allowedBacklogs &&
              job.eligibleBranches.includes(currentStudent.branch) &&
              (!job.graduationYears || job.graduationYears.length === 0 || job.graduationYears.includes(currentStudent.batch))
            : false;

          return (
            <div
              key={job.id}
              className={`bg-white rounded-xl border transition-all flex flex-col justify-between overflow-hidden ${
                job.status === 'Open'
                  ? 'border-slate-200 hover:border-slate-300 shadow-xs'
                  : 'border-slate-200 bg-slate-50/60 opacity-80'
              }`}
            >
              <div className="p-6">
                {/* Title & Company */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-semibold text-blue-700 tracking-wide uppercase">
                      {job.companyName}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5 leading-snug">
                      {job.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {job.department} · {job.location}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-lg font-bold font-mono text-slate-900 tabular-nums block">
                      ₹{job.ctcLpa} LPA
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {job.type}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                {/* Eligibility Criteria Grid */}
                <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Min CGPA Requirement:</span>
                    <strong className="text-slate-900 font-mono tabular-nums">≥ {job.minCgpa.toFixed(1)}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Max Allowed Backlogs:</span>
                    <strong className="text-slate-900 font-mono tabular-nums">{job.allowedBacklogs}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Graduation Batch:</span>
                    <strong className="text-slate-900 font-mono">{job.graduationYears?.join(', ') || '2025'}</strong>
                  </div>
                  <div className="flex items-start justify-between text-slate-600 gap-2">
                    <span className="shrink-0">Eligible Branches:</span>
                    <span className="text-right font-medium text-slate-800">
                      {job.eligibleBranches.join(', ')}
                    </span>
                  </div>
                </div>

                {/* Skills Required */}
                {job.skillsRequired && job.skillsRequired.length > 0 && (
                  <div className="mt-3">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Required Skills:</span>
                    <div className="flex flex-wrap gap-1">
                      {job.skillsRequired.map((sk) => (
                        <span key={sk} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Logistics */}
                <div className="mt-4 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Drive: <strong className="text-slate-800">{job.driveDate}</strong></span>
                  </div>
                  <div>
                    Deadline: <strong className="text-slate-800 font-mono">{job.deadline}</strong>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                {/* Check in Eligibility Engine button */}
                <button
                  onClick={() => setActiveTab('eligibility')}
                  className="text-xs font-medium text-slate-600 hover:text-slate-900 underline underline-offset-2"
                >
                  Inspect Candidate Eligibility
                </button>

                <div className="flex items-center gap-2">
                  {role === 'student' && (
                    <>
                      {applied ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Applied ({applied.status})
                          </span>
                          {applied.status === 'Applied' && (
                            <button
                              onClick={() => {
                                if (window.confirm(`Withdraw your application for "${job.title}"?`)) {
                                  withdrawApplication(applied.id);
                                }
                              }}
                              className="text-[11px] text-rose-600 hover:text-rose-800 font-medium underline"
                            >
                              Withdraw
                            </button>
                          )}
                        </div>
                      ) : isEligible ? (
                        <button
                          onClick={() => applyForJob(activeStudentId, job.id)}
                          className="px-4 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-xs"
                        >
                          Apply Now
                        </button>
                      ) : (
                        <span className="text-xs font-semibold text-slate-500 bg-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1" title="You do not meet the CGPA, backlog, branch, or batch year requirement">
                          <XCircle className="w-3.5 h-3.5" />
                          Not Eligible
                        </span>
                      )}
                    </>
                  )}

                  {role === 'admin' && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(job)}
                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded transition-colors"
                        title="Edit job requirements"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to remove job opening "${job.title}"?`)) {
                            deleteJob(job.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                        title="Delete job opening"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Job Modal */}
      <Modal
        isOpen={isAddModalOpen || editingJob !== null}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingJob(null);
        }}
        title={editingJob ? `Edit Job — ${editingJob.title}` : 'Post Campus Job Opening'}
        subtitle="Specify compensation, eligibility criteria thresholds, and target branches."
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Recruiting Company *
              </label>
              <select
                value={formData.companyId}
                onChange={(e) => {
                  const comp = companies.find((c) => c.id === e.target.value);
                  setFormData({
                    ...formData,
                    companyId: e.target.value,
                    companyName: comp ? comp.name : formData.companyName,
                  });
                }}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.tier})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Job Title / Designation *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                  if (formErrors.title) setFormErrors({ ...formErrors, title: '' });
                }}
                placeholder="e.g. Cloud Infrastructure Associate"
                className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  formErrors.title ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                }`}
              />
              {formErrors.title && (
                <p className="text-[11px] text-rose-600 mt-1">{formErrors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Annual Package CTC (LPA) *
              </label>
              <input
                type="number"
                step="0.5"
                min="1"
                required
                value={formData.ctcLpa}
                onChange={(e) => {
                  setFormData({ ...formData, ctcLpa: parseFloat(e.target.value) || 0 });
                  if (formErrors.ctcLpa) setFormErrors({ ...formErrors, ctcLpa: '' });
                }}
                className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono ${
                  formErrors.ctcLpa ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                }`}
              />
              {formErrors.ctcLpa && (
                <p className="text-[11px] text-rose-600 mt-1">{formErrors.ctcLpa}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value as 'Dream' | 'Marquee' | 'Regular',
                  })
                }
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="Regular">Regular (Standard Campus CTC)</option>
                <option value="Dream">Dream (High Compensation &gt; 10 LPA)</option>
                <option value="Marquee">Marquee (Tier-1 Premium &gt; 20 LPA)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Minimum CGPA Cutoff (0 - 10) *
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                required
                value={formData.minCgpa}
                onChange={(e) => {
                  setFormData({ ...formData, minCgpa: parseFloat(e.target.value) || 0 });
                  if (formErrors.minCgpa) setFormErrors({ ...formErrors, minCgpa: '' });
                }}
                className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono ${
                  formErrors.minCgpa ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                }`}
              />
              {formErrors.minCgpa && (
                <p className="text-[11px] text-rose-600 mt-1">{formErrors.minCgpa}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Maximum Allowed Backlogs
              </label>
              <input
                type="number"
                min="0"
                max="10"
                value={formData.allowedBacklogs}
                onChange={(e) =>
                  setFormData({ ...formData, allowedBacklogs: parseInt(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Total Openings
              </label>
              <input
                type="number"
                min="1"
                value={formData.openings}
                onChange={(e) =>
                  setFormData({ ...formData, openings: parseInt(e.target.value) || 1 })
                }
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Application Deadline *
              </label>
              <input
                type="date"
                required
                value={formData.deadline}
                onChange={(e) => {
                  setFormData({ ...formData, deadline: e.target.value });
                  if (formErrors.deadline) setFormErrors({ ...formErrors, deadline: '' });
                }}
                className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  formErrors.deadline ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                }`}
              />
              {formErrors.deadline && (
                <p className="text-[11px] text-rose-600 mt-1">{formErrors.deadline}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Drive Date
              </label>
              <input
                type="date"
                value={formData.driveDate}
                onChange={(e) => setFormData({ ...formData, driveDate: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as 'Open' | 'Closed' | 'Upcoming',
                  })
                }
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="Open">Open for Applications</option>
                <option value="Upcoming">Upcoming (Scheduled)</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          {/* Eligible Branches selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Eligible Academic Branches *
              </label>
              <span className="text-[11px] text-slate-500">
                {formData.eligibleBranches.length} selected
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {allBranches.map((branch) => {
                const selected = formData.eligibleBranches.includes(branch);
                return (
                  <button
                    key={branch}
                    type="button"
                    onClick={() => handleBranchToggle(branch)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                      selected
                        ? 'bg-blue-50 border-blue-600 text-blue-900 font-semibold'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {branch}
                  </button>
                );
              })}
            </div>
            {formErrors.branches && (
              <p className="text-[11px] text-rose-600 mt-1">{formErrors.branches}</p>
            )}
          </div>

          {/* Eligible Graduation Batches */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Eligible Graduation Years (Batches) *
              </label>
              <span className="text-[11px] text-slate-500">
                {formData.graduationYears.length} selected
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {['2024', '2025', '2026', '2027'].map((year) => {
                const selected = formData.graduationYears.includes(year);
                return (
                  <button
                    key={year}
                    type="button"
                    onClick={() => handleGradYearToggle(year)}
                    className={`px-3 py-1.5 text-xs font-mono font-medium rounded-lg border transition-colors ${
                      selected
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-900 font-semibold'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Batch of {year}
                  </button>
                );
              })}
            </div>
            {formErrors.years && (
              <p className="text-[11px] text-rose-600 mt-1">{formErrors.years}</p>
            )}
          </div>

          {/* Required Skills Builder */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Required Skills & Competencies
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                placeholder="Type a skill and press Enter (e.g., Python, Docker, React)"
                className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3 py-2 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors shrink-0"
              >
                Add Skill
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 min-h-[28px] p-2 bg-slate-50 rounded-lg border border-slate-100">
              {formData.skillsRequired.length === 0 ? (
                <span className="text-[11px] text-slate-400 italic">No skills added yet</span>
              ) : (
                formData.skillsRequired.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium bg-white text-slate-700 border border-slate-200 rounded-md"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-slate-400 hover:text-rose-600 ml-0.5"
                      title="Remove skill"
                    >
                      &times;
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Role Description & Key Responsibilities
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Outline role responsibilities, team structure, and qualifications..."
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingJob(null);
              }}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors shadow-xs"
            >
              {editingJob ? 'Save Changes' : 'Post Opening'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

