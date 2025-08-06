import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ProfessionalProfile = () => {
  const { user, logout, getAuthHeaders } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const [isVisible, setIsVisible] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [editForm, setEditForm] = useState({
    business_name: '',
    description: '',
    business_phone: '',
    website: '',
    service_categories: []
  });

  const serviceOptions = [
    'contractors', 'real_estate_agents', 'mortgage_brokers', 
    'electricians', 'plumbers', 'hvac_specialists'
  ];

  useEffect(() => {
    setIsVisible(true);
    if (user && user.user_type === 'professional') {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const headers = getAuthHeaders();
      const response = await axios.get(`${API}/professionals/profile`, { headers });
      setProfile(response.data);
      setEditForm({
        business_name: response.data.business_name || '',
        description: response.data.description || '',
        business_phone: response.data.business_phone || '',
        website: response.data.website || '',
        service_categories: response.data.service_categories || []
      });
      setProfilePicture(response.data.profile_picture || null);
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicture(e.target.result);
        updateProfilePicture(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateProfilePicture = async (imageData) => {
    try {
      const headers = getAuthHeaders();
      await axios.put(`${API}/professionals/profile`, 
        { profile_picture: imageData }, 
        { headers }
      );
      fetchProfile(); // Refresh profile data
    } catch (err) {
      console.error('Error updating profile picture:', err);
      alert('Failed to update profile picture');
    }
  };

  const handleServiceToggle = (service) => {
    setEditForm(prev => ({
      ...prev,
      service_categories: prev.service_categories.includes(service)
        ? prev.service_categories.filter(s => s !== service)
        : [...prev.service_categories, service]
    }));
  };

  const handleSaveProfile = async () => {
    try {
      const headers = getAuthHeaders();
      const updateData = {
        ...editForm,
        profile_picture: profilePicture
      };
      await axios.put(`${API}/professionals/profile`, updateData, { headers });
      setEditing(false);
      fetchProfile(); // Refresh profile data
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile');
    }
  };

  const mockReviews = [
    {
      id: 1,
      rating: 5,
      title: "Excellent service!",
      comment: "Professional work, great communication, and delivered on time. Highly recommended!",
      customer: "Sarah M.",
      date: "2 weeks ago"
    }
  ];

  const mockQAs = [
    {
      question: "What's your typical response time?",
      answer: "I respond to all inquiries within 2-4 hours during business days."
    },
    {
      question: "Do you provide warranties on your work?",
      answer: "Yes, I provide a 1-year warranty on all completed projects."
    },
    {
      question: "What areas do you serve?",
      answer: "I serve Toronto and the Greater Toronto Area, including Mississauga, Brampton, and Markham."
    }
  ];

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
              <Link to="/" className="text-2xl font-bold text-emerald-600">Niwi</Link>
              <nav className="ml-10 flex space-x-8">
                <Link to="/professional/dashboard" className="text-gray-500 hover:text-gray-700">Dashboard</Link>
                <span className="text-emerald-600 font-medium">Profile</span>
                <Link to="/credits" className="text-gray-500 hover:text-gray-700">Credits</Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.first_name}</span>
              <button onClick={logout} className="text-gray-500 hover:text-gray-700">Sign Out</button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-8" style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }}>
              {/* Profile Avatar */}
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-white">
                    {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {profile?.business_name || `${user?.first_name} ${user?.last_name}`}
                </h1>
                <p className="text-gray-600">{profile?.city}, {profile?.province}</p>
              </div>

              {/* Service Categories */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {profile?.service_categories?.map((category, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium"
                    >
                      {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact Buttons */}
              <div className="space-y-3 mb-6">
                <button className="w-full bg-emerald-600 text-white py-3 px-2 sm:px-4 rounded-lg font-medium hover:bg-emerald-700 transition-all duration-300 transform hover:scale-105 active:scale-95 text-sm sm:text-base">
                  <span className="hidden sm:inline">Request Quote</span>
                  <span className="sm:hidden">Quote</span>
                </button>
                <button className="w-full bg-gray-100 text-gray-700 py-3 px-2 sm:px-4 rounded-lg font-medium hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 active:scale-95 text-sm sm:text-base">
                  Contact
                </button>
              </div>

              {/* Contact Info */}
              <div className="border-t pt-6 space-y-3">
                <div className="flex items-center text-gray-600">
                  <span className="w-5 h-5 mr-3">📧</span>
                  <span className="text-sm">{user?.email}</span>
                </div>
                {profile?.business_phone && (
                  <div className="flex items-center text-gray-600">
                    <span className="w-5 h-5 mr-3">📞</span>
                    <span className="text-sm">{profile.business_phone}</span>
                  </div>
                )}
                {profile?.website && (
                  <div className="flex items-center text-gray-600">
                    <span className="w-5 h-5 mr-3">🌐</span>
                    <a 
                      href={profile.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm hover:text-emerald-600 transition-colors"
                    >
                      {profile.website}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Profile Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg" style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              transitionDelay: '200ms'
            }}>
              {/* Tab Navigation */}
              <div className="border-b">
                <nav className="flex space-x-8 px-8 pt-8">
                  {[
                    { key: 'about', label: 'About' },
                    { key: 'reviews', label: 'Reviews' },
                    { key: 'qa', label: 'Q&As' },
                    { key: 'services', label: 'Services' }
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`pb-4 px-2 border-b-2 font-medium text-sm transition-all duration-300 ${
                        activeTab === tab.key
                          ? 'border-emerald-500 text-emerald-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-8">
                {activeTab === 'about' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
                      <p className="text-gray-600 leading-relaxed">
                        {profile?.description || 'Professional service provider dedicated to delivering quality work and excellent customer service. Contact me for your project needs.'}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-emerald-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <span className="w-5 h-5 mr-2">⭐</span>
                          <span className="font-semibold text-emerald-900">Elite Pro</span>
                        </div>
                        <p className="text-sm text-emerald-700">Verified professional</p>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <span className="w-5 h-5 mr-2">📅</span>
                          <span className="font-semibold text-blue-900">{profile?.years_experience || 5}+ years</span>
                        </div>
                        <p className="text-sm text-blue-700">In business</p>
                      </div>

                      <div className="bg-orange-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <span className="w-5 h-5 mr-2">⚡</span>
                          <span className="font-semibold text-orange-900">2 hours</span>
                        </div>
                        <p className="text-sm text-orange-700">Avg response time</p>
                      </div>

                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <span className="w-5 h-5 mr-2">🌐</span>
                          <span className="font-semibold text-purple-900">Remote Available</span>
                        </div>
                        <p className="text-sm text-purple-700">Services available remotely</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-900">Reviews</h3>
                      <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-emerald-700 transition-all duration-300 transform hover:scale-105 active:scale-95">
                        Leave a Review
                      </button>
                    </div>

                    {mockReviews.length > 0 ? (
                      <div className="space-y-4">
                        {mockReviews.map((review) => (
                          <div key={review.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow duration-300">
                            <div className="flex items-center mb-2">
                              <div className="flex text-yellow-400">
                                {[...Array(review.rating)].map((_, i) => (
                                  <span key={i}>⭐</span>
                                ))}
                              </div>
                              <span className="ml-2 text-sm text-gray-500">{review.date}</span>
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-1">{review.title}</h4>
                            <p className="text-gray-600 mb-2">{review.comment}</p>
                            <p className="text-sm text-gray-500">- {review.customer}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>Be the first to leave a review for {profile?.business_name}.</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'qa' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900">Q&As</h3>
                    <div className="space-y-4">
                      {mockQAs.map((qa, index) => (
                        <div key={index} className="border-b pb-4">
                          <h4 className="font-semibold text-gray-900 mb-2">{qa.question}</h4>
                          <p className="text-gray-600">{qa.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'services' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900">Services</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {profile?.service_categories?.map((category, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                          <h4 className="font-semibold text-gray-900 capitalize">
                            {category.replace('_', ' ')}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Professional {category.replace('_', ' ')} services
                          </p>
                        </div>
                      ))}
                    </div>

                    {profile?.hourly_rate_min && (
                      <div className="bg-emerald-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-emerald-900 mb-2">Pricing</h4>
                        <p className="text-emerald-700">
                          ${profile.hourly_rate_min} - ${profile.hourly_rate_max} per hour
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Edit Profile Button */}
            <div className="mt-6 text-center">
              <button
                onClick={() => setEditing(true)}
                className="bg-gray-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalProfile;