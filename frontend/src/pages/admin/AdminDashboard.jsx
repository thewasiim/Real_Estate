import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  FolderKanban,
  UserCheck,
  Users,
  Inbox,
  Clock,
  Plus,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { adminApi } from '../../api/adminApi';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminApi.getStats();
      if (res.data?.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load admin stats:', err);
      setError('Failed to load dashboard statistics. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-28 bg-gray-200 rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-gray-200 rounded-2xl animate-pulse" />
          <div className="h-80 bg-gray-200 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-red-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertCircle size={20} />
          <p className="text-sm font-medium">{error}</p>
        </div>
        <button
          onClick={fetchStats}
          className="px-4 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Properties', value: stats?.totalProperties || 0, icon: Building2, color: 'bg-blue-500/10 text-blue-600', link: '/admin/properties' },
    { label: 'Total Projects', value: stats?.totalProjects || 0, icon: FolderKanban, color: 'bg-indigo-500/10 text-indigo-600', link: '/admin/projects' },
    { label: 'Active Agents', value: stats?.totalAgents || 0, icon: UserCheck, color: 'bg-emerald-500/10 text-emerald-600', link: '/admin/agents' },
    { label: 'Registered Users', value: stats?.totalUsers || 0, icon: Users, color: 'bg-purple-500/10 text-purple-600', link: '/admin/users' },
    { label: 'Total Leads', value: stats?.totalLeads || 0, icon: Inbox, color: 'bg-amber-500/10 text-amber-600', link: '/admin/leads' },
    { label: 'Pending Action', value: stats?.pendingLeads || 0, icon: Clock, color: 'bg-rose-500/10 text-rose-600', link: '/admin/leads?status=NEW' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Executive Control Dashboard</h1>
          <p className="text-xs text-gray-500 mt-1">Real-time platform analytics & live operations status</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/admin/properties?action=new"
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-xl shadow-sm transition"
          >
            <Plus size={16} />
            <span>Add Property</span>
          </Link>
          <Link
            to="/admin/projects?action=new"
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 text-xs font-semibold rounded-xl shadow-sm transition"
          >
            <Plus size={16} />
            <span>Add Project</span>
          </Link>
        </div>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              to={card.link}
              className="bg-white border border-gray-200/80 hover:border-gray-300 p-5 rounded-2xl shadow-sm hover:shadow transition group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">{card.label}</span>
                <div className={`p-2 rounded-xl ${card.color} group-hover:scale-110 transition-transform`}>
                  <Icon size={18} />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-2xl font-bold text-gray-900 tracking-tight">{card.value}</span>
                <ArrowRight size={14} className="text-gray-400 group-hover:text-gray-900 transition-colors" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Main Content Split: Recent Leads & Recent Properties */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Leads */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Inbox size={18} className="text-gray-700" />
                <h2 className="text-base font-bold text-gray-900">Recent Customer Leads</h2>
              </div>
              <Link to="/admin/leads" className="text-xs font-semibold text-gray-600 hover:text-gray-900 flex items-center gap-1">
                <span>View all</span>
                <ArrowRight size={12} />
              </Link>
            </div>

            {stats?.recentLeads?.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {stats.recentLeads.map((lead) => (
                  <div key={lead.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-gray-900">{lead.name || 'Anonymous'}</p>
                      <p className="text-gray-500 text-[11px]">{lead.email} · {lead.phone}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-700">
                        {lead.type?.replace('_', ' ')}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          lead.status === 'NEW'
                            ? 'bg-rose-50 text-rose-600 border border-rose-200'
                            : lead.status === 'CONTACTED'
                            ? 'bg-amber-50 text-amber-600 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        }`}
                      >
                        {lead.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 py-8 text-center">No recent leads submitted.</p>
            )}
          </div>
        </div>

        {/* Recent Properties */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Building2 size={18} className="text-gray-700" />
                <h2 className="text-base font-bold text-gray-900">Recently Added Properties</h2>
              </div>
              <Link to="/admin/properties" className="text-xs font-semibold text-gray-600 hover:text-gray-900 flex items-center gap-1">
                <span>View all</span>
                <ArrowRight size={12} />
              </Link>
            </div>

            {stats?.recentProperties?.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {stats.recentProperties.map((prop) => (
                  <div key={prop.id} className="py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      {prop.images?.[0] ? (
                        <img src={prop.images[0]} alt={prop.title} className="w-10 h-10 rounded-lg object-cover border border-gray-200" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                          <Building2 size={16} />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-900 line-clamp-1">{prop.title}</p>
                        <p className="text-gray-500 text-[11px]">{prop.city} · ₹{prop.price?.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                    <Link
                      to={`/properties/${prop.id}`}
                      target="_blank"
                      className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
                      title="View on site"
                    >
                      <Eye size={16} />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 py-8 text-center">No properties added yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
