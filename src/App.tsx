import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { Loading } from './components/common/Loading';
import { BottomNavigation } from './components/common/BottomNavigation';

// Pages
import { WelcomePage } from './pages/WelcomePage';
import { MarketplacePage } from './pages/buyer/MarketplacePage';
import { BuyerProfilePage } from './pages/buyer/BuyerProfilePage';
import { SellerDashboardPage } from './pages/seller/SellerDashboardPage';
import { CreateProductPage } from './pages/seller/CreateProductPage';
import { SellerWalletPage } from './pages/seller/SellerWalletPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';

// Protected Route Component
const ProtectedRoute = ({ 
  children, 
  requiredRole 
}: { 
  children: React.ReactNode; 
  requiredRole?: 'BUYER' | 'SELLER' | 'ADMIN' 
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Loading text="Loading..." />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Redirect based on user role
    switch (user.role) {
      case 'BUYER':
        return <Navigate to="/marketplace" replace />;
      case 'SELLER':
        return <Navigate to="/seller/dashboard" replace />;
      case 'ADMIN':
        return <Navigate to="/admin/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

// App Routes Component
const AppRoutes = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Loading text="Initializing..." />;
  }

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/" 
          element={user ? (
            user.role === 'BUYER' ? <Navigate to="/marketplace" replace /> :
            user.role === 'SELLER' ? <Navigate to="/seller/dashboard" replace /> :
            user.role === 'ADMIN' ? <Navigate to="/admin/dashboard" replace /> :
            <WelcomePage />
          ) : <WelcomePage />} 
        />
        
        <Route path="/admin-login" element={<AdminLoginPage />} />

        {/* Buyer Routes */}
        <Route 
          path="/marketplace" 
          element={
            <ProtectedRoute>
              <MarketplacePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute requiredRole="BUYER">
              <BuyerProfilePage />
            </ProtectedRoute>
          } 
        />

        {/* Seller Routes */}
        <Route 
          path="/seller/dashboard" 
          element={
            <ProtectedRoute requiredRole="SELLER">
              <SellerDashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/seller/create-product" 
          element={
            <ProtectedRoute requiredRole="SELLER">
              <CreateProductPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/seller/wallet" 
          element={
            <ProtectedRoute requiredRole="SELLER">
              <SellerWalletPage />
            </ProtectedRoute>
          } 
        />

        {/* Admin Routes */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminDashboardPage />
            </ProtectedRoute>
          } 
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <BottomNavigation />
    </>
  );
};

// Main App Component
function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <AppRoutes />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;