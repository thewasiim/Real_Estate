import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MessageSquare, Award, MapPin } from 'lucide-react';
import { agentsApi } from '../api/agentsApi';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';

export default function Agents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await agentsApi.getAll();
        if (res.data?.success) {
          setAgents(res.data.data.items || res.data.data || []);
        }
      } catch (err) {
        console.error('Failed to load agents:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <main style={{ paddingTop: '120px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', padding: '0 var(--gutter) 60px' }}>
        <p className="eyebrow" style={{ marginBottom: '10px' }}>OUR ADVISORS</p>
        <h1 style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Helvetica Neue", sans-serif', fontSize: 'clamp(2rem, 5vw, 3.2rem)', marginBottom: '14px' }}>
          The F.B. Developer Private Advisory Team
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '14px', maxWidth: '560px', margin: '0 auto', lineHeight: 1.7 }}>
          Each F.B. Developer specialist brings deep market expertise, curated connections, and a commitment to confidentiality for every client engagement.
        </p>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px,1fr))', gap: '28px', padding: '0 var(--gutter) 80px', maxWidth: '1280px', margin: '0 auto' }}>
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--line)' }}>
              <Skeleton style={{ height: '280px', width: '100%' }} />
              <div style={{ padding: '20px', display: 'grid', gap: '8px' }}>
                <Skeleton style={{ height: '22px', width: '60%' }} />
                <Skeleton style={{ height: '14px', width: '45%' }} />
                <Skeleton style={{ height: '36px', width: '100%' }} />
              </div>
            </div>
          ))
        ) : agents.length === 0 ? (
          <EmptyState title="No Agents Found" description="Our advisory team will be available shortly." />
        ) : (
          agents.map((agent) => (
            <article key={agent.id} style={{
              border: '1px solid var(--line)', borderRadius: '8px', overflow: 'hidden',
              background: '#fff', transition: 'box-shadow .3s',
            }}>
              <div style={{ height: '280px', overflow: 'hidden', position: 'relative', background: '#f4f0ec' }}>
                <img
                  src={agent.photoUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80'}
                  alt={agent.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                />
              </div>

              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h2 style={{ fontSize: '1.15rem', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Helvetica Neue", sans-serif', marginBottom: '4px' }}>{agent.name}</h2>
                    <p style={{ fontSize: '11px', color: 'var(--color-accent)', fontWeight: 700, letterSpacing: '.06em' }}>{agent.role}</p>
                  </div>
                  {agent.experienceYears && (
                    <span style={{
                      display: 'flex', alignItems: 'center', gap: '4px',
                      fontSize: '11px', color: 'var(--muted)',
                      border: '1px solid var(--line)', borderRadius: '3px', padding: '3px 8px',
                    }}>
                      <Award size={11} /> {agent.experienceYears}y exp
                    </span>
                  )}
                </div>

                {agent.city && (
                  <p style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--muted)', marginBottom: '16px' }}>
                    <MapPin size={13} /> {agent.city}
                  </p>
                )}

                <div style={{ display: 'flex', gap: '8px' }}>
                  <a
                    href={`tel:${agent.phone}`}
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                      padding: '9px', border: '1px solid var(--line)', borderRadius: '4px',
                      fontSize: '11px', fontWeight: 700, color: 'var(--ink)', textDecoration: 'none',
                    }}
                  >
                    <Phone size={12} /> Call
                  </a>
                  <a
                    href={`mailto:${agent.email}`}
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                      padding: '9px', border: '1px solid var(--line)', borderRadius: '4px',
                      fontSize: '11px', fontWeight: 700, color: 'var(--ink)', textDecoration: 'none',
                    }}
                  >
                    <Mail size={12} /> Email
                  </a>
                  {agent.whatsapp && (
                    <a
                      href={`https://wa.me/${agent.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                        padding: '9px', background: '#25D366', borderRadius: '4px',
                        fontSize: '11px', fontWeight: 700, color: '#fff', textDecoration: 'none',
                      }}
                    >
                      <MessageSquare size={12} /> WhatsApp
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </main>
  );
}
