import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, Search, Filter, Download, Eye,
  Clock, CheckCircle, XCircle, Calendar, AlertCircle,
  Trash2, Recycle, FileText, BarChart3, TrendingUp, Users, MapPin, Home
} from 'lucide-react';

const RequestHistory = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [requests, searchTerm, statusFilter]);

  const fetchRequests = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/requests/user');
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterRequests = () => {
    let filtered = requests;

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(request =>
        request.deviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.model.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredRequests(filtered);
  };

  const getStatusIcon = (status) => {
    const icons = {
      PENDING: Clock,
      APPROVED: CheckCircle,
      SCHEDULED: Calendar,
      REJECTED: XCircle,
      COMPLETED: CheckCircle,
      COLLECTED: CheckCircle
    };
    return icons[status] || AlertCircle;
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'text-yellow-700 bg-yellow-50 border-yellow-200',
      APPROVED: 'text-green-700 bg-green-50 border-green-200',
      SCHEDULED: 'text-blue-700 bg-blue-50 border-blue-200',
      REJECTED: 'text-red-700 bg-red-50 border-red-200',
      COMPLETED: 'text-green-700 bg-green-50 border-green-200',
      COLLECTED: 'text-purple-700 bg-purple-50 border-purple-200'
    };
    return colors[status] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      APPROVED: 'bg-green-100 text-green-800 border-green-200',
      SCHEDULED: 'bg-blue-100 text-blue-800 border-blue-200',
      REJECTED: 'bg-red-100 text-red-800 border-red-200',
      COMPLETED: 'bg-green-100 text-green-800 border-green-200',
      COLLECTED: 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const exportToPDF = (request) => {
    alert(`Exporting request ${request.id} to PDF`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your request history...</p>
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
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">Request History</h1>
                    <p className="text-green-100 text-lg">Track and manage all your recycling requests</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/30">
                    <Recycle className="h-4 w-4 text-green-300" />
                    <span className="text-sm font-medium">{requests.length} Total Requests</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/30">
                    <CheckCircle className="h-4 w-4 text-yellow-300" />
                    <span className="text-sm font-medium">{requests.filter(r => r.status === 'COMPLETED').length} Completed</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/30">
                    <Clock className="h-4 w-4 text-blue-300" />
                    <span className="text-sm font-medium">{requests.filter(r => ['PENDING', 'APPROVED', 'SCHEDULED'].includes(r.status)).length} In Progress</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white/80 rounded-2xl shadow-lg border border-gray-200/50 backdrop-blur-sm p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 group">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by device, brand, or model..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all rounded-xl outline-none backdrop-blur-sm"
                />
              </div>
            </div>
            <div className="w-full md:w-48 group">
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all rounded-xl outline-none backdrop-blur-sm appearance-none"
                >
                  <option value="ALL">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="COLLECTED">Collected</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Requests List */}
        <div className="bg-white/80 rounded-2xl shadow-lg border border-gray-200/50 backdrop-blur-sm overflow-hidden">
          {filteredRequests.length > 0 ? (
            <div className="divide-y divide-gray-200/50">
              {filteredRequests.map((request) => {
                const StatusIcon = getStatusIcon(request.status);
                return (
                  <div key={request.id} className="p-6 hover:bg-gray-50/50 transition-all duration-300 group">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-xl border backdrop-blur-sm group-hover:scale-110 transition-transform ${getStatusColor(request.status)}`}>
                            <StatusIcon className="h-6 w-6" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                                {request.deviceType} - {request.brand} {request.model}
                              </h3>
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize backdrop-blur-sm border ${getStatusBadgeColor(request.status)}`}>
                                {request.status.toLowerCase()}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-3">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span className="font-medium">Quantity:</span>
                                <span className="bg-gray-100 px-2 py-1 rounded border border-gray-200 backdrop-blur-sm">{request.quantity}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span className="font-medium">Condition:</span>
                                <span className="bg-gray-100 px-2 py-1 rounded border border-gray-200 backdrop-blur-sm capitalize">{request.condition.toLowerCase()}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span className="font-medium">Submitted:</span>
                                <span className="bg-gray-100 px-2 py-1 rounded border border-gray-200 backdrop-blur-sm">
                                  {new Date(request.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                              <MapPin className="h-4 w-4 text-blue-500" />
                              {/* Display Pickup Address robustly */}
                              <span>{request.pickupAddress || 'No pickup address specified'}</span>
                            </div>
                            
                            {request.remarks && (
                              <p className="text-sm text-gray-600 bg-gray-50/50 rounded-xl p-3 border border-gray-200/50 backdrop-blur-sm">
                                <span className="font-medium">Remarks:</span> {request.remarks}
                              </p>
                            )}
                            
                            {request.rejectionReason && request.status === 'REJECTED' && (
                              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50/50 rounded-xl p-3 border border-red-200/50 backdrop-blur-sm mt-2">
                                <AlertCircle className="h-4 w-4" />
                                <span><strong>Rejection Reason:</strong> {request.rejectionReason}</span>
                              </div>
                            )}
                            
                            {request.scheduledPickupDate && request.status === 'SCHEDULED' && (
                              <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50/50 rounded-xl p-3 border border-blue-200/50 backdrop-blur-sm mt-2">
                                <Calendar className="h-4 w-4" />
                                <span><strong>Scheduled Pickup:</strong> {new Date(request.scheduledPickupDate).toLocaleString()}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-4 lg:mt-0 lg:ml-4">
                        <button
                          onClick={() => exportToPDF(request)}
                          className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-900 bg-gray-50/50 hover:bg-gray-100/50 rounded-xl border border-gray-200/50 backdrop-blur-sm transition-all duration-300 hover:shadow-md group"
                          title="Download PDF Report"
                        >
                          <Download className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                          PDF
                        </button>
                        <button
                          onClick={() => setSelectedRequest(request)}
                          className="flex items-center px-4 py-2 text-sm text-green-600 hover:text-green-700 bg-green-50/50 hover:bg-green-100/50 rounded-xl border border-green-200/50 backdrop-blur-sm transition-all duration-300 hover:shadow-md group"
                        >
                          <Eye className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-gray-50/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-gray-200/50">
                <AlertCircle className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No requests found</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                {requests.length === 0 
                  ? "You haven't submitted any e-waste requests yet. Start your eco-friendly journey today!"
                  : "No requests match your current filters. Try adjusting your search criteria."
                }
              </p>
              {requests.length === 0 && (
                <Link
                  to="/new-request"
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium py-3 px-8 rounded-xl inline-flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Recycle className="h-4 w-4" />
                  Submit Your First Request
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Request Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white/95 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200/50 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-xl border border-green-200">
                    <FileText className="h-6 w-6 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Request Details</h2>
                </div>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-200/50 backdrop-blur-sm">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Device Type</label>
                    <p className="text-lg font-semibold text-gray-900">{selectedRequest.deviceType}</p>
                  </div>
                  <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-200/50 backdrop-blur-sm">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize backdrop-blur-sm border ${getStatusBadgeColor(selectedRequest.status)}`}>
                      {selectedRequest.status.toLowerCase()}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-200/50 backdrop-blur-sm">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                    <p className="text-lg font-semibold text-gray-900">{selectedRequest.brand}</p>
                  </div>
                  <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-200/50 backdrop-blur-sm">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                    <p className="text-lg font-semibold text-gray-900">{selectedRequest.model}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-200/50 backdrop-blur-sm">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                    <p className="text-lg font-semibold text-gray-900 capitalize">{selectedRequest.condition.toLowerCase()}</p>
                  </div>
                  <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-200/50 backdrop-blur-sm">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                    <p className="text-lg font-semibold text-gray-900">{selectedRequest.quantity}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-200/50 backdrop-blur-sm">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Address</label>
                  <p className="text-lg font-semibold text-gray-900">{selectedRequest.pickupAddress}</p>
                </div>

                {/* ADDED: User Registered Address in details modal */}
                {selectedRequest.userAddress && (
                  <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-200/50 backdrop-blur-sm">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Registered User Address</label>
                    <p className="text-lg font-semibold text-gray-900">{selectedRequest.userAddress}</p>
                  </div>
                )}
                
                {selectedRequest.remarks && (
                  <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-200/50 backdrop-blur-sm">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
                    <p className="text-lg font-semibold text-gray-900">{selectedRequest.remarks}</p>
                  </div>
                )}
                
                {selectedRequest.rejectionReason && (
                  <div className="bg-red-50/50 rounded-xl p-4 border border-red-200/50 backdrop-blur-sm">
                    <label className="block text-sm font-medium text-red-700 mb-2">Rejection Reason</label>
                    <p className="text-lg font-semibold text-red-900">{selectedRequest.rejectionReason}</p>
                  </div>
                )}
                
                {selectedRequest.scheduledPickupDate && (
                  <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-200/50 backdrop-blur-sm">
                    <label className="block text-sm font-medium text-blue-700 mb-2">Scheduled Pickup</label>
                    <p className="text-lg font-semibold text-blue-900">
                      {new Date(selectedRequest.scheduledPickupDate).toLocaleString()}
                    </p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-200/50 backdrop-blur-sm">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Submitted</label>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date(selectedRequest.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-200/50 backdrop-blur-sm">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Updated</label>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date(selectedRequest.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200/50">
                <button
                  onClick={() => exportToPDF(selectedRequest)}
                  className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-900 bg-gray-50/50 hover:bg-gray-100/50 rounded-xl border border-gray-200/50 backdrop-blur-sm transition-all duration-300 hover:shadow-md font-medium"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </button>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium py-3 px-8 rounded-xl flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

export default RequestHistory;