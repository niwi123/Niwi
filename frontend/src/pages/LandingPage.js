import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const [activeTab, setActiveTab] = useState('professionals');

  const serviceCategories = [
    {
      name: 'Contractors',
      description: 'General contracting, renovations, and construction projects',
      icon: '🔨',
      example: 'Kitchen renovation project, $45K budget, Toronto area'
    },
    {
      name: 'Real Estate Agents',
      description: 'Home buying, selling, and property investment guidance',
      icon: '🏠',
      example: 'First-time buyer looking for condos under $600K in Vancouver'
    },
    {
      name: 'Mortgage Brokers',
      description: 'Home financing, refinancing, and mortgage advice',
      icon: '🏦',
      example: 'Looking for refinance on $850K home with better rates'
    },
    {
      name: 'Electricians',
      description: 'Electrical installations, repairs, and home upgrades',
      icon: '⚡',
      example: 'Panel upgrade and home electrical inspection needed'
    },
    {
      name: 'Plumbers',
      description: 'Plumbing repairs, installations, and emergency services',
      icon: '🔧',
      example: 'Bathroom renovation plumbing, 3-piece installation'
    },
    {
      name: 'HVAC Specialists',
      description: 'Heating, cooling, and ventilation system services',
      icon: '❄️',
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
            <nav className="flex items-center space-x-6">
              <Link to="/login" className="text-gray-600 hover:text-emerald-600 font-medium">
                Sign In
              </Link>
              <Link 
                to="/professional/signup" 
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
              >
                Join as Professional
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              100% FREE • NO CREDIT CARD REQUIRED
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Connect. Serve. <span className="text-emerald-600">Grow.</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              The platform where quality professionals meet customers in need. 
              Get verified leads or find trusted experts — all in one place.
            </p>

            {/* Dual CTA Tabs */}
            <div className="bg-white rounded-2xl p-8 shadow-xl max-w-2xl mx-auto">
              <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
                <button
                  onClick={() => setActiveTab('professionals')}
                  className={`flex-1 py-3 px-6 rounded-lg font-medium transition ${
                    activeTab === 'professionals'
                      ? 'bg-emerald-600 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  I'm a Professional
                </button>
                <button
                  onClick={() => setActiveTab('customers')}
                  className={`flex-1 py-3 px-6 rounded-lg font-medium transition ${
                    activeTab === 'customers'
                      ? 'bg-emerald-600 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  I Need a Service
                </button>
              </div>

              {activeTab === 'professionals' ? (
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Get Quality Leads. Grow Your Business.
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Connect with verified customers actively seeking your services in your area — in real time.
                  </p>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-center text-sm text-gray-600">
                      <span className="text-green-500 mr-2">✓</span>
                      No payment required
                    </div>
                    <div className="flex items-center justify-center text-sm text-gray-600">
                      <span className="text-green-500 mr-2">✓</span>
                      Takes 2 minutes
                    </div>
                    <div className="flex items-center justify-center text-sm text-gray-600">
                      <span className="text-green-500 mr-2">✓</span>
                      Start getting local leads
                    </div>
                  </div>
                  <Link
                    to="/professional/signup"
                    className="bg-emerald-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-emerald-700 transition inline-block"
                  >
                    Create Free Profile
                  </Link>
                </div>
              ) : (
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Find Trusted Professionals. Get Things Done.
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Get connected with verified, local professionals for your home and business needs.
                  </p>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-center text-sm text-gray-600">
                      <span className="text-green-500 mr-2">✓</span>
                      Verified professionals
                    </div>
                    <div className="flex items-center justify-center text-sm text-gray-600">
                      <span className="text-green-500 mr-2">✓</span>
                      Quick response times
                    </div>
                    <div className="flex items-center justify-center text-sm text-gray-600">
                      <span className="text-green-500 mr-2">✓</span>
                      Quality guaranteed
                    </div>
                  </div>
                  <Link
                    to="/customer/request"
                    className="bg-orange-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-orange-600 transition inline-block"
                  >
                    Get Service Quotes
                  </Link>
                </div>
              )}
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex items-center justify-center space-x-8 text-gray-500">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">2,500+</div>
                <div className="text-sm">Active Professionals</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">4.8/5</div>
                <div className="text-sm">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">3x</div>
                <div className="text-sm">More Quality Leads</div>
              </div>
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

      {/* Service Categories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Perfect for Service Professionals</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of successful professionals already growing their business
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceCategories.map((category, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-4">{category.icon}</span>
                  <h3 className="text-xl font-bold text-gray-900">{category.name}</h3>
                </div>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    <strong>Example lead:</strong> "{category.example}"
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/professional/signup"
              className="bg-emerald-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-emerald-700 transition inline-block"
            >
              View Sample Leads • Create Free Profile
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Get Started in 3 Simple Steps</h2>
            <p className="text-xl text-gray-600">
              From signup to verified customer leads — in under 5 minutes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-emerald-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Create Your Free Profile</h3>
              <p className="text-gray-600 mb-6">
                Add your business info, service areas, and what you offer. No credit card needed.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-emerald-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Browse Real Leads</h3>
              <p className="text-gray-600 mb-6">
                See actual customer requests filtered by your services, location, and preferences.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-emerald-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Start Connecting</h3>
              <p className="text-gray-600 mb-6">
                Receive verified leads by SMS, email, and dashboard. Only pay when you're ready to scale.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              to="/professional/signup"
              className="bg-emerald-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-emerald-700 transition inline-block"
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
              className="bg-white text-emerald-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition"
            >
              Create Free Profile
            </Link>
            <Link
              to="/customer/request"
              className="border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-emerald-600 transition"
            >
              Find Professionals
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