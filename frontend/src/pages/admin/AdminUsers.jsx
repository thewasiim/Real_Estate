import React, { useEffect, useState } from 'react';
import {
  Users,
  Search,
  Shield,
  UserCheck,
  User,
  Loader2,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';
import { usersApi } from '../../api/usersApi';
import { useAuth } from '../../context/AuthContext';

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const [toast, setToast] = useState(null);
  const [roleChangeModal, setRoleChangeModal] = useState(null); // { user, newRole }
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [page, roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await usersApi.getAll({
        page,
        limit: 15,
        search,
        role: roleFilter,
      });
      if (res.data?.success) {
        setUsers(res.data.data.items || []);
        setTotal(res.data.data.total || 0);
        setTotalPages(res.data.data.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
      showToast('Failed to load registered users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleRoleSelect = (usr, newRole) => {
    if (usr.id === currentUser?.id && newRole !== 'ADMIN') {
      showToast('You cannot demote yourself from Admin role', 'error');
      return;
    }
    setRoleChangeModal({ user: usr, newRole });
  };

  const confirmRoleChange = async () => {
    if (!roleChangeModal) return;
    const { user: usr, newRole } = roleChangeModal;
    try {
      setUpdating(true);
      await usersApi.updateRole(usr.id, newRole);
      showToast(`Updated ${usr.name}'s role to ${newRole}`);
      setRoleChangeModal(null);
      fetchUsers();
    } catch (err) {
      console.error('Role update failed:', err);
      showToast('Failed to update user role', 'error');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-xs font-semibold bg-gray-900 text-white">
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">User Accounts & Roles</h1>
          <p className="text-xs text-gray-500 mt-1">Manage platform credentials, access control & admin privileges</p>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-white border border-gray-200/80 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <form onSubmit={(e) => { e.preventDefault(); setPage(1); fetchUsers(); }} className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search users by name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 transition"
          />
        </form>

        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 text-xs border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-gray-900 w-full md:w-auto"
        >
          <option value="">All Roles</option>
          <option value="USER">USER</option>
          <option value="AGENT">AGENT</option>
          <option value="ADMIN">ADMIN</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3">
            <Loader2 className="animate-spin text-gray-700" size={28} />
            <p className="text-xs text-gray-500 font-medium">Fetching registered user directory...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="mx-auto text-gray-300 mb-3" size={36} />
            <p className="text-sm font-semibold text-gray-900">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-gray-50/80 text-gray-500 font-semibold uppercase text-[10px] tracking-wider border-b border-gray-200/80">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Registered Date</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4 text-right">Role Management</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {users.map((usr) => (
                  <tr key={usr.id} className="hover:bg-gray-50/60 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gray-900 text-white font-bold flex items-center justify-center text-xs">
                          {usr.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 flex items-center gap-1.5">
                            {usr.name}
                            {usr.id === currentUser?.id && (
                              <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded">YOU</span>
                            )}
                          </p>
                          <p className="text-[10px] text-gray-400">{usr.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{usr.phone || 'N/A'}</td>
                    <td className="py-3 px-4 text-gray-500 text-[11px]">
                      {new Date(usr.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          usr.role === 'ADMIN'
                            ? 'bg-slate-900 text-emerald-400 border border-slate-700'
                            : usr.role === 'AGENT'
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {usr.role === 'ADMIN' ? <Shield size={12} /> : usr.role === 'AGENT' ? <UserCheck size={12} /> : <User size={12} />}
                        <span>{usr.role}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <select
                        value={usr.role}
                        onChange={(e) => handleRoleSelect(usr, e.target.value)}
                        disabled={usr.id === currentUser?.id}
                        className="px-2 py-1 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-gray-900 disabled:opacity-50"
                      >
                        <option value="USER">USER</option>
                        <option value="AGENT">AGENT</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Showing page {page} of {totalPages} ({total} users)</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Role Change Confirmation Modal */}
      {roleChangeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Confirm Role Change</h3>
                <p className="text-xs text-gray-500">
                  Change <strong>{roleChangeModal.user.name}</strong>'s role from {roleChangeModal.user.role} to <strong>{roleChangeModal.newRole}</strong>?
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRoleChangeModal(null)}
                className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50"
                disabled={updating}
              >
                Cancel
              </button>
              <button
                onClick={confirmRoleChange}
                disabled={updating}
                className="px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-xl transition flex items-center gap-2"
              >
                {updating && <Loader2 className="animate-spin" size={14} />}
                <span>Confirm Change</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
