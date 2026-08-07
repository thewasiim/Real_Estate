import React from 'react';

export default function Button({ children, dark = false, className = '', ...rest }) {
  return (
    <button className={`btn ${dark ? 'btn-dark' : 'btn-light'} ${className}`} {...rest}>
      {children}
    </button>
  );
}
