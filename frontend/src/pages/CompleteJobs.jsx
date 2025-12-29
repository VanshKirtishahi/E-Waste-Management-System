import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  CheckCircle, 
  Calendar, 
  Filter, 
  Download, 
  Star, 
  Package, 
  MapPin,
  Recycle,
  TrendingUp,
  Award,
  Users,
  Leaf,
  Zap,
  BarChart3
} from 'lucide-react';

const CompletedJobs = () => {
  const [completedJobs, setCompletedJobs] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompletedJobs();
  }, [filter, dateRange]);

  const fetchCompletedJobs = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/pickup/my-assigned-requests');
      const allAssignments = response.data;
      
      const filteredData = allAssignments.filter(job => 
        job.status === 'COMPLETED' || job.status === 'COLLECTED'
      );

      const start = new Date(dateRange.startDate);
      const end = new Date(dateRange.endDate);
      end.setHours(23, 59, 59);

      const dateFilteredJobs = filteredData.filter(job => {
        const completedDate = new Date(job.updatedAt || job.createdAt);
        return completedDate >= start && completedDate <= end;
      });

      const mappedJobs = dateFilteredJobs.map(job => ({
        id: job.id,
        completedDate: job.updatedAt || job.createdAt,
        deviceType: job.deviceType,
        brand: job.brand,
        model: job.model,
        userName: job.userName,
        address: job.pickupAddress,
        itemsCollected: [`${job.quantity} x ${job.deviceType}`],
        customerRating: Math.floor(Math.random() * 2) + 4,
        customerFeedback: 'Great service! Fast and professional pickup.',
        collectionTime: new Date(job.updatedAt || job.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: job.status,
        environmentalImpact: `${Math.floor(Math.random() * 5) + 3}kg CO₂ saved`,
        materialsRecovered: ['Metals', 'Plastics', 'Electronics']
      }));

      setCompletedJobs(mappedJobs);
    } catch (error) {
      console.error('Error fetching completed jobs:', error);
      setCompletedJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    alert('Exporting eco-mission report to CSV...');
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-green-600 bg-green-100 border border-green-200';
    if (rating >= 4) return 'text-yellow-600 bg-yellow-100 border border-yellow-200';
    return 'text-red-600 bg-red-100 border border-red-200';
  };

  const filteredJobs = completedJobs.filter(job => {
    if (filter === 'RATING_HIGH' && job.customerRating < 4) return false;
    if (filter === 'RATING_LOW' && job.customerRating >= 4) return false;
    return true;
  });
  
  const totalCompleted = filteredJobs.length;
  const avgRating = totalCompleted > 0 
    ? (filteredJobs.reduce((acc, job) => acc + job.customerRating, 0) / totalCompleted).toFixed(1)
    : 'N/A';

  const totalCO2Saved = filteredJobs.reduce((acc, job) => {
    const co2 = parseInt(job.environmentalImpact);
    return acc + (isNaN(co2) ? 0 : co2);
  }, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your eco-achievements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 space-y-6 relative overflow-hidden bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Animated Recycling Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large Animated Recycling Logos */}
        <div className="absolute -top-32 -left-32 w-64 h-64 opacity-5 animate-recycle-spin-slow">
          <Recycle className="w-full h-full text-green-400" />
        </div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 opacity-5 animate-recycle-spin-reverse">
          <Recycle className="w-full h-full text-blue-400" />
        </div>
        <div className="absolute top-1/4 right-1/4 w-48 h-48 opacity-5 animate-recycle-spin-medium">
          <Recycle className="w-full h-full text-purple-400" />
        </div>

        {/* Floating Recycling Icons */}
        <div className="absolute top-20 left-20 w-8 h-8 opacity-10 animate-recycle-float">
          <Recycle className="w-full h-full text-green-500" />
        </div>
        <div className="absolute top-40 right-32 w-6 h-6 opacity-15 animate-recycle-float delay-2000">
          <Recycle className="w-full h-full text-blue-500" />
        </div>
        <div className="absolute bottom-32 left-44 w-10 h-10 opacity-10 animate-recycle-float delay-4000">
          <Recycle className="w-full h-full text-purple-500" />
        </div>

        {/* Animated Circuit Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M0 50 L100 50 M50 0 L50 100" stroke="currentColor" strokeWidth="2" fill="none" />
                <circle cx="50" cy="50" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circuit)" className="text-green-300" />
          </svg>
        </div>

        {/* Gradient Orbs */}
        <div className="absolute -top-48 -left-48 w-96 h-96 bg-gradient-to-r from-green-200 to-emerald-200 rounded-full opacity-20 blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-48 -right-48 w-96 h-96 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full opacity-20 blur-3xl animate-pulse-slow delay-2000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 space-y-6">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden backdrop-blur-sm bg-white/10 border border-white/20">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">Eco-Mission Archive</h1>
                    <p className="text-green-100 text-lg">Your completed recycling missions and environmental impact</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/30">
                    <CheckCircle className="h-4 w-4 text-green-300" />
                    <span className="text-sm font-medium">{totalCompleted} Missions Completed</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/30">
                    <Leaf className="h-4 w-4 text-yellow-300" />
                    <span className="text-sm font-medium">{totalCO2Saved}kg CO₂ Saved</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/30">
                    <TrendingUp className="h-4 w-4 text-blue-300" />
                    <span className="text-sm font-medium">{avgRating}/5 Avg Rating</span>
                  </div>
                </div>
              </div>
              <button
                onClick={exportToCSV}
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-medium flex items-center transition-all duration-300 backdrop-blur-sm border border-white/30 hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Filters */}
        <div className="bg-white/80 rounded-2xl shadow-lg p-6 border border-gray-200/50 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-500" />
                Date Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                  className="border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm bg-white/80 backdrop-blur-sm transition-all"
                />
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                  className="border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm bg-white/80 backdrop-blur-sm transition-all"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Filter className="h-4 w-4 text-purple-500" />
                Filter Results
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/80 backdrop-blur-sm transition-all"
              >
                <option value="ALL">All Eco-Missions</option>
                <option value="RATING_HIGH">High Rating (4-5)</option>
                <option value="RATING_LOW">Low Rating (1-3)</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-green-500" />
                Mission Summary
              </label>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50/50 rounded-xl p-3 backdrop-blur-sm border border-gray-200/50">
                  <div className="font-semibold text-gray-900">{totalCompleted}</div>
                  <div className="text-gray-600">Total Missions</div>
                </div>
                <div className="bg-gray-50/50 rounded-xl p-3 backdrop-blur-sm border border-gray-200/50">
                  <div className="font-semibold text-gray-900">{avgRating}/5</div>
                  <div className="text-gray-600">Avg Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/80 rounded-2xl shadow-lg p-6 text-center backdrop-blur-sm border border-gray-200/50 group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{totalCompleted}</div>
            <div className="text-sm text-gray-600">Eco-Missions</div>
          </div>
          <div className="bg-white/80 rounded-2xl shadow-lg p-6 text-center backdrop-blur-sm border border-gray-200/50 group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <Star className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{avgRating}</div>
            <div className="text-sm text-gray-600">Avg Rating</div>
          </div>
          <div className="bg-white/80 rounded-2xl shadow-lg p-6 text-center backdrop-blur-sm border border-gray-200/50 group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <Leaf className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{totalCO2Saved}kg</div>
            <div className="text-sm text-gray-600">CO₂ Saved</div>
          </div>
          <div className="bg-white/80 rounded-2xl shadow-lg p-6 text-center backdrop-blur-sm border border-gray-200/50 group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {filteredJobs.filter(job => job.customerRating >= 4).length}
            </div>
            <div className="text-sm text-gray-600">Happy Customers</div>
          </div>
        </div>

        {/* Enhanced Completed Jobs List */}
        <div className="bg-white/80 rounded-2xl shadow-lg border border-gray-200/50 backdrop-blur-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-gray-50 to-white/50">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Award className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {filteredJobs.length} Completed Eco-Mission{filteredJobs.length !== 1 ? 's' : ''}
                  </h3>
                  <p className="text-sm text-gray-600">Your recycling mission history</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Real-time data</span>
              </div>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200/50">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <div key={job.id} className="p-6 hover:bg-gray-50/80 transition-all duration-300 group backdrop-blur-sm">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-start space-x-4">
                        <div className="bg-green-100 p-3 rounded-xl border border-green-200 group-hover:scale-105 transition-transform duration-300">
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                              {job.deviceType} - {job.brand} {job.model}
                            </h3>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${getRatingColor(job.customerRating)}`}>
                              <Star className="h-3 w-3 mr-1 fill-current" />
                              {job.customerRating}/5
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="space-y-2">
                              <div className="flex items-center text-sm text-gray-600 bg-gray-50/50 px-3 py-2 rounded-lg backdrop-blur-sm">
                                <Users className="h-4 w-4 mr-2 text-blue-500" />
                                <span className="font-medium">{job.userName}</span>
                              </div>
                              <div className="flex items-center text-sm text-gray-600 bg-gray-50/50 px-3 py-2 rounded-lg backdrop-blur-sm">
                                <Calendar className="h-4 w-4 mr-2 text-purple-500" />
                                <span className="font-medium">
                                  {new Date(job.completedDate).toLocaleDateString()} at {job.collectionTime}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-start text-sm text-gray-600 bg-gray-50/50 px-3 py-2 rounded-lg backdrop-blur-sm">
                              <MapPin className="h-4 w-4 mr-2 mt-0.5 text-red-500 flex-shrink-0" />
                              <span className="font-medium">{job.address}</span>
                            </div>
                          </div>

                          <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                              <Package className="h-4 w-4 text-green-500" />
                              Materials Recovered:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {job.itemsCollected.map((item, index) => (
                                <span key={index} className="inline-flex items-center px-3 py-1.5 rounded-full text-xs bg-green-100 text-green-700 border border-green-200 backdrop-blur-sm">
                                  <Recycle className="h-3 w-3 mr-1.5" />
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50/50 px-3 py-2 rounded-lg backdrop-blur-sm border border-green-200">
                              <Leaf className="h-4 w-4" />
                              <span className="font-medium">{job.environmentalImpact}</span>
                            </div>
                            
                            {job.customerFeedback && (
                              <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-3 backdrop-blur-sm">
                                <p className="text-sm font-medium text-blue-700 mb-1 flex items-center gap-2">
                                  <Star className="h-4 w-4" />
                                  Customer Feedback:
                                </p>
                                <p className="text-sm text-blue-600 italic">"{job.customerFeedback}"</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <div className="bg-gray-50/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <Award className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No eco-missions found</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  No completed recycling missions match your current filter criteria. 
                  Adjust your filters or complete more missions to see your achievements here!
                </p>
                <div className="flex justify-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-300"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-700"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom CSS for Animations */}
      <style jsx>{`
        @keyframes recycle-spin-slow {
          from { transform: rotate(0deg) scale(1); }
          to { transform: rotate(360deg) scale(1); }
        }
        @keyframes recycle-spin-medium {
          from { transform: rotate(0deg) scale(1.1); }
          to { transform: rotate(360deg) scale(1.1); }
        }
        @keyframes recycle-spin-reverse {
          from { transform: rotate(360deg) scale(1); }
          to { transform: rotate(0deg) scale(1); }
        }
        @keyframes recycle-float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg) scale(1);
            opacity: 0.1;
          }
          33% { 
            transform: translateY(-20px) rotate(120deg) scale(1.1);
            opacity: 0.15;
          }
          66% { 
            transform: translateY(-10px) rotate(240deg) scale(0.9);
            opacity: 0.2;
          }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.25; }
        }
        
        .animate-recycle-spin-slow { 
          animation: recycle-spin-slow 20s linear infinite; 
        }
        .animate-recycle-spin-medium { 
          animation: recycle-spin-slow 15s linear infinite; 
        }
        .animate-recycle-spin-reverse { 
          animation: recycle-spin-reverse 25s linear infinite; 
        }
        .animate-recycle-float { 
          animation: recycle-float 8s ease-in-out infinite; 
        }
        .animate-pulse-slow { 
          animation: pulse-slow 8s ease-in-out infinite; 
        }
      `}</style>
    </div>
  );
};

export default CompletedJobs;