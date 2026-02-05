import { useState, useEffect } from 'react';
import { Wallet, TrendingUp, Download, Star, AlertCircle } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { Withdrawal, VerificationRequest } from '../../types';
import { mockDatabase } from '../../services/mockDatabase';
import { useAuth } from '../../hooks/useAuth';
import { formatTON, formatDate } from '../../utils/helpers';

export const SellerWalletPage = () => {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [verificationRequest, setVerificationRequest] = useState<VerificationRequest | null>(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [error, setError] = useState('');
  const { user, updateUser } = useAuth();

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = () => {
    if (!user) return;

    const sellerWithdrawals = mockDatabase.getWithdrawals().filter(w => w.sellerId === user.id);
    setWithdrawals(sellerWithdrawals);

    const requests = mockDatabase.getVerificationRequests().filter(r => r.sellerId === user.id);
    const pendingRequest = requests.find(r => r.status === 'PENDING');
    setVerificationRequest(pendingRequest || null);
  };

  const handleWithdrawRequest = () => {
    if (!user) return;

    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (amount > user.balance) {
      setError('Insufficient balance');
      return;
    }

    const withdrawal = mockDatabase.createWithdrawal(user.id, amount);
    if (withdrawal) {
      // Update user balance in context
      const updatedUser = mockDatabase.getUserById(user.id);
      if (updatedUser) {
        updateUser({ balance: updatedUser.balance });
      }
      
      loadData();
      setShowWithdrawModal(false);
      setWithdrawAmount('');
      setError('');
    }
  };

  const handleVerificationRequest = () => {
    if (!user) return;

    mockDatabase.createVerificationRequest(user.id);
    loadData();
    setShowVerificationModal(false);
  };

  const canRequestVerification = user?.verificationStatus === 'UNVERIFIED' && !verificationRequest;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900">Wallet & Earnings</h1>
          <p className="text-sm text-gray-600">Manage your earnings and verification status</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Balance Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Wallet className="w-5 h-5 text-ton-blue" />
                <h2 className="text-lg font-medium text-gray-900">Available Balance</h2>
              </div>
              <p className="text-3xl font-bold text-ton-blue">
                {formatTON(user?.balance || 0)}
              </p>
              {user?.walletAddress && (
                <p className="text-sm text-gray-500 mt-1">
                  {user.walletAddress.slice(0, 8)}...{user.walletAddress.slice(-6)}
                </p>
              )}
            </div>
            
            <div className="text-right">
              <Button
                onClick={() => setShowWithdrawModal(true)}
                disabled={!user?.balance || user.balance <= 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Withdraw
              </Button>
            </div>
          </div>
        </div>

        {/* Verification Status */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <h2 className="text-lg font-medium text-gray-900">Verification Status</h2>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-sm font-medium ${
                  user?.verificationStatus === 'VERIFIED' 
                    ? 'bg-green-100 text-green-800'
                    : user?.verificationStatus === 'PENDING'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {user?.verificationStatus === 'VERIFIED' && '✓ Verified Seller'}
                  {user?.verificationStatus === 'PENDING' && '⏳ Verification Pending'}
                  {user?.verificationStatus === 'UNVERIFIED' && '○ Unverified'}
                </span>
              </div>

              {user?.verificationStatus === 'VERIFIED' && (
                <p className="text-sm text-gray-600 mt-1">
                  You have verified seller status and increased buyer trust
                </p>
              )}

              {verificationRequest && (
                <p className="text-sm text-gray-600 mt-1">
                  Request submitted: {formatDate(verificationRequest.createdAt)}
                </p>
              )}
            </div>
            
            {canRequestVerification && (
              <Button
                variant="secondary"
                onClick={() => setShowVerificationModal(true)}
              >
                Request Verification
              </Button>
            )}
          </div>
        </div>

        {/* Withdrawal History */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Withdrawal History</h2>
          </div>
          
          <div className="p-6">
            {withdrawals.length === 0 ? (
              <div className="text-center py-8">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No withdrawals yet</h3>
                <p className="text-gray-600">Your withdrawal history will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {withdrawals.map(withdrawal => (
                  <div key={withdrawal.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div>
                      <p className="font-medium text-gray-900">{formatTON(withdrawal.amount)}</p>
                      <p className="text-sm text-gray-600">{formatDate(withdrawal.createdAt)}</p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      withdrawal.status === 'APPROVED' 
                        ? 'bg-green-100 text-green-800'
                        : withdrawal.status === 'REJECTED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {withdrawal.status.toLowerCase()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Withdraw Modal */}
      <Modal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        title="Request Withdrawal"
      >
        <div className="space-y-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              Available Balance: {formatTON(user?.balance || 0)}
            </p>
          </div>

          <Input
            label="Withdrawal Amount (TON)"
            type="number"
            step="0.01"
            min="0.01"
            max={user?.balance || 0}
            placeholder="0.00"
            value={withdrawAmount}
            onChange={(e) => {
              setWithdrawAmount(e.target.value);
              setError('');
            }}
            error={error}
            fullWidth
          />

          <div className="bg-yellow-50 p-3 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Important Notes:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Withdrawals require admin approval</li>
                  <li>• Processing may take 1-3 business days</li>
                  <li>• Funds will be sent to your connected wallet</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              variant="secondary"
              onClick={() => setShowWithdrawModal(false)}
              fullWidth
            >
              Cancel
            </Button>
            <Button onClick={handleWithdrawRequest} fullWidth>
              Request Withdrawal
            </Button>
          </div>
        </div>
      </Modal>

      {/* Verification Modal */}
      <Modal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        title="Request Seller Verification"
      >
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Benefits of Verification:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• ✓ Verified badge on your products</li>
              <li>• ✓ Increased buyer trust and confidence</li>
              <li>• ✓ Higher visibility in search results</li>
              <li>• ✓ Priority customer support</li>
            </ul>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-medium text-yellow-900 mb-2">Requirements:</h3>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• At least 3 active products</li>
              <li>• Minimum 5 successful sales</li>
              <li>• Average rating of 4.0 or higher</li>
              <li>• No recent violations or reports</li>
            </ul>
          </div>

          <p className="text-sm text-gray-600">
            Your verification request will be reviewed by our admin team within 24-48 hours.
          </p>

          <div className="flex space-x-3">
            <Button
              variant="secondary"
              onClick={() => setShowVerificationModal(false)}
              fullWidth
            >
              Cancel
            </Button>
            <Button onClick={handleVerificationRequest} fullWidth>
              Submit Request
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};