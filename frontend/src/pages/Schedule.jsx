import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Package, 
  AlertCircle,
  Recycle,
  Truck,
  Zap,
  Navigation,
  CheckCircle,
  PlayCircle
} from 'lucide-react';

const Schedule = () => {
  const [schedule, setSchedule] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('timeline'); // 'timeline' or 'calendar'

  useEffect(() => {
    fetchSchedule();
  }, [selectedDate]);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/pickup/my-assigned-requests');
      
      const filteredData = response.data.filter(item => {
        const itemDate = new Date(item.scheduledPickupDate).toISOString().split('T')[0];
        return itemDate === selectedDate && (item.status === 'SCHEDULED' || item.status === 'COLLECTED');
      });

      const mappedData = filteredData.map(item => ({
        id: item.id,
        time: new Date(item.scheduledPickupDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        duration: 30,
        priority: calculatePriority(item),
        deviceType: item.deviceType,
        brand: item.brand,
        model: item.model,
        userName: item.userName,
        userPhone: item.userContactInfo || 'N/A',
        address: item.pickupAddress,
        status: item.status,
        specialInstructions: item.remarks
      }));
      
      mappedData.sort((a, b) => a.time.localeCompare(b.time));

      setSchedule(mappedData);
    } catch (error) {
      console.error('Error fetching schedule:', error);
      setSchedule([]);
    } finally {
      setLoading(false);
    }
  };

  const calculatePriority = (item) => {
    if (item.status !== 'SCHEDULED') return 'LOW';
    const today = new Date();
    const pickupDate = new Date(item.scheduledPickupDate);
    if (pickupDate <= today) return 'HIGH';
    return 'MEDIUM';
  };

  const groupByTime = (schedule) => {
    const grouped = {};
    schedule.forEach(item => {
      const timeKey = item.time;
      if (!grouped[timeKey]) {
        grouped[timeKey] = [];
      }
      grouped[timeKey].push(item);
    });
    return grouped;
  };

  const getStatusColor = (status) => {
    const colors = {
      SCHEDULED: 'bg-blue-100 text-blue-800 border-blue-200',
      COLLECTED: 'bg-purple-100 text-purple-800 border-purple-200',
      COMPLETED: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      HIGH: 'bg-red-100 text-red-800 border border-red-200',
      MEDIUM: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      LOW: 'bg-green-100 text-green-800 border border-green-200'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800 border border-gray-200';
  };

  const groupedSchedule = groupByTime(schedule);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your eco-schedule...</p>
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
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">Eco-Schedule</h1>
                    <p className="text-green-100 text-lg">Plan your recycling missions timeline</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/30">
                    <Zap className="h-4 w-4 text-yellow-300" />
                    <span className="text-sm font-medium">
                      {schedule.length} Mission{schedule.length !== 1 ? 's' : ''} Today
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/30">
                    <Clock className="h-4 w-4 text-green-300" />
                    <span className="text-sm font-medium">
                      {schedule.filter(s => s.status === 'COLLECTED').length} Completed
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex items-center space-x-2 bg-white/20 rounded-lg border border-white/30 px-4 py-3 backdrop-blur-sm">
                  <Calendar className="h-4 w-4 text-green-200" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 text-white font-medium outline-none placeholder-green-200"
                  />
                </div>
                <div className="flex space-x-2 bg-white/20 rounded-lg border border-white/30 p-1 backdrop-blur-sm">
                  <button
                    onClick={() => setViewMode('timeline')}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      viewMode === 'timeline' 
                        ? 'bg-white text-green-600 shadow-sm' 
                        : 'text-green-100 hover:text-white'
                    }`}
                  >
                    Timeline
                  </button>
                  <button
                    onClick={() => setViewMode('calendar')}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      viewMode === 'calendar' 
                        ? 'bg-white text-green-600 shadow-sm' 
                        : 'text-green-100 hover:text-white'
                    }`}
                  >
                    Calendar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Schedule View */}
        <div className="bg-white/80 rounded-2xl shadow-lg border border-gray-200/50 backdrop-blur-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-gray-50 to-white/50">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Schedule for {new Date(selectedDate).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  {schedule.length} eco-mission{schedule.length !== 1 ? 's' : ''} planned
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Live updates enabled</span>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {Object.keys(groupedSchedule).length > 0 ? (
              <div className="space-y-8">
                {Object.entries(groupedSchedule).map(([time, items]) => (
                  <div key={time} className="relative">
                    {/* Timeline Connector */}
                    <div className="absolute left-6 top-8 bottom-0 w-0.5 bg-gradient-to-b from-green-400 to-blue-400"></div>
                    
                    <div className="flex items-start space-x-4 group">
                      <div className="flex-shrink-0 relative">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <Clock className="h-5 w-5" />
                        </div>
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded-full border border-gray-200 shadow-sm">
                          <span className="text-xs font-medium text-gray-700">{time}</span>
                        </div>
                      </div>
                      
                      <div className="flex-1 space-y-4">
                        {items.map((item, index) => (
                          <div 
                            key={item.id} 
                            className="bg-gradient-to-r from-white to-gray-50/80 rounded-xl p-5 border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-300 group-hover:border-green-200 backdrop-blur-sm"
                          >
                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                  <h4 className="font-semibold text-gray-900 text-lg group-hover:text-green-600 transition-colors">
                                    {item.deviceType} - {item.brand} {item.model}
                                  </h4>
                                  
                                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)} backdrop-blur-sm`}>
                                    {item.status}
                                  </span>

                                  {item.status === 'SCHEDULED' && (
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)} backdrop-blur-sm`}>
                                      {item.priority} PRIORITY
                                    </span>
                                  )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                  <div className="space-y-2">
                                    <div className="flex items-center text-sm text-gray-600 bg-gray-50/50 px-3 py-2 rounded-lg backdrop-blur-sm">
                                      <User className="h-4 w-4 mr-2 text-blue-500" />
                                      <span className="font-medium">{item.userName}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600 bg-gray-50/50 px-3 py-2 rounded-lg backdrop-blur-sm">
                                      <Package className="h-4 w-4 mr-2 text-purple-500" />
                                      <span>{item.deviceType} • {item.duration} min</span>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <div className="flex items-start text-sm text-gray-600 bg-gray-50/50 px-3 py-2 rounded-lg backdrop-blur-sm">
                                      <MapPin className="h-4 w-4 mr-2 mt-0.5 text-red-500 flex-shrink-0" />
                                      <span className="font-medium">{item.address}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600 bg-gray-50/50 px-3 py-2 rounded-lg backdrop-blur-sm">
                                      <Clock className="h-4 w-4 mr-2 text-green-500" />
                                      <span>Arrive by {time}</span>
                                    </div>
                                  </div>
                                </div>

                                {item.specialInstructions && (
                                  <div className="bg-yellow-50/80 border border-yellow-200 rounded-lg p-3 mb-3 backdrop-blur-sm">
                                    <div className="flex items-start">
                                      <AlertCircle className="h-4 w-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                                      <div>
                                        <p className="text-sm font-medium text-yellow-800">Special Instructions</p>
                                        <p className="text-sm text-yellow-700 mt-1">{item.specialInstructions}</p>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <Recycle className="h-3 w-3 text-green-500" />
                                  <span>Eco-mission in progress</span>
                                </div>
                              </div>

                              <div className="flex flex-row lg:flex-col gap-2">
                                {item.status === 'SCHEDULED' && (
                                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 group/btn">
                                    <Navigation className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                                    Start Route
                                  </button>
                                )}
                                {item.status === 'COLLECTED' && (
                                  <div className="flex flex-col items-center justify-center text-green-600 bg-green-50/80 rounded-lg p-3 border border-green-200 backdrop-blur-sm">
                                    <CheckCircle className="h-6 w-6 mb-1" />
                                    <span className="text-xs font-medium">Collected</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="bg-gray-50/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <Calendar className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No eco-missions scheduled</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  No recycling missions planned for {new Date(selectedDate).toLocaleDateString()}. 
                  Enjoy your day or check other dates!
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

        {/* Quick Stats Footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/80 rounded-xl p-4 border border-gray-200/50 backdrop-blur-sm text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {schedule.filter(s => s.status === 'SCHEDULED').length}
            </div>
            <div className="text-sm text-gray-600">Pending Missions</div>
          </div>
          <div className="bg-white/80 rounded-xl p-4 border border-gray-200/50 backdrop-blur-sm text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {schedule.filter(s => s.status === 'COLLECTED').length}
            </div>
            <div className="text-sm text-gray-600">Completed Today</div>
          </div>
          <div className="bg-white/80 rounded-xl p-4 border border-gray-200/50 backdrop-blur-sm text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {schedule.filter(s => s.priority === 'HIGH').length}
            </div>
            <div className="text-sm text-gray-600">High Priority</div>
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

export default Schedule;