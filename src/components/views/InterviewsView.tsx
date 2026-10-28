import React, { useState, useMemo } from 'react';
import { usePlacement } from '../../context/PlacementContext';
import { 
  CalendarClock, 
  Plus, 
  MapPin, 
  Video, 
  CheckCircle, 
  Clock, 
  User, 
  Briefcase, 
  Edit2, 
  MessageSquare,
  Search,
  ChevronDown,
  Trash2,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import { Interview } from '../../types';
import { Modal } from '../common/Modal';

export const InterviewsView: React.FC = () => {
  const { 
    interviews, 
    applications, 
    students, 
    jobs, 
    companies, 
    scheduleInterview, 
    updateInterview, 
    deleteInterview,
    role, 
    activeStudentId, 
    activeCompanyId 
  } = usePlacement();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Modal state
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [editingInterview, setEditingInterview] = useState<Interview | null>(null);
  const [feedbackModalInterview, setFeedbackModalInterview] = useState<Interview | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackOutcome, setFeedbackOutcome] = useState<'Completed' | 'Shortlisted' | 'Rejected'>('Completed');

  const [formData, setFormData] = useState<Omit<Interview, 'id'>>({
    applicationId: '',
    studentId: students[0]?.id || '',
    studentName: students[0]?.name || '',
    studentRollNo: students[0]?.rollNo || '',
    companyId: companies[0]?.id || '',
    companyName: companies[0]?.name || '',
    jobId: jobs[0]?.id || '',
    jobTitle: jobs[0]?.title || '',
    roundTitle: 'Round 1: Technical & DSA',
    date: '2025-11-15',
    time: '11:00 AM',
    mode: 'Campus Room 301',
    meetingLink: '',
    panelist: 'Senior Technical Lead',
    status: 'Scheduled',
    feedback: '',
  });

  const filteredInterviews = useMemo(() => {
    return interviews.filter((item) => {
      if (role === 'student' && item.studentId !== activeStudentId) {
        return false;
      }
      if (role === 'recruiter' && item.companyId !== activeCompanyId) {
        return false;
      }

      const matchesSearch =
        item.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.studentRollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.roundTitle.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [interviews, searchQuery, statusFilter, role, activeStudentId, activeCompanyId]);

  const openScheduleModal = () => {
    setEditingInterview(null);
    const student = students[0];
    const job = jobs[0];
    const comp = companies.find((c) => c.id === job.companyId) || companies[0];

    setFormData({
      applicationId: '',
      studentId: student?.id || '',
      studentName: student?.name || '',
      studentRollNo: student?.rollNo || '',
      companyId: comp?.id || '',
      companyName: comp?.name || '',
      jobId: job?.id || '',
      jobTitle: job?.title || '',
      roundTitle: 'Round 1: Core Technical & DSA',
      date: '2025-11-16',
      time: '10:30 AM',
      mode: 'Campus Room 301',
      meetingLink: '',
      panelist: 'Engineering Evaluation Lead',
      status: 'Scheduled',
      feedback: '',
    });
    setIsScheduleModalOpen(true);
  };

  const openEditModal = (interview: Interview) => {
    setEditingInterview(interview);
    setFormData({
      applicationId: interview.applicationId,
      studentId: interview.studentId,
      studentName: interview.studentName,
      studentRollNo: interview.studentRollNo,
      companyId: interview.companyId,
      companyName: interview.companyName,
      jobId: interview.jobId,
      jobTitle: interview.jobTitle,
      roundTitle: interview.roundTitle,
      date: interview.date,
      time: interview.time,
      mode: interview.mode,
      meetingLink: interview.meetingLink || '',
      panelist: interview.panelist,
      status: interview.status,
      feedback: interview.feedback || '',
    });
    setIsScheduleModalOpen(true);
  };

  const handleDeleteInterview = (interview: Interview) => {
    if (window.confirm(`Are you sure you want to cancel and remove this interview session with ${interview.studentName}?`)) {
      deleteInterview(interview.id);
    }
  };

  const handleStudentSelect = (studentId: string) => {
    const st = students.find((s) => s.id === studentId);
    if (!st) return;
    setFormData((prev) => ({
      ...prev,
      studentId: st.id,
      studentName: st.name,
      studentRollNo: st.rollNo,
    }));
  };

  const handleJobSelect = (jobId: string) => {
    const j = jobs.find((jb) => jb.id === jobId);
    if (!j) return;
    const comp = companies.find((c) => c.id === j.companyId);
    setFormData((prev) => ({
      ...prev,
      jobId: j.id,
      jobTitle: j.title,
      companyId: j.companyId,
      companyName: comp ? comp.name : j.companyName,
    }));
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingInterview) {
      updateInterview(editingInterview.id, formData);
      setEditingInterview(null);
    } else {
      scheduleInterview(formData);
    }
    setIsScheduleModalOpen(false);
  };

  const openFeedbackModal = (interview: Interview) => {
    setFeedbackModalInterview(interview);
    setFeedbackText(interview.feedback || '');
    setFeedbackOutcome('Completed');
  };

  const handleSaveFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackModalInterview) return;

    updateInterview(feedbackModalInterview.id, {
      feedback: feedbackText,
      status: feedbackOutcome,
    });
    setFeedbackModalInterview(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Interview Schedules & Evaluation
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage interview panels, technical evaluation rounds, and venue allocations
          </p>
        </div>

        {(role === 'admin' || role === 'recruiter') && (
          <button
            onClick={openScheduleModal}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors shadow-xs shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule New Interview</span>
          </button>
        )}
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidate, company, or panelist..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
          <span className="text-slate-500 font-medium">Status Filter:</span>
          <button
            onClick={() => setStatusFilter('All')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              statusFilter === 'All' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            All ({interviews.length})
          </button>
          <button
            onClick={() => setStatusFilter('Scheduled')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              statusFilter === 'Scheduled' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setStatusFilter('Completed')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              statusFilter === 'Completed' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Interview Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredInterviews.map((item) => {
          const isOnline = item.mode.includes('Online');

          return (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
                      {item.companyName}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                      {item.roundTitle}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {item.jobTitle}
                    </p>
                  </div>

                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider ${
                    item.status === 'Scheduled'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : item.status === 'Completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {item.status}
                  </span>
                </div>

                {/* Candidate Info Box */}
                <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">Candidate:</span>
                    <span className="font-semibold text-slate-900">{item.studentName}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-slate-400 font-medium">Roll No:</span>
                    <span className="font-mono text-slate-700">{item.studentRollNo}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-slate-400 font-medium">Lead Panelist:</span>
                    <span className="text-slate-800 font-medium truncate max-w-[150px]">{item.panelist}</span>
                  </div>
                </div>

                {/* Logistics */}
                <div className="mt-4 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <CalendarClock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span><strong className="text-slate-900">{item.date}</strong> at <strong className="text-slate-900">{item.time}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    {isOnline ? (
                      <Video className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    ) : (
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    )}
                    <span className="truncate">{item.mode}</span>
                  </div>

                  {item.meetingLink && (
                    <div className="text-[11px] text-blue-600 truncate font-mono">
                      Link: {item.meetingLink}
                    </div>
                  )}

                  {item.feedback && (
                    <div className="mt-2 p-2.5 bg-slate-100/70 rounded-md text-[11px] text-slate-700 italic border border-slate-200/50">
                      "{item.feedback}"
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              {(role === 'admin' || role === 'recruiter') && (
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openFeedbackModal(item)}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Feedback
                    </button>
                    <button
                      onClick={() => openEditModal(item)}
                      className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                      title="Edit interview details"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={item.status}
                      onChange={(e) => updateInterview(item.id, { status: e.target.value as any })}
                      className="text-xs bg-slate-50 border border-slate-200 rounded py-1 px-2 text-slate-800 font-medium"
                    >
                      <option value="Scheduled">Scheduled</option>
                      <option value="Completed">Completed</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Rescheduled">Rescheduled</option>
                    </select>

                    <button
                      onClick={() => handleDeleteInterview(item)}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                      title="Cancel and remove interview"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredInterviews.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
          <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-900">No Interview Rounds Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            {searchQuery || statusFilter !== 'All'
              ? 'No interviews match your active search and filter criteria.'
              : 'No interviews have been scheduled yet for this role or company.'}
          </p>
          {(role === 'admin' || role === 'recruiter') && (
            <button
              onClick={openScheduleModal}
              className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Schedule Interview Now
            </button>
          )}
        </div>
      )}

      {/* Schedule / Edit Interview Modal */}
      <Modal
        isOpen={isScheduleModalOpen}
        onClose={() => {
          setIsScheduleModalOpen(false);
          setEditingInterview(null);
        }}
        title={editingInterview ? `Edit Interview Schedule — ${editingInterview.studentName}` : 'Schedule Recruitment Interview'}
        subtitle={editingInterview ? 'Update round title, evaluator panelist, date/time, and room venue.' : 'Book interview time slot, assign evaluator panelist, and designate meeting room.'}
        maxWidth="2xl"
      >
        <form onSubmit={handleScheduleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Candidate to Interview *
              </label>
              <select
                value={formData.studentId}
                onChange={(e) => handleStudentSelect(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.rollNo} · {s.branch})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Job Position *
              </label>
              <select
                value={formData.jobId}
                onChange={(e) => handleJobSelect(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500"
              >
                {jobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.companyName} — {j.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Round Title / Format *
              </label>
              <input
                type="text"
                required
                value={formData.roundTitle}
                onChange={(e) => setFormData({ ...formData, roundTitle: e.target.value })}
                placeholder="e.g. Round 2: System Architecture"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Lead Evaluator / Panelist *
              </label>
              <input
                type="text"
                required
                value={formData.panelist}
                onChange={(e) => setFormData({ ...formData, panelist: e.target.value })}
                placeholder="Senior Architect / HR Lead"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Interview Date *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Time Slot *
              </label>
              <input
                type="text"
                required
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                placeholder="e.g. 11:30 AM - 12:30 PM"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Meeting Venue / Mode
              </label>
              <select
                value={formData.mode}
                onChange={(e) => setFormData({ ...formData, mode: e.target.value as any })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500"
              >
                <option value="Campus Room 301">Campus Room 301 (Academic Block)</option>
                <option value="Campus Room 302">Campus Room 302 (Placement Cell)</option>
                <option value="Auditorium A">Auditorium A</option>
                <option value="Online Meet">Online Meet (Google Meet / Zoom)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Virtual Meeting URL (If Online)
              </label>
              <input
                type="url"
                value={formData.meetingLink || ''}
                onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                placeholder="https://meet.google.com/xyz-abc"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsScheduleModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg shadow-xs"
            >
              {editingInterview ? 'Update Interview Schedule' : 'Confirm Schedule'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Feedback Modal */}
      {feedbackModalInterview && (
        <Modal
          isOpen={true}
          onClose={() => setFeedbackModalInterview(null)}
          title={`Log Feedback: ${feedbackModalInterview.studentName}`}
          subtitle={`${feedbackModalInterview.roundTitle} · ${feedbackModalInterview.companyName}`}
          maxWidth="md"
        >
          <form onSubmit={handleSaveFeedback} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Round Assessment Outcome
              </label>
              <select
                value={feedbackOutcome}
                onChange={(e) => setFeedbackOutcome(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
              >
                <option value="Completed">Completed (Pending Decision)</option>
                <option value="Shortlisted">Shortlisted for Next Round</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Panelist Feedback & Detailed Notes
              </label>
              <textarea
                rows={4}
                required
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Assess problem solving, coding elegance, design tradeoffs, communication..."
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 leading-relaxed"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setFeedbackModalInterview(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs"
              >
                Save Evaluation
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
