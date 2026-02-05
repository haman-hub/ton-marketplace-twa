import { useState } from 'react';
import { Wallet, Loader2 } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { walletService } from '../../services/walletService';
import { useAuth } from '../../hooks/useAuth';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (address: string) => void;
}

export const WalletModal = ({ isOpen, onClose, onConnect }: WalletModalProps) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualAddress, setManualAddress] = useState('');
  const [error, setError] = useState('');
  const { updateUser } = useAuth();

  const handleConnect = async (walletType: 'tonkeeper' | 'mytonwallet' | 'manual') => {
    setIsConnecting(true);
    setError('');

    try {
      const connection = await walletService.connectWallet(
        walletType,
        walletType === 'manual' ? manualAddress : undefined
      );
      
      updateUser({ walletAddress: connection.address });
      onConnect(connection.address);
      onClose();
    } catch (err) {
      setError('Failed to connect wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleManualConnect = () => {
    if (!manualAddress.trim()) {
      setError('Please enter a wallet address');
      return;
    }
    handleConnect('manual');
  };

  const handleClose = () => {
    if (!isConnecting) {
      setShowManualInput(false);
      setManualAddress('');
      setError('');
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Connect Wallet">
      <div className="space-y-4">
        {!showManualInput ? (
          <>
            <p className="text-gray-600 mb-6">
              Connect your TON wallet to buy and sell digital goods
            </p>

            <div className="space-y-3">
              <Button
                fullWidth
                onClick={() => handleConnect('tonkeeper')}
                disabled={isConnecting}
                isLoading={isConnecting}
                className="flex items-center justify-center space-x-2"
              >
                <Wallet className="w-5 h-5" />
                <span>Connect Tonkeeper</span>
              </Button>

              <Button
                fullWidth
                variant="secondary"
                onClick={() => handleConnect('mytonwallet')}
                disabled={isConnecting}
                isLoading={isConnecting}
                className="flex items-center justify-center space-x-2"
              >
                <Wallet className="w-5 h-5" />
                <span>Connect MyTonWallet</span>
              </Button>

              <Button
                fullWidth
                variant="ghost"
                onClick={() => setShowManualInput(true)}
                disabled={isConnecting}
              >
                Manual Input
              </Button>
            </div>

            {isConnecting && (
              <div className="flex items-center justify-center space-x-2 text-ton-blue">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Connecting...</span>
              </div>
            )}
          </>
        ) : (
          <>
            <p className="text-gray-600 mb-4">
              Enter your TON wallet address manually
            </p>

            <Input
              label="Wallet Address"
              placeholder="UQ..."
              value={manualAddress}
              onChange={(e) => setManualAddress(e.target.value)}
              fullWidth
              error={error}
            />

            <div className="flex space-x-3">
              <Button
                variant="secondary"
                onClick={() => setShowManualInput(false)}
                disabled={isConnecting}
              >
                Back
              </Button>
              <Button
                onClick={handleManualConnect}
                disabled={isConnecting}
                isLoading={isConnecting}
                fullWidth
              >
                Connect
              </Button>
            </div>
          </>
        )}

        {error && !showManualInput && (
          <p className="text-red-600 text-sm text-center">{error}</p>
        )}
      </div>
    </Modal>
  );
};