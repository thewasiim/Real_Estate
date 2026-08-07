import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Grid, List, MapPin, SlidersHorizontal, RotateCcw, X, Search, Check } from 'lucide-react';
import { propertiesApi } from '../api/propertiesApi';
import PropertyCard from '../components/property/PropertyCard';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';

const AMENITY_OPTIONS = [
  'Swimming Pool',
  'Gymnasium',
  '24/7 Security',
  'Clubhouse',
  'Power Backup',
  'Car Parking',
  'Landscaped Garden',
  'Elevator'
];

export default function Properties() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter State synced with URL query params
  const listingType = searchParams.get('listingType') || 'BUY';
  const city = searchParams.get('city') || '';
  const locality = searchParams.get('locality') || '';
  const type = searchParams.get('type') || '';
  const bhk = searchParams.get('bhk') || '';
  const bathrooms = searchParams.get('bathrooms') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const minArea = searchParams.get('minArea') || '';
  const maxArea = searchParams.get('maxArea') || '';
  const furnishing = searchParams.get('furnishing') || '';
  const readyToMove = searchParams.get('readyToMove') === 'true';
  const selectedAmenities = searchParams.get('amenities') ? searchParams.get('amenities').split(',') : [];
  const sort = searchParams.get('sort') || 'popularityScore_desc';
  const page = parseInt(searchParams.get('page') || '1', 10);

  // View state
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list' | 'map'
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // Data state
  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Helper to update individual query params
  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value !== undefined && value !== null && value !== '') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const toggleAmenity = (amenity) => {
    const next = selectedAmenities.includes(amenity)
      ? selectedAmenities.filter((a) => a !== amenity)
      : [...selectedAmenities, amenity];
    updateParam('amenities', next.join(','));
  };

  const resetFilters = () => {
    setSearchParams({ listingType: 'BUY' });
  };

  useEffect(() => {
    async function loadProperties() {
      setLoading(true);
      try {
        const query = {
          listingType,
          city: city || undefined,
          locality: locality || undefined,
          type: type || undefined,
          bhk: bhk || undefined,
          bathrooms: bathrooms || undefined,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
          minArea: minArea || undefined,
          maxArea: maxArea || undefined,
          furnishing: furnishing || undefined,
          readyToMove: readyToMove ? 'true' : undefined,
          amenities: selectedAmenities.length ? selectedAmenities.join(',') : undefined,
          sort,
          page,
          limit: 9,
        };

        const res = await propertiesApi.getAll(query);
        if (res.data?.success) {
          setProperties(res.data.data.items || []);
          setTotal(res.data.data.total || 0);
          setTotalPages(res.data.data.totalPages || 1);
        }
      } catch (err) {
        console.error('Failed to fetch properties:', err);
      } finally {
        setLoading(false);
      }
    }

    loadProperties();
  }, [
    listingType,
    city,
    locality,
    type,
    bhk,
    bathrooms,
    minPrice,
    maxPrice,
    minArea,
    maxArea,
    furnishing,
    readyToMove,
    searchParams.get('amenities'),
    sort,
    page,
  ]);

  return (
    <main className="listing">
      <div className="listing-head">
        <p className="eyebrow">EXCLUSIVE PORTFOLIO</p>
        <h1>Luxury Properties</h1>
        <p>Explore our refined collection of prime apartments, penthouses, and private estates.</p>
      </div>

      <div className="listing-layout">
        {/* ── Filter Sidebar (Desktop lg+ or Mobile Drawer) ────────────────────────── */}
        <aside className={`filter ${showMobileFilter ? 'show' : ''}`}>
          <div className="filter-title">
            <h3>Filters</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={resetFilters}
                className="reset-btn"
                style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--color-ink-muted)' }}
              >
                <RotateCcw size={12} /> Reset
              </button>
              {showMobileFilter && (
                <button
                  type="button"
                  onClick={() => setShowMobileFilter(false)}
                  style={{ padding: '4px', color: 'var(--color-ink)' }}
                  aria-label="Close filters"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </div>

          {/* Segment: Buy / Rent */}
          <div className="filter-group">
            <label>Listing Type</label>
            <div className="seg">
              <button
                type="button"
                className={listingType === 'BUY' ? 'active' : ''}
                onClick={() => updateParam('listingType', 'BUY')}
              >
                Buy
              </button>
              <button
                type="button"
                className={listingType === 'RENT' ? 'active' : ''}
                onClick={() => updateParam('listingType', 'RENT')}
              >
                Rent
              </button>
            </div>
          </div>

          {/* City Select */}
          <div className="filter-group">
            <label htmlFor="city-select">City</label>
            <select
              id="city-select"
              className="select"
              value={city}
              onChange={(e) => updateParam('city', e.target.value)}
            >
              <option value="">All Cities</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi NCR">Delhi NCR</option>
              <option value="Goa">Goa</option>
              <option value="Bangalore">Bangalore</option>
            </select>
          </div>

          {/* Locality Input */}
          <div className="filter-group">
            <label htmlFor="locality-input">Locality</label>
            <input
              id="locality-input"
              type="text"
              className="select"
              placeholder="e.g. Worli, Bandra, Juhu"
              value={locality}
              onChange={(e) => updateParam('locality', e.target.value)}
            />
          </div>

          {/* Property Type */}
          <div className="filter-group">
            <label htmlFor="type-select">Property Type</label>
            <select
              id="type-select"
              className="select"
              value={type}
              onChange={(e) => updateParam('type', e.target.value)}
            >
              <option value="">Any Type</option>
              <option value="Apartment">Apartment / Penthouse</option>
              <option value="Villa">Villa / Estate</option>
              <option value="Commercial">Commercial</option>
            </select>
          </div>

          {/* Budget Range (Min / Max Price) */}
          <div className="filter-group">
            <label>Budget Range (₹)</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <input
                type="number"
                className="select"
                placeholder="Min Price"
                value={minPrice}
                onChange={(e) => updateParam('minPrice', e.target.value)}
              />
              <input
                type="number"
                className="select"
                placeholder="Max Price"
                value={maxPrice}
                onChange={(e) => updateParam('maxPrice', e.target.value)}
              />
            </div>
          </div>

          {/* BHK (Single Bedroom Count Filter per PRD) */}
          <div className="filter-group">
            <label htmlFor="bhk-select">Bedrooms (BHK)</label>
            <select
              id="bhk-select"
              className="select"
              value={bhk}
              onChange={(e) => updateParam('bhk', e.target.value)}
            >
              <option value="">Any BHK</option>
              <option value="2">2 BHK</option>
              <option value="3">3 BHK</option>
              <option value="4">4 BHK</option>
              <option value="5">5+ BHK</option>
            </select>
          </div>

          {/* Bathrooms Filter */}
          <div className="filter-group">
            <label htmlFor="baths-select">Bathrooms</label>
            <select
              id="baths-select"
              className="select"
              value={bathrooms}
              onChange={(e) => updateParam('bathrooms', e.target.value)}
            >
              <option value="">Any Bathrooms</option>
              <option value="2">2+ Baths</option>
              <option value="3">3+ Baths</option>
              <option value="4">4+ Baths</option>
            </select>
          </div>

          {/* Area Range (sq.ft) */}
          <div className="filter-group">
            <label>Area Range (sq.ft)</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <input
                type="number"
                className="select"
                placeholder="Min Sq.Ft"
                value={minArea}
                onChange={(e) => updateParam('minArea', e.target.value)}
              />
              <input
                type="number"
                className="select"
                placeholder="Max Sq.Ft"
                value={maxArea}
                onChange={(e) => updateParam('maxArea', e.target.value)}
              />
            </div>
          </div>

          {/* Furnishing */}
          <div className="filter-group">
            <label htmlFor="furnishing-select">Furnishing</label>
            <select
              id="furnishing-select"
              className="select"
              value={furnishing}
              onChange={(e) => updateParam('furnishing', e.target.value)}
            >
              <option value="">Any Furnishing</option>
              <option value="Fully Furnished">Fully Furnished</option>
              <option value="Semi-Furnished">Semi-Furnished</option>
              <option value="Unfurnished">Unfurnished</option>
            </select>
          </div>

          {/* Ready to Move Toggle */}
          <div className="filter-group">
            <label className="toggle" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
              <input
                type="checkbox"
                checked={readyToMove}
                onChange={(e) => updateParam('readyToMove', e.target.checked ? 'true' : '')}
              />
              <span>Ready to Move Only</span>
            </label>
          </div>

          {/* Amenities Checklist */}
          <div className="filter-group">
            <label>Amenities</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
              {AMENITY_OPTIONS.map((am) => {
                const checked = selectedAmenities.includes(am);
                return (
                  <label key={am} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleAmenity(am)}
                    />
                    <span>{am}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </aside>

        {/* ── Main Results View ────────────────────────────────────────── */}
        <section className="results">
          {/* Results Action Bar */}
          <div className="results-bar">
            <button
              type="button"
              className="filter-mobile"
              onClick={() => setShowMobileFilter(!showMobileFilter)}
            >
              <SlidersHorizontal size={14} /> Filters
            </button>

            <span>Showing <b>{total}</b> luxury properties</span>

            {/* View Mode Buttons */}
            <div className="view-buttons">
              <button
                type="button"
                className={viewMode === 'grid' ? 'active' : ''}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <Grid size={15} />
              </button>
              <button
                type="button"
                className={viewMode === 'list' ? 'active' : ''}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <List size={15} />
              </button>
              <button
                type="button"
                className={viewMode === 'map' ? 'active' : ''}
                onClick={() => setViewMode('map')}
                title="Map View"
              >
                <MapPin size={15} />
              </button>
            </div>

            {/* Sort Select */}
            <div className="sort">
              <span>Sort:</span>
              <select
                value={sort}
                onChange={(e) => updateParam('sort', e.target.value)}
                className="sort-select"
              >
                <option value="popularityScore_desc">Most Popular</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>

          {/* Results Content */}
          {loading ? (
            <div className="property-grid">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="property-card" style={{ padding: '0', minHeight: '360px' }}>
                  <Skeleton style={{ height: '220px', width: '100%' }} />
                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <Skeleton style={{ height: '24px', width: '40%' }} />
                    <Skeleton style={{ height: '20px', width: '80%' }} />
                    <Skeleton style={{ height: '16px', width: '60%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : properties.length === 0 ? (
            <EmptyState
              title="No properties match your filters"
              description="Try adjusting your budget, location, or bedroom filter criteria to see available estates."
              actionLabel="Reset All Filters"
              onAction={resetFilters}
            />
          ) : viewMode === 'map' ? (
            <div className="map-placeholder" style={{ padding: '60px var(--gutter)', textAlign: 'center', background: 'var(--color-bg-alt)', borderRadius: 'var(--radius-md)' }}>
              <MapPin size={36} style={{ color: 'var(--color-accent)', marginBottom: '12px' }} />
              <h3>Interactive Map View</h3>
              <p style={{ color: 'var(--color-ink-muted)' }}>Displaying {properties.length} properties across {city || 'prime locations'}.</p>
            </div>
          ) : viewMode === 'list' ? (
            <div className="list-results" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {properties.map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          ) : (
            <div className="property-grid">
              {properties.map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => updateParam('page', (page - 1).toString())}
              >
                ←
              </button>
              {Array.from({ length: totalPages }).map((_, i) => {
                const pNum = i + 1;
                return (
                  <button
                    key={pNum}
                    type="button"
                    className={pNum === page ? 'current' : ''}
                    onClick={() => updateParam('page', pNum.toString())}
                  >
                    {pNum}
                  </button>
                );
              })}
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => updateParam('page', (page + 1).toString())}
              >
                →
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
