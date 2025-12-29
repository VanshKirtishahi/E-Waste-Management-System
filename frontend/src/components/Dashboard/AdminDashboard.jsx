import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { 
  Package,
  Users,
  CheckCircle,
  Clock,
  Calendar,
  XCircle,
  TrendingUp,
  BarChart3,
  AlertCircle,
  DollarSign,
  MapPin,
  Truck,
  Recycle,
  Leaf,
  Zap,
  Award,
  Shield
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    completedRequests: 0,
    totalUsers: 0,
    pickupPersons: 0,
    revenue: 0
  });
  const [chartData, setChartData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [requestsRes, pickupRes] = await Promise.all([
        axios.get('/api/requests'),
        axios.get('/api/admin/pickup-persons')
      ]);

      const requests = requestsRes.data;
      const pickupPersons = pickupRes.data;

      const totalRequests = requests.length;
      const pendingRequests = requests.filter(r => r.status === 'PENDING').length;
      const completedRequests = requests.filter(r => r.status === 'COMPLETED' || r.status === 'COLLECTED').length;
      
      const uniqueUsers = new Set(requests.map(r => r.userId || r.userEmail)).size;
      const totalItemsRecycled = requests.reduce((sum, r) => sum + (r.quantity || 1), 0);

      setStats({
        totalRequests,
        pendingRequests,
        completedRequests,
        totalUsers: uniqueUsers || 0,
        pickupPersons: pickupPersons.length,
        revenue: totalItemsRecycled
      });

      setRecentRequests(requests.slice(0, 5));

      const deviceCounts = requests.reduce((acc, r) => {
        const type = r.deviceType || 'Other';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {});

      const computedChartData = Object.entries(deviceCounts).map(([name, count]) => ({
        name, count
      }));
      setChartData(computedChartData);

      const statusCounts = requests.reduce((acc, r) => {
        acc[r.status] = (acc[r.status] || 0) + 1;
        return acc;
      }, {});

      const statusMap = [
        { name: 'Completed', key: 'COMPLETED', fill: '#16a34a' },
        { name: 'Pending', key: 'PENDING', fill: '#f59e0b' },
        { name: 'Approved', key: 'APPROVED', fill: '#22c55e' },
        { name: 'Scheduled', key: 'SCHEDULED', fill: '#0ea5e9' },
        { name: 'Collected', key: 'COLLECTED', fill: '#8b5cf6' },
        { name: 'Rejected', key: 'REJECTED', fill: '#ef4444' }
      ];

      const computedStatusData = statusMap
        .map(s => ({ name: s.name, value: statusCounts[s.key] || 0, fill: s.fill }))
        .filter(item => item.value > 0);

      setStatusData(computedStatusData);

      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const trendMap = {};

      requests.forEach(r => {
        if (r.createdAt) {
          const d = new Date(r.createdAt);
          const monthName = months[d.getMonth()];
          trendMap[monthName] = (trendMap[monthName] || 0) + (r.quantity || 1);
        }
      });

      const computedRevenueData = months.map(m => ({
        month: m,
        revenue: trendMap[m] || 0
      }));
      setRevenueData(computedRevenueData);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusIcons = {
    PENDING: Clock,
    APPROVED: CheckCircle,
    SCHEDULED: Calendar,
    COLLECTED: Truck,
    REJECTED: XCircle,
    COMPLETED: CheckCircle
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      APPROVED: 'bg-green-100 text-green-800 border-green-200',
      SCHEDULED: 'bg-blue-100 text-blue-800 border-blue-200',
      COLLECTED: 'bg-purple-100 text-purple-800 border-purple-200',
      REJECTED: 'bg-red-100 text-red-800 border-red-200',
      COMPLETED: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const statCards = [
    {
      label: 'Total Requests',
      value: stats.totalRequests,
      icon: Package,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-100 border-blue-200 text-blue-600'
    },
    {
      label: 'Pending',
      value: stats.pendingRequests,
      icon: Clock,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-100 border-yellow-200 text-yellow-600'
    },
    {
      label: 'Completed',
      value: stats.completedRequests,
      icon: CheckCircle,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-100 border-green-200 text-green-600'
    },
    {
      label: 'Active Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-100 border-purple-200 text-purple-600'
    },
    {
      label: 'Pickup Persons',
      value: stats.pickupPersons,
      icon: MapPin,
      color: 'from-indigo-500 to-blue-500',
      bgColor: 'bg-indigo-100 border-indigo-200 text-indigo-600'
    },
    {
      label: 'Items Recycled',
      value: stats.revenue,
      icon: Recycle,
      color: 'from-green-600 to-teal-500',
      bgColor: 'bg-teal-100 border-teal-200 text-teal-600'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 space-y-6 relative overflow-hidden bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Animated Recycling Background - EXACT SAME AS REFERENCE */}
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
        {/* Enhanced Header - EXACT SAME STYLE AS REFERENCE */}
        <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden backdrop-blur-sm bg-white/10 border border-white/20">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
                    <p className="text-green-100 text-lg">Welcome back, {user?.name}. Here's your system overview.</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/30">
                    <Package className="h-4 w-4 text-green-300" />
                    <span className="text-sm font-medium">{stats.totalRequests} Total Requests</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/30">
                    <Users className="h-4 w-4 text-yellow-300" />
                    <span className="text-sm font-medium">{stats.totalUsers} Active Users</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/30">
                    <Recycle className="h-4 w-4 text-blue-300" />
                    <span className="text-sm font-medium">{stats.revenue} Items Recycled</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {statCards.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={stat.label} className="bg-white/80 rounded-2xl shadow-lg border border-gray-200/50 backdrop-blur-sm p-6 hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl border backdrop-blur-sm group-hover:scale-110 transition-transform ${stat.bgColor}`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Device Type Distribution */}
          <div className="bg-white/80 rounded-2xl shadow-lg border border-gray-200/50 backdrop-blur-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg border border-blue-200">
                <BarChart3 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Requests by Device Type</h3>
                <p className="text-gray-600">Distribution of e-waste by device category</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(229, 231, 235, 0.5)',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                <Bar dataKey="count" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Status Distribution */}
          <div className="bg-white/80 rounded-2xl shadow-lg border border-gray-200/50 backdrop-blur-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg border border-purple-200">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Request Status Distribution</h3>
                <p className="text-gray-600">Overview of request processing stages</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  innerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(229, 231, 235, 0.5)',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Activity Chart */}
        <div className="bg-white/80 rounded-2xl shadow-lg border border-gray-200/50 backdrop-blur-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg border border-green-200">
              <Calendar className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Monthly Recycled Items Trend</h3>
              <p className="text-gray-600">Track recycling progress throughout the year</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(229, 231, 235, 0.5)',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                name="Items Recycled" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#059669' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Requests */}
        <div className="bg-white/80 rounded-2xl shadow-lg border border-gray-200/50 backdrop-blur-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg border border-blue-200">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Recent Requests</h3>
                <p className="text-gray-600">Latest e-waste collection requests</p>
              </div>
            </div>
            <Link 
              to="/admin/requests" 
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-xl flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm"
            >
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {recentRequests.length > 0 ? (
              recentRequests.map((request) => {
                const StatusIcon = statusIcons[request.status] || AlertCircle;
                return (
                  <div key={request.id} className="flex items-center justify-between p-4 border border-gray-200/50 rounded-xl bg-white/50 backdrop-blur-sm hover:shadow-md transition-all duration-300 group">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl border backdrop-blur-sm group-hover:scale-110 transition-transform ${getStatusColor(request.status)}`}>
                        <StatusIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                          {request.deviceType} - {request.brand} {request.model}
                        </p>
                        <p className="text-sm text-gray-500">
                          {request.userName} • {request.createdAt ? new Date(request.createdAt).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize backdrop-blur-sm border ${getStatusColor(request.status)}`}>
                      {request.status.toLowerCase()}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12">
                <div className="bg-gray-50/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-gray-200/50">
                  <AlertCircle className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No requests found</h3>
                <p className="text-gray-600">There are no e-waste collection requests yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom CSS for Animations - EXACT SAME AS REFERENCE */}
      <style>{`
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

export default AdminDashboard;