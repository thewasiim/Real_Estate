import React, { useEffect, useState } from 'react';
import {
  Plus,
  Search,
  Trash2,
  Edit3,
  Eye,
  FolderKanban,
  Loader2,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { projectsApi } from '../../api/projectsApi';
import ImageUploader from '../../components/admin/ImageUploader';
import ConfirmModal from '../../components/admin/ConfirmModal';
import { validateText, validateNumber } from '../../utils/validators';

const CITIES = ['Mumbai', 'Delhi NCR', 'Bengaluru', 'Hyderabad', 'Pune', 'Goa'];
const STAGES = ['Under Construction', 'RERA Approved', 'Nearing Possession', 'Ready'];

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const initialForm = {
    name: '',
    slug: '',
    builder: 'F.B. Developers',
    startingPrice: '',
    possessionDate: '2027-12-31',
    city: 'Mumbai',
    locality: '',
    images: [],
    description: '',
    amenities: 'Sky Lounge, Infinity Pool, Private Concierge',
    unitTypes: '2 BHK, 3 BHK, Penthouse',
    statusStage: 'Under Construction',
  };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    fetchProjects();
  }, [page, cityFilter, statusFilter]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await projectsApi.getAll({
        page,
        limit: 10,
        search,
        city: cityFilter,
        status: statusFilter,
      });
      if (res.data?.success) {
        setProjects(res.data.data.items || []);
        setTotal(res.data.data.total || 0);
        setTotalPages(res.data.data.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
      showToast('Failed to load projects', 'error');
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

  const handleOpenEdit = (proj) => {
    setEditingId(proj.id);
    setFormData({
      name: proj.name || '',
      slug: proj.slug || '',
      builder: proj.builder || 'F.B. Developers',
      startingPrice: proj.startingPrice || '',
      possessionDate: proj.possessionDate ? new Date(proj.possessionDate).toISOString().split('T')[0] : '2027-12-31',
      city: proj.city || 'Mumbai',
      locality: proj.locality || '',
      images: proj.images || [],
      description: proj.description || '',
      amenities: Array.isArray(proj.amenities) ? proj.amenities.join(', ') : '',
      unitTypes: Array.isArray(proj.unitTypes) ? proj.unitTypes.join(', ') : '',
      statusStage: proj.statusStage || 'Under Construction',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nameErr = validateText(formData.name, 'Project Name', { min: 2, max: 150, required: true });
    if (nameErr) { showToast(nameErr, 'error'); return; }

    const priceErr = validateNumber(formData.startingPrice, 'Starting Price', { min: 1, required: true });
    if (priceErr) { showToast(priceErr, 'error'); return; }

    if (!formData.city) { showToast('City is required', 'error'); return; }
    if (!formData.locality?.trim()) { showToast('Locality is required', 'error'); return; }

    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        name: formData.name.trim(),
        locality: formData.locality.trim(),
        startingPrice: Number(formData.startingPrice),
        possessionDate: new Date(formData.possessionDate).toISOString(),
        slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        amenities: typeof formData.amenities === 'string'
          ? formData.amenities.split(',').map((s) => s.trim()).filter(Boolean)
          : formData.amenities,
        unitTypes: typeof formData.unitTypes === 'string'
          ? formData.unitTypes.split(',').map((s) => s.trim()).filter(Boolean)
          : formData.unitTypes,
      };

      if (editingId) {
        await projectsApi.update(editingId, payload);
        showToast('Project updated successfully');
      } else {
        await projectsApi.create(payload);
        showToast('Project created successfully');
      }

      setIsModalOpen(false);
      fetchProjects();
    } catch (err) {
      console.error('Submit error:', err);
      showToast(err.response?.data?.error || 'Failed to save project', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      await projectsApi.delete(deleteId);
      showToast('Project deleted successfully');
      setDeleteId(null);
      fetchProjects();
    } catch (err) {
      showToast('Failed to delete project', 'error');
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
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Luxury Projects Management</h1>
          <p className="text-xs text-gray-500 mt-1">Manage luxury developments, timelines & Cloudinary media</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-xl shadow-sm transition"
        >
          <Plus size={16} />
          <span>Create New Project</span>
        </button>
      </div>

      {/* Filter & Search */}
      <div className="bg-white border border-gray-200/80 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <form onSubmit={(e) => { e.preventDefault(); setPage(1); fetchProjects(); }} className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects by name, builder, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 transition"
          />
        </form>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <select
            value={cityFilter}
            onChange={(e) => { setCityFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 text-xs border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-gray-900"
          >
            <option value="">All Cities</option>
            {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 text-xs border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-gray-900"
          >
            <option value="">All Stages</option>
            {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3">
            <Loader2 className="animate-spin text-gray-700" size={28} />
            <p className="text-xs text-gray-500 font-medium">Loading development projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="p-12 text-center">
            <FolderKanban className="mx-auto text-gray-300 mb-3" size={36} />
            <p className="text-sm font-semibold text-gray-900">No projects found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-gray-50/80 text-gray-500 font-semibold uppercase text-[10px] tracking-wider border-b border-gray-200/80">
                <tr>
                  <th className="py-3 px-4">Project</th>
                  <th className="py-3 px-4">Builder</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Starting Price</th>
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {projects.map((proj) => (
                  <tr key={proj.id} className="hover:bg-gray-50/60 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {proj.images?.[0] ? (
                          <img src={proj.images[0]} alt={proj.name} className="w-10 h-10 rounded-lg object-cover border border-gray-200 flex-shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">
                            <FolderKanban size={16} />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-900">{proj.name}</p>
                          <p className="text-[10px] text-gray-400">Possession: {new Date(proj.possessionDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">{proj.builder}</td>
                    <td className="py-3 px-4">{proj.city}, {proj.locality}</td>
                    <td className="py-3 px-4 font-bold text-gray-900">₹{proj.startingPrice?.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                        {proj.statusStage}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <a
                          href={`/projects/${proj.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
                          title="View live"
                        >
                          <Eye size={16} />
                        </a>
                        <button
                          onClick={() => handleOpenEdit(proj)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteId(proj.id)}
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
            <span>Showing page {page} of {totalPages} ({total} projects)</span>
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
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="text-lg font-bold text-gray-900">
                {editingId ? 'Edit Project' : 'Create New Project'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900 p-1">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Project Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Solaire Reserve Residences"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-gray-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Developer / Builder *</label>
                  <input
                    type="text"
                    required
                    value={formData.builder}
                    onChange={(e) => setFormData({ ...formData, builder: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-gray-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Starting Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.startingPrice}
                    onChange={(e) => setFormData({ ...formData, startingPrice: e.target.value })}
                    placeholder="e.g. 45000000"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-gray-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Possession Date</label>
                  <input
                    type="date"
                    value={formData.possessionDate}
                    onChange={(e) => setFormData({ ...formData, possessionDate: e.target.value })}
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

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Locality *</label>
                  <input
                    type="text"
                    required
                    value={formData.locality}
                    onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                    placeholder="e.g. Bandra West"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-gray-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Status Stage</label>
                <select
                  value={formData.statusStage}
                  onChange={(e) => setFormData({ ...formData, statusStage: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-gray-900 outline-none bg-white"
                >
                  {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Amenities (comma separated)</label>
                <input
                  type="text"
                  value={formData.amenities}
                  onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-gray-900 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Unit Types (comma separated)</label>
                <input
                  type="text"
                  value={formData.unitTypes}
                  onChange={(e) => setFormData({ ...formData, unitTypes: e.target.value })}
                  placeholder="2 BHK, 3 BHK, Penthouse"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-gray-900 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Project overview & architecture notes..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-gray-900 outline-none"
                />
              </div>

              <ImageUploader
                images={formData.images}
                onChange={(urls) => setFormData({ ...formData, images: urls })}
                multiple={true}
                label="Project Media (Cloudinary Upload)"
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
                  <span>{editingId ? 'Save Changes' : 'Create Project'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Project"
        message="Are you sure you want to delete this development project?"
        onConfirm={handleDelete}
        onClose={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  );
}
