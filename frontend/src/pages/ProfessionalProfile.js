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
                <div className="relative w-24 h-24 mx-auto mb-4">
                  {profilePicture ? (
                    <img
                      src={profilePicture}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-2 border-emerald-500"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-emerald-600 rounded-full flex items-center justify-center">
                      <span className="text-3xl font-bold text-white">
                        {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
                      </span>
                    </div>
                  )}
                  
                  {/* Edit Profile Picture Button */}
                  <label className="absolute bottom-0 right-0 bg-emerald-600 text-white rounded-full p-2 cursor-pointer hover:bg-emerald-700 transition-colors shadow-lg">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                      className="hidden"
                    />
                  </label>
                </div>
                
                <h1 className="text-2xl font-bold text-gray-900">
                  {profile?.business_name || `${user?.first_name} ${user?.last_name}`}
                </h1>
                <p className="text-gray-600">{profile?.city}, {profile?.province}</p>
                
                {/* Edit Profile Button */}
                <button
                  onClick={() => setEditing(!editing)}
                  className="mt-4 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  {editing ? 'Cancel' : 'Edit Profile'}
                </button>
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
                    {editing && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                        <h4 className="font-semibold text-yellow-900 mb-2">Editing Mode</h4>
                        <p className="text-sm text-yellow-700">Make your changes and click "Save Changes" when done.</p>
                      </div>
                    )}

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Business Name</h3>
                      {editing ? (
                        <input
                          type="text"
                          value={editForm.business_name}
                          onChange={(e) => setEditForm(prev => ({...prev, business_name: e.target.value}))}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="Enter business name"
                        />
                      ) : (
                        <p className="text-gray-600">{profile?.business_name || 'No business name set'}</p>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
                      {editing ? (
                        <textarea
                          value={editForm.description}
                          onChange={(e) => setEditForm(prev => ({...prev, description: e.target.value}))}
                          rows="5"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="Tell customers about your business, experience, and what makes you unique..."
                        />
                      ) : (
                        <p className="text-gray-600 leading-relaxed">
                          {profile?.description || 'Professional service provider dedicated to delivering quality work and excellent customer service. Contact me for your project needs.'}
                        </p>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
                      {editing ? (
                        <div className="space-y-4">
                          <input
                            type="tel"
                            value={editForm.business_phone}
                            onChange={(e) => setEditForm(prev => ({...prev, business_phone: e.target.value}))}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            placeholder="Business phone number"
                          />
                          <input
                            type="url"
                            value={editForm.website}
                            onChange={(e) => setEditForm(prev => ({...prev, website: e.target.value}))}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            placeholder="Website URL (https://...)"
                          />
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {profile?.business_phone && (
                            <p className="text-gray-600">📞 {profile.business_phone}</p>
                          )}
                          {profile?.website && (
                            <p className="text-gray-600">🌐 <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">{profile.website}</a></p>
                          )}
                          {!profile?.business_phone && !profile?.website && (
                            <p className="text-gray-500 italic">No contact information added yet.</p>
                          )}
                        </div>
                      )}
                    </div>

                    {editing && (
                      <div className="flex space-x-4">
                        <button
                          onClick={handleSaveProfile}
                          className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={() => setEditing(false)}
                          className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-400 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    )}

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
                      <h3 className="text-lg font-semibold text-gray-900">Customer Reviews</h3>
                      <button
                        onClick={() => {
                          const reviewForm = document.getElementById('review-form');
                          if (reviewForm.style.display === 'none') {
                            reviewForm.style.display = 'block';
                          } else {
                            reviewForm.style.display = 'none';
                          }
                        }}
                        className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-emerald-700 transition-all duration-300 transform hover:scale-105 active:scale-95"
                      >
                        Leave a Review
                      </button>
                    </div>

                    {/* Review Form */}
                    <div id="review-form" style={{display: 'none'}} className="bg-gray-50 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Share Your Experience</h4>
                      <form onSubmit={async (e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        const reviewData = {
                          rating: parseInt(formData.get('rating')),
                          title: formData.get('title'),
                          comment: formData.get('comment'),
                          professional_id: profile?._id
                        };
                        
                        try {
                          const headers = getAuthHeaders();
                          await axios.post(`${API}/api/reviews`, reviewData, { headers });
                          alert('Review submitted successfully!');
                          e.target.reset();
                          document.getElementById('review-form').style.display = 'none';
                          // Refresh reviews would go here
                        } catch (err) {
                          console.error('Error submitting review:', err);
                          alert('Failed to submit review. Please try again.');
                        }
                      }}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                            <select name="rating" required className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                              <option value="">Select rating</option>
                              <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                              <option value="4">⭐⭐⭐⭐ Very Good</option>
                              <option value="3">⭐⭐⭐ Good</option>
                              <option value="2">⭐⭐ Fair</option>
                              <option value="1">⭐ Poor</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Review Title</label>
                            <input
                              type="text"
                              name="title"
                              required
                              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                              placeholder="Summary of your experience"
                            />
                          </div>
                        </div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                          <textarea
                            name="comment"
                            rows="4"
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            placeholder="Tell others about your experience with this professional..."
                          />
                        </div>
                        <div className="flex space-x-4">
                          <button
                            type="submit"
                            className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                          >
                            Submit Review
                          </button>
                          <button
                            type="button"
                            onClick={() => document.getElementById('review-form').style.display = 'none'}
                            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-400 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* Existing Reviews */}
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
                      <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                        <div className="text-4xl mb-4">⭐</div>
                        <p className="text-lg font-medium text-gray-700 mb-2">No reviews yet</p>
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
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-900">Services Offered</h3>
                      {editing && (
                        <span className="text-sm text-gray-600">Select your service categories</span>
                      )}
                    </div>

                    {editing ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {serviceOptions.map((service) => (
                            <label 
                              key={service} 
                              className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-emerald-300 transition-colors"
                              style={{
                                borderColor: editForm.service_categories.includes(service) ? '#059669' : '#E5E7EB',
                                backgroundColor: editForm.service_categories.includes(service) ? '#F0FDF4' : 'white'
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={editForm.service_categories.includes(service)}
                                onChange={() => handleServiceToggle(service)}
                                className="mr-3 h-5 w-5 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                              />
                              <div>
                                <h4 className="font-semibold text-gray-900 capitalize">
                                  {service.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  Professional {service.replace('_', ' ')} services
                                </p>
                              </div>
                            </label>
                          ))}
                        </div>
                        <p className="text-sm text-gray-500">
                          Select all service categories that apply to your business.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {profile?.service_categories?.length > 0 ? (
                          profile.service_categories.map((category, index) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                              <h4 className="font-semibold text-gray-900 capitalize">
                                {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1">
                                Professional {category.replace('_', ' ')} services
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="col-span-2 text-center py-8 text-gray-500">
                            <p>No services selected yet. Edit your profile to add services.</p>
                          </div>
                        )}
                      </div>
                    )}

                    {profile?.hourly_rate_min && !editing && (
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalProfile;