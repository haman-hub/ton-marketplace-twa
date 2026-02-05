import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, User, ShoppingBag } from 'lucide-react';
import { Button } from '../components/common/Button';
import { mockDatabase } from '../services/mockDatabase';
import { useAuth } from '../hooks/useAuth';

export const WelcomePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleStartFresh = () => {
    setIsLoading(true);
    
    // Initialize empty database
    mockDatabase.initializeEmptyData();
    
    // Create new user
    const newUser = mockDatabase.createUser({
      username: 'new_user',
      role: 'BUYER',
      balance: 0,
      verificationStatus: 'UNVERIFIED',
      isBanned: false
    });

    login(newUser);
    setTimeout(() => {
      navigate('/marketplace');
    }, 1000);
  };

  const handleDemoMode = (role: 'BUYER' | 'SELLER') => {
    setIsLoading(true);
    
    // Initialize demo database
    mockDatabase.initializeDemoData();
    
    // Get demo user
    const users = mockDatabase.getUsers();
    const demoUser = users.find(user => user.role === role);
    
    if (demoUser) {
      login(demoUser);
      setTimeout(() => {
        navigate(role === 'BUYER' ? '/marketplace' : '/seller/dashboard');
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ton-blue to-ton-blue-dark flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-ton-blue rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            TON Marketplace
          </h1>
          <p className="text-gray-600">
            Decentralized digital goods marketplace
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Get Started
            </h2>
            
            <Button
              fullWidth
              onClick={handleStartFresh}
              isLoading={isLoading}
              className="mb-3"
            >
              <User className="w-4 h-4 mr-2" />
              Start Fresh
            </Button>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Or try Demo Mode:
            </h3>
            
            <div className="space-y-2">
              <Button
                fullWidth
                variant="secondary"
                onClick={() => handleDemoMode('BUYER')}
                isLoading={isLoading}
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Demo as Buyer
              </Button>
              
              <Button
                fullWidth
                variant="secondary"
                onClick={() => handleDemoMode('SELLER')}
                isLoading={isLoading}
              >
                <Zap className="w-4 h-4 mr-2" />
                Demo as Seller
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Demo mode includes pre-filled data for testing
          </p>
        </div>
      </div>
    </div>
  );
};