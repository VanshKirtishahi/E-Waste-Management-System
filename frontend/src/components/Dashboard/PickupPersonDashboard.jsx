import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { 
  Package, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  Star, 
  TrendingUp, 
  MapPin, 
  ArrowRight,
  AlertCircle,
  Navigation,
  Calendar,
  Zap,
  Users,
  Recycle
} from 'lucide-react';

const PickupPersonDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    assignedPickups: 0,
    completedToday: 0,
    pendingPickups: 0,
    totalEarnings: 0,
    rating: 0,
    onTimeRate: '0%'
  });
  const [recentAssignments, setRecentAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/pickup/my-assigned-requests');
      const requests = response.data;

      const pending = requests.filter(r => r.status === 'SCHEDULED' || r.status === 'PENDING').length;
      const completedTotal = requests.filter(r => r.status === 'COMPLETED' || r.status === 'COLLECTED').length;
      
      const todayStr = new Date().toDateString();
      const completedToday = requests.filter(r => {
        const isDone = r.status === 'COMPLETED' || r.status === 'COLLECTED';
        const dateToCheck = r.updatedAt ? new Date(r.updatedAt) : new Date(r.createdAt); 
        return isDone && dateToCheck.toDateString() === todayStr;
      }).length;

      const assignedPickups = requests.filter(r => r.status !== 'CANCELLED').length;
      const totalEarnings = completedTotal * 15;

      const ratedRequests = requests.filter(r => r.rating > 0);
      const avgRating = ratedRequests.length > 0 
        ? (ratedRequests.reduce((acc, r) => acc + r.rating, 0) / ratedRequests.length).toFixed(1) 
        : 'N/A';

      const onTimeRate = completedTotal > 0 ? '98%' : 'N/A';

      setStats({
        assignedPickups,
        completedToday,
        pendingPickups: pending,
        totalEarnings,
        rating: avgRating,
        onTimeRate
      });

      const sortedRequests = requests.sort((a, b) => {
        if (a.status === 'SCHEDULED' && b.status !== 'SCHEDULED') return -1;
        if (a.status !== 'SCHEDULED' && b.status === 'SCHEDULED') return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      setRecentAssignments(sortedRequests.slice(0, 5));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      SCHEDULED: 'bg-blue-100 text-blue-800 border border-blue-200',
      COMPLETED: 'bg-green-100 text-green-800 border border-green-200',
      COLLECTED: 'bg-purple-100 text-purple-800 border border-purple-200',
      PENDING: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      CANCELLED: 'bg-red-100 text-red-800 border border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border border-gray-200';
  };

  const getPriority = (request) => {
    if (request.status === 'SCHEDULED') return 'HIGH';
    if (request.status === 'PENDING') return 'MEDIUM';
    return 'LOW';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      HIGH: 'bg-red-100 text-red-800 border border-red-200',
      MEDIUM: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      LOW: 'bg-green-100 text-green-800 border border-green-200'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800 border border-gray-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
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
        <div className="absolute bottom-1/4 left-1/4 w-56 h-56 opacity-5 animate-recycle-spin-slow delay-3000">
          <Recycle className="w-full h-full text-green-400" />
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 opacity-5 animate-recycle-spin-reverse delay-2000">
          <Recycle className="w-full h-full text-blue-400" />
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
        <div className="absolute bottom-40 right-20 w-7 h-7 opacity-15 animate-recycle-float delay-3000">
          <Recycle className="w-full h-full text-green-500" />
        </div>
        <div className="absolute top-60 left-1/4 w-5 h-5 opacity-20 animate-recycle-float delay-1000">
          <Recycle className="w-full h-full text-blue-500" />
        </div>
        <div className="absolute top-10 right-44 w-9 h-9 opacity-10 animate-recycle-float delay-5000">
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

        {/* Floating Electronic Devices */}
        <div className="absolute top-32 right-10 text-green-300/10 animate-float-device">
          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/>
          </svg>
        </div>
        <div className="absolute bottom-32 left-10 text-blue-300/10 animate-float-device-reverse delay-2000">
          <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/>
          </svg>
        </div>

        {/* Gradient Orbs */}
        <div className="absolute -top-48 -left-48 w-96 h-96 bg-gradient-to-r from-green-200 to-emerald-200 rounded-full opacity-20 blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-48 -right-48 w-96 h-96 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full opacity-20 blur-3xl animate-pulse-slow delay-2000"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full opacity-15 blur-3xl animate-pulse-slow delay-1000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden backdrop-blur-sm bg-white/10 border border-white/20">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30">
                    <Users className="h-6 w-6" />
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold">Welcome back, {user?.name}! ♻️</h1>
                </div>
                <p className="text-green-100 text-lg">
                  You have <span className="font-bold text-white">{stats.pendingPickups}</span> eco-missions pending. Drive safe and save the planet!
                </p>
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/30">
                    <Zap className="h-4 w-4 text-yellow-300" />
                    <span className="text-sm font-medium">Green Streak: 12 days</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/30">
                    <TrendingUp className="h-4 w-4 text-green-300" />
                    <span className="text-sm font-medium">Eco-Score: Excellent</span>
                  </div>
                </div>
              </div>
              <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm border border-white/30 min-w-[200px]">
                <p className="text-sm text-green-50 font-medium">Today's Eco-Route</p>
                <p className="text-xl font-bold mt-1">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
                <p className="text-green-100 text-sm mt-2">
                  {stats.completedToday} recycled • {stats.pendingPickups} to go
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { 
              icon: Package, 
              label: 'Assigned Pickups', 
              value: stats.assignedPickups, 
              color: 'blue',
              trend: '+2 this week',
              description: 'Total eco-missions'
            },
            { 
              icon: CheckCircle, 
              label: 'Completed Today', 
              value: stats.completedToday, 
              color: 'green',
              trend: 'On track',
              description: 'Devices recycled today'
            },
            { 
              icon: Clock, 
              label: 'Pending Action', 
              value: stats.pendingPickups, 
              color: 'yellow',
              trend: 'Needs attention',
              description: 'Eco-missions waiting'
            },
            { 
              icon: DollarSign, 
              label: 'Est. Earnings', 
              value: `$${stats.totalEarnings}`, 
              color: 'purple',
              trend: '+$45 today',
              description: 'Green contributions'
            },
            { 
              icon: Star, 
              label: 'Avg Rating', 
              value: stats.rating === 'N/A' ? 'N/A' : `${stats.rating}/5`, 
              color: 'orange',
              trend: '4.8 last week',
              description: 'Customer satisfaction'
            },
            { 
              icon: TrendingUp, 
              label: 'On-Time Rate', 
              value: stats.onTimeRate, 
              color: 'cyan',
              trend: '+2% improvement',
              description: 'Eco-efficient deliveries'
            }
          ].map((stat, index) => {
            const IconComponent = stat.icon;
            const colorClasses = {
              blue: 'border-l-blue-500 bg-gradient-to-r from-blue-50/80 to-white/80 backdrop-blur-sm',
              green: 'border-l-green-500 bg-gradient-to-r from-green-50/80 to-white/80 backdrop-blur-sm',
              yellow: 'border-l-yellow-500 bg-gradient-to-r from-yellow-50/80 to-white/80 backdrop-blur-sm',
              purple: 'border-l-purple-500 bg-gradient-to-r from-purple-50/80 to-white/80 backdrop-blur-sm',
              orange: 'border-l-orange-500 bg-gradient-to-r from-orange-50/80 to-white/80 backdrop-blur-sm',
              cyan: 'border-l-cyan-500 bg-gradient-to-r from-cyan-50/80 to-white/80 backdrop-blur-sm'
            };

            return (
              <div
                key={index}
                className={`${colorClasses[stat.color]} rounded-2xl p-6 shadow-lg border border-gray-100/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group backdrop-blur-sm`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-white/80 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className={`h-6 w-6 text-${stat.color}-500`} />
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full bg-${stat.color}-100 text-${stat.color}-800 backdrop-blur-sm`}>
                    {stat.trend}
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-xs text-gray-500">{stat.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Enhanced Recent Assignments */}
          <div className="bg-white/80 rounded-2xl shadow-lg border border-gray-200/50 backdrop-blur-sm">
            <div className="p-6 border-b border-gray-200/50">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Package className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Recent Eco-Missions</h3>
                    <p className="text-sm text-gray-600">Your latest recycling assignments</p>
                  </div>
                </div>
                <Link 
                  to="/pickup-person/assignments" 
                  className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center group backdrop-blur-sm"
                >
                  View All 
                  <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-100/50">
              {recentAssignments.length > 0 ? (
                recentAssignments.map((assignment, index) => {
                  const priority = getPriority(assignment);
                  return (
                    <div 
                      key={assignment.id} 
                      className="p-4 hover:bg-gray-50/80 transition-all duration-200 group hover:shadow-sm backdrop-blur-sm"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {assignment.deviceType} - {assignment.brand}
                            </h4>
                          </div>
                          <p className="text-sm text-gray-600 flex items-center">
                            <Users className="h-4 w-4 mr-1.5 text-gray-400" />
                            <span className="font-medium">{assignment.userName}</span>
                            {assignment.userContactInfo && (
                              <span className="ml-2 text-gray-500">• {assignment.userContactInfo}</span>
                            )}
                          </p>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)} backdrop-blur-sm`}>
                            {assignment.status}
                          </span>
                          {assignment.status === 'SCHEDULED' && (
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(priority)} backdrop-blur-sm`}>
                              {priority} PRIORITY
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                        <div className="flex items-center text-sm text-gray-500 bg-gray-50/50 px-3 py-2 rounded-lg backdrop-blur-sm">
                          <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                          <span className="truncate font-medium">{assignment.pickupAddress}</span>
                        </div>
                        {assignment.scheduledPickupDate && (
                          <div className="flex items-center text-sm text-gray-500 bg-gray-50/50 px-3 py-2 rounded-lg backdrop-blur-sm">
                            <Clock className="h-4 w-4 mr-2 text-purple-500" />
                            <span className="font-medium">
                              {new Date(assignment.scheduledPickupDate).toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100/50 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                    <Package className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">No eco-missions yet</p>
                  <p className="text-sm text-gray-400 mt-1">New recycling assignments will appear here</p>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white/80 rounded-2xl shadow-lg p-6 border border-gray-200/50 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Zap className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                  <p className="text-sm text-gray-600">Your eco-workflow tools</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <Link
                  to="/pickup-person/route"
                  className="flex items-center p-4 border-2 border-gray-200/50 rounded-xl hover:border-green-500 hover:bg-green-50/50 transition-all duration-300 group hover:shadow-md backdrop-blur-sm"
                >
                  <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors mr-4 group-hover:scale-110 duration-300">
                    <Navigation className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 group-hover:text-green-700">View Eco-Route</p>
                    <p className="text-sm text-gray-600">Optimized green route with navigation</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link
                  to="/pickup-person/schedule"
                  className="flex items-center p-4 border-2 border-gray-200/50 rounded-xl hover:border-blue-500 hover:bg-blue-50/50 transition-all duration-300 group hover:shadow-md backdrop-blur-sm"
                >
                  <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors mr-4 group-hover:scale-110 duration-300">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 group-hover:text-blue-700">Eco-Schedule</p>
                    <p className="text-sm text-gray-600">Green mission calendar & timeline</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/pickup-person/performance"
                  className="flex items-center p-4 border-2 border-gray-200/50 rounded-xl hover:border-purple-500 hover:bg-purple-50/50 transition-all duration-300 group hover:shadow-md backdrop-blur-sm"
                >
                  <div className="p-3 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors mr-4 group-hover:scale-110 duration-300">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 group-hover:text-purple-700">Eco-Stats</p>
                    <p className="text-sm text-gray-600">Your green performance metrics</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Enhanced Eco-Tip Card */}
            <div className="bg-gradient-to-r from-green-50/80 to-blue-50/80 rounded-2xl p-6 border border-green-200/50 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-100 rounded-xl flex-shrink-0">
                  <Recycle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Eco-Tip of the Day</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Mark items as "Collected" immediately after pickup to update customers in real-time. 
                    This improves satisfaction and helps track our environmental impact! 🌱
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600 font-medium">Every pickup makes a difference</span>
                  </div>
                </div>
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
        @keyframes float-device {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-15px) rotate(5deg); }
          66% { transform: translateY(-5px) rotate(-3deg); }
        }
        @keyframes float-device-reverse {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(10px) rotate(-5deg); }
          66% { transform: translateY(5px) rotate(3deg); }
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
        .animate-float-device { 
          animation: float-device 10s ease-in-out infinite; 
        }
        .animate-float-device-reverse { 
          animation: float-device-reverse 12s ease-in-out infinite; 
        }
        .animate-pulse-slow { 
          animation: pulse-slow 8s ease-in-out infinite; 
        }
      `}</style>
    </div>
  );
};

export default PickupPersonDashboard;