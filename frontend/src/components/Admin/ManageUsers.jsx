import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, 
  Search, 
  Trash2, 
  Edit, 
  Mail, 
  Phone, 
  ShieldAlert, 
  Shield,
  User,
  Filter,
  MoreVertical,
  Eye,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Recycle,
  TrendingUp,
  X,
  Save,
  MapPin,
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [actionMenu, setActionMenu] = useState(null);
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    contactInfo: '',
    role: '',
    status: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/users');
      setUsers(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching users", error);
      setError("Failed to load users. Using mock data.");
      // Fallback mock data
      setUsers([
        { 
          id: 1, 
          name: "John Doe", 
          email: "john@example.com", 
          role: "ROLE_USER", 
          contactInfo: "1234567890",
          status: "ACTIVE",
          joinDate: "2024-01-15",
          lastLogin: "2024-03-20",
          address: "123 Main Street, New York, NY"
        },
        { 
          id: 2, 
          name: "Jane Smith", 
          email: "jane@example.com", 
          role: "ROLE_USER", 
          contactInfo: "0987654321",
          status: "ACTIVE",
          joinDate: "2024-02-10",
          lastLogin: "2024-03-19",
          address: "456 Oak Avenue, Los Angeles, CA"
        },
        { 
          id: 3, 
          name: "Admin User", 
          email: "admin@ewaste.com", 
          role: "ROLE_ADMIN", 
          contactInfo: "N/A",
          status: "ACTIVE",
          joinDate: "2024-01-01",
          lastLogin: "2024-03-20",
          address: "789 Admin Plaza, San Francisco, CA"
        },
        { 
          id: 4, 
          name: "Mike Collector", 
          email: "mike@ewaste.com", 
          role: "ROLE_PICKUP_PERSON", 
          contactInfo: "555-0123",
          status: "ACTIVE",
          joinDate: "2024-02-28",
          lastLogin: "2024-03-18",
          address: "321 Collection Center, Chicago, IL"
        },
        { 
          id: 5, 
          name: "Sarah Wilson", 
          email: "sarah@example.com", 
          role: "ROLE_USER", 
          contactInfo: "555-0456",
          status: "INACTIVE",
          joinDate: "2024-03-01",
          lastLogin: "2024-03-10",
          address: "654 Pine Road, Miami, FL"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // View Details Function
  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
    setActionMenu(null);
  };

  // Edit User Functions
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditFormData({
      name: user.name || '',
      email: user.email || '',
      contactInfo: user.contactInfo || '',
      role: user.role || 'ROLE_USER',
      status: user.status || 'ACTIVE'
    });
    setShowEditModal(true);
    setActionMenu(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      // Simulate API call
      const updatedUser = { ...selectedUser, ...editFormData };
      
      // Update local state
      setUsers(users.map(user => 
        user.id === selectedUser.id ? updatedUser : user
      ));
      
      setShowEditModal(false);
      setSelectedUser(null);
      alert("User updated successfully!");
    } catch (error) {
      console.error("Error updating user", error);
      alert("Failed to update user.");
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        // Simulate API call
        await axios.delete(`/api/admin/users/${userId}`);
        
        // Update local state
        setUsers(users.filter(user => user.id !== userId));
        setActionMenu(null);
        alert("User deleted successfully");
      } catch (error) {
        console.error("Error deleting user", error);
        alert("Failed to delete user.");
      }
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      
      // Simulate API call
      await axios.put(`/api/admin/users/${userId}/status`, { status: newStatus });
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      ));
      
      setActionMenu(null);
      alert(`User ${newStatus.toLowerCase()} successfully`);
    } catch (error) {
      console.error("Error updating user status", error);
      alert("Failed to update user status.");
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'ALL' || 
                       (roleFilter === 'USER' && user.role === 'ROLE_USER') ||
                       (roleFilter === 'ADMIN' && user.role === 'ROLE_ADMIN') ||
                       (roleFilter === 'PICKUP_PERSON' && user.role === 'ROLE_PICKUP_PERSON');
    
    return matchesSearch && matchesRole;
  });

  const getRoleStats = () => {
    const total = users.length;
    const admins = users.filter(u => u.role === 'ROLE_ADMIN').length;
    const pickupPersons = users.filter(u => u.role === 'ROLE_PICKUP_PERSON').length;
    const regularUsers = users.filter(u => u.role === 'ROLE_USER').length;
    const activeUsers = users.filter(u => u.status === 'ACTIVE').length;

    return { total, admins, pickupPersons, regularUsers, activeUsers };
  };

  const stats = getRoleStats();

  if (loading && users.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
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
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">User Management</h1>
                    <p className="text-green-100 text-lg">Manage all registered users and their permissions</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/30">
                    <Users className="h-4 w-4 text-green-300" />
                    <span className="text-sm font-medium">{stats.total} Total Users</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/30">
                    <CheckCircle className="h-4 w-4 text-yellow-300" />
                    <span className="text-sm font-medium">{stats.activeUsers} Active</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/30">
                    <Shield className="h-4 w-4 text-blue-300" />
                    <span className="text-sm font-medium">{stats.admins} Administrators</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/30">
                    <User className="h-4 w-4 text-purple-300" />
                    <span className="text-sm font-medium">{stats.pickupPersons} Pickup Team</span>
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

        {/* Search and Filter Section */}
        <div className="bg-white/80 rounded-2xl shadow-lg border border-gray-200/50 backdrop-blur-sm p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 group">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search users by name or email..."
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
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="w-full sm:w-48 pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all rounded-xl outline-none backdrop-blur-sm appearance-none"
                  >
                    <option value="ALL">All Roles</option>
                    <option value="USER">Regular Users</option>
                    <option value="ADMIN">Administrators</option>
                    <option value="PICKUP_PERSON">Pickup Persons</option>
                  </select>
                </div>
              </div>
              
              <button 
                onClick={fetchUsers}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-3 text-gray-600 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-all duration-300 backdrop-blur-sm"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:block">Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3 backdrop-blur-sm">
            <ShieldAlert className="h-5 w-5 text-yellow-500" />
            <p className="text-yellow-700">{error}</p>
          </div>
        )}

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div key={user.id} className="bg-white/80 rounded-2xl shadow-lg border border-gray-200/50 backdrop-blur-sm p-6 hover:shadow-xl transition-all duration-300 group">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl border backdrop-blur-sm group-hover:scale-110 transition-transform ${
                    user.role === 'ROLE_ADMIN' ? 'bg-purple-100 border-purple-200 text-purple-600' :
                    user.role === 'ROLE_PICKUP_PERSON' ? 'bg-blue-100 border-blue-200 text-blue-600' :
                    'bg-green-100 border-green-200 text-green-600'
                  }`}>
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                      {user.name || 'Unknown User'}
                    </h3>
                    <p className="text-sm text-gray-500">ID: {user.id}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={user.status === 'ACTIVE' ? "text-green-600" : "text-gray-400"}>
                    {user.status === 'ACTIVE' ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                  </span>
                  
                  <div className="relative">
                    <button 
                      onClick={() => setActionMenu(actionMenu === user.id ? null : user.id)} 
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                    
                    {actionMenu === user.id && (
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white/95 rounded-xl shadow-xl border border-gray-200/50 backdrop-blur-sm z-10 overflow-hidden">
                        <div className="py-1">
                          <button 
                            onClick={() => handleViewDetails(user)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50/50 transition-colors gap-3"
                          >
                            <Eye className="h-4 w-4" />
                            View Details
                          </button>
                          <button 
                            onClick={() => handleEditUser(user)}
                            className="flex items-center w-full px-4 py-2 text-sm text-blue-700 hover:bg-blue-50/50 transition-colors gap-3"
                          >
                            <Edit className="h-4 w-4" />
                            Edit User
                          </button>
                          <button 
                            onClick={() => toggleUserStatus(user.id, user.status)}
                            className="flex items-center w-full px-4 py-2 text-sm text-orange-700 hover:bg-orange-50/50 transition-colors gap-3"
                          >
                            {user.status === 'ACTIVE' ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                            {user.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                          </button>
                          {user.role !== 'ROLE_ADMIN' && (
                            <button 
                              onClick={() => handleDelete(user.id)}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50/50 transition-colors gap-3"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete User
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-xl border border-gray-200/50 backdrop-blur-sm">
                  <Mail className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium text-gray-900">{user.email}</span>
                </div>
                
                {user.contactInfo && user.contactInfo !== 'N/A' && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-xl border border-gray-200/50 backdrop-blur-sm">
                    <Phone className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium text-gray-900">{user.contactInfo}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-blue-50/50 rounded-lg p-2 text-center border border-blue-200/50">
                    <p className="text-xs text-blue-600 font-medium">Role</p>
                    <p className="text-sm font-bold text-blue-700">
                      {user.role ? user.role.replace('ROLE_', '') : 'USER'}
                    </p>
                  </div>
                  <div className="bg-green-50/50 rounded-lg p-2 text-center border border-green-200/50">
                    <p className="text-xs text-green-600 font-medium">Joined</p>
                    <p className="text-sm font-bold text-green-700">
                      {user.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200/50 flex justify-between items-center">
                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm border ${
                  user.status === 'ACTIVE'
                    ? 'bg-green-100 text-green-800 border-green-200'
                    : 'bg-gray-100 text-gray-800 border-gray-200'
                }`}>
                  {user.status === 'ACTIVE' ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1.5" />
                      Active Account
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3 w-3 mr-1.5" />
                      Inactive Account
                    </>
                  )}
                </span>
                
                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm border ${
                  user.role === 'ROLE_ADMIN' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                  user.role === 'ROLE_PICKUP_PERSON' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                  'bg-green-100 text-green-800 border-green-200'
                }`}>
                  {user.role ? user.role.replace('ROLE_', '') : 'USER'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="bg-white/80 rounded-2xl shadow-lg border border-gray-200/50 backdrop-blur-sm p-12 text-center">
            <div className="bg-gray-50/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-gray-200/50">
              <Users className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {users.length === 0 ? 'No Users Found' : 'No Matching Results'}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              {users.length === 0 
                ? 'There are no users registered in the system yet.'
                : 'No users match your search criteria. Try adjusting your search terms or filters.'
              }
            </p>
          </div>
        )}
      </div>

      {/* View Details Modal */}
      {showViewModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6 text-white text-center relative">
              <button 
                onClick={() => setShowViewModal(false)} 
                className="absolute top-4 right-4 hover:bg-white/20 p-1 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-md">
                <User className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-bold">{selectedUser.name}</h2>
              <p className="text-green-100">{selectedUser.email}</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-500 uppercase font-semibold">Role</p>
                  <p className="text-gray-800 font-medium">{selectedUser.role.replace('ROLE_', '')}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-500 uppercase font-semibold">Status</p>
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                    selectedUser.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {selectedUser.status}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <span>{selectedUser.contactInfo || 'No phone provided'}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <span>{selectedUser.address || 'No address provided'}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <span>Joined: {selectedUser.joinDate ? new Date(selectedUser.joinDate).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <span>Last Login: {selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex justify-between items-center text-white">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Edit className="h-5 w-5" /> Edit User
              </h3>
              <button 
                onClick={() => setShowEditModal(false)} 
                className="hover:bg-white/20 p-1 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={editFormData.name}
                  onChange={e => setEditFormData({...editFormData, name: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  value={editFormData.email}
                  onChange={e => setEditFormData({...editFormData, email: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input 
                  type="text" 
                  value={editFormData.contactInfo}
                  onChange={e => setEditFormData({...editFormData, contactInfo: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="Optional"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select 
                  value={editFormData.role}
                  onChange={e => setEditFormData({...editFormData, role: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                >
                  <option value="ROLE_USER">User</option>
                  <option value="ROLE_PICKUP_PERSON">Pickup Person</option>
                  <option value="ROLE_ADMIN">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select 
                  value={editFormData.status}
                  onChange={e => setEditFormData({...editFormData, status: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <Save className="h-4 w-4" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Close action menu when clicking outside */}
      {actionMenu && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setActionMenu(null)}
        />
      )}

      {/* Custom CSS for Animations */}
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

export default ManageUsers;