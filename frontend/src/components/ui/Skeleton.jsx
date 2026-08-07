import React from 'react';

export default function Skeleton({ className = '', ...rest }) {
  return <div className={`skeleton ${className}`} {...rest} />;
}
