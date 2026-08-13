import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { leadsApi } from '../../api/leadsApi';
import Button from '../ui/Button';
import { validateName, validateEmail, validatePhone, validateText } from '../../utils/validators';

export default function ScheduleVisitModal({ isOpen, onClose, property }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('Morning (10 AM - 1 PM)');
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !property) return null;

  const validateForm = () => {
    const errors = {};
    const nameErr = validateName(name, 'Full Name');
    if (nameErr) errors.name = nameErr;

    const emailErr = validateEmail(email);
    if (emailErr) errors.email = emailErr;

    const phoneErr = validatePhone(phone, true);
    if (phoneErr) errors.phone = phoneErr;

    if (!preferredDate) {
      errors.preferredDate = 'Preferred date is required';
    } else {
      const selected = new Date(preferredDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        errors.preferredDate = 'Preferred date cannot be in the past';
      }
    }

    if (message.trim()) {
      const msgErr = validateText(message, 'Message', { min: 3, max: 1000, required: false });
      if (msgErr) errors.message = msgErr;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const res = await leadsApi.create({
        type: 'SCHEDULE_VISIT',
        propertyId: property.id,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        preferredDate,
        preferredTime,
        message: message.trim() || undefined,
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

            <form onSubmit={handleSubmit} noValidate style={{ display: 'grid', gap: '12px' }}>
              <div>
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: null });
                  }}
                  maxLength={50}
                />
                {fieldErrors.name && <span style={{ color: '#e53e3e', fontSize: '11px', marginTop: '2px', display: 'block' }}>{fieldErrors.name}</span>}
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Email Address *"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: null });
                  }}
                  maxLength={100}
                />
                {fieldErrors.email && <span style={{ color: '#e53e3e', fontSize: '11px', marginTop: '2px', display: 'block' }}>{fieldErrors.email}</span>}
              </div>

              <div>
                <input
                  type="tel"
                  placeholder="Phone Number *"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (fieldErrors.phone) setFieldErrors({ ...fieldErrors, phone: null });
                  }}
                  maxLength={15}
                />
                {fieldErrors.phone && <span style={{ color: '#e53e3e', fontSize: '11px', marginTop: '2px', display: 'block' }}>{fieldErrors.phone}</span>}
              </div>

              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => {
                      setPreferredDate(e.target.value);
                      if (fieldErrors.preferredDate) setFieldErrors({ ...fieldErrors, preferredDate: null });
                    }}
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
                {fieldErrors.preferredDate && <span style={{ color: '#e53e3e', fontSize: '11px', marginTop: '2px', display: 'block' }}>{fieldErrors.preferredDate}</span>}
              </div>

              <div>
                <textarea
                  placeholder="Message or specific questions for the agent (optional)"
                  rows={2}
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (fieldErrors.message) setFieldErrors({ ...fieldErrors, message: null });
                  }}
                  maxLength={1000}
                  style={{ padding: '12px', border: '1px solid var(--line)', borderRadius: '4px', fontSize: '12px', outline: 'none', width: '100%' }}
                />
                {fieldErrors.message && <span style={{ color: '#e53e3e', fontSize: '11px', marginTop: '2px', display: 'block' }}>{fieldErrors.message}</span>}
              </div>

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

