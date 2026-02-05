export interface WalletConnection {
  address: string;
  isConnected: boolean;
}

class WalletService {
  private connection: WalletConnection | null = null;

  // Generate realistic TON address
  generateTonAddress(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    let address = 'UQ';
    for (let i = 0; i < 46; i++) {
      address += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return address;
  }

  // Simulate wallet connection
  async connectWallet(walletType: 'tonkeeper' | 'mytonwallet' | 'manual', manualAddress?: string): Promise<WalletConnection> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const address = manualAddress || this.generateTonAddress();
        this.connection = {
          address,
          isConnected: true
        };
        resolve(this.connection);
      }, 1500); // 1.5 second delay to simulate connection
    });
  }

  // Disconnect wallet
  disconnectWallet(): void {
    this.connection = null;
  }

  // Get current connection
  getConnection(): WalletConnection | null {
    return this.connection;
  }

  // Check if wallet is connected
  isConnected(): boolean {
    return this.connection?.isConnected || false;
  }

  // Get wallet address
  getAddress(): string | null {
    return this.connection?.address || null;
  }

  // Simulate adding testnet TON (faucet)
  async addTestnetTon(amount: number = 10): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 1000);
    });
  }
}

export const walletService = new WalletService();