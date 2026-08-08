import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { uploadsApi } from '../../api/uploadsApi';

export default function ImageUploader({ images = [], onChange, multiple = true, label = 'Upload Images' }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploading(true);
    setError(null);

    const uploadedUrls = [...images];

    for (const file of files) {
      try {
        const res = await uploadsApi.uploadImage(file);
        if (res.data?.success && res.data?.data?.url) {
          if (multiple) {
            uploadedUrls.push(res.data.data.url);
          } else {
            uploadedUrls[0] = res.data.data.url;
            break;
          }
        }
      } catch (err) {
        console.error('Upload error:', err);
        setError(err.response?.data?.error || 'Failed to upload image. Please try again.');
      }
    }

    setUploading(false);
    onChange(multiple ? uploadedUrls : (uploadedUrls[0] || ''));
  };

  const handleRemove = (index) => {
    if (multiple) {
      const updated = images.filter((_, i) => i !== index);
      onChange(updated);
    } else {
      onChange('');
    }
  };

  const list = multiple ? (Array.isArray(images) ? images : []) : (images ? [images] : []);

  return (
    <div className="space-y-3">
      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600">
        {label}
      </label>

      {/* Grid of uploaded images */}
      {list.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
          {list.map((url, idx) => (
            <div key={idx} className="relative group aspect-video rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
              <img src={url} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="absolute top-1 right-1 bg-black/60 hover:bg-red-600 text-white rounded-full p-1 transition opacity-80 group-hover:opacity-100"
                title="Remove image"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload button area */}
      <div className="relative border-2 border-dashed border-gray-300 hover:border-gray-900 rounded-xl p-4 text-center cursor-pointer transition bg-gray-50/50 hover:bg-gray-50">
        <input
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleFileChange}
          disabled={uploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        <div className="flex flex-col items-center justify-center gap-2">
          {uploading ? (
            <Loader2 className="animate-spin text-gray-700" size={24} />
          ) : (
            <Upload className="text-gray-500" size={24} />
          )}
          <span className="text-xs font-medium text-gray-700">
            {uploading ? 'Uploading to Cloudinary...' : multiple ? 'Click or drag images to upload' : 'Click to upload image'}
          </span>
          <span className="text-[10px] text-gray-400">Supports JPG, PNG, WEBP (Max 5MB)</span>
        </div>
      </div>

      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}
