import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const [activeTab, setActiveTab] = useState('professionals');
  const [isVisible, setIsVisible] = useState({});

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

  const features = [
    {
      title: "Verified-Only Leads",
      description: "Every lead is phone/email validated, customer-submitted, and verified for real intent—no recycled junk or scraped lists.",
      benefits: ["No more wasted time on unqualified prospects", "Focus your efforts where they matter most", "Higher conversion rates on every lead"],
      icon: (
        <svg className="w-8 h-8 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
      stat: "96%",
      statLabel: "Lead Verification Rate"
    },
    {
      title: "Instant Lead Notifications",
      description: "Real-time SMS and email alerts the moment new leads arrive in your account—never miss an opportunity again.",
      benefits: ["Real-time notifications via SMS & email", "Connect with customers within minutes", "First responder advantage"],
      icon: (
        <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
        </svg>
      ),
      stat: "3x",
      statLabel: "Higher Close Rate"
    },
    {
      title: "Quality Guarantee",
      description: "Every lead is verified and ready to connect. Not a good fit? We'll replace it at no cost with our transparent replacement policy.",
      benefits: ["100% satisfaction guarantee", "Easy replacement process", "Transparent and fair policy"],
      icon: (
        <svg className="w-8 h-8 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ),
      stat: "5hrs",
      statLabel: "Time Saved Weekly"
    },
    {
      title: "Custom Location Targeting",
      description: "Target by city, postal code, or draw your own service areas to receive hyperlocal inquiries from customers in your area.",
      benefits: ["Precise geographic targeting", "Custom service area mapping", "Local market domination"],
      icon: (
        <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
      ),
      stat: "38%",
      statLabel: "Response Rate Boost"
    },
    {
      title: "Integrated CRM Suite",
      description: "Track deals, notes, tasks, follow-ups, and sync your calendar—all in one dashboard. Never lose track of a lead again.",
      benefits: ["Complete lead management", "Integrated calendar sync", "Automated follow-up sequences"],
      icon: (
        <svg className="w-8 h-8 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm2 2v2h2v-2H5zm4 0v2h2v-2H9zm4 0v2h2v-2h-2z" clipRule="evenodd" />
        </svg>
      ),
      stat: "85%",
      statLabel: "Lead Conversion Rate"
    },
    {
      title: "Multi-Channel Lead Sourcing",
      description: "Leads come from 250+ verified sources—never purchased, always fresh, always inbound from real customers seeking services.",
      benefits: ["250+ lead generation sources", "Always fresh, never recycled", "Real customer inquiries only"],
      icon: (
        <svg className="w-8 h-8 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
        </svg>
      ),
      stat: "250+",
      statLabel: "Lead Sources"
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
      ),
      example: 'Kitchen renovation project, $45K budget, Toronto area'
    },
    {
      name: 'Real Estate Agents',
      description: 'Home buying, selling, and property investment guidance',
      icon: (
        <svg className="w-8 h-8 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      ),
      example: 'First-time buyer looking for condos under $600K in Vancouver'
    },
    {
      name: 'Mortgage Brokers',
      description: 'Home financing, refinancing, and mortgage advice',
      icon: (
        <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
        </svg>
      ),
      example: 'Looking for refinance on $850K home with better rates'
    },
    {
      name: 'Electricians',
      description: 'Electrical installations, repairs, and home upgrades',
      icon: (
        <svg className="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
        </svg>
      ),
      example: 'Panel upgrade and home electrical inspection needed'
    },
    {
      name: 'Plumbers',
      description: 'Plumbing repairs, installations, and emergency services',
      icon: (
        <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      ),
      example: 'Bathroom renovation plumbing, 3-piece installation'
    },
    {
      name: 'HVAC Specialists',
      description: 'Heating, cooling, and ventilation system services',
      icon: (
        <svg className="w-8 h-8 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      ),
      example: 'Central AC installation for 2,500 sq ft home'
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

      {/* Hero Section - Inkris Style */}
      <section className="bg-gradient-to-br from-emerald-50 to-blue-50 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center" data-animate id="hero" style={{
            opacity: isVisible.hero ? 1 : 0,
            transform: isVisible.hero ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          }}>
            <div className="inline-block bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-pulse">
              100% FREE • NO CREDIT CARD REQUIRED
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Realtime Demand + <br />
              <span className="text-emerald-600 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Platform to Close Deals</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              Niwi is the revenue platform that delivers realtime qualified demand, automates conversion, and tracks revenue performance — all in one. Connect with verified customers actively seeking your services.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                to="/professional/signup"
                className="bg-emerald-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-emerald-700 transition-all duration-300 transform hover:scale-105"
              >
                Join as Professional
              </Link>
              <Link
                to="/credits"
                className="border-2 border-emerald-600 text-emerald-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-emerald-600 hover:text-white transition-all duration-300"
              >
                View Pricing
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-8 mt-12 max-w-2xl mx-auto">
              {[
                { number: '2,500+', label: 'Active Professionals' },
                { number: '4.8/5', label: 'Average Rating' },
                { number: '3x', label: 'More Quality Leads' }
              ].map((item, i) => (
                <div 
                  key={i}
                  className="text-center transform transition-all duration-500 hover:scale-110"
                  style={{
                    opacity: isVisible.hero ? 1 : 0,
                    transform: isVisible.hero ? 'translateY(0)' : 'translateY(20px)',
                    transitionDelay: `${1000 + i * 200}ms`
                  }}
                >
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 hover:text-emerald-600 transition-colors duration-300">
                    {item.number}
                  </div>
                  <div className="text-sm text-gray-600">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Everything You Need Section - Inkris Style Feature Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-animate id="features-header" style={{
            opacity: isVisible['features-header'] ? 1 : 0,
            transform: isVisible['features-header'] ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          }}>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need to Win More Business</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Niwi combines verified lead generation with powerful tools designed to help you close more deals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" data-animate id="features-grid">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
                style={{
                  opacity: isVisible['features-grid'] ? 1 : 0,
                  transform: isVisible['features-grid'] ? 'translateY(0)' : 'translateY(30px)',
                  transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  transitionDelay: `${index * 100}ms`
                }}
              >
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg border border-gray-200 group-hover:scale-110 transition-all duration-300">
                  {feature.icon}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-emerald-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>

                <div className="space-y-2 mb-6">
                  {feature.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center text-sm text-gray-700">
                      <span className="text-green-500 mr-2">✓</span>
                      {benefit}
                    </div>
                  ))}
                </div>

                {feature.stat && (
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
                    <div className="text-2xl font-bold text-emerald-600">{feature.stat}</div>
                    <div className="text-sm text-emerald-700">{feature.statLabel}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section - Bark Style */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-animate id="how-it-works-header">
            <div className="inline-block text-emerald-600 font-semibold text-sm uppercase tracking-wide mb-4">
              How it works
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Niwi for Professionals</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Niwi is the Amazon of services. Thousands of Canadians use us daily to find what they need.
            </p>
          </div>

          <div className="space-y-20">
            {/* Step 1 - Customers Come to Us */}
            <div className="grid lg:grid-cols-2 gap-12 items-center" data-animate id="step-1">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    1
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Customers come to us with their needs</h3>
                </div>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>We support every imaginable service, for both individuals and small businesses. We collect detailed information about exactly what the customer is looking for.</p>
                  <p>Smart customers Niwi it, not Google it. They know that we'll provide relevant, professional companies that can meet their needs.</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="w-full h-64 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-24 h-24 text-emerald-600 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <p className="text-gray-700 font-medium">Customer submits service request</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 - Customers Find You */}
            <div className="grid lg:grid-cols-2 gap-12 items-center" data-animate id="step-2">
              <div className="order-2 lg:order-1 bg-white rounded-2xl p-8 shadow-lg">
                <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-24 h-24 text-blue-600 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                    <p className="text-gray-700 font-medium">You receive qualified leads</p>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2 space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    2
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Customers find you on Niwi</h3>
                </div>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>Customers then find you on Niwi and can reach out to you. We'll also send you all leads matching what you do.</p>
                  <p>We charge a small fee for each introduction and we give you the phone number and email address of each potential customer so you can reach out.</p>
                </div>
              </div>
            </div>

            {/* Step 3 - Grow Your Business */}
            <div className="grid lg:grid-cols-2 gap-12 items-center" data-animate id="step-3">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    3
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Grow your business. Fast.</h3>
                </div>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>We take the hassle out of marketing your services. Niwi professionals receive hot, live leads as soon as they are placed.</p>
                  <p>Plus tons of other benefits: online profile which boosts your web presence, award winning customer success team support by email and telephone.</p>
                </div>
                <Link
                  to="/professional/signup"
                  className="inline-flex items-center bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors duration-300"
                >
                  Join as professional now
                  <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="w-full h-64 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-24 h-24 text-green-600 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                    </svg>
                    <p className="text-gray-700 font-medium">Business growth and success</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Get Started Quick Steps */}
          <div className="mt-20 bg-white rounded-3xl p-8 sm:p-12 shadow-xl" data-animate id="quick-steps">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Get Started</h3>
              <div className="w-16 h-1 bg-emerald-600 mx-auto rounded"></div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: (
                    <svg className="w-12 h-12 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                    </svg>
                  ),
                  title: "Create your account in minutes",
                  description: "Quick signup process with business verification"
                },
                {
                  icon: (
                    <svg className="w-12 h-12 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                  ),
                  title: "Start receiving leads today",
                  description: "Immediate access to qualified customer requests"
                },
                {
                  icon: (
                    <svg className="w-12 h-12 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  ),
                  title: "No commission or hidden fees",
                  description: "Transparent pricing with no surprises"
                }
              ].map((step, index) => (
                <div key={index} className="text-center group">
                  <div className="bg-gray-50 w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-gray-100 transition-colors duration-300">
                    {step.icon}
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-3">{step.title}</h4>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                to="/professional/signup"
                className="bg-emerald-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-emerald-700 transition-all duration-300 transform hover:scale-105"
              >
                Create Your Free Profile
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-animate id="services-header" style={{
            opacity: isVisible['services-header'] ? 1 : 0,
            transform: isVisible['services-header'] ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          }}>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Perfect for Service Professionals</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of successful professionals already growing their business
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" data-animate id="service-cards">
            {serviceCategories.map((category, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group border border-gray-100"
                style={{
                  opacity: isVisible['service-cards'] ? 1 : 0,
                  transform: isVisible['service-cards'] 
                    ? 'translateY(0)' 
                    : 'translateY(30px)',
                  transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  transitionDelay: `${index * 100}ms`
                }}
              >
                <div className="flex items-center mb-4">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 w-16 h-16 rounded-2xl flex items-center justify-center mr-4 shadow-lg border border-gray-200 transform group-hover:scale-110 transition-all duration-300 group-hover:shadow-xl">
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors duration-300">
                    {category.name}
                  </h3>
                </div>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <div className="bg-gray-50 rounded-lg p-4 group-hover:bg-emerald-50 transition-colors duration-300">
                  <p className="text-sm text-gray-700">
                    <strong>Example lead:</strong> "{category.example}"
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12" data-animate id="services-cta" style={{
            opacity: isVisible['services-cta'] ? 1 : 0,
            transform: isVisible['services-cta'] ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            transitionDelay: '600ms'
          }}>
            <Link
              to="/professional/signup"
              className="bg-emerald-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-emerald-700 transition-all duration-300 inline-block transform hover:scale-105 hover:shadow-xl active:scale-95"
            >
              View Sample Leads • Create Free Profile
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Structure Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-animate id="pricing-header" style={{
            opacity: isVisible['pricing-header'] ? 1 : 0,
            transform: isVisible['pricing-header'] ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          }}>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the credit package that fits your business needs. Only pay for the leads you want to pursue.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-animate id="pricing-cards">
            {[
              { name: "Tester Pack", credits: 10, price: 150, description: "Perfect for testing the platform", popular: false },
              { name: "777 Pack", credits: 25, price: 499, description: "Great for small businesses", popular: false },
              { name: "Elite Pack", credits: 20, price: 1500, description: "20 quality leads", popular: true },
              { name: "Pro Pack", credits: 30, price: 2000, description: "30 quality leads", popular: false },
              { name: "Premium Deluxe", credits: 50, price: 6000, description: "For established businesses", popular: false },
              { name: "Enterprise Deluxe", credits: 100, price: 13250, description: "100 quality leads", popular: false }
            ].map((pkg, index) => (
              <div 
                key={index}
                className={`rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer ${
                  pkg.popular 
                    ? 'bg-emerald-50 border-2 border-emerald-500 transform scale-105' 
                    : 'bg-white border-2 border-gray-200 hover:border-emerald-300'
                }`}
                style={{
                  opacity: isVisible['pricing-cards'] ? 1 : 0,
                  transform: isVisible['pricing-cards'] 
                    ? 'translateY(0)' 
                    : 'translateY(30px)',
                  transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  transitionDelay: `${index * 100}ms`
                }}
              >
                {pkg.popular && (
                  <div className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                    MOST POPULAR
                  </div>
                )}
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{pkg.description}</p>
                
                <div className="mb-4">
                  <div className="text-3xl font-bold text-gray-900">
                    {pkg.credits}
                    <span className="text-lg text-gray-600 font-normal"> leads</span>
                  </div>
                  <div className="text-2xl font-semibold text-emerald-600">
                    ${pkg.price.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    ${(pkg.price / pkg.credits).toFixed(0)} per lead
                  </div>
                </div>

                <a
                  href={
                    index === 0 ? 'https://buy.stripe.com/7sY7sEcN8ghrcDl5W3gUM07' : // Tester Pack - $150
                    index === 1 ? 'https://buy.stripe.com/7sYfZacN82qBcDl707gUM02' : // 777 Pack - $499
                    index === 2 ? 'https://buy.stripe.com/4gM7sEbJ48OZcDl2JRgUM06' : // Elite Pack - $1500
                    index === 3 ? 'https://buy.stripe.com/9B6aEQ5kG7KVavd0BJgUM03' : // Pro Pack - $2000
                    index === 4 ? 'https://buy.stripe.com/cNi9AM28ughrcDl4RZgUM01' : // Premium Deluxe - $6000
                    'https://buy.stripe.com/3cIcMYdRce9javdeszgUM04' // Enterprise Deluxe - $13250
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-3 px-2 sm:px-4 rounded-lg font-medium transition-all duration-300 text-center block transform hover:scale-105 active:scale-95 text-sm ${
                    pkg.popular
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg hover:shadow-xl'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200 hover:shadow-lg'
                  }`}
                >
                  Purchase Now
                </a>
              </div>
            ))}
          </div>

          <div className="text-center mt-12" data-animate id="pricing-cta" style={{
            opacity: isVisible['pricing-cta'] ? 1 : 0,
            transform: isVisible['pricing-cta'] ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            transitionDelay: '600ms'
          }}>
            <p className="text-gray-600 mb-4">All packages provide quality, verified leads from customers in your area.</p>
            <Link
              to="/professional/signup"
              className="bg-emerald-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-emerald-700 transition-all duration-300 inline-block transform hover:scale-105 hover:shadow-xl active:scale-95"
            >
              Get Started Today
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Trusted by 2,500+ Canadian Professionals</h2>
            <p className="text-xl text-gray-300">
              See why businesses choose Niwi to grow their revenue
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-400 mb-2">3x</div>
              <div className="text-gray-300">More Qualified Leads</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-400 mb-2">4.8/5</div>
              <div className="text-gray-300">Customer Rating</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-400 mb-2">15K+</div>
              <div className="text-gray-300">Daily Visitors</div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-2xl p-8 max-w-4xl mx-auto">
            <blockquote className="text-lg text-gray-300 mb-6 text-center">
              "I went from 1-2 leads per month to getting 12+ qualified renovation projects. 
              The platform pays for itself with just one successful project."
            </blockquote>
            <div className="text-center">
              <div className="font-semibold text-white">Mike Thompson</div>
              <div className="text-gray-400">General Contractor • Calgary</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to 5x Your Revenue?</h2>
          <p className="text-xl mb-8 text-emerald-100">
            Stop watching opportunities pass by. Join the marketplace and start receiving qualified leads every single day.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              to="/professional/signup"
              className="bg-white text-emerald-600 px-4 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold hover:bg-gray-100 transition text-center"
            >
              <span className="hidden sm:inline">Create Free Profile</span>
              <span className="sm:hidden">Join as Professional</span>
            </Link>
            <Link
              to="/customer/request"
              className="border-2 border-white text-white px-4 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold hover:bg-white hover:text-emerald-600 transition text-center"
            >
              <span className="hidden sm:inline">Find Professionals</span>
              <span className="sm:hidden">Find Services</span>
            </Link>
          </div>

          <div className="text-emerald-100 space-y-2">
            <div>✓ Free Business Profile</div>
            <div>✓ No credit card required</div>
            <div>✓ Upgrade anytime</div>
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