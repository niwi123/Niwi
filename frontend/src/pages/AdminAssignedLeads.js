import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminAssignedLeads = () => {
  const { user, logout } = useAuth();
  const [assignedLeads, setAssignedLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleSignOut = () => {
    logout();
    window.location.href = '/';
  };

  useEffect(() => {
    fetchAssignedLeads();
  }, []);

  const fetchAssignedLeads = async () => {
    try {
      setLoading(true);
      // Mock data - only showing assigned leads (highlighted in red)
      const mockAssignedLeads = [
        {
          id: '2',
          title: 'Electrical Panel Upgrade',
          customer_name: 'Mike Johnson',
          customer_email: 'mike@example.com',
          customer_phone: '+1-604-555-5678',
          service_category: 'electrician',
          description: 'Need to upgrade electrical panel from 100A to 200A service',
          location: 'Vancouver, BC',
          budget_range: '$2,000 - $3,500',
          timeline: 'ASAP',
          status: 'active',
          urgency: 'high',
          created_at: '2025-01-07',
          assigned_to: 'Elite Electrical Services',
          assigned_date: '2025-01-07'
        },
        {
          id: '3',
          title: 'Bathroom Plumbing Repair',
          customer_name: 'David Chen',
          customer_email: 'david@example.com',
          customer_phone: '+1-403-555-9876',
          service_category: 'plumber',
          description: 'Leaking pipe behind bathroom wall, possible water damage',
          location: 'Calgary, AB',
          budget_range: '$500 - $1,200',
          timeline: 'Within 1 week',
          status: 'completed',
          urgency: 'high',
          created_at: '2025-01-05',
          assigned_to: 'Quick Fix Plumbing',
          assigned_date: '2025-01-05'
        },
        {
          id: '4',
          title: 'Kitchen Renovation Project',
          customer_name: 'Sarah Wilson',
          customer_email: 'sarah@example.com',
          customer_phone: '+1-416-555-1234',
          service_category: 'contractor',
          description: 'Complete kitchen renovation including cabinets, countertops, and flooring',
          location: 'Toronto, ON',
          budget_range: '$15,000 - $25,000',
          timeline: 'Within 2 months',
          status: 'active',
          urgency: 'medium',
          created_at: '2025-01-08',
          assigned_to: 'Johnson Construction',
          assigned_date: '2025-01-08'
        }
      ];
      setAssignedLeads(mockAssignedLeads);
    } catch (err) {
      setError('Failed to fetch assigned leads');
      console.error('Error fetching assigned leads:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const handleReassignLead = (leadId) => {
    // Placeholder for reassignment logic
    console.log(`Reassigning lead ${leadId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link to="/admin" className="text-2xl font-bold text-emerald-600">
                Niwi Admin
              </Link>
              <nav className="ml-10 flex space-x-8">
                <Link to="/admin" className="text-gray-500 hover:text-gray-700">Dashboard</Link>
                <Link to="/admin/users" className="text-gray-500 hover:text-gray-700">Users</Link>
                <Link to="/admin/professionals" className="text-gray-500 hover:text-gray-700">Professionals</Link>
                <Link to="/admin/leads" className="text-gray-500 hover:text-gray-700">All Leads</Link>
                <span className="text-emerald-600 font-medium">Assigned Leads</span>
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Assigned Leads</h1>
            <p className="text-gray-600 mt-2">All leads currently assigned to professionals</p>
          </div>
          <div className="text-sm text-gray-600">
            Total Assigned: {assignedLeads.length}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading assigned leads...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {assignedLeads.map((lead) => (
              <div 
                key={lead.id} 
                className="bg-white shadow rounded-lg overflow-hidden border-l-4 border-red-500"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {lead.title}
                        </h3>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                        <span className={`text-sm font-medium ${getUrgencyColor(lead.urgency)}`}>
                          {lead.urgency.toUpperCase()} PRIORITY
                        </span>
                        <span className="bg-red-100 text-red-800 px-2 py-1 text-xs rounded-full font-medium">
                          ASSIGNED TO: {lead.assigned_to}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Customer</p>
                          <p className="font-medium">{lead.customer_name}</p>
                          <p className="text-sm text-gray-500">{lead.customer_email}</p>
                          <p className="text-sm text-gray-500">{lead.customer_phone}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Project Details</p>
                          <p className="font-medium capitalize">{lead.service_category}</p>
                          <p className="text-sm text-gray-500">{lead.location}</p>
                          <p className="text-sm text-gray-500">{lead.budget_range}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-1">Description</p>
                        <p className="text-gray-900">{lead.description}</p>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                        <span>Timeline: {lead.timeline}</span>
                        <span>•</span>
                        <span>Created: {new Date(lead.created_at).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>Assigned: {new Date(lead.assigned_date).toLocaleDateString()}</span>
                      </div>

                      <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                        <p className="text-red-800 font-medium">
                          🔴 This lead is currently assigned to: {lead.assigned_to}
                        </p>
                        <p className="text-red-600 text-sm mt-1">
                          Assigned on {new Date(lead.assigned_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Link 
                      to={`/admin/leads`}
                      className="text-blue-600 hover:text-blue-900 text-sm font-medium px-3 py-1 bg-blue-50 hover:bg-blue-100 rounded transition"
                    >
                      View Full Details
                    </Link>
                    
                    <button 
                      onClick={() => handleReassignLead(lead.id)}
                      className="text-orange-600 hover:text-orange-900 text-sm font-medium px-3 py-1 bg-orange-50 hover:bg-orange-100 rounded transition"
                    >
                      Re-assign Professional
                    </button>

                    <button className="text-emerald-600 hover:text-emerald-900 text-sm font-medium px-3 py-1 bg-emerald-50 hover:bg-emerald-100 rounded transition">
                      Contact Professional
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {assignedLeads.length === 0 && !loading && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <div className="text-gray-600 mb-4">
              No leads are currently assigned to professionals.
            </div>
            <Link 
              to="/admin/leads"
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              View all leads →
            </Link>
          </div>
        )}

        {/* Assignment Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{assignedLeads.length}</p>
              <p className="text-sm text-gray-600">Total Assigned</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {assignedLeads.filter(l => l.status === 'active').length}
              </p>
              <p className="text-sm text-gray-600">Active Projects</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {assignedLeads.filter(l => l.status === 'completed').length}
              </p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAssignedLeads;