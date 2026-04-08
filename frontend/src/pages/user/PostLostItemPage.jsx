import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import lostItemService from '../../services/lostItemService';
import categoryService from '../../services/categoryService';
import { toast } from 'react-toastify';

export default function PostLostItemPage() {
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', itemName: '', categoryId: '', description: '', color: '',
    brand: '', locationLost: '', dateLost: '', identificationMarks: '',
    rewardAmount: '', contactPreference: 'EMAIL',
  });

  useEffect(() => { categoryService.getAll().then(r => setCategories(r.data.data)).catch(() => {}); }, []);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      const itemBlob = new Blob([JSON.stringify({ ...form, categoryId: Number(form.categoryId), rewardAmount: form.rewardAmount ? Number(form.rewardAmount) : null })], { type: 'application/json' });
      formData.append('item', itemBlob);
      images.forEach(img => formData.append('images', img));
      await lostItemService.create(formData);
      toast.success('Lost item posted successfully!');
      navigate('/my-lost-items');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post item');
    }
    setLoading(false);
  };

  return (
    <DashboardLayout>
      <div className="page-header"><h1 className="page-title">Report <span>Lost Item</span></h1></div>
      <div className="card" style={{ maxWidth: 700 }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="input-group"><label>Title *</label><input placeholder="e.g. Lost my blue iPhone 15" value={form.title} onChange={update('title')} required /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="input-group"><label>Item Name *</label><input placeholder="e.g. iPhone 15" value={form.itemName} onChange={update('itemName')} required /></div>
            <div className="input-group"><label>Category *</label>
              <select value={form.categoryId} onChange={update('categoryId')} required>
                <option value="">Select category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
              </select>
            </div>
          </div>
          <div className="input-group"><label>Description</label><textarea placeholder="Describe the item, any distinguishing features..." value={form.description} onChange={update('description')} /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="input-group"><label>Color</label><input placeholder="e.g. Blue" value={form.color} onChange={update('color')} /></div>
            <div className="input-group"><label>Brand</label><input placeholder="e.g. Apple" value={form.brand} onChange={update('brand')} /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="input-group"><label>Location Lost</label><input placeholder="e.g. Library, Building A" value={form.locationLost} onChange={update('locationLost')} /></div>
            <div className="input-group"><label>Date Lost</label><input type="date" value={form.dateLost} onChange={update('dateLost')} /></div>
          </div>
          <div className="input-group"><label>Identification Marks</label><input placeholder="Scratches, stickers, engravings..." value={form.identificationMarks} onChange={update('identificationMarks')} /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="input-group"><label>Reward Amount (₹)</label><input type="number" placeholder="0" value={form.rewardAmount} onChange={update('rewardAmount')} /></div>
            <div className="input-group"><label>Contact Preference</label>
              <select value={form.contactPreference} onChange={update('contactPreference')}>
                <option value="EMAIL">Email</option><option value="PHONE">Phone</option><option value="BOTH">Both</option>
              </select>
            </div>
          </div>
          <div className="input-group">
            <label>Images</label>
            <input type="file" multiple accept="image/*" onChange={e => setImages([...e.target.files])} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Posting...' : 'Post Lost Item'}</button>
        </form>
      </div>
    </DashboardLayout>
  );
}
