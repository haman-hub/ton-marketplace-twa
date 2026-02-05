import { useLocation, useNavigate } from 'react-router-dom';
import { Home, User, Package, Wallet, Settings } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const BottomNavigation = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return null;

  const buyerNavItems = [
    { icon: Home, label: 'Marketplace', path: '/marketplace' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  const sellerNavItems = [
    { icon: Package, label: 'Dashboard', path: '/seller/dashboard' },
    { icon: Wallet, label: 'Wallet', path: '/seller/wallet' },
  ];

  const adminNavItems = [
    { icon: Settings, label: 'Admin', path: '/admin/dashboard' },
  ];

  let navItems = [];
  if (user.role === 'BUYER') navItems = buyerNavItems;
  else if (user.role === 'SELLER') navItems = sellerNavItems;
  else if (user.role === 'ADMIN') navItems = adminNavItems;

  if (navItems.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 safe-area-bottom">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'text-ton-blue bg-ton-blue/10'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
