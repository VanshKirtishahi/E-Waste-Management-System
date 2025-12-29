import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  TrendingUp, 
  Star, 
  Award, 
  Clock, 
  CheckCircle, 
  Calendar, 
  Download,
  Recycle,
  Leaf,
  Zap,
  Users,
  Trophy,
  Target,
  BarChart3
} from 'lucide-react';

const Performance = () => {
  const [performanceData, setPerformanceData] = useState(null);
  const [timeRange, setTimeRange] = useState('MONTH'); // WEEK, MONTH, QUARTER, YEAR

  useEffect(() => {
    fetchPerformanceData();
  }, [timeRange]);

  const fetchPerformanceData = async () => {
    try {
      const response = await axios.get('/api/pickup/my-assigned-requests');
      const requests = response.data;
      
      const completedRequests = requests.filter(r => r.status === 'COMPLETED' || r.status === 'COLLECTED');
      
      const totalJobs = requests.length;
      const completedJobs = completedRequests.length;
      const totalEarnings = completedJobs * 15;

      const mockData = {
        overallRating: 4.8,
        totalJobs: totalJobs,
        completedJobs: completedJobs,
        onTimeRate: 95,
        averageCollectionTime: '22 min',
        customerSatisfaction: 96,
        earnings: totalEarnings,
        environmentalImpact: completedJobs * 3.5, // kg CO₂ saved per job
        materialsRecovered: completedJobs * 2.1, // kg materials per job
        performanceTrend: [
          { month: 'Jan', jobs: 12, rating: 4.7, onTime: 92, co2: 42 },
          { month: 'Feb', jobs: 15, rating: 4.8, onTime: 94, co2: 52.5 },
          { month: 'Mar', jobs: 18, rating: 4.9, onTime: 96, co2: 63 },
          { month: 'Apr', jobs: 14, rating: 4.8, onTime: 95, co2: 49 },
          { month: 'May', jobs: 16, rating: 4.7, onTime: 93, co2: 56 },
          { month: 'Jun', jobs: 20, rating: 4.9, onTime: 97, co2: 70 }
        ],
        achievements: [
          { name: 'First 10 Eco-Missions', earned: completedJobs >= 10, date: '2024-03-15', icon: '🌱' },
          { name: 'Eco-Driver (50 Jobs)', earned: completedJobs >= 50, date: '2024-04-22', icon: '♻️' },
          { name: 'Top Performer (100 Jobs)', earned: completedJobs >= 100, date: '2024-05-30', icon: '🏆' },
          { name: 'Master Collector (500 Jobs)', earned: completedJobs >= 500, progress: completedJobs, icon: '⭐' },
          { name: 'Carbon Hero (1 Ton CO₂)', earned: completedJobs >= 286, progress: completedJobs, icon: '🌍' },
          { name: 'Material Recovery Expert', earned: completedJobs >= 200, progress: completedJobs, icon: '🔧' }
        ]
      };

      setPerformanceData(mockData);

    } catch (error) {
      console.error("Error fetching performance data:", error);
      setPerformanceData({
        overallRating: 'N/A', totalJobs: 0, completedJobs: 0, onTimeRate: 'N/A',
        averageCollectionTime: 'N/A', customerSatisfaction: 'N/A', earnings: 0,
        environmentalImpact: 0, materialsRecovered: 0,
        performanceTrend: [],
        achievements: []
      });
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPercentageColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!performanceData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your eco-performance...</p>
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
                    <Trophy className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">Eco-Performance</h1>
                    <p className="text-green-100 text-lg">Track your recycling mission metrics and achievements</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/30">
                    <Leaf className="h-4 w-4 text-green-300" />
                    <span className="text-sm font-medium">{performanceData.environmentalImpact}kg CO₂ Saved</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/30">
                    <Recycle className="h-4 w-4 text-blue-300" />
                    <span className="text-sm font-medium">{performanceData.materialsRecovered}kg Materials Recovered</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/30">
                    <Zap className="h-4 w-4 text-yellow-300" />
                    <span className="text-sm font-medium">{performanceData.completedJobs} Eco-Missions</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="bg-white/20 border border-white/30 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm"
                >
                  <option value="WEEK" className="text-gray-800">This Week</option>
                  <option value="MONTH" className="text-gray-800">This Month</option>
                  <option value="QUARTER" className="text-gray-800">This Quarter</option>
                  <option value="YEAR" className="text-gray-800">This Year</option>
                </select>
                <button className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-medium flex items-center transition-all duration-300 backdrop-blur-sm border border-white/30 hover:shadow-lg transform hover:-translate-y-0.5">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Star,
              label: 'Eco-Rating',
              value: `${performanceData.overallRating}/5`,
              color: 'yellow',
              description: 'Customer satisfaction'
            },
            {
              icon: CheckCircle,
              label: 'Completed Missions',
              value: performanceData.completedJobs,
              color: 'green',
              description: 'Successful pickups'
            },
            {
              icon: Clock,
              label: 'On-Time Rate',
              value: `${performanceData.onTimeRate}%`,
              color: 'blue',
              description: 'Timely collections'
            },
            {
              icon: TrendingUp,
              label: 'Est. Earnings',
              value: `$${performanceData.earnings}`,
              color: 'purple',
              description: 'Total income'
            }
          ].map((metric, index) => {
            const IconComponent = metric.icon;
            const colorClasses = {
              yellow: 'border-l-yellow-500 bg-gradient-to-r from-yellow-50/80 to-white/80',
              green: 'border-l-green-500 bg-gradient-to-r from-green-50/80 to-white/80',
              blue: 'border-l-blue-500 bg-gradient-to-r from-blue-50/80 to-white/80',
              purple: 'border-l-purple-500 bg-gradient-to-r from-purple-50/80 to-white/80'
            };

            return (
              <div
                key={index}
                className={`${colorClasses[metric.color]} rounded-2xl p-6 shadow-lg border border-gray-200/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className={`h-6 w-6 text-${metric.color}-500`} />
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full bg-${metric.color}-100 text-${metric.color}-800 backdrop-blur-sm`}>
                    +2.5%
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                  <p className="text-xs text-gray-500">{metric.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Enhanced Performance Trend */}
          <div className="bg-white/80 rounded-2xl shadow-lg p-6 border border-gray-200/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <BarChart3 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Eco-Performance Trend</h3>
                <p className="text-sm text-gray-600">Your mission progress and impact over time</p>
              </div>
            </div>
            <div className="space-y-4">
              {performanceData.performanceTrend.map((month, index) => (
                <div key={index} className="flex items-center justify-between group hover:bg-gray-50/50 p-2 rounded-lg transition-colors">
                  <span className="text-sm font-medium text-gray-600 w-20">{month.month}</span>
                  <div className="flex-1 mx-4">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="bg-gray-200 rounded-full h-2 flex-1">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-500" 
                          style={{ width: `${(month.jobs / 20) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 w-12 text-right">{month.jobs} jobs</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className={getRatingColor(month.rating)}>⭐ {month.rating}</span>
                      <span className="text-blue-500">⏱️ {month.onTime}%</span>
                      <span className="text-green-500">🌱 {month.co2}kg</span>
                    </div>
                  </div>
                </div>
              ))}
              {performanceData.performanceTrend.length === 0 && (
                <div className="text-center py-8 text-gray-500 bg-gray-50/50 rounded-lg backdrop-blur-sm">
                  No trend data available for this range.
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Achievements */}
          <div className="bg-white/80 rounded-2xl shadow-lg p-6 border border-gray-200/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Award className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Eco-Achievements</h3>
                <p className="text-sm text-gray-600">Your recycling mission milestones</p>
              </div>
            </div>
            <div className="space-y-3">
              {performanceData.achievements.map((achievement, index) => (
                <div 
                  key={index} 
                  className={`flex items-center justify-between p-4 border rounded-xl transition-all duration-300 group hover:shadow-md ${
                    achievement.earned 
                      ? 'border-green-200 bg-green-50/50' 
                      : 'border-gray-200 bg-gray-50/50'
                  } backdrop-blur-sm`}
                >
                  <div className="flex items-center">
                    <div className={`text-2xl mr-3 ${achievement.earned ? 'opacity-100' : 'opacity-40'}`}>
                      {achievement.icon}
                    </div>
                    <div>
                      <p className={`font-medium ${
                        achievement.earned ? 'text-green-900' : 'text-gray-900'
                      }`}>
                        {achievement.name}
                      </p>
                      {achievement.earned ? (
                        <p className="text-sm text-green-600 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Mission Accomplished!
                        </p>
                      ) : (
                        <p className="text-sm text-gray-500">
                          Progress: {achievement.progress}/
                          {achievement.name.includes('500') ? '500' : 
                           achievement.name.includes('286') ? '286' : 
                           achievement.name.includes('200') ? '200' : '50'}
                        </p>
                      )}
                    </div>
                  </div>
                  {achievement.earned ? (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border border-green-200">
                      Unlocked
                    </span>
                  ) : (
                    <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border border-gray-200">
                      In Progress
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Detailed Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/80 rounded-2xl shadow-lg p-6 border border-gray-200/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Eco-Performance Breakdown</h3>
                <p className="text-sm text-gray-600">Detailed mission analytics</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50/50 rounded-xl backdrop-blur-sm">
                <span className="text-sm text-gray-600 flex items-center gap-2">
                  <Users className="h-4 w-4 text-green-500" />
                  Customer Satisfaction
                </span>
                <span className={`font-medium ${getPercentageColor(performanceData.customerSatisfaction)}`}>
                  {performanceData.customerSatisfaction}%
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50/50 rounded-xl backdrop-blur-sm">
                <span className="text-sm text-gray-600 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  Mission Completion Rate
                </span>
                <span className="font-medium text-green-600">
                  {performanceData.totalJobs > 0 ? ((performanceData.completedJobs / performanceData.totalJobs) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50/50 rounded-xl backdrop-blur-sm">
                <span className="text-sm text-gray-600 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-purple-500" />
                  Total Eco-Earnings
                </span>
                <span className="font-medium text-gray-900">${performanceData.earnings}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50/50 rounded-xl backdrop-blur-sm">
                <span className="text-sm text-gray-600 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-orange-500" />
                  Avg Missions/Month
                </span>
                <span className="font-medium text-gray-900">
                  {performanceData.performanceTrend.length > 0 ? 
                    Math.round(performanceData.performanceTrend.reduce((acc, month) => acc + month.jobs, 0) / performanceData.performanceTrend.length) : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 rounded-2xl shadow-lg p-6 border border-gray-200/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Zap className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Eco-Performance Tips</h3>
                <p className="text-sm text-gray-600">Optimize your recycling missions</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start p-3 bg-green-50/50 rounded-xl backdrop-blur-sm border border-green-200">
                <TrendingUp className="h-4 w-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700">
                  Maintain your current on-time rate to qualify for <span className="font-semibold text-green-600">eco-bonus incentives</span>
                </p>
              </div>
              <div className="flex items-start p-3 bg-yellow-50/50 rounded-xl backdrop-blur-sm border border-yellow-200">
                <Star className="h-4 w-4 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700">
                  Collecting customer feedback can help improve your <span className="font-semibold text-yellow-600">service quality and ratings</span>
                </p>
              </div>
              <div className="flex items-start p-3 bg-blue-50/50 rounded-xl backdrop-blur-sm border border-blue-200">
                <Award className="h-4 w-4 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700">
                  You're on track to reach the <span className="font-semibold text-blue-600">500 missions milestone</span> - keep going!
                </p>
              </div>
              <div className="flex items-start p-3 bg-purple-50/50 rounded-xl backdrop-blur-sm border border-purple-200">
                <Leaf className="h-4 w-4 text-purple-500 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700">
                  Every mission saves approximately <span className="font-semibold text-purple-600">3.5kg of CO₂</span> - you're making a difference!
                </p>
              </div>
            </div>
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

export default Performance;