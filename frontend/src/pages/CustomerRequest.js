import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CustomerRequest = () => {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    service_category: '',
    title: '',
    description: '',
    city: '',
    province: '',
    budget_min: '',
    budget_max: '',
    timeline: 'Within 1 week',
    urgency: 'medium',
    contact_preference: 'either'
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const serviceCategories = [
    { value: 'contractor', label: 'General Contractor' },
    { value: 'real_estate', label: 'Real Estate Agent' },
    { value: 'mortgage_broker', label: 'Mortgage Broker' },
    { value: 'plumber', label: 'Plumber' },
    { value: 'electrician', label: 'Electrician' },
    { value: 'hvac', label: 'HVAC Specialist' },
    { value: 'roofing', label: 'Roofing' },
    { value: 'landscaping', label: 'Landscaping' },
    { value: 'cleaning', label: 'Cleaning Services' },
    { value: 'handyman', label: 'Handyman' },
    { value: 'painter', label: 'Painter' },
    { value: 'flooring', label: 'Flooring Specialist' }
  ];

  const provinces = [
    'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 
    'Newfoundland and Labrador', 'Northwest Territories', 'Nova Scotia', 
    'Nunavut', 'Ontario', 'Prince Edward Island', 'Quebec', 
    'Saskatchewan', 'Yukon'
  ];

  const urgencyOptions = [
    { value: 'low', label: 'Flexible timing' },
    { value: 'medium', label: 'Within a few weeks' },
    { value: 'high', label: 'Within a week' },
    { value: 'urgent', label: 'ASAP' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.service_category || !formData.title || !formData.city || !formData.province) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setError('');
      setLoading(true);

      await axios.post(`${API}/customers/requests/quick`, formData);
      setSubmitted(true);
      
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <Link to="/" className="inline-block mb-6">
              <span className="text-3xl font-bold text-emerald-600">Niwi</span>
            </Link>
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">✅</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Request Submitted!
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Your service request has been submitted. Qualified professionals in your area will be notified and you'll start receiving quotes soon.
            </p>
            <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What happens next?</h3>
              <ul className="text-left space-y-2 text-gray-600">
                <li className="flex items-center">
                  <span className="text-emerald-500 mr-2">✓</span>
                  We'll match you with qualified professionals in your area
                </li>
                <li className="flex items-center">
                  <span className="text-emerald-500 mr-2">✓</span>
                  You'll receive quotes within 24 hours
                </li>
                <li className="flex items-center">
                  <span className="text-emerald-500 mr-2">✓</span>
                  Compare profiles and choose the best fit
                </li>
              </ul>
            </div>
            <Link
              to="/"
              className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition inline-block"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-4">
            <span className="text-3xl font-bold text-emerald-600">Niwi</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Find Trusted Professionals</h1>
          <p className="text-gray-600 mt-2">
            Tell us what you need and we'll connect you with qualified professionals in your area
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Service Details */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Service Details</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Type *
                </label>
                <select
                  required
                  value={formData.service_category}
                  onChange={(e) => handleInputChange('service_category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Select a service type</option>
                  {serviceCategories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Kitchen renovation, Home electrical inspection"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Description *
                </label>
                <textarea
                  rows="4"
                  required
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your project in detail, including size, materials, specific requirements, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Location</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Province *
                  </label>
                  <select
                    required
                    value={formData.province}
                    onChange={(e) => handleInputChange('province', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">Select Province</option>
                    {provinces.map((province) => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Budget & Timeline */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Budget & Timeline</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget Range (Optional)
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Min $"
                      value={formData.budget_min}
                      onChange={(e) => handleInputChange('budget_min', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <input
                      type="number"
                      placeholder="Max $"
                      value={formData.budget_max}
                      onChange={(e) => handleInputChange('budget_max', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timeline
                  </label>
                  <select
                    value={formData.urgency}
                    onChange={(e) => handleInputChange('urgency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    {urgencyOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Contact Method
                </label>
                <select
                  value={formData.contact_preference}
                  onChange={(e) => handleInputChange('contact_preference', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="either">Phone or Email</option>
                  <option value="phone">Phone only</option>
                  <option value="email">Email only</option>
                </select>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 text-white py-3 px-4 rounded-md font-medium hover:bg-emerald-700 transition disabled:opacity-50"
              >
                {loading ? 'Submitting Request...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>

        <div className="text-center mt-6">
          <p className="text-gray-600">
            Are you a professional?{' '}
            <Link to="/professional/signup" className="text-emerald-600 hover:text-emerald-500 font-medium">
              Join Niwi and get leads
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerRequest;