import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Calendar, Building, CheckCircle, Phone, ArrowLeft } from 'lucide-react';
import { projectsApi } from '../api/projectsApi';
import { formatCurrency } from '../utils/formatCurrency';
import BookVisitModal from '../components/shared/BookVisitModal';
import Button from '../components/ui/Button';
import NotFound from './NotFound';

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await projectsApi.getById(id);
        if (res.data?.success && res.data.data) {
          setProject(res.data.data);
        } else {
          setNotFound(true);
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  if (loading) {
    return <div className="route-loading"><div className="spinner" /></div>;
  }

  if (notFound || !project) return <NotFound />;

  const coverImg = project.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=80';

  return (
    <main style={{ paddingTop: '80px' }}>
      {/* Hero */}
      <section style={{ position: 'relative', height: '420px', overflow: 'hidden' }}>
        <img src={coverImg} alt={project.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #111 0%, transparent 60%)' }} />
        <div style={{ position: 'absolute', bottom: '40px', left: 'var(--gutter)', color: '#fff' }}>
          <p className="eyebrow light" style={{ marginBottom: '8px' }}>{project.city} · {project.statusStage}</p>
          <h1 style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Helvetica Neue", sans-serif', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginBottom: '4px' }}>{project.name}</h1>
          <p style={{ fontSize: '14px', opacity: 0.8 }}>By {project.builder}</p>
        </div>
      </section>

      <div style={{ padding: '48px var(--gutter)', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '40px', maxWidth: '1280px', margin: '0 auto' }}>
        {/* Main */}
        <div>
          <Link to="/projects" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--muted)', marginBottom: '24px', textDecoration: 'none' }}>
            <ArrowLeft size={14} /> Back to Projects
          </Link>

          {/* Quick Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '36px' }}>
            {[
              { label: 'Starting Price', value: formatCurrency(project.startingPrice) },
              { label: 'Possession', value: project.possessionDate ? new Date(project.possessionDate).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : '—' },
              { label: 'Status', value: project.statusStage || '—' },
            ].map(({ label, value }) => (
              <div key={label} style={{ border: '1px solid var(--line)', borderRadius: '6px', padding: '16px 20px' }}>
                <p style={{ fontSize: '10px', color: 'var(--muted)', fontWeight: 700, letterSpacing: '.06em', marginBottom: '6px' }}>{label.toUpperCase()}</p>
                <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--ink)' }}>{value}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="info-block">
            <h2>About {project.name}</h2>
            <p style={{ color: 'var(--muted)', lineHeight: 1.75, fontSize: '14px' }}>{project.description}</p>
          </div>

          {/* Amenities */}
          {project.amenities?.length > 0 && (
            <div className="info-block">
              <h2>World-Class Amenities</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '10px' }}>
                {project.amenities.map((a, i) => (
                  <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--ink)' }}>
                    <CheckCircle size={15} style={{ color: 'var(--color-accent)', flexShrink: 0 }} /> {a}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Unit Types */}
          {project.unitTypes?.length > 0 && (
            <div className="info-block">
              <h2>Available Configurations</h2>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {project.unitTypes.map((u, i) => (
                  <span key={i} style={{
                    padding: '8px 18px', borderRadius: '4px',
                    border: '1px solid var(--color-accent)', color: 'var(--color-accent)',
                    fontWeight: 700, fontSize: '12px',
                  }}>
                    {u}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside style={{ position: 'sticky', top: '100px', alignSelf: 'start', display: 'grid', gap: '20px' }}>
          <div className="contact-card">
            <p className="eyebrow">REGISTER INTEREST</p>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>Get Exclusive Updates</h3>
            <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '16px' }}>
              Be first to receive floor plan releases, launch pricing, and private previews for this development.
            </p>
            <Button dark style={{ width: '100%', justifyContent: 'center' }} onClick={() => setIsModalOpen(true)}>
              Register Your Interest
            </Button>
          </div>

          <div className="contact-card">
            <p className="eyebrow">PROJECT DETAILS</p>
            <div style={{ display: 'grid', gap: '10px', fontSize: '13px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--muted)' }}>
                <MapPin size={14} /> {project.locality}, {project.city}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--muted)' }}>
                <Building size={14} /> Builder: {project.builder}
              </div>
              {project.possessionDate && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--muted)' }}>
                  <Calendar size={14} /> Possession: {new Date(project.possessionDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>

      {isModalOpen && (
        <BookVisitModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      )}
    </main>
  );
}
