import React, { useEffect, useState } from 'react';
import {
  Plus,
  Search,
  Trash2,
  Edit3,
  HelpCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { faqsApi } from '../../api/faqsApi';
import ConfirmModal from '../../components/admin/ConfirmModal';
import { validateText } from '../../utils/validators';

export default function AdminFaq() {
  const [faqs, setFaqs] = useState([]);
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
    question: '',
    answer: '',
  };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    fetchFaqs();
  }, [page]);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const res = await faqsApi.getAll({
        page,
        limit: 10,
        search,
      });
      if (res.data?.success) {
        setFaqs(res.data.data.items || []);
        setTotal(res.data.data.total || 0);
        setTotalPages(res.data.data.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to load FAQs:', err);
      showToast('Failed to load FAQs', 'error');
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

  const handleOpenEdit = (faq) => {
    setEditingId(faq.id);
    setFormData({
      question: faq.question || '',
      answer: faq.answer || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const questionErr = validateText(formData.question, 'Question', { min: 5, max: 500, required: true });
    if (questionErr) { showToast(questionErr, 'error'); return; }

    const answerErr = validateText(formData.answer, 'Answer', { min: 5, max: 2000, required: true });
    if (answerErr) { showToast(answerErr, 'error'); return; }

    try {
      setSubmitting(true);

      const payload = {
        question: formData.question.trim(),
        answer: formData.answer.trim(),
      };

      if (editingId) {
        await faqsApi.update(editingId, payload);
        showToast('FAQ updated');
      } else {
        await faqsApi.create(payload);
        showToast('FAQ created');
      }

      setIsModalOpen(false);
      fetchFaqs();
    } catch (err) {
      console.error('Submit error:', err);
      showToast(err.response?.data?.error || 'Failed to save FAQ', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      await faqsApi.delete(deleteId);
      showToast('FAQ deleted');
      setDeleteId(null);
      fetchFaqs();
    } catch (err) {
      showToast('Failed to delete FAQ', 'error');
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
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Frequently Asked Questions</h1>
          <p className="text-xs text-gray-500 mt-1">Manage public site FAQs and buyer advisory questions</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-xl shadow-sm transition"
        >
          <Plus size={16} />
          <span>Add New FAQ</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white border border-gray-200/80 rounded-2xl p-4 shadow-sm flex items-center">
        <form onSubmit={(e) => { e.preventDefault(); setPage(1); fetchFaqs(); }} className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search FAQs by question or answer..."
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
            <p className="text-xs text-gray-500 font-medium">Loading FAQs...</p>
          </div>
        ) : faqs.length === 0 ? (
          <div className="p-12 text-center">
            <HelpCircle className="mx-auto text-gray-300 mb-3" size={36} />
            <p className="text-sm font-semibold text-gray-900">No FAQs found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-gray-50/80 text-gray-500 font-semibold uppercase text-[10px] tracking-wider border-b border-gray-200/80">
                <tr>
                  <th className="py-3 px-4">Question</th>
                  <th className="py-3 px-4">Answer</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {faqs.map((faq) => (
                  <tr key={faq.id} className="hover:bg-gray-50/60 transition">
                    <td className="py-3 px-4 font-semibold text-gray-900 max-w-xs">{faq.question}</td>
                    <td className="py-3 px-4 text-gray-600 max-w-md line-clamp-2">{faq.answer}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(faq)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteId(faq.id)}
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
            <span>Showing page {page} of {totalPages} ({total} FAQs)</span>
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="text-lg font-bold text-gray-900">
                {editingId ? 'Edit FAQ' : 'Add New FAQ'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900 p-1">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Question *</label>
                <input
                  type="text"
                  required
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="e.g. How does F.B. Developer handle legal title verification?"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-gray-900 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Answer *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  placeholder="Detailed answer text..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-gray-900 outline-none"
                />
              </div>

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
                  <span>{editingId ? 'Save Changes' : 'Add FAQ'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete FAQ"
        message="Are you sure you want to delete this FAQ item?"
        onConfirm={handleDelete}
        onClose={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  );
}
