import React, { useEffect, useState } from 'react';
import {
  Inbox,
  Search,
  Trash2,
  Eye,
  Loader2,
  ChevronLeft,
  ChevronRight,
  X,
  Mail,
  Phone,
  Calendar,
  Clock,
  MessageSquare,
} from 'lucide-react';
import { leadsApi } from '../../api/leadsApi';
import ConfirmModal from '../../components/admin/ConfirmModal';

const LEAD_TYPES = ['SCHEDULE_VISIT', 'BOOK_SITE_VISIT', 'CONTACT', 'NEWSLETTER'];
const LEAD_STATUSES = ['NEW', 'CONTACTED', 'CLOSED'];

export default function AdminLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [selectedLead, setSelectedLead] = useState(null);
  const [toast, setToast] = useState(null);

  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, [page, typeFilter, statusFilter]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await leadsApi.getAll({
        page,
        limit: 15,
        search,
        type: typeFilter,
        status: statusFilter,
      });
      if (res.data?.success) {
        setLeads(res.data.data.items || []);
        setTotal(res.data.data.total || 0);
        setTotalPages(res.data.data.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to load leads:', err);
      showToast('Failed to load leads', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await leadsApi.updateStatus(id, newStatus);
      showToast(`Lead status updated to ${newStatus}`);
      fetchLeads();
      if (selectedLead && selectedLead.id === id) {
        setSelectedLead({ ...selectedLead, status: newStatus });
      }
    } catch (err) {
      showToast('Failed to update lead status', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      await leadsApi.delete(deleteId);
      showToast('Lead deleted successfully');
      setDeleteId(null);
      if (selectedLead && selectedLead.id === deleteId) {
        setSelectedLead(null);
      }
      fetchLeads();
    } catch (err) {
      showToast('Failed to delete lead', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-xs font-semibold bg-gray-900 text-white">
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Customer Enquiries & Leads</h1>
          <p className="text-xs text-gray-500 mt-1">Real-time site visit bookings, contact submissions & newsletter requests</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200/80 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <form onSubmit={(e) => { e.preventDefault(); setPage(1); fetchLeads(); }} className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by lead name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 transition"
          />
        </form>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <select
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 text-xs border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-gray-900"
          >
            <option value="">All Lead Types</option>
            {LEAD_TYPES.map((t) => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 text-xs border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-gray-900"
          >
            <option value="">All Statuses</option>
            {LEAD_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3">
            <Loader2 className="animate-spin text-gray-700" size={28} />
            <p className="text-xs text-gray-500 font-medium">Fetching customer submissions...</p>
          </div>
        ) : leads.length === 0 ? (
          <div className="p-12 text-center">
            <Inbox className="mx-auto text-gray-300 mb-3" size={36} />
            <p className="text-sm font-semibold text-gray-900">No leads found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-gray-50/80 text-gray-500 font-semibold uppercase text-[10px] tracking-wider border-b border-gray-200/80">
                <tr>
                  <th className="py-3 px-4">Contact Info</th>
                  <th className="py-3 px-4">Lead Type</th>
                  <th className="py-3 px-4">Details</th>
                  <th className="py-3 px-4">Date Submitted</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50/60 transition">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-semibold text-gray-900">{lead.name || 'Subscriber'}</p>
                        <p className="text-[10px] text-gray-400">{lead.email}</p>
                        {lead.phone && <p className="text-[10px] text-gray-400">{lead.phone}</p>}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-[10px] font-bold">
                        {lead.type?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500 max-w-xs">
                      {lead.preferredDate && (
                        <p className="text-[11px]">
                          Visit: {new Date(lead.preferredDate).toLocaleDateString()} {lead.preferredTime}
                        </p>
                      )}
                      {lead.message && <p className="truncate text-[11px] italic">"{lead.message}"</p>}
                      {!lead.preferredDate && !lead.message && <span className="text-gray-300">—</span>}
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-[11px]">
                      {new Date(lead.createdAt).toLocaleDateString()} {new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border focus:outline-none ${
                          lead.status === 'NEW'
                            ? 'bg-rose-50 text-rose-600 border-rose-200'
                            : lead.status === 'CONTACTED'
                            ? 'bg-amber-50 text-amber-600 border-amber-200'
                            : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                        }`}
                      >
                        <option value="NEW">NEW</option>
                        <option value="CONTACTED">CONTACTED</option>
                        <option value="CLOSED">CLOSED</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
                          title="View lead details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteId(lead.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete lead"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Showing page {page} of {totalPages} ({total} total leads)</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View Lead Details Drawer/Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="text-base font-bold text-gray-900">Lead Submission Details</h2>
              <button onClick={() => setSelectedLead(null)} className="text-gray-400 hover:text-gray-900 p-1">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs text-gray-700">
              <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                <p className="text-gray-400 text-[10px] font-bold uppercase">Contact</p>
                <p className="text-sm font-bold text-gray-900">{selectedLead.name || 'Anonymous'}</p>
                <p className="flex items-center gap-1 text-gray-600"><Mail size={12} /> {selectedLead.email}</p>
                {selectedLead.phone && <p className="flex items-center gap-1 text-gray-600"><Phone size={12} /> {selectedLead.phone}</p>}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-gray-400 text-[10px] font-bold uppercase">Type</p>
                  <p className="font-semibold text-gray-900 mt-1">{selectedLead.type?.replace('_', ' ')}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-gray-400 text-[10px] font-bold uppercase">Status</p>
                  <p className="font-semibold text-gray-900 mt-1">{selectedLead.status}</p>
                </div>
              </div>

              {selectedLead.preferredDate && (
                <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                  <p className="text-gray-400 text-[10px] font-bold uppercase">Schedule Appointment</p>
                  <p className="flex items-center gap-1 text-gray-900 font-semibold">
                    <Calendar size={12} /> {new Date(selectedLead.preferredDate).toLocaleDateString()}
                    <Clock size={12} className="ml-2" /> {selectedLead.preferredTime}
                  </p>
                </div>
              )}

              {selectedLead.message && (
                <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                  <p className="text-gray-400 text-[10px] font-bold uppercase">Customer Note / Message</p>
                  <p className="text-gray-900 leading-relaxed italic">"{selectedLead.message}"</p>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between border-t border-gray-100">
                <span className="text-[10px] text-gray-400">
                  Received: {new Date(selectedLead.createdAt).toLocaleString()}
                </span>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="px-4 py-1.5 bg-gray-900 text-white font-semibold rounded-lg text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Lead"
        message="Are you sure you want to delete this customer lead?"
        onConfirm={handleDelete}
        onClose={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  );
}
