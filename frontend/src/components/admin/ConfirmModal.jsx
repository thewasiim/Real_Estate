import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import Button from '../ui/Button';

export default function ConfirmModal({ isOpen, title, message, confirmText = 'Delete', cancelText = 'Cancel', onConfirm, onClose, loading = false }) {
  if (!isOpen) return null;

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal-card max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{title || 'Confirm Action'}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{message || 'Are you sure you want to proceed?'}</p>
            </div>
          </div>
          <button onClick={onClose} className="admin-modal-close" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="admin-modal-footer mt-6 flex justify-end gap-3">
          <Button type="button" outline onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button
            type="button"
            className="bg-red-600 hover:bg-red-700 text-white font-semibold text-sm px-4 py-2 rounded-lg transition"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Processing...' : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
