import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { Download, FileText, Award, Shield, FileDown, TrendingUp, Recycle, BarChart3, Users, Leaf, Zap, ChevronDown, ChevronUp, CheckCircle, AlertCircle } from 'lucide-react';

const Reports = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [selectedReport, setSelectedReport] = useState('statement');
  
  // Dynamic Annual Stats
  const [annualSummary, setAnnualSummary] = useState({
    year: new Date().getFullYear(),
    totalItems: 0,
    totalWeight: 0,
    co2Saved: 0,
    requests: 0,
    favoriteDevice: 'N/A'
  });

  const reportTypes = [
    {
      id: 'statement',
      name: 'Recycling Statement',
      description: 'Detailed summary of all recycled items within a date range',
      icon: FileText,
      color: 'blue'
    },
    {
      id: 'certificate',
      name: 'Appreciation Certificate',
      description: 'Official certificate for your environmental contribution (Requires 10+ items)',
      icon: Shield,
      color: 'green'
    },
    {
      id: 'annual',
      name: 'Annual Summary',
      description: 'Yearly overview of your environmental impact',
      icon: Award,
      color: 'purple'
    },
    {
      id: 'export',
      name: 'Export Data',
      description: 'Export your complete recycling history in CSV format',
      icon: FileDown,
      color: 'yellow'
    }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/requests/user');
      const data = response.data;
      setRequests(data);
      calculateAnnualStats(data);
    } catch (error) {
      console.error("Error fetching reports data", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAnnualStats = (data) => {
    const currentYear = new Date().getFullYear();
    const yearRequests = data.filter(req => {
      const reqDate = new Date(req.createdAt);
      const reqYear = reqDate.getFullYear();
      return reqYear === currentYear && (req.status === 'COMPLETED' || req.status === 'COLLECTED');
    });

    const totalItems = yearRequests.reduce((sum, req) => sum + (req.quantity || 1), 0);
    const totalWeight = yearRequests.reduce((sum, req) => sum + ((req.quantity || 1) * 1.5), 0);
    const co2Saved = totalItems * 2.5;

    const deviceCounts = {};
    yearRequests.forEach(req => {
      const type = req.deviceType || 'Unknown';
      deviceCounts[type] = (deviceCounts[type] || 0) + 1;
    });
    
    const favoriteDevice = Object.keys(deviceCounts).length > 0 
      ? Object.keys(deviceCounts).sort((a, b) => deviceCounts[b] - deviceCounts[a])[0] 
      : 'N/A';

    setAnnualSummary({
      year: currentYear,
      totalItems,
      totalWeight: parseFloat(totalWeight.toFixed(1)),
      co2Saved: parseFloat(co2Saved.toFixed(1)),
      requests: yearRequests.length,
      favoriteDevice
    });
  };

  const handleDownloadPDF = async (url, filename) => {
    try {
      const response = await axios.get(url, { responseType: 'blob' });
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download failed", error);
      alert("Failed to download report. Please try again.");
    }
  };

  const generateCSV = (data, filename) => {
    if (!data || data.length === 0) {
      alert("No data available to export.");
      return;
    }

    const headers = ["Request ID", "Device", "Brand", "Model", "Quantity", "Status", "Date", "Address"];
    const rows = data.map(req => [
      req.id,
      req.deviceType,
      req.brand,
      req.model,
      req.quantity,
      req.status,
      new Date(req.createdAt).toLocaleDateString(),
      `"${req.pickupAddress}"`
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleGenerateReport = (reportType) => {
    if (reportType === 'certificate') {
      const userName = user?.name || 'User';
      handleDownloadPDF('/api/user/certificate/generate', `Certificate_${userName}.pdf`);
    } 
    else if (reportType === 'statement') {
      if (!dateRange.startDate || !dateRange.endDate) {
        alert("Please select both Start and End dates.");
        return;
      }
      
      const start = new Date(dateRange.startDate);
      const end = new Date(dateRange.endDate);
      end.setHours(23, 59, 59);

      const filteredData = requests.filter(req => {
        const d = new Date(req.createdAt);
        return d >= start && d <= end;
      });

      generateCSV(filteredData, `Recycling_Statement_${dateRange.startDate}_to_${dateRange.endDate}.csv`);
    }
    else if (reportType === 'annual') {
      const currentYear = new Date().getFullYear();
      const annualData = requests.filter(req => new Date(req.createdAt).getFullYear() === currentYear);
      generateCSV(annualData, `Annual_Summary_${currentYear}.csv`);
    }
  };

  const handleExportData = (format) => {
    if (format === 'csv' || format === 'xlsx') {
      generateCSV(requests, `Complete_Recycling_History.csv`);
    }
  };

  if (loading && !requests.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reports...</p>
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
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">Reports & Certificates</h1>
                    <p className="text-green-100 text-lg">Download your recycling reports and compliance certificates</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/30">
                    <FileText className="h-4 w-4 text-green-300" />
                    <span className="text-sm font-medium">{requests.filter(r => r.status === 'COMPLETED').length} Completed Submissions</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/30">
                    <Award className="h-4 w-4 text-yellow-300" />
                    <span className="text-sm font-medium">{annualSummary.totalItems} Items Recycled</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/30">
                    <Leaf className="h-4 w-4 text-blue-300" />
                    <span className="text-sm font-medium">{annualSummary.co2Saved}kg CO₂ Saved</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Report Types */}
          <div className="lg:col-span-2 space-y-6">
            {/* Report Type Cards */}
            <div className="bg-white/80 rounded-2xl shadow-lg border border-gray-200/50 backdrop-blur-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg border border-blue-200">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Available Reports</h2>
                  <p className="text-gray-600">Choose the type of report you need</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportTypes.map((report) => {
                  const Icon = report.icon;
                  const colorMap = {
                    blue: 'bg-blue-100 border-blue-200 text-blue-600',
                    green: 'bg-green-100 border-green-200 text-green-600',
                    purple: 'bg-purple-100 border-purple-200 text-purple-600',
                    yellow: 'bg-yellow-100 border-yellow-200 text-yellow-600'
                  };
                  
                  return (
                    <div
                      key={report.id}
                      className={`border-2 rounded-2xl p-5 cursor-pointer transition-all duration-300 backdrop-blur-sm group hover:shadow-lg ${
                        selectedReport === report.id
                          ? `${colorMap[report.color].replace('bg-', 'bg-').replace('border-', 'border-')} border-opacity-100 scale-105`
                          : 'border-gray-200/50 bg-white/50 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedReport(report.id)}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl border backdrop-blur-sm group-hover:scale-110 transition-transform ${
                          selectedReport === report.id ? colorMap[report.color] : 'bg-gray-100 border-gray-200'
                        }`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2">{report.name}</h3>
                          <p className="text-sm text-gray-600 leading-relaxed">{report.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Report Generator */}
            <div className="bg-white/80 rounded-2xl shadow-lg border border-gray-200/50 backdrop-blur-sm p-6">
              {selectedReport === 'statement' && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-green-100 rounded-lg border border-green-200">
                      <FileText className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">Generate Recycling Statement</h3>
                      <p className="text-gray-600">Select date range for your statement</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-blue-500" />
                        Start Date *
                      </label>
                      <input
                        type="date"
                        value={dateRange.startDate}
                        onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all rounded-xl outline-none backdrop-blur-sm"
                      />
                    </div>
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-purple-500" />
                        End Date *
                      </label>
                      <input
                        type="date"
                        value={dateRange.endDate}
                        onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all rounded-xl outline-none backdrop-blur-sm"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => handleGenerateReport('statement')}
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium py-3 px-8 rounded-xl flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <Download className="h-4 w-4" />
                    Download Statement (CSV)
                  </button>
                </div>
              )}

              {selectedReport === 'certificate' && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-green-100 rounded-lg border border-green-200">
                      <Shield className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">Appreciation Certificate</h3>
                      <p className="text-gray-600">Official recognition for your environmental contribution</p>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50/50 border border-blue-200/50 rounded-2xl p-6 mb-6 backdrop-blur-sm">
                    <div className="flex items-center mb-4">
                      <Shield className="h-5 w-5 text-blue-600 mr-3" />
                      <span className="font-semibold text-blue-900">Eligibility Check</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-blue-800">
                      <div className="bg-white/50 rounded-xl p-3 border border-blue-200/50 backdrop-blur-sm">
                        <div className="text-2xl font-bold text-blue-600 mb-1">{annualSummary.totalItems}</div>
                        <div>Current Items</div>
                      </div>
                      <div className="bg-white/50 rounded-xl p-3 border border-blue-200/50 backdrop-blur-sm">
                        <div className="text-2xl font-bold text-blue-600 mb-1">10</div>
                        <div>Required</div>
                      </div>
                    </div>
                    {annualSummary.totalItems < 10 && (
                      <div className="flex items-center gap-2 mt-4 text-orange-600 text-sm bg-orange-50/50 rounded-xl p-3 border border-orange-200/50">
                        <AlertCircle className="h-4 w-4" />
                        You need {10 - annualSummary.totalItems} more items to qualify
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => handleGenerateReport('certificate')}
                    disabled={annualSummary.totalItems < 10}
                    className={`bg-gradient-to-r from-green-600 to-blue-600 text-white font-medium py-3 px-8 rounded-xl flex items-center gap-2 transition-all duration-300 shadow-lg ${
                      annualSummary.totalItems < 10 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:from-green-700 hover:to-blue-700 hover:shadow-xl transform hover:-translate-y-0.5'
                    }`}
                  >
                    <Download className="h-4 w-4" />
                    Download Certificate
                  </button>
                </div>
              )}

              {selectedReport === 'annual' && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-100 rounded-lg border border-purple-200">
                      <Award className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">Annual Recycling Summary</h3>
                      <p className="text-gray-600">Your yearly environmental impact overview</p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200/50 rounded-2xl p-6 mb-6 backdrop-blur-sm">
                    <div className="text-center mb-6">
                      <Award className="h-16 w-16 text-green-600 mx-auto mb-3" />
                      <h4 className="text-2xl font-bold text-green-900">Your {annualSummary.year} in Review</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="bg-white/50 rounded-xl p-4 border border-green-200/50 backdrop-blur-sm">
                        <div className="text-2xl font-bold text-green-800 mb-1">{annualSummary.totalItems}</div>
                        <div className="text-sm text-green-700">Devices Recycled</div>
                      </div>
                      <div className="bg-white/50 rounded-xl p-4 border border-green-200/50 backdrop-blur-sm">
                        <div className="text-2xl font-bold text-green-800 mb-1">{annualSummary.totalWeight}kg</div>
                        <div className="text-sm text-green-700">E-Waste Processed</div>
                      </div>
                      <div className="bg-white/50 rounded-xl p-4 border border-green-200/50 backdrop-blur-sm">
                        <div className="text-2xl font-bold text-green-800 mb-1">{annualSummary.co2Saved}kg</div>
                        <div className="text-sm text-green-700">CO₂ Saved</div>
                      </div>
                      <div className="bg-white/50 rounded-xl p-4 border border-green-200/50 backdrop-blur-sm">
                        <div className="text-2xl font-bold text-green-800 mb-1">{annualSummary.requests}</div>
                        <div className="text-sm text-green-700">Pickup Requests</div>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleGenerateReport('annual')}
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium py-3 px-8 rounded-xl flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <Download className="h-4 w-4" />
                    Download Annual Report (CSV)
                  </button>
                </div>
              )}

              {selectedReport === 'export' && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-yellow-100 rounded-lg border border-yellow-200">
                      <FileDown className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">Export Your Data</h3>
                      <p className="text-gray-600">Download your complete recycling history</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <button
                      onClick={() => handleExportData('csv')}
                      className="border-2 border-gray-200/50 rounded-2xl p-6 hover:border-green-500 transition-all duration-300 text-left bg-white/50 backdrop-blur-sm hover:shadow-lg group"
                    >
                      <div className="flex items-center gap-4 mb-3">
                        <div className="p-3 bg-blue-100 rounded-xl border border-blue-200 group-hover:scale-110 transition-transform">
                          <FileDown className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">CSV Format</h4>
                          <p className="text-sm text-gray-600">Compatible with Excel and Google Sheets</p>
                        </div>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => handleExportData('xlsx')}
                      className="border-2 border-gray-200/50 rounded-2xl p-6 hover:border-green-500 transition-all duration-300 text-left bg-white/50 backdrop-blur-sm hover:shadow-lg group"
                    >
                      <div className="flex items-center gap-4 mb-3">
                        <div className="p-3 bg-green-100 rounded-xl border border-green-200 group-hover:scale-110 transition-transform">
                          <FileText className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Excel Format</h4>
                          <p className="text-sm text-gray-600">Standard spreadsheet format (CSV)</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions & Info */}
          <div className="space-y-6">
            {/* Recent Reports */}
            <div className="bg-white/80 rounded-2xl shadow-lg border border-gray-200/50 backdrop-blur-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg border border-purple-200">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Recent Submissions</h3>
                  <p className="text-gray-600 text-sm">Your latest completed requests</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {requests.filter(r => r.status === 'COMPLETED').slice(0, 3).map(req => (
                  <div key={req.id} className="flex items-center justify-between p-4 border border-gray-200/50 rounded-xl bg-white/50 backdrop-blur-sm hover:shadow-md transition-all duration-300 group">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 group-hover:text-green-600 transition-colors">Submission #{req.id}</p>
                      <p className="text-sm text-gray-600">{req.deviceType} • {new Date(req.createdAt).toLocaleDateString()}</p>
                    </div>
                    <button 
                      onClick={() => generateCSV([req], `Report_${req.id}.csv`)}
                      className="text-green-600 hover:text-green-500 p-2 rounded-lg hover:bg-green-50 transition-colors"
                      title="Download Submission Report (CSV)"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                
                {requests.filter(r => r.status === 'COMPLETED').length === 0 && (
                  <div className="text-center py-8 text-gray-500 text-sm bg-gray-50/50 rounded-xl border border-gray-200/50 backdrop-blur-sm">
                    <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    No completed submissions yet
                  </div>
                )}
              </div>
            </div>

            {/* Report Benefits */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200/50 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg border border-blue-200">
                  <Zap className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-blue-900">Why Download Reports?</h3>
              </div>
              
              <ul className="space-y-3 text-sm text-blue-800">
                <li className="flex items-center gap-3 p-3 bg-white/50 rounded-xl border border-blue-200/50 backdrop-blur-sm">
                  <TrendingUp className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  Track your environmental impact over time
                </li>
                <li className="flex items-center gap-3 p-3 bg-white/50 rounded-xl border border-blue-200/50 backdrop-blur-sm">
                  <FileText className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  Record keeping for tax deductions
                </li>
                <li className="flex items-center gap-3 p-3 bg-white/50 rounded-xl border border-blue-200/50 backdrop-blur-sm">
                  <Shield className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  Proof of responsible disposal
                </li>
                <li className="flex items-center gap-3 p-3 bg-white/50 rounded-xl border border-blue-200/50 backdrop-blur-sm">
                  <Award className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  Showcase your sustainability efforts
                </li>
              </ul>
            </div>
          </div>
        </div>
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

export default Reports;