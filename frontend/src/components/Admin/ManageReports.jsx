import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FileText, 
  Download, 
  BarChart3, 
  Calendar, 
  Loader2, 
  RefreshCw,
  AlertCircle,
  TrendingUp,
  Recycle,
  Shield,
  ArrowLeft,
  Plus,
  Search,
  Filter,
  Users,
  CheckCircle,
  XCircle,
  Zap,
  Truck
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ManageReports = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);
  
  // Derived Statistics
  const [totalItems, setTotalItems] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  const [co2Saved, setCo2Saved] = useState(0);
  const [treesSaved, setTreesSaved] = useState(0);

  // Date range for filtering
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [reportType, setReportType] = useState('ALL');

  useEffect(() => {
    fetchReportStats();
  }, []);

  const fetchReportStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query parameters for date range
      const params = {};
      if (dateRange.startDate) params.startDate = dateRange.startDate;
      if (dateRange.endDate) params.endDate = dateRange.endDate;

      const response = await axios.get('/api/requests/dashboard/stats', { params }); 
      const data = response.data;
      setStats(data);

      // Calculate aggregate numbers from device stats
      if (data && data.deviceTypeStats) {
        let items = 0;
        Object.values(data.deviceTypeStats).forEach(count => {
          items += count;
        });
        
        setTotalItems(items);
        const weight = (items * 1.5).toFixed(1);
        const co2 = (items * 2.5).toFixed(1);
        const trees = (items * 0.1).toFixed(1);
        
        setTotalWeight(weight);
        setCo2Saved(co2);
        setTreesSaved(trees);
      }

    } catch (error) {
      console.error("Error fetching report stats", error);
      setError("Failed to load report data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = async () => {
    try {
      setDownloading(true);
      
      if (!stats || !stats.deviceTypeStats) {
        alert("No data available to download.");
        return;
      }

      // Prepare CSV content
      const headers = ["Device Type", "Quantity", "Est. Weight (kg)", "Est. CO2 Saved (kg)", "Est. Trees Saved"];
      const rows = Object.entries(stats.deviceTypeStats).map(([device, count]) => [
        `"${device}"`,
        count,
        (count * 1.5).toFixed(2),
        (count * 2.5).toFixed(2),
        (count * 0.1).toFixed(2)
      ]);

      // Add Summary Row
      rows.push(["TOTAL", totalItems, totalWeight, co2Saved, treesSaved]);

      const csvContent = [
        headers.join(','),
        ...rows.map(e => e.join(','))
      ].join('\n');

      // Trigger Download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `EcoWaste_Impact_Report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error("Error downloading CSV:", error);
      alert("Failed to download report. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const downloadPDF = async () => {
    // Placeholder for PDF generation
    alert("PDF export feature coming soon!");
  };

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyDateFilter = () => {
    fetchReportStats();
  };

  const clearDateFilter = () => {
    setDateRange({ startDate: '', endDate: '' });
    fetchReportStats();
  };

  const getImpactLevel = () => {
    if (totalItems >= 1000) return { level: "Exceptional", color: "text-purple-600", bg: "bg-purple-100" };
    if (totalItems >= 500) return { level: "High", color: "text-green-600", bg: "bg-green-100" };
    if (totalItems >= 100) return { level: "Moderate", color: "text-blue-600", bg: "bg-blue-100" };
    return { level: "Good Start", color: "text-yellow-600", bg: "bg-yellow-100" };
  };

  const impactLevel = getImpactLevel();

  // Filter device stats based on search
  const filteredDeviceStats = stats?.deviceTypeStats ? 
    Object.entries(stats.deviceTypeStats).filter(([device]) =>
      device.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

  if (loading && !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics reports...</p>
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
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">System Reports & Analytics</h1>
                    <p className="text-green-100 text-lg">Track and analyze recycling impact across the system</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/30">
                    <Recycle className="h-4 w-4 text-green-300" />
                    <span className="text-sm font-medium">{totalItems.toLocaleString()} Items Collected</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/30">
                    <TrendingUp className="h-4 w-4 text-yellow-300" />
                    <span className="text-sm font-medium">{co2Saved}kg CO₂ Saved</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/30">
                    <Shield className="h-4 w-4 text-blue-300" />
                    <span className="text-sm font-medium">{treesSaved} Trees Equivalent</span>
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
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="group">
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="date"
                    name="startDate"
                    value={dateRange.startDate}
                    onChange={handleDateRangeChange}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all rounded-xl outline-none backdrop-blur-sm"
                    placeholder="Start Date"
                  />
                </div>
              </div>
              <div className="group">
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="date"
                    name="endDate"
                    value={dateRange.endDate}
                    onChange={handleDateRangeChange}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all rounded-xl outline-none backdrop-blur-sm"
                    placeholder="End Date"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="group">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search device types..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-64 pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all rounded-xl outline-none backdrop-blur-sm"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={applyDateFilter}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium py-3 px-6 rounded-xl flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 whitespace-nowrap"
                >
                  <Filter className="h-4 w-4" />
                  Apply Filter
                </button>
                
                <button 
                  onClick={fetchReportStats}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-3 text-gray-600 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-all duration-300 backdrop-blur-sm"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:block">Refresh</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 backdrop-blur-sm">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Impact Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Items Card */}
          <div className="bg-white/80 rounded-2xl shadow-lg border border-gray-200/50 backdrop-blur-sm p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-xl border border-blue-200 group-hover:scale-110 transition-transform">
                <Recycle className="h-6 w-6 text-blue-600" />
              </div>
              <TrendingUp className="h-5 w-5 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">Items Collected</h3>
            <p className="text-3xl font-bold text-blue-600 mb-2">{totalItems.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Total electronic items processed</p>
          </div>

          {/* CO2 Saved Card */}
          <div className="bg-white/80 rounded-2xl shadow-lg border border-gray-200/50 backdrop-blur-sm p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-xl border border-green-200 group-hover:scale-110 transition-transform">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">CO₂ Prevention</h3>
            <p className="text-3xl font-bold text-green-600 mb-2">{co2Saved}kg</p>
            <p className="text-sm text-gray-500">Emissions prevented</p>
          </div>

          {/* Weight Processed Card */}
          <div className="bg-white/80 rounded-2xl shadow-lg border border-gray-200/50 backdrop-blur-sm p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-xl border border-purple-200 group-hover:scale-110 transition-transform">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <TrendingUp className="h-5 w-5 text-purple-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">Weight Processed</h3>
            <p className="text-3xl font-bold text-purple-600 mb-2">{totalWeight}kg</p>
            <p className="text-sm text-gray-500">E-waste collected</p>
          </div>

          {/* Environmental Impact Card */}
          <div className="bg-white/80 rounded-2xl shadow-lg border border-gray-200/50 backdrop-blur-sm p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-xl border border-orange-200 group-hover:scale-110 transition-transform">
                <Shield className="h-6 w-6 text-orange-600" />
              </div>
              <div className={`px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm border ${impactLevel.bg} ${impactLevel.color} border-current`}>
                {impactLevel.level}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">Environmental Impact</h3>
            <p className="text-3xl font-bold text-orange-600 mb-2">{treesSaved}</p>
            <p className="text-sm text-gray-500">Trees equivalent saved</p>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden backdrop-blur-sm border border-white/20">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="h-6 w-6" />
                <h3 className="text-lg font-semibold">Detailed Report</h3>
              </div>
              <p className="text-blue-100 mb-4 text-sm">Download comprehensive CSV report with all analytics</p>
              <button 
                onClick={downloadCSV}
                disabled={downloading || totalItems === 0}
                className="w-full bg-white text-blue-600 py-3 px-4 rounded-xl font-medium hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {downloading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                {downloading ? 'Generating...' : 'Download CSV'}
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden backdrop-blur-sm border border-white/20">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="h-6 w-6" />
                <h3 className="text-lg font-semibold">Impact Summary</h3>
              </div>
              <p className="text-green-100 mb-4 text-sm">Generate visual impact report (PDF)</p>
              <button 
                onClick={downloadPDF}
                className="w-full bg-white text-green-600 py-3 px-4 rounded-xl font-medium hover:bg-green-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export PDF
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden backdrop-blur-sm border border-white/20">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="h-6 w-6" />
                <h3 className="text-lg font-semibold">Schedule Report</h3>
              </div>
              <p className="text-purple-100 mb-4 text-sm">Set up automated report delivery</p>
              <button 
                onClick={() => alert('Schedule feature coming soon!')}
                className="w-full bg-white text-purple-600 py-3 px-4 rounded-xl font-medium hover:bg-purple-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Configure
              </button>
            </div>
          </div>
        </div>

        {/* Device Breakdown Table */}
        <div className="bg-white/80 rounded-2xl shadow-lg border border-gray-200/50 backdrop-blur-sm p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Device Type Breakdown</h3>
            <div className="text-sm text-gray-500 bg-gray-50/50 px-3 py-1.5 rounded-lg border border-gray-200/50">
              Showing data {dateRange.startDate ? 'for selected period' : 'for all time'}
            </div>
          </div>
          
          {stats && stats.deviceTypeStats && Object.keys(stats.deviceTypeStats).length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50/50 backdrop-blur-sm">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200/50">
                      Device Type
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200/50">
                      Quantity
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200/50">
                      Weight (kg)
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200/50">
                      CO₂ Saved (kg)
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200/50">
                      Percentage
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/50">
                  {filteredDeviceStats.map(([device, count]) => {
                    const percentage = totalItems > 0 ? ((count / totalItems) * 100).toFixed(1) : 0;
                    return (
                      <tr key={device} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 group-hover:text-green-600 transition-colors">
                          {device}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          {count.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          {(count * 1.5).toFixed(1)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          {(count * 2.5).toFixed(1)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          {percentage}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-gray-50/50 backdrop-blur-sm font-semibold border-t border-gray-200/50">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">Total</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">{totalItems.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">{totalWeight}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">{co2Saved}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">100%</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-12">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">No report data available</p>
              <p className="text-sm">Start collecting e-waste to see analytics here.</p>
            </div>
          )}
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

export default ManageReports;