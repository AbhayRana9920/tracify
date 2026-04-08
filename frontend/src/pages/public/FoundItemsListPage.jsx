import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import foundItemService from '../../services/foundItemService';
import categoryService from '../../services/categoryService';
import StatusBadge from '../../components/common/StatusBadge';
import { formatDate, getImageUrl, truncate } from '../../utils/helpers';

export default function FoundItemsListPage() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const params = { page, size: 12 };
      if (searchTerm) params.keyword = searchTerm;
      if (categoryId) params.categoryId = categoryId;
      const res = await foundItemService.getAll(params);
      const data = res.data.data;
      setItems(data.content);
      setTotalPages(data.totalPages);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { categoryService.getAll().then(r => setCategories(r.data.data)).catch(() => {}); }, []);
  useEffect(() => { load(); }, [page, searchTerm, categoryId]);

  const handleSearch = (e) => { e.preventDefault(); setSearchTerm(keyword); setPage(0); };

  return (
    <div style={{ paddingTop: 'calc(var(--navbar-height) + 24px)', maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
      <div className="page-header">
        <h1 className="page-title">Found <span>Items</span></h1>
      </div>

      <div className="search-filter-bar">
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, flex: 1 }}>
          <input placeholder="Search found items..." value={keyword} onChange={e => setKeyword(e.target.value)} style={{ flex: 1, maxWidth: 'none' }} />
          <button type="submit" className="btn btn-primary btn-sm">Search</button>
        </form>
        <select value={categoryId} onChange={e => { setCategoryId(e.target.value); setPage(0); }}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="loading-screen"><div className="spinner"></div></div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No found items yet</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          <div className="grid grid-3">
            {items.map(item => (
              <Link to={`/found-items/${item.id}`} key={item.id} className="item-card">
                <div className="item-card-image">
                  {item.imageUrls?.length > 0 ? <img src={getImageUrl(item.imageUrls[0])} alt={item.title} /> : '📦'}
                </div>
                <div className="item-card-body">
                  <h3>{item.title}</h3>
                  <div className="item-meta">
                    <span>📍 {item.locationFound || 'Unknown'}</span>
                    <span>📅 {formatDate(item.dateFound)}</span>
                  </div>
                  <p className="item-desc">{truncate(item.description, 80)}</p>
                  <div className="item-card-footer">
                    <StatusBadge status={item.status} />
                    {item.claimCount > 0 && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.claimCount} claims</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="pagination">
              <button onClick={() => setPage(p => p - 1)} disabled={page === 0}>Prev</button>
              {[...Array(totalPages)].map((_, i) => (
                <button key={i} onClick={() => setPage(i)} className={page === i ? 'active' : ''}>{i + 1}</button>
              ))}
              <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1}>Next</button>
            </div>
          )}
        </>
      )}
      <div style={{ height: 40 }} />
    </div>
  );
}
