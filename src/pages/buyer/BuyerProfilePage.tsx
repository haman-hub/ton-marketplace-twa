import { useState, useEffect } from 'react';
import { Star, ExternalLink, Flag, Copy } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Purchase, Product, ReportReason } from '../../types';
import { mockDatabase } from '../../services/mockDatabase';
import { useAuth } from '../../hooks/useAuth';
import { formatTON, formatDate, copyToClipboard } from '../../utils/helpers';

export const BuyerProfilePage = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [rating, setRating] = useState(5);
  const [reportReason, setReportReason] = useState<ReportReason>('SCAM');
  const [reportDescription, setReportDescription] = useState('');
  const { user } = useAuth();

  const reportReasons: { value: ReportReason; label: string }[] = [
    { value: 'SCAM', label: 'Scam / Fraud' },
    { value: 'SPAM', label: 'Spam' },
    { value: 'INAPPROPRIATE', label: 'Inappropriate Content' },
    { value: 'FAKE', label: 'Fake Product' },
    { value: 'OTHER', label: 'Other' }
  ];

  useEffect(() => {
    if (user) {
      loadPurchases();
    }
  }, [user]);

  const loadPurchases = () => {
    if (!user) return;

    const userPurchases = mockDatabase.getPurchasesByBuyer(user.id);
    setPurchases(userPurchases);

    // Load associated products
    const productIds = userPurchases.map(p => p.productId);
    const purchasedProducts = productIds.map(id => mockDatabase.getProductById(id)).filter(Boolean) as Product[];
    setProducts(purchasedProducts);
  };

  const handleRateProduct = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setRating(purchase.userRating || 5);
    setShowRatingModal(true);
  };

  const handleReportProduct = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setReportReason('SCAM');
    setReportDescription('');
    setShowReportModal(true);
  };

  const submitRating = () => {
    if (!selectedPurchase) return;

    mockDatabase.updatePurchaseRating(selectedPurchase.id, rating);
    loadPurchases();
    setShowRatingModal(false);
  };

  const submitReport = () => {
    if (!selectedPurchase || !user) return;

    mockDatabase.createReport({
      reporterId: user.id,
      productId: selectedPurchase.productId,
      reason: reportReason,
      description: reportDescription,
      status: 'PENDING'
    });

    setShowReportModal(false);
  };

  const copyProductLink = async (hiddenLink: string) => {
    await copyToClipboard(hiddenLink);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900">My Purchases</h1>
          <p className="text-sm text-gray-600">View and manage your purchased items</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {purchases.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Star className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No purchases yet</h3>
            <p className="text-gray-600">Start exploring the marketplace to find great digital products!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {purchases.map(purchase => {
              const product = products.find(p => p.id === purchase.productId);
              if (!product) return null;

              return (
                <div key={purchase.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {product.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Purchased: {formatDate(purchase.createdAt)}</span>
                        <span>Price: {formatTON(purchase.pricePaid)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyProductLink(product.hiddenLink)}
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        Copy Link
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => window.open(product.hiddenLink, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Access
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-4">
                      {purchase.userRating ? (
                        <div className="flex items-center space-x-1">
                          <span className="text-sm text-gray-600">Your rating:</span>
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map(star => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= purchase.userRating!
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleRateProduct(purchase)}
                        >
                          <Star className="w-4 h-4 mr-1" />
                          Rate Product
                        </Button>
                      )}
                    </div>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleReportProduct(purchase)}
                    >
                      <Flag className="w-4 h-4 mr-1" />
                      Report
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Rating Modal */}
      <Modal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        title="Rate Product"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            How would you rate "{products.find(p => p.id === selectedPurchase?.productId)?.title}"?
          </p>

          <div className="flex items-center justify-center space-x-2">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="p-1 hover:scale-110 transition-transform"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= rating
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300 hover:text-yellow-200'
                  }`}
                />
              </button>
            ))}
          </div>

          <div className="flex space-x-3">
            <Button
              variant="secondary"
              onClick={() => setShowRatingModal(false)}
              fullWidth
            >
              Cancel
            </Button>
            <Button onClick={submitRating} fullWidth>
              Submit Rating
            </Button>
          </div>
        </div>
      </Modal>

      {/* Report Modal */}
      <Modal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        title="Report Product"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason for Report
            </label>
            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value as ReportReason)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ton-blue"
            >
              {reportReasons.map(reason => (
                <option key={reason.value} value={reason.value}>
                  {reason.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
              placeholder="Provide additional details about the issue..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ton-blue"
            />
          </div>

          <div className="flex space-x-3">
            <Button
              variant="secondary"
              onClick={() => setShowReportModal(false)}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={submitReport}
              fullWidth
            >
              Submit Report
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};