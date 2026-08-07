import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { leadsApi } from '../../api/leadsApi';
import Button from '../ui/Button';

export default function BookVisitModal({ isOpen, onClose }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await leadsApi.create({
        type: 'BOOK_SITE_VISIT',
        name,
        email,
        phone,
        preferredDate: preferredDate || undefined,
        message: message || undefined,
      });

      if (res.data?.success) {
        setSubmitted(true);
      } else {
        setError(res.data?.error || 'Submission failed');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to request site visit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="visit-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="close" onClick={onClose}>
          <X size={20} />
        </button>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <CheckCircle size={48} style={{ color: '#38A169', margin: '0 auto 16px' }} />
            <h2>Consultation Requested</h2>
            <p style={{ marginTop: '8px', color: 'var(--muted)' }}>
              Thank you, {name}. Our Private Advisory Desk will contact you shortly to confirm your site visit details.
            </p>
            <Button dark onClick={onClose} style={{ marginTop: '24px', width: '100%' }}>
              Close
            </Button>
          </div>
        ) : (
          <>
            <p className="eyebrow">PRIVATE ADVISORY</p>
            <h2>Book a Site Visit</h2>
            <p>Experience our luxury estates in person. Arrange a confidential, guided tour at your convenience.</p>

            {error && (
              <div className="auth-error" style={{ marginBottom: '12px' }}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '12px' }}>
              <input
                type="text"
                required
                placeholder="Full Name *"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="email"
                required
                placeholder="Email Address *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="tel"
                required
                placeholder="Phone Number *"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <input
                type="date"
                placeholder="Preferred Date"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
              />
              <textarea
                placeholder="Special requests or requirements (optional)"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{ padding: '12px', border: '1px solid var(--line)', borderRadius: '4px', fontSize: '12px', outline: 'none' }}
              />

              <Button dark type="submit" disabled={loading} style={{ marginTop: '8px', width: '100%', justifyContent: 'center' }}>
                {loading ? 'Submitting...' : 'Request Private Tour'}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
