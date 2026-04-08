import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import lostItemService from '../../services/lostItemService';
import StatusBadge from '../../components/common/StatusBadge';
import { formatDate } from '../../utils/helpers';
import { toast } from 'react-toastify';
import { FiTrash2 } from 'react-icons/fi';

export default function MyLostItemsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const load = async () => {
    setLoading(true);
    try {
      const res = await lostItemService.getMine({ page, size: 10 });
      setItems(res.data.data.content);
      setTotalPages(res.data.data.totalPages);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { load(); }, [page]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this item?')) return;
    try { await lostItemService.delete(id); toast.success('Deleted'); load(); } catch (e) { toast.error('Failed'); }
  };

  return (
    <DashboardLayout>
      <div className="page-header"><h1 className="page-title">My <span>Lost Items</span></h1></div>
      {loading ? <div className="loading-screen"><div className="spinner"></div></div> : items.length === 0 ? (
        <div className="empty-state"><div className="empty-icon">🔍</div><h3>No lost items posted</h3><p>Report a lost item to get started.</p></div>
      ) : (
        <div className="table-container">
          <table>
            <thead><tr><th>Title</th><th>Category</th><th>Date Lost</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td><Link to={`/lost-items/${item.id}`} style={{ fontWeight: 600 }}>{item.title}</Link></td>
                  <td>{item.categoryName}</td>
                  <td>{formatDate(item.dateLost)}</td>
                  <td><StatusBadge status={item.status} /></td>
                  <td><button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDelete(item.id)}><FiTrash2 /></button></td>
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
