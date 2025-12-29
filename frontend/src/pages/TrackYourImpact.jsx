import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Award, TrendingUp, Users, Leaf, Battery, Car, Home, Trophy, AlertCircle, Recycle, Zap, BarChart3, Sparkles, Target } from 'lucide-react';

const TrackYourImpact = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  
  const [impactData, setImpactData] = useState({
    totalItems: 0,
    totalWeight: 0,
    co2Saved: 0,
    energySaved: 0,
    waterSaved: 0
  });

  const [impactHistory, setImpactHistory] = useState([]);
  const [badges, setBadges] = useState([]);
  const [communityRank, setCommunityRank] = useState({
    percentile: 0,
    rank: 'Starter',
    totalUsers: '100+'
  });

  const deviceWeights = {
    'LAPTOP': 2.5,
    'DESKTOP': 10.0,
    'MONITOR': 5.0,
    'PRINTER': 8.0,
    'TV': 15.0,
    'MOBILE': 0.2,
    'TABLET': 0.5,
    'CAMERA': 0.5,
    'HEADPHONES': 0.3,
    'OTHER': 1.5
  };

  useEffect(() => {
    fetchImpactData();
  }, []);

  const fetchImpactData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/requests/user');
      const requests = response.data;

      const recycledRequests = requests.filter(req => 
        req.status === 'COMPLETED' || req.status === 'COLLECTED'
      );

      let totalItems = 0;
      let totalWeight = 0;

      recycledRequests.forEach(req => {
        const qty = req.quantity || 1;
        const type = req.deviceType ? req.deviceType.toUpperCase() : 'OTHER';
        const weightPerItem = deviceWeights[type] || 1.5;
        
        totalItems += qty;
        totalWeight += (qty * weightPerItem);
      });

      const co2Saved = totalItems * 2.5;
      const energySaved = totalItems * 15;
      const waterSaved = totalWeight * 20;

      setImpactData({
        totalItems,
        totalWeight: parseFloat(totalWeight.toFixed(1)),
        co2Saved: parseFloat(co2Saved.toFixed(1)),
        energySaved: parseFloat(energySaved.toFixed(0)),
        waterSaved: parseFloat(waterSaved.toFixed(0))
      });

      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const historyMap = {};

      const currentMonthIndex = new Date().getMonth();
      for (let i = 0; i <= currentMonthIndex; i++) {
        historyMap[months[i]] = { month: months[i], co2: 0, items: 0 };
      }

      recycledRequests.forEach(req => {
        if (req.createdAt) {
          const date = new Date(req.createdAt);
          if (date.getFullYear() === new Date().getFullYear()) {
            const monthName = months[date.getMonth()];
            const qty = req.quantity || 1;
            if (historyMap[monthName]) {
              historyMap[monthName].items += qty;
              historyMap[monthName].co2 += (qty * 2.5);
            }
          }
        }
      });

      setImpactHistory(Object.values(historyMap));

      const newBadges = [
        { 
          id: 1, 
          name: 'First Recycler', 
          description: 'Recycled your first device', 
          earned: totalItems >= 1, 
          icon: '🥇',
          color: 'yellow'
        },
        { 
          id: 2, 
          name: 'Eco Warrior', 
          description: 'Recycled 10+ items', 
          earned: totalItems >= 10, 
          icon: '🌱',
          color: 'green'
        },
        { 
          id: 3, 
          name: 'Heavy Lifter', 
          description: 'Recycled 50kg+ total', 
          earned: totalWeight >= 50, 
          icon: '💪',
          color: 'blue'
        },
        { 
          id: 4, 
          name: 'Super Saver', 
          description: 'Saved over 100kg of CO₂', 
          earned: co2Saved >= 100, 
          icon: '🌍',
          color: 'purple'
        }
      ];
      setBadges(newBadges);

      let rank = 'Novice';
      let percentile = 0;
      
      if (totalItems > 50) { rank = 'Elite Recycler'; percentile = 99; }
      else if (totalItems > 20) { rank = 'Eco Champion'; percentile = 90; }
      else if (totalItems > 10) { rank = 'Green Advocate'; percentile = 75; }
      else if (totalItems > 0) { rank = 'Contributor'; percentile = 50; }
      
      setCommunityRank(prev => ({ ...prev, rank, percentile }));

    } catch (error) {
      console.error('Error fetching impact data:', error);
    } finally {
      setLoading(false);
    }
  };

  const equivalencies = [
    {
      icon: <Car className="h-6 w-6" />,
      title: 'Carbon Emission Saved',
      value: `${impactData.co2Saved} kg CO₂`,
      equivalent: `= Driving a car for ${(impactData.co2Saved * 4).toFixed(0)} km`,
      color: 'orange'
    },
    {
      icon: <Home className="h-6 w-6" />,
      title: 'Energy Saved',
      value: `${impactData.energySaved} kWh`,
      equivalent: `= Powering a home for ${(impactData.energySaved / 15).toFixed(1)} days`,
      color: 'blue'
    },
    {
      icon: <Battery className="h-6 w-6" />,
      title: 'Water Conservation',
      value: `${impactData.waterSaved} liters`,
      equivalent: `= ${(impactData.waterSaved / 150).toFixed(0)} people's daily water needs`,
      color: 'cyan'
    },
    {
      icon: <Leaf className="h-6 w-6" />,
      title: 'Landfill Space Saved',
      value: `${impactData.totalWeight} kg`,
      equivalent: `= ${(impactData.totalWeight * 0.5).toFixed(0)} cubic meters of landfill space`,
      color: 'green'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Calculating your environmental impact...</p>
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
                    <Target className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">Track Your Environmental Impact</h1>
                    <p className="text-green-100 text-lg">See the positive difference you're making for our planet</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/30">
                    <Leaf className="h-4 w-4 text-green-300" />
                    <span className="text-sm font-medium">{impactData.totalItems} Devices Recycled</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/30">
                    <TrendingUp className="h-4 w-4 text-yellow-300" />
                    <span className="text-sm font-medium">{impactData.co2Saved}kg CO₂ Saved</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/30">
                    <Trophy className="h-4 w-4 text-blue-300" />
                    <span className="text-sm font-medium">{communityRank.rank} Rank</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {impactData.totalItems === 0 ? (
          <div className="bg-white/80 rounded-2xl shadow-lg border border-gray-200/50 backdrop-blur-sm p-12 text-center">
            <div className="bg-yellow-50/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-yellow-200/50">
              <AlertCircle className="h-10 w-10 text-yellow-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Impact Data Yet</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              Start recycling to see your environmental impact stats grow and earn amazing badges!
            </p>
            <Link 
              to="/new-request" 
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium py-3 px-8 rounded-xl inline-flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Recycle className="h-4 w-4" />
              Submit Your First Request
            </Link>
          </div>
        ) : (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/80 rounded-2xl shadow-lg border border-gray-200/50 backdrop-blur-sm p-6 text-center group hover:shadow-xl transition-all duration-300">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform border border-green-200">
                  <Leaf className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{impactData.totalItems}</h3>
                <p className="text-gray-600 font-medium">Devices Recycled</p>
              </div>

              <div className="bg-white/80 rounded-2xl shadow-lg border border-gray-200/50 backdrop-blur-sm p-6 text-center group hover:shadow-xl transition-all duration-300">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform border border-blue-200">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{impactData.totalWeight} kg</h3>
                <p className="text-gray-600 font-medium">E-Waste Processed</p>
              </div>

              <div className="bg-white/80 rounded-2xl shadow-lg border border-gray-200/50 backdrop-blur-sm p-6 text-center group hover:shadow-xl transition-all duration-300">
                <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform border border-orange-200">
                  <Car className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{impactData.co2Saved} kg</h3>
                <p className="text-gray-600 font-medium">CO₂ Saved</p>
              </div>

              <div className="bg-white/80 rounded-2xl shadow-lg border border-gray-200/50 backdrop-blur-sm p-6 text-center group hover:shadow-xl transition-all duration-300">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform border border-purple-200">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {communityRank.percentile > 0 ? `Top ${100 - communityRank.percentile}%` : 'N/A'}
                </h3>
                <p className="text-gray-600 font-medium">Community Rank</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Environmental Equivalencies */}
              <div className="bg-white/80 rounded-2xl shadow-lg border border-gray-200/50 backdrop-blur-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-green-100 rounded-lg border border-green-200">
                    <Zap className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Environmental Impact Equivalencies</h2>
                    <p className="text-gray-600">Your impact in real-world terms</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {equivalencies.map((item, index) => (
                    <div key={index} className="flex items-center p-4 border-2 border-gray-200/50 rounded-2xl bg-white/50 backdrop-blur-sm hover:shadow-md transition-all duration-300 group">
                      <div className={`p-3 rounded-xl border mr-4 group-hover:scale-110 transition-transform ${
                        item.color === 'orange' ? 'bg-orange-100 border-orange-200 text-orange-600' :
                        item.color === 'blue' ? 'bg-blue-100 border-blue-200 text-blue-600' :
                        item.color === 'cyan' ? 'bg-cyan-100 border-cyan-200 text-cyan-600' :
                        'bg-green-100 border-green-200 text-green-600'
                      }`}>
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                        <p className="text-lg font-bold text-green-600 mb-1">{item.value}</p>
                        <p className="text-sm text-gray-600">{item.equivalent}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Community Ranking */}
              <div className="bg-white/80 rounded-2xl shadow-lg border border-gray-200/50 backdrop-blur-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-yellow-100 rounded-lg border border-yellow-200">
                    <Trophy className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Your Community Standing</h2>
                    <p className="text-gray-600">See how you rank among eco-heroes</p>
                  </div>
                </div>
                
                <div className="text-center py-6">
                  <div className="bg-gradient-to-r from-yellow-100 to-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-yellow-200">
                    <Trophy className="h-10 w-10 text-yellow-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Rank: {communityRank.rank}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Keep recycling to reach the next tier and unlock more badges!
                  </p>
                  <div className="w-full bg-gray-200/50 rounded-full h-4 overflow-hidden backdrop-blur-sm border border-gray-200/50">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-4 rounded-full transition-all duration-1000 ease-out shadow-lg" 
                      style={{ width: `${communityRank.percentile}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 mt-4 bg-white/50 rounded-xl p-3 border border-gray-200/50 backdrop-blur-sm">
                    Your impact is higher than <span className="font-bold text-green-600">{communityRank.percentile}%</span> of new users
                  </p>
                </div>
              </div>
            </div>

            {/* Impact History Chart */}
            <div className="bg-white/80 rounded-2xl shadow-lg border border-gray-200/50 backdrop-blur-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 rounded-lg border border-purple-200">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Your Impact Over Time ({new Date().getFullYear()})</h2>
                  <p className="text-gray-600">Track your progress throughout the year</p>
                </div>
              </div>
              
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={impactHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="month" 
                      stroke="#6b7280"
                      fontSize={12}
                    />
                    <YAxis 
                      yAxisId="left" 
                      stroke="#6b7280"
                      fontSize={12}
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right" 
                      stroke="#6b7280"
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(229, 231, 235, 0.5)',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Legend />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="co2" 
                      name="CO₂ Saved (kg)" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: '#059669' }}
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="items" 
                      name="Devices Recycled" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: '#2563eb' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Badges & Achievements */}
            <div className="bg-white/80 rounded-2xl shadow-lg border border-gray-200/50 backdrop-blur-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-100 rounded-lg border border-indigo-200">
                  <Sparkles className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Your Badges & Achievements</h2>
                  <p className="text-gray-600">Collect them all and show off your eco-credentials</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {badges.map((badge) => (
                  <div 
                    key={badge.id} 
                    className={`border-2 rounded-2xl p-5 text-center transition-all duration-300 backdrop-blur-sm group ${
                      badge.earned 
                        ? `bg-gradient-to-br from-${badge.color}-50 to-${badge.color}-100 border-${badge.color}-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1` 
                        : 'bg-gray-50/50 border-gray-200/50 opacity-60 grayscale'
                    }`}
                  >
                    <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform">{badge.icon}</div>
                    <h3 className="font-semibold text-gray-900 mb-2">{badge.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{badge.description}</p>
                    {badge.earned ? (
                      <div className="inline-flex items-center text-xs text-green-700 font-medium bg-green-100 px-3 py-1.5 rounded-full border border-green-200 backdrop-blur-sm">
                        <Award className="h-3 w-3 mr-1" /> Earned
                      </div>
                    ) : (
                      <div className="text-xs text-gray-500 font-medium bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200 backdrop-blur-sm">Locked</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
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

export default TrackYourImpact;