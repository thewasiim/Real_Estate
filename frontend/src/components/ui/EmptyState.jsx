import React from 'react';
import { Search } from 'lucide-react';

/**
 * Reusable empty state component per design.md §11a.
 * Centered layout: icon → headline → support text → action button.
 */
export default function EmptyState({
  icon: Icon = Search,
  title = 'Nothing here yet',
  description = '',
  actionLabel,
  onAction,
}) {
  return (
    <div className="empty-state">
      <Icon size={64} strokeWidth={1} />
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {actionLabel && onAction && (
        <button className="btn btn-dark" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
