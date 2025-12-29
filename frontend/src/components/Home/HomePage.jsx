import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import GeminiChatBot from '../GeminiChatBot';
import {
  Trash2,
  Recycle,
  Leaf,
  Users,
  Shield,
  Truck,
  BarChart3,
  Award,
  Clock,
  CheckCircle,
  ArrowRight,
  Play,
  Star,
  Globe,
  Battery,
  Cpu,
  Smartphone,
  Laptop,
  Monitor,
  Zap
} from 'lucide-react';

const HomePage = () => {
  const { user } = useAuth();

  // Helper to determine dashboard path based on role
  const getDashboardPath = () => {
    if (!user) return '/login';

    if (user.role === 'ROLE_ADMIN' || user.role === 'ADMIN') {
      return '/admin';
    }

    if (user.role === 'ROLE_PICKUP_PERSON' || user.role === 'PICKUP_PERSON') {
      return '/pickup-person';
    }

    return '/dashboard';
  };

  // Statistics data
  const stats = [
    { number: '10K+', label: 'Devices Recycled', icon: Trash2 },
    { number: '500+', label: 'Happy Users', icon: Users },
    { number: '25+', label: 'Tons CO₂ Saved', icon: Leaf },
    { number: '95%', label: 'Satisfaction Rate', icon: Star }
  ];

  // Features data
  const features = [
    {
      icon: Recycle,
      title: 'Easy E-Waste Submission',
      description: 'Submit your electronic waste in just a few clicks with our intuitive platform.'
    },
    {
      icon: Truck,
      title: 'Scheduled Pickups',
      description: 'Get your e-waste picked up at your convenience with flexible scheduling.'
    },
    {
      icon: Shield,
      title: 'Secure Data Handling',
      description: 'Your personal information and data are protected with enterprise-grade security.'
    },
    {
      icon: Award,
      title: 'Earn Certificates',
      description: 'Get recognized for your environmental contributions with appreciation certificates.'
    },
    {
      icon: BarChart3,
      title: 'Track Your Impact',
      description: 'Monitor your environmental impact with detailed analytics and reports.'
    },
    {
      icon: Globe,
      title: 'Environmental Impact',
      description: 'Contribute to a greener planet by properly disposing of electronic waste.'
    }
  ];

  // How it works steps
  const steps = [
    {
      step: '01',
      icon: Users,
      title: 'Create Account',
      description: 'Sign up and complete your profile with pickup address details.'
    },
    {
      step: '02',
      icon: Trash2,
      title: 'Submit Request',
      description: 'Fill out the e-waste submission form with device details and photos.'
    },
    {
      step: '03',
      icon: Clock,
      title: 'Wait for Approval',
      description: 'Our team reviews your request and schedules pickup within 24 hours.'
    },
    {
      step: '04',
      icon: Truck,
      title: 'Get Pickup',
      description: 'Our certified pickup personnel collect your e-waste at scheduled time.'
    },
    {
      step: '05',
      icon: CheckCircle,
      title: 'Track Progress',
      description: 'Monitor your request status and environmental impact in real-time.'
    },
    {
      step: '06',
      icon: Award,
      title: 'Get Certificate',
      description: 'Receive appreciation certificate after successful recycling.'
    }
  ];

  // Environmental impact data
  const environmentalImpact = [
    {
      metric: 'CO₂ Emissions',
      value: '2.5 kg',
      perDevice: 'per device recycled',
      description: 'Reduction in carbon footprint',
      color: 'from-green-500 to-emerald-600'
    },
    {
      metric: 'Toxic Waste',
      value: '0.8 kg',
      perDevice: 'prevented from landfills',
      description: 'Hazardous materials properly handled',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      metric: 'Energy Saved',
      value: '15 kWh',
      perDevice: 'through material recovery',
      description: 'Equivalent to 10+ hours of AC usage',
      color: 'from-orange-500 to-red-600'
    },
    {
      metric: 'Raw Materials',
      value: '90%',
      perDevice: 'recovered and reused',
      description: 'Metals, plastics, and components',
      color: 'from-purple-500 to-pink-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-green-500 to-blue-500 p-2 rounded-lg">
                  <Trash2 className="h-6 w-6 text-white" />
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900">EcoWaste</span>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-green-600 transition-colors duration-200">Features</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-green-600 transition-colors duration-200">How It Works</a>
              <a href="#impact" className="text-gray-700 hover:text-green-600 transition-colors duration-200">Impact</a>
              <a href="#about" className="text-gray-700 hover:text-green-600 transition-colors duration-200">About</a>
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <Link
                  to={getDashboardPath()}
                  className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:from-green-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:from-green-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Background Image and Foreground Animations */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80")',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/80 via-blue-900/60 to-purple-900/70"></div>
        </div>
        
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>

        {/* Prominent Foreground Animations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Large Animated Recycling Symbol */}
          <div className="absolute top-20 left-10 text-green-400/30 animate-spin-slow">
            <Recycle className="w-32 h-32" />
          </div>
          
          {/* Animated Floating Devices */}
          <div className="absolute top-40 right-20 text-blue-400/40 animate-bounce-slow">
            <Smartphone className="w-16 h-16" />
          </div>
          
          <div className="absolute bottom-40 left-20 text-purple-400/40 animate-float-medium">
            <Laptop className="w-20 h-20" />
          </div>
          
          <div className="absolute top-1/3 left-1/4 text-yellow-400/30 animate-pulse-slow">
            <Monitor className="w-24 h-24" />
          </div>
          
          <div className="absolute bottom-32 right-32 text-red-400/40 animate-bounce delay-1000">
            <Cpu className="w-14 h-14" />
          </div>

          {/* Animated Energy Waves */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-64 h-64 border-4 border-green-400/20 rounded-full animate-ping-slow"></div>
            <div className="w-96 h-96 border-4 border-blue-400/20 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-ping-slower delay-1000"></div>
            <div className="w-128 h-128 border-4 border-purple-400/20 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-ping-slowest delay-2000"></div>
          </div>

          {/* Floating Particles */}
          <div className="absolute top-1/4 right-1/3 w-6 h-6 bg-green-400/50 rounded-full animate-float-fast"></div>
          <div className="absolute top-2/3 left-1/3 w-4 h-4 bg-blue-400/60 rounded-full animate-float-medium delay-500"></div>
          <div className="absolute bottom-1/4 right-1/4 w-5 h-5 bg-purple-400/50 rounded-full animate-float-slow delay-1000"></div>
          <div className="absolute top-1/2 left-1/5 w-3 h-3 bg-yellow-400/60 rounded-full animate-float-fast delay-1500"></div>

          {/* Circuit Board Animation */}
          <div className="absolute bottom-20 left-10 text-white/10 animate-pulse">
            <svg className="w-24 h-24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2 2v20h20V2H2zm18 18H4V4h16v16zM8 8h8v2H8V8zm0 4h8v2H8v-2zm0 4h8v2H8v-2z"/>
            </svg>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 w-full">
          {/* Main Content with Enhanced Animations */}
          <div className="space-y-8">
            {/* Animated Badge */}
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full border border-white/30 animate-pulse">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-ping"></div>
              <span className="text-sm font-medium">Join 500+ Eco-Conscious Users</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
              Responsible
              <span className="block bg-gradient-to-r from-green-300 via-blue-300 to-purple-300 bg-clip-text text-transparent bg-size-200 animate-gradient">
                E-Waste Management
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed">
              Transform your electronic waste into environmental impact. Join the movement towards a sustainable future with our smart recycling platform.
            </p>

            {/* Animated CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              {user ? (
                <Link
                  to="/new-request"
                  className="group bg-gradient-to-r from-green-500 to-blue-500 text-white px-10 py-5 rounded-2xl font-semibold text-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 hover:scale-105 flex items-center animate-pulse"
                >
                  <span className="relative z-10">Submit E-Waste</span>
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-400 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg -z-10"></div>
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="group bg-gradient-to-r from-green-500 to-blue-500 text-white px-10 py-5 rounded-2xl font-semibold text-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 hover:scale-105 flex items-center relative overflow-hidden"
                  >
                    <span className="relative z-10">Get Started Free</span>
                    <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-400 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg -z-10"></div>
                    <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </Link>
                  <Link
                    to="/login"
                    className="group border-2 border-white/50 text-white px-10 py-5 rounded-2xl font-semibold text-lg hover:border-white hover:bg-white/10 transition-all duration-300 backdrop-blur-sm flex items-center hover:scale-105"
                  >
                    <Play className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
                    Watch Demo
                  </Link>
                </>
              )}
            </div>

            {/* Animated Stats Preview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div
                    key={index}
                    className="group bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-105 hover:-translate-y-2 animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <IconComponent className="h-10 w-10 text-green-300 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                    <div className="text-3xl font-bold text-white mb-1 group-hover:text-green-300 transition-colors">{stat.number}</div>
                    <div className="text-sm text-white/80 group-hover:text-white transition-colors">{stat.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
              <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Custom CSS for Enhanced Animations */}
        <style>{`
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes float-slow {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }
          @keyframes float-medium {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-15px) rotate(90deg); }
          }
          @keyframes float-fast {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          @keyframes bounce-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-25px); }
          }
          @keyframes ping-slow {
            0% { transform: scale(1); opacity: 1; }
            75%, 100% { transform: scale(3); opacity: 0; }
          }
          @keyframes ping-slower {
            0% { transform: scale(1); opacity: 1; }
            75%, 100% { transform: scale(4); opacity: 0; }
          }
          @keyframes ping-slowest {
            0% { transform: scale(1); opacity: 1; }
            75%, 100% { transform: scale(5); opacity: 0; }
          }
          @keyframes pulse-slow {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.6; }
          }
          .animate-spin-slow {
            animation: spin-slow 20s linear infinite;
          }
          .animate-float-slow {
            animation: float-slow 6s ease-in-out infinite;
          }
          .animate-float-medium {
            animation: float-medium 4s ease-in-out infinite;
          }
          .animate-float-fast {
            animation: float-fast 2s ease-in-out infinite;
          }
          .animate-bounce-slow {
            animation: bounce-slow 3s ease-in-out infinite;
          }
          .animate-ping-slow {
            animation: ping-slow 4s cubic-bezier(0, 0, 0.2, 1) infinite;
          }
          .animate-ping-slower {
            animation: ping-slower 6s cubic-bezier(0, 0, 0.2, 1) infinite;
          }
          .animate-ping-slowest {
            animation: ping-slowest 8s cubic-bezier(0, 0, 0.2, 1) infinite;
          }
          .animate-pulse-slow {
            animation: pulse-slow 3s ease-in-out infinite;
          }
          .w-128 {
            width: 32rem;
          }
          .h-128 {
            height: 32rem;
          }
        `}</style>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose EcoWaste?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make e-waste management simple, secure, and rewarding for everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-green-200 hover:-translate-y-2"
                >
                  <div className="bg-gradient-to-r from-green-500 to-blue-500 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple steps to responsibly dispose of your electronic waste and make a positive impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="relative group">
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-green-200 h-full">
                    <div className="flex items-center justify-between mb-6">
                      <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg">
                        {step.step}
                      </div>
                      <div className="bg-green-100 w-12 h-12 rounded-xl flex items-center justify-center">
                        <IconComponent className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-green-500 to-blue-500 transform -translate-y-1/2 z-10"></div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center mt-16">
            <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Make a Difference?
              </h3>
              <p className="text-gray-600 mb-6">
                Join thousands of environmentally conscious users and start your e-waste recycling journey today.
              </p>
              {user ? (
                <Link
                  to="/new-request"
                  className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center"
                >
                  Submit Your First Device
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center"
                >
                  Create Free Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Environmental Impact Section */}
      <section id="impact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Environmental Impact
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Every device recycled makes a significant difference to our planet.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {environmentalImpact.map((impact, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg border border-gray-100 text-center group hover:shadow-xl transition-all duration-300"
              >
                <div className={`bg-gradient-to-r ${impact.color} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Battery className="h-8 w-8 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {impact.value}
                </div>
                <div className="text-lg font-semibold text-gray-800 mb-1">
                  {impact.metric}
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  {impact.perDevice}
                </div>
                <div className="text-xs text-gray-500">
                  {impact.description}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-8 text-white">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold mb-4">Collective Impact</h3>
              <p className="text-green-100 text-lg">
                Together, we've made a tremendous environmental impact
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold">25+</div>
                <div className="text-green-100">Tons CO₂ Saved</div>
              </div>
              <div>
                <div className="text-3xl font-bold">8+</div>
                <div className="text-green-100">Tons Toxic Waste</div>
              </div>
              <div>
                <div className="text-3xl font-bold">150K+</div>
                <div className="text-green-100">kWh Energy Saved</div>
              </div>
              <div>
                <div className="text-3xl font-bold">10K+</div>
                <div className="text-green-100">Devices Recycled</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Start Your Eco-Friendly Journey Today
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join the movement towards sustainable e-waste management and be part of the solution for a cleaner planet.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {user ? (
              <Link
                to="/new-request"
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 flex items-center"
              >
                Submit E-Waste Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 flex items-center"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/login"
                  className="border-2 border-gray-400 text-gray-300 px-8 py-4 rounded-xl font-semibold text-lg hover:border-white hover:text-white transition-all duration-200"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
          <p className="text-gray-400 mt-6 text-sm">
            No credit card required • Free forever for individual users
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-green-500 to-blue-500 p-2 rounded-lg">
                  <Trash2 className="h-6 w-6 text-white" />
                </div>
                <span className="ml-2 text-xl font-bold">EcoWaste</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Making e-waste management simple, accessible, and rewarding for everyone.
                Join us in creating a sustainable future through responsible electronic waste disposal.
              </p>
              <div className="flex space-x-4">
                <div className="bg-gray-800 w-10 h-10 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <span className="font-semibold">f</span>
                </div>
                <div className="bg-gray-800 w-10 h-10 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <span className="font-semibold">t</span>
                </div>
                <div className="bg-gray-800 w-10 h-10 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <span className="font-semibold">in</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#impact" className="hover:text-white transition-colors">Impact</a></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 EcoWaste. All rights reserved. Making the world greener, one device at a time.</p>
          </div>
        </div>
      </footer>

      {/* ChatBot Floating Button */}
      <GeminiChatBot /> 
    </div>
  );
};

export default HomePage;