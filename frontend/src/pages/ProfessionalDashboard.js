import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ProfessionalDashboard = () => {
  const { user, logout, getAuthHeaders } = useAuth();
  const [creditBalance, setCreditBalance] = useState(null);
  const [leadPreviews, setLeadPreviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.user_type === 'professional') {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const headers = getAuthHeaders();
      
      // Fetch credit balance and available lead previews
      const [creditRes, leadsRes] = await Promise.all([
        axios.get(`${API}/credits/balance`, { headers }),
        axios.get(`${API}/professionals/leads/preview?limit=5`, { headers })
      ]);

      setCreditBalance(creditRes.data);
      setLeadPreviews(leadsRes.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewLead = async (leadId) => {
    try {
      const headers = getAuthHeaders();
      const response = await axios.post(`${API}/professionals/leads/${leadId}/view`, {}, { headers });
      
      if (response.data.credits_used > 0) {
        // Refresh dashboard data to update credit balance
        fetchDashboardData();
        alert(`Lead details unlocked! You used ${response.data.credits_used} credit(s).`);
      } else {
        alert('Lead details accessed (already purchased)');
      }
    } catch (err) {
      if (err.response?.status === 402) {
        alert('Insufficient credits! Please purchase more credits to view leads.');
      } else {
        alert('Error viewing lead details');
      }
      console.error('Error viewing lead:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
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
              <Link to="/" className="text-2xl font-bold text-emerald-600">
                Niwi
              </Link>
              <nav className="ml-10 flex space-x-8">
                <a href="#" className="text-emerald-600 font-medium">Dashboard</a>
                <a href="#" className="text-gray-500 hover:text-gray-700">Leads</a>
                <Link to="/credits" className="text-gray-500 hover:text-gray-700">Credits</Link>
                <a href="#" className="text-gray-500 hover:text-gray-700">Profile</a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.first_name}</span>
              <button
                onClick={logout}
                className="text-gray-500 hover:text-gray-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats with Credit Balance */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-md bg-emerald-500 text-white">
                <span className="text-xl">💳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Available Credits</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {creditBalance ? creditBalance.balance : 'Loading...'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-md bg-blue-500 text-white">
                <span className="text-xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Credits Used</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {creditBalance ? creditBalance.total_used : 'Loading...'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-md bg-green-500 text-white">
                <span className="text-xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Available Leads</p>
                <p className="text-2xl font-semibold text-gray-900">{leadPreviews.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-md bg-orange-500 text-white">
                <span className="text-xl">💹</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-semibold text-gray-900">85%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Available Lead Previews */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Available Leads (Preview)</h2>
            <Link
              to="/credits"
              className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm hover:bg-emerald-700 transition"
            >
              Buy Credits
            </Link>
          </div>
          <div className="divide-y divide-gray-200">
            {leadPreviews.length > 0 ? (
              leadPreviews.map((lead) => (
                <div key={lead.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{lead.title}</h3>
                      <p className="text-gray-600 mt-1">{lead.description}</p>
                      <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                        <span>📍 {lead.city}, {lead.province}</span>
                        <span>💰 {lead.budget_range}</span>
                        <span>⏰ {lead.timeline}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        lead.urgency === 'urgent' 
                          ? 'bg-red-100 text-red-800' 
                          : lead.urgency === 'high'
                          ? 'bg-orange-100 text-orange-800'
                          : lead.urgency === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {lead.urgency} Priority
                      </span>
                      <span className="text-xs text-gray-500">
                        {lead.credits_required} credit to view
                      </span>
                      <button 
                        onClick={() => handleViewLead(lead.id)}
                        className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm hover:bg-emerald-700 transition disabled:opacity-50"
                        disabled={creditBalance && creditBalance.balance < lead.credits_required}
                      >
                        {creditBalance && creditBalance.balance < lead.credits_required 
                          ? 'Insufficient Credits' 
                          : 'View Full Details'
                        }
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                No leads available at the moment. Check back later!
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Update Profile</h3>
            <p className="text-gray-600 mb-4">Keep your business information and services up to date</p>
            <button className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 transition">
              Edit Profile
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Browse Leads</h3>
            <p className="text-gray-600 mb-4">See all available leads in your service areas</p>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition">
              View All Leads
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Get Support</h3>
            <p className="text-gray-600 mb-4">Need help or have questions? Contact our support team</p>
            <button className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalDashboard;