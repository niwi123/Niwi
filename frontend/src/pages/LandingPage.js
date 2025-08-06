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
      <header className="bg-white shadow-sm border-b border-gray-100">
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
                className="bg-emerald-600 text-white px-2 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-emerald-700 transition text-xs sm:text-sm font-medium"
              >
                <span className="hidden sm:inline">Join as Professional</span>
                <span className="sm:hidden">Join</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-50 to-blue-50 py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center" data-animate id="hero" style={{
            opacity: isVisible.hero ? 1 : 0,
            transform: isVisible.hero ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          }}>
            <div className="inline-block bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-pulse">
              100% FREE • NO CREDIT CARD REQUIRED
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Connect. Serve. <span className="text-emerald-600 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Grow.</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              The platform where quality professionals meet customers in need. 
              Get verified leads or find trusted experts — all in one place.
            </p>

            {/* Enhanced Dual CTA Tabs with animations */}
            <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-xl max-w-2xl mx-auto transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
              <div className="flex bg-gray-100 rounded-xl p-1 mb-4 sm:mb-6 relative overflow-hidden">
                <div 
                  className="absolute top-1 bottom-1 bg-emerald-600 rounded-lg transition-all duration-300 ease-out"
                  style={{
                    left: activeTab === 'professionals' ? '4px' : '50%',
                    width: 'calc(50% - 4px)',
                  }}
                />
                <button
                  onClick={() => setActiveTab('professionals')}
                  className={`flex-1 py-2 sm:py-3 px-2 sm:px-6 rounded-lg font-medium transition-all duration-300 relative z-10 text-xs sm:text-base ${
                    activeTab === 'professionals'
                      ? 'text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  <span className="hidden sm:inline">I'm a Professional</span>
                  <span className="sm:hidden">Professional</span>
                </button>
                <button
                  onClick={() => setActiveTab('customers')}
                  className={`flex-1 py-2 sm:py-3 px-2 sm:px-6 rounded-lg font-medium transition-all duration-300 relative z-10 text-xs sm:text-base ${
                    activeTab === 'customers'
                      ? 'text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  <span className="hidden sm:inline">I Need a Service</span>
                  <span className="sm:hidden">Customer</span>
                </button>
              </div>

              {/* Enhanced Tab Content with slide animations */}
              <div className="relative overflow-hidden" style={{ minHeight: '280px' }}>
                <div 
                  className={`absolute inset-0 transition-all duration-500 ease-in-out transform ${
                    activeTab === 'professionals' 
                      ? 'translate-x-0 opacity-100' 
                      : '-translate-x-full opacity-0'
                  }`}
                >
                  <div className="text-center px-2">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                      Get Quality Leads. Grow Your Business.
                    </h3>
                    <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                      Connect with verified customers actively seeking your services in your area — in real time.
                    </p>
                    <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                      {[
                        'No payment required',
                        'Takes 2 minutes', 
                        'Start getting local leads'
                      ].map((text, i) => (
                        <div 
                          key={i}
                          className="flex items-center justify-center text-xs sm:text-sm text-gray-600 transform transition-all duration-300 hover:scale-105"
                          style={{
                            transitionDelay: `${i * 100}ms`
                          }}
                        >
                          <span className="text-green-500 mr-2 animate-bounce" style={{ animationDelay: `${i * 200}ms` }}>✓</span>
                          {text}
                        </div>
                      ))}
                    </div>
                    <Link
                      to="/professional/signup"
                      className="bg-emerald-600 text-white px-4 sm:px-8 py-3 sm:py-4 rounded-xl text-sm sm:text-lg font-semibold hover:bg-emerald-700 transition-all duration-300 inline-block transform hover:scale-105 hover:shadow-xl active:scale-95 w-full sm:w-auto"
                    >
                      <span className="hidden sm:inline">Create Free Profile</span>
                      <span className="sm:hidden">Get Started Free</span>
                    </Link>
                  </div>
                </div>

                <div 
                  className={`absolute inset-0 transition-all duration-500 ease-in-out transform ${
                    activeTab === 'customers' 
                      ? 'translate-x-0 opacity-100' 
                      : 'translate-x-full opacity-0'
                  }`}
                >
                  <div className="text-center px-2">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                      Find Trusted Professionals. Get Things Done.
                    </h3>
                    <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                      Get connected with verified, local professionals for your home and business needs.
                    </p>
                    <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                      {[
                        'Verified professionals',
                        'Quick response times',
                        'Quality guaranteed'
                      ].map((text, i) => (
                        <div 
                          key={i}
                          className="flex items-center justify-center text-xs sm:text-sm text-gray-600 transform transition-all duration-300 hover:scale-105"
                          style={{
                            transitionDelay: `${i * 100}ms`
                          }}
                        >
                          <span className="text-green-500 mr-2 animate-bounce" style={{ animationDelay: `${i * 200}ms` }}>✓</span>
                          {text}
                        </div>
                      ))}
                    </div>
                    <Link
                      to="/customer/request"
                      className="bg-orange-500 text-white px-4 sm:px-8 py-3 sm:py-4 rounded-xl text-sm sm:text-lg font-semibold hover:bg-orange-600 transition-all duration-300 inline-block transform hover:scale-105 hover:shadow-xl active:scale-95 w-full sm:w-auto"
                    >
                      <span className="hidden sm:inline">Get Service Quotes</span>
                      <span className="sm:hidden">Find Services</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced trust indicators with staggered animations */}
            <div className="mt-12 flex items-center justify-center space-x-8 text-gray-500">
              {[
                { number: '2,500+', label: 'Active Professionals' },
                { number: '4.8/5', label: 'Average Rating' },
                { number: '3x', label: 'More Quality Leads' }
              ].map((item, i) => (
                <div 
                  key={i}
                  className="text-center transform transition-all duration-500 hover:scale-110 cursor-pointer"
                  style={{
                    opacity: isVisible.hero ? 1 : 0,
                    transform: isVisible.hero 
                      ? 'translateY(0)' 
                      : 'translateY(20px)',
                    transitionDelay: `${1000 + i * 200}ms`
                  }}
                >
                  <div className="text-2xl font-bold text-gray-900 hover:text-emerald-600 transition-colors duration-300">
                    {item.number}
                  </div>
                  <div className="text-sm">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Niwi */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Niwi?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The easiest way to connect, build trust, and grow your business
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8">
              <div className="bg-emerald-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Target the Right Customers</h3>
              <p className="text-gray-600">
                Connect with verified customers who are actively seeking your specific services in your area.
              </p>
            </div>

            <div className="text-center p-8">
              <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Instant Lead Notifications</h3>
              <p className="text-gray-600">
                Get real-time alerts when customers in your area need your services. Never miss an opportunity.
              </p>
            </div>

            <div className="text-center p-8">
              <div className="bg-orange-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">💎</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quality Guaranteed</h3>
              <p className="text-gray-600">
                Every lead is verified and ready to connect. Not a good fit? We'll replace it at no cost.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories with enhanced animations */}
      <section className="py-20 bg-gray-50">
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
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group"
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
      <section className="py-20 bg-white">
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
      {/* How It Works with enhanced animations */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-animate id="how-it-works-header" style={{
            opacity: isVisible['how-it-works-header'] ? 1 : 0,
            transform: isVisible['how-it-works-header'] ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          }}>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Get Started in 3 Simple Steps</h2>
            <p className="text-xl text-gray-600">
              From signup to verified customer leads — in under 5 minutes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12" data-animate id="steps">
            {[
              {
                step: 1,
                title: "Create Your Free Profile",
                description: "Add your business info, service areas, and what you offer. No credit card needed.",
                color: "emerald"
              },
              {
                step: 2, 
                title: "Browse Real Leads",
                description: "See actual customer requests filtered by your services, location, and preferences.",
                color: "blue"
              },
              {
                step: 3,
                title: "Purchase & Connect",
                description: "Buy credits to unlock full lead details and start connecting with customers.",
                color: "orange"
              }
            ].map((item, index) => (
              <div 
                key={index}
                className="text-center transform transition-all duration-500 hover:scale-105 cursor-pointer"
                style={{
                  opacity: isVisible.steps ? 1 : 0,
                  transform: isVisible.steps 
                    ? 'translateY(0)' 
                    : 'translateY(40px)',
                  transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  transitionDelay: `${index * 200}ms`
                }}
              >
                <div className={`bg-${item.color}-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg transform transition-all duration-300 hover:shadow-xl hover:scale-110`}>
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 transition-colors duration-300 hover:text-emerald-600">
                  {item.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12" data-animate id="how-it-works-cta" style={{
            opacity: isVisible['how-it-works-cta'] ? 1 : 0,
            transform: isVisible['how-it-works-cta'] ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            transitionDelay: '800ms'
          }}>
            <Link
              to="/professional/signup"
              className="bg-emerald-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-emerald-700 transition-all duration-300 inline-block transform hover:scale-105 hover:shadow-xl active:scale-95"
            >
              Create Your Free Profile
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