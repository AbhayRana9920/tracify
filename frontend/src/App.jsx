import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/layout/Navbar';
import ProtectedRoute from './routes/ProtectedRoute';

// Public pages
import HomePage from './pages/public/HomePage';
import LostItemsListPage from './pages/public/LostItemsListPage';
import FoundItemsListPage from './pages/public/FoundItemsListPage';
import ItemDetailPage from './pages/public/ItemDetailPage';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// User pages
import UserDashboard from './pages/user/UserDashboard';
import PostLostItemPage from './pages/user/PostLostItemPage';
import PostFoundItemPage from './pages/user/PostFoundItemPage';
import MyLostItemsPage from './pages/user/MyLostItemsPage';
import MyFoundItemsPage from './pages/user/MyFoundItemsPage';
import MyClaimsPage from './pages/user/MyClaimsPage';
import ClaimFormPage from './pages/user/ClaimFormPage';
import ProfilePage from './pages/user/ProfilePage';
import NotificationsPage from './pages/user/NotificationsPage';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsersPage from './pages/admin/ManageUsersPage';
import ManageClaimsPage from './pages/admin/ManageClaimsPage';
import ManageComplaintsPage from './pages/admin/ManageComplaintsPage';
import ManageLostItemsPage from './pages/admin/ManageLostItemsPage';
import ManageFoundItemsPage from './pages/admin/ManageFoundItemsPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/lost-items" element={<LostItemsListPage />} />
          <Route path="/found-items" element={<FoundItemsListPage />} />
          <Route path="/lost-items/:id" element={<ItemDetailPage type="lost" />} />
          <Route path="/found-items/:id" element={<ItemDetailPage type="found" />} />

          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected - User */}
          <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
          <Route path="/post-lost" element={<ProtectedRoute><PostLostItemPage /></ProtectedRoute>} />
          <Route path="/post-found" element={<ProtectedRoute><PostFoundItemPage /></ProtectedRoute>} />
          <Route path="/my-lost-items" element={<ProtectedRoute><MyLostItemsPage /></ProtectedRoute>} />
          <Route path="/my-found-items" element={<ProtectedRoute><MyFoundItemsPage /></ProtectedRoute>} />
          <Route path="/my-claims" element={<ProtectedRoute><MyClaimsPage /></ProtectedRoute>} />
          <Route path="/claim/:id" element={<ProtectedRoute><ClaimFormPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />

          {/* Protected - Admin */}
          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute adminOnly><ManageUsersPage /></ProtectedRoute>} />
          <Route path="/admin/lost-items" element={<ProtectedRoute adminOnly><ManageLostItemsPage /></ProtectedRoute>} />
          <Route path="/admin/found-items" element={<ProtectedRoute adminOnly><ManageFoundItemsPage /></ProtectedRoute>} />
          <Route path="/admin/claims" element={<ProtectedRoute adminOnly><ManageClaimsPage /></ProtectedRoute>} />
          <Route path="/admin/complaints" element={<ProtectedRoute adminOnly><ManageComplaintsPage /></ProtectedRoute>} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
