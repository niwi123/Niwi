import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const API = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const AllLeads = () => {
  const { user, logout, getAuthHeaders } = useAuth();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creditBalance, setCreditBalance] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (user && user.user_type === 'professional') {
      fetchAllLeads();
      fetchCreditBalance();
    }
  }, [user]);

  const fetchAllLeads = async () => {
    try {
      const headers = getAuthHeaders();
      const response = await axios.get(`${API}/api/customers/requests`, { headers });
      setLeads(response.data || []);
    } catch (err) {
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCreditBalance = async () => {
    try {
      const headers = getAuthHeaders();
      const response = await axios.get(`${API}/api/credits/balance`, { headers });
      setCreditBalance(response.data);
    } catch (err) {
      console.error('Error fetching credit balance:', err);
    }
  };

  const handleUnlockLead = async (leadId) => {
    if (!creditBalance || creditBalance.balance < 1) {
      alert('Insufficient credits. Please purchase more credits to unlock leads.');
      return;
    }

    if (window.confirm('Unlock this lead for 1 credit?')) {
      try {
        const headers = getAuthHeaders();
        await axios.post(`${API}/api/credits/deduct`, {
          lead_id: leadId,
          credits: 1
        }, { headers });
        
        fetchAllLeads(); // Refresh leads
        fetchCreditBalance(); // Refresh credit balance
        alert('Lead unlocked successfully!');
      } catch (err) {
        console.error('Error unlocking lead:', err);
        alert('Failed to unlock lead. Please try again.');
      }
    }
  };

  const formatServiceType = (serviceType) => {
    return serviceType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const filteredLeads = leads.filter(lead => {
    if (filter === 'all') return true;
    return lead.service_type === filter;
  });

  const serviceTypes = [...new Set(leads.map(lead => lead.service_type))];

  const handleSignOut = () => {
    logout();
    window.location.href = '/'; // Redirect to main website page
  };

  if (!user || user.user_type !== 'professional') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">Only professional accounts can access this page.</p>
          <Link to="/login" className="text-emerald-600 hover:underline">Please log in</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link to="/professional/dashboard" className="text-xl sm:text-2xl font-bold text-emerald-600">Niwi</Link>
              <span className="text-gray-300">|</span>
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">All Leads</h1>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm">
              <Link to="/professional/dashboard" className="text-gray-600 hover:text-emerald-600 font-medium">
                Dashboard
              </Link>
              <Link to="/professional/profile" className="hidden sm:inline text-gray-600 hover:text-emerald-600 font-medium">
                Profile
              </Link>
              <button onClick={handleSignOut} className="text-gray-600 hover:text-red-600">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Available Leads Stats */}
        <div className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4 sm:p-6 text-center">
              <div className="text-xl sm:text-2xl font-bold text-blue-600">{leads.length}</div>
              <div className="text-xs sm:text-sm text-gray-600">Total Leads Available</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 sm:p-6 text-center">
              <div className="text-xl sm:text-2xl font-bold text-orange-600">{filteredLeads.length}</div>
              <div className="text-xs sm:text-sm text-gray-600">Filtered Results</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 sm:p-6 text-center">
              <Link to="/pricing" className="text-emerald-600 hover:text-emerald-700 font-medium text-sm sm:text-base">
                Buy More Leads →
              </Link>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Filter by Service Type</h3>
              <div className="flex space-x-2">
                <Link
                  to="/professional/assigned-leads"
                  className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition text-sm sm:text-base"
                >
                  Assigned Leads
                </Link>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {/* Enhanced All button with dropdown */}
              <div className="relative inline-block">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition border focus:outline-none focus:border-emerald-500 text-xs sm:text-sm ${
                    filter === 'all'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-gray-100 text-gray-700 border-gray-300'
                  }`}
                >
                  <option value="all">All ({leads.length})</option>
                  {serviceTypes.map(serviceType => (
                    <option key={serviceType} value={serviceType}>
                      {formatServiceType(serviceType)} ({leads.filter(l => l.service_type === serviceType).length})
                    </option>
                  ))}
                </select>
              </div>

              {/* Individual service type buttons for quick access */}
              {serviceTypes.slice(0, 4).map(serviceType => (
                <button
                  key={serviceType}
                  onClick={() => setFilter(serviceType)}
                  className={`px-2 sm:px-4 py-2 rounded-lg font-medium transition text-xs sm:text-sm ${
                    filter === serviceType
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="hidden sm:inline">{formatServiceType(serviceType)} ({leads.filter(l => l.service_type === serviceType).length})</span>
                  <span className="sm:hidden">{formatServiceType(serviceType)}</span>
                </button>
              ))}
              
              {serviceTypes.length > 4 && (
                <button className="px-2 sm:px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition text-xs sm:text-sm">
                  <span className="hidden sm:inline">More... ({serviceTypes.length - 4})</span>
                  <span className="sm:hidden">More...</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Leads List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="text-gray-600">Loading leads...</div>
            </div>
          ) : filteredLeads.length > 0 ? (
            filteredLeads.map((lead) => (
              <div key={lead._id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                        {formatServiceType(lead.service_type)}
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {lead.location?.city}, {lead.location?.province}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">{lead.title}</h3>
                    <p className="text-gray-600 mb-4">{lead.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      {lead.budget && (
                        <div className="flex items-center text-gray-600">
                          <span className="font-medium mr-2">Budget:</span>
                          ${lead.budget.min?.toLocaleString()} - ${lead.budget.max?.toLocaleString()}
                        </div>
                      )}
                      <div className="flex items-center text-gray-600">
                        <span className="font-medium mr-2">Timeline:</span>
                        {lead.urgency?.replace('_', ' ') || 'Not specified'}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <span className="font-medium mr-2">Contact:</span>
                        {lead.contact_preference || 'Email'}
                      </div>
                    </div>
                  </div>

                  <div className="ml-6 flex flex-col items-end">
                    <div className="text-right mb-4">
                      <div className="text-2xl font-bold text-emerald-600">1 Credit</div>
                      <div className="text-sm text-gray-500">to unlock</div>
                    </div>

                    <button
                      onClick={() => handleUnlockLead(lead._id)}
                      disabled={!creditBalance || creditBalance.balance < 1}
                      className={`px-6 py-3 rounded-lg font-medium transition ${
                        creditBalance && creditBalance.balance >= 1
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {creditBalance && creditBalance.balance >= 1 ? 'Unlock Lead' : 'Insufficient Credits'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-600 mb-4">
                {filter === 'all' ? 'No leads available at this time.' : `No ${formatServiceType(filter)} leads available.`}
              </div>
              <Link to="/credits" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Purchase Credits to Access More Leads →
              </Link>
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Need More Credits?</h2>
          <p className="text-emerald-100 mb-6">
            Get access to premium leads with our credit packages. Start growing your business today!
          </p>
          <Link
            to="/credits"
            className="bg-white text-emerald-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-block"
          >
            View Credit Packages
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AllLeads;