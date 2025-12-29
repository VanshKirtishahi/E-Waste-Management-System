import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Package, 
  MapPin, 
  Clock, 
  User, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Filter,
  Phone,
  Recycle,
  Truck,
  Navigation,
  Zap
} from 'lucide-react';

const MyAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/pickup/my-assigned-requests');
      
      const mappedData = response.data.map(req => ({
        ...req,
        address: req.pickupAddress,
        scheduledTime: req.scheduledPickupDate,
        userName: req.userName,
        userPhone: req.userContactInfo || 'N/A',
        specialInstructions: req.remarks,
        priority: calculatePriority(req),
        items: req.items || [`${req.quantity} x ${req.deviceType} (${req.condition})`] 
      }));

      mappedData.sort((a, b) => {
        if (a.status === 'SCHEDULED' && b.status !== 'SCHEDULED') return -1;
        if (a.status !== 'SCHEDULED' && b.status === 'SCHEDULED') return 1;
        return new Date(a.scheduledTime || 0) - new Date(b.scheduledTime || 0);
      });

      setAssignments(mappedData);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePriority = (req) => {
    if (req.status !== 'SCHEDULED') return 'LOW';
    const today = new Date();
    const pickupDate = new Date(req.scheduledPickupDate);
    if (pickupDate <= today) return 'HIGH';
    return 'MEDIUM';
  };

  const updateStatus = async (assignmentId, newStatus) => {
    if (!window.confirm(`Are you sure you want to mark this as ${newStatus}?`)) return;

    try {
      await axios.put(`http://localhost:8080/api/requests/${assignmentId}/status`, {
        status: newStatus
      });
      
      await fetchAssignments();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again.');
    }
  };

  const filteredAssignments = assignments.filter(assignment => {
    if (filter === 'ALL') return true;
    return assignment.status === filter;
  });

  const getStatusColor = (status) => {
    const colors = {
      SCHEDULED: 'bg-blue-100 text-blue-800 border-blue-200',
      COMPLETED: 'bg-green-100 text-green-800 border-green-200',
      COLLECTED: 'bg-purple-100 text-purple-800 border-purple-200',
      CANCELLED: 'bg-red-100 text-red-800 border-red-200',
      PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200'
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your eco-missions...</p>
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
                    <Truck className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">My Eco-Missions</h1>
                    <p className="text-green-100 text-lg">Manage your recycling assignments and track progress</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/30">
                    <Zap className="h-4 w-4 text-yellow-300" />
                    <span className="text-sm font-medium">
                      {filteredAssignments.length} Active Mission{filteredAssignments.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/30">
                    <Navigation className="h-4 w-4 text-green-300" />
                    <span className="text-sm font-medium">Optimize Your Route</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-white/20 rounded-lg border border-white/30 px-4 py-3 backdrop-blur-sm">
                  <Filter className="h-4 w-4 text-green-200" />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 text-sm text-white font-medium outline-none"
                  >
                    <option value="ALL" className="text-gray-800">All Missions</option>
                    <option value="SCHEDULED" className="text-gray-800">Scheduled</option>
                    <option value="COLLECTED" className="text-gray-800">Collected</option>
                    <option value="COMPLETED" className="text-gray-800">Completed</option>
                    <option value="CANCELLED" className="text-gray-800">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Assignments List */}
        <div className="bg-white/80 rounded-2xl shadow-lg border border-gray-200/50 backdrop-blur-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-gray-50 to-white/50">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {filteredAssignments.length} Eco-Mission{filteredAssignments.length !== 1 ? 's' : ''} Found
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  {filter !== 'ALL' && `Filtered by: ${filter.toLowerCase()} missions`}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Real-time updates</span>
              </div>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200/50">
            {filteredAssignments.length > 0 ? (
              filteredAssignments.map((assignment, index) => (
                <div 
                  key={assignment.id} 
                  className="p-6 hover:bg-gray-50/80 transition-all duration-300 group backdrop-blur-sm"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-xl ${getStatusColor(assignment.status)} border backdrop-blur-sm group-hover:scale-105 transition-transform duration-300`}>
                          <Package className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <h3 className="text-lg font-semibold text-gray-900 mr-2 group-hover:text-blue-600 transition-colors">
                              {assignment.deviceType} - {assignment.brand} {assignment.model}
                            </h3>
                            
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)} backdrop-blur-sm`}>
                              {assignment.status}
                            </span>

                            {assignment.status === 'SCHEDULED' && (
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getPriorityColor(assignment.priority)} backdrop-blur-sm`}>
                                {assignment.priority} PRIORITY
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 mb-4">
                            <div className="space-y-3">
                              <div className="flex items-center text-sm text-gray-600 bg-gray-50/50 px-3 py-2 rounded-lg backdrop-blur-sm">
                                <User className="h-4 w-4 mr-2 text-blue-500" />
                                <span className="font-medium">{assignment.userName}</span>
                              </div>
                              <div className="flex items-center text-sm text-gray-600 bg-gray-50/50 px-3 py-2 rounded-lg backdrop-blur-sm">
                                <Phone className="h-4 w-4 mr-2 text-green-500" />
                                <span>{assignment.userPhone}</span>
                              </div>
                              <div className="flex items-center text-sm text-gray-600 bg-gray-50/50 px-3 py-2 rounded-lg backdrop-blur-sm">
                                <Clock className="h-4 w-4 mr-2 text-purple-500" />
                                <span>
                                  {assignment.scheduledTime 
                                    ? new Date(assignment.scheduledTime).toLocaleString() 
                                    : 'Time not set'}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-start text-sm text-gray-600 bg-gray-50/50 px-3 py-2 rounded-lg backdrop-blur-sm">
                              <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-red-500" />
                              <span className="font-medium">{assignment.address}</span>
                            </div>
                          </div>

                          {assignment.specialInstructions && (
                            <div className="bg-yellow-50/80 border border-yellow-200 rounded-xl p-4 mb-4 max-w-2xl backdrop-blur-sm">
                              <div className="flex items-start">
                                <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-sm font-medium text-yellow-800">Special Instructions</p>
                                  <p className="text-sm text-yellow-700 mt-1">{assignment.specialInstructions}</p>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="flex flex-wrap gap-2">
                            {assignment.items.map((item, index) => (
                              <span 
                                key={index} 
                                className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-green-50 text-green-700 border border-green-200 backdrop-blur-sm group-hover:bg-green-100 transition-colors"
                              >
                                <Recycle className="h-3 w-3 mr-1.5" />
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Action Buttons */}
                    <div className="flex flex-row lg:flex-col gap-3 mt-2 lg:mt-0 lg:ml-4 lg:min-w-[180px]">
                      {assignment.status === 'SCHEDULED' && (
                        <>
                          <button
                            onClick={() => updateStatus(assignment.id, 'COLLECTED')}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl font-medium flex items-center justify-center transition-all duration-300 w-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 group/btn"
                          >
                            <CheckCircle className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                            Mark Collected
                          </button>
                          <button
                            onClick={() => updateStatus(assignment.id, 'CANCELLED')}
                            className="bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 px-4 py-3 rounded-xl font-medium flex items-center justify-center transition-all duration-300 w-full shadow-sm hover:shadow-md transform hover:-translate-y-0.5 group/btn"
                          >
                            <XCircle className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                            Cancel Mission
                          </button>
                        </>
                      )}
                      {(assignment.status === 'COMPLETED' || assignment.status === 'COLLECTED') && (
                        <div className="flex flex-col items-center justify-center h-full text-green-600 bg-green-50/80 rounded-xl p-4 border border-green-200 backdrop-blur-sm group-hover:bg-green-100 transition-colors">
                          <CheckCircle className="h-8 w-8 mb-2 group-hover:scale-110 transition-transform" />
                          <span className="font-medium text-sm text-center">Eco-Mission Completed</span>
                          <span className="text-xs text-green-500 mt-1">Thank you! ♻️</span>
                        </div>
                      )}
                      {(assignment.status === 'CANCELLED' || assignment.status === 'REJECTED') && (
                        <div className="flex flex-col items-center justify-center h-full text-red-600 bg-red-50/80 rounded-xl p-4 border border-red-200 backdrop-blur-sm group-hover:bg-red-100 transition-colors">
                          <XCircle className="h-8 w-8 mb-2" />
                          <span className="font-medium text-sm text-center">Mission Cancelled</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <div className="bg-gray-50/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <Package className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No eco-missions found</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  {filter !== 'ALL' 
                    ? `No recycling missions found with status "${filter.toLowerCase()}"`
                    : "You're all caught up! New recycling missions will appear here when assigned."}
                </p>
                <div className="mt-4 flex justify-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mx-1"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse mx-1 delay-300"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse mx-1 delay-700"></div>
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
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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
        .animate-fade-in-up { 
          animation: fade-in-up 0.6s ease-out forwards; 
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default MyAssignments;