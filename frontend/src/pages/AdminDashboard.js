import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  const handleSignOut = () => {
    logout();
    window.location.href = '/'; // Redirect to main menu page
  };

  // Mock data for demonstration
  const mockStats = {
    total_users: 2547,
    total_professionals: 1234,
    total_customers: 1313,
    total_leads: 456,
    active_leads: 89,
    conversion_rate: 78
  };

  const mockRecentActivity = [
    {
      id: '1',
      type: 'user_registered',
      description: 'New professional signed up: Mike Thompson (Contractor)',
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      type: 'request_created',
      description: 'New service request: Kitchen renovation in Toronto',
      timestamp: '4 hours ago'
    },
    {
      id: '3',
      type: 'lead_assigned',
      description: 'Lead assigned: Bathroom plumbing to Sarah Wilson',
      timestamp: '6 hours ago'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-emerald-600">
                Niwi Admin
              </Link>
              <nav className="ml-10 flex space-x-8">
                <a href="#" className="text-emerald-600 font-medium">Dashboard</a>
                <a href="#" className="text-gray-500 hover:text-gray-700">Users</a>
                <a href="#" className="text-gray-500 hover:text-gray-700">Professionals</a>
                <a href="#" className="text-gray-500 hover:text-gray-700">Leads</a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Admin: {user?.first_name}</span>
              <button
                onClick={handleSignOut}
                className="text-gray-500 hover:text-gray-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Platform Overview</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900">{mockStats.total_users.toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="ml-4">
              <p className="text-sm text-gray-600">Professionals</p>
              <p className="text-2xl font-semibold text-gray-900">{mockStats.total_professionals.toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="ml-4">
              <p className="text-sm text-gray-600">Customers</p>
              <p className="text-2xl font-semibold text-gray-900">{mockStats.total_customers.toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Leads</p>
              <p className="text-2xl font-semibold text-gray-900">{mockStats.total_leads}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="ml-4">
              <p className="text-sm text-gray-600">Active Leads</p>
              <p className="text-2xl font-semibold text-gray-900">{mockStats.active_leads}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="ml-4">
              <p className="text-sm text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-semibold text-gray-900">{mockStats.conversion_rate}%</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {mockRecentActivity.map((activity) => (
                <div key={activity.id} className="p-6">
                  <div className="flex items-start">
                    <div className={`w-3 h-3 mt-1 rounded-full ${
                      activity.type === 'user_registered' 
                        ? 'bg-blue-600'
                        : activity.type === 'request_created'
                        ? 'bg-emerald-600'
                        : 'bg-orange-600'
                    }`}></div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6 space-y-4">
              <button className="w-full bg-emerald-600 text-white py-3 px-4 rounded-md hover:bg-emerald-700 transition text-left">
                <div>
                  <div className="font-medium">Verify Professionals</div>
                  <div className="text-sm text-emerald-100">Review and approve new professional applications</div>
                </div>
              </button>

              <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition text-left">
                <div>
                  <div className="font-medium">Assign Leads</div>
                  <div className="text-sm text-blue-100">Manually assign customer requests to professionals</div>
                </div>
              </button>

              <button className="w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 transition text-left">
                <div>
                  <div className="font-medium">View Reports</div>
                  <div className="text-sm text-purple-100">Generate detailed platform analytics and reports</div>
                </div>
              </button>

              <button className="w-full bg-orange-600 text-white py-3 px-4 rounded-md hover:bg-orange-700 transition text-left">
                <div>
                  <div className="font-medium">Platform Settings</div>
                  <div className="text-sm text-orange-100">Configure platform settings and features</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;