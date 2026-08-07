import React from 'react';
import { BrowserRouter } from 'react-router-dom';
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

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FilterProvider>
          <FavoritesProvider>
            <CompareProvider>
              <RecentlyViewedProvider>
                <div className="app-container">
                  <ScrollReveal />
                  <Navbar />
                  <AppRoutes />
                  <Footer />
                  <BackToTop />
                </div>
              </RecentlyViewedProvider>
            </CompareProvider>
          </FavoritesProvider>
        </FilterProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
