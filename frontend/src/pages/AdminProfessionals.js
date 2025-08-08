import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ChatButton from '../components/ChatButton';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminProfessionals = () => {
  const { user, logout } = useAuth();
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageText, setMessageText] = useState('');

  const handleSignOut = () => {
    logout();
    window.location.href = '/';
  };

  useEffect(() => {
    fetchProfessionals();
  }, []);

  const fetchProfessionals = async () => {
    try {
      setLoading(true);
      // This is a placeholder - we'll implement the actual API later
      // For now, show mock data organized by service categories
      const mockProfessionals = [
        {
          id: '1',
          user_id: 'user1',
          business_name: 'Johnson Construction',
          first_name: 'Mike',
          last_name: 'Johnson',
          email: 'mike@johnson.com',
          service_categories: ['contractor'],
          city: 'Toronto',
          province: 'ON',
          years_experience: 15,
          is_verified: true,
          rating: 4.8,
          review_count: 45,
          created_at: '2025-01-02'
        },
        {
          id: '2',
          user_id: 'user2',
          business_name: 'Elite Electrical Services',
          first_name: 'David',
          last_name: 'Smith',
          email: 'david@eliteelectrical.com',
          service_categories: ['electrician'],
          city: 'Vancouver',
          province: 'BC',
          years_experience: 12,
          is_verified: false,
          rating: 4.5,
          review_count: 23,
          created_at: '2025-01-05'
        },
        {
          id: '3',
          user_id: 'user3',
          business_name: 'Quick Fix Plumbing',
          first_name: 'Sarah',
          last_name: 'Wilson',
          email: 'sarah@quickfixplumbing.com',
          service_categories: ['plumber'],
          city: 'Calgary',
          province: 'AB',
          years_experience: 8,
          is_verified: true,
          rating: 4.9,
          review_count: 67,
          created_at: '2025-01-07'
        }
      ];
      setProfessionals(mockProfessionals);
    } catch (err) {
      setError('Failed to fetch professionals');
      console.error('Error fetching professionals:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      contractor: 'bg-amber-100 text-amber-800',
      electrician: 'bg-yellow-100 text-yellow-800',
      plumber: 'bg-blue-100 text-blue-800',
      real_estate: 'bg-emerald-100 text-emerald-800',
      hvac: 'bg-cyan-100 text-cyan-800',
      default: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.default;
  };

  const serviceCategories = [
    { value: 'all', label: 'All Categories' },
    { value: 'contractor', label: 'Contractors' },
    { value: 'electrician', label: 'Electricians' },
    { value: 'plumber', label: 'Plumbers' },
    { value: 'real_estate', label: 'Real Estate' },
    { value: 'hvac', label: 'HVAC' },
    { value: 'wedding_photography', label: 'Wedding & Event Photography/Videography' },
    { value: 'social_media_marketing', label: 'Social Media Marketing/SEO/SEM' },
    { value: 'private_investigator', label: 'Private Investigator' },
    { value: 'counselling', label: 'Counselling' },
  ];

  const filteredProfessionals = selectedCategory === 'all' 
    ? professionals 
    : professionals.filter(p => p.service_categories.includes(selectedCategory));

  const handleVerifyProfessional = (professionalId) => {
    // Placeholder for verification logic
    setProfessionals(prev => prev.map(p => 
      p.id === professionalId ? { ...p, is_verified: true } : p
    ));
  };

  const handleAssignLead = (professionalId, leadId) => {
    // Placeholder for lead assignment logic
    console.log(`Assigning lead ${leadId} to professional ${professionalId}`);
  };

  const handleSuspendUser = (professionalId, duration) => {
    // Placeholder for suspension logic
    console.log(`Suspending professional ${professionalId} for ${duration}`);
    // In real implementation, this would call an API
  };

  const suspensionOptions = [
    { value: '1h', label: '1 Hour' },
    { value: '5h', label: '5 Hours' },
    { value: '24h', label: '24 Hours' },
    { value: '1d', label: '1 Day' },
    { value: '3d', label: '3 Days' }
  ];

  const handleViewProfile = (professional) => {
    setSelectedProfessional(professional);
    setShowProfileModal(true);
  };

  const closeProfileModal = () => {
    setShowProfileModal(false);
    setSelectedProfessional(null);
  };

  const handleSendMessage = () => {
    setShowMessageModal(true);
    setShowProfileModal(false);
  };

  const closeMessageModal = () => {
    setShowMessageModal(false);
    setMessageText('');
  };

  const handleSendCustomMessage = () => {
    // In real implementation, this would send the message via email/SMS
    console.log(`Sending message to ${selectedProfessional?.business_name}: ${messageText}`);
    alert(`Message sent to ${selectedProfessional?.business_name}!`);
    closeMessageModal();
  };

  // Mock leads for assignment dropdown
  const availableLeads = [
    { id: 'lead1', title: 'Kitchen Renovation - Toronto', category: 'contractor' },
    { id: 'lead2', title: 'Electrical Work - Vancouver', category: 'electrician' },
    { id: 'lead3', title: 'Plumbing Repair - Calgary', category: 'plumber' }
  ];

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
                <Link to="/admin/professionals" className="text-emerald-600 font-medium">Professionals</Link>
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
          <h1 className="text-3xl font-bold text-gray-900">Professional Management</h1>
          <div className="text-sm text-gray-600">
            Total Professionals: {professionals.length}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Category Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Service Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:border-emerald-500"
          >
            {serviceCategories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label} {category.value === 'all' ? '' : `(${professionals.filter(p => p.service_categories.includes(category.value)).length})`}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading professionals...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProfessionals.map((professional) => (
              <div key={professional.id} className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {professional.business_name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {professional.first_name} {professional.last_name}
                      </p>
                      <p className="text-sm text-gray-500">{professional.email}</p>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        professional.is_verified 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {professional.is_verified ? 'Verified' : 'Pending Verification'}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {professional.service_categories.map((category, index) => (
                        <span
                          key={index}
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(category)}`}
                        >
                          {category.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-gray-500">Location:</span>
                      <p className="font-medium">{professional.city}, {professional.province}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Experience:</span>
                      <p className="font-medium">{professional.years_experience} years</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Rating:</span>
                      <p className="font-medium">
                        ⭐ {professional.rating} ({professional.review_count} reviews)
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Joined:</span>
                      <p className="font-medium">{new Date(professional.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => handleViewProfile(professional)}
                      className="text-emerald-600 hover:text-emerald-900 text-sm font-medium px-3 py-1 bg-emerald-50 hover:bg-emerald-100 rounded transition"
                    >
                      View Profile
                    </button>
                    
                    {!professional.is_verified ? (
                      <button 
                        onClick={() => handleVerifyProfessional(professional.id)}
                        className="text-white bg-green-600 hover:bg-green-700 text-sm font-medium px-3 py-1 rounded transition"
                      >
                        ✓ Verify
                      </button>
                    ) : (
                      <span className="text-green-600 text-sm font-medium px-3 py-1 bg-green-50 rounded">
                        ✓ Verified
                      </span>
                    )}

                    {/* Assign Lead Dropdown */}
                    <div className="relative inline-block">
                      <select
                        onChange={(e) => e.target.value && handleAssignLead(professional.id, e.target.value)}
                        className="text-blue-600 bg-blue-50 hover:bg-blue-100 text-sm font-medium px-3 py-1 rounded border border-blue-200 focus:outline-none focus:border-blue-400 transition"
                        defaultValue=""
                      >
                        <option value="" disabled>Assign Lead</option>
                        {availableLeads
                          .filter(lead => professional.service_categories.includes(lead.category))
                          .map(lead => (
                            <option key={lead.id} value={lead.id}>
                              {lead.title}
                            </option>
                          ))
                        }
                      </select>
                    </div>

                    {/* Suspend Dropdown */}
                    <div className="relative inline-block">
                      <select
                        onChange={(e) => e.target.value && handleSuspendUser(professional.id, e.target.value)}
                        className="text-red-600 bg-red-50 hover:bg-red-100 text-sm font-medium px-3 py-1 rounded border border-red-200 focus:outline-none focus:border-red-400 transition"
                        defaultValue=""
                      >
                        <option value="" disabled>Suspend</option>
                        {suspensionOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredProfessionals.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">
            No professionals found for the selected category.
          </div>
        )}

        {/* Professional Stats by Category */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Professionals by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {serviceCategories.slice(1).map(category => {
              const count = professionals.filter(p => p.service_categories.includes(category.value)).length;
              return (
                <div key={category.value} className="bg-white rounded-lg shadow p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{count}</p>
                    <p className="text-sm text-gray-600">{category.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Professional Profile Modal */}
      {showProfileModal && selectedProfessional && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={closeProfileModal}></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Professional Profile</h3>
                  <button
                    onClick={closeProfileModal}
                    className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Business Information */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-600">Business Name:</span>
                        <p className="font-medium text-lg">{selectedProfessional.business_name}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Owner:</span>
                        <p className="font-medium">{selectedProfessional.first_name} {selectedProfessional.last_name}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Email:</span>
                        <p className="font-medium">{selectedProfessional.email}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Location:</span>
                        <p className="font-medium">{selectedProfessional.city}, {selectedProfessional.province}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Years of Experience:</span>
                        <p className="font-medium">{selectedProfessional.years_experience} years</p>
                      </div>
                    </div>
                  </div>

                  {/* Service & Rating Information */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Service & Performance</h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-600">Service Categories:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedProfessional.service_categories.map((category, index) => (
                            <span
                              key={index}
                              className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800"
                            >
                              {category.replace('_', ' ')}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Rating:</span>
                        <div className="flex items-center">
                          <span className="text-yellow-400">★</span>
                          <p className="font-medium ml-1">{selectedProfessional.rating} ({selectedProfessional.review_count} reviews)</p>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Verification Status:</span>
                        <span className={`ml-2 inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          selectedProfessional.is_verified 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {selectedProfessional.is_verified ? 'Verified' : 'Pending Verification'}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Member Since:</span>
                        <p className="font-medium">{new Date(selectedProfessional.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Full Business Description */}
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">About the Business</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 leading-relaxed">
                      Professional {selectedProfessional.service_categories.join(', ')} service provider with {selectedProfessional.years_experience} years of experience. 
                      Based in {selectedProfessional.city}, {selectedProfessional.province}. 
                      Highly rated with {selectedProfessional.review_count} customer reviews and an average rating of {selectedProfessional.rating} stars.
                    </p>
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
                  onClick={closeProfileModal}
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
      {showMessageModal && selectedProfessional && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={closeMessageModal}></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Send Custom Message
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    To: <span className="font-medium">{selectedProfessional.business_name}</span>
                    <br />
                    Email: <span className="font-medium">{selectedProfessional.email}</span>
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
                    placeholder="Type your custom message here. You can request quotes, ask questions, or provide specific project details..."
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
      
      {/* AI Chat Button - REMOVED */}
    </div>
  );
};

export default AdminProfessionals;