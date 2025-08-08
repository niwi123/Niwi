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
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [leadForAssignment, setLeadForAssignment] = useState(null);

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

  const handleAssignFromModal = (lead) => {
    setLeadForAssignment(lead);
    setShowAssignModal(true);
    setShowDetailsModal(false);
  };

  const handleReassignLead = (lead) => {
    setLeadForAssignment(lead);
    setShowAssignModal(true);
  };

  const closeAssignModal = () => {
    setShowAssignModal(false);
    setLeadForAssignment(null);
  };

  const handleConfirmAssignment = (professionalName) => {
    if (leadForAssignment) {
      setLeads(prev => prev.map(lead => 
        lead.id === leadForAssignment.id ? { ...lead, assigned_to: professionalName, status: 'active' } : lead
      ));
      closeAssignModal();
    }
  };

  // Mock professionals data organized by service category
  const mockProfessionals = {
    contractor: [
      { id: 1, name: 'Johnson Construction', rating: 4.8, reviews: 45, experience: '15 years' },
      { id: 2, name: 'Prime Builders Inc', rating: 4.6, reviews: 32, experience: '12 years' },
      { id: 3, name: 'Elite Construction Co', rating: 4.9, reviews: 68, experience: '18 years' }
    ],
    electrician: [
      { id: 4, name: 'Elite Electrical Services', rating: 4.5, reviews: 23, experience: '12 years' },
      { id: 5, name: 'PowerLine Electric', rating: 4.7, reviews: 41, experience: '10 years' },
      { id: 6, name: 'Volt Masters', rating: 4.4, reviews: 19, experience: '8 years' }
    ],
    plumber: [
      { id: 7, name: 'Quick Fix Plumbing', rating: 4.9, reviews: 67, experience: '8 years' },
      { id: 8, name: 'AquaFlow Solutions', rating: 4.6, reviews: 34, experience: '15 years' },
      { id: 9, name: 'Drain Masters Pro', rating: 4.8, reviews: 52, experience: '11 years' }
    ]
  };

  const getAvailableProfessionals = (serviceCategory) => {
    return mockProfessionals[serviceCategory] || [];
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
              <div 
                key={lead.id} 
                className={`bg-white shadow rounded-lg overflow-hidden ${
                  lead.assigned_to ? 'border-l-4 border-red-500' : 'border-l-4 border-gray-200'
                }`}
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
                        {lead.assigned_to && (
                          <span className="bg-red-100 text-red-800 px-2 py-1 text-xs rounded-full font-medium">
                            ASSIGNED TO: {lead.assigned_to}
                          </span>
                        )}
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
                            <span>Assigned to: <span className="font-medium text-red-700">{lead.assigned_to}</span></span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button 
                      onClick={() => handleViewDetails(lead)}
                      className="text-blue-600 hover:text-blue-900 text-sm font-medium px-3 py-1 bg-blue-50 hover:bg-blue-100 rounded transition"
                    >
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
                    
                        {lead.assigned_to && (
                          <button 
                            onClick={() => handleReassignLead(lead)}
                            className="text-orange-600 hover:text-orange-900 text-sm font-medium px-3 py-1 bg-orange-50 hover:bg-orange-100 rounded transition"
                          >
                            Re-assign
                          </button>
                        )}
                    
                    <button 
                      onClick={() => handleCancelLead(lead.id)}
                      className="text-red-600 hover:text-red-900 text-sm font-medium px-3 py-1 bg-red-50 hover:bg-red-100 rounded transition"
                    >
                      Cancel Lead
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
      
      {/* View Details Modal */}
      {showDetailsModal && selectedLead && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={closeDetailsModal}></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Lead Details</h3>
                  <button
                    onClick={closeDetailsModal}
                    className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Customer Information */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-600">Name:</span>
                        <p className="font-medium">{selectedLead.customer_name}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Email:</span>
                        <p className="font-medium">{selectedLead.customer_email}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Phone:</span>
                        <p className="font-medium">{selectedLead.customer_phone}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Location:</span>
                        <p className="font-medium">{selectedLead.location}</p>
                      </div>
                    </div>
                  </div>

                  {/* Project Information */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Project Information</h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-600">Service Category:</span>
                        <p className="font-medium capitalize">{selectedLead.service_category}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Budget Range:</span>
                        <p className="font-medium">{selectedLead.budget_range}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Timeline:</span>
                        <p className="font-medium">{selectedLead.timeline}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Priority:</span>
                        <p className={`font-medium ${getUrgencyColor(selectedLead.urgency)}`}>
                          {selectedLead.urgency.toUpperCase()}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Status:</span>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ml-2 ${getStatusColor(selectedLead.status)}`}>
                          {selectedLead.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Full Description */}
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Project Description</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 leading-relaxed">{selectedLead.description}</p>
                  </div>
                </div>

                {/* Assignment Information */}
                {selectedLead.assigned_to && (
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Assignment Information</h4>
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <p className="text-red-800">
                        <span className="font-medium">Assigned to:</span> {selectedLead.assigned_to}
                      </p>
                      <p className="text-red-600 text-sm mt-1">
                        This lead has been assigned and is highlighted in red in the main view.
                      </p>
                    </div>
                  </div>
                )}

                {/* Timestamps */}
                <div className="mt-6 pt-4 border-t">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Created: {new Date(selectedLead.created_at).toLocaleDateString()}</span>
                    <span>ID: {selectedLead.id}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={closeDetailsModal}
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
                {!selectedLead.assigned_to && (
                  <button
                    onClick={() => handleAssignFromModal(selectedLead)}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-emerald-600 text-base font-medium text-white hover:bg-emerald-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Assign to Professional
                  </button>
                )}
                {selectedLead.assigned_to && (
                  <button
                    onClick={() => handleAssignFromModal(selectedLead)}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-600 text-base font-medium text-white hover:bg-orange-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Re-assign Lead
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Professional Assignment Modal */}
      {showAssignModal && leadForAssignment && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={closeAssignModal}></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {leadForAssignment.assigned_to ? 'Re-assign' : 'Assign'} Lead to Professional
                  </h3>
                  <button
                    onClick={closeAssignModal}
                    className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>

                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Lead Details</h4>
                  <p className="text-lg font-medium">{leadForAssignment.title}</p>
                  <p className="text-sm text-gray-600">Service: {leadForAssignment.service_category}</p>
                  <p className="text-sm text-gray-600">Budget: {leadForAssignment.budget_range}</p>
                  {leadForAssignment.assigned_to && (
                    <p className="text-sm text-red-600 font-medium mt-2">
                      Currently assigned to: {leadForAssignment.assigned_to}
                    </p>
                  )}
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Available {leadForAssignment.service_category.charAt(0).toUpperCase() + leadForAssignment.service_category.slice(1)}s
                  </h4>
                  
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {getAvailableProfessionals(leadForAssignment.service_category).map(professional => (
                      <div key={professional.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:border-emerald-300 transition">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h5 className="font-semibold text-gray-900">{professional.name}</h5>
                            <div className="flex items-center mt-1">
                              <span className="text-yellow-400">★</span>
                              <span className="text-sm text-gray-600 ml-1">
                                {professional.rating} ({professional.reviews} reviews)
                              </span>
                              <span className="text-gray-400 mx-2">•</span>
                              <span className="text-sm text-gray-600">{professional.experience}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleConfirmAssignment(professional.name)}
                            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition font-medium"
                          >
                            {leadForAssignment.assigned_to ? 'Re-assign' : 'Assign'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {getAvailableProfessionals(leadForAssignment.service_category).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No professionals available for this service category.
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={closeAssignModal}
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* AI Chat Button */}
      <SimpleChatBot />
    </div>
  );
};

export default AdminLeads;