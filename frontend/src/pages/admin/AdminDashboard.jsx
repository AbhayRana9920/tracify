import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import adminService from '../../services/adminService';
import { FiUsers, FiSearch, FiPackage, FiFileText, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getDashboard()
      .then(res => setStats(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardLayout><div className="loading-screen"><div className="spinner"></div></div></DashboardLayout>;
  if (!stats) return null;

  const doughnutData = {
    labels: ['Open', 'Available', 'Pending Claims', 'Resolved'],
    datasets: [{
      data: [stats.openLostItems, stats.availableFoundItems, stats.pendingClaims, stats.resolvedItems],
      backgroundColor: ['#ef4444', '#22c55e', '#f59e0b', '#6366f1'],
      borderWidth: 0,
    }]
  };

  const barData = {
    labels: ['Users', 'Lost Items', 'Found Items', 'Claims', 'Complaints'],
    datasets: [{
      label: 'Count',
      data: [stats.totalUsers, stats.totalLostItems, stats.totalFoundItems, stats.totalClaims, stats.pendingComplaints],
      backgroundColor: ['#6366f1', '#ef4444', '#22c55e', '#f59e0b', '#f97316'],
      borderRadius: 6,
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { labels: { color: '#94a3b8' } } },
    scales: { x: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } }, y: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } } }
  };

  return (
    <DashboardLayout>
      <div className="page-header"><h1 className="page-title">Admin <span>Dashboard</span></h1></div>
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-icon" style={{ background: 'rgba(99,102,241,0.15)', color: '#6366f1' }}><FiUsers /></div><div className="stat-info"><h3>{stats.totalUsers}</h3><p>Total Users</p></div></div>
        <div className="stat-card"><div className="stat-icon" style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}><FiSearch /></div><div className="stat-info"><h3>{stats.totalLostItems}</h3><p>Lost Items</p></div></div>
        <div className="stat-card"><div className="stat-icon" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}><FiPackage /></div><div className="stat-info"><h3>{stats.totalFoundItems}</h3><p>Found Items</p></div></div>
        <div className="stat-card"><div className="stat-icon" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}><FiFileText /></div><div className="stat-info"><h3>{stats.pendingClaims}</h3><p>Pending Claims</p></div></div>
        <div className="stat-card"><div className="stat-icon" style={{ background: 'rgba(6,182,212,0.15)', color: '#06b6d4' }}><FiCheckCircle /></div><div className="stat-info"><h3>{stats.resolvedItems}</h3><p>Resolved</p></div></div>
        <div className="stat-card"><div className="stat-icon" style={{ background: 'rgba(249,115,22,0.15)', color: '#f97316' }}><FiAlertTriangle /></div><div className="stat-info"><h3>{stats.pendingComplaints}</h3><p>Complaints</p></div></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div className="chart-container">
          <h3 style={{ marginBottom: 16 }}>Item Status Distribution</h3>
          <div style={{ maxWidth: 280, margin: '0 auto' }}><Doughnut data={doughnutData} options={{ plugins: { legend: { labels: { color: '#94a3b8' } } } }} /></div>
        </div>
        <div className="chart-container">
          <h3 style={{ marginBottom: 16 }}>System Overview</h3>
          <Bar data={barData} options={chartOptions} />
        </div>
      </div>
    </DashboardLayout>
  );
}
