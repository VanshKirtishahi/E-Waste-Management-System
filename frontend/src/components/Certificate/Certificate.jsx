import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { 
  ArrowLeft, Download, Award, CheckCircle, TrendingUp, 
  Trash2, Users, Calendar, Leaf, Zap, Cloud,
  Trophy, Sparkles, Target, Info
} from 'lucide-react';

const Certificate = () => {
  const { user } = useAuth();
  const [completedRequests, setCompletedRequests] = useState(0);
  const [loading, setLoading] = useState(true);
  const [certificateData, setCertificateData] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Calls the robust DTO endpoint
      const response = await axios.get('http://localhost:8080/api/user/my-stats/requests-by-status');
      const stats = response.data;

      // Find stats safely
      const completedStat = stats.find(item => item.status === 'COMPLETED');
      const collectedStat = stats.find(item => item.status === 'COLLECTED');
      
      const completedCount = completedStat ? Number(completedStat.count) : 0;
      const collectedCount = collectedStat ? Number(collectedStat.count) : 0;
      
      const totalCount = completedCount + collectedCount;
      
      console.log("Stats Fetched:", stats);
      console.log("Total Eligible (Completed + Collected):", totalCount);

      setCompletedRequests(totalCount);

      if (totalCount >= 10) {
        setCertificateData({
          certificateNumber: 'EWC-' + Date.now().toString().slice(-6),
          issuedDate: new Date().toLocaleDateString(),
          recipientName: user?.name || 'Valued User'
        });
        
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
      }

    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadCertificate = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/user/certificate/generate', {
        responseType: 'blob' 
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `EcoWaste-Certificate-${user?.name || 'Award'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download failed", error);
      alert("Could not download certificate. Please ensure you have 10+ Completed or Collected requests.");
    }
  };

  const impact = {
    co2Reduced: (completedRequests * 2.5).toFixed(1),
    toxicWastePrevented: (completedRequests * 0.8).toFixed(1),
    energySaved: (completedRequests * 15).toFixed(0),
    treesEquivalent: Math.floor(completedRequests * 0.3),
    landfillSpace: (completedRequests * 0.5).toFixed(1)
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-cyan-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your environmental impact...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-cyan-50">
      {/* Celebration Animation */}
      {showCelebration && completedRequests >= 10 && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="animate-celebration text-center">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-yellow-300 transform scale-0 animate-bounce-in">
              <Sparkles className="h-16 w-16 text-yellow-500 mx-auto mb-4 animate-pulse" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Congratulations! 🎉</h3>
              <p className="text-gray-600">You've unlocked your Certificate of Appreciation!</p>
            </div>
          </div>
        </div>
      )}

      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link to="/dashboard" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-4 group">
              <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back
            </Link>
            <div className="bg-gradient-to-r from-green-500 to-blue-500 w-10 h-10 rounded-xl flex items-center justify-center ml-auto sm:ml-0">
              <Award className="h-6 w-6 text-white" />
            </div>
            <div className="ml-3 hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900">
                {completedRequests >= 10 ? 'Certificate of Appreciation' : 'Certificate Progress'}
              </h1>
              <p className="text-sm text-gray-600">Track your environmental impact</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {completedRequests >= 10 ? (
            <div className="space-y-8 animate-fade-in">
              {/* Certificate Preview */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
                <div id="certificate" className="bg-gradient-to-br from-yellow-50 via-white to-green-50 border-8 border-yellow-400 rounded-3xl p-12 text-center relative overflow-hidden shadow-2xl">
                  {/* Decorative Elements */}
                  <div className="absolute top-0 left-0 w-40 h-40 bg-green-200/30 rounded-full -translate-x-20 -translate-y-20 animate-pulse-slow"></div>
                  <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-200/30 rounded-full translate-x-24 translate-y-24 animate-pulse-slow delay-1000"></div>
                  
                  <div className="relative z-10">
                    <div className="mb-12">
                      <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-bounce-gentle">
                        <Award className="h-12 w-12 text-white" />
                      </div>
                      <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-600 to-green-600 bg-clip-text text-transparent mb-4 animate-gradient-shift">
                        Certificate of Appreciation
                      </h1>
                      <p className="text-xl text-gray-600 font-light">Presented with gratitude to</p>
                    </div>

                    <div className="my-12 transform hover:scale-105 transition-transform duration-300">
                      <h2 className="text-6xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-6 font-serif">
                        {certificateData?.recipientName}
                      </h2>
                      <div className="w-48 h-2 bg-gradient-to-r from-yellow-400 to-green-400 mx-auto rounded-full shadow-md"></div>
                    </div>

                    <div className="mb-12 max-w-2xl mx-auto">
                      <p className="text-2xl text-gray-700 mb-6 leading-relaxed font-light">
                        For outstanding commitment to environmental sustainability and responsible e-waste management practices.
                      </p>
                      <div className="flex justify-center items-center space-x-8 text-lg text-gray-600">
                        <div className="flex items-center bg-green-100 px-4 py-2 rounded-full">
                          <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                          <span className="font-semibold">{completedRequests} Devices Recycled</span>
                        </div>
                        <div className="flex items-center bg-blue-100 px-4 py-2 rounded-full">
                          <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                          <span className="font-semibold">{certificateData?.issuedDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-100/50 rounded-xl p-4 inline-block">
                      <p className="text-sm text-gray-600">Certificate No: <span className="font-mono font-bold text-gray-800">{certificateData?.certificateNumber}</span></p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Download Section */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 text-center border border-white/20 animate-slide-up">
                <div className="max-w-2xl mx-auto">
                  <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4 animate-bounce" />
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">Congratulations, Environmental Champion! 🎉</h3>
                  <button 
                    onClick={downloadCertificate}
                    className="group bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 inline-flex items-center"
                  >
                    <Download className="h-5 w-5 mr-3 group-hover:animate-bounce" />
                    Download Official Certificate
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-fade-in">
              {/* Progress Section */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 text-center border border-white/20">
                <div className="max-w-2xl mx-auto">
                  <Target className="h-20 w-20 text-blue-500 mx-auto mb-6 animate-pulse" />
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">Earn Your Certificate!</h2>
                  
                  {/* Explanation of what counts */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 inline-flex items-center text-blue-800">
                    <Info className="h-5 w-5 mr-2 flex-shrink-0" />
                    <span className="text-sm text-left">
                      Only items that are <strong>"Collected"</strong> or <strong>"Completed"</strong> count towards your certificate. <br/>
                      "Pending" or "Scheduled" requests do not count yet.
                    </span>
                  </div>

                  <p className="text-xl text-gray-600 mb-8">
                    Complete {Math.max(0, 10 - completedRequests)} more e-waste recycling requests to unlock your Certificate of Appreciation.
                  </p>

                  <div className="max-w-md mx-auto mb-8">
                    <div className="flex justify-between text-lg font-semibold text-gray-700 mb-4">
                      <span>Your Progress</span>
                      <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                        {completedRequests}/10
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-6 shadow-inner">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-blue-500 h-6 rounded-full transition-all duration-1000 ease-out shadow-lg relative overflow-hidden"
                        style={{ width: `${Math.min(100, (completedRequests / 10) * 100)}%` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-shine"></div>
                      </div>
                    </div>
                  </div>
                  
                  <Link 
                    to="/new-request" 
                    className="group bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 inline-flex items-center"
                  >
                    Submit New Request 
                    <ArrowLeft className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform rotate-180" />
                  </Link>
                </div>
              </div>

              {/* Impact Dashboard */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
                <div className="text-center mb-8">
                  <Sparkles className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">Your Environmental Impact</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                  <div className="bg-green-100 p-6 rounded-2xl text-center"><div className="text-2xl font-bold text-green-700">{impact.co2Reduced} kg</div><div className="text-sm text-green-600">CO₂ Reduced</div></div>
                  <div className="bg-blue-100 p-6 rounded-2xl text-center"><div className="text-2xl font-bold text-blue-700">{impact.toxicWastePrevented} kg</div><div className="text-sm text-blue-600">Toxic Waste Saved</div></div>
                  <div className="bg-yellow-100 p-6 rounded-2xl text-center"><div className="text-2xl font-bold text-yellow-700">{impact.energySaved} kWh</div><div className="text-sm text-yellow-600">Energy Saved</div></div>
                  <div className="bg-emerald-100 p-6 rounded-2xl text-center"><div className="text-2xl font-bold text-emerald-700">{impact.treesEquivalent}</div><div className="text-sm text-emerald-600">Trees Equivalent</div></div>
                  <div className="bg-purple-100 p-6 rounded-2xl text-center"><div className="text-2xl font-bold text-purple-700">{impact.landfillSpace} m³</div><div className="text-sm text-purple-600">Landfill Saved</div></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(50px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounce-in { 0% { opacity: 0; transform: scale(0.3); } 50% { opacity: 1; transform: scale(1.05); } 100% { opacity: 1; transform: scale(1); } }
        @keyframes pulse-slow { 0% { opacity: 0.3; } 50% { opacity: 0.6; } }
        @keyframes shine { 0% { transform: translateX(-100%) skewX(-12deg); } 100% { transform: translateX(200%) skewX(-12deg); } }
        @keyframes celebration { 0% { transform: scale(0); opacity: 0; } 50% { transform: scale(1.1); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.8s ease-out; }
        .animate-slide-up { animation: slide-up 0.6s ease-out; }
        .animate-bounce-in { animation: bounce-in 0.8s ease-out; }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        .animate-shine { animation: shine 2s ease-in-out infinite; }
        .animate-celebration { animation: celebration 0.6s ease-out; }
      `}</style>
    </div>
  );
};

export default Certificate;