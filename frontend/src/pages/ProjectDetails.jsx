import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Calendar, Building, CheckCircle, ArrowLeft } from 'lucide-react';
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
    <main className="project-detail">
      {/* Hero */}
      <section className="project-hero">
        <img src={coverImg} alt={project.name} />
        <div className="project-hero-shade" />
        <div className="project-hero-content">
          <p className="eyebrow light" style={{ marginBottom: '8px' }}>{project.city} · {project.statusStage}</p>
          <h1 className="project-hero-title">{project.name}</h1>
          <p style={{ fontSize: '14px', opacity: 0.85 }}>By {project.builder}</p>
        </div>
      </section>

      <div className="project-detail-layout">
        {/* Main Content */}
        <div className="project-detail-main">
          <Link to="/projects" className="project-back-link">
            <ArrowLeft size={14} /> Back to Projects
          </Link>

          {/* Quick Stats */}
          <div className="project-stats-grid">
            {[
              { label: 'Starting Price', value: formatCurrency(project.startingPrice) },
              { label: 'Possession', value: project.possessionDate ? new Date(project.possessionDate).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : '—' },
              { label: 'Status', value: project.statusStage || '—' },
            ].map(({ label, value }) => (
              <div key={label} className="project-stat-card">
                <p className="project-stat-label">{label.toUpperCase()}</p>
                <p className="project-stat-value">{value}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="info-block">
            <h2>About {project.name}</h2>
            <p style={{ color: 'var(--muted)', lineHeight: 1.75, fontSize: '14px', overflowWrap: 'break-word' }}>{project.description}</p>
          </div>

          {/* Amenities */}
          {project.amenities?.length > 0 && (
            <div className="info-block">
              <h2>World-Class Amenities</h2>
              <div className="project-amenities-grid">
                {project.amenities.map((a, i) => (
                  <span key={i} className="project-amenity-item">
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
              <div className="project-units-flex">
                {project.unitTypes.map((u, i) => (
                  <span key={i} className="project-unit-badge">
                    {u}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="project-detail-sidebar">
          <div className="contact-card">
            <p className="eyebrow">REGISTER INTEREST</p>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>Get Exclusive Updates</h3>
            <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '16px', lineHeight: 1.6 }}>
              Be first to receive floor plan releases, launch pricing, and private previews for this development.
            </p>
            <Button dark style={{ width: '100%', justifyContent: 'center' }} onClick={() => setIsModalOpen(true)}>
              Register Your Interest
            </Button>
          </div>

          <div className="contact-card">
            <p className="eyebrow">PROJECT DETAILS</p>
            <div style={{ display: 'grid', gap: '10px', fontSize: '13px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--muted)', overflowWrap: 'anywhere' }}>
                <MapPin size={14} style={{ flexShrink: 0 }} /> {project.locality}, {project.city}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--muted)', overflowWrap: 'anywhere' }}>
                <Building size={14} style={{ flexShrink: 0 }} /> Builder: {project.builder}
              </div>
              {project.possessionDate && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--muted)', overflowWrap: 'anywhere' }}>
                  <Calendar size={14} style={{ flexShrink: 0 }} /> Possession: {new Date(project.possessionDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
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

