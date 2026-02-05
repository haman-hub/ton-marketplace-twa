import { useState, useEffect } from 'react';
import { Users, DollarSign, AlertTriangle, CheckCircle, XCircle, Star, Ban } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Report, Withdrawal, VerificationRequest } from '../../types';
import { mockDatabase } from '../../services/mockDatabase';
import { formatTON, formatDate } from '../../utils/helpers';

export const AdminDashboardPage = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>([]);
  const [stats, setStats] = useState({
    totalVolume: 0,
    totalUsers: 0,
    adminBalance: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setReports(mockDatabase.getReports().filter(r => r.status === 'PENDING'));
    setWithdrawals(mockDatabase.getWithdrawals().filter(w => w.status === 'PENDING'));
    setVerificationRequests(mockDatabase.getVerificationRequests().filter(v => v.status === 'PENDING'));
    
    setStats({
      totalVolume: mockDatabase.getTotalVolume(),
      totalUsers: mockDatabase.getTotalUsers(),
      adminBalance: mockDatabase.getAdminBalance()
    });
  };

  const handleReportAction = (reportId: string, action: 'REJECT' | 'CONFIRM') => {
    const report = reports.find(r => r.id === reportId);
    if (!report) return;

    if (action === 'CONFIRM') {
      // Ban the seller and deactivate products
      const product = mockDatabase.getProductById(report.productId);
      if (product) {
        mockDatabase.banSeller(product.sellerId);
      }
    }

    mockDatabase.updateReport(reportId, { status: 'RESOLVED' });
    loadData();
  };

  const handleWithdrawalAction = (withdrawalId: string, action: 'APPROVE' | 'REJECT') => {
    mockDatabase.updateWithdrawal(withdrawalId, action === 'APPROVE' ? 'APPROVED' : 'REJECTED');
    loadData();
  };

  const handleVerificationAction = (requestId: string, action: 'APPROVE' | 'REJECT') => {
    mockDatabase.updateVerificationRequest(requestId, action === 'APPROVE' ? 'APPROVED' : 'REJECTED');
    loadData();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-600">Manage marketplace operations and moderation</p>
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
                <p className="text-sm font-medium text-gray-600">Total Volume</p>
                <p className="text-2xl font-bold text-gray-900">{formatTON(stats.totalVolume)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Platform Fees</p>
                <p className="text-2xl font-bold text-gray-900">{formatTON(stats.adminBalance)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reports Section */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">
                Pending Reports ({reports.length})
              </h2>
            </div>
          </div>
          
          <div className="p-6">
            {reports.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No pending reports</p>
            ) : (
              <div className="space-y-4">
                {reports.map(report => {
                  const product = mockDatabase.getProductById(report.productId);
                  const reporter = mockDatabase.getUserById(report.reporterId);
                  
                  return (
                    <div key={report.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                              {report.reason}
                            </span>
                            <span className="text-sm text-gray-500">
                              by {reporter?.username}
                            </span>
                          </div>
                          
                          <h4 className="font-medium text-gray-900 mb-1">
                            Product: {product?.title}
                          </h4>
                          <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                          <p className="text-xs text-gray-500">{formatDate(report.createdAt)}</p>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleReportAction(report.id, 'REJECT')}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleReportAction(report.id, 'CONFIRM')}
                          >
                            <Ban className="w-4 h-4 mr-1" />
                            Ban Seller
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Verification Requests */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <Star className="w-5 h-5 text-yellow-500 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">
                Verification Requests ({verificationRequests.length})
              </h2>
            </div>
          </div>
          
          <div className="p-6">
            {verificationRequests.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No pending verification requests</p>
            ) : (
              <div className="space-y-4">
                {verificationRequests.map(request => {
                  const seller = mockDatabase.getUserById(request.sellerId);
                  const sellerProducts = mockDatabase.getProductsBySeller(request.sellerId);
                  const sellerSales = mockDatabase.getPurchasesBySeller(request.sellerId);
                  
                  return (
                    <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-2">
                            {seller?.username}
                          </h4>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>Products: {sellerProducts.length}</p>
                            <p>Sales: {sellerSales.length}</p>
                            <p>Revenue: {formatTON(sellerSales.reduce((sum, s) => sum + s.pricePaid, 0))}</p>
                            <p>Requested: {formatDate(request.createdAt)}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleVerificationAction(request.id, 'REJECT')}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleVerificationAction(request.id, 'APPROVE')}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Withdrawal Requests */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <DollarSign className="w-5 h-5 text-green-500 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">
                Withdrawal Requests ({withdrawals.length})
              </h2>
            </div>
          </div>
          
          <div className="p-6">
            {withdrawals.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No pending withdrawals</p>
            ) : (
              <div className="space-y-4">
                {withdrawals.map(withdrawal => {
                  const seller = mockDatabase.getUserById(withdrawal.sellerId);
                  
                  return (
                    <div key={withdrawal.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">
                            {seller?.username}
                          </h4>
                          <p className="text-lg font-bold text-green-600 mb-1">
                            {formatTON(withdrawal.amount)}
                          </p>
                          <p className="text-sm text-gray-500">
                            Requested: {formatDate(withdrawal.createdAt)}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleWithdrawalAction(withdrawal.id, 'REJECT')}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleWithdrawalAction(withdrawal.id, 'APPROVE')}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};