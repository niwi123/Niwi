import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import SimpleChatBot from '../components/SimpleChatBot';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminLeads = () => {
  const { user, logout } = useAuth();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedLead, setSelectedLead] = useState(null); // For view details modal
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const handleSignOut = () => {
    logout();
    window.location.href = '/';
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      // This is a placeholder - we'll implement the actual API later
      // For now, show mock leads data
      const mockLeads = [
        {
          id: '1',
          title: 'Kitchen Renovation Project',
          customer_name: 'Sarah Wilson',
          customer_email: 'sarah@example.com',
          customer_phone: '+1-416-555-1234',
          service_category: 'contractor',
          description: 'Complete kitchen renovation including cabinets, countertops, and flooring',
          location: 'Toronto, ON',
          budget_range: '$15,000 - $25,000',
          timeline: 'Within 2 months',
          status: 'pending',
          urgency: 'medium',
          created_at: '2025-01-08',
          assigned_to: null
        },
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
          assigned_to: 'Elite Electrical Services'
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
          assigned_to: 'Quick Fix Plumbing'
        }
      ];
      setLeads(mockLeads);
    } catch (err) {
      setError('Failed to fetch leads');
      console.error('Error fetching leads:', err);
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

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending Assignment' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const filteredLeads = selectedStatus === 'all' 
    ? leads 
    : leads.filter(lead => lead.status === selectedStatus);

  const handleAssignLead = (leadId, professionalName) => {
    // Placeholder for lead assignment logic
    setLeads(prev => prev.map(lead => 
      lead.id === leadId ? { ...lead, assigned_to: professionalName, status: 'active' } : lead
    ));
  };

  const handleViewDetails = (lead) => {
    setSelectedLead(lead);
    setShowDetailsModal(true);
  };

  const handleCancelLead = (leadId) => {
    if (window.confirm('Are you sure you want to cancel this lead? This action cannot be undone.')) {
      setLeads(prev => prev.map(lead => 
        lead.id === leadId ? { ...lead, status: 'cancelled', assigned_to: null } : lead
      ));
    }
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedLead(null);
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
                <Link to="/admin/leads" className="text-emerald-600 font-medium">Leads</Link>
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
          <h1 className="text-3xl font-bold text-gray-900">Lead Management</h1>
          <div className="text-sm text-gray-600">
            Total Leads: {leads.length}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Status Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:border-emerald-500"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label} {option.value === 'all' ? '' : `(${leads.filter(l => l.status === option.value).length})`}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading leads...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredLeads.map((lead) => (
              <div key={lead.id} className="bg-white shadow rounded-lg overflow-hidden">
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

                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Timeline: {lead.timeline}</span>
                        <span>•</span>
                        <span>Created: {new Date(lead.created_at).toLocaleDateString()}</span>
                        {lead.assigned_to && (
                          <>
                            <span>•</span>
                            <span>Assigned to: <span className="font-medium text-gray-900">{lead.assigned_to}</span></span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button className="text-blue-600 hover:text-blue-900 text-sm font-medium px-3 py-1 bg-blue-50 hover:bg-blue-100 rounded transition">
                      View Details
                    </button>
                    
                    {lead.status === 'pending' && (
                      <div className="relative inline-block">
                        <select
                          onChange={(e) => e.target.value && handleAssignLead(lead.id, e.target.value)}
                          className="text-emerald-600 bg-emerald-50 hover:bg-emerald-100 text-sm font-medium px-3 py-1 rounded border border-emerald-200 focus:outline-none focus:border-emerald-400 transition"
                          defaultValue=""
                        >
                          <option value="" disabled>Assign to Professional</option>
                          <option value="Johnson Construction">Johnson Construction</option>
                          <option value="Elite Electrical Services">Elite Electrical Services</option>
                          <option value="Quick Fix Plumbing">Quick Fix Plumbing</option>
                        </select>
                      </div>
                    )}
                    
                    <button className="text-orange-600 hover:text-orange-900 text-sm font-medium px-3 py-1 bg-orange-50 hover:bg-orange-100 rounded transition">
                      Edit
                    </button>
                    
                    <button className="text-red-600 hover:text-red-900 text-sm font-medium px-3 py-1 bg-red-50 hover:bg-red-100 rounded transition">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredLeads.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">
            No leads found for the selected status.
          </div>
        )}

        {/* Lead Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          {statusOptions.slice(1).map(status => {
            const count = leads.filter(l => l.status === status.value).length;
            return (
              <div key={status.value} className="bg-white rounded-lg shadow p-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                  <p className="text-sm text-gray-600">{status.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* AI Chat Button */}
      <SimpleChatBot />
    </div>
  );
};

export default AdminLeads;