import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const FullPricing = () => {
  const { user, logout } = useAuth();

  const handleSignOut = () => {
    logout();
    window.location.href = '/';
  };
  const allPackages = [
    { 
      name: "Tester Pack", 
      credits: 3, 
      price: 150, 
      description: "Perfect for testing the platform", 
      popular: false,
      stripeUrl: "https://buy.stripe.com/7sY7sEcN8ghrcDl5W3gUM07",
      features: ["3 verified leads", "Email & SMS alerts", "Basic support", "Lead replacement guarantee"]
    },
    { 
      name: "777 Pack", 
      credits: 25, 
      price: 499, 
      description: "Great for small businesses", 
      popular: false,
      stripeUrl: "https://buy.stripe.com/7sYfZacN82qBcDl707gUM02",
      features: ["25 verified leads", "Priority notifications", "Email support", "Lead replacement guarantee"]
    },
    { 
      name: "Elite Pack", 
      credits: 20, 
      price: 1500, 
      description: "20 Exclusive leads", 
      popular: true,
      stripeUrl: "https://buy.stripe.com/4gM7sEbJ48OZcDl2JRgUM06",
      features: ["20 premium leads", "Instant notifications", "Phone support", "100% replacement guarantee", "Priority matching"]
    },
    { 
      name: "Pro Pack", 
      credits: 30, 
      price: 2000, 
      description: "30 Exclusive leads", 
      popular: false,
      stripeUrl: "https://buy.stripe.com/9B6aEQ5kG7KVavd0BJgUM03",
      features: ["30 premium leads", "Instant notifications", "Phone support", "Lead replacement guarantee", "Advanced filtering"]
    },
    { 
      name: "Premium Deluxe", 
      credits: 100, 
      price: 6000, 
      description: "For established businesses", 
      popular: false,
      stripeUrl: "https://buy.stripe.com/cNi9AM28ughrcDl4RZgUM01",
      features: ["100 premium leads", "Real-time notifications", "Dedicated support", "Lead replacement guarantee", "Custom targeting", "Account manager"]
    },
    { 
      name: "Enterprise Deluxe", 
      credits: 200, 
      price: 13250, 
      description: "200 Exclusive leads", 
      popular: false,
      stripeUrl: "https://buy.stripe.com/3cIcMYdRce9javdeszgUM04",
      features: ["200 premium leads", "Real-time notifications", "24/7 dedicated support", "Lead replacement guarantee", "Custom targeting", "Dedicated account manager", "API access"]
    }
  ];

  return (
    <div id="top" className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              {user ? (
                <Link 
                  to={user.user_type === 'admin' ? '/admin' : '/professional/dashboard'} 
                  className="text-xl sm:text-2xl font-bold text-emerald-600"
                >
                  Niwi
                </Link>
              ) : (
                <Link to="/" className="text-xl sm:text-2xl font-bold text-emerald-600">Niwi</Link>
              )}
            </div>
            <nav className="flex items-center space-x-2 sm:space-x-6">
              {user ? (
                <>
                  <span className="text-xs sm:text-sm text-gray-700">
                    Welcome, {user.first_name}
                  </span>
                  <Link 
                    to={user.user_type === 'admin' ? '/admin' : '/professional/dashboard'}
                    className="text-gray-600 hover:text-emerald-600 font-medium text-xs sm:text-sm"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="text-gray-600 hover:text-red-600 font-medium text-xs sm:text-sm"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-600 hover:text-emerald-600 font-medium text-sm sm:text-base">
                    Sign In
                  </Link>
                  <Link 
                    to="/professional/signup" 
                    className="bg-emerald-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-emerald-700 transition text-xs sm:text-sm font-medium"
                  >
                    Join as Professional
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-8 sm:py-12 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Simple, Transparent <span className="text-emerald-600">Pricing</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Choose the lead package that fits your business needs. Only pay for the leads you want to pursue.
            </p>
          </div>
        </div>
      </section>

      {/* All Packages */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {allPackages.map((pkg, index) => (
              <div 
                key={index}
                className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:shadow-lg cursor-pointer ${
                  pkg.popular 
                    ? 'bg-emerald-50 border-2 border-emerald-500 transform scale-100 sm:scale-105' 
                    : 'bg-white border-2 border-gray-200 hover:border-emerald-300'
                }`}
              >
                {pkg.popular && (
                  <div className="bg-emerald-500 text-white text-xs font-bold px-2 sm:px-3 py-1 rounded-full inline-block mb-3 sm:mb-4">
                    MOST POPULAR
                  </div>
                )}
                
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">{pkg.description}</p>
                
                <div className="mb-4 sm:mb-6">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    {pkg.credits}
                    <span className="text-sm sm:text-lg text-gray-600 font-normal"> leads</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-semibold text-emerald-600">
                    ${pkg.price.toLocaleString()}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500">
                    ${(pkg.price / pkg.credits).toFixed(0)} per lead
                  </div>
                </div>

                {/* Features List */}
                <div className="mb-4 sm:mb-6">
                  <ul className="space-y-1 sm:space-y-2">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-xs sm:text-sm text-gray-600">
                        <span className="text-green-500 mr-2 text-sm sm:text-base">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href={pkg.stripeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-medium transition-all duration-300 text-center block text-xs sm:text-sm ${
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

          {/* FAQ Section */}
          <div className="mt-12 sm:mt-16 lg:mt-20">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto">
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3">How do leads work?</h3>
                <p className="text-sm sm:text-base text-gray-600">Each lead allows you to unlock one verified lead with full contact details. Leads never expire and you only pay for leads you choose to pursue.</p>
              </div>
              
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3">What if a lead isn't good quality?</h3>
                <p className="text-sm sm:text-base text-gray-600">We offer a 100% replacement guarantee. If a lead doesn't meet our quality standards, we'll replace it at no additional cost.</p>
              </div>
              
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3">Can I upgrade or downgrade?</h3>
                <p className="text-sm sm:text-base text-gray-600">Yes! You can purchase additional leads anytime. There are no long-term contracts or commitments.</p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Do leads expire?</h3>
                <p className="text-gray-600">No, your leads never expire. Use them at your own pace as quality leads become available in your area.</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-20 text-center">
            <div className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-3xl p-8 sm:p-12 text-white">
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-xl mb-8 text-emerald-100">
                Join thousands of professionals already growing their business with Niwi
              </p>
              <Link
                to="/professional/signup"
                className="bg-white text-emerald-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all duration-300 inline-block transform hover:scale-105"
              >
                Create Your Free Profile
              </Link>
            </div>
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

export default FullPricing;