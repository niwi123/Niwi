import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const [activeTab, setActiveTab] = useState('professionals');
  const [isVisible, setIsVisible] = useState({});
  const [searchService, setSearchService] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('home');

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: true
          }));
        }
      });
    }, observerOptions);

    // Observe all sections
    const sections = document.querySelectorAll('[data-animate]');
    sections.forEach(section => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const handleCustomerSearch = (e) => {
    e.preventDefault();
    // Navigate to customer request form with pre-filled data
    const params = new URLSearchParams();
    if (searchService) params.set('service', searchService);
    if (postalCode) params.set('postal', postalCode);
    window.location.href = `/customer/request?${params.toString()}`;
  };

  const popularServices = [
    'House Cleaning', 'Web Design', 'Personal Trainers', 'Contractors',
    'Real Estate', 'Mortgage Brokers', 'Electricians', 'Plumbers'
  ];

  const keyFeatures = [
    {
      title: "Verified-Only Leads",
      description: "Every lead is phone/email validated, customer-submitted, and verified for real intent—no recycled junk.",
      icon: (
        <svg className="w-8 h-8 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
      stat: "96%",
      statLabel: "Lead Verification Rate"
    },
    {
      title: "Instant Notifications",
      description: "Real-time SMS and email alerts the moment new leads arrive in your account—never miss an opportunity.",
      icon: (
        <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
        </svg>
      ),
      stat: "3x",
      statLabel: "Higher Close Rate"
    },
    {
      title: "Quality Guaranteed",
      description: "Every lead is verified and ready to connect. Not a good fit? We'll replace it at no cost.",
      icon: (
        <svg className="w-8 h-8 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ),
      stat: "5hrs",
      statLabel: "Time Saved Weekly"
    }
  ];

  const serviceCategories = [
    {
      name: 'Contractors',
      description: 'General contracting, renovations, and construction projects',
      icon: (
        <svg className="w-8 h-8 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm2 2v2h2v-2H5zm4 0v2h2v-2H9zm4 0v2h2v-2h-2z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      name: 'Real Estate Agents',
      description: 'Home buying, selling, and property investment guidance',
      icon: (
        <svg className="w-8 h-8 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      )
    },
    {
      name: 'Mortgage Brokers',
      description: 'Home financing, refinancing, and mortgage advice',
      icon: (
        <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
        </svg>
      )
    },
    {
      name: 'Electricians',
      description: 'Electrical installations, repairs, and home upgrades',
      icon: (
        <svg className="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      name: 'Plumbers',
      description: 'Plumbing repairs, installations, and emergency services',
      icon: (
        <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      name: 'HVAC Specialists',
      description: 'Heating, cooling, and ventilation system services',
      icon: (
        <svg className="w-8 h-8 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-emerald-600">Niwi</span>
            </div>
            <nav className="flex items-center space-x-2 sm:space-x-6">
              <Link to="/login" className="text-gray-600 hover:text-emerald-600 font-medium text-sm sm:text-base">
                Sign In
              </Link>
              <Link 
                to="/professional/signup" 
                className="bg-emerald-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-emerald-700 transition text-xs sm:text-sm font-medium"
              >
                <span className="hidden sm:inline">Join as Professional</span>
                <span className="sm:hidden">Join</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Dual Section: Professional & Customer */}
      <section className="py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 rounded-xl p-1 flex">
              <button
                onClick={() => setActiveTab('professionals')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === 'professionals'
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                I'm a Professional
              </button>
              <button
                onClick={() => setActiveTab('customers')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === 'customers'
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                I Need a Service
              </button>
            </div>
          </div>

          {/* Professional Section */}
          <div className={`transition-all duration-500 ${activeTab === 'professionals' ? 'block' : 'hidden'}`}>
            <div className="text-center mb-16">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Realtime Demand + <br />
                <span className="text-emerald-600 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Platform to Close Deals</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
                Niwi is the revenue platform that delivers realtime qualified demand, automates conversion, and tracks revenue performance — all in one.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link
                  to="/professional/signup"
                  className="bg-emerald-600 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-emerald-700 transition-all duration-300 transform hover:scale-105"
                >
                  Join as Professional
                </Link>
                <Link
                  to="/pricing"
                  className="border-2 border-emerald-600 text-emerald-600 px-6 py-3 sm:px-8 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-emerald-600 hover:text-white transition-all duration-300"
                >
                  View Pricing
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                {[
                  { number: '2,500+', label: 'Active Professionals' },
                  { number: '4.8/5', label: 'Average Rating' },
                  { number: '3x', label: 'More Quality Leads' }
                ].map((item, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-gray-900 hover:text-emerald-600 transition-colors duration-300">
                      {item.number}
                    </div>
                    <div className="text-sm text-gray-600">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Customer Section - Bark Style Search */}
          <div className={`transition-all duration-500 ${activeTab === 'customers' ? 'block' : 'hidden'}`}>
            <div className="text-center mb-16 bg-gradient-to-br from-blue-50 to-indigo-50 py-20 rounded-3xl">
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                Find the best <br />
                <span className="text-blue-600">professionals in Canada</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8">
                Get free quotes within minutes
              </p>

              {/* Search Form */}
              <form onSubmit={handleCustomerSearch} className="max-w-2xl mx-auto mb-8">
                <div className="bg-white rounded-2xl p-6 shadow-xl">
                  <div className="space-y-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="What service are you looking for?"
                        value={searchService}
                        onChange={(e) => setSearchService(e.target.value)}
                        className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                      />
                      <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                    </div>
                    
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Postal code"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                      />
                      <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
                    >
                      Find Professionals
                    </button>
                  </div>
                </div>
              </form>

              {/* Popular Services */}
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  <span className="font-semibold">Popular:</span>{' '}
                  {popularServices.slice(0, 4).map((service, index) => (
                    <span key={index}>
                      <button
                        onClick={() => setSearchService(service)}
                        className="text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        {service}
                      </button>
                      {index < 3 && ', '}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section - Only show for Professional tab */}
      {activeTab === 'professionals' && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need to Win More Business</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Niwi combines verified lead generation with powerful tools designed to help you close more deals.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {keyFeatures.map((feature, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg border border-gray-200">
                    {feature.icon}
                  </div>
                  
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed text-sm sm:text-base">
                    {feature.description}
                  </p>

                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
                    <div className="text-2xl font-bold text-emerald-600">{feature.stat}</div>
                    <div className="text-sm text-emerald-700">{feature.statLabel}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

        {/* What can we help you with - Browse Categories (Inkris Style) */}
        <section className="py-12 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                What can we help you with?
              </h2>
              <p className="text-base text-gray-600">
                Explore our comprehensive range of professional services, tailored to meet all your needs.
              </p>
            </div>

            {/* Browse Categories */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Browse Categories</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { name: 'Home Services', count: '8 services', id: 'home' },
                  { name: 'Professional Services', count: '4 services', id: 'professional' },
                  { name: 'Creative Services', count: '2 services', id: 'creative' },
                  { name: 'Specialized Services', count: '2 services', id: 'specialized' }
                ].map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                      selectedCategory === category.id
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-25'
                    }`}
                  >
                    <h4 className={`text-base font-semibold mb-1 ${
                      selectedCategory === category.id ? 'text-emerald-700' : 'text-gray-900'
                    }`}>
                      {category.name}
                    </h4>
                    <p className={`text-sm ${
                      selectedCategory === category.id ? 'text-emerald-600' : 'text-gray-500'
                    }`}>
                      {category.count}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Category Services Display */}
            <div className="bg-gray-50 rounded-lg p-6">
              {selectedCategory === 'home' && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Home Services</h3>
                  <p className="text-sm text-gray-600 mb-6">8 services available</p>
                  <p className="text-base text-gray-700 mb-6">
                    Professional home improvement and maintenance services for your property.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { name: 'General Contractors', desc: 'Complete home renovations and construction projects', tag: 'Construction' },
                      { name: 'Electricians', desc: 'Electrical installation, repair and maintenance services', tag: 'Electrical' },
                      { name: 'Plumbers', desc: 'Plumbing installation, repair and emergency services', tag: 'Plumbing' },
                      { name: 'HVAC Specialists', desc: 'Heating, ventilation and air conditioning services', tag: 'HVAC' },
                      { name: 'Real Estate Agents', desc: 'Property buying and selling professional services', tag: 'Real Estate' },
                      { name: 'Mortgage Brokers', desc: 'Home financing and mortgage advisory services', tag: 'Finance' },
                      { name: 'Landscapers', desc: 'Garden design, maintenance and outdoor improvement', tag: 'Landscaping' },
                      { name: 'Cleaning Services', desc: 'Professional residential and commercial cleaning', tag: 'Cleaning' }
                    ].map((service, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 border border-gray-200 hover:border-emerald-300 hover:shadow-sm transition-all duration-200">
                        <h4 className="text-base font-semibold text-gray-900 mb-2">{service.name}</h4>
                        <p className="text-sm text-gray-600 mb-3">{service.desc}</p>
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-800 rounded">
                          {service.tag}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedCategory === 'professional' && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Professional Services</h3>
                  <p className="text-sm text-gray-600 mb-6">4 services available</p>
                  <p className="text-base text-gray-700 mb-6">
                    Specialized professional services for business and personal needs.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { name: 'Social Media Marketing', desc: 'SEO, SEM and digital marketing specialist services', tag: 'Marketing' },
                      { name: 'Private Investigators', desc: 'Professional investigation and research services', tag: 'Investigation' },
                      { name: 'Counselling Services', desc: 'Professional counseling and therapy services', tag: 'Counseling' },
                      { name: 'Business Consultants', desc: 'Strategic business advice and consulting services', tag: 'Consulting' }
                    ].map((service, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 border border-gray-200 hover:border-emerald-300 hover:shadow-sm transition-all duration-200">
                        <h4 className="text-base font-semibold text-gray-900 mb-2">{service.name}</h4>
                        <p className="text-sm text-gray-600 mb-3">{service.desc}</p>
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-800 rounded">
                          {service.tag}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedCategory === 'creative' && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Creative Services</h3>
                  <p className="text-sm text-gray-600 mb-6">2 services available</p>
                  <p className="text-base text-gray-700 mb-6">
                    Professional creative and event services for special occasions.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { name: 'Wedding Photography', desc: 'Professional wedding and event photography services', tag: 'Photography' },
                      { name: 'Event Videography', desc: 'Wedding and event videography with highlight reels', tag: 'Videography' }
                    ].map((service, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 border border-gray-200 hover:border-emerald-300 hover:shadow-sm transition-all duration-200">
                        <h4 className="text-base font-semibold text-gray-900 mb-2">{service.name}</h4>
                        <p className="text-sm text-gray-600 mb-3">{service.desc}</p>
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-800 rounded">
                          {service.tag}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedCategory === 'specialized' && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Specialized Services</h3>
                  <p className="text-sm text-gray-600 mb-6">2 services available</p>
                  <p className="text-base text-gray-700 mb-6">
                    Specialized professional services for unique requirements.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { name: 'Legal Consultants', desc: 'Professional legal advice and consultation services', tag: 'Legal' },
                      { name: 'Financial Advisors', desc: 'Personal and business financial planning services', tag: 'Finance' }
                    ].map((service, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 border border-gray-200 hover:border-emerald-300 hover:shadow-sm transition-all duration-200">
                        <h4 className="text-base font-semibold text-gray-900 mb-2">{service.name}</h4>
                        <p className="text-sm text-gray-600 mb-3">{service.desc}</p>
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-800 rounded">
                          {service.tag}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

      {/* How It Works - Condensed */}
      {activeTab === 'professionals' && (
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">How Niwi Works</h2>
              <p className="text-xl text-gray-600">Simple. Fast. Effective.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: 1,
                  title: "Customers Submit Requests",
                  description: "Verified customers post their service needs with detailed requirements and budgets.",
                  color: "emerald"
                },
                {
                  step: 2, 
                  title: "You Receive Qualified Leads",
                  description: "Get instant notifications for leads matching your services and location.",
                  color: "blue"
                },
                {
                  step: 3,
                  title: "Connect & Close Deals",
                  description: "Contact customers directly with their phone and email. Start growing your business.",
                  color: "red"
                }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className={`${
                    item.color === 'emerald' ? 'bg-emerald-600' :
                    item.color === 'blue' ? 'bg-blue-600' :
                    item.color === 'red' ? 'bg-red-600' :
                    'bg-gray-600'
                  } text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg`}>
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                to="/professional/signup"
                className="bg-emerald-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-emerald-700 transition-all duration-300 transform hover:scale-105"
              >
                Get Started Today
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Pricing - Condensed */}
      {activeTab === 'professionals' && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
              <p className="text-xl text-gray-600">Only pay for the leads you want to pursue</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: "Tester Pack", credits: 3, price: 150, popular: false },
                { name: "Elite Pack", credits: 20, price: 1500, popular: true },
                { name: "Pro Pack", credits: 30, price: 2000, popular: false },
                { name: "Premium Deluxe", credits: 100, price: 6000, popular: false }
              ].map((pkg, index) => (
                <div 
                  key={index}
                  className={`rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${
                    pkg.popular 
                      ? 'bg-emerald-50 border-2 border-emerald-500 transform scale-105' 
                      : 'bg-white border-2 border-gray-200'
                  }`}
                >
                  {pkg.popular && (
                    <div className="bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full inline-block mb-3">
                      POPULAR
                    </div>
                  )}
                  
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">{pkg.name}</h3>
                  
                  <div className="mb-4">
                    <div className="text-xl sm:text-2xl font-bold text-gray-900">
                      {pkg.credits} <span className="text-sm text-gray-600 font-normal">leads</span>
                    </div>
                    <div className="text-lg sm:text-xl font-semibold text-emerald-600">
                      ${pkg.price.toLocaleString()}
                    </div>
                  </div>

                  <a
                    href={
                      index === 0 ? 'https://buy.stripe.com/7sY7sEcN8ghrcDl5W3gUM07' : 
                      index === 1 ? 'https://buy.stripe.com/4gM7sEbJ48OZcDl2JRgUM06' : 
                      index === 2 ? 'https://buy.stripe.com/9B6aEQ5kG7KVavd0BJgUM03' :
                      'https://buy.stripe.com/cNi9AM28ughrcDl4RZgUM01'
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-2 sm:py-3 rounded-lg font-medium transition-all duration-300 text-center block text-xs sm:text-sm ${
                      pkg.popular
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    Purchase Now
                  </a>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link
                to="/pricing"
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                View All Packages →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Social Proof - Condensed */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Trusted by 2,500+ Canadian Professionals</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400 mb-2">3x</div>
              <div className="text-gray-300">More Qualified Leads</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400 mb-2">4.8/5</div>
              <div className="text-gray-300">Customer Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400 mb-2">15K+</div>
              <div className="text-gray-300">Daily Visitors</div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-2xl p-8 max-w-3xl mx-auto text-center">
            <blockquote className="text-lg text-gray-300 mb-6">
              "I went from 1-2 leads per month to getting 12+ qualified renovation projects. 
              The platform pays for itself with just one successful project."
            </blockquote>
            <div className="font-semibold text-white">Mike Thompson</div>
            <div className="text-gray-400">General Contractor • Calgary</div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Grow Your Business?</h2>
          <p className="text-xl mb-8 text-emerald-100">
            {activeTab === 'professionals' 
              ? 'Join the marketplace and start receiving qualified leads every single day.'
              : 'Get connected with verified professionals for all your service needs.'
            }
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {activeTab === 'professionals' ? (
              <>
                <Link
                  to="/professional/signup"
                  className="bg-white text-emerald-600 px-6 py-3 sm:px-8 sm:py-4 rounded-xl text-base sm:text-lg font-semibold hover:bg-gray-100 transition text-center"
                >
                  <span className="hidden sm:inline">Create Free Profile</span>
                  <span className="sm:hidden">Join as Professional</span>
                </Link>
                <Link
                  to="/pricing"
                  className="border-2 border-white text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl text-base sm:text-lg font-semibold hover:bg-white hover:text-emerald-600 transition text-center"
                >
                  View Pricing
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={handleCustomerSearch}
                  className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition"
                >
                  Find Professionals
                </button>
                <Link
                  to="/customer/request"
                  className="border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-blue-600 transition"
                >
                  Post a Request
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-4">Niwi</div>
            <p className="mb-6">Connecting quality professionals with customers across Canada</p>
            <div className="text-sm text-gray-400">
              © 2025 Niwi. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;