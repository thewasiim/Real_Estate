import React, { useEffect, useState } from 'react';
import {
  Plus,
  Search,
  Trash2,
  Edit3,
  UserCheck,
  Loader2,
  ChevronLeft,
  ChevronRight,
  X,
  Phone,
  Mail,
  Award,
} from 'lucide-react';
import { agentsApi } from '../../api/agentsApi';
import ImageUploader from '../../components/admin/ImageUploader';
import ConfirmModal from '../../components/admin/ConfirmModal';
import { validateName, validateEmail, validatePhone, validateNumber } from '../../utils/validators';

const CITIES = ['Mumbai', 'Delhi NCR', 'Bengaluru', 'Hyderabad', 'Pune', 'Goa'];

export default function AdminAgents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const initialForm = {
    name: '',
    photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
    phone: '+91 98765 43210',
    whatsapp: '+91 98765 43210',
    email: '',
    role: 'Senior Private Advisor',
    city: 'Mumbai',
    experienceYears: 8,
  };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    fetchAgents();
  }, [page, cityFilter]);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const res = await agentsApi.getAll({
        page,
        limit: 10,
        search,
        city: cityFilter,
      });
      if (res.data?.success) {
        setAgents(res.data.data.items || []);
        setTotal(res.data.data.total || 0);
        setTotalPages(res.data.data.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to load agents:', err);
      showToast('Failed to load agents', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ag) => {
    setEditingId(ag.id);
    setFormData({
      name: ag.name || '',
      photoUrl: ag.photoUrl || '',
      phone: ag.phone || '',
      whatsapp: ag.whatsapp || '',
      email: ag.email || '',
      role: ag.role || 'Senior Private Advisor',
      city: ag.city || 'Mumbai',
      experienceYears: ag.experienceYears || 5,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nameErr = validateName(formData.name, 'Full Name');
    if (nameErr) { showToast(nameErr, 'error'); return; }

    const emailErr = validateEmail(formData.email);
    if (emailErr) { showToast(emailErr, 'error'); return; }

    const phoneErr = validatePhone(formData.phone, true);
    if (phoneErr) { showToast(phoneErr, 'error'); return; }

    const expErr = validateNumber(formData.experienceYears, 'Experience Years', { min: 0, max: 70, integer: true });
    if (expErr) { showToast(expErr, 'error'); return; }

    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        whatsapp: formData.whatsapp?.trim() || formData.phone.trim(),
        experienceYears: Number(formData.experienceYears),
      };

      if (editingId) {
        await agentsApi.update(editingId, payload);
        showToast('Agent updated successfully');
      } else {
        await agentsApi.create(payload);
        showToast('Agent created successfully');
      }

      setIsModalOpen(false);
      fetchAgents();
    } catch (err) {
      console.error('Submit error:', err);
      showToast(err.response?.data?.error || 'Failed to save agent', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      await agentsApi.delete(deleteId);
      showToast('Agent deleted successfully');
      setDeleteId(null);
      fetchAgents();
    } catch (err) {
      showToast('Failed to delete agent', 'error');
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
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Private Advisors & Agents</h1>
          <p className="text-xs text-gray-500 mt-1">Manage real-estate consultants, profiles & contact details</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-xl shadow-sm transition"
        >
          <Plus size={16} />
          <span>Add New Agent</span>
        </button>
      </div>

      {/* Filter & Search */}
      <div className="bg-white border border-gray-200/80 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <form onSubmit={(e) => { e.preventDefault(); setPage(1); fetchAgents(); }} className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search agents by name, email, role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 transition"
          />
        </form>

        <select
          value={cityFilter}
          onChange={(e) => { setCityFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 text-xs border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-gray-900 w-full md:w-auto"
        >
          <option value="">All Cities</option>
          {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3">
            <Loader2 className="animate-spin text-gray-700" size={28} />
            <p className="text-xs text-gray-500 font-medium">Loading private advisors...</p>
          </div>
        ) : agents.length === 0 ? (
          <div className="p-12 text-center">
            <UserCheck className="mx-auto text-gray-300 mb-3" size={36} />
            <p className="text-sm font-semibold text-gray-900">No agents registered</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-gray-50/80 text-gray-500 font-semibold uppercase text-[10px] tracking-wider border-b border-gray-200/80">
                <tr>
                  <th className="py-3 px-4">Advisor</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">City</th>
                  <th className="py-3 px-4">Experience</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {agents.map((ag) => (
                  <tr key={ag.id} className="hover:bg-gray-50/60 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img src={ag.photoUrl} alt={ag.name} className="w-10 h-10 rounded-full object-cover border border-gray-200 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900">{ag.name}</p>
                          <p className="text-[10px] text-gray-400">{ag.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">{ag.role}</td>
                    <td className="py-3 px-4 text-gray-600">
                      <div className="flex flex-col gap-0.5 text-[11px]">
                        <span className="flex items-center gap-1"><Phone size={10} /> {ag.phone}</span>
                        <span className="flex items-center gap-1 text-gray-400"><Mail size={10} /> {ag.email}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{ag.city}</td>
                    <td className="py-3 px-4 font-semibold text-gray-900">{ag.experienceYears} Years</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(ag)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteId(ag.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
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
            <span>Showing page {page} of {totalPages} ({total} agents)</span>
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="text-lg font-bold text-gray-900">
                {editingId ? 'Edit Advisor Profile' : 'Add New Advisor'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900 p-1">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Vikramaditya Singhania"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-gray-900 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="agent@fbdeveloper.in"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-gray-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-gray-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Role / Designation</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="Senior Property Consultant"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-gray-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">City *</label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-gray-900 outline-none bg-white"
                  >
                    {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Experience (Years)</label>
                <input
                  type="number"
                  value={formData.experienceYears}
                  onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-gray-900 outline-none"
                />
              </div>

              <ImageUploader
                images={formData.photoUrl}
                onChange={(url) => setFormData({ ...formData, photoUrl: url })}
                multiple={false}
                label="Profile Photo (Cloudinary Upload)"
              />

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-gray-900 hover:bg-black text-white font-semibold rounded-xl transition flex items-center gap-2"
                >
                  {submitting && <Loader2 className="animate-spin" size={14} />}
                  <span>{editingId ? 'Save Changes' : 'Create Agent'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Agent"
        message="Are you sure you want to remove this property advisor?"
        onConfirm={handleDelete}
        onClose={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  );
}
