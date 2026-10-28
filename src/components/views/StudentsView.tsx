import React, { useState, useMemo } from 'react';
import { usePlacement } from '../../context/PlacementContext';
import { 
  Search, 
  Plus, 
  Filter, 
  MoreVertical, 
  Eye, 
  Edit2, 
  Trash2, 
  GraduationCap, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  ExternalLink,
  ChevronDown,
  FileText,
  Upload,
  Download,
  Shield,
  FileCheck,
  AlertTriangle
} from 'lucide-react';
import { Student, Branch, PlacementStatus } from '../../types';
import { Modal } from '../common/Modal';

export const StudentsView: React.FC = () => {
  const { 
    students, 
    addStudent, 
    updateStudent, 
    deleteStudent, 
    applications, 
    interviews, 
    role, 
    activeStudentId, 
    setActiveStudentId,
    activeCompanyId,
    uploadResume,
    removeResume
  } = usePlacement();

  // Search & filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [minCgpa, setMinCgpa] = useState<number>(0);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);

  // Form state
  const [formData, setFormData] = useState<Omit<Student, 'id'>>({
    rollNo: '',
    name: '',
    email: '',
    phone: '',
    branch: 'Computer Science',
    batch: '2025',
    cgpa: 8.0,
    backlogs: 0,
    skills: ['React', 'Node.js'],
    placementStatus: 'Unplaced',
    gender: 'Male',
  });
  const [skillInput, setSkillInput] = useState('');

  // Filtered students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch = 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.skills.some((sk) => sk.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesBranch = selectedBranch === 'All' || s.branch === selectedBranch;
      const matchesStatus = selectedStatus === 'All' || s.placementStatus === selectedStatus;
      const matchesCgpa = s.cgpa >= minCgpa;

      return matchesSearch && matchesBranch && matchesStatus && matchesCgpa;
    });
  }, [students, searchQuery, selectedBranch, selectedStatus, minCgpa]);

  const openAddModal = () => {
    setFormData({
      rollNo: `21CS${Math.floor(100 + Math.random() * 900)}`,
      name: '',
      email: '',
      phone: '+91 98112 ',
      branch: 'Computer Science',
      batch: '2025',
      cgpa: 8.2,
      backlogs: 0,
      skills: ['Python', 'SQL'],
      placementStatus: 'Unplaced',
      gender: 'Male',
    });
    setSkillInput('');
    setIsAddModalOpen(true);
  };

  const openEditModal = (student: Student) => {
    setEditingStudent(student);
    setFormData({ ...student });
    setSkillInput('');
  };

  const handleAddSkill = () => {
    if (!skillInput.trim()) return;
    if (!formData.skills.includes(skillInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingStudent) {
      updateStudent(editingStudent.id, formData);
      setEditingStudent(null);
    } else {
      addStudent(formData);
      setIsAddModalOpen(false);
    }
  };

  // Resume upload modal state
  const [resumeModalStudent, setResumeModalStudent] = useState<Student | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Form validation errors
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Helper for masking contact details for recruiters when candidate hasn't applied to their firm
  const maskPhone = (phone: string, isCandidateForCompany: boolean) => {
    if (role === 'admin' || role === 'student' || isCandidateForCompany) {
      return phone;
    }
    return phone.slice(0, 6) + ' *****';
  };

  const maskEmail = (email: string, isCandidateForCompany: boolean) => {
    if (role === 'admin' || role === 'student' || isCandidateForCompany) {
      return email;
    }
    const [user, domain] = email.split('@');
    return user.slice(0, 2) + '***@' + (domain || 'campus.edu');
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Student full name is required.';
    if (!formData.rollNo.trim()) errors.rollNo = 'University roll number is required.';
    if (!formData.email.trim() || !formData.email.includes('@')) errors.email = 'Valid institutional email is required.';
    if (formData.cgpa < 0 || formData.cgpa > 10) errors.cgpa = 'CGPA must be between 0.00 and 10.00.';
    if (formData.backlogs < 0) errors.backlogs = 'Backlogs cannot be negative.';
    if (!formData.batch.trim()) errors.batch = 'Graduation batch is required (e.g. 2025).';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return (
    <div className="space-y-6">
      {/* View Header with Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Student Directory
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Displaying {filteredStudents.length} of {students.length} registered final-year students
          </p>
        </div>

        {role === 'admin' && (
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors shadow-xs shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Register Student</span>
          </button>
        )}
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name, roll number, or skill (e.g. Go, Python)..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Branch Filter */}
          <div className="relative">
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
            >
              <option value="All">All Engineering Branches</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electronics & Comm">Electronics & Comm</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Electrical">Electrical</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-3 text-slate-400 pointer-events-none" />
          </div>

          {/* Placement Status Filter */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
            >
              <option value="All">All Placement Statuses</option>
              <option value="Placed">Placed</option>
              <option value="In Process">In Process</option>
              <option value="Unplaced">Unplaced</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-3 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* CGPA Range slider filter */}
        <div className="flex items-center gap-4 pt-2 border-t border-slate-100 text-xs text-slate-600">
          <span className="font-medium shrink-0">Min CGPA Cutoff:</span>
          <input
            type="range"
            min="0"
            max="9.5"
            step="0.5"
            value={minCgpa}
            onChange={(e) => setMinCgpa(parseFloat(e.target.value))}
            className="w-36 accent-blue-600"
          />
          <span className="font-mono tabular-nums font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
            {minCgpa > 0 ? `≥ ${minCgpa}` : 'Any CGPA'}
          </span>

          {(selectedBranch !== 'All' || selectedStatus !== 'All' || minCgpa > 0 || searchQuery) && (
            <button
              onClick={() => {
                setSelectedBranch('All');
                setSelectedStatus('All');
                setMinCgpa(0);
                setSearchQuery('');
              }}
              className="text-blue-600 hover:text-blue-800 ml-auto font-medium"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* High Density Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Roll No</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Branch</th>
                <th className="py-3 px-4 text-center">CGPA</th>
                <th className="py-3 px-4 text-center">Backlogs</th>
                <th className="py-3 px-4">Resume</th>
                <th className="py-3 px-4">Skills</th>
                <th className="py-3 px-4">Status & Placement</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <p className="font-medium text-slate-600">No students match the selected criteria.</p>
                    <p className="text-xs text-slate-400 mt-1">Try resetting the department or CGPA filters.</p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const isCandidate = applications.some(
                    (a) => a.studentId === student.id && a.companyId === activeCompanyId
                  );
                  const displayEmail = maskEmail(student.email, isCandidate);

                  return (
                    <tr 
                      key={student.id} 
                      className={`hover:bg-slate-50/70 transition-colors ${
                        activeStudentId === student.id ? 'bg-blue-50/40' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-mono font-semibold text-slate-900 whitespace-nowrap">
                        {student.rollNo}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-900 whitespace-nowrap">
                          {student.name}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-xs flex items-center gap-1">
                          {role === 'recruiter' && !isCandidate && (
                            <span title="Contact masked until student applies">
                              <Shield className="w-3 h-3 text-slate-400 shrink-0" />
                            </span>
                          )}
                          <span>{displayEmail}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-800 whitespace-nowrap">
                        {student.branch}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold tabular-nums text-slate-900">
                        {student.cgpa.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-center font-mono tabular-nums">
                        {student.backlogs === 0 ? (
                          <span className="text-emerald-700 font-semibold">0</span>
                        ) : (
                          <span className="text-rose-600 font-semibold bg-rose-50 px-1.5 py-0.5 rounded">
                            {student.backlogs}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {student.resumeFileName ? (
                          <button
                            onClick={() => setResumeModalStudent(student)}
                            className="inline-flex items-center gap-1.5 px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-md text-[11px] font-medium transition-colors"
                            title={`Uploaded: ${student.resumeUploadDate || 'Recently'}`}
                          >
                            <FileCheck className="w-3 h-3 text-blue-600" />
                            <span className="truncate max-w-[85px]">{student.resumeFileName}</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => setResumeModalStudent(student)}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md text-[11px] font-medium transition-colors"
                          >
                            <Upload className="w-3 h-3 text-slate-400" />
                            <span>Upload</span>
                          </button>
                        )}
                      </td>
                      <td className="py-3 px-4 max-w-xs">
                        <div className="flex flex-wrap gap-1">
                          {student.skills.slice(0, 3).map((sk) => (
                            <span 
                              key={sk} 
                              className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-medium"
                            >
                              {sk}
                            </span>
                          ))}
                          {student.skills.length > 3 && (
                            <span className="text-[10px] text-slate-400">
                              +{student.skills.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {student.placementStatus === 'Placed' ? (
                          <div>
                            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded inline-block">
                              Placed · ₹{student.packageLpa} LPA
                            </span>
                            <div className="text-[10px] text-slate-500 mt-0.5 truncate max-w-[150px]">
                              {student.placedCompanyName}
                            </div>
                          </div>
                        ) : student.placementStatus === 'In Process' ? (
                          <span className="text-[11px] font-semibold text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded inline-block">
                            In Process
                          </span>
                        ) : (
                          <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded inline-block">
                            Unplaced
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setViewingStudent(student)}
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"
                            title="View student profile & applications"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {role === 'admin' && (
                            <>
                              <button
                                onClick={() => openEditModal(student)}
                                className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                                title="Edit student record"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm(`Delete record for ${student.name} (${student.rollNo})?`)) {
                                    deleteStudent(student.id);
                                  }
                                }}
                                className="p-1.5 text-slate-400 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors"
                                title="Delete student"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Student Modal */}
      <Modal
        isOpen={isAddModalOpen || editingStudent !== null}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingStudent(null);
        }}
        title={editingStudent ? `Edit Student — ${editingStudent.name}` : 'Register New Student'}
        subtitle="Manage student academic credentials, contact info, and placement status."
        maxWidth="2xl"
      >
        <form onSubmit={handleSaveStudent} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (formErrors.name) setFormErrors({ ...formErrors, name: '' });
                }}
                placeholder="e.g. Rohan Sharma"
                className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 ${
                  formErrors.name ? 'border-rose-400 focus:ring-rose-400 bg-rose-50/20' : 'border-slate-200 focus:ring-blue-500'
                }`}
              />
              {formErrors.name && <p className="text-[11px] text-rose-600 mt-1">{formErrors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                University Roll No *
              </label>
              <input
                type="text"
                required
                value={formData.rollNo}
                onChange={(e) => {
                  setFormData({ ...formData, rollNo: e.target.value });
                  if (formErrors.rollNo) setFormErrors({ ...formErrors, rollNo: '' });
                }}
                placeholder="e.g. 21CS142"
                className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 font-mono ${
                  formErrors.rollNo ? 'border-rose-400 focus:ring-rose-400 bg-rose-50/20' : 'border-slate-200 focus:ring-blue-500'
                }`}
              />
              {formErrors.rollNo && <p className="text-[11px] text-rose-600 mt-1">{formErrors.rollNo}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Institutional Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (formErrors.email) setFormErrors({ ...formErrors, email: '' });
                }}
                placeholder="student@campus.edu"
                className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 ${
                  formErrors.email ? 'border-rose-400 focus:ring-rose-400 bg-rose-50/20' : 'border-slate-200 focus:ring-blue-500'
                }`}
              />
              {formErrors.email && <p className="text-[11px] text-rose-600 mt-1">{formErrors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98112 00000"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Branch of Study
              </label>
              <select
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value as Branch })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics & Comm">Electronics & Comm</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Electrical">Electrical</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Graduation Batch *
              </label>
              <input
                type="text"
                required
                value={formData.batch}
                onChange={(e) => {
                  setFormData({ ...formData, batch: e.target.value });
                  if (formErrors.batch) setFormErrors({ ...formErrors, batch: '' });
                }}
                placeholder="2025"
                className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 ${
                  formErrors.batch ? 'border-rose-400 focus:ring-rose-400 bg-rose-50/20' : 'border-slate-200 focus:ring-blue-500'
                }`}
              />
              {formErrors.batch && <p className="text-[11px] text-rose-600 mt-1">{formErrors.batch}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                CGPA (0.00 to 10.00) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                required
                value={formData.cgpa}
                onChange={(e) => {
                  setFormData({ ...formData, cgpa: parseFloat(e.target.value) || 0 });
                  if (formErrors.cgpa) setFormErrors({ ...formErrors, cgpa: '' });
                }}
                className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 font-mono ${
                  formErrors.cgpa ? 'border-rose-400 focus:ring-rose-400 bg-rose-50/20' : 'border-slate-200 focus:ring-blue-500'
                }`}
              />
              {formErrors.cgpa && <p className="text-[11px] text-rose-600 mt-1">{formErrors.cgpa}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Active Backlogs *
              </label>
              <input
                type="number"
                min="0"
                max="10"
                required
                value={formData.backlogs}
                onChange={(e) => {
                  setFormData({ ...formData, backlogs: parseInt(e.target.value) || 0 });
                  if (formErrors.backlogs) setFormErrors({ ...formErrors, backlogs: '' });
                }}
                className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 font-mono ${
                  formErrors.backlogs ? 'border-rose-400 focus:ring-rose-400 bg-rose-50/20' : 'border-slate-200 focus:ring-blue-500'
                }`}
              />
              {formErrors.backlogs && <p className="text-[11px] text-rose-600 mt-1">{formErrors.backlogs}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Placement Status
              </label>
              <select
                value={formData.placementStatus}
                onChange={(e) => setFormData({ ...formData, placementStatus: e.target.value as PlacementStatus })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="Unplaced">Unplaced</option>
                <option value="In Process">In Process</option>
                <option value="Placed">Placed</option>
              </select>
            </div>

            {formData.placementStatus === 'Placed' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Package CTC (LPA)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.packageLpa || 15}
                  onChange={(e) => setFormData({ ...formData, packageLpa: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                />
              </div>
            )}
          </div>

          {/* Skills Builder */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Technical Skills & Proficiencies
            </label>
            <div className="flex gap-2">
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
                placeholder="Type skill name and press Add..."
                className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition-colors"
              >
                Add Skill
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {formData.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-800 px-2 py-1 rounded-md"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-slate-400 hover:text-slate-700 font-bold ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingStudent(null);
              }}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-xs"
            >
              {editingStudent ? 'Save Changes' : 'Register Student'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Student Profile Drawer / Detail Modal */}
      {viewingStudent && (
        <Modal
          isOpen={true}
          onClose={() => setViewingStudent(null)}
          title={viewingStudent.name}
          subtitle={`Roll No: ${viewingStudent.rollNo} · ${viewingStudent.branch}`}
          maxWidth="2xl"
        >
          <div className="space-y-5">
            {/* Academic Credentials Box */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">CGPA</span>
                <span className="text-lg font-bold font-mono text-slate-900 tabular-nums">
                  {viewingStudent.cgpa.toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Backlogs</span>
                <span className="text-lg font-bold font-mono text-slate-900 tabular-nums">
                  {viewingStudent.backlogs}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Batch</span>
                <span className="text-base font-semibold text-slate-900">
                  {viewingStudent.batch}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Placement</span>
                <span className={`text-xs font-bold inline-block mt-1 px-2 py-0.5 rounded ${
                  viewingStudent.placementStatus === 'Placed'
                    ? 'bg-emerald-100 text-emerald-800'
                    : viewingStudent.placementStatus === 'In Process'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-slate-200 text-slate-700'
                }`}>
                  {viewingStudent.placementStatus}
                </span>
              </div>
            </div>

            {/* Placed offer banner if placed */}
            {viewingStudent.placementStatus === 'Placed' && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950 text-xs flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm">Placed at {viewingStudent.placedCompanyName}</h4>
                  <p className="text-emerald-800 mt-0.5">{viewingStudent.placedJobTitle}</p>
                </div>
                <div className="text-right">
                  <span className="text-base font-bold font-mono tabular-nums text-emerald-700">
                    ₹{viewingStudent.packageLpa} LPA
                  </span>
                  <span className="block text-[10px] text-emerald-600 font-medium">Annual CTC</span>
                </div>
              </div>
            )}

            {/* Skills */}
            <div>
              <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2">
                Declared Technical Skills
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {viewingStudent.skills.map((sk) => (
                  <span key={sk} className="text-xs bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md font-medium">
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Resume & Credentials Section */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Curriculum Vitae / Resume
                  </h4>
                </div>
                {viewingStudent.resumeFileName && (
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
                    Verified ATS Format
                  </span>
                )}
              </div>

              {viewingStudent.resumeFileName ? (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-lg border border-slate-200">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-900 truncate">
                      {viewingStudent.resumeFileName}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Size: {viewingStudent.resumeFileSize || '240 KB'} · Uploaded: {viewingStudent.resumeUploadDate || '2025-09-15'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        const blob = new Blob([
                          `CURRICULUM VITAE\n\nName: ${viewingStudent.name}\nRoll No: ${viewingStudent.rollNo}\nBranch: ${viewingStudent.branch}\nBatch: ${viewingStudent.batch}\nCGPA: ${viewingStudent.cgpa}\nSkills: ${viewingStudent.skills.join(', ')}\n\n(Generated via Campus Connect Portal)`
                        ], { type: 'text/plain;charset=utf-8;' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = viewingStudent.resumeFileName || `${viewingStudent.name}_Resume.txt`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </button>
                    {(role === 'admin' || (role === 'student' && activeStudentId === viewingStudent.id)) && (
                      <button
                        onClick={() => removeResume(viewingStudent.id)}
                        className="px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 bg-white rounded-lg border border-dashed border-slate-300">
                  <p className="text-xs text-slate-500 font-medium">No verified resume document currently on file.</p>
                  <button
                    onClick={() => {
                      setResumeModalStudent(viewingStudent);
                    }}
                    className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Upload Candidate Resume
                  </button>
                </div>
              )}
            </div>

            {/* Contact details */}
            <div className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-100">
              {(() => {
                const isCandidate = applications.some(
                  (a) => a.studentId === viewingStudent.id && a.companyId === activeCompanyId
                );
                return (
                  <>
                    <p className="flex items-center gap-1.5">
                      <span>Email:</span>
                      <strong className="text-slate-800">{maskEmail(viewingStudent.email, isCandidate)}</strong>
                      {role === 'recruiter' && !isCandidate && (
                        <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                          Protected Candidate
                        </span>
                      )}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <span>Phone:</span>
                      <strong className="text-slate-800">{maskPhone(viewingStudent.phone, isCandidate)}</strong>
                    </p>
                    {viewingStudent.linkedIn && (
                      <p>LinkedIn: <span className="text-blue-600 font-mono">{viewingStudent.linkedIn}</span></p>
                    )}
                  </>
                );
              })()}
            </div>

            {/* Application history */}
            <div className="pt-2 border-t border-slate-100">
              <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2">
                Recruitment Applications ({applications.filter(a => a.studentId === viewingStudent.id).length})
              </h4>
              <div className="space-y-2">
                {applications
                  .filter((a) => a.studentId === viewingStudent.id)
                  .map((app) => (
                    <div key={app.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-slate-900">{app.companyName}</div>
                        <div className="text-slate-500 text-[11px]">{app.jobTitle}</div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-200 text-slate-800">
                        {app.status}
                      </span>
                    </div>
                  ))}
                {applications.filter(a => a.studentId === viewingStudent.id).length === 0 && (
                  <p className="text-xs text-slate-400 italic">No applications filed yet.</p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewingStudent(null)}
                className="px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Resume Upload Modal Interface */}
      {resumeModalStudent && (
        <Modal
          isOpen={true}
          onClose={() => {
            setResumeModalStudent(null);
            setSelectedFile(null);
          }}
          title={`Resume Management — ${resumeModalStudent.name}`}
          subtitle={`Roll No: ${resumeModalStudent.rollNo} · Upload and verify candidate CV`}
          maxWidth="md"
        >
          <div className="space-y-4">
            <div className="p-4 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/60 text-center hover:bg-slate-50 transition-colors">
              <Upload className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-800">Select or drop resume document</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Supports PDF, DOCX, DOC files up to 5 MB</p>

              <label className="mt-3 inline-block px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-100 rounded-lg cursor-pointer text-slate-800 shadow-2xs">
                Browse Files
                <input
                  type="file"
                  accept=".pdf,.docx,.doc,.txt"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (file.size > 5 * 1024 * 1024) {
                        alert('File exceeds 5MB limit. Please choose a smaller document.');
                        return;
                      }
                      setSelectedFile(file);
                    }
                  }}
                />
              </label>

              {selectedFile && (
                <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 font-medium flex items-center justify-between">
                  <span className="truncate">{selectedFile.name}</span>
                  <span className="text-[11px] font-mono shrink-0 ml-2">
                    {(selectedFile.size / 1024).toFixed(0)} KB
                  </span>
                </div>
              )}
            </div>

            {/* Quick 1-Click ATS Demo Generator */}
            <div className="p-3 bg-slate-100/70 rounded-lg border border-slate-200 text-xs">
              <span className="font-semibold text-slate-800 block">Quick Demo Tool:</span>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Generate and attach a standardized ATS-compliant PDF mock profile immediately.
              </p>
              <button
                type="button"
                onClick={() => {
                  const demoName = `${resumeModalStudent.name.replace(/\s+/g, '_')}_Resume_2025.pdf`;
                  uploadResume(resumeModalStudent.id, demoName, '320 KB');
                  setResumeModalStudent(null);
                }}
                className="mt-2 text-xs font-semibold text-blue-700 hover:text-blue-900 underline underline-offset-2"
              >
                + Generate & Attach Verified Resume
              </button>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setResumeModalStudent(null);
                  setSelectedFile(null);
                }}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              {selectedFile && (
                <button
                  type="button"
                  onClick={() => {
                    const sizeStr = `${(selectedFile.size / 1024).toFixed(0)} KB`;
                    uploadResume(resumeModalStudent.id, selectedFile.name, sizeStr);
                    setResumeModalStudent(null);
                    setSelectedFile(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs"
                >
                  Confirm Upload
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
