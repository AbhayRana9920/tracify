import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../hooks/useAuth';
import userService from '../../services/userService';
import { toast } from 'react-toastify';
import { FILE_BASE_URL } from '../../utils/constants';
export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ fullName: '', phone: '', bio: '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) setForm({ fullName: user.fullName || '', phone: user.phone || '', bio: user.bio || '' });
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await userService.updateProfile(form);
      const updated = { ...user, ...res.data.data };
      localStorage.setItem('user', JSON.stringify(updated));
      setUser(updated);
      toast.success('Profile updated');
    } catch (err) { toast.error('Failed to update'); }
    setLoading(false);
  };

  const handlePhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await userService.updatePhoto(fd);
      const updated = { ...user, profilePhoto: res.data.data.profilePhoto };
      localStorage.setItem('user', JSON.stringify(updated));
      setUser(updated);
      toast.success('Photo updated');
    } catch (err) { toast.error('Failed'); }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    try {
      await userService.changePassword(pwForm);
      toast.success('Password changed');
      setPwForm({ currentPassword: '', newPassword: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  return (
    <DashboardLayout>
      <div className="page-header"><h1 className="page-title">My <span>Profile</span></h1></div>
      <div style={{ display: 'grid', gap: 24, maxWidth: 600 }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
            <div className="nav-avatar" style={{ width: 64, height: 64, fontSize: '1.5rem' }}>
              {user?.profilePhoto ? <img src={`${FILE_BASE_URL}${user.profilePhoto}`} alt="" /> : user?.fullName?.[0]}
            </div>
            <div>
              <h3>{user?.fullName}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>@{user?.username} · {user?.email}</p>
              <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', marginTop: 8 }}>
                Change Photo <input type="file" accept="image/*" onChange={handlePhoto} style={{ display: 'none' }} />
              </label>
            </div>
          </div>
          <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="input-group"><label>Full Name</label><input value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} /></div>
            <div className="input-group"><label>Phone</label><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
            <div className="input-group"><label>Bio</label><textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} /></div>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
          </form>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: 16 }}>Change Password</h3>
          <form onSubmit={handlePassword} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="input-group"><label>Current Password</label><input type="password" value={pwForm.currentPassword} onChange={e => setPwForm({ ...pwForm, currentPassword: e.target.value })} required /></div>
            <div className="input-group"><label>New Password</label><input type="password" value={pwForm.newPassword} onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })} required minLength={6} /></div>
            <button type="submit" className="btn btn-secondary">Change Password</button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
