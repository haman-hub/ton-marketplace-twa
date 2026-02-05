import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { ProductCategory } from '../../types';
import { mockDatabase } from '../../services/mockDatabase';
import { useAuth } from '../../hooks/useAuth';
import { isValidPrice, getCategoryDisplayName } from '../../utils/helpers';

export const CreateProductPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'TUTORIALS' as ProductCategory,
    hiddenLink: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const categories: ProductCategory[] = ['EBOOKS', 'TUTORIALS', 'ASSETS', 'SOFTWARE', 'OTHER'];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else if (!isValidPrice(formData.price)) {
      newErrors.price = 'Price must be between 0.01 and 1000 TON';
    }

    if (!formData.hiddenLink.trim()) {
      newErrors.hiddenLink = 'Access link is required';
    } else if (!formData.hiddenLink.startsWith('http')) {
      newErrors.hiddenLink = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user) return;

    setIsSubmitting(true);

    try {
      const product = mockDatabase.createProduct({
        sellerId: user.id,
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        hiddenLink: formData.hiddenLink.trim(),
        isActive: true
      });

      if (product) {
        navigate('/seller/dashboard');
      }
    } catch (error) {
      console.error('Error creating product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/seller/dashboard')}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-xl font-bold text-gray-900">Create New Product</h1>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <Package className="w-5 h-5 text-ton-blue mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Product Details</h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <Input
              label="Product Title"
              placeholder="e.g., Complete React Tutorial"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              error={errors.title}
              fullWidth
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                placeholder="Describe your digital product..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ton-blue focus:border-transparent transition-colors ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Price (TON)"
                type="number"
                step="0.01"
                min="0.01"
                max="1000"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                error={errors.price}
                fullWidth
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ton-blue focus:border-transparent"
                  required
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {getCategoryDisplayName(category)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Input
              label="Access Link"
              type="url"
              placeholder="https://example.com/your-digital-content"
              value={formData.hiddenLink}
              onChange={(e) => handleInputChange('hiddenLink', e.target.value)}
              error={errors.hiddenLink}
              fullWidth
              required
            />

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Important Notes:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• The access link will be shared with buyers after purchase</li>
                <li>• Make sure the link provides access to your digital content</li>
                <li>• You'll receive the full price minus a 0.1 TON platform fee</li>
                <li>• Products can be hidden/shown from your dashboard</li>
              </ul>
            </div>

            <div className="flex space-x-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/seller/dashboard')}
                fullWidth
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isSubmitting}
                fullWidth
              >
                Create Product
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};