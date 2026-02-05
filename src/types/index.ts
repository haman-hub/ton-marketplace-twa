export type UserRole = 'BUYER' | 'SELLER' | 'ADMIN';
export type VerificationStatus = 'UNVERIFIED' | 'PENDING' | 'VERIFIED';
export type ReportReason = 'SCAM' | 'SPAM' | 'INAPPROPRIATE' | 'FAKE' | 'OTHER';
export type ReportStatus = 'PENDING' | 'RESOLVED';
export type WithdrawalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type ProductCategory = 'EBOOKS' | 'TUTORIALS' | 'ASSETS' | 'SOFTWARE' | 'OTHER';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  balance: number;
  walletAddress?: string;
  verificationStatus: VerificationStatus;
  isBanned: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  price: number; // in TON
  category: ProductCategory;
  hiddenLink: string; // delivered after purchase
  averageRating: number;
  totalRatings: number;
  isActive: boolean;
  createdAt: string;
}

export interface Purchase {
  id: string;
  buyerId: string;
  productId: string;
  sellerId: string;
  pricePaid: number;
  userRating?: number;
  createdAt: string;
}

export interface Report {
  id: string;
  reporterId: string;
  productId: string;
  reason: ReportReason;
  description: string;
  status: ReportStatus;
  createdAt: string;
}

export interface Withdrawal {
  id: string;
  sellerId: string;
  amount: number;
  status: WithdrawalStatus;
  createdAt: string;
}

export interface VerificationRequest {
  id: string;
  sellerId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}