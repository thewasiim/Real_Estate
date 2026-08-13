import React, { useEffect, useState } from 'react';
import {
  Plus,
  Search,
  Trash2,
  Edit3,
  FileText,
  Loader2,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { blogApi } from '../../api/blogApi';
import ImageUploader from '../../components/admin/ImageUploader';
import ConfirmModal from '../../components/admin/ConfirmModal';
import { validateText } from '../../utils/validators';

export default function AdminBlog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const initialForm = {
    title: '',
    slug: '',
    coverUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
    excerpt: '',
    content: '',
    author: 'F.B. Developer Editorial',
  };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await blogApi.getAll({
        page,
        limit: 10,
        search,
      });
      if (res.data?.success) {
        setPosts(res.data.data.items || []);
        setTotal(res.data.data.total || 0);
        setTotalPages(res.data.data.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to load blog posts:', err);
      showToast('Failed to load journal articles', 'error');
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

  const handleOpenEdit = (post) => {
    setEditingId(post.id);
    setFormData({
      title: post.title || '',
      slug: post.slug || '',
      coverUrl: post.coverUrl || '',
      excerpt: post.excerpt || '',
      content: post.content || '',
      author: post.author || 'F.B. Developer Editorial',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const titleErr = validateText(formData.title, 'Title', { min: 2, max: 200, required: true });
    if (titleErr) { showToast(titleErr, 'error'); return; }

    const excerptErr = validateText(formData.excerpt, 'Excerpt', { min: 10, max: 500, required: true });
    if (excerptErr) { showToast(excerptErr, 'error'); return; }

    const contentErr = validateText(formData.content, 'Content', { min: 20, max: 50000, required: true });
    if (contentErr) { showToast(contentErr, 'error'); return; }

    if (!formData.coverUrl) {
      showToast('Cover image is required', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        title: formData.title.trim(),
        excerpt: formData.excerpt.trim(),
        content: formData.content.trim(),
        author: formData.author.trim() || 'F.B. Developer Editorial',
        slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      };

      if (editingId) {
        await blogApi.update(editingId, payload);
        showToast('Article updated successfully');
      } else {
        await blogApi.create(payload);
        showToast('Article published successfully');
      }

      setIsModalOpen(false);
      fetchPosts();
    } catch (err) {
      console.error('Submit error:', err);
      showToast(err.response?.data?.error || 'Failed to save article', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      await blogApi.delete(deleteId);
      showToast('Article deleted successfully');
      setDeleteId(null);
      fetchPosts();
    } catch (err) {
      showToast('Failed to delete article', 'error');
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
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Journal & Architectural Blog</h1>
          <p className="text-xs text-gray-500 mt-1">Publish market insights, design trends & luxury property news</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-xl shadow-sm transition"
        >
          <Plus size={16} />
          <span>New Article</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white border border-gray-200/80 rounded-2xl p-4 shadow-sm flex items-center">
        <form onSubmit={(e) => { e.preventDefault(); setPage(1); fetchPosts(); }} className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search articles by title, excerpt, author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 transition"
          />
        </form>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3">
            <Loader2 className="animate-spin text-gray-700" size={28} />
            <p className="text-xs text-gray-500 font-medium">Loading articles...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="mx-auto text-gray-300 mb-3" size={36} />
            <p className="text-sm font-semibold text-gray-900">No articles published</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-gray-50/80 text-gray-500 font-semibold uppercase text-[10px] tracking-wider border-b border-gray-200/80">
                <tr>
                  <th className="py-3 px-4">Article</th>
                  <th className="py-3 px-4">Author</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50/60 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img src={post.coverUrl} alt={post.title} className="w-12 h-10 rounded-lg object-cover border border-gray-200 flex-shrink-0" />
                        <div className="max-w-md">
                          <p className="font-semibold text-gray-900 line-clamp-1">{post.title}</p>
                          <p className="text-[10px] text-gray-400 line-clamp-1">{post.excerpt}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">{post.author}</td>
                    <td className="py-3 px-4 text-gray-500 text-[11px]">
                      {new Date(post.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(post)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteId(post.id)}
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
            <span>Showing page {page} of {totalPages} ({total} posts)</span>
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
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="text-lg font-bold text-gray-900">
                {editingId ? 'Edit Journal Article' : 'Publish New Article'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900 p-1">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Architecture Trends 2026: Sustainable Minimal Luxury"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-gray-900 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Author Name *</label>
                <input
                  type="text"
                  required
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-gray-900 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Excerpt / Summary *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Short lead paragraph summarizing the article..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-gray-900 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Article Body Content *</label>
                <textarea
                  rows={8}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Full article content..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-gray-900 outline-none font-sans"
                />
              </div>

              <ImageUploader
                images={formData.coverUrl}
                onChange={(url) => setFormData({ ...formData, coverUrl: url })}
                multiple={false}
                label="Cover Header Image (Cloudinary Upload)"
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
                  <span>{editingId ? 'Save Changes' : 'Publish Article'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Article"
        message="Are you sure you want to delete this journal entry?"
        onConfirm={handleDelete}
        onClose={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  );
}
