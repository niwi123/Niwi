import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Credits = () => {
  const { user, getAuthHeaders } = useAuth();
  const [creditBalance, setCreditBalance] = useState(null);
  const [creditPackages, setCreditPackages] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && user.user_type === 'professional') {
      fetchCreditData();
    }
  }, [user]);

  const fetchCreditData = async () => {
    try {
      setLoading(true);
      const headers = getAuthHeaders();

      // Fetch credit balance, packages, and transactions
      const [balanceRes, packagesRes, transactionsRes] = await Promise.all([
        axios.get(`${API}/credits/balance`, { headers }),
        axios.get(`${API}/credits/packages`),
        axios.get(`${API}/credits/transactions`, { headers })
      ]);

      setCreditBalance(balanceRes.data);
      setCreditPackages(packagesRes.data.packages);
      setTransactions(transactionsRes.data.transactions);
    } catch (err) {
      setError('Failed to load credit information');
      console.error('Error fetching credit data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (packageType) => {
    try {
      // Map package types to Stripe payment links
      const stripeLinks = {
        'starter_10': 'https://buy.stripe.com/7sY7sEcN8ghrcDl5W3gUM07', // Tester Pack - $150
        'basic_25': 'https://buy.stripe.com/7sYfZacN82qBcDl707gUM02', // 777 Pack - $499
        'professional_50': 'https://buy.stripe.com/4gM7sEbJ48OZcDl2JRgUM06', // Elite Pack - $1500
        'premium_100': 'https://buy.stripe.com/9B6aEQ5kG7KVavd0BJgUM03', // Pro Pack - $2000
        'business_250': 'https://buy.stripe.com/cNi9AM28ughrcDl4RZgUM01', // Premium Deluxe - $6000
        'enterprise_500': 'https://buy.stripe.com/3cIcMYdRce9javdeszgUM04' // Enterprise Deluxe - $13250
      };

      const stripeUrl = stripeLinks[packageType];
      if (stripeUrl) {
        // Redirect directly to Stripe payment link
        window.location.href = stripeUrl;
      } else {
        setError('Package not available');
      }
    } catch (err) {
      setError('Failed to initiate purchase');
      console.error('Purchase error:', err);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading credit information...</p>
        </div>
      </div>
    );
  }

  if (user?.user_type !== 'professional') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Restricted</h2>
          <p className="text-gray-600 mb-8">Credits are only available for professional accounts.</p>
          <Link to="/" className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-emerald-600">Niwi</Link>
              <nav className="ml-10 flex space-x-8">
                <Link to="/professional/dashboard" className="text-gray-500 hover:text-gray-700">Dashboard</Link>
                <Link to="/professional/leads" className="text-gray-500 hover:text-gray-700">Leads</Link>
                <span className="text-emerald-600 font-medium">Credits</span>
              </nav>
            </div>
            <div className="text-gray-700">
              Welcome, {user?.first_name}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Credit Balance */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Credit Balance</h2>
          
          {creditBalance && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-emerald-50 rounded-xl">
                <div className="text-3xl font-bold text-emerald-600 mb-2">
                  {creditBalance.balance}
                </div>
                <div className="text-sm text-gray-600">Available Credits</div>
              </div>
              <div className="text-center p-6 bg-blue-50 rounded-xl">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {creditBalance.total_purchased}
                </div>
                <div className="text-sm text-gray-600">Total Purchased</div>
              </div>
              <div className="text-center p-6 bg-orange-50 rounded-xl">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {creditBalance.total_used}
                </div>
                <div className="text-sm text-gray-600">Total Used</div>
              </div>
            </div>
          )}

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">How Credits Work</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Use 1 credit to view full lead details and contact information</li>
              <li>• Preview lead summaries are always free</li>
              <li>• Credits never expire</li>
              <li>• Get the best value with larger packages</li>
            </ul>
          </div>
        </div>

        {/* Credit Packages */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Buy Credits</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {creditPackages.map((pkg, index) => (
              <div 
                key={pkg.package_type} 
                className={`rounded-xl p-6 border-2 transition-all duration-300 hover:shadow-lg ${
                  index === 3 ? 'border-emerald-500 bg-emerald-50 transform scale-105' : 'border-gray-200 hover:border-emerald-300'
                }`}
              >
                {index === 3 && (
                  <div className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                    MOST POPULAR
                  </div>
                )}
                
                <h3 className="text-lg font-bold text-gray-900 mb-2">{pkg.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{pkg.description}</p>
                
                <div className="mb-4">
                  <div className="text-3xl font-bold text-gray-900">
                    {pkg.credits}
                    <span className="text-lg text-gray-600 font-normal"> credits</span>
                  </div>
                  <div className="text-2xl font-semibold text-emerald-600">
                    ${pkg.price}
                  </div>
                  <div className="text-sm text-gray-500">
                    ${pkg.price_per_credit} per credit
                  </div>
                </div>

                <button
                  onClick={() => handlePurchase(pkg.package_type)}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition ${
                    index === 3
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Purchase Credits
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Transactions</h2>
          
          {transactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Credits
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.slice(0, 10).map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          transaction.transaction_type === 'purchase' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.transaction_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {transaction.description}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No transactions yet. Purchase your first credit package to get started!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Credits;