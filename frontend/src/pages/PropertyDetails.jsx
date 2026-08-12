import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin, Bed, Bath, Maximize2, Car, Heart, Scale, Share2,
  Check, Phone, MessageSquare, ShieldCheck, Compass, Sparkles, X
} from 'lucide-react';
import { propertiesApi } from '../api/propertiesApi';
import { formatCurrency } from '../utils/formatCurrency';
import { calculateEMI } from '../utils/emiCalculator';
import { useFavorites } from '../context/FavoritesContext';
import { useCompare } from '../context/CompareContext';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import ScheduleVisitModal from '../components/property/ScheduleVisitModal';
import Button from '../components/ui/Button';
import NotFound from './NotFound';
import EmptyState from '../components/ui/EmptyState';

export default function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState('');

  // Modals & Gallery
  const [isVisitOpen, setIsVisitOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Contexts
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isInCompare, addToCompare, removeFromCompare } = useCompare();
  const { addRecentlyViewed } = useRecentlyViewed();

  // EMI Calculator state
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);

  useEffect(() => {
    async function loadProperty() {
      setLoading(true);
      setNotFound(false);
      setError('');
      try {
        const res = await propertiesApi.getById(id);
        if (res.data?.success && res.data.data) {
          const propData = res.data.data;
          setProperty(propData);
          addRecentlyViewed(propData.id);
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.error('Failed to load property details:', err);
        if (err.response?.status === 404) setNotFound(true);
        else setError(err.response?.data?.error || 'Unable to load this property. Check your connection and try again.');
      } finally {
        setLoading(false);
      }
    }

    if (id) loadProperty();
  }, [id, addRecentlyViewed]);

  if (loading) {
    return (
      <div className="route-loading">
        <div className="spinner" />
      </div>
    );
  }

  if (error) {
    return <main className="detail"><EmptyState title="Unable to load property" description={error} actionLabel="Try Again" onAction={() => window.location.reload()} /></main>;
  }

  if (notFound || !property) {
    return <NotFound />;
  }

  const isFav = isFavorite(property.id);
  const isComp = isInCompare(property.id);

  const toggleCompare = (p) => {
    if (isComp) {
      removeFromCompare(p.id);
    } else {
      addToCompare(p.id);
    }
  };

  // Gallery
  const images = property.images && property.images.length > 0
    ? property.images
    : ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'];

  // EMI Calculations
  const downPayment = (property.price * downPaymentPercent) / 100;
  const loanAmount = Math.max(0, property.price - downPayment);
  const monthlyEmi = calculateEMI(loanAmount, interestRate, tenureYears);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          url: window.location.href,
        });
      } catch (e) {
        /* ignore */
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <main className="detail">
      {/* ── 1. Image Gallery Section ──────────────────────────────────── */}
      <section className="gallery">
        <a href={images[0]} target="_blank" rel="noopener noreferrer">
          <img
            src={images[0]}
            alt={property.title}
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80';
            }}
            onClick={() => setLightboxIndex(0)}
          />
        </a>
        {images.slice(1, 3).map((img, idx) => (
          <a href={img} key={idx} target="_blank" rel="noopener noreferrer">
            <img
              src={img}
              alt={`${property.title} preview ${idx + 2}`}
              onClick={() => setLightboxIndex(idx + 1)}
            />
          </a>
        ))}

        <button type="button" onClick={() => setLightboxIndex(0)}>
          <Sparkles size={14} /> View All Photos ({images.length})
        </button>
      </section>

      {/* ── 2. Detail Wrapper Layout ──────────────────────────────────── */}
      <div className="detail-wrap">
        {/* Main Left Column */}
        <div className="detail-main">
          {/* Header */}
          <div className="detail-heading">
            <div>
              <p className="eyebrow">{property.type.toUpperCase()} • {property.status.toUpperCase()}</p>
              <h1>{property.title}</h1>
              <p>
                <MapPin size={16} />
                <span>{property.address || `${property.locality}, ${property.city}`}</span>
              </p>
            </div>
            <div className="detail-price">
              {formatCurrency(property.price)}
              {property.listingType === 'RENT' && <span>per month</span>}
            </div>
          </div>

          {/* Specs Row */}
          <div className="detail-specs">
            <span><Bed size={18} /> {property.bhk} Bedrooms</span>
            <span><Bath size={18} /> {property.bathrooms} Bathrooms</span>
            <span><Maximize2 size={18} /> {property.area} {property.areaUnit || 'sqft'}</span>
            <span><Car size={18} /> {property.parking} Parking</span>
            <span><Compass size={18} /> {property.furnishing}</span>
          </div>

          {/* Description */}
          <div className="info-block">
            <h2>About This Residence</h2>
            <p>{property.description}</p>
          </div>

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="info-block">
              <h2>Amenities & Luxury Features</h2>
              <div className="detail-amenities">
                {property.amenities.map((amenity, index) => (
                  <span key={index}>
                    <ShieldCheck size={16} /> {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Nearby Landmarks */}
          {(property.nearbySchools?.length > 0 || property.nearbyHospitals?.length > 0 || property.nearbyMetro?.length > 0) && (
            <div className="info-block">
              <h2>Location Highlights</h2>
              <div className="nearby">
                {property.nearbySchools?.length > 0 && (
                  <div>
                    <b>Education</b>
                    <span>{property.nearbySchools.join(', ')}</span>
                  </div>
                )}
                {property.nearbyHospitals?.length > 0 && (
                  <div>
                    <b>Healthcare</b>
                    <span>{property.nearbyHospitals.join(', ')}</span>
                  </div>
                )}
                {property.nearbyMetro?.length > 0 && (
                  <div>
                    <b>Transit</b>
                    <span>{property.nearbyMetro.join(', ')}</span>
                  </div>
                )}
              </div>

              {/* Map Placeholder */}
              <div className="mini-map">
                <MapPin size={20} />
                <span>Location: {property.locality}, {property.city}</span>
              </div>
            </div>
          )}

          {/* Interactive EMI Calculator Widget */}
          <div className="info-block emi-section">
            <div className="emi-section-heading"><div><p className="eyebrow">FINANCING OVERVIEW</p><h2>Mortgage & EMI Estimator</h2></div><span className="emi-live">Live estimate</span></div>
            <div className="emi">
              <div className="emi-payment"><span>Estimated monthly payment</span><strong>{formatCurrency(monthlyEmi)}</strong><small>per month</small></div>
              <div className="emi-controls">
                <label className="emi-control"><span className="emi-control-label">Down payment</span><strong>{downPaymentPercent}% <small>{formatCurrency(downPayment)}</small></strong><input className="emi-range" type="range" min="10" max="50" step="5" value={downPaymentPercent} style={{ '--range-progress': ((downPaymentPercent - 10) / 40) * 100 + '%' }} onChange={(e) => setDownPaymentPercent(Number(e.target.value))} /><span className="emi-range-scale"><small>10%</small><small>50%</small></span></label>
                <label className="emi-control"><span className="emi-control-label">Interest rate</span><strong>{interestRate}% <small>p.a.</small></strong><input className="emi-range" type="range" min="6" max="14" step="0.25" value={interestRate} style={{ '--range-progress': ((interestRate - 6) / 8) * 100 + '%' }} onChange={(e) => setInterestRate(Number(e.target.value))} /><span className="emi-range-scale"><small>6%</small><small>14%</small></span></label>
                <label className="emi-control"><span className="emi-control-label">Loan tenure</span><strong>{tenureYears} <small>years</small></strong><input className="emi-range" type="range" min="5" max="30" step="5" value={tenureYears} style={{ '--range-progress': ((tenureYears - 5) / 25) * 100 + '%' }} onChange={(e) => setTenureYears(Number(e.target.value))} /><span className="emi-range-scale"><small>5 years</small><small>30 years</small></span></label>
              </div>
              <div className="emi-principal"><span>Principal loan amount</span><strong>{formatCurrency(loanAmount)}</strong></div>
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <aside className="detail-side">
          {/* Actions & Schedule Visit */}
          <div className="contact-card">
            <p className="eyebrow">PRIVATE ADVISORY</p>
            <h3>Schedule a Personal Tour</h3>
            <Button dark className="w-full" onClick={() => setIsVisitOpen(true)}>
              Book Site Visit
            </Button>

            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <button
                type="button"
                className="call"
                onClick={() => toggleFavorite(property)}
                style={{ color: isFav ? '#E53E3E' : 'inherit' }}
              >
                <Heart size={16} fill={isFav ? '#E53E3E' : 'none'} />
                {isFav ? 'Saved' : 'Favorite'}
              </button>

              <button
                type="button"
                className="call"
                onClick={() => toggleCompare(property)}
                style={{ color: isComp ? '#0071E3' : 'inherit' }}
              >
                <Scale size={16} />
                {isComp ? 'In Compare' : 'Compare'}
              </button>

              <button type="button" className="call" onClick={handleShare}>
                <Share2 size={16} />
                {copiedLink ? 'Copied!' : 'Share'}
              </button>
            </div>
          </div>

          {/* Agent Card */}
          <div className="contact-card exclusive-agent">
            <p className="eyebrow">EXCLUSIVE AGENT</p>
            {property.agent ? (
              <>
                <div className="agent">
                  <img
                    src={property.agent.photoUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80'}
                    alt={property.agent.name}
                  />
                  <div>
                    <b>{property.agent.name}</b>
                    <span>{property.agent.role || 'Senior Luxury Specialist'}</span>
                  </div>
                </div>

                <div className="exclusive-agent-actions">
                  <a href={`tel:${property.agent.phone}`} className="call">
                    <Phone size={14} /> Call Agent
                  </a>
                  <a
                  href={`https://wa.me/${property.agent.whatsapp?.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whatsapp"
                >
                  <MessageSquare size={14} /> WhatsApp Specialist
                  </a>
                </div>
              </>
            ) : (
              <div className="agent">
                <div>
                  <b>F.B. Developer Concierge Desk</b>
                  <span>Private Advisory Partner</span>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Schedule Visit Modal */}
      {isVisitOpen && (
        <ScheduleVisitModal
          isOpen={isVisitOpen}
          onClose={() => setIsVisitOpen(false)}
          property={property}
        />
      )}

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div className="lightbox" onClick={() => setLightboxIndex(null)}>
          <button type="button" onClick={() => setLightboxIndex(null)}>
            <X size={28} />
          </button>
          <img
            src={images[lightboxIndex]}
            alt={`Full size view ${lightboxIndex + 1}`}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </main>
  );
}
