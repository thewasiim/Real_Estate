import React from 'react';
import PropertyCard from './PropertyCard';
import Skeleton from '../ui/Skeleton';
import EmptyState from '../ui/EmptyState';

export default function PropertyGrid({ properties, loading, count = 6 }) {
  if (loading) {
    return (
      <div className="property-grid">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="property-card">
            <Skeleton className="property-image" />
            <div className="property-body" style={{ display: 'grid', gap: '12px' }}>
              <Skeleton style={{ height: '24px', width: '40%' }} />
              <Skeleton style={{ height: '28px', width: '85%' }} />
              <Skeleton style={{ height: '16px', width: '60%' }} />
              <Skeleton style={{ height: '40px', width: '100%' }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!properties || properties.length === 0) {
    return (
      <EmptyState
        title="No Luxury Properties Found"
        description="We couldn't find any properties matching your current criteria. Try adjusting your location or filter preferences."
      />
    );
  }

  return (
    <div className="property-grid">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
