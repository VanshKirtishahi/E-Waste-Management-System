import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FileText, 
  Calendar, 
  Download, 
  Plus, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Recycle,
  Truck,
  Zap,
  Users,
  BarChart3,
  Leaf,
  X
} from 'lucide-react';

const DailyReports = () => {
  const [reports, setReports] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showNewReport, setShowNewReport] = useState(false);
  const [newReport, setNewReport] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '17:00',
    completedJobs: 0,
    issues: '',
    notes: '',
    vehicleMileage: 0,
    fuelCost: 0,
    environmentalImpact: 0
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await axios.get('/api/reports/my-daily-reports');
      const allReports = response.data;
      
      const filteredReports = allReports.filter(report => report.date === selectedDate);
      
      setReports(filteredReports.length > 0 ? filteredReports : [{
        id: 1,
        date: '2024-01-20',
        startTime: '09:00',
        endTime: '17:30',
        completedJobs: 8,
        totalDistance: '45.2 km',
        issues: 'Traffic delay in downtown area',
        notes: 'All customers were satisfied with service. Successfully recycled 15 electronic devices.',
        vehicleMileage: 245,
        fuelCost: 25.50,
        environmentalImpact: 28,
        materialsRecovered: 16.8,
        status: 'SUBMITTED',
        submittedAt: '2024-01-20T17:45:00'
      }]);

    } catch (error) {
      console.error('Error fetching daily reports:', error);
      setReports([]);
    }
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newReport,
        completedJobs: parseInt(newReport.completedJobs),
        vehicleMileage: parseInt(newReport.vehicleMileage),
        fuelCost: parseFloat(newReport.fuelCost),
        environmentalImpact: parseInt(newReport.completedJobs) * 3.5 // Calculate environmental impact
      };

      await axios.post('/api/reports/daily-report', payload);
      
      setShowNewReport(false);
      setNewReport({
        date: new Date().toISOString().split('T')[0],
        startTime: '09:00',
        endTime: '17:00',
        completedJobs: 0,
        issues: '',
        notes: '',
        vehicleMileage: 0,
        fuelCost: 0,
        environmentalImpact: 0
      });
      alert('Eco-report submitted successfully! 🌱');
      fetchReports();
    } catch (error) {
      console.error('Error submitting report:', error.response?.data || error);
      alert('Failed to submit eco-report. Please check the data and try again.');
    }
  };

  const downloadReport = (reportId) => {
    alert(`Downloading eco-report ${reportId}...`);
  };

  const getStatusColor = (status) => {
    const colors = {
      SUBMITTED: 'bg-green-100 text-green-800 border border-green-200',
      DRAFT: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      PENDING: 'bg-blue-100 text-blue-800 border border-blue-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border border-gray-200';
  };

  const currentReports = reports.filter(r => r.date === selectedDate);

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
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">Eco-Reports</h1>
                    <p className="text-green-100 text-lg">Submit and manage your daily recycling mission reports</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/30">
                    <CheckCircle className="h-4 w-4 text-green-300" />
                    <span className="text-sm font-medium">
                      {currentReports.reduce((acc, report) => acc + report.completedJobs, 0)} Missions Today
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/30">
                    <Leaf className="h-4 w-4 text-yellow-300" />
                    <span className="text-sm font-medium">
                      {currentReports.reduce((acc, report) => acc + (report.environmentalImpact || 0), 0)}kg CO₂ Saved
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowNewReport(true)}
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-medium flex items-center transition-all duration-300 backdrop-blur-sm border border-white/30 hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Eco-Report
              </button>
            </div>
          </div>
        </div>

        {/* New Report Modal */}
        {showNewReport && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white/90 rounded-2xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto backdrop-blur-sm border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FileText className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Submit Daily Eco-Report</h3>
                </div>
                <button
                  onClick={() => setShowNewReport(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmitReport} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      Mission Date
                    </label>
                    <input
                      type="date"
                      value={newReport.date}
                      onChange={(e) => setNewReport(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/80 backdrop-blur-sm transition-all"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-green-500" />
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={newReport.startTime}
                        onChange={(e) => setNewReport(prev => ({ ...prev, startTime: e.target.value }))}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/80 backdrop-blur-sm transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-red-500" />
                        End Time
                      </label>
                      <input
                        type="time"
                        value={newReport.endTime}
                        onChange={(e) => setNewReport(prev => ({ ...prev, endTime: e.target.value }))}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/80 backdrop-blur-sm transition-all"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-purple-500" />
                      Completed Eco-Missions
                    </label>
                    <input
                      type="number"
                      value={newReport.completedJobs}
                      onChange={(e) => setNewReport(prev => ({ ...prev, completedJobs: parseInt(e.target.value) }))}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/80 backdrop-blur-sm transition-all"
                      min="0"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Truck className="h-4 w-4 text-orange-500" />
                      Vehicle Mileage (km)
                    </label>
                    <input
                      type="number"
                      value={newReport.vehicleMileage}
                      onChange={(e) => setNewReport(prev => ({ ...prev, vehicleMileage: parseInt(e.target.value) }))}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/80 backdrop-blur-sm transition-all"
                      min="0"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    Fuel Cost ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newReport.fuelCost}
                    onChange={(e) => setNewReport(prev => ({ ...prev, fuelCost: parseFloat(e.target.value) }))}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/80 backdrop-blur-sm transition-all"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    Issues Encountered
                  </label>
                  <textarea
                    value={newReport.issues}
                    onChange={(e) => setNewReport(prev => ({ ...prev, issues: e.target.value }))}
                    rows="2"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/80 backdrop-blur-sm transition-all"
                    placeholder="Describe any issues or challenges faced during your eco-missions..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    Eco-Mission Notes
                  </label>
                  <textarea
                    value={newReport.notes}
                    onChange={(e) => setNewReport(prev => ({ ...prev, notes: e.target.value }))}
                    rows="3"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/80 backdrop-blur-sm transition-all"
                    placeholder="Any additional comments, observations, or environmental impact notes..."
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowNewReport(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 backdrop-blur-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Submit Eco-Report
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Enhanced Reports List */}
        <div className="bg-white/80 rounded-2xl shadow-lg border border-gray-200/50 backdrop-blur-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-gray-50 to-white/50">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Daily Eco-Reports</h3>
                  <p className="text-sm text-gray-600">Your recycling mission documentation</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/80 backdrop-blur-sm transition-all"
                />
              </div>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200/50">
            {currentReports.length > 0 ? (
              currentReports.map((report) => (
                <div key={report.id} className="p-6 hover:bg-gray-50/80 transition-all duration-300 group backdrop-blur-sm">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="bg-blue-100 p-3 rounded-xl border border-blue-200 group-hover:scale-105 transition-transform duration-300">
                          <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                            Eco-Report - {new Date(report.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                          </h3>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${getStatusColor(report.status)}`}>
                              {report.status}
                            </span>
                            <span className="text-sm text-gray-500 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Submitted: {new Date(report.submittedAt || report.date).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center text-sm text-gray-600 bg-gray-50/50 px-3 py-2 rounded-lg backdrop-blur-sm">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                          <span className="font-medium">{report.completedJobs} Eco-Missions</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 bg-gray-50/50 px-3 py-2 rounded-lg backdrop-blur-sm">
                          <Clock className="h-4 w-4 mr-2 text-blue-500" />
                          <span className="font-medium">{report.startTime} - {report.endTime}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 bg-gray-50/50 px-3 py-2 rounded-lg backdrop-blur-sm">
                          <Truck className="h-4 w-4 mr-2 text-purple-500" />
                          <span className="font-medium">{report.totalDistance || 'N/A'} traveled</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 bg-gray-50/50 px-3 py-2 rounded-lg backdrop-blur-sm">
                          <Leaf className="h-4 w-4 mr-2 text-green-500" />
                          <span className="font-medium">{report.environmentalImpact || 0}kg CO₂ Saved</span>
                        </div>
                      </div>

                      {report.issues && (
                        <div className="bg-yellow-50/80 border border-yellow-200 rounded-xl p-4 mb-3 backdrop-blur-sm">
                          <div className="flex items-start">
                            <AlertCircle className="h-4 w-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-yellow-800">Issues Reported</p>
                              <p className="text-sm text-yellow-700 mt-1">{report.issues}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {report.notes && (
                        <div className="bg-gray-50/80 border border-gray-200 rounded-xl p-4 backdrop-blur-sm">
                          <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Mission Notes
                          </p>
                          <p className="text-sm text-gray-600">{report.notes}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-3 mt-4 lg:mt-0 lg:ml-4">
                      <button
                        onClick={() => downloadReport(report.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-medium flex items-center transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 group/btn"
                      >
                        <Download className="h-4 w-4 mr-1 group-hover/btn:scale-110 transition-transform" />
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <div className="bg-gray-50/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <FileText className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No eco-reports found</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  No daily eco-reports match your selected date. Be the first to submit today's recycling mission report!
                </p>
                <div className="flex justify-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-300"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-700"></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Report Summary */}
        {currentReports.length > 0 && (
          <div className="bg-white/80 rounded-2xl shadow-lg p-6 border border-gray-200/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <BarChart3 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Eco-Report Summary</h3>
                <p className="text-sm text-gray-600">Your recycling mission overview</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center bg-gray-50/50 rounded-xl p-4 backdrop-blur-sm border border-gray-200/50">
                <div className="text-2xl font-bold text-gray-900">
                  {currentReports.reduce((acc, report) => acc + report.completedJobs, 0)}
                </div>
                <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Total Missions
                </div>
              </div>
              <div className="text-center bg-gray-50/50 rounded-xl p-4 backdrop-blur-sm border border-gray-200/50">
                <div className="text-2xl font-bold text-gray-900">
                  {currentReports.length}
                </div>
                <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                  <FileText className="h-4 w-4 text-blue-500" />
                  Reports Submitted
                </div>
              </div>
              <div className="text-center bg-gray-50/50 rounded-xl p-4 backdrop-blur-sm border border-gray-200/50">
                <div className="text-2xl font-bold text-gray-900">
                  ${currentReports.reduce((acc, report) => acc + report.fuelCost, 0).toFixed(2)}
                </div>
                <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  Total Fuel Cost
                </div>
              </div>
              <div className="text-center bg-gray-50/50 rounded-xl p-4 backdrop-blur-sm border border-gray-200/50">
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round(currentReports.reduce((acc, report) => acc + report.completedJobs, 0) / currentReports.length)}
                </div>
                <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                  <Users className="h-4 w-4 text-purple-500" />
                  Avg. Missions/Day
                </div>
              </div>
            </div>
          </div>
        )}
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

export default DailyReports;