import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Calendar, Building, ChevronRight } from 'lucide-react';
import { projectsApi } from '../api/projectsApi';
import { formatCurrency } from '../utils/formatCurrency';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';

const CITIES = ['', 'Mumbai', 'Delhi NCR', 'Goa', 'Bangalore'];

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await projectsApi.getAll({ city: city || undefined });
        if (res.data?.success) {
          setProjects(res.data.data.items || res.data.data || []);
        }
      } catch (err) {
        console.error('Failed to load projects:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [city]);

  return (
    <main className="listing">
      <div className="listing-head">
        <p className="eyebrow">ICONIC DEVELOPMENTS</p>
        <h1>Landmark Real Estate Projects</h1>
        <p>Pre-launch, under-construction, and ready flagship developments by India's premier builders.</p>
      </div>

      {/* City Filter Pills */}
      <div className="city-pills-wrap">
        {CITIES.map((c) => (
          <button
            key={c}
            type="button"
            className={`city-pill ${city === c ? 'active' : ''}`}
            onClick={() => setCity(c)}
          >
            {c || 'All Cities'}
          </button>
        ))}
      </div>

      {/* Grid Content */}
      <div className="projects-container">
        {loading ? (
          <div className="project-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="project-card-skeleton">
                <Skeleton style={{ height: '240px', width: '100%' }} />
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <Skeleton style={{ height: '18px', width: '35%' }} />
                  <Skeleton style={{ height: '28px', width: '80%' }} />
                  <Skeleton style={{ height: '14px', width: '55%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <EmptyState
            title="No Projects Found"
            description="There are currently no flagship projects matching the selected city filter."
            actionLabel="View All Cities"
            onAction={() => setCity('')}
          />
        ) : (
          <div className="project-grid">
            {projects.map((proj) => {
              const projectPath = `/projects/${proj.id}`;
              return (
              <article key={proj.id} className="project-card">
                <Link to={projectPath} className="project-img-wrap project-image-link cursor-pointer" aria-label={`View ${proj.name}`}>
                  <img
                    src={proj.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'}
                    alt={proj.name}
                  />
                  <span className="badge">
                    {proj.statusStage?.toUpperCase() || 'UPCOMING'}
                  </span>
                </Link>

                <div className="project-card-body">
                  <p className="eyebrow" style={{ marginBottom: '4px' }}>
                    {proj.builder} • {proj.city}
                  </p>
                  <h3>{proj.name}</h3>

                  <div className="project-card-meta">
                    <span>
                      <MapPin size={13} /> {proj.locality || proj.city}
                    </span>
                    {proj.possessionDate && (
                      <span>
                        <Calendar size={13} /> Possession:{' '}
                        {new Date(proj.possessionDate).toLocaleDateString('en-IN', {
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    )}
                  </div>

                  {/* Price Row */}
                  <div className="project-price-row">
                    <div>
                      <small>STARTING FROM</small>
                      <strong>{formatCurrency(proj.startingPrice)}</strong>
                    </div>
                  </div>

                  {/* Status Possession Timeline (§11) */}
                  <div className="project-timeline">
                    <span className="step done">RERA Approved</span>
                    <span className="step current">Under Construction</span>
                    <span className="step">Ready 2028</span>
                  </div>

                  <Link to={projectPath} className="btn btn-dark view-project-btn">
                    View Project <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
