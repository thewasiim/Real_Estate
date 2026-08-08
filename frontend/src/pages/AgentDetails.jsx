import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  MessageSquare,
  Award,
  MapPin,
  Building2,
  ArrowLeft,
  Loader2,
  Star,
  AlertCircle,
} from 'lucide-react';
import { agentsApi } from '../api/agentsApi';

export default function AgentDetails() {
  const { id } = useParams();
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await agentsApi.getById(id);
        if (res.data?.success) {
          setAgent(res.data.data);
        } else {
          setError('Agent not found.');
        }
      } catch (err) {
        console.error(err);
        setError('Could not load advisor profile. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <main style={{ paddingTop: '120px', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <Loader2 size={32} className="animate-spin" style={{ color: 'var(--color-accent)' }} />
          <p style={{ color: 'var(--muted)', fontSize: '13px' }}>Loading advisor profile...</p>
        </div>
      </main>
    );
  }

  if (error || !agent) {
    return (
      <main style={{ paddingTop: '120px', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: '400px', padding: '0 24px' }}>
          <AlertCircle size={40} style={{ color: 'var(--muted)', marginBottom: '16px' }} />
          <h2 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>Advisor Not Found</h2>
          <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '24px' }}>{error}</p>
          <Link to="/agents" className="btn btn-dark" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <ArrowLeft size={16} /> Back to Advisors
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ paddingTop: '100px', paddingBottom: '80px' }}>
      {/* Back breadcrumb */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 var(--gutter) 32px' }}>
        <Link
          to="/agents"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--muted)', fontSize: '12px', fontWeight: 600, textDecoration: 'none', letterSpacing: '.04em' }}
        >
          <ArrowLeft size={14} /> ALL ADVISORS
        </Link>
      </div>

      {/* Profile Hero */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 var(--gutter) 60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,2fr) minmax(0,3fr)', gap: '64px', alignItems: 'start' }}>

          {/* Photo Card */}
          <div>
            <div style={{ borderRadius: '12px', overflow: 'hidden', background: '#f4f0ec', aspectRatio: '3/4', position: 'relative' }}>
              <img
                src={agent.photoUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80'}
                alt={agent.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
              />
            </div>
          </div>

          {/* Info */}
          <div style={{ paddingTop: '12px' }}>
            <p className="eyebrow" style={{ marginBottom: '8px' }}>PRIVATE ADVISOR</p>
            <h1 style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Helvetica Neue", sans-serif', fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.15, marginBottom: '12px' }}>
              {agent.name}
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--color-accent)', fontWeight: 700, letterSpacing: '.06em', marginBottom: '24px' }}>
              {agent.role}
            </p>

            {/* Quick Stats */}
            <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', paddingBottom: '32px', borderBottom: '1px solid var(--line)' }}>
              {agent.experienceYears && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.04em' }}>{agent.experienceYears}+</span>
                  <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600, letterSpacing: '.06em' }}>YEARS EXP.</span>
                </div>
              )}
              {agent.properties?.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.04em' }}>{agent.properties.length}</span>
                  <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600, letterSpacing: '.06em' }}>LISTINGS</span>
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', gap: '2px', color: '#F59E0B' }}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600, letterSpacing: '.06em' }}>5.0 RATING</span>
              </div>
            </div>

            {/* Location */}
            {agent.city && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', color: 'var(--muted)', fontSize: '13px' }}>
                <MapPin size={15} />
                <span>{agent.city}</span>
              </div>
            )}

            {/* Contact Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '32px' }}>
              <a
                href={`tel:${agent.phone}`}
                className="btn btn-dark"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
              >
                <Phone size={15} /> Call Directly
              </a>
              <a
                href={`mailto:${agent.email}`}
                className="btn btn-outline"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
              >
                <Mail size={15} /> Send Email
              </a>
              {agent.whatsapp && (
                <a
                  href={`https://wa.me/${agent.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '10px 20px', background: '#25D366', color: '#fff',
                    border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 700,
                    textDecoration: 'none', cursor: 'pointer',
                  }}
                >
                  <MessageSquare size={15} /> WhatsApp
                </a>
              )}
            </div>

            {/* Email info pill */}
            <div style={{ padding: '14px 18px', background: 'var(--surface)', borderRadius: '8px', border: '1px solid var(--line)', fontSize: '12px', color: 'var(--muted)' }}>
              <strong style={{ color: 'var(--ink)' }}>Direct Email:</strong> {agent.email}
            </div>
          </div>
        </div>
      </section>

      {/* Agent's Listings */}
      {agent.properties && agent.properties.length > 0 && (
        <section style={{ background: 'var(--surface)', padding: '60px 0' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 var(--gutter)' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '36px' }}>
              <div>
                <p className="eyebrow" style={{ marginBottom: '6px' }}>PORTFOLIO</p>
                <h2 style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Helvetica Neue", sans-serif', fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
                  {agent.name.split(' ')[0]}'s Active Listings
                </h2>
              </div>
              <Link to="/properties" style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600, textDecoration: 'none', letterSpacing: '.04em' }}>
                VIEW ALL PROPERTIES →
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
              {agent.properties.map((prop) => (
                <Link
                  key={prop.id}
                  to={`/properties/${prop.id}`}
                  style={{ textDecoration: 'none', display: 'block' }}
                >
                  <article style={{
                    border: '1px solid var(--line)', borderRadius: '10px', overflow: 'hidden',
                    background: '#fff', transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.1)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <div style={{ height: '200px', overflow: 'hidden', background: '#f4f0ec' }}>
                      {prop.images?.[0] ? (
                        <img src={prop.images[0]} alt={prop.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>
                          <Building2 size={32} />
                        </div>
                      )}
                    </div>
                    <div style={{ padding: '18px' }}>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '4px', color: 'var(--ink)' }}>{prop.title}</h3>
                      <p style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '10px' }}>{prop.city}, {prop.locality}</p>
                      <p style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.02em' }}>
                        ₹{prop.price?.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
