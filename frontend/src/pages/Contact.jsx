import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { leadsApi } from '../api/leadsApi';
import Button from '../components/ui/Button';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await leadsApi.create({
        type: 'CONTACT',
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: `Subject: ${form.subject}\n\n${form.message}`,
      });
      if (res.data?.success) {
        setSubmitted(true);
      } else {
        setError('Could not send message. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contacts = [
    { icon: Phone, label: 'Private Concierge', value: '+91 98765 00000', href: 'tel:+919876500000' },
    { icon: Mail, label: 'Advisory Desk', value: 'advisory@fbdeveloper.in', href: 'mailto:advisory@fbdeveloper.in' },
    { icon: MapPin, label: 'Headquarters', value: 'Nariman Point, Mumbai 400021', href: '#' },
    { icon: Clock, label: 'Working Hours', value: 'Mon–Sat, 10:00 AM – 7:00 PM', href: '#' },
  ];

  return (
    <main style={{ paddingTop: '120px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', padding: '0 var(--gutter) 60px' }}>
        <p className="eyebrow">GET IN TOUCH</p>
        <h1 style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Helvetica Neue", sans-serif', fontSize: 'clamp(2rem, 5vw, 3.2rem)', marginBottom: '14px', marginTop: '8px' }}>
          Private Advisory Contact
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '14px', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
          Reach out to our Private Concierge for estate inquiries, site visit requests, NRI advisory, or media partnerships.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '60px', padding: '0 var(--gutter) 100px', maxWidth: '1280px', margin: '0 auto', alignItems: 'flex-start' }}>
        {/* Contact Info */}
        <div>
          <h2 style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Helvetica Neue", sans-serif', fontSize: '1.6rem', marginBottom: '28px' }}>Reach Us</h2>

          <div style={{ display: 'grid', gap: '24px', marginBottom: '40px' }}>
            {contacts.map(({ icon: Icon, label, value, href }) => (
              <div key={label} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f4f0ec', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  <Icon size={16} style={{ color: 'var(--color-accent)' }} />
                </div>
                <div>
                  <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '.07em', color: 'var(--muted)', marginBottom: '3px' }}>{label.toUpperCase()}</p>
                  <a href={href} style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)', textDecoration: 'none' }}>{value}</a>
                </div>
              </div>
            ))}
          </div>

          {/* Map Placeholder */}
          <div style={{
            height: '220px', borderRadius: '8px', background: 'linear-gradient(135deg, #f4f0ec, #e8e0d4)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            border: '1px solid var(--line)', gap: '10px',
          }}>
            <MapPin size={28} style={{ color: 'var(--color-accent)' }} />
            <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>F.B. Developer HQ</p>
            <p style={{ fontSize: '12px', color: 'var(--muted)' }}>Nariman Point, Mumbai</p>
          </div>
        </div>

        {/* Contact Form */}
        <div style={{ border: '1px solid var(--line)', borderRadius: '8px', padding: '40px' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <CheckCircle size={52} style={{ color: '#38A169', margin: '0 auto 16px' }} />
              <h2 style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Helvetica Neue", sans-serif', marginBottom: '10px' }}>Message Received</h2>
              <p style={{ color: 'var(--muted)', fontSize: '13px', lineHeight: 1.7 }}>
                Thank you, {form.name}. Our Private Advisory Desk will respond within one business day.
              </p>
            </div>
          ) : (
            <>
              <h2 style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Helvetica Neue", sans-serif', fontSize: '1.4rem', marginBottom: '24px' }}>Send a Private Enquiry</h2>

              {error && (
                <div className="auth-error" style={{ marginBottom: '16px' }}>
                  <AlertCircle size={16} /> <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label htmlFor="contact-name">Full Name *</label>
                    <input id="contact-name" name="name" type="text" required value={form.name} onChange={handleChange} placeholder="Your full name" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact-phone">Phone Number *</label>
                    <input id="contact-phone" name="phone" type="tel" required value={form.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="contact-email">Email Address *</label>
                  <input id="contact-email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="your@email.com" />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-subject">Subject</label>
                  <select id="contact-subject" name="subject" value={form.subject} onChange={handleChange} style={{ padding: '11px 12px', border: '1px solid var(--line)', borderRadius: '4px', fontSize: '13px', outline: 'none' }}>
                    <option value="">Select a topic</option>
                    <option value="Property Enquiry">Property Enquiry</option>
                    <option value="Site Visit Request">Site Visit Request</option>
                    <option value="NRI Advisory">NRI Advisory</option>
                    <option value="Valuation Request">Valuation Request</option>
                    <option value="Partnership">Partnership / Media</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="contact-message">Message *</label>
                  <textarea
                    id="contact-message" name="message" rows={4} required
                    value={form.message} onChange={handleChange}
                    placeholder="Tell us about your real estate requirements..."
                    style={{ padding: '12px', border: '1px solid var(--line)', borderRadius: '4px', fontSize: '13px', outline: 'none', resize: 'vertical' }}
                  />
                </div>

                <Button dark type="submit" disabled={loading} style={{ marginTop: '8px', width: '100%', justifyContent: 'center', gap: '8px' }}>
                  <Send size={14} /> {loading ? 'Sending...' : 'Send Private Enquiry'}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
