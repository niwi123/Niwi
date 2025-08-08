import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import SimpleChatBot from '../components/SimpleChatBot';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || window.location.origin;
const API = `${BACKEND_URL}/api`;

const AssignedLeads = () => {
  const { user, logout, getAuthHeaders } = useAuth();
  const [assignedLeads, setAssignedLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [selectedLeadForNote, setSelectedLeadForNote] = useState(null);
  const [noteText, setNoteText] = useState('');

  const handleSignOut = () => {
    logout();
    window.location.href = '/';
  };

  useEffect(() => {
    if (user && user.user_type === 'professional') {
      fetchAssignedLeads();
    }
  }, [user]);

  const fetchAssignedLeads = async () => {
    try {
      setLoading(true);
      // This is placeholder data - in real implementation, this would fetch leads assigned specifically to this professional
      const mockAssignedLeads = [
        {
          id: 'assigned1',
          title: 'Kitchen Renovation - Assigned by Admin',
          customer_name: 'Sarah Wilson',
          customer_email: 'sarah@example.com',
          customer_phone: '+1-416-555-1234',
          service_category: 'contractor',
          description: 'Complete kitchen renovation including cabinets, countertops, and flooring. This lead was specifically assigned to you by the admin team.',
          location: 'Toronto, ON',
          budget_range: '$15,000 - $25,000',
          timeline: 'Within 2 months',
          status: 'active',
          urgency: 'medium',
          assigned_date: '2025-01-08',
          assigned_by: 'Admin Team',
          notes: 'Customer specifically requested a contractor with experience in modern kitchen designs.',
          priority: 'high'
        },
        {
          id: 'assigned2',
          title: 'Bathroom Renovation - Premium Lead',
          customer_name: 'Mike Johnson',
          customer_email: 'mike@example.com',
          customer_phone: '+1-416-555-5678',
          service_category: 'contractor',
          description: 'Master bathroom complete renovation. Customer wants high-end finishes and modern design.',
          location: 'Mississauga, ON',
          budget_range: '$20,000 - $35,000',
          timeline: 'Within 3 months',
          status: 'pending_contact',
          urgency: 'medium',
          assigned_date: '2025-01-07',
          assigned_by: 'Admin Team',
          notes: 'Customer is ready to start immediately. High-value project.',
          priority: 'high'
        },
        {
          id: 'assigned3',
          title: 'Basement Finishing Project',
          customer_name: 'Lisa Chen',
          customer_email: 'lisa@example.com',
          customer_phone: '+1-416-555-9876',
          service_category: 'contractor',
          description: 'Finish basement to create family room and home office space.',
          location: 'Markham, ON',
          budget_range: '$25,000 - $40,000',
          timeline: 'Within 4 months',
          status: 'contacted',
          urgency: 'low',
          assigned_date: '2025-01-05',
          assigned_by: 'Admin Team',
          notes: 'Customer is flexible with timeline. Quality is priority.',
          priority: 'medium'
        }
      ];
      setAssignedLeads(mockAssignedLeads);
    } catch (err) {
      console.error('Error fetching assigned leads:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending_contact': return 'bg-yellow-100 text-yellow-800';
      case 'contacted': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending_contact', label: 'Pending Contact' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' }
  ];

  const filteredLeads = filter === 'all' 
    ? assignedLeads 
    : assignedLeads.filter(lead => lead.status === filter);

  const handleStatusUpdate = (leadId, newStatus) => {
    setAssignedLeads(prev => prev.map(lead => 
      lead.id === leadId ? { ...lead, status: newStatus } : lead
    ));
  };

  const handleAddNote = (lead) => {
    setSelectedLeadForNote(lead);
    setNoteText(lead.personalNotes || '');
    setNoteModalOpen(true);
  };

  const handleSaveNote = () => {
    if (selectedLeadForNote) {
      setAssignedLeads(prev => prev.map(lead => 
        lead.id === selectedLeadForNote.id 
          ? { ...lead, personalNotes: noteText, lastNoteUpdate: new Date().toISOString() }
          : lead
      ));
      setNoteModalOpen(false);
      setSelectedLeadForNote(null);
      setNoteText('');
    }
  };

  const closeNoteModal = () => {
    setNoteModalOpen(false);
    setSelectedLeadForNote(null);
    setNoteText('');
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
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link to="/professional/dashboard" className="text-2xl font-bold text-emerald-600">
                Niwi
              </Link>
              <nav className="ml-10 flex space-x-8">
                <Link to="/professional/dashboard" className="text-gray-500 hover:text-gray-700">Dashboard</Link>
                <Link to="/professional/profile" className="text-gray-500 hover:text-gray-700">Profile</Link>
                <Link to="/credits" className="text-gray-500 hover:text-gray-700">Buy Leads</Link>
                <Link to="/professional/leads" className="text-gray-500 hover:text-gray-700">All Leads</Link>
                <span className="text-emerald-600 font-medium">Assigned Leads</span>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.first_name}</span>
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
            <h1 className="text-3xl font-bold text-gray-900">Your Assigned Leads</h1>
            <p className="text-gray-600 mt-2">Premium leads specifically assigned to your business by our admin team</p>
          </div>
          <div className="text-sm text-gray-600">
            Total Assigned: {assignedLeads.length}
          </div>
        </div>

        {/* Status Filter */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter by Status</h3>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map(option => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === option.value
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label} ({option.value === 'all' ? assignedLeads.length : assignedLeads.filter(l => l.status === option.value).length})
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your assigned leads...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredLeads.map((lead) => (
              <div key={lead.id} className="bg-white shadow-lg rounded-lg overflow-hidden border-l-4 border-emerald-500">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-xl font-bold text-gray-900">
                          {lead.title}
                        </h3>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lead.status)}`}>
                          {lead.status.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className={`text-sm font-medium ${getPriorityColor(lead.priority)}`}>
                          {lead.priority.toUpperCase()} PRIORITY
                        </span>
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 text-xs rounded-full font-medium">
                          ASSIGNED LEAD
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Customer Information</h4>
                          <p className="font-medium text-gray-900">{lead.customer_name}</p>
                          <p className="text-gray-600">{lead.customer_email}</p>
                          <p className="text-gray-600">{lead.customer_phone}</p>
                          <p className="text-gray-600 mt-1">{lead.location}</p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Project Details</h4>
                          <p className="text-gray-600"><span className="font-medium">Budget:</span> {lead.budget_range}</p>
                          <p className="text-gray-600"><span className="font-medium">Timeline:</span> {lead.timeline}</p>
                          <p className="text-gray-600"><span className="font-medium">Assigned by:</span> {lead.assigned_by}</p>
                          <p className="text-gray-600"><span className="font-medium">Date Assigned:</span> {new Date(lead.assigned_date).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Project Description</h4>
                        <p className="text-gray-700">{lead.description}</p>
                      </div>

                      {lead.notes && (
                        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                          <h4 className="font-semibold text-blue-900 mb-2">Admin Notes</h4>
                          <p className="text-blue-800">{lead.notes}</p>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-3">
                        <a
                          href={`mailto:${lead.customer_email}`}
                          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition font-medium"
                        >
                          Contact Customer
                        </a>
                        
                        <a
                          href={`tel:${lead.customer_phone}`}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                        >
                          Call Now
                        </a>

                        <div className="relative">
                          <select
                            value={lead.status}
                            onChange={(e) => handleStatusUpdate(lead.id, e.target.value)}
                            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg border focus:outline-none focus:border-emerald-500 font-medium"
                          >
                            <option value="pending_contact">Pending Contact</option>
                            <option value="contacted">Contacted</option>
                            <option value="active">Active Project</option>
                            <option value="completed">Completed</option>
                          </select>
                        </div>

                        <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition font-medium">
                          Add Notes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredLeads.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <div className="text-gray-600 mb-4">
                  {filter === 'all' 
                    ? "No leads have been assigned to you yet." 
                    : `No ${filter.replace('_', ' ')} leads found.`
                  }
                </div>
                <p className="text-gray-500">
                  Our admin team will assign premium leads that match your expertise and location.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Stats Summary */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          {statusOptions.slice(1).map(status => {
            const count = assignedLeads.filter(l => l.status === status.value).length;
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

export default AssignedLeads;