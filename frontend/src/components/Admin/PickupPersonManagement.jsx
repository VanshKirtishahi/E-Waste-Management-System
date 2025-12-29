import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeft, Plus, Search, User, Mail, Phone, MapPin, Car, Users,
  CheckCircle, XCircle, Recycle, Truck, Edit3, Trash2, Eye, MoreVertical, 
  Download, Filter, Star, Award
} from 'lucide-react';

const PickupPersonManagement = () => {
  const [pickupPersons, setPickupPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [actionMenu, setActionMenu] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    withVehicles: 0,
    completedPickups: 0
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: 'password123',
    phone: '',
    vehicleNumber: '',
    address: '',
    available: true
  });
  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    fetchPickupPersons();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [pickupPersons]);

  const fetchPickupPersons = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/admin/pickup-persons');
      setPickupPersons(response.data);
    } catch (error) {
      console.error('Error fetching pickup persons:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const total = pickupPersons.length;
    const active = pickupPersons.filter(p => p.available).length;
    const withVehicles = pickupPersons.filter(p => p.vehicleNumber).length;
    
    setStats({
      total,
      active,
      inactive: total - active,
      withVehicles,
      completedPickups: pickupPersons.reduce((sum, person) => sum + (person.completedPickups || 0), 0)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingAction(true);
    
    // Construct payload explicitly
    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phoneNumber: formData.phone, // Ensure this matches DTO field 'phoneNumber'
      address: formData.address,
      vehicleNumber: formData.vehicleNumber
    };

    console.log("Sending Register Payload:", payload); // DEBUG LOG

    try {
      await axios.post('http://localhost:8080/api/admin/register-pickup-person', payload);

      setShowAddModal(false);
      resetForm();
      fetchPickupPersons();
      alert("Pickup Person Registered Successfully!");
    } catch (error) {
      console.error("Error adding person", error);
      alert(error.response?.data || error.response?.data?.message || "Failed to add pickup person");
    } finally {
      setLoadingAction(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setLoadingAction(true);
    
    try {
      await axios.put(`http://localhost:8080/api/admin/pickup-persons/${selectedPerson.id}`, {
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phone,
        address: formData.address,
        vehicleNumber: formData.vehicleNumber,
        available: formData.available
      });

      setShowEditModal(false);
      resetForm();
      fetchPickupPersons();
      alert("Pickup Person Updated Successfully!");
    } catch (error) {
      console.error("Error updating person", error);
      alert(error.response?.data?.message || "Failed to update pickup person");
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDelete = async (personId) => {
    if (!window.confirm('Are you sure you want to delete this pickup person?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/api/admin/pickup-persons/${personId}`);
      fetchPickupPersons();
      alert("Pickup Person Deleted Successfully!");
    } catch (error) {
      console.error("Error deleting person", error);
      alert(error.response?.data?.message || "Failed to delete pickup person");
    }
  };

  const toggleAvailability = async (person) => {
    try {
      await axios.put(`http://localhost:8080/api/admin/pickup-persons/${person.id}/availability`, {
        available: !person.available
      });
      fetchPickupPersons();
      alert(`Pickup Person ${!person.available ? 'Activated' : 'Deactivated'} Successfully!`);
    } catch (error) {
      console.error("Error toggling availability", error);
      alert(error.response?.data?.message || "Failed to update availability");
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: 'password123',
      phone: '',
      vehicleNumber: '',
      address: '',
      available: true
    });
    setSelectedPerson(null);
  };

  const openEditModal = (person) => {
    setSelectedPerson(person);
    setFormData({
      name: person.user.name,
      email: person.user.email,
      password: '********', 
      phone: person.user.phoneNumber || '',
      vehicleNumber: person.vehicleNumber || '',
      address: person.user.address || '',
      available: person.available
    });
    setShowEditModal(true);
    setActionMenu(null);
  };

  const openDetailModal = (person) => {
    setSelectedPerson(person);
    setShowDetailModal(true);
    setActionMenu(null);
  };

  const filteredPersons = pickupPersons.filter(person =>
    (person.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     person.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
     (person.vehicleNumber && person.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()))) &&
    (statusFilter === 'ALL' || 
     (statusFilter === 'ACTIVE' && person.available) ||
     (statusFilter === 'INACTIVE' && !person.available))
  );

  const getPerformanceRating = (person) => {
    const completed = person.completedPickups || 0;
    if (completed >= 50) return { rating: 5, label: 'Excellent' };
    if (completed >= 25) return { rating: 4, label: 'Good' };
    if (completed >= 10) return { rating: 3, label: 'Average' };
    if (completed >= 1) return { rating: 2, label: 'Beginner' };
    return { rating: 1, label: 'New' };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pickup persons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 space-y-6 relative overflow-hidden bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* ... (Background elements kept same) ... */}
      
      {/* Main Content */}
      <div className="relative z-10 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden backdrop-blur-sm bg-white/10 border border-white/20">
          {/* ... (Header content kept same) ... */}
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30">
                    <Truck className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">Pickup Persons Management</h1>
                    <p className="text-green-100 text-lg">Manage your e-waste collection team members</p>
                  </div>
                </div>
                {/* Stats Row */}
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/30">
                    <Users className="h-4 w-4 text-green-300" />
                    <span className="text-sm font-medium">{stats.total} Total</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/30">
                    <CheckCircle className="h-4 w-4 text-yellow-300" />
                    <span className="text-sm font-medium">{stats.active} Active</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/30">
                    <Car className="h-4 w-4 text-blue-300" />
                    <span className="text-sm font-medium">{stats.withVehicles} With Vehicles</span>
                  </div>
                </div>
              </div>
              <Link 
                to="/admin" 
                className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <ArrowLeft className="h-5 w-5 text-white" />
                  <div>
                    <p className="text-sm text-green-100 font-medium">Back to Dashboard</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/80 rounded-2xl shadow-lg border border-gray-200/50 backdrop-blur-sm p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 group">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by name, email, or vehicle number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all rounded-xl outline-none backdrop-blur-sm"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="group">
                <div className="relative">
                  <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full sm:w-48 pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all rounded-xl outline-none backdrop-blur-sm appearance-none"
                  >
                    <option value="ALL">All Status</option>
                    <option value="ACTIVE">Active Only</option>
                    <option value="INACTIVE">Inactive Only</option>
                  </select>
                </div>
              </div>
              
              <button 
                onClick={() => setShowAddModal(true)} 
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium py-3 px-6 rounded-xl flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 whitespace-nowrap"
              >
                <Plus className="h-4 w-4" />
                Add Person
              </button>
            </div>
          </div>
        </div>

        {/* Pickup Persons List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPersons.map((person) => {
            const performance = getPerformanceRating(person);
            return (
              <div key={person.id} className="bg-white/80 rounded-2xl shadow-lg border border-gray-200/50 backdrop-blur-sm p-6 hover:shadow-xl transition-all duration-300 group">
                {/* ... (Person Card Content kept same) ... */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl border backdrop-blur-sm group-hover:scale-110 transition-transform ${
                      person.available 
                        ? 'bg-green-100 border-green-200 text-green-600' 
                        : 'bg-gray-100 border-gray-200 text-gray-600'
                    }`}>
                      <User className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                        {person.user.name}
                      </h3>
                      <p className="text-sm text-gray-500">ID: {person.id}</p>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <button 
                      onClick={() => setActionMenu(actionMenu === person.id ? null : person.id)} 
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                    
                    {actionMenu === person.id && (
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white/95 rounded-xl shadow-xl border border-gray-200/50 backdrop-blur-sm z-10 overflow-hidden">
                        <div className="py-1">
                          <button 
                            onClick={() => openDetailModal(person)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50/50 transition-colors gap-3"
                          >
                            <Eye className="h-4 w-4" />
                            View Details
                          </button>
                          <button 
                            onClick={() => openEditModal(person)}
                            className="flex items-center w-full px-4 py-2 text-sm text-blue-700 hover:bg-blue-50/50 transition-colors gap-3"
                          >
                            <Edit3 className="h-4 w-4" />
                            Edit
                          </button>
                          <button 
                            onClick={() => toggleAvailability(person)}
                            className="flex items-center w-full px-4 py-2 text-sm text-orange-700 hover:bg-orange-50/50 transition-colors gap-3"
                          >
                            {person.available ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                            {person.available ? 'Deactivate' : 'Activate'}
                          </button>
                          <button 
                            onClick={() => handleDelete(person.id)}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50/50 transition-colors gap-3"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-xl border border-gray-200/50 backdrop-blur-sm">
                    <Mail className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium text-gray-900">{person.user.email}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-xl border border-gray-200/50 backdrop-blur-sm">
                    <Phone className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium text-gray-900">{person.user.phoneNumber || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-xl border border-gray-200/50 backdrop-blur-sm">
                    <Car className="h-4 w-4 text-purple-500" />
                    <span className="text-sm font-medium text-gray-900">{person.vehicleNumber || 'No Vehicle'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white/95 rounded-2xl max-w-md w-full border border-gray-200/50 backdrop-blur-sm max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200/50">
                <h3 className="text-2xl font-bold text-gray-900">Add Pickup Person</h3>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Full Name *</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl" />
                </div>
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Email *</label>
                  <input type="email" required value={formData.email} onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl" />
                </div>
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Phone *</label>
                  <input type="tel" required value={formData.phone} onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))} className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl" />
                </div>
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Address</label>
                  <input type="text" value={formData.address} onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))} className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl" />
                </div>
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Vehicle Number</label>
                  <input type="text" value={formData.vehicleNumber} onChange={(e) => setFormData(prev => ({ ...prev, vehicleNumber: e.target.value }))} className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl" />
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200/50">
                  <button type="button" onClick={() => setShowAddModal(false)} className="px-6 py-3 border rounded-xl">Cancel</button>
                  <button type="submit" disabled={loadingAction} className="bg-blue-600 text-white px-8 py-3 rounded-xl">{loadingAction ? 'Adding...' : 'Add'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PickupPersonManagement;