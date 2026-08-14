import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  ShieldCheck,
  Compass,
  Award,
  Key,
  MapPin,
  Building,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Wifi,
  Car,
  Tv,
  Coffee,
  Trees,
  Layers,
  ArrowUpRight,
  Calendar
} from 'lucide-react';
import { propertiesApi } from '../api/propertiesApi';
import { projectsApi } from '../api/projectsApi';
import PropertyCard from '../components/property/PropertyCard';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import BookVisitModal from '../components/shared/BookVisitModal';
import { formatCurrency } from '../utils/formatCurrency';

// Categories (§7: category icons inside soft rounded tile --color-bg-alt background, gold icon)
const CATEGORIES = [
  { title: 'Sky Penthouses', count: '14 Estates', icon: Building, link: '/properties?type=Apartment' },
  { title: 'Private Villas', count: '22 Estates', icon: Trees, link: '/properties?type=Villa' },
  { title: 'Oceanfront Sanctuaries', count: '8 Estates', icon: Compass, link: '/properties?city=Goa' },
  { title: 'Commercial Assets', count: '11 Assets', icon: Layers, link: '/properties?type=Commercial' }
];

// Locations Grid
const LOCATIONS = [
  { name: 'Mumbai', count: '48 Luxury Residences', img: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80', query: 'Mumbai' },
  { name: 'Delhi NCR', count: '34 Flagship Projects', img: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80', query: 'Delhi NCR' },
  { name: 'Goa', count: '19 Beachside Estates', img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80', query: 'Goa' }
];

// Curated Amenities
const AMENITIES = [
  { name: 'Infinity Pools', icon: Sparkles },
  { name: 'Private Helipads', icon: Compass },
  { name: 'Concierge & Valet', icon: Key },
  { name: 'Smart Home Automation', icon: Wifi },
  { name: 'Private Elevators', icon: Building },
  { name: 'Multi-Car Garages', icon: Car },
  { name: 'Private Wine Cellars', icon: Coffee },
  { name: 'Private Theater Screens', icon: Tv },
  { name: 'Manicured Zen Gardens', icon: Trees },
  { name: '24/7 Armed Security', icon: ShieldCheck }
];

// FAQ List
const FAQS = [
  {
    q: 'How does F.B. Developer verify luxury property listings?',
    a: 'Every property listed on F.B. Developer undergoes a rigorous multi-stage verification process including legal title search, physical inspection by senior advisors, RERA verification, and architectural valuation.'
  },
  {
    q: 'Does F.B. Developer offer private off-market property representation?',
    a: 'Yes. Over 30% of our portfolio consists of confidential off-market estates. We coordinate private non-disclosure viewings for HNWIs and institutional buyers.'
  },
  {
    q: 'What is the site visit booking process?',
    a: 'Simply click "Book Site Visit" on any property page or top bar. Our dedicated relationship manager will arrange private chauffeur transportation and a confidential walkthrough at your convenience.'
  },
  {
    q: 'Are overseas NRIs supported with tax and legal compliance?',
    a: 'Our advisory team includes dedicated cross-border legal consultants specializing in FEMA regulations, tax compliance, and repatriation of funds for international buyers.'
  }
];

// Blog Posts
const BLOG_POSTS = [
  {
    id: 1,
    title: 'The Rise of Ultra-Luxury Penthouses in South Mumbai',
    category: 'MARKET INSIGHTS',
    date: 'August 2026',
    img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    title: 'Architecture & Nature: Designing Modern Goa Villas',
    category: 'DESIGN ARCHITECTURE',
    date: 'July 2026',
    img: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    title: 'Key Trends Shaping India’s High-Net-Worth Real Estate in 2026',
    category: 'WEALTH & REALTY',
    date: 'July 2026',
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
  }
];

export default function Home() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loadingProps, setLoadingProps] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(true);

  // Search State
  const [listingType, setListingType] = useState('BUY');
  const [city, setCity] = useState('');
  const [type, setType] = useState('');
  const [bhk, setBhk] = useState('');

  // Modals & FAQ Toggles
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    async function fetchHomeData() {
      try {
        const propRes = await propertiesApi.getAll({ limit: 3, sort: 'popularityScore_desc' });
        if (propRes.data?.success) {
          setProperties(propRes.data.data.items || []);
        }
      } catch (err) {
        console.error('Failed to load featured properties:', err);
      } finally {
        setLoadingProps(false);
      }

      try {
        const projRes = await projectsApi.getAll({ limit: 3 });
        if (projRes.data?.success) {
          setProjects(projRes.data.data.items || []);
        }
      } catch (err) {
        console.error('Failed to load iconic projects:', err);
      } finally {
        setLoadingProjects(false);
      }
    }

    fetchHomeData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (listingType) queryParams.set('listingType', listingType);
    if (city) queryParams.set('city', city);
    if (type) queryParams.set('type', type);
    if (bhk) queryParams.set('bhk', bhk);

    navigate(`/properties?${queryParams.toString()}`);
  };

  return (
    <main className="home-page">
      {/* ── 1. Hero Section (design.md §8, §9) ────────────────────────────────── */}
      <section className="hero">
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80"
          alt="Luxury Architecture"
        />
        <div className="hero-shade" />

        <div className="hero-content">
          <p className="eyebrow light">CURATED LUXURY REAL ESTATE</p>
          <h1>Extraordinary Homes, Thoughtfully Found</h1>
          <p className="hero-copy">
            A bespoke portfolio of India's finest architectural estates, oceanfront penthouses, and sanctuary villas.
          </p>

          <div className="hero-ctas">
            <Link to="/properties">
              <Button dark>
                Explore Collection <ArrowRight size={16} />
              </Button>
            </Link>
            <Button outlineLight onClick={() => setIsBookModalOpen(true)}>
              Book Site Visit
            </Button>
          </div>
        </div>

        {/* Restricted Glassmorphic Search Bar over Hero (design.md §6) */}
        <div className="hero-search">
          <form onSubmit={handleSearchSubmit} className="searchbox">
            <div className="search-tabs">
              <button
                type="button"
                className={listingType === 'BUY' ? 'active' : ''}
                onClick={() => setListingType('BUY')}
              >
                BUY
              </button>
              <button
                type="button"
                className={listingType === 'RENT' ? 'active' : ''}
                onClick={() => setListingType('RENT')}
              >
                RENT
              </button>
            </div>

            <div className="search-fields">
              <label className="search-field-label">
                <div className="search-field-text">
                  <span className="search-field-title">City</span>
                  <b className="search-field-value">{city || 'All Cities'}</b>
                </div>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="search-select-overlay"
                >
                  <option value="">All Cities</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi NCR">Delhi NCR</option>
                  <option value="Goa">Goa</option>
                  <option value="Bangalore">Bangalore</option>
                </select>
                <MapPin size={18} className="search-field-icon" />
              </label>

              <label className="search-field-label">
                <div className="search-field-text">
                  <span className="search-field-title">Property Type</span>
                  <b className="search-field-value">{type || 'Any Type'}</b>
                </div>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="search-select-overlay"
                >
                  <option value="">Any Type</option>
                  <option value="Apartment">Apartment / Penthouse</option>
                  <option value="Villa">Villa / Estate</option>
                  <option value="Commercial">Commercial</option>
                </select>
                <Building size={18} className="search-field-icon" />
              </label>

              <label className="search-field-label">
                <div className="search-field-text">
                  <span className="search-field-title">Bedrooms</span>
                  <b className="search-field-value">{bhk ? `${bhk} BHK` : 'Any BHK'}</b>
                </div>
                <select
                  value={bhk}
                  onChange={(e) => setBhk(e.target.value)}
                  className="search-select-overlay"
                >
                  <option value="">Any BHK</option>
                  <option value="3">3 BHK</option>
                  <option value="4">4 BHK</option>
                  <option value="5">5+ BHK</option>
                </select>
                <ChevronDown size={18} className="search-field-icon" />
              </label>

              <div className="search-btn-wrap">
                <button type="submit" className="search-btn">
                  <Search size={16} />
                  <span>Search</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* ── 2. Featured Properties Section (design.md §11) ────────────────────── */}
      <section className="section">
        <div className="section-title">
          <div>
            <p className="eyebrow">CURATED PORTFOLIO</p>
            <h2>Featured Estates</h2>
            <p className="lede">Handpicked luxury residences across prime Indian metropolises.</p>
          </div>
          <Link to="/properties" className="text-link">
            View All Properties <ArrowRight size={14} />
          </Link>
        </div>

        <div className="property-grid">
          {loadingProps ? (
            [1, 2, 3].map((n) => (
              <div key={n} className="property-card" style={{ minHeight: '360px' }}>
                <Skeleton style={{ height: '220px', width: '100%' }} />
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <Skeleton style={{ height: '24px', width: '40%' }} />
                  <Skeleton style={{ height: '20px', width: '80%' }} />
                  <Skeleton style={{ height: '16px', width: '60%' }} />
                </div>
              </div>
            ))
          ) : (
            properties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))
          )}
        </div>
      </section>

      {/* ── 3. Categories Grid ────────────────────────────────────────────────── */}
      <section className="section muted">
        <div className="section-title">
          <div>
            <p className="eyebrow">PORTFOLIO ARCHITECTURE</p>
            <h2>Browse By Lifestyle & Category</h2>
            <p className="lede">Discover curated residences tailored to your lifestyle requirements.</p>
          </div>
        </div>

        <div className="category-grid">
          {CATEGORIES.map((cat, idx) => {
            const IconComp = cat.icon;
            return (
              <Link key={idx} to={cat.link} className="category">
                <div className="category-icon-tile">
                  <IconComp size={24} />
                </div>
                <div>
                  <span>{cat.title}</span>
                  <small>{cat.count}</small>
                </div>
                <ArrowUpRight size={18} className="category-arrow" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── 4. Why Choose F.B. Developer ────────────────────────────────────── */}
      <section className="section why">
        <div className="section-title">
          <div>
            <p className="eyebrow">THE F.B. DEVELOPER DIFFERENCE</p>
            <h2>Bespoke Real Estate Advisory</h2>
          </div>
        </div>

        <div className="why-grid">
          <div className="why-item">
            <div className="icon-box">
              <ShieldCheck size={20} />
            </div>
            <h3>Private Advisory</h3>
            <p>Discreet, confidential representation for Ultra High Net Worth Individuals, NRIs, and family offices.</p>
          </div>

          <div className="why-item">
            <div className="icon-box">
              <Compass size={20} />
            </div>
            <h3>Curated Selection</h3>
            <p>Every property is personally vetted by our editorial team for architectural merit and investment value.</p>
          </div>

          <div className="why-item">
            <div className="icon-box">
              <Award size={20} />
            </div>
            <h3>Legal Integrity</h3>
            <p>100% RERA compliant properties with clear title verification and transparent deal execution.</p>
          </div>

          <div className="why-item">
            <div className="icon-box">
              <Key size={20} />
            </div>
            <h3>Concierge Service</h3>
            <p>From private chauffeur-driven site tours to post-acquisition interior design integration.</p>
          </div>
        </div>
      </section>

      {/* ── 5. Latest Projects Section (design.md §11 timeline bar) ───────────── */}
      <section className="section muted">
        <div className="section-title">
          <div>
            <p className="eyebrow">PREMIUM LANDMARKS</p>
            <h2>Iconic Developments</h2>
            <p className="lede">Pre-launch and flagship developments by premier builders.</p>
          </div>
          <Link to="/projects" className="text-link">
            View All Projects <ArrowRight size={14} />
          </Link>
        </div>

        <div className="project-grid">
          {loadingProjects ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="project-card">
                <Skeleton style={{ height: '240px', width: '100%' }} />
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <Skeleton style={{ height: '18px', width: '35%' }} />
                  <Skeleton style={{ height: '28px', width: '80%' }} />
                  <Skeleton style={{ height: '14px', width: '55%' }} />
                </div>
              </div>
            ))
          ) : projects.length > 0 ? (
            projects.map((proj) => {
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
            })
          ) : (
            <p style={{ color: 'var(--color-ink-muted)' }}>No projects available.</p>
          )}
        </div>
      </section>

      {/* ── 6. Properties By Location ────────────────────────────────────────── */}
      <section className="section">
        <div className="section-title">
          <div>
            <p className="eyebrow">PRIME DESTINATIONS</p>
            <h2>Explore By Location</h2>
            <p className="lede">Explore elite properties across India's most coveted pin codes.</p>
          </div>
        </div>

        <div className="locations-grid">
          {LOCATIONS.map((loc, idx) => (
            <Link key={idx} to={`/properties?city=${encodeURIComponent(loc.query)}`} className="location-card">
              <img src={loc.img} alt={loc.name} />
              <div className="location-info">
                <h3>{loc.name}</h3>
                <span>{loc.count}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 7. Luxury Amenities Grid (design.md §7) ──────────────────────────── */}
      <section className="section muted">
        <div className="section-title">
          <div>
            <p className="eyebrow">UNRIVALED COMFORT</p>
            <h2>Signature Amenities</h2>
            <p className="lede">Every F.B. Developer listing offers world-class facilities and lifestyle features.</p>
          </div>
        </div>

        <div className="amenity-grid">
          {AMENITIES.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div key={idx} className="amenity-tile">
                <div className="amenity-icon">
                  <IconComponent size={22} />
                </div>
                <span>{item.name}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 8. Testimonials Section ────────────────────────────────────────── */}
      <section className="testimonial">
        <div className="quote-mark">“</div>
        <div className="stars">★★★★★</div>
        <blockquote>
          "Finding our Worli sea-front penthouse with F.B. Developer was a seamless, confidential, and deeply satisfying journey. Their market intelligence is unmatched."
        </blockquote>
        <div className="testimonial-person">
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" alt="Kabir Kapoor" />
          <div>
            <b>Kabir & Sunaina Kapoor</b>
            <span>Worli, Mumbai</span>
          </div>
        </div>
      </section>

      {/* ── 9. Animated Stats Counter Section ───────────────────────────────── */}
      <section className="stats">
        <div className="stats-container">
          <div className="stat-box">
            <strong>₹4,500+ Cr</strong>
            <span>Transactions Represented</span>
          </div>
          <div className="stat-box">
            <strong>120+</strong>
            <span>Verified Luxury Estates</span>
          </div>
          <div className="stat-box">
            <strong>99.4%</strong>
            <span>Client Retention Rate</span>
          </div>
          <div className="stat-box">
            <strong>15+</strong>
            <span>Years Market Leadership</span>
          </div>
        </div>
      </section>

      {/* ── 10. Blog / Journal Preview ───────────────────────────────────────── */}
      <section className="section">
        <div className="section-title">
          <div>
            <p className="eyebrow">F.B. DEVELOPER JOURNAL</p>
            <h2>Insights & Real Estate Trends</h2>
            <p className="lede">Perspectives on architecture, luxury wealth, and market dynamics.</p>
          </div>
          <Link to="/blog" className="text-link">
            Read All Articles <ArrowRight size={14} />
          </Link>
        </div>

        <div className="journal-grid">
          {BLOG_POSTS.map((post) => (
            <article key={post.id} className="blog-card">
              <div className="blog-img">
                <img src={post.img} alt={post.title} />
              </div>
              <p className="blog-cat">{post.category} • {post.date}</p>
              <h3>{post.title}</h3>
              <Link to={`/blog/${post.id}`} className="blog-link">
                Read Perspective <ArrowRight size={14} />
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* ── 11. FAQ Accordion ────────────────────────────────────────────────── */}
      <section className="section muted faq">
        <div className="section-title">
          <div>
            <p className="eyebrow">FREQUENTLY ASKED QUESTIONS</p>
            <h2>Client Queries & Guidance</h2>
          </div>
        </div>

        <div className="faq-list">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="faq-item">
              <button
                type="button"
                className={`faq-row ${activeFaq === idx ? 'open' : ''}`}
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
              >
                <span>{faq.q}</span>
                <ChevronDown size={18} className={`faq-chevron ${activeFaq === idx ? 'rotate' : ''}`} />
              </button>
              {activeFaq === idx && (
                <div className="faq-answer">
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── 12. CTA Banner ──────────────────────────────────────────────────── */}
      <section className="cta">
        <img src="https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1920&q=80" alt="CTA Architecture" />
        <div className="cta-content">
          <p className="eyebrow light">YOUR JOURNEY BEGINS HERE</p>
          <h2>Ready to Find Your Sanctuary?</h2>
          <p>Schedule a private consultation or tour with one of our Senior Advisory Partners.</p>
          <div className="cta-buttons">
            <Button dark onClick={() => setIsBookModalOpen(true)}>
              Book Private Consultation
            </Button>
            <Link to="/properties">
              <Button outlineLight>Browse All Estates</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Book Site Visit Modal */}
      {isBookModalOpen && (
        <BookVisitModal isOpen={isBookModalOpen} onClose={() => setIsBookModalOpen(false)} />
      )}
    </main>
  );
}
