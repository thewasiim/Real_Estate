import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, AdminRoute } from '../components/shared/ProtectedRoute';

// Layout
import AdminLayout from '../layout/admin/AdminLayout';

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
import Profile from '../pages/Profile';
import Blog from '../pages/Blog';
import BlogPost from '../pages/BlogPost';
import AgentDetails from '../pages/AgentDetails';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminProperties from '../pages/admin/AdminProperties';
import AdminProjects from '../pages/admin/AdminProjects';
import AdminAgents from '../pages/admin/AdminAgents';
import AdminLeads from '../pages/admin/AdminLeads';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminBlog from '../pages/admin/AdminBlog';
import AdminTestimonials from '../pages/admin/AdminTestimonials';
import AdminFaq from '../pages/admin/AdminFaq';

// Helper for simple public placeholders
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
      <Route path="/agents/:id" element={<AgentDetails />} />
      <Route path="/about" element={<About />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route path="/contact" element={<Contact />} />

      {/* Auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected user routes */}
      <Route path="/favorites" element={<Navigate to="/profile" replace />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Admin routes with AdminLayout wrapper & AdminRoute guard */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/properties"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminProperties />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/projects"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminProjects />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/agents"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminAgents />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/leads"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminLeads />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminUsers />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/blog"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminBlog />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/testimonials"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminTestimonials />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/faq"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminFaq />
            </AdminLayout>
          </AdminRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
