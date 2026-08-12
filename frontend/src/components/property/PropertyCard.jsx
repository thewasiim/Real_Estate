import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Bed, Bath, Maximize2, Scale } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import { useFavorites } from '../../context/FavoritesContext';
import { useCompare } from '../../context/CompareContext';

export default function PropertyCard({ property }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isInCompare, addToCompare, removeFromCompare } = useCompare();

  if (!property) return null;

  const isFav = isFavorite(property.id);
  const isComp = isInCompare(property.id);

  const toggleCompare = (p) => {
    if (isComp) {
      removeFromCompare(p.id);
    } else {
      addToCompare(p.id);
    }
  };

  const fallbackImage = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80';
  const coverImage = property.images && property.images.length > 0 ? property.images[0] : fallbackImage;

  return (
    <article className="property-card">
      <div className="property-image">
        <Link to={`/properties/${property.id}`} className="image-link">
          <img
            src={coverImage}
            alt={property.title}
            loading="lazy"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = fallbackImage;
            }}
          />
        </Link>
        <span className="badge">
          {property.listingType === 'RENT' ? 'FOR RENT' : property.status || 'FOR SALE'}
        </span>
        <div className="property-actions">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite(property);
            }}
            title={isFav ? 'Remove from favorites' : 'Add to favorites'}
            style={{ color: isFav ? 'var(--color-accent)' : 'var(--color-ink)' }}
          >
            <Heart size={16} fill={isFav ? 'var(--color-accent)' : 'none'} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              toggleCompare(property);
            }}
            title={isComp ? 'Remove from comparison' : 'Compare property'}
            style={{ color: isComp ? 'var(--color-accent)' : 'var(--color-ink)' }}
          >
            <Scale size={16} />
          </button>
        </div>
      </div>

      <div className="property-body">
        <Link to={`/properties/${property.id}`}>
          <h3>{property.title}</h3>
        </Link>
        <div className="property-location">
          <MapPin size={14} />
          <span>{property.locality ? `${property.locality}, ${property.city}` : property.city}</span>
        </div>
        <div className="property-price">
          {formatCurrency(property.price)}
          {property.listingType === 'RENT' && <span> / month</span>}
        </div>

        <div className="specs">
          <span>
            <Bed size={14} /> {property.bhk} BHK
          </span>
          <span>
            <Bath size={14} /> {property.bathrooms} Baths
          </span>
          <span>
            <Maximize2 size={14} /> {property.area} {property.areaUnit || 'sqft'}
          </span>
        </div>

        <div className="property-footer">
          <span className="status">
            <i /> {property.status}
          </span>
          <Link to={`/properties/${property.id}`}>
            View Details →
          </Link>
        </div>
      </div>
    </article>
  );
}
