import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminCustomers = () => {
  const { user, logout } = useAuth();
  const [customerInquiries, setCustomerInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageText, setMessageText] = useState('');

  const handleSignOut = () => {
    logout();
    window.location.href = '/';
  };

  useEffect(() => {
    fetchCustomerInquiries();
  }, []);

  const fetchCustomerInquiries = async () => {
    try {
      setLoading(true);
      // Mock data - customer inquiries and requests
      const mockInquiries = [
        {
          id: '1',
          customer_name: 'Sarah Wilson',
          customer_email: 'sarah@example.com',
          customer_phone: '+1-416-555-1234',
          service_category: 'contractor',
          title: 'Kitchen Renovation Project',
          description: 'I need a complete kitchen renovation including new cabinets, countertops, and flooring. Looking for a reliable contractor with experience in modern kitchen designs.',
          location: 'Toronto, ON',
          budget_range: '$15,000 - $25,000',
          timeline: 'Within 2 months',
          urgency: 'medium',
          status: 'new',
          created_at: '2025-01-08',
          last_contact: null
        },
        {
          id: '2',
          customer_name: 'Mike Johnson',
          customer_email: 'mike@example.com',
          customer_phone: '+1-604-555-5678',
          service_category: 'electrician',
          title: 'Electrical Panel Upgrade',
          description: 'Our home electrical panel needs upgrading from 100A to 200A service. We are experiencing power issues and want to ensure everything is up to code.',
          location: 'Vancouver, BC',
          budget_range: '$2,000 - $3,500',
          timeline: 'ASAP',
          urgency: 'high',
          status: 'contacted',
          created_at: '2025-01-07',
          last_contact: '2025-01-07'
        },
        {
          id: '3',
          customer_name: 'David Chen',
          customer_email: 'david@example.com',
          customer_phone: '+1-403-555-9876',
          service_category: 'plumber',
          title: 'Emergency Plumbing Repair',
          description: 'We have a leaking pipe behind our bathroom wall and there may be water damage. This is urgent and we need immediate professional help.',
          location: 'Calgary, AB',
          budget_range: '$500 - $1,200',
          timeline: 'Within 1 week',
          urgency: 'high',
          status: 'assigned',
          created_at: '2025-01-05',
          last_contact: '2025-01-05'
        },
        {
          id: '4',
          customer_name: 'Lisa Rodriguez',
          customer_email: 'lisa@example.com',
          customer_phone: '+1-514-555-4321',
          service_category: 'wedding_photography',
          title: 'Wedding Photography & Videography',
          description: 'Looking for a professional photographer and videographer for our wedding in June. We want both traditional and candid shots, plus a highlight reel video.',
          location: 'Montreal, QC',
          budget_range: '$3,000 - $5,000',
          timeline: 'Wedding date: June 15th, 2025',
          urgency: 'medium',
          status: 'new',
          created_at: '2025-01-06',
          last_contact: null
        }
      ];
      setCustomerInquiries(mockInquiries);
    } catch (err) {
      setError('Failed to fetch customer inquiries');
      console.error('Error fetching inquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'assigned': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
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

  const handleViewDetails = (inquiry) => {
    setSelectedInquiry(inquiry);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedInquiry(null);
  };

  const handleSendMessage = () => {
    setShowMessageModal(true);
    setShowDetailsModal(false);
  };

  const closeMessageModal = () => {
    setShowMessageModal(false);
    setMessageText('');
  };

  const handleSendCustomMessage = () => {
    console.log(`Sending message to ${selectedInquiry?.customer_name}: ${messageText}`);
    alert(`Message sent to ${selectedInquiry?.customer_name}!`);
    closeMessageModal();
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
                <Link to="/admin/leads" className="text-gray-500 hover:text-gray-700">Leads</Link>
                <span className="text-emerald-600 font-medium">Customers</span>
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
            <h1 className="text-3xl font-bold text-gray-900">Customer Inquiries</h1>
            <p className="text-gray-600 mt-2">All customer service requests and inquiries</p>
          </div>
          <div className="text-sm text-gray-600">
            Total Inquiries: {customerInquiries.length}
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
            <p className="text-gray-600">Loading customer inquiries...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {customerInquiries.map((inquiry) => (
              <div 
                key={inquiry.id} 
                className="bg-white shadow rounded-lg overflow-hidden border-l-4 border-blue-500"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {inquiry.title}
                        </h3>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(inquiry.status)}`}>
                          {inquiry.status.toUpperCase()}
                        </span>
                        <span className={`text-sm font-medium ${getUrgencyColor(inquiry.urgency)}`}>
                          {inquiry.urgency.toUpperCase()} PRIORITY
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Customer Information</p>
                          <p className="font-medium">{inquiry.customer_name}</p>
                          <p className="text-sm text-gray-500">{inquiry.customer_email}</p>
                          <p className="text-sm text-gray-500">{inquiry.customer_phone}</p>
                          <p className="text-sm text-gray-500">{inquiry.location}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Service Details</p>
                          <p className="font-medium capitalize">{inquiry.service_category.replace('_', ' ')}</p>
                          <p className="text-sm text-gray-500">Budget: {inquiry.budget_range}</p>
                          <p className="text-sm text-gray-500">Timeline: {inquiry.timeline}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-1">Customer Message</p>
                        <p className="text-gray-900">{inquiry.description}</p>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Submitted: {new Date(inquiry.created_at).toLocaleDateString()}</span>
                        {inquiry.last_contact && (
                          <>
                            <span>•</span>
                            <span>Last Contact: {new Date(inquiry.last_contact).toLocaleDateString()}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button 
                      onClick={() => handleViewDetails(inquiry)}
                      className="text-blue-600 hover:text-blue-900 text-sm font-medium px-3 py-1 bg-blue-50 hover:bg-blue-100 rounded transition"
                    >
                      View Full Details
                    </button>
                    
                    <a
                      href={`mailto:${inquiry.customer_email}`}
                      className="text-emerald-600 hover:text-emerald-900 text-sm font-medium px-3 py-1 bg-emerald-50 hover:bg-emerald-100 rounded transition"
                    >
                      Email Customer
                    </a>

                    <a
                      href={`tel:${inquiry.customer_phone}`}
                      className="text-purple-600 hover:text-purple-900 text-sm font-medium px-3 py-1 bg-purple-50 hover:bg-purple-100 rounded transition"
                    >
                      Call Customer
                    </a>

                    <Link 
                      to={`/admin/leads`}
                      className="text-orange-600 hover:text-orange-900 text-sm font-medium px-3 py-1 bg-orange-50 hover:bg-orange-100 rounded transition"
                    >
                      Convert to Lead
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {customerInquiries.length === 0 && !loading && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <div className="text-gray-600 mb-4">
              No customer inquiries found.
            </div>
          </div>
        )}

        {/* Inquiry Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {customerInquiries.filter(i => i.status === 'new').length}
              </p>
              <p className="text-sm text-gray-600">New Inquiries</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {customerInquiries.filter(i => i.status === 'contacted').length}
              </p>
              <p className="text-sm text-gray-600">Contacted</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {customerInquiries.filter(i => i.status === 'assigned').length}
              </p>
              <p className="text-sm text-gray-600">Assigned</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {customerInquiries.filter(i => i.urgency === 'high').length}
              </p>
              <p className="text-sm text-gray-600">High Priority</p>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Inquiry Details Modal */}
      {showDetailsModal && selectedInquiry && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={closeDetailsModal}></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Customer Inquiry Details</h3>
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
                        <p className="font-medium">{selectedInquiry.customer_name}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Email:</span>
                        <p className="font-medium">{selectedInquiry.customer_email}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Phone:</span>
                        <p className="font-medium">{selectedInquiry.customer_phone}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Location:</span>
                        <p className="font-medium">{selectedInquiry.location}</p>
                      </div>
                    </div>
                  </div>

                  {/* Service Information */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Service Request</h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-600">Service Category:</span>
                        <p className="font-medium capitalize">{selectedInquiry.service_category.replace('_', ' ')}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Budget Range:</span>
                        <p className="font-medium">{selectedInquiry.budget_range}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Timeline:</span>
                        <p className="font-medium">{selectedInquiry.timeline}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Priority:</span>
                        <p className={`font-medium ${getUrgencyColor(selectedInquiry.urgency)}`}>
                          {selectedInquiry.urgency.toUpperCase()}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Status:</span>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ml-2 ${getStatusColor(selectedInquiry.status)}`}>
                          {selectedInquiry.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Full Description */}
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Customer Message</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 leading-relaxed">{selectedInquiry.description}</p>
                  </div>
                </div>

                {/* Timestamps */}
                <div className="mt-6 pt-4 border-t">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Submitted: {new Date(selectedInquiry.created_at).toLocaleDateString()}</span>
                    <span>ID: {selectedInquiry.id}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={handleSendMessage}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Send Message
                </button>
                <button
                  onClick={closeDetailsModal}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Send Message Modal */}
      {showMessageModal && selectedInquiry && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={closeMessageModal}></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Send Message to Customer
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    To: <span className="font-medium">{selectedInquiry.customer_name}</span>
                    <br />
                    Email: <span className="font-medium">{selectedInquiry.customer_email}</span>
                  </p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Message
                  </label>
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    rows={6}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 resize-none"
                    placeholder="Type your message to the customer here..."
                  />
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={handleSendCustomMessage}
                  disabled={!messageText.trim()}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none disabled:bg-gray-300 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Send Message
                </button>
                <button
                  onClick={closeMessageModal}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;