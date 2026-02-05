import { 
  User, Product, Purchase, Report, Withdrawal, VerificationRequest,
  UserRole, ProductCategory, ReportReason, WithdrawalStatus 
} from '../types';

class MockDatabase {
  private readonly STORAGE_KEYS = {
    USERS: 'ton_marketplace_users',
    PRODUCTS: 'ton_marketplace_products',
    PURCHASES: 'ton_marketplace_purchases',
    REPORTS: 'ton_marketplace_reports',
    WITHDRAWALS: 'ton_marketplace_withdrawals',
    VERIFICATION_REQUESTS: 'ton_marketplace_verifications',
    CURRENT_USER: 'ton_marketplace_current_user',
    ADMIN_BALANCE: 'ton_marketplace_admin_balance'
  };

  // Initialize with demo data
  initializeDemoData(): void {
    const demoUsers: User[] = [
      {
        id: 'buyer1',
        username: 'demo_buyer',
        role: 'BUYER',
        balance: 50,
        walletAddress: 'UQBvI0aFLnw2QbZgjMPCLRdtRHxhUyinQudg6sdiohIwg5jL',
        verificationStatus: 'UNVERIFIED',
        isBanned: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'seller1',
        username: 'demo_seller',
        role: 'SELLER',
        balance: 25.5,
        walletAddress: 'UQDrjaLahLkMB-hMCmkzOyBuHJ139ZUYmPHu6RRBKlIqx_Ah',
        verificationStatus: 'VERIFIED',
        isBanned: false,
        createdAt: new Date().toISOString()
      }
    ];

    const demoProducts: Product[] = [
      {
        id: 'prod1',
        sellerId: 'seller1',
        title: 'Complete React Guide',
        description: 'Comprehensive React tutorial with TypeScript',
        price: 15,
        category: 'TUTORIALS',
        hiddenLink: 'https://example.com/react-guide-secret',
        averageRating: 4.8,
        totalRatings: 12,
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'prod2',
        sellerId: 'seller1',
        title: 'UI Design Assets Pack',
        description: 'Premium UI components and icons',
        price: 25,
        category: 'ASSETS',
        hiddenLink: 'https://example.com/ui-assets-secret',
        averageRating: 4.5,
        totalRatings: 8,
        isActive: true,
        createdAt: new Date().toISOString()
      }
    ];

    this.setData(this.STORAGE_KEYS.USERS, demoUsers);
    this.setData(this.STORAGE_KEYS.PRODUCTS, demoProducts);
    this.setData(this.STORAGE_KEYS.PURCHASES, []);
    this.setData(this.STORAGE_KEYS.REPORTS, []);
    this.setData(this.STORAGE_KEYS.WITHDRAWALS, []);
    this.setData(this.STORAGE_KEYS.VERIFICATION_REQUESTS, []);
    this.setData(this.STORAGE_KEYS.ADMIN_BALANCE, 0);
  }

  // Initialize empty data
  initializeEmptyData(): void {
    this.setData(this.STORAGE_KEYS.USERS, []);
    this.setData(this.STORAGE_KEYS.PRODUCTS, []);
    this.setData(this.STORAGE_KEYS.PURCHASES, []);
    this.setData(this.STORAGE_KEYS.REPORTS, []);
    this.setData(this.STORAGE_KEYS.WITHDRAWALS, []);
    this.setData(this.STORAGE_KEYS.VERIFICATION_REQUESTS, []);
    this.setData(this.STORAGE_KEYS.ADMIN_BALANCE, 0);
  }

  private getData<T>(key: string): T[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  private setData<T>(key: string, data: T[] | T): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // User operations
  createUser(userData: Omit<User, 'id' | 'createdAt'>): User {
    const users = this.getData<User>(this.STORAGE_KEYS.USERS);
    const newUser: User = {
      ...userData,
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    this.setData(this.STORAGE_KEYS.USERS, users);
    return newUser;
  }

  getUsers(): User[] {
    return this.getData<User>(this.STORAGE_KEYS.USERS);
  }

  getUserById(id: string): User | null {
    const users = this.getUsers();
    return users.find(user => user.id === id) || null;
  }

  updateUser(id: string, updates: Partial<User>): User | null {
    const users = this.getUsers();
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) return null;
    
    users[userIndex] = { ...users[userIndex], ...updates };
    this.setData(this.STORAGE_KEYS.USERS, users);
    return users[userIndex];
  }

  // Product operations
  createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'averageRating' | 'totalRatings'>): Product {
    const products = this.getData<Product>(this.STORAGE_KEYS.PRODUCTS);
    const newProduct: Product = {
      ...productData,
      id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      averageRating: 0,
      totalRatings: 0,
      createdAt: new Date().toISOString()
    };
    products.push(newProduct);
    this.setData(this.STORAGE_KEYS.PRODUCTS, products);
    return newProduct;
  }

  getProducts(): Product[] {
    return this.getData<Product>(this.STORAGE_KEYS.PRODUCTS);
  }

  getProductById(id: string): Product | null {
    const products = this.getProducts();
    return products.find(product => product.id === id) || null;
  }

  getProductsBySeller(sellerId: string): Product[] {
    const products = this.getProducts();
    return products.filter(product => product.sellerId === sellerId);
  }

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const products = this.getProducts();
    const productIndex = products.findIndex(product => product.id === id);
    if (productIndex === -1) return null;
    
    products[productIndex] = { ...products[productIndex], ...updates };
    this.setData(this.STORAGE_KEYS.PRODUCTS, products);
    return products[productIndex];
  }

  // Purchase operations
  createPurchase(buyerId: string, productId: string): Purchase | null {
    const product = this.getProductById(productId);
    const buyer = this.getUserById(buyerId);
    
    if (!product || !buyer) return null;
    
    const totalCost = product.price + 0.1; // 0.1 TON fee
    if (buyer.balance < totalCost) return null;

    const purchases = this.getData<Purchase>(this.STORAGE_KEYS.PURCHASES);
    const newPurchase: Purchase = {
      id: `purchase_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      buyerId,
      productId,
      sellerId: product.sellerId,
      pricePaid: product.price,
      createdAt: new Date().toISOString()
    };

    // Update balances
    this.updateUser(buyerId, { balance: buyer.balance - totalCost });
    
    const seller = this.getUserById(product.sellerId);
    if (seller) {
      this.updateUser(product.sellerId, { balance: seller.balance + product.price });
    }

    // Update admin balance
    const adminBalance = this.getData<number>(this.STORAGE_KEYS.ADMIN_BALANCE) || 0;
    this.setData(this.STORAGE_KEYS.ADMIN_BALANCE, adminBalance + 0.1);

    purchases.push(newPurchase);
    this.setData(this.STORAGE_KEYS.PURCHASES, purchases);
    return newPurchase;
  }

  getPurchasesByBuyer(buyerId: string): Purchase[] {
    const purchases = this.getData<Purchase>(this.STORAGE_KEYS.PURCHASES);
    return purchases.filter(purchase => purchase.buyerId === buyerId);
  }

  getPurchasesBySeller(sellerId: string): Purchase[] {
    const purchases = this.getData<Purchase>(this.STORAGE_KEYS.PURCHASES);
    return purchases.filter(purchase => purchase.sellerId === sellerId);
  }

  updatePurchaseRating(purchaseId: string, rating: number): Purchase | null {
    const purchases = this.getData<Purchase>(this.STORAGE_KEYS.PURCHASES);
    const purchaseIndex = purchases.findIndex(p => p.id === purchaseId);
    if (purchaseIndex === -1) return null;

    purchases[purchaseIndex].userRating = rating;
    this.setData(this.STORAGE_KEYS.PURCHASES, purchases);

    // Update product average rating
    const purchase = purchases[purchaseIndex];
    const allPurchases = this.getData<Purchase>(this.STORAGE_KEYS.PURCHASES);
    const productPurchases = allPurchases.filter(p => p.productId === purchase.productId && p.userRating);
    
    if (productPurchases.length > 0) {
      const avgRating = productPurchases.reduce((sum, p) => sum + (p.userRating || 0), 0) / productPurchases.length;
      this.updateProduct(purchase.productId, { 
        averageRating: Math.round(avgRating * 10) / 10,
        totalRatings: productPurchases.length 
      });
    }

    return purchases[purchaseIndex];
  }

  // Report operations
  createReport(reportData: Omit<Report, 'id' | 'createdAt'>): Report {
    const reports = this.getData<Report>(this.STORAGE_KEYS.REPORTS);
    const newReport: Report = {
      ...reportData,
      id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };
    reports.push(newReport);
    this.setData(this.STORAGE_KEYS.REPORTS, reports);
    return newReport;
  }

  getReports(): Report[] {
    return this.getData<Report>(this.STORAGE_KEYS.REPORTS);
  }

  updateReport(id: string, updates: Partial<Report>): Report | null {
    const reports = this.getReports();
    const reportIndex = reports.findIndex(report => report.id === id);
    if (reportIndex === -1) return null;
    
    reports[reportIndex] = { ...reports[reportIndex], ...updates };
    this.setData(this.STORAGE_KEYS.REPORTS, reports);
    return reports[reportIndex];
  }

  // Withdrawal operations
  createWithdrawal(sellerId: string, amount: number): Withdrawal | null {
    const seller = this.getUserById(sellerId);
    if (!seller || seller.balance < amount) return null;

    const withdrawals = this.getData<Withdrawal>(this.STORAGE_KEYS.WITHDRAWALS);
    const newWithdrawal: Withdrawal = {
      id: `withdrawal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sellerId,
      amount,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };

    // Deduct from seller balance
    this.updateUser(sellerId, { balance: seller.balance - amount });

    withdrawals.push(newWithdrawal);
    this.setData(this.STORAGE_KEYS.WITHDRAWALS, withdrawals);
    return newWithdrawal;
  }

  getWithdrawals(): Withdrawal[] {
    return this.getData<Withdrawal>(this.STORAGE_KEYS.WITHDRAWALS);
  }

  updateWithdrawal(id: string, status: WithdrawalStatus): Withdrawal | null {
    const withdrawals = this.getWithdrawals();
    const withdrawalIndex = withdrawals.findIndex(w => w.id === id);
    if (withdrawalIndex === -1) return null;

    const withdrawal = withdrawals[withdrawalIndex];
    
    // If rejected, return money to seller
    if (status === 'REJECTED') {
      const seller = this.getUserById(withdrawal.sellerId);
      if (seller) {
        this.updateUser(withdrawal.sellerId, { balance: seller.balance + withdrawal.amount });
      }
    }

    withdrawals[withdrawalIndex].status = status;
    this.setData(this.STORAGE_KEYS.WITHDRAWALS, withdrawals);
    return withdrawals[withdrawalIndex];
  }

  // Verification operations
  createVerificationRequest(sellerId: string): VerificationRequest {
    const requests = this.getData<VerificationRequest>(this.STORAGE_KEYS.VERIFICATION_REQUESTS);
    const newRequest: VerificationRequest = {
      id: `verification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sellerId,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };
    requests.push(newRequest);
    this.setData(this.STORAGE_KEYS.VERIFICATION_REQUESTS, requests);
    return newRequest;
  }

  getVerificationRequests(): VerificationRequest[] {
    return this.getData<VerificationRequest>(this.STORAGE_KEYS.VERIFICATION_REQUESTS);
  }

  updateVerificationRequest(id: string, status: 'APPROVED' | 'REJECTED'): VerificationRequest | null {
    const requests = this.getVerificationRequests();
    const requestIndex = requests.findIndex(r => r.id === id);
    if (requestIndex === -1) return null;

    requests[requestIndex].status = status;
    this.setData(this.STORAGE_KEYS.VERIFICATION_REQUESTS, requests);

    // Update user verification status
    if (status === 'APPROVED') {
      this.updateUser(requests[requestIndex].sellerId, { verificationStatus: 'VERIFIED' });
    }

    return requests[requestIndex];
  }

  // Session management
  setCurrentUser(user: User): void {
    this.setData(this.STORAGE_KEYS.CURRENT_USER, user);
  }

  getCurrentUser(): User | null {
    const data = localStorage.getItem(this.STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  }

  clearCurrentUser(): void {
    localStorage.removeItem(this.STORAGE_KEYS.CURRENT_USER);
  }

  // Admin operations
  getAdminBalance(): number {
    return this.getData<number>(this.STORAGE_KEYS.ADMIN_BALANCE) || 0;
  }

  banSeller(sellerId: string): void {
    // Ban the seller
    this.updateUser(sellerId, { isBanned: true, balance: 0 });
    
    // Deactivate all their products
    const products = this.getProductsBySeller(sellerId);
    products.forEach(product => {
      this.updateProduct(product.id, { isActive: false });
    });
  }

  // Statistics
  getTotalVolume(): number {
    const purchases = this.getData<Purchase>(this.STORAGE_KEYS.PURCHASES);
    return purchases.reduce((total, purchase) => total + purchase.pricePaid, 0);
  }

  getTotalUsers(): number {
    return this.getUsers().length;
  }
}

export const mockDatabase = new MockDatabase();