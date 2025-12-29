import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { CheckCircle, Clock, XCircle, Truck, MapPin, Phone, User, Camera, AlertCircle, Recycle, Calendar, Package, Shield, Zap, TrendingUp, Leaf } from 'lucide-react';

const ViewProgress = () => {
  const { user } = useAuth();
  const [activeRequests, setActiveRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/requests/user');
      
      const data = response.data.map(req => ({
        ...req,
        steps: generateSteps(req)
      }));

      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setActiveRequests(data);
      if (data.length > 0) {
        setSelectedRequest(data[0]);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateSteps = (request) => {
    const s = request.status;
    const steps = [
      { 
        name: 'Submitted', 
        status: 'completed', 
        date: request.createdAt,
        icon: Package,
        description: 'Your request has been received'
      },
      { 
        name: 'Verified & Approved', 
        status: getStepStatus(s, ['APPROVED', 'SCHEDULED', 'COLLECTED', 'COMPLETED'], 'REJECTED'), 
        date: null,
        icon: Shield,
        description: 'Request reviewed and approved'
      },
      { 
        name: 'Pickup Scheduled', 
        status: getStepStatus(s, ['SCHEDULED', 'COLLECTED', 'COMPLETED']), 
        date: request.scheduledPickupDate,
        icon: Calendar,
        description: 'Pickup date confirmed'
      },
      { 
        name: 'Collected', 
        status: getStepStatus(s, ['COLLECTED', 'COMPLETED']), 
        date: null,
        icon: Truck,
        description: 'Items collected by our team'
      },
      { 
        name: 'Recycled & Completed', 
        status: getStepStatus(s, ['COMPLETED']), 
        date: null,
        icon: Recycle,
        description: 'Items processed and recycled'
      }
    ];
    return steps;
  };

  const getStepStatus = (currentStatus, completedStatuses, rejectedStatus = null) => {
    if (currentStatus === rejectedStatus) return 'rejected';
    if (completedStatuses.includes(currentStatus)) return 'completed';
    return 'pending';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'current': return <Clock className="h-5 w-5 text-blue-500" />;
      default: return <Clock className="h-5 w-5 text-gray-300" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-700 bg-green-50 border-green-200';
      case 'rejected': return 'text-red-700 bg-red-50 border-red-200';
      case 'current': return 'text-blue-700 bg-blue-50 border-blue-200';
      default: return 'text-gray-400 bg-gray-50 border-gray-200';
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'REJECTED': return 'bg-red-100 text-red-800 border-red-200';
      case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-200';
      case 'COLLECTED': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'SCHEDULED': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'APPROVED': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your requests...</p>
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
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">Track Your Request Progress</h1>
                    <p className="text-green-100 text-lg">Monitor the status of your recycling requests in real-time</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/30">
                    <Package className="h-4 w-4 text-green-300" />
                    <span className="text-sm font-medium">{activeRequests.length} Total Requests</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/30">
                    <CheckCircle className="h-4 w-4 text-yellow-300" />
                    <span className="text-sm font-medium">{activeRequests.filter(r => r.status === 'COMPLETED').length} Completed</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/30">
                    <Clock className="h-4 w-4 text-blue-300" />
                    <span className="text-sm font-medium">{activeRequests.filter(r => !['COMPLETED', 'REJECTED'].includes(r.status)).length} In Progress</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {activeRequests.length === 0 ? (
          <div className="bg-white/80 rounded-2xl shadow-lg border border-gray-200/50 backdrop-blur-sm p-12 text-center">
            <div className="bg-gray-50/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-gray-200/50">
              <AlertCircle className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Active Requests</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              You haven't submitted any recycling requests yet. Start your eco-friendly journey by submitting your first device for recycling.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Request List */}
            <div className="lg:col-span-1">
              <div className="bg-white/80 rounded-2xl shadow-lg border border-gray-200/50 backdrop-blur-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg border border-blue-200">
                    <Package className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Your Requests</h2>
                    <p className="text-gray-600 text-sm">Select a request to view details</p>
                  </div>
                </div>
                
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                  {activeRequests.map((request) => (
                    <div
                      key={request.id}
                      className={`border-2 rounded-2xl p-4 cursor-pointer transition-all duration-300 backdrop-blur-sm group ${
                        selectedRequest?.id === request.id
                          ? 'border-green-500 bg-green-50/50 shadow-lg scale-105'
                          : 'border-gray-200/50 bg-white/50 hover:border-green-300 hover:shadow-md'
                      }`}
                      onClick={() => setSelectedRequest(request)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                          {request.deviceType}
                        </h3>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize border backdrop-blur-sm ${getStatusBadgeColor(request.status)}`}>
                          {request.status.toLowerCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {request.brand} {request.model}
                      </p>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>ID: {request.id}</span>
                        <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Progress Timeline Detail */}
            <div className="lg:col-span-2">
              {selectedRequest && (
                <div className="bg-white/80 rounded-2xl shadow-lg border border-gray-200/50 backdrop-blur-sm p-6">
                  {/* Header Section */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-6 border-b border-gray-200/50">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-100 rounded-xl border border-green-200">
                          <Package className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">
                            {selectedRequest.deviceType}
                            <span className="text-lg font-normal text-gray-500 ml-2">
                              ({selectedRequest.brand} {selectedRequest.model})
                            </span>
                          </h2>
                          <p className="text-gray-500 mt-1">Request ID: #{selectedRequest.id}</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0 text-right bg-white/50 rounded-xl p-4 border border-gray-200/50 backdrop-blur-sm">
                      <p className="text-sm text-gray-500 font-medium">Current Status</p>
                      <p className={`font-bold text-xl ${
                        selectedRequest.status === 'REJECTED' ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {selectedRequest.status.replace('_', ' ')}
                      </p>
                    </div>
                  </div>

                  {/* Visual Timeline */}
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-purple-100 rounded-lg border border-purple-200">
                        <TrendingUp className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">Progress Timeline</h3>
                        <p className="text-gray-600">Track your request through each stage</p>
                      </div>
                    </div>
                    
                    <div className="space-y-0">
                      {selectedRequest.steps.map((step, index) => {
                        const StepIcon = step.icon;
                        return (
                          <div key={step.name} className="flex items-start relative group">
                            {/* Connecting Line */}
                            {index < selectedRequest.steps.length - 1 && (
                              <div className={`absolute left-5 top-10 bottom-0 w-0.5 z-0 transition-colors ${
                                step.status === 'completed' ? 'bg-green-200' : 
                                step.status === 'rejected' ? 'bg-red-200' : 'bg-gray-200'
                              }`}></div>
                            )}
                            
                            <div className="flex-shrink-0 z-10 bg-white/80 backdrop-blur-sm rounded-full p-1 group-hover:scale-110 transition-transform">
                              <div className={`p-2 rounded-full border ${
                                step.status === 'completed' ? 'bg-green-100 border-green-200 text-green-600' :
                                step.status === 'rejected' ? 'bg-red-100 border-red-200 text-red-600' :
                                'bg-gray-100 border-gray-200 text-gray-400'
                              }`}>
                                <StepIcon className="h-4 w-4" />
                              </div>
                            </div>
                            
                            <div className="ml-4 flex-1 pb-8">
                              <div className={`flex items-center justify-between p-4 border-2 rounded-2xl shadow-sm transition-all duration-300 backdrop-blur-sm group-hover:shadow-md ${
                                step.status === 'completed' ? 'bg-green-50/50 border-green-200' :
                                step.status === 'rejected' ? 'bg-red-50/50 border-red-200' :
                                step.status === 'current' ? 'bg-blue-50/50 border-blue-200' :
                                'bg-gray-50/50 border-gray-200'
                              }`}>
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <p className="font-semibold text-base text-gray-900">{step.name}</p>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm ${
                                      step.status === 'completed' ? 'bg-green-100 text-green-700 border border-green-200' :
                                      step.status === 'rejected' ? 'bg-red-100 text-red-700 border border-red-200' :
                                      step.status === 'current' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                                      'bg-gray-100 text-gray-500 border border-gray-200'
                                    }`}>
                                      {step.status}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-1">{step.description}</p>
                                  {step.date && (
                                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-2">
                                      <Calendar className="w-3 h-3" />
                                      {new Date(step.date).toLocaleDateString()}
                                    </p>
                                  )}
                                </div>
                                <div className="ml-4">
                                  {getStatusIcon(step.status)}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Additional Details Sections */}
                  {selectedRequest.assignedPersonName && (
                    <div className="mb-6 bg-blue-50/50 border border-blue-200/50 rounded-2xl p-6 backdrop-blur-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 rounded-xl border border-blue-200">
                          <Truck className="h-5 w-5 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-blue-900">Pickup Details</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white/50 rounded-xl p-4 border border-blue-200/50 backdrop-blur-sm">
                          <p className="text-sm text-blue-800 font-medium mb-1">Assigned Person</p>
                          <p className="text-blue-900 font-semibold">{selectedRequest.assignedPersonName}</p>
                        </div>
                        {selectedRequest.scheduledPickupDate && (
                          <div className="bg-white/50 rounded-xl p-4 border border-blue-200/50 backdrop-blur-sm">
                            <p className="text-sm text-blue-800 font-medium mb-1">Scheduled Date</p>
                            <p className="text-blue-900 font-semibold">
                              {new Date(selectedRequest.scheduledPickupDate).toLocaleString()}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedRequest.status === 'REJECTED' && selectedRequest.rejectionReason && (
                    <div className="mb-6 bg-red-50/50 border border-red-200/50 rounded-2xl p-6 backdrop-blur-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-red-100 rounded-xl border border-red-200">
                          <XCircle className="h-5 w-5 text-red-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-red-900">Rejection Reason</h3>
                      </div>
                      <p className="text-red-800 bg-white/50 rounded-xl p-4 border border-red-200/50 backdrop-blur-sm">
                        {selectedRequest.rejectionReason}
                      </p>
                    </div>
                  )}
                  
                  {selectedRequest.status === 'COLLECTED' && (
                    <div className="bg-green-50/50 border border-green-200/50 rounded-2xl p-6 backdrop-blur-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-green-100 rounded-xl border border-green-200">
                          <Camera className="h-5 w-5 text-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-green-900">Collection Confirmed</h3>
                      </div>
                      <p className="text-green-800 bg-white/50 rounded-xl p-4 border border-green-200/50 backdrop-blur-sm">
                        Your item has been picked up and is on its way to our recycling facility. Thank you for your environmental contribution!
                      </p>
                    </div>
                  )}

                  {selectedRequest.status === 'COMPLETED' && (
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200/50 rounded-2xl p-6 backdrop-blur-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-green-100 rounded-xl border border-green-200">
                          <Leaf className="h-5 w-5 text-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-green-900">Recycling Complete!</h3>
                      </div>
                      <p className="text-green-800 bg-white/50 rounded-xl p-4 border border-green-200/50 backdrop-blur-sm">
                        Your device has been successfully recycled. You've made a positive impact on the environment! 
                        Download your certificate from the Reports section.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Custom CSS for Animations - EXACT SAME AS REFERENCE */}
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

export default ViewProgress;