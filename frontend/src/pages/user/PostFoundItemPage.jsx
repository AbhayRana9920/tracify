import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import foundItemService from '../../services/foundItemService';
import categoryService from '../../services/categoryService';
import { toast } from 'react-toastify';

export default function PostFoundItemPage() {
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', itemName: '', categoryId: '', description: '', color: '',
    brand: '', locationFound: '', dateFound: '', identificationMarks: '', storageLocation: '',
  });

  useEffect(() => { categoryService.getAll().then(r => setCategories(r.data.data)).catch(() => {}); }, []);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      const itemBlob = new Blob([JSON.stringify({ ...form, categoryId: Number(form.categoryId) })], { type: 'application/json' });
      formData.append('item', itemBlob);
      images.forEach(img => formData.append('images', img));
      await foundItemService.create(formData);
      toast.success('Found item posted!');
      navigate('/my-found-items');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post item');
    }
    setLoading(false);
  };

  return (
    <DashboardLayout>
      <div className="page-header"><h1 className="page-title">Report <span>Found Item</span></h1></div>
      <div className="card" style={{ maxWidth: 700 }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="input-group"><label>Title *</label><input placeholder="e.g. Found a wallet near cafeteria" value={form.title} onChange={update('title')} required /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="input-group"><label>Item Name *</label><input placeholder="e.g. Leather Wallet" value={form.itemName} onChange={update('itemName')} required /></div>
            <div className="input-group"><label>Category *</label>
              <select value={form.categoryId} onChange={update('categoryId')} required>
                <option value="">Select category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
              </select>
            </div>
          </div>
          <div className="input-group"><label>Description</label><textarea placeholder="Describe the item..." value={form.description} onChange={update('description')} /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="input-group"><label>Color</label><input value={form.color} onChange={update('color')} /></div>
            <div className="input-group"><label>Brand</label><input value={form.brand} onChange={update('brand')} /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="input-group"><label>Location Found</label><input value={form.locationFound} onChange={update('locationFound')} /></div>
            <div className="input-group"><label>Date Found</label><input type="date" value={form.dateFound} onChange={update('dateFound')} /></div>
          </div>
          <div className="input-group"><label>Identification Marks</label><input value={form.identificationMarks} onChange={update('identificationMarks')} /></div>
          <div className="input-group"><label>Storage Location</label><input placeholder="Where is the item stored now?" value={form.storageLocation} onChange={update('storageLocation')} /></div>
          <div className="input-group"><label>Images</label><input type="file" multiple accept="image/*" onChange={e => setImages([...e.target.files])} /></div>
          <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Posting...' : 'Post Found Item'}</button>
        </form>
      </div>
    </DashboardLayout>
  );
}
