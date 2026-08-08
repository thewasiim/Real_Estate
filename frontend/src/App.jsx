import React from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FilterProvider } from './context/FilterContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { CompareProvider } from './context/CompareContext';
import { RecentlyViewedProvider } from './context/RecentlyViewedContext';
import Navbar from './layout/Navbar';
import Footer from './layout/Footer';
import BackToTop from './layout/BackToTop';
import AppRoutes from './routes/AppRoutes';
import ScrollReveal from './components/shared/ScrollReveal';
import ScrollToTop from './components/shared/ScrollToTop';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="app-container">
      <ScrollReveal />
      {!isAdminRoute && <Navbar />}
      <AppRoutes />
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <BackToTop />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <FilterProvider>
          <FavoritesProvider>
            <CompareProvider>
              <RecentlyViewedProvider>
                <AppContent />
              </RecentlyViewedProvider>
            </CompareProvider>
          </FavoritesProvider>
        </FilterProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
