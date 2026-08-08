import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, ChevronRight, Home, Globe } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminTopbar({ onMenuToggle }) {
  const location = useLocation();
  const { user } = useAuth();

  const pathParts = location.pathname.split('/').filter(Boolean);

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition"
          aria-label="Toggle Menu"
        >
          <Menu size={20} />
        </button>

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
          <Link to="/admin" className="hover:text-gray-900 flex items-center gap-1">
            <Home size={14} />
            <span>Admin</span>
          </Link>
          {pathParts.slice(1).map((part, idx) => (
            <React.Fragment key={idx}>
              <ChevronRight size={12} className="text-gray-400" />
              <span className="capitalize text-gray-900 font-semibold">{part}</span>
            </React.Fragment>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition"
        >
          <Globe size={14} />
          <span>Live Site</span>
        </a>

        <div className="h-4 w-px bg-gray-200 hidden sm:block" />

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gray-900 text-white font-bold flex items-center justify-center text-xs">
            {user?.name?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-gray-900 leading-tight">{user?.name || 'Administrator'}</p>
            <span className="inline-block text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
              ADMIN
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
