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
    <main className="standard-page" style={{ paddingTop: 'calc(var(--nav-height) + 30px)', paddingBottom: '80px' }}>
      {/* Header */}
      <div className="page-intro" style={{ textAlign: 'center', padding: '0 var(--gutter) 48px', maxWidth: '600px', margin: '0 auto' }}>
        <p className="eyebrow">GET IN TOUCH</p>
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', marginBottom: '12px', marginTop: '8px' }}>
          Private Advisory Contact
        </h1>
        <p style={{ color: 'var(--color-ink-muted)', fontSize: '14px', lineHeight: 1.6 }}>
          Reach out to our Private Concierge for estate inquiries, site visit requests, NRI advisory, or media partnerships.
        </p>
      </div>

      <div className="contact-layout">
        {/* Contact Info */}
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>Reach Us</h2>

          <div style={{ display: 'grid', gap: '20px', marginBottom: '36px' }}>
            {contacts.map(({ icon: Icon, label, value, href }) => (
              <div key={label} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-bg-alt)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  <Icon size={16} style={{ color: 'var(--color-accent)' }} />
                </div>
                <div>
                  <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '.07em', color: 'var(--color-ink-muted)', marginBottom: '3px' }}>{label.toUpperCase()}</p>
                  <a href={href} style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-ink)', textDecoration: 'none', wordBreak: 'break-word' }}>{value}</a>
                </div>
              </div>
            ))}
          </div>

          {/* Map Placeholder */}
          <div style={{
            height: '200px', borderRadius: 'var(--radius-md)', background: 'var(--color-bg-alt)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            border: '1px solid var(--color-border)', gap: '8px',
          }}>
            <MapPin size={26} style={{ color: 'var(--color-accent)' }} />
            <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-ink)' }}>F.B. Developer HQ</p>
            <p style={{ fontSize: '12px', color: 'var(--color-ink-muted)' }}>Nariman Point, Mumbai</p>
          </div>
        </div>

        {/* Contact Form Container */}
        <div>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '30px 0' }}>
              <CheckCircle size={48} style={{ color: '#38A169', margin: '0 auto 16px' }} />
              <h2>Message Received</h2>
              <p style={{ color: 'var(--color-ink-muted)', fontSize: '13px', lineHeight: 1.6, marginTop: '8px' }}>
                Thank you, {form.name}. Our Private Advisory Desk will respond within one business day.
              </p>
            </div>
          ) : (
            <>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '20px' }}>Send a Private Enquiry</h2>

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
                  <select id="contact-subject" name="subject" value={form.subject} onChange={handleChange}>
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
