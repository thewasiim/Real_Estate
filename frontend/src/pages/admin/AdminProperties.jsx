import React, { useEffect, useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Edit3,
  Eye,
  Star,
  Building2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { propertiesApi } from '../../api/propertiesApi';
import { agentsApi } from '../../api/agentsApi';
import ImageUploader from '../../components/admin/ImageUploader';
import ConfirmModal from '../../components/admin/ConfirmModal';
import { validateText, validateNumber } from '../../utils/validators';

const CITIES = ['Mumbai', 'Delhi NCR', 'Bengaluru', 'Hyderabad', 'Pune', 'Goa'];
const PROP_TYPES = ['Apartment', 'Villa', 'Penthouse', 'Commercial', 'Plot'];

export default function AdminProperties() {
  const [properties, setProperties] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [listingTypeFilter, setListingTypeFilter] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  // Delete Confirm Modal
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Form State
  const initialForm = {
    title: '',
    slug: '',
    type: 'Apartment',
    listingType: 'BUY',
    status: 'Ready to Move',
    price: '',
    city: 'Mumbai',
    locality: '',
    address: '',
    area: '',
    bhk: 2,
    bathrooms: 2,
    parking: 1,
    furnishing: 'Unfurnished',
    amenities: 'Infinity Pool, Private Terrace, Smart Home Automation',
    description: '',
    images: [],
    floorPlans: [],
    isFeatured: false,
    agentId: '',
  };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    fetchProperties();
  }, [page, cityFilter, typeFilter, listingTypeFilter]);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const res = await agentsApi.getAll({ limit: 100 });
      if (res.data?.success) {
        setAgents(res.data.data.items || []);
      }
    } catch (err) {
      console.error('Failed to load agents:', err);
    }
  };

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
        search,
        city: cityFilter,
        type: typeFilter,
        listingType: listingTypeFilter,
      };
      const res = await propertiesApi.getAll(params);
      if (res.data?.success) {
        setProperties(res.data.data.items || []);
        setTotal(res.data.data.total || 0);
        setTotalPages(res.data.data.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to load properties:', err);
      showToast('Failed to load properties', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProperties();
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

  const handleOpenEdit = (prop) => {
    setEditingId(prop.id);
    setFormData({
      title: prop.title || '',
      slug: prop.slug || '',
      type: prop.type || 'Apartment',
      listingType: prop.listingType || 'BUY',
      status: prop.status || 'Ready to Move',
      price: prop.price || '',
      city: prop.city || 'Mumbai',
      locality: prop.locality || '',
      address: prop.address || '',
      area: prop.area || '',
      bhk: prop.bhk || 2,
      bathrooms: prop.bathrooms || 2,
      parking: prop.parking || 1,
      furnishing: prop.furnishing || 'Unfurnished',
      amenities: Array.isArray(prop.amenities) ? prop.amenities.join(', ') : '',
      description: prop.description || '',
      images: prop.images || [],
      floorPlans: prop.floorPlans || [],
      isFeatured: !!prop.isFeatured,
      agentId: prop.agentId || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const titleErr = validateText(formData.title, 'Property Title', { min: 2, max: 150, required: true });
    if (titleErr) { showToast(titleErr, 'error'); return; }

    const priceErr = validateNumber(formData.price, 'Price', { min: 1, required: true });
    if (priceErr) { showToast(priceErr, 'error'); return; }

    const areaErr = validateNumber(formData.area, 'Area', { min: 1, required: true });
    if (areaErr) { showToast(areaErr, 'error'); return; }

    if (!formData.city) { showToast('City is required', 'error'); return; }
    if (!formData.address?.trim()) { showToast('Full address is required', 'error'); return; }

    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        title: formData.title.trim(),
        address: formData.address.trim(),
        locality: formData.locality?.trim(),
        price: Number(formData.price),
        area: Number(formData.area),
        bhk: Number(formData.bhk),
        bathrooms: Number(formData.bathrooms),
        parking: Number(formData.parking),
        slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        amenities: typeof formData.amenities === 'string'
          ? formData.amenities.split(',').map((s) => s.trim()).filter(Boolean)
          : formData.amenities,
        agentId: formData.agentId || undefined,
      };

      if (editingId) {
        await propertiesApi.update(editingId, payload);
        showToast('Property updated successfully');
      } else {
        await propertiesApi.create(payload);
        showToast('Property created successfully');
      }

      setIsModalOpen(false);
      fetchProperties();
    } catch (err) {
      console.error('Submit error:', err);
      showToast(err.response?.data?.error || 'Failed to save property', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleFeatured = async (prop) => {
    try {
      await propertiesApi.update(prop.id, { isFeatured: !prop.isFeatured });
      showToast(`Property marked as ${!prop.isFeatured ? 'Featured' : 'Standard'}`);
      fetchProperties();
    } catch (err) {
      showToast('Failed to update featured status', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      await propertiesApi.delete(deleteId);
      showToast('Property deleted successfully');
      setDeleteId(null);
      fetchProperties();
    } catch (err) {
      showToast('Failed to delete property', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2 ${
            toast.type === 'error' ? 'bg-red-900 text-white' : 'bg-gray-900 text-white'
          }`}
        >
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Property Portfolio</h1>
          <p className="text-xs text-gray-500 mt-1">Manage listings, prices, Cloudinary images & featured status</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-xl shadow-sm transition"
        >
          <Plus size={16} />
          <span>Add New Property</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-gray-200/80 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title, city, locality..."
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
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 text-xs border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-gray-900"
          >
            <option value="">All Types</option>
            {PROP_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>

          <select
            value={listingTypeFilter}
            onChange={(e) => { setListingTypeFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 text-xs border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-gray-900"
          >
            <option value="">Buy & Rent</option>
            <option value="BUY">BUY</option>
            <option value="RENT">RENT</option>
          </select>
        </div>
      </div>

      {/* DataTable */}
      <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3">
            <Loader2 className="animate-spin text-gray-700" size={28} />
            <p className="text-xs text-gray-500 font-medium">Fetching real properties from database...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="p-12 text-center">
            <Building2 className="mx-auto text-gray-300 mb-3" size={36} />
            <p className="text-sm font-semibold text-gray-900">No properties found</p>
            <p className="text-xs text-gray-500 mt-1">Try adjusting your search filters or create a new property.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-gray-50/80 text-gray-500 font-semibold uppercase text-[10px] tracking-wider border-b border-gray-200/80">
                <tr>
                  <th className="py-3 px-4">Property</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Featured</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {properties.map((prop) => (
                  <tr key={prop.id} className="hover:bg-gray-50/60 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {prop.images?.[0] ? (
                          <img src={prop.images[0]} alt={prop.title} className="w-10 h-10 rounded-lg object-cover border border-gray-200 flex-shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">
                            <Building2 size={16} />
                          </div>
                        )}
                        <div className="truncate max-w-xs">
                          <p className="font-semibold text-gray-900 truncate">{prop.title}</p>
                          <p className="text-[10px] text-gray-400 truncate">{prop.bhk} BHK · {prop.area} sqft · {prop.status}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-[10px] font-bold">
                        {prop.type} ({prop.listingType})
                      </span>
                    </td>
                    <td className="py-3 px-4">{prop.city}, {prop.locality}</td>
                    <td className="py-3 px-4 font-bold text-gray-900">₹{prop.price?.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleFeatured(prop)}
                        className={`p-1.5 rounded-lg border transition ${
                          prop.isFeatured
                            ? 'bg-amber-50 text-amber-600 border-amber-200'
                            : 'bg-gray-50 text-gray-400 border-gray-200 hover:text-gray-700'
                        }`}
                        title="Toggle Featured"
                      >
                        <Star size={14} fill={prop.isFeatured ? 'currentColor' : 'none'} />
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <a
                          href={`/properties/${prop.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
                          title="View live"
                        >
                          <Eye size={16} />
                        </a>
                        <button
                          onClick={() => handleOpenEdit(prop)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Edit property"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteId(prop.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete property"
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Showing page {page} of {totalPages} ({total} total items)</span>
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

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h2 className="text-lg font-bold text-gray-900">
                {editingId ? 'Edit Property Details' : 'Create New Property'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900 p-1">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Property Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Solaire Grand Skyline Penthouse"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-gray-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g. 25000000"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-gray-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Property Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-gray-900 outline-none bg-white"
                  >
                    {PROP_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Listing Type *</label>
                  <select
                    value={formData.listingType}
                    onChange={(e) => setFormData({ ...formData, listingType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-gray-900 outline-none bg-white"
                  >
                    <option value="BUY">BUY</option>
                    <option value="RENT">RENT</option>
                  </select>
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
                    placeholder="e.g. Worli, Sea Face"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-gray-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Full Address *</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. 102 Worli Sea Face, Mumbai, Maharashtra 400018"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-gray-900 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Area (sqft) *</label>
                  <input
                    type="number"
                    required
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-gray-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">BHK</label>
                  <input
                    type="number"
                    value={formData.bhk}
                    onChange={(e) => setFormData({ ...formData, bhk: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-gray-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Bathrooms</label>
                  <input
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-gray-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Parking Slots</label>
                  <input
                    type="number"
                    value={formData.parking}
                    onChange={(e) => setFormData({ ...formData, parking: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-gray-900 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Assigned Agent</label>
                  <select
                    value={formData.agentId}
                    onChange={(e) => setFormData({ ...formData, agentId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-gray-900 outline-none bg-white"
                  >
                    <option value="">-- Select Agent --</option>
                    {agents.map((ag) => <option key={ag.id} value={ag.id}>{ag.name} ({ag.role})</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded text-gray-900 border-gray-300"
                  />
                  <label htmlFor="isFeatured" className="font-semibold text-gray-900">
                    Feature on Homepage Carousel
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Amenities (comma separated)</label>
                <input
                  type="text"
                  value={formData.amenities}
                  onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                  placeholder="Infinity Pool, Gym, Smart Automation, 24/7 Security"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-gray-900 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed property description..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-gray-900 outline-none"
                />
              </div>

              {/* Cloudinary Image Uploader */}
              <ImageUploader
                images={formData.images}
                onChange={(urls) => setFormData({ ...formData, images: urls })}
                multiple={true}
                label="Property Gallery (Cloudinary Upload)"
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
                  <span>{editingId ? 'Save Changes' : 'Create Property'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Property"
        message="Are you sure you want to delete this property? This action cannot be undone."
        onConfirm={handleDelete}
        onClose={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  );
}
