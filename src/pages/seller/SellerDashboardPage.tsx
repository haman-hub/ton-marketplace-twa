import { useState, useEffect } from 'react';
import { Plus, TrendingUp, Package, DollarSign, Star, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Product, Purchase } from '../../types';
import { mockDatabase } from '../../services/mockDatabase';
import { useAuth } from '../../hooks/useAuth';
import { formatTON, formatDate, getCategoryDisplayName } from '../../utils/helpers';

export const SellerDashboardPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalSales: 0,
    activeProducts: 0
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = () => {
    if (!user) return;

    const sellerProducts = mockDatabase.getProductsBySeller(user.id);
    const sellerPurchases = mockDatabase.getPurchasesBySeller(user.id);
    
    setProducts(sellerProducts);
    setPurchases(sellerPurchases);

    // Calculate stats
    const totalRevenue = sellerPurchases.reduce((sum, purchase) => sum + purchase.pricePaid, 0);
    const activeProducts = sellerProducts.filter(p => p.isActive).length;

    setStats({
      totalRevenue,
      totalSales: sellerPurchases.length,
      activeProducts
    });
  };

  const toggleProductStatus = (productId: string, isActive: boolean) => {
    mockDatabase.updateProduct(productId, { isActive: !isActive });
    loadData();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Seller Dashboard</h1>
              <p className="text-sm text-gray-600">
                Welcome back, {user?.username}
                {user?.verificationStatus === 'VERIFIED' && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    <Star className="w-3 h-3 mr-1" />
                    Verified
                  </span>
                )}
              </p>
            </div>
            
            <Button onClick={() => navigate('/seller/create-product')}>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatTON(stats.totalRevenue)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSales}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Products</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeProducts}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Your Products</h2>
          </div>
          
          <div className="p-6">
            {products.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
                <p className="text-gray-600 mb-4">Start selling by creating your first product</p>
                <Button onClick={() => navigate('/seller/create-product')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Product
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {products.map(product => (
                  <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-medium text-gray-900">{product.title}</h3>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            product.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {product.isActive ? 'Active' : 'Inactive'}
                          </span>
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                            {getCategoryDisplayName(product.category)}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Price: {formatTON(product.price)}</span>
                          <span>Rating: {product.averageRating.toFixed(1)} ({product.totalRatings})</span>
                          <span>Created: {formatDate(product.createdAt)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleProductStatus(product.id, product.isActive)}
                        >
                          {product.isActive ? (
                            <>
                              <EyeOff className="w-4 h-4 mr-1" />
                              Hide
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4 mr-1" />
                              Show
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Sales */}
        {purchases.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm mt-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Recent Sales</h2>
            </div>
            
            <div className="p-6">
              <div className="space-y-3">
                {purchases.slice(0, 5).map(purchase => {
                  const product = products.find(p => p.id === purchase.productId);
                  return (
                    <div key={purchase.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <div>
                        <p className="font-medium text-gray-900">{product?.title}</p>
                        <p className="text-sm text-gray-600">{formatDate(purchase.createdAt)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{formatTON(purchase.pricePaid)}</p>
                        {purchase.userRating && (
                          <p className="text-sm text-yellow-600">★ {purchase.userRating}/5</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};