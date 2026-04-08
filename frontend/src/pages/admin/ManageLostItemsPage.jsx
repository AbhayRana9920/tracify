import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import adminService from '../../services/adminService';
import { toast } from 'react-toastify';
import { formatDate } from '../../utils/helpers';
import { FiTrash2, FiSearch, FiEdit } from 'react-icons/fi';

export default function ManageLostItemsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchItems = () => {
    setLoading(true);
    // Since we don't have a specific admin/lost-items endpoint, we can use the public one which returns all items
    // depending on the backend implementation. Assuming adminService handles it or we use public.
    adminService.getAllLostItems(0, 100, search)
      .then(res => setItems(res.data.data.content))
      .catch(() => toast.error('Failed to load items'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchItems();
  }, [search]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this lost item post?')) {
      adminService.deleteLostItem(id)
        .then(() => {
          toast.success('Post deleted successfully');
          fetchItems();
        })
        .catch(err => toast.error(err.response?.data?.message || 'Failed to delete'));
    }
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Manage <span>Lost Items</span></h1>
      </div>

      <div className="search-filter-bar">
        <div className="input-group" style={{ flex: 1 }}>
          <div style={{ position: 'relative' }}>
            <FiSearch style={{ position: 'absolute', left: 14, top: 14, color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search lost items..." 
              style={{ paddingLeft: 40 }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-screen"><div className="spinner"></div></div>
      ) : (
        <div className="card table-container">
          {items.length === 0 ? (
            <div className="empty-state">No lost items found.</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Owner</th>
                  <th>Status</th>
                  <th>Date Lost</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id}>
                    <td><strong>{item.title}</strong></td>
                    <td>{item.categoryName}</td>
                    <td>{item.userName}</td>
                    <td><span className={`badge`} style={{background: 'var(--primary-bg)', color: 'var(--primary)'}}>{item.status}</span></td>
                    <td>{formatDate(item.dateLost)}</td>
                    <td>
                      <button className="btn-icon btn-ghost" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(item.id)}>
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
