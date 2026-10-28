import React, { useState } from 'react';
import { usePlacement } from '../../context/PlacementContext';
import { 
  Building2, 
  MapPin, 
  Mail, 
  Phone, 
  Calendar, 
  Users, 
  Briefcase, 
  ExternalLink, 
  Plus, 
  Edit2, 
  Trash2,
  Eye,
  ArrowUpRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { Company } from '../../types';
import { Modal } from '../common/Modal';

export const CompaniesView: React.FC = () => {
  const { companies, jobs, addCompany, updateCompany, deleteCompany, setActiveTab, role } = usePlacement();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [viewingCompany, setViewingCompany] = useState<Company | null>(null);

  const [formData, setFormData] = useState<Omit<Company, 'id' | 'totalHired'>>({
    name: '',
    industry: '',
    tier: 'Tier 1',
    website: 'https://',
    headquarters: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    hiringQuota: 10,
    visitDate: '2025-11-25',
    status: 'Upcoming',
    about: '',
    logoInitial: 'CP',
    color: '#1e3a8a',
  });

  const openAddModal = () => {
    setFormData({
      name: '',
      industry: 'Enterprise Software & Cloud',
      tier: 'Tier 1',
      website: 'https://example.com',
      headquarters: 'Bengaluru / Hyderabad',
      contactPerson: '',
      contactEmail: '',
      contactPhone: '+91 ',
      hiringQuota: 10,
      visitDate: '2025-11-28',
      status: 'Upcoming',
      about: '',
      logoInitial: 'CC',
      color: '#1e3a8a',
    });
    setIsAddModalOpen(true);
  };

  const openEditModal = (comp: Company) => {
    setEditingCompany(comp);
    setFormData({
      name: comp.name,
      industry: comp.industry,
      tier: comp.tier,
      website: comp.website,
      headquarters: comp.headquarters,
      contactPerson: comp.contactPerson,
      contactEmail: comp.contactEmail,
      contactPhone: comp.contactPhone,
      hiringQuota: comp.hiringQuota,
      visitDate: comp.visitDate,
      status: comp.status,
      about: comp.about,
      logoInitial: comp.logoInitial,
      color: comp.color,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingCompany) {
      updateCompany(editingCompany.id, formData);
      setEditingCompany(null);
    } else {
      addCompany({
        ...formData,
        logoInitial: formData.name.substring(0, 2).toUpperCase(),
      });
      setIsAddModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Corporate Recruitment Partners
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Empanelled organizations visiting campus for recruitment drives
          </p>
        </div>

        {role === 'admin' && (
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors shadow-xs shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Partner Company</span>
          </button>
        )}
      </div>

      {/* Company Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {companies.map((company) => {
          const companyJobList = jobs.filter((j) => j.companyId === company.id);
          const totalOpenings = companyJobList.reduce((sum, j) => sum + j.openings, 0);

          return (
            <div
              key={company.id}
              className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between overflow-hidden hover:border-slate-300 transition-all"
            >
              {/* Header block */}
              <div className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-xl text-white font-bold text-base flex items-center justify-center shadow-xs"
                      style={{ backgroundColor: company.color || '#1e3a8a' }}
                    >
                      {company.logoInitial}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 leading-tight">
                        {company.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {company.industry}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider ${
                    company.tier === 'Tier 1'
                      ? 'bg-amber-50 text-amber-900 border border-amber-200'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {company.tier}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-4 line-clamp-3 leading-relaxed">
                  {company.about}
                </p>

                {/* Key Metrics Strip */}
                <div className="grid grid-cols-3 gap-2 mt-5 p-3 bg-slate-50 rounded-lg border border-slate-100 text-center text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Quota</span>
                    <span className="font-mono font-bold text-slate-900 tabular-nums">
                      {company.hiringQuota}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Hired</span>
                    <span className="font-mono font-bold text-emerald-700 tabular-nums">
                      {company.totalHired}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Open Roles</span>
                    <span className="font-mono font-bold text-blue-700 tabular-nums">
                      {companyJobList.length}
                    </span>
                  </div>
                </div>

                {/* Logistics Info */}
                <div className="mt-5 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Drive Date: <strong className="text-slate-900 tabular-nums">{company.visitDate}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{company.headquarters}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">Contact: {company.contactPerson} ({company.contactEmail})</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewingCompany(company)}
                    className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>View Profile</span>
                  </button>
                  <span className="text-slate-300">·</span>
                  <button
                    onClick={() => setActiveTab('jobs')}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    {companyJobList.length} Roles <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {role === 'admin' && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(company)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded transition-colors"
                      title="Edit company profile"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to remove "${company.name}" and all associated jobs/interviews?`)) {
                          deleteCompany(company.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                      title="Delete partner company"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Company Modal */}
      <Modal
        isOpen={isAddModalOpen || editingCompany !== null}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingCompany(null);
        }}
        title={editingCompany ? `Edit Company — ${editingCompany.name}` : 'Register Recruiting Company'}
        subtitle="Configure organization credentials, recruitment drive schedules, and hiring targets."
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Company Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. NexaTech Systems"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Industry Domain *
              </label>
              <input
                type="text"
                required
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                placeholder="Enterprise Cloud & AI Software"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Recruitment Tier
              </label>
              <select
                value={formData.tier}
                onChange={(e) => setFormData({ ...formData, tier: e.target.value as any })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="Tier 1">Tier 1 (Dream / Super Dream)</option>
                <option value="Tier 2">Tier 2 (Core Corporate)</option>
                <option value="Tier 3">Tier 3 (Mass Recruiters)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Hiring Quota (Target Headcount)
              </label>
              <input
                type="number"
                min="1"
                value={formData.hiringQuota}
                onChange={(e) => setFormData({ ...formData, hiringQuota: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Campus Drive Visit Date
              </label>
              <input
                type="date"
                value={formData.visitDate}
                onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Drive Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                HR Contact Person
              </label>
              <input
                type="text"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                placeholder="Priya Deshmukh"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                HR Email
              </label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                placeholder="recruitment@company.example.com"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Headquarters / Office Locations
              </label>
              <input
                type="text"
                value={formData.headquarters}
                onChange={(e) => setFormData({ ...formData, headquarters: e.target.value })}
                placeholder="Bengaluru & Seattle"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Corporate Website
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://company.example.com"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              About the Organization
            </label>
            <textarea
              rows={3}
              value={formData.about}
              onChange={(e) => setFormData({ ...formData, about: e.target.value })}
              placeholder="Describe company operations, product focus, and culture..."
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 leading-relaxed"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingCompany(null);
              }}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-xs"
            >
              {editingCompany ? 'Save Changes' : 'Register Partner'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Viewing Company Details Modal */}
      {viewingCompany && (
        <Modal
          isOpen={true}
          onClose={() => setViewingCompany(null)}
          title={viewingCompany.name}
          subtitle={`${viewingCompany.tier} Corporate Partner · ${viewingCompany.industry}`}
          maxWidth="2xl"
        >
          <div className="space-y-5">
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-center">
              <div>
                <span className="text-slate-400 block text-[10px] font-semibold uppercase">Hiring Quota</span>
                <span className="text-lg font-bold font-mono text-slate-900 tabular-nums">{viewingCompany.hiringQuota}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-semibold uppercase">Hired So Far</span>
                <span className="text-lg font-bold font-mono text-emerald-700 tabular-nums">{viewingCompany.totalHired}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-semibold uppercase">Campus Visit</span>
                <span className="text-xs font-bold text-slate-900 mt-1 block">{viewingCompany.visitDate}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-semibold uppercase">Drive Status</span>
                <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                  {viewingCompany.status}
                </span>
              </div>
            </div>

            {/* About */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                About the Organization
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                {viewingCompany.about}
              </p>
            </div>

            {/* Logistics & Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 pt-2 border-t border-slate-100">
              <div className="space-y-1.5">
                <p>Lead Recruiter: <strong className="text-slate-900">{viewingCompany.contactPerson}</strong></p>
                <p>Email: <strong className="text-slate-900">{viewingCompany.contactEmail}</strong></p>
                <p>Direct Phone: <strong className="text-slate-900">{viewingCompany.contactPhone}</strong></p>
              </div>
              <div className="space-y-1.5">
                <p>Headquarters: <strong className="text-slate-900">{viewingCompany.headquarters}</strong></p>
                <p>Website: <a href={viewingCompany.website} target="_blank" rel="noreferrer" className="text-blue-600 underline font-medium">{viewingCompany.website}</a></p>
              </div>
            </div>

            {/* Active Open Roles */}
            <div className="pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Active Job Openings ({jobs.filter(j => j.companyId === viewingCompany.id).length})
              </h4>
              <div className="space-y-2">
                {jobs.filter(j => j.companyId === viewingCompany.id).map(job => (
                  <div key={job.id} className="p-3 bg-white border border-slate-200 rounded-lg text-xs flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900">{job.title}</p>
                      <p className="text-[11px] text-slate-500">{job.department} · Min CGPA: {job.minCgpa}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-emerald-700">₹{job.ctcLpa} LPA</span>
                      <span className="block text-[10px] text-slate-400">{job.openings} openings</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setViewingCompany(null)}
                className="px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
