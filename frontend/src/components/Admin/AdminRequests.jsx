import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, Search, Filter, Eye, CheckCircle, 
  XCircle, Calendar, Clock, MoreVertical,
  Trash2, Users, Mail, X, Truck, MapPin, User, Phone, AlertCircle,
  Recycle, BarChart3, TrendingUp, Package, Shield, Home, Image as ImageIcon
} from 'lucide-react';

const AdminRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionMenu, setActionMenu] = useState(null);
  
  const [scheduleModal, setScheduleModal] = useState(null);
  const [pickupPersonsList, setPickupPersonsList] = useState([]);

  useEffect(() => {
    fetchRequests();
    fetchPickupPersons();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [requests, searchTerm, statusFilter]);

  const fetchRequests = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/requests');
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPickupPersons = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/admin/pickup-persons');
      setPickupPersonsList(response.data);
    } catch (error) {
      console.error('Error fetching pickup persons:', error);
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
        request.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (request.userName && request.userName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredRequests(filtered);
  };

  const updateRequestStatus = async (requestId, status, rejectionReason = '') => {
    try {
      await axios.put(`http://localhost:8080/api/requests/${requestId}/status`, {
        status,
        rejectionReason
      });
      fetchRequests();
      setActionMenu(null);
    } catch (error) {
      console.error('Error updating request:', error);
      alert('Error updating request status');
    }
  };

  const schedulePickup = async (scheduleData) => {
    try {
      await axios.put(`http://localhost:8080/api/requests/${scheduleData.requestId}/schedule`, {
        pickupDate: scheduleData.pickupDateTime,
        pickupPersonId: scheduleData.pickupPersonId
      });
      fetchRequests();
      setScheduleModal(null);
      alert("Pickup scheduled successfully!");
    } catch (error) {
      console.error('Error scheduling pickup:', error);
      alert('Error scheduling pickup');
    }
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

  const getStatusIcon = (status) => {
    const icons = {
      PENDING: Clock,
      APPROVED: CheckCircle,
      SCHEDULED: Calendar,
      COLLECTED: Truck,
      REJECTED: XCircle,
      COMPLETED: CheckCircle
    };
    return icons[status] || Clock;
  };

  const SchedulePickupModal = ({ isOpen, onClose, request, onSchedule, pickupPersons }) => {
    const [formData, setFormData] = useState({
      pickupDate: '',
      pickupTime: '',
      pickupPersonId: '',
      notes: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      if (isOpen && request) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const defaultDate = tomorrow.toISOString().split('T')[0];
        const defaultTime = '10:00';

        setFormData({
          pickupDate: defaultDate,
          pickupTime: defaultTime,
          pickupPersonId: '',
          notes: ''
        });
      }
    }, [isOpen, request]);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
        const pickupDateTime = new Date(`${formData.pickupDate}T${formData.pickupTime}`);
        
        await onSchedule({
          ...formData,
          pickupDateTime: pickupDateTime.toISOString(),
          requestId: request.id
        });
      } catch (error) {
        console.error('Error scheduling pickup:', error);
      } finally {
        setLoading(false);
      }
    };

    const handleClose = () => {
      setFormData({
        pickupDate: '',
        pickupTime: '',
        pickupPersonId: '',
        notes: ''
      });
      onClose();
    };

    if (!isOpen || !request) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
        <div className="bg-white/95 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200/50 backdrop-blur-sm">
          <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-xl border border-blue-200">
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Schedule Pickup</h2>
                <p className="text-gray-600 mt-1">Schedule e-waste collection for user</p>
              </div>
            </div>
            <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <div className="p-6 border-b border-gray-200/50 bg-gray-50/50 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/50 rounded-xl p-3 border border-gray-200/50 backdrop-blur-sm">
                <p className="text-sm text-gray-600">Device Type</p>
                <p className="font-semibold text-gray-900">{request.deviceType}</p>
              </div>
              <div className="bg-white/50 rounded-xl p-3 border border-gray-200/50 backdrop-blur-sm">
                <p className="text-sm text-gray-600">Brand & Model</p>
                <p className="font-semibold text-gray-900">{request.brand} {request.model}</p>
              </div>
              <div className="bg-white/50 rounded-xl p-3 border border-gray-200/50 backdrop-blur-sm">
                <p className="text-sm text-gray-600">Condition</p>
                <p className="font-semibold text-gray-900 capitalize">{request.condition?.toLowerCase()}</p>
              </div>
              <div className="bg-white/50 rounded-xl p-3 border border-gray-200/50 backdrop-blur-sm">
                <p className="text-sm text-gray-600">Quantity</p>
                <p className="font-semibold text-gray-900">{request.quantity}</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200/50">
              <h4 className="text-md font-semibold text-gray-900 mb-3">User Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 bg-white/50 rounded-xl p-3 border border-gray-200/50 backdrop-blur-sm">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">{request.userName}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/50 rounded-xl p-3 border border-gray-200/50 backdrop-blur-sm">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">{request.userEmail}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/50 rounded-xl p-3 border border-gray-200/50 backdrop-blur-sm col-span-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">
                    Pickup Addr: {request.pickupAddress || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    Pickup Date
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.pickupDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, pickupDate: e.target.value }))}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all rounded-xl outline-none backdrop-blur-sm"
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-purple-500" />
                    Pickup Time
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.pickupTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, pickupTime: e.target.value }))}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all rounded-xl outline-none backdrop-blur-sm"
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4 text-green-500" />
                  Assign Pickup Person
                </label>
                <select
                  required
                  value={formData.pickupPersonId}
                  onChange={(e) => setFormData(prev => ({ ...prev, pickupPersonId: e.target.value }))}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all rounded-xl outline-none backdrop-blur-sm"
                >
                  <option value="">Select pickup person</option>
                  {pickupPersons && pickupPersons.length > 0 ? (
                    pickupPersons.map((person) => (
                      <option key={person.id} value={person.id}>
                        {person.user.name} ({person.user.phoneNumber || 'No Phone'}) - {person.vehicleNumber || 'No Vehicle'}
                      </option>
                    ))
                  ) : (
                    <option disabled>No pickup persons available</option>
                  )}
                </select>
                
                {formData.pickupPersonId && (
                  <div className="mt-3 p-4 bg-blue-50/50 rounded-xl border border-blue-200/50 backdrop-blur-sm">
                    <p className="text-sm font-medium text-blue-700">
                      Selected: {pickupPersons.find(p => p.id === Number(formData.pickupPersonId))?.user.name}
                    </p>
                  </div>
                )}
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-yellow-500" />
                  Additional Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add any special instructions for the pickup person..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all rounded-xl outline-none backdrop-blur-sm resize-none"
                />
              </div>

              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border border-green-200/50 backdrop-blur-sm">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Schedule Summary
                </h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span className="font-medium">Pickup Date:</span>
                    <span>{formData.pickupDate ? new Date(formData.pickupDate).toLocaleDateString() : 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Pickup Time:</span>
                    <span>{formData.pickupTime || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Assigned To:</span>
                    <span>
                      {formData.pickupPersonId 
                        ? pickupPersons.find(p => p.id === Number(formData.pickupPersonId))?.user.name
                        : 'Not assigned'
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-200/50">
              <button 
                type="button" 
                onClick={handleClose} 
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50/50 transition-all duration-300 backdrop-blur-sm hover:shadow-lg"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading || !formData.pickupDate || !formData.pickupTime || !formData.pickupPersonId} 
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium py-3 px-8 rounded-xl flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Scheduling...
                  </>
                ) : (
                  <>
                    <Calendar className="h-4 w-4" />
                    Schedule Pickup
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 space-y-6 relative overflow-hidden bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-64 h-64 opacity-5 animate-recycle-spin-slow"><Recycle className="w-full h-full text-green-400" /></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 opacity-5 animate-recycle-spin-reverse"><Recycle className="w-full h-full text-blue-400" /></div>
        <div className="absolute top-1/4 right-1/4 w-48 h-48 opacity-5 animate-recycle-spin-medium"><Recycle className="w-full h-full text-purple-400" /></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden backdrop-blur-sm bg-white/10 border border-white/20">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30"><Package className="h-6 w-6" /></div>
                  <div><h1 className="text-2xl md:text-3xl font-bold">Manage Requests</h1><p className="text-green-100 text-lg">Review and manage all e-waste collection requests</p></div>
                </div>
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/30"><Recycle className="h-4 w-4 text-green-300" /><span className="text-sm font-medium">{requests.length} Total Requests</span></div>
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/30"><Clock className="h-4 w-4 text-yellow-300" /><span className="text-sm font-medium">{requests.filter(r => r.status === 'PENDING').length} Pending</span></div>
                </div>
              </div>
              <Link to="/admin" className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all duration-300"><div className="flex items-center gap-3"><ArrowLeft className="h-5 w-5 text-white" /><div><p className="text-sm text-green-100 font-medium">Back to Dashboard</p></div></div></Link>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/80 rounded-2xl shadow-lg border border-gray-200/50 backdrop-blur-sm p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 group relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input type="text" placeholder="Search requests..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all rounded-xl outline-none backdrop-blur-sm" />
            </div>
            <div className="w-full md:w-48 group relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all rounded-xl outline-none backdrop-blur-sm appearance-none">
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="COLLECTED">Collected</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-white/80 rounded-2xl shadow-lg border border-gray-200/50 backdrop-blur-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200/50">
              <thead className="bg-gray-50/50 backdrop-blur-sm">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Request Details</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">User Information</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white/50 divide-y divide-gray-200/50">
                {filteredRequests.map((request) => {
                  const StatusIcon = getStatusIcon(request.status);
                  return (
                    <tr key={request.id} className="hover:bg-gray-50/50 transition-colors duration-200 group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl border backdrop-blur-sm group-hover:scale-110 transition-transform ${getStatusColor(request.status)}`}>
                            <StatusIcon className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">{request.deviceType}</div>
                            <div className="text-sm text-gray-600">{request.brand} {request.model}</div>
                            <div className="text-xs text-gray-500">Qty: {request.quantity} • {request.condition?.toLowerCase()}</div>
                            
                            {/* --- PICKUP ADDRESS DISPLAY --- */}
                            <div className="text-xs text-blue-600 flex items-center gap-1 mt-1 font-medium bg-blue-50 px-2 py-1 rounded-md border border-blue-100 inline-flex">
                                <MapPin className="h-3 w-3" />
                                {request.pickupAddress || 'No Pickup Address'}
                            </div>
                            {/* ---------------------------------- */}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="font-medium text-gray-900">{request.userName}</div>
                          {/* --- UPDATED: EMAIL WITH ICON --- */}
                          <div className="text-sm text-gray-600 flex items-center gap-1">
                             <Mail className="h-3 w-3" />
                             {request.userEmail}
                          </div>
                          {/* --- ADDED: PHONE NUMBER --- */}
                          {request.userContactInfo && (
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {request.userContactInfo}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium capitalize backdrop-blur-sm border ${getStatusColor(request.status)}`}>
                          <StatusIcon className="h-3 w-3 mr-1.5" />
                          {request.status.toLowerCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => setSelectedRequest(request)} className="p-2 text-gray-400 hover:text-green-600 bg-gray-50 hover:bg-green-50 rounded-xl border border-gray-200 hover:border-green-200 transition-all duration-300 backdrop-blur-sm group/eye" title="View Details">
                            <Eye className="h-4 w-4 group-hover/eye:scale-110 transition-transform" />
                          </button>
                          <div className="relative">
                            <button onClick={() => setActionMenu(actionMenu === request.id ? null : request.id)} className="p-2 text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-300 backdrop-blur-sm group/menu" title="More Actions">
                              <MoreVertical className="h-4 w-4 group-hover/menu:scale-110 transition-transform" />
                            </button>
                            {actionMenu === request.id && (
                              <div className="absolute right-0 mt-2 w-56 bg-white/95 rounded-2xl shadow-xl border border-gray-200/50 backdrop-blur-sm z-50 overflow-hidden">
                                <div className="py-2">
                                  {request.status === 'PENDING' && (
                                    <>
                                      <button onClick={() => updateRequestStatus(request.id, 'APPROVED')} className="flex items-center w-full px-4 py-3 text-sm text-green-700 hover:bg-green-50/50 transition-colors gap-3"><CheckCircle className="h-4 w-4" /> Approve Request</button>
                                      <button onClick={() => { const reason = prompt('Enter rejection reason:'); if (reason) updateRequestStatus(request.id, 'REJECTED', reason); }} className="flex items-center w-full px-4 py-3 text-sm text-red-700 hover:bg-red-50/50 transition-colors gap-3"><XCircle className="h-4 w-4" /> Reject Request</button>
                                    </>
                                  )}
                                  {request.status === 'APPROVED' && (
                                    <button onClick={() => setScheduleModal(request)} className="flex items-center w-full px-4 py-3 text-sm text-blue-700 hover:bg-blue-50/50 transition-colors gap-3"><Truck className="h-4 w-4" /> Schedule Pickup</button>
                                  )}
                                  {(request.status === 'SCHEDULED' || request.status === 'COLLECTED') && (
                                    <button onClick={() => updateRequestStatus(request.id, 'COMPLETED')} className="flex items-center w-full px-4 py-3 text-sm text-green-700 hover:bg-green-50/50 transition-colors gap-3"><CheckCircle className="h-4 w-4" /> {request.status === 'COLLECTED' ? 'Verify & Complete' : 'Mark Complete'}</button>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredRequests.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-gray-50/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-gray-200/50"><AlertCircle className="h-10 w-10 text-gray-400" /></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No requests found</h3>
              <p className="text-gray-600">{requests.length === 0 ? "There are no e-waste collection requests yet." : "No requests match your current filters."}</p>
            </div>
          )}
        </div>
      </div>

      {/* Schedule Pickup Modal */}
      <SchedulePickupModal isOpen={!!scheduleModal} onClose={() => setScheduleModal(null)} request={scheduleModal} onSchedule={schedulePickup} pickupPersons={pickupPersonsList} />

      {/* Request Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white/95 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200/50 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3"><div className="p-2 bg-green-100 rounded-xl border border-green-200"><Eye className="h-6 w-6 text-green-600" /></div><h2 className="text-2xl font-bold text-gray-900">Request Details</h2></div>
                <button onClick={() => setSelectedRequest(null)} className="text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-gray-100 transition-colors"><XCircle className="h-6 w-6" /></button>
              </div>
              <div className="space-y-6">
                {/* --- DISPLAYING IMAGES --- */}
                {selectedRequest.imageUrls && (
                  <div className="mt-4 border-b border-gray-100 pb-4">
                    <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2"><ImageIcon className="h-4 w-4 text-purple-500" /> Submitted Images</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {selectedRequest.imageUrls.split(',').map((url, index) => (
                        <a key={index} href={`http://localhost:8080${url}`} target="_blank" rel="noopener noreferrer" className="block relative h-24 rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow group">
                          <img src={`http://localhost:8080${url}`} alt={`Proof ${index + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                {/* ------------------------- */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">User Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-200/50 backdrop-blur-sm"><label className="block text-sm font-medium text-gray-700 mb-2">Name</label><p className="text-lg font-semibold text-gray-900">{selectedRequest.userName}</p></div>
                    <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-200/50 backdrop-blur-sm"><label className="block text-sm font-medium text-gray-700 mb-2">Email</label><p className="text-lg font-semibold text-gray-900">{selectedRequest.userEmail}</p></div>
                    <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-200/50 backdrop-blur-sm"><label className="block text-sm font-medium text-gray-700 mb-2">Pickup Address</label><p className="text-lg font-semibold text-gray-900">{selectedRequest.pickupAddress || 'N/A'}</p></div>
                    <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-200/50 backdrop-blur-sm"><label className="block text-sm font-medium text-gray-700 mb-2">Phone</label><p className="text-lg font-semibold text-gray-900">{selectedRequest.userContactInfo || 'N/A'}</p></div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end pt-6 mt-6 border-t border-gray-200/50">
                <button onClick={() => setSelectedRequest(null)} className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium py-3 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS */}
      <style>{`
        @keyframes recycle-spin-slow { from { transform: rotate(0deg) scale(1); } to { transform: rotate(360deg) scale(1); } }
        @keyframes recycle-spin-medium { from { transform: rotate(0deg) scale(1.1); } to { transform: rotate(360deg) scale(1.1); } }
        @keyframes recycle-spin-reverse { from { transform: rotate(360deg) scale(1); } to { transform: rotate(0deg) scale(1); } }
        .animate-recycle-spin-slow { animation: recycle-spin-slow 20s linear infinite; }
        .animate-recycle-spin-medium { animation: recycle-spin-slow 15s linear infinite; }
        .animate-recycle-spin-reverse { animation: recycle-spin-reverse 25s linear infinite; }
      `}</style>
    </div>
  );
};

export default AdminRequests;