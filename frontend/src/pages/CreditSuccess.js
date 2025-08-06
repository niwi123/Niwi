import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CreditSuccess = () => {
  const { user, getAuthHeaders } = useAuth();
  const location = useLocation();
  const [paymentStatus, setPaymentStatus] = useState('checking');
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const sessionId = urlParams.get('session_id');

    if (sessionId) {
      checkPaymentStatus(sessionId);
    } else {
      setError('No payment session found');
      setPaymentStatus('error');
    }
  }, [location]);

  const checkPaymentStatus = async (sessionId, attempts = 0) => {
    const maxAttempts = 5;
    const pollInterval = 2000; // 2 seconds

    if (attempts >= maxAttempts) {
      setError('Payment verification timeout. Please check your account or contact support.');
      setPaymentStatus('error');
      return;
    }

    try {
      const headers = getAuthHeaders();
      const response = await axios.get(`${API}/credits/payment-status/${sessionId}`, { headers });

      if (response.data.payment_status === 'paid') {
        setPaymentData(response.data);
        setPaymentStatus('success');
        return;
      } else if (response.data.payment_status === 'expired') {
        setError('Payment session expired. Please try again.');
        setPaymentStatus('error');
        return;
      }

      // If payment is still pending, continue polling
      setPaymentStatus('processing');
      setTimeout(() => checkPaymentStatus(sessionId, attempts + 1), pollInterval);

    } catch (err) {
      console.error('Error checking payment status:', err);
      setError('Error verifying payment. Please contact support if the issue persists.');
      setPaymentStatus('error');
    }
  };

  const renderContent = () => {
    switch (paymentStatus) {
      case 'checking':
        return (
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Verifying Payment</h2>
            <p className="text-gray-600">Please wait while we confirm your payment...</p>
          </div>
        );

      case 'processing':
        return (
          <div className="text-center">
            <div className="animate-pulse">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">⏳</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Processing Payment</h2>
            <p className="text-gray-600">Your payment is being processed. This may take a moment...</p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">✅</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">
              Your credit purchase has been completed successfully.
            </p>
            
            {paymentData && (
              <div className="bg-emerald-50 rounded-lg p-6 mb-6 max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-emerald-900 mb-4">Purchase Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-emerald-700">Credits Added:</span>
                    <span className="font-semibold text-emerald-900">+{paymentData.credits_added}</span>
                  </div>
                  <div className="flex justify-between border-t border-emerald-200 pt-2">
                    <span className="text-emerald-700">New Balance:</span>
                    <span className="font-bold text-emerald-900">{paymentData.new_balance} credits</span>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Your credits are now available in your account. You can use them to view full lead details and contact information.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/professional/leads"
                  className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition font-medium"
                >
                  Browse Available Leads
                </Link>
                <Link
                  to="/professional/dashboard"
                  className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition font-medium"
                >
                  Go to Dashboard
                </Link>
              </div>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="text-center">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">❌</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Issue</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/credits"
                className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition font-medium"
              >
                Try Again
              </Link>
              <Link
                to="/professional/dashboard"
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link to="/" className="text-2xl font-bold text-emerald-600">
              Niwi
            </Link>
            {user && (
              <div className="text-gray-700">
                Welcome, {user.first_name}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default CreditSuccess;