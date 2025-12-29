import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { 
  Plus, 
  HelpCircle, 
  Mail, 
  Phone, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  MessageSquare, 
  Award, 
  Recycle, 
  TrendingUp,
  ArrowLeft,
  Search,
  Filter,
  RefreshCw,
  Clock,
  User,
  Shield,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';

const QueriesSupport = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('faq');
  const [openFaq, setOpenFaq] = useState(null);
  
  // Data States
  const [requests, setRequests] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    resolved: 0,
    pending: 0
  });
  
  const [newTicket, setNewTicket] = useState({
    subject: '',
    category: '',
    relatedRequestId: '',
    description: ''
  });

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const [reqResponse, ticketResponse] = await Promise.all([
          axios.get('http://localhost:8080/api/requests/user'),
          axios.get('http://localhost:8080/api/support/my-tickets')
        ]);
        
        setRequests(reqResponse.data);
        setTickets(ticketResponse.data);
        calculateStats(ticketResponse.data);
      } catch (error) {
        console.error("Error loading support data", error);
        // Fallback mock data
        const mockTickets = [
          {
            id: 1,
            subject: 'Pickup schedule issue',
            category: 'Pickup Issues',
            description: 'My scheduled pickup was missed yesterday.',
            status: 'Open',
            createdAt: '2024-03-20',
            adminReply: null
          },
          {
            id: 2,
            subject: 'App login problem',
            category: 'App Technical Issues',
            description: 'Unable to login to my account.',
            status: 'Resolved',
            createdAt: '2024-03-18',
            adminReply: 'We have reset your password. Please check your email.',
            resolvedAt: '2024-03-19'
          }
        ];
        setTickets(mockTickets);
        calculateStats(mockTickets);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const calculateStats = (ticketData) => {
    const total = ticketData.length;
    const open = ticketData.filter(t => t.status === 'Open').length;
    const resolved = ticketData.filter(t => t.status === 'Resolved').length;
    const pending = ticketData.filter(t => t.status === 'Pending').length;
    
    setStats({ total, open, resolved, pending });
  };

  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        subject: newTicket.subject,
        category: newTicket.category,
        description: newTicket.description,
        relatedRequestId: newTicket.relatedRequestId || null
      };

      const response = await axios.post('http://localhost:8080/api/support/create', payload);
      
      setTickets([response.data, ...tickets]);
      calculateStats([response.data, ...tickets]);
      
      setNewTicket({ subject: '', category: '', relatedRequestId: '', description: '' });
      setActiveTab('tickets');
      alert("Ticket created successfully!");
    } catch (error) {
      console.error("Error creating ticket", error);
      alert("Failed to create ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'Resolved': return 'bg-green-100 text-green-800 border border-green-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
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

  const faqItems = [
    {
      question: 'What types of electronic devices do you accept?',
      answer: 'We accept most electronic devices including laptops, desktops, smartphones, tablets, monitors, printers, and small household appliances. We also take batteries, cables, and other electronic accessories.'
    },
    {
      question: 'How should I prepare my device for pickup?',
      answer: 'Please back up and wipe all personal data from your devices. For computers and phones, perform a factory reset. Remove any batteries from devices if possible and pack items securely.'
    },
    {
      question: 'Is there any cost for the pickup service?',
      answer: 'Our basic pickup service is free for most residential customers. For large quantities or commercial pickups, please contact us for a customized quote.'
    },
    {
      question: 'How do I cancel a scheduled pickup?',
      answer: 'You can cancel a pickup by raising a ticket here with the category "Pickup Issues" or calling our hotline at least 2 hours before the scheduled time.'
    },
    {
      question: 'What happens to my e-waste after pickup?',
      answer: 'All collected e-waste is processed at certified recycling facilities where materials are safely extracted and recycled according to environmental standards.'
    },
    {
      question: 'How long does the pickup process take?',
      answer: 'Our pickup team typically completes collection within 15-30 minutes depending on the quantity and type of items. Please ensure someone is available during the scheduled time.'
    }
  ];

  const ticketCategories = ['Pickup Issues', 'App Technical Issues', 'Billing Questions', 'General Inquiries', 'Report a Bug', 'Account Issues', 'Other'];

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
                    <HelpCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">Help & Support Center</h1>
                    <p className="text-green-100 text-lg">Get assistance and track your support tickets</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/30">
                    <FileText className="h-4 w-4 text-green-300" />
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
                to="/dashboard" 
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

        {/* Navigation Tabs */}
        <div className="bg-white/80 rounded-2xl shadow-lg border border-gray-200/50 backdrop-blur-sm">
          <div className="border-b border-gray-200/50">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'faq', name: 'FAQ', icon: HelpCircle, count: faqItems.length },
                { id: 'ticket', name: 'Create Ticket', icon: Plus },
                { id: 'tickets', name: 'My Tickets', icon: FileText, count: stats.total },
                { id: 'contact', name: 'Contact Info', icon: Phone }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-all duration-300 ${
                    activeTab === tab.id 
                      ? 'border-green-500 text-green-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.name}
                  {tab.count && (
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      activeTab === tab.id 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            
            {/* FAQ Tab */}
            {activeTab === 'faq' && (
              <div className="space-y-4 max-w-4xl">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h2>
                  <p className="text-gray-600">Find quick answers to common questions about our e-waste services</p>
                </div>
                {faqItems.map((faq, index) => (
                  <div key={index} className="bg-white/50 rounded-2xl p-6 border border-gray-200/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group">
                    <button
                      className="flex justify-between items-center w-full text-left"
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-green-100 rounded-xl border border-green-200 group-hover:scale-110 transition-transform">
                          <HelpCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 text-lg group-hover:text-green-600 transition-colors">{faq.question}</h3>
                      </div>
                      {openFaq === index ? 
                        <ChevronUp className="h-5 w-5 text-gray-400 group-hover:text-green-600 transition-colors"/> : 
                        <ChevronDown className="h-5 w-5 text-gray-400 group-hover:text-green-600 transition-colors"/>
                      }
                    </button>
                    {openFaq === index && (
                      <div className="mt-4 pl-12">
                        <div className="bg-green-50/50 rounded-xl p-4 border border-green-200/50">
                          <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Create Ticket Tab */}
            {activeTab === 'ticket' && (
              <div className="max-w-4xl">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Support Ticket</h2>
                  <p className="text-gray-600">Submit a detailed description of your issue and we'll get back to you soon</p>
                </div>
                <form onSubmit={handleSubmitTicket} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <Filter className="h-4 w-4 text-blue-500" />
                        Category *
                      </label>
                      <select
                        required
                        value={newTicket.category}
                        onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all rounded-xl outline-none backdrop-blur-sm"
                      >
                        <option value="">Select Category</option>
                        {ticketCategories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-purple-500" />
                        Related Request
                      </label>
                      <select
                        value={newTicket.relatedRequestId}
                        onChange={(e) => setNewTicket({ ...newTicket, relatedRequestId: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all rounded-xl outline-none backdrop-blur-sm"
                      >
                        <option value="">None</option>
                        {requests.map(req => (
                          <option key={req.id} value={req.id}>#{req.id} - {req.deviceType}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-green-500" />
                      Subject *
                    </label>
                    <input
                      type="text"
                      required
                      value={newTicket.subject}
                      onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all rounded-xl outline-none backdrop-blur-sm"
                      placeholder="Brief summary of your issue..."
                    />
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-orange-500" />
                      Description *
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={newTicket.description}
                      onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all rounded-xl outline-none backdrop-blur-sm resize-none"
                      placeholder="Please provide detailed information about your issue..."
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-200/50">
                    <button
                      type="button"
                      onClick={() => setNewTicket({ subject: '', category: '', relatedRequestId: '', description: '' })}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50/50 transition-all duration-300 backdrop-blur-sm hover:shadow-lg"
                    >
                      Clear Form
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium py-3 px-8 rounded-xl flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4" />
                          Submit Ticket
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* My Tickets Tab */}
            {activeTab === 'tickets' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">My Support Tickets</h2>
                    <p className="text-gray-600">Track the status of all your support requests</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('ticket')}
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium py-3 px-6 rounded-xl flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <Plus className="h-4 w-4" />
                    New Ticket
                  </button>
                </div>

                {tickets.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="bg-gray-50/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-gray-200/50">
                      <FileText className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Tickets Found</h3>
                    <p className="text-gray-600 max-w-md mx-auto mb-6">
                      You haven't created any support tickets yet. Start by creating your first ticket to get help.
                    </p>
                    <button 
                      onClick={() => setActiveTab('ticket')}
                      className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium py-3 px-8 rounded-xl inline-flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <Plus className="h-4 w-4" />
                      Create First Ticket
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tickets.map(ticket => (
                      <div key={ticket.id} className="bg-white/50 rounded-2xl border border-gray-200/50 backdrop-blur-sm p-6 hover:shadow-lg transition-all duration-300 group">
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="p-2 bg-blue-100 rounded-xl border border-blue-200">
                                <FileText className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="font-bold text-lg text-gray-900 group-hover:text-green-600 transition-colors">
                                  {ticket.subject}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  ID: #{ticket.id} • {ticket.category} • {new Date(ticket.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm border flex items-center gap-1.5 ${getStatusColor(ticket.status)}`}>
                              {getStatusIcon(ticket.status)}
                              {ticket.status}
                            </span>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-200/50 text-gray-700 mb-4">
                          {ticket.description}
                        </div>

                        {/* Display Admin Reply if exists */}
                        {ticket.adminReply && (
                          <div className="bg-green-50/50 p-4 rounded-xl border border-green-200/50">
                            <div className="flex items-center gap-2 mb-2 text-green-800 font-semibold">
                              <MessageSquare className="h-4 w-4" /> 
                              Admin Response
                            </div>
                            <p className="text-green-800 text-sm">{ticket.adminReply}</p>
                            {ticket.resolvedAt && (
                              <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                Resolved on: {new Date(ticket.resolvedAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Contact Info Tab */}
            {activeTab === 'contact' && (
              <div className="max-w-4xl">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Information</h2>
                  <p className="text-gray-600">Get in touch with our support team through multiple channels</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden backdrop-blur-sm border border-white/20">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30">
                          <Mail className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-semibold">Email Support</h3>
                      </div>
                      <p className="text-blue-100 mb-2">For detailed inquiries and documentation</p>
                      <p className="font-semibold text-lg">support@ecowaste.com</p>
                      <p className="text-blue-100 text-sm mt-2">Response time: Within 24 hours</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden backdrop-blur-sm border border-white/20">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30">
                          <Phone className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-semibold">Phone Support</h3>
                      </div>
                      <p className="text-green-100 mb-2">For urgent issues and immediate assistance</p>
                      <p className="font-semibold text-lg">+1 (555) 012-3456</p>
                      <p className="text-green-100 text-sm mt-2">Available: Mon-Fri, 9AM-6PM EST</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-white/50 rounded-2xl p-6 border border-gray-200/50 backdrop-blur-sm">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-orange-500" />
                    Support Hours & Response Times
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <p className="font-medium text-gray-900">Email Support</p>
                      <p>Response within 24 hours</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Phone Support</p>
                      <p>Mon-Fri: 9:00 AM - 6:00 PM EST</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Emergency Pickup Issues</p>
                      <p>24/7 hotline available</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Ticket Priority</p>
                      <p>Urgent issues: 2-4 hour response</p>
                    </div>
                  </div>
                </div>
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
      `}</style>
    </div>
  );
};

export default QueriesSupport;