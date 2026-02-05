import { useState } from 'react';
import { ShoppingCart, Copy, Check } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Product } from '../../types';
import { formatTON, copyToClipboard } from '../../utils/helpers';
import { mockDatabase } from '../../services/mockDatabase';
import { useAuth } from '../../hooks/useAuth';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export const PurchaseModal = ({ isOpen, onClose, product }: PurchaseModalProps) => {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseComplete, setPurchaseComplete] = useState(false);
  const [hiddenLink, setHiddenLink] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const { user, updateUser } = useAuth();

  if (!product || !user) return null;

  const totalCost = product.price + 0.1; // 0.1 TON fee
  const canPurchase = user.walletAddress && user.balance >= totalCost;

  const handlePurchase = async () => {
    if (!canPurchase) return;

    setIsPurchasing(true);
    
    // Simulate purchase processing
    setTimeout(() => {
      const purchase = mockDatabase.createPurchase(user.id, product.id);
      if (purchase) {
        setHiddenLink(product.hiddenLink);
        setPurchaseComplete(true);
        
        // Update user balance
        const updatedUser = mockDatabase.getUserById(user.id);
        if (updatedUser) {
          updateUser({ balance: updatedUser.balance });
        }
      }
      setIsPurchasing(false);
    }, 2000);
  };

  const handleCopyLink = async () => {
    const success = await copyToClipboard(hiddenLink);
    if (success) {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setPurchaseComplete(false);
    setHiddenLink('');
    setLinkCopied(false);
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      title={purchaseComplete ? "Purchase Complete!" : "Confirm Purchase"}
    >
      {!purchaseComplete ? (
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900">{product.title}</h4>
            <p className="text-sm text-gray-600 mt-1">{product.description}</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Price:</span>
              <span>{formatTON(product.price)}</span>
            </div>
            <div className="flex justify-between">
              <span>Platform Fee:</span>
              <span>{formatTON(0.1)}</span>
            </div>
            <div className="flex justify-between font-medium border-t pt-2">
              <span>Total:</span>
              <span>{formatTON(totalCost)}</span>
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              Your Balance: {formatTON(user.balance)}
            </p>
          </div>

          {!user.walletAddress && (
            <div className="bg-red-50 p-3 rounded-lg">
              <p className="text-sm text-red-800">
                Please connect your wallet to make a purchase
              </p>
            </div>
          )}

          {user.walletAddress && user.balance < totalCost && (
            <div className="bg-red-50 p-3 rounded-lg">
              <p className="text-sm text-red-800">
                Insufficient balance. You need {formatTON(totalCost - user.balance)} more TON.
              </p>
            </div>
          )}

          <div className="flex space-x-3">
            <Button variant="secondary" onClick={handleClose} fullWidth>
              Cancel
            </Button>
            <Button
              onClick={handlePurchase}
              disabled={!canPurchase}
              isLoading={isPurchasing}
              fullWidth
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {isPurchasing ? 'Processing...' : 'Purchase'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-8 h-8 text-green-600" />
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              Successfully purchased "{product.title}"
            </h4>
            <p className="text-sm text-gray-600">
              Here's your access link to the digital content:
            </p>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm font-mono break-all text-gray-800">
              {hiddenLink}
            </p>
          </div>

          <Button
            onClick={handleCopyLink}
            variant={linkCopied ? 'secondary' : 'primary'}
            fullWidth
          >
            {linkCopied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </>
            )}
          </Button>

          <Button variant="secondary" onClick={handleClose} fullWidth>
            Close
          </Button>
        </div>
      )}
    </Modal>
  );
};