import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import adminService from '../../services/adminService';
import { toast } from 'react-toastify';
import { formatDateTime } from '../../utils/helpers';

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const load = () => {
    setLoading(true);
    adminService.getUsers({ page, size: 20 })
      .then(res => { setUsers(res.data.data.content); setTotalPages(res.data.data.totalPages); })
      .catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [page]);

  const toggle = async (id) => {
    try { await adminService.toggleBlock(id); toast.success('Updated'); load(); } catch (e) { toast.error('Failed'); }
  };

  return (
    <DashboardLayout>
      <div className="page-header"><h1 className="page-title">Manage <span>Users</span></h1></div>
      {loading ? <div className="loading-screen"><div className="spinner"></div></div> : (
        <div className="table-container">
          <table>
            <thead><tr><th>Name</th><th>Username</th><th>Email</th><th>Roles</th><th>Joined</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 600 }}>{u.fullName}</td>
                  <td>@{u.username}</td>
                  <td>{u.email}</td>
                  <td>{u.roles?.join(', ')}</td>
                  <td>{formatDateTime(u.createdAt)}</td>
                  <td><span className="badge" style={{ background: u.blocked ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)', color: u.blocked ? '#ef4444' : '#22c55e' }}>{u.blocked ? 'Blocked' : 'Active'}</span></td>
                  <td><button className={`btn btn-sm ${u.blocked ? 'btn-success' : 'btn-danger'}`} onClick={() => toggle(u.id)}>{u.blocked ? 'Unblock' : 'Block'}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {totalPages > 1 && <div className="pagination">{[...Array(totalPages)].map((_, i) => <button key={i} onClick={() => setPage(i)} className={page === i ? 'active' : ''}>{i + 1}</button>)}</div>}
    </DashboardLayout>
  );
}
