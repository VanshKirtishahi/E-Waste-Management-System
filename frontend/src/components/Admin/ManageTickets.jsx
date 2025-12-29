import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Send, 
  ArrowLeft,
  RefreshCw,
  User,
  Mail,
  Phone,
  FileText,
  Shield,
  Recycle,
  TrendingUp,
  MoreVertical,
  Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ManageTickets = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    resolved: 0,
    pending: 0
  });

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/support/admin/all');
      setQueries(response.data);
      calculateStats(response.data);
    } catch (error) {
      console.error("Error fetching support queries", error);
      // Fallback mock data
      const mockQueries = [
        {
          id: 1,
          subject: 'Pickup schedule issue',
          category: 'Pickup Issues',
          description: 'My scheduled pickup was missed yesterday. I was waiting from 2-4 PM but no one showed up.',
          status: 'Open',
          createdAt: '2024-03-20T10:30:00',
          user: { name: 'John Doe', email: 'john@example.com', phoneNumber: '1234567890' },
          adminReply: null,
          relatedRequestId: 123
        },
        {
          id: 2,
          subject: 'App login problem',
          category: 'App Technical Issues',
          description: 'Unable to login to my account. Getting "Invalid credentials" error even though password is correct.',
          status: 'Resolved',
          createdAt: '2024-03-18T14:20:00',
          user: { name: 'Jane Smith', email: 'jane@example.com', phoneNumber: '0987654321' },
          adminReply: 'We have reset your password. Please check your email for the new temporary password.',
          resolvedAt: '2024-03-19T09:15:00',
          relatedRequestId: null
        },
        {
          id: 3,
          subject: 'Billing inquiry',
          category: 'Billing Questions',
          description: 'I was charged for a pickup service but it should have been free according to your policy.',
          status: 'Open',
          createdAt: '2024-03-21T16:45:00',
          user: { name: 'Mike Johnson', email: 'mike@example.com', phoneNumber: '555-0123' },
          adminReply: null,
          relatedRequestId: 456
        }
      ];
      setQueries(mockQueries);
      calculateStats(mockQueries);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (ticketData) => {
    const total = ticketData.length;
    const open = ticketData.filter(t => t.status === 'Open').length;
    const resolved = ticketData.filter(t => t.status === 'Resolved').length;
    const pending = ticketData.filter(t => t.status === 'Pending').length;
    
    setStats({ total, open, resolved, pending });
  };

  const handleReply = async (ticketId) => {
    if (!replyText.trim()) return;

    try {
      await axios.put(`http://localhost:8080/api/support/admin/${ticketId}/reply`, {
        reply: replyText
      });
      
      alert('Reply sent successfully');
      setReplyText('');
      setSelectedTicket(null);
      fetchQueries();
    } catch (error) {
      console.error("Error sending reply", error);
      alert('Failed to send reply');
    }
  };

  const updateTicketStatus = async (ticketId, newStatus) => {
    try {
      await axios.put(`http://localhost:8080/api/support/admin/${ticketId}/status`, {
        status: newStatus
      });
      
      alert(`Ticket marked as ${newStatus}`);
      fetchQueries();
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket({ ...selectedTicket, status: newStatus });
      }
    } catch (error) {
      console.error("Error updating ticket status", error);
      alert('Failed to update ticket status');
    }
  };

  const filteredQueries = queries.filter(q => {
    const matchesFilter = filter === 'ALL' || q.status === filter.toUpperCase();
    const matchesSearch = q.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         q.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         q.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'Resolved': return 'bg-green-100 text-green-800 border border-green-200';
      case 'Pending': return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'Closed': return 'bg-gray-100 text-gray-800 border border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Open': return <AlertCircle className="h-4 w-4" />;
      case 'Resolved': return <CheckCircle className="h-4 w-4" />;
      case 'Pending': return <Clock className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  if (loading && queries.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading support tickets...</p>
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
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">Support Tickets Management</h1>
                    <p className="text-green-100 text-lg">Manage user inquiries and provide timely support</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/30">
                    <MessageSquare className="h-4 w-4 text-green-300" />
                    <span className="text-sm font-medium">{stats.total} Total Tickets</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/30">
                    <AlertCircle className="h-4 w-4 text-yellow-300" />
                    <span className="text-sm font-medium">{stats.open} Open</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/30">
                    <CheckCircle className="h-4 w-4 text-blue-300" />
                    <span className="text-sm font-medium">{stats.resolved} Resolved</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/30">
                    <Clock className="h-4 w-4 text-purple-300" />
                    <span className="text-sm font-medium">{stats.pending} Pending</span>
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
                  placeholder="Search tickets by subject, user name, or email..."
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
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-full sm:w-48 pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all rounded-xl outline-none backdrop-blur-sm appearance-none"
                  >
                    <option value="ALL">All Status</option>
                    <option value="Open">Open Only</option>
                    <option value="Resolved">Resolved Only</option>
                    <option value="Pending">Pending Only</option>
                  </select>
                </div>
              </div>
              
              <button 
                onClick={fetchQueries}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-3 text-gray-600 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-all duration-300 backdrop-blur-sm"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:block">Refresh</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Tickets List */}
          <div className="lg:col-span-1 space-y-4 h-[calc(100vh-300px)] overflow-y-auto pr-2">
            {filteredQueries.length === 0 ? (
              <div className="bg-white/80 rounded-2xl shadow-lg border border-gray-200/50 backdrop-blur-sm p-12 text-center">
                <div className="bg-gray-50/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-gray-200/50">
                  <MessageSquare className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {queries.length === 0 ? 'No Tickets Found' : 'No Matching Results'}
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  {queries.length === 0 
                    ? 'There are no support tickets in the system yet.'
                    : 'No tickets match your search criteria. Try adjusting your filters.'
                  }
                </p>
              </div>
            ) : (
              filteredQueries.map(ticket => (
                <div 
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className={`bg-white/80 rounded-2xl border backdrop-blur-sm p-6 cursor-pointer transition-all duration-300 hover:shadow-xl group ${
                    selectedTicket?.id === ticket.id 
                      ? 'bg-blue-50/80 border-blue-300 ring-2 ring-blue-300' 
                      : 'border-gray-200/50 hover:border-green-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm border flex items-center gap-1.5 ${getStatusColor(ticket.status)}`}>
                      {getStatusIcon(ticket.status)}
                      {ticket.status}
                    </span>
                    <span className="text-xs text-gray-400 bg-gray-50/50 px-2 py-1 rounded-lg border border-gray-200/50">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors line-clamp-2">
                    {ticket.subject}
                  </h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 bg-gray-50/50 px-2 py-1 rounded-lg border border-gray-200/50 inline-block">
                        {ticket.category}
                      </p>
                      <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {ticket.user.name || ticket.user.email}
                      </p>
                    </div>
                    {ticket.relatedRequestId && (
                      <span className="text-xs text-blue-600 bg-blue-50/50 px-2 py-1 rounded-lg border border-blue-200/50">
                        Req #{ticket.relatedRequestId}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Ticket Detail & Reply View */}
          <div className="lg:col-span-2 bg-white/80 rounded-2xl border border-gray-200/50 shadow-lg backdrop-blur-sm h-[calc(100vh-300px)] flex flex-col">
            {selectedTicket ? (
              <>
                {/* Header */}
                <div className="p-6 border-b border-gray-200/50">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-green-100 rounded-xl border border-green-200">
                          <MessageSquare className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-gray-900">{selectedTicket.subject}</h2>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className="bg-gray-50/50 px-3 py-1 rounded-lg text-sm text-gray-600 border border-gray-200/50">
                              Category: {selectedTicket.category}
                            </span>
                            {selectedTicket.relatedRequestId && (
                              <span className="bg-blue-50/50 px-3 py-1 rounded-lg text-sm text-blue-600 border border-blue-200/50">
                                Related to Request #{selectedTicket.relatedRequestId}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-white">
                            {selectedTicket.user.name ? selectedTicket.user.name.charAt(0).toUpperCase() : 'U'}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{selectedTicket.user.name || 'Unknown User'}</p>
                          <p className="text-xs text-gray-500">{selectedTicket.user.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chat Content */}
                <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-gray-50/30">
                  {/* User Message */}
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-white">U</span>
                    </div>
                    <div className="bg-white/80 p-4 rounded-2xl rounded-tl-none border border-gray-200/50 shadow-sm max-w-[80%] backdrop-blur-sm">
                      <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{selectedTicket.description}</p>
                      <p className="text-xs text-gray-400 mt-3 text-right flex items-center justify-end gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(selectedTicket.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Admin Reply (if exists) */}
                  {selectedTicket.adminReply && (
                    <div className="flex gap-4 flex-row-reverse">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-white">A</span>
                      </div>
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-2xl rounded-tr-none shadow-md max-w-[80%] backdrop-blur-sm">
                        <p className="whitespace-pre-wrap leading-relaxed">{selectedTicket.adminReply}</p>
                        <p className="text-xs text-blue-200 mt-3 text-right flex items-center justify-end gap-1">
                          <CheckCircle className="h-3 w-3" />
                          {selectedTicket.resolvedAt ? new Date(selectedTicket.resolvedAt).toLocaleString() : 'Replied'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Reply Input Area */}
                {selectedTicket.status === 'Open' ? (
                  <div className="p-6 border-t border-gray-200/50 bg-white/50 rounded-b-2xl backdrop-blur-sm">
                    <div className="space-y-4">
                      <div className="relative group">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Type your professional reply here... Remember to be helpful and clear."
                          className="w-full p-4 pr-24 bg-white/80 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-green-500 outline-none resize-none h-32 backdrop-blur-sm transition-all duration-300"
                        ></textarea>
                        <div className="absolute right-3 bottom-3 flex gap-2">
                          <button
                            onClick={() => updateTicketStatus(selectedTicket.id, 'Resolved')}
                            className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            title="Mark as Resolved"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleReply(selectedTicket.id)}
                            disabled={!replyText.trim()}
                            className="p-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:hover:from-green-600 disabled:hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
                          >
                            <Send className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>Provide clear and helpful responses to resolve user issues</span>
                        <span>{replyText.length}/1000 characters</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 border-t border-gray-200/50 bg-green-50/50 text-center text-green-800 text-sm font-medium rounded-b-2xl backdrop-blur-sm">
                    <CheckCircle className="inline-block w-5 h-5 mr-2" />
                    This ticket has been resolved and is closed for further replies.
                  </div>
                )}
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 p-12">
                <div className="bg-gray-50/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-gray-200/50">
                  <MessageSquare className="h-10 w-10 text-gray-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-500 mb-2">No Ticket Selected</h3>
                <p className="text-gray-400 text-center max-w-md">
                  Select a support ticket from the list to view details and respond to user inquiries.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

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
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default ManageTickets;