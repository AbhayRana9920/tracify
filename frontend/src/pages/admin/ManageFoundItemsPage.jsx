import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import adminService from '../../services/adminService';
import { toast } from 'react-toastify';
import { formatDate } from '../../utils/helpers';
import { FiTrash2, FiSearch, FiCheckCircle } from 'react-icons/fi';

export default function ManageFoundItemsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchItems = () => {
    setLoading(true);
    adminService.getAllFoundItems(0, 100, search)
      .then(res => setItems(res.data.data.content))
      .catch(() => toast.error('Failed to load items'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchItems();
  }, [search]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this found item post?')) {
      adminService.deleteFoundItem(id)
        .then(() => {
          toast.success('Post deleted successfully');
          fetchItems();
        })
        .catch(err => toast.error(err.response?.data?.message || 'Failed to delete'));
    }
  };

  const handleMarkReturned = (id) => {
    if (window.confirm('Mark this item as returned?')) {
      adminService.updateFoundItemStatus(id, 'RETURNED')
        .then(() => {
          toast.success('Item marked as returned');
          fetchItems();
        })
        .catch(err => toast.error(err.response?.data?.message || 'Failed to update'));
    }
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Manage <span>Found Items</span></h1>
      </div>

      <div className="search-filter-bar">
        <div className="input-group" style={{ flex: 1 }}>
          <div style={{ position: 'relative' }}>
            <FiSearch style={{ position: 'absolute', left: 14, top: 14, color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search found items..." 
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
            <div className="empty-state">No found items found.</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Finder</th>
                  <th>Status</th>
                  <th>Date Found</th>
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
                    <td>{formatDate(item.dateFound)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {item.status !== 'RETURNED' && (
                          <button className="btn-icon btn-ghost" style={{ color: 'var(--success)' }} onClick={() => handleMarkReturned(item.id)} title="Mark Returned">
                            <FiCheckCircle />
                          </button>
                        )}
                        <button className="btn-icon btn-ghost" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(item.id)} title="Delete">
                          <FiTrash2 />
                        </button>
                      </div>
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
