import { useState, useEffect } from 'react';
import { Search, Filter, Star, Wallet, Plus } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { WalletModal } from '../../components/modals/WalletModal';
import { PurchaseModal } from '../../components/modals/PurchaseModal';
import { Product, ProductCategory } from '../../types';
import { mockDatabase } from '../../services/mockDatabase';
import { useAuth } from '../../hooks/useAuth';
import { formatTON, getCategoryDisplayName, getRatingStars } from '../../utils/helpers';
import { walletService } from '../../services/walletService';

export const MarketplacePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'date'>('date');
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showFaucet, setShowFaucet] = useState(false);
  const { user, updateUser } = useAuth();

  const categories: (ProductCategory | 'ALL')[] = ['ALL', 'EBOOKS', 'TUTORIALS', 'ASSETS', 'SOFTWARE', 'OTHER'];

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchTerm, selectedCategory, sortBy]);

  const loadProducts = () => {
    const allProducts = mockDatabase.getProducts().filter(p => p.isActive);
    setProducts(allProducts);
  };

  const filterAndSortProducts = () => {
    let filtered = products.filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'ALL' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'rating':
          return b.averageRating - a.averageRating;
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setShowPurchaseModal(true);
  };

  const handleWalletConnect = (address: string) => {
    setShowFaucet(true);
  };

  const handleFaucet = async () => {
    if (!user) return;
    
    const success = await walletService.addTestnetTon(10);
    if (success) {
      updateUser({ balance: user.balance + 10 });
      setShowFaucet(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">TON Marketplace</h1>
            
            <div className="flex items-center space-x-3">
              {user?.walletAddress ? (
                <div className="flex items-center space-x-2">
                  <div className="text-sm">
                    <div className="font-medium">{formatTON(user.balance)}</div>
                    <div className="text-gray-500 text-xs">
                      {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
                    </div>
                  </div>
                  {showFaucet && (
                    <Button size="sm" onClick={handleFaucet}>
                      <Plus className="w-3 h-3 mr-1" />
                      Faucet
                    </Button>
                  )}
                </div>
              ) : (
                <Button onClick={() => setShowWalletModal(true)}>
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect Wallet
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as ProductCategory | 'ALL')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ton-blue"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'ALL' ? 'All Categories' : getCategoryDisplayName(category)}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'price' | 'rating' | 'date')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ton-blue"
            >
              <option value="date">Newest First</option>
              <option value="price">Price: Low to High</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleProductClick(product)}
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-gray-900 line-clamp-2">
                    {product.title}
                  </h3>
                  <span className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-600">
                    {getCategoryDisplayName(product.category)}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-400">{getRatingStars(product.averageRating)}</span>
                    <span className="text-xs text-gray-500">
                      ({product.totalRatings})
                    </span>
                  </div>
                  <div className="text-lg font-bold text-ton-blue">
                    {formatTON(product.price)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No products found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <WalletModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onConnect={handleWalletConnect}
      />

      <PurchaseModal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        product={selectedProduct}
      />
    </div>
  );
};