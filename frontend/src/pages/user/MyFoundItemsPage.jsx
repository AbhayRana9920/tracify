import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import foundItemService from '../../services/foundItemService';
import StatusBadge from '../../components/common/StatusBadge';
import { formatDate } from '../../utils/helpers';
import { toast } from 'react-toastify';
import { FiTrash2, FiCheckCircle } from 'react-icons/fi';

import FinderClaimsModal from '../../components/common/FinderClaimsModal';

export default function MyFoundItemsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await foundItemService.getMine({ page, size: 10 });
      setItems(res.data.data.content);
      setTotalPages(res.data.data.totalPages);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { load(); }, [page]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this item?')) return;
    try { await foundItemService.delete(id); toast.success('Deleted'); load(); } catch (e) { toast.error('Failed'); }
  };

  const handleMarkReturned = async (id) => {
    if (!confirm('Mark this item as returned?')) return;
    try { await foundItemService.updateStatus(id, 'RETURNED'); toast.success('Marked as returned'); load(); } catch (e) { toast.error('Failed to update status'); }
  };

  return (
    <DashboardLayout>
      <div className="page-header"><h1 className="page-title">My <span>Found Items</span></h1></div>
      {loading ? <div className="loading-screen"><div className="spinner"></div></div> : items.length === 0 ? (
        <div className="empty-state"><div className="empty-icon">📦</div><h3>No found items posted</h3><p>Report a found item to help others.</p></div>
      ) : (
        <div className="table-container">
          <table>
            <thead><tr><th>Title</th><th>Category</th><th>Date Found</th><th>Claims</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td><Link to={`/found-items/${item.id}`} style={{ fontWeight: 600 }}>{item.title}</Link></td>
                  <td>{item.categoryName}</td>
                  <td>{formatDate(item.dateFound)}</td>
                  <td>{item.claimCount}</td>
                  <td><StatusBadge status={item.status} /></td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {item.claimCount > 0 && (
                        <button className="btn btn-outline btn-sm" onClick={() => setSelectedItemId(item.id)}>
                          Review Claims
                        </button>
                      )}
                      <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDelete(item.id)} title="Delete"><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {totalPages > 1 && <div className="pagination">{[...Array(totalPages)].map((_, i) => <button key={i} onClick={() => setPage(i)} className={page === i ? 'active' : ''}>{i + 1}</button>)}</div>}
      {selectedItemId && <FinderClaimsModal foundItemId={selectedItemId} onClose={() => setSelectedItemId(null)} />}
    </DashboardLayout>
  );
}
