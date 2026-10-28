import React, { useState } from 'react';
import { usePlacement } from '../../context/PlacementContext';
import { 
  Award, 
  TrendingUp, 
  CheckCircle2, 
  FileText, 
  Download, 
  Building2, 
  GraduationCap, 
  Calendar,
  Sparkles
} from 'lucide-react';
import { OfferResult } from '../../types';
import { Modal } from '../common/Modal';

export const ResultsView: React.FC = () => {
  const { offers, students, companies, role, updateOfferOutcome } = usePlacement();

  const [selectedOfferLetter, setSelectedOfferLetter] = useState<OfferResult | null>(null);

  const totalOffers = offers.length;
  const acceptedOffers = offers.filter((o) => o.status === 'Accepted').length;
  const acceptanceRate = totalOffers > 0 ? Math.round((acceptedOffers / totalOffers) * 100) : 0;

  const totalPkg = offers.reduce((acc, o) => acc + o.ctcLpa, 0);
  const avgPkg = totalOffers > 0 ? (totalPkg / totalOffers).toFixed(2) : '0';
  const highestPkg = offers.reduce((max, o) => Math.max(max, o.ctcLpa), 0);

  // Group by company
  const companyOfferCounts = companies.map((c) => {
    const count = offers.filter((o) => o.companyId === c.id).length;
    return { name: c.name, count, color: c.color };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Official Placement Results & Offer Registry
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Verified corporate selection rolls and competitive compensation records for Batch 2025
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {acceptedOffers} Offers Accepted ({acceptanceRate}%)
          </span>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
            Total Offers Issued
          </span>
          <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-2 block">
            {totalOffers}
          </span>
          <span className="text-xs text-slate-500 mt-1 block">
            {acceptedOffers} Accepted · {totalOffers - acceptedOffers} Other
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
            Average Package
          </span>
          <span className="text-2xl font-bold font-mono tabular-nums text-blue-700 mt-2 block">
            ₹{avgPkg} LPA
          </span>
          <span className="text-xs text-slate-500 mt-1 block">
            Mean compensation
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
            Highest Package
          </span>
          <span className="text-2xl font-bold font-mono tabular-nums text-emerald-700 mt-2 block">
            ₹{highestPkg} LPA
          </span>
          <span className="text-xs text-slate-500 mt-1 block">
            Super Dream Tier 1
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
            Partner Recruitment
          </span>
          <div className="mt-2 flex items-center gap-2 text-xs font-medium text-slate-700">
            {companyOfferCounts.map((co) => (
              <span key={co.name} className="bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                {co.name.split(' ')[0]}: <strong className="tabular-nums font-mono">{co.count}</strong>
              </span>
            ))}
          </div>
          <span className="text-xs text-slate-500 mt-2 block">
            Across 3 visiting firms
          </span>
        </div>
      </div>

      {/* Official Placement Offers Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Placed Students Master Register
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Individual placement confirmation with verifiable compensation packages
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Offer ID</th>
                <th className="py-3 px-4">Candidate Name</th>
                <th className="py-3 px-4">Roll No</th>
                <th className="py-3 px-4">Branch</th>
                <th className="py-3 px-4">Recruiting Company</th>
                <th className="py-3 px-4">Designation</th>
                <th className="py-3 px-4 text-right">CTC Package</th>
                <th className="py-3 px-4">Offer Date</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Slip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {offers.map((offer) => {
                return (
                  <tr key={offer.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                      {offer.id}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">
                      {offer.studentName}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">
                      {offer.studentRollNo}
                    </td>
                    <td className="py-3 px-4 text-slate-800 whitespace-nowrap">
                      {offer.studentBranch}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900 whitespace-nowrap">
                      {offer.companyName}
                    </td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap truncate max-w-xs">
                      {offer.jobTitle}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold tabular-nums text-slate-900 whitespace-nowrap">
                      ₹{offer.ctcLpa.toFixed(1)} LPA
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums text-slate-500 whitespace-nowrap">
                      {offer.offerDate}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {role === 'admin' || role === 'recruiter' ? (
                        <select
                          value={offer.status}
                          onChange={(e) => updateOfferOutcome(offer.id, e.target.value as any)}
                          className={`text-[11px] font-semibold rounded px-2 py-0.5 border cursor-pointer ${
                            offer.status === 'Accepted'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : offer.status === 'Declined'
                              ? 'bg-rose-50 text-rose-800 border-rose-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          <option value="Accepted">Accepted</option>
                          <option value="Declined">Declined</option>
                          <option value="Pending Verification">Pending Verification</option>
                        </select>
                      ) : (
                        <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold ${
                          offer.status === 'Accepted'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : offer.status === 'Declined'
                            ? 'bg-rose-50 text-rose-800 border border-rose-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}>
                          {offer.status}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedOfferLetter(offer)}
                        className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors flex items-center gap-1 ml-auto"
                      >
                        <FileText className="w-3 h-3" />
                        Letter
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Offer Letter Slip Modal */}
      {selectedOfferLetter && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedOfferLetter(null)}
          title="Placement Cell Verification Slip"
          subtitle={`Reference: ${selectedOfferLetter.id} · Issued by Campus Placement Directorate`}
          maxWidth="lg"
        >
          <div className="space-y-6">
            {/* Letterhead */}
            <div className="border-b-2 border-slate-900 pb-4 text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-900 text-white mb-2">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold uppercase tracking-wider text-slate-900">
                Central Campus Placement Directorate
              </h2>
              <p className="text-xs text-slate-500">
                Official Campus Recruitment Offer Confirmation Slip · Academic Year 2024–2025
              </p>
            </div>

            {/* Candidate & Job Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-slate-400 block font-medium">Candidate Name</span>
                <span className="text-sm font-bold text-slate-900">{selectedOfferLetter.studentName}</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 block font-medium">University Roll Number</span>
                <span className="text-sm font-mono font-bold text-slate-900">{selectedOfferLetter.studentRollNo}</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 block font-medium">Department / Branch</span>
                <span className="text-slate-800 font-semibold">{selectedOfferLetter.studentBranch}</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 block font-medium">Recruiting Organization</span>
                <span className="text-slate-800 font-bold">{selectedOfferLetter.companyName}</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 block font-medium">Designation Offered</span>
                <span className="text-slate-800 font-medium">{selectedOfferLetter.jobTitle}</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 block font-medium">Confirmed Compensation (CTC)</span>
                <span className="text-base font-mono font-bold text-emerald-700">₹{selectedOfferLetter.ctcLpa} LPA</span>
              </div>
            </div>

            {/* Statement of Acceptance */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed space-y-2">
              <p>
                This certifies that <strong>{selectedOfferLetter.studentName}</strong> has successfully completed all technical evaluations and HR interview rounds with <strong>{selectedOfferLetter.companyName}</strong> and has been offered full-time employment commencing July 2025.
              </p>
              <div className="flex justify-between items-center pt-2 text-[11px] text-slate-500 border-t border-slate-200">
                <span>Date of Issue: <strong className="text-slate-700 font-mono">{selectedOfferLetter.offerDate}</strong></span>
                <span>Offer Status: <strong className="text-emerald-700 font-bold uppercase">{selectedOfferLetter.status}</strong></span>
              </div>
            </div>

            {/* Verification Stamp */}
            <div className="flex items-center justify-between pt-3 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-blue-600" />
                <span>Verified by Dean of Placement & Corporate Relations</span>
              </div>
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-3 py-1.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Print / Save Slip
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
