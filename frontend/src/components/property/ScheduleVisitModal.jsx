import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { leadsApi } from '../../api/leadsApi';
import Button from '../ui/Button';

export default function ScheduleVisitModal({ isOpen, onClose, property }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('Morning (10 AM - 1 PM)');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !property) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await leadsApi.create({
        type: 'SCHEDULE_VISIT',
        propertyId: property.id,
        name,
        email,
        phone,
        preferredDate,
        preferredTime,
        message: message || undefined,
      });

      if (res.data?.success) {
        setSubmitted(true);
      } else {
        setError(res.data?.error || 'Failed to schedule visit');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Could not schedule visit. Please try again.');
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
            <h2>Visit Scheduled!</h2>
            <p style={{ marginTop: '8px', color: 'var(--muted)' }}>
              Your private tour for <strong>{property.title}</strong> on <strong>{preferredDate}</strong> ({preferredTime}) is confirmed. Our specialist will contact you.
            </p>
            <Button dark onClick={onClose} style={{ marginTop: '24px', width: '100%' }}>
              Done
            </Button>
          </div>
        ) : (
          <>
            <p className="eyebrow">PROPERTY TOUR</p>
            <h2>Schedule Private Visit</h2>
            <p style={{ fontSize: '12px', color: 'var(--color-accent)', fontWeight: 600, marginBottom: '12px' }}>
              {property.title}
            </p>

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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <input
                  type="date"
                  required
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                />
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  style={{ padding: '12px', border: '1px solid var(--line)', borderRadius: '4px', fontSize: '12px' }}
                >
                  <option value="Morning (10 AM - 1 PM)">Morning (10 AM - 1 PM)</option>
                  <option value="Afternoon (1 PM - 4 PM)">Afternoon (1 PM - 4 PM)</option>
                  <option value="Evening (4 PM - 7 PM)">Evening (4 PM - 7 PM)</option>
                </select>
              </div>

              <textarea
                placeholder="Message or specific questions for the agent (optional)"
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{ padding: '12px', border: '1px solid var(--line)', borderRadius: '4px', fontSize: '12px', outline: 'none' }}
              />

              <Button dark type="submit" disabled={loading} style={{ marginTop: '8px', width: '100%', justifyContent: 'center' }}>
                {loading ? 'Scheduling...' : 'Confirm Visit Booking'}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
