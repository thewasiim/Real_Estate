import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute, AdminRoute } from '../components/shared/ProtectedRoute';

// Public Pages
import NotFound from '../pages/NotFound';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Home from '../pages/Home';
import Properties from '../pages/Properties';
import PropertyDetails from '../pages/PropertyDetails';
import Projects from '../pages/Projects';
import ProjectDetails from '../pages/ProjectDetails';
import Agents from '../pages/Agents';
import About from '../pages/About';
import Contact from '../pages/Contact';

// Placeholder for pages not yet built
function Placeholder({ title }) {
  return (
    <main className="placeholder-page">
      <div className="placeholder-card">
        <p className="eyebrow">COMING SOON</p>
        <h1>{title}</h1>
        <p>This page will be implemented in the next phase.</p>
      </div>
    </main>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/properties" element={<Properties />} />
      <Route path="/properties/:id" element={<PropertyDetails />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/projects/:id" element={<ProjectDetails />} />
      <Route path="/agents" element={<Agents />} />
      <Route path="/agents/:id" element={<Placeholder title="Agent Details" />} />
      <Route path="/about" element={<About />} />
      <Route path="/blog" element={<Placeholder title="Blog" />} />
      <Route path="/blog/:slug" element={<Placeholder title="Blog Post" />} />
      <Route path="/contact" element={<Contact />} />

      {/* Auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected user routes */}
      <Route
        path="/favorites"
        element={
          <ProtectedRoute>
            <Placeholder title="My Favorites" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Placeholder title="My Profile" />
          </ProtectedRoute>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <Placeholder title="Admin Dashboard" />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/properties"
        element={
          <AdminRoute>
            <Placeholder title="Manage Properties" />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/projects"
        element={
          <AdminRoute>
            <Placeholder title="Manage Projects" />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/agents"
        element={
          <AdminRoute>
            <Placeholder title="Manage Agents" />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/leads"
        element={
          <AdminRoute>
            <Placeholder title="Manage Leads" />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <Placeholder title="Manage Users" />
          </AdminRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
