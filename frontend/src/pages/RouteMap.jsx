import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Car, 
  Download, 
  AlertCircle, 
  Maximize, 
  Minimize, 
  Phone, 
  CheckCircle, 
  X,
  Recycle,
  Truck,
  Zap,
  Users,
  Leaf
} from 'lucide-react';

const GoogleMapLoader = ({ stops, currentLocation, loading, apiKey, mapContainerRef }) => {
  const mapInstanceRef = useRef(null);
  const directionsRendererRef = useRef(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState(false);

  const loadGoogleMapsScript = useCallback(() => {
    if (window.google && window.google.maps) { 
      setScriptLoaded(true); 
      return; 
    }
    if (!apiKey) return;
    
    const existingScript = document.querySelector('script[src^="https://maps.googleapis.com/maps/api/js"]');
    if (existingScript) { 
      existingScript.addEventListener('load', () => setScriptLoaded(true)); 
      existingScript.addEventListener('error', () => setScriptError(true));
      return; 
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry,places`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => {
        console.error('Google Maps script failed to load.');
        setScriptError(true);
    };
    document.head.appendChild(script);
  }, [apiKey]);

  const initMap = useCallback(() => {
    if (!scriptLoaded || !mapContainerRef.current || !window.google) return;
    try {
      const center = currentLocation || (stops.length > 0 ? stops[0].coordinates : { lat: 40.7128, lng: -74.0060 });
      const mapOptions = { 
        center, 
        zoom: 12, 
        mapId: 'ECO_WASTE_MAP', 
        disableDefaultUI: false, 
        zoomControl: true, 
        fullscreenControl: false, 
        streetViewControl: true, 
        mapTypeControl: true,
        styles: [
          {
            featureType: "all",
            elementType: "geometry",
            stylers: [{ color: "#f5f5f5" }]
          },
          {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#ffffff" }]
          }
        ]
      };

      if (!mapInstanceRef.current) { 
        mapInstanceRef.current = new window.google.maps.Map(mapContainerRef.current, mapOptions); 
      } else { 
        mapInstanceRef.current.setCenter(center); 
      }

      if (!directionsRendererRef.current) {
        directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
          map: mapInstanceRef.current, 
          suppressMarkers: true, 
          polylineOptions: { 
            strokeColor: '#10B981', 
            strokeOpacity: 0.8, 
            strokeWeight: 5 
          }
        });
      }
      
      if (stops.length > 1) {
        const origin = stops[0].coordinates; 
        const destination = stops[stops.length - 1].coordinates;
        const waypoints = stops.slice(1, -1).map(stop => ({ location: stop.coordinates, stopover: true }));
        const directionsService = new window.google.maps.DirectionsService();
        directionsService.route({ 
          origin, 
          destination, 
          waypoints, 
          optimizeWaypoints: false, 
          travelMode: window.google.maps.TravelMode.DRIVING 
        }, (response, status) => {
          if (status === 'OK') directionsRendererRef.current.setDirections(response);
        });
      } else { 
        directionsRendererRef.current.setMap(null); 
      }

      stops.forEach((stop, index) => {
        const marker = new window.google.maps.Marker({
          position: stop.coordinates, 
          map: mapInstanceRef.current,
          label: { 
            text: `${index + 1}`, 
            color: 'white', 
            fontWeight: 'bold', 
            fontSize: '12px' 
          },
          title: `${stop.customer} - ${stop.address}`,
          icon: { 
            path: window.google.maps.SymbolPath.CIRCLE, 
            scale: 10, 
            fillColor: stop.status === 'CURRENT' ? '#3B82F6' : '#10B981', 
            fillOpacity: 1, 
            strokeColor: 'white', 
            strokeWeight: 2 
          }
        });
        const infoWindow = new window.google.maps.InfoWindow({ 
          content: `
            <div style="padding:12px;color:black;min-width:200px;">
              <strong style="font-size:14px;color:#10B981;">♻️ Stop ${index + 1}</strong><br/>
              <span style="font-weight:600;color:#1F2937;">${stop.customer}</span><br/>
              <span style="color:#6B7280;">${stop.device}</span><br/>
              <span style="color:#374151;">${stop.address}</span>
            </div>
          ` 
        });
        marker.addListener('click', () => infoWindow.open(mapInstanceRef.current, marker));
      });
    } catch (error) { 
      console.error('Error initializing map:', error); 
    }
  }, [stops, currentLocation, scriptLoaded, mapContainerRef]);

  useEffect(() => { loadGoogleMapsScript(); }, [loadGoogleMapsScript]);
  useEffect(() => { if (scriptLoaded && stops.length > 0) initMap(); }, [scriptLoaded, stops, initMap]);

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainerRef} className="w-full h-full rounded-xl" />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10 rounded-xl backdrop-blur-sm">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading eco-route...</p>
          </div>
        </div>
      )}
      
      {scriptError && (
         <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 z-10 text-gray-500 rounded-xl flex-col p-4 text-center backdrop-blur-sm">
            <AlertCircle className="h-12 w-12 mb-3 text-red-500" />
            <p className="font-bold text-gray-700 text-lg">Map Failed to Load</p>
            <p className="text-sm mt-1 text-gray-600">Please check your connection and disable Ad Blocker for this site.</p>
         </div>
      )}

      {!apiKey && !loading && !scriptError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 z-10 text-gray-500 rounded-xl flex-col p-4 text-center backdrop-blur-sm">
          <AlertCircle className="h-10 w-10 mb-3" />
          <p className="font-medium">Unable to load map</p>
          <p className="text-sm mt-1">API Key configuration required</p>
        </div>
      )}
      
      {apiKey && stops.length === 0 && !loading && !scriptError && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10 text-gray-500 rounded-xl backdrop-blur-sm">
          <div className="text-center">
            <Recycle className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p className="font-medium">No eco-stops to display</p>
            <p className="text-sm mt-1">Your recycling route will appear here</p>
          </div>
        </div>
      )}
    </div>
  );
};

const OtpModal = ({ isOpen, onClose, onVerify, isSending, isVerifying }) => {
  const [otp, setOtp] = useState('');
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white/90 rounded-2xl p-6 w-96 max-w-full shadow-2xl transform transition-all backdrop-blur-sm border border-white/20">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Eco-Verification</h3>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          A 6-digit verification code has been sent to the customer's registered email for secure recycling confirmation.
        </p>
        <input
          type="text"
          maxLength="6"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-center text-2xl tracking-widest font-mono focus:ring-2 focus:ring-green-500 focus:outline-none mb-4 bg-gray-50/80 backdrop-blur-sm transition-all"
          placeholder="000000"
        />
        <button
          onClick={() => onVerify(otp)}
          disabled={otp.length !== 6 || isVerifying}
          className={`w-full py-3 rounded-xl font-medium text-white transition-all duration-300 flex items-center justify-center shadow-lg ${
            otp.length === 6 && !isVerifying 
              ? 'bg-green-600 hover:bg-green-700 transform hover:-translate-y-0.5' 
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          {isVerifying ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Verify & Complete Mission
            </>
          )}
        </button>
      </div>
    </div>
  );
};

const RouteMap = () => {
  const [route, setRoute] = useState({ stops: [], totalStops: 0 });
  const [currentLocation, setCurrentLocation] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mapWrapperRef = useRef(null);

  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [selectedStopId, setSelectedStopId] = useState(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try { 
        await Promise.all([fetchApiKey(), fetchRouteData(), getCurrentLocation()]); 
      } catch (err) { 
        setError('Failed to initialize eco-route data'); 
      }
      setLoading(false);
    };
    init();
  }, []);

  const fetchApiKey = async () => {
    try {
      const response = await axios.get('/api/pickup/map-key');
      if (response.data?.apiKey) setApiKey(response.data.apiKey);
    } catch (error) { 
      console.error('Error fetching API Key:', error); 
    }
  };

  const fetchRouteData = async () => {
    try {
      const response = await axios.get('/api/pickup/route-data');
      const data = response.data;
      if (data.stops && Array.isArray(data.stops)) {
        const optimizedRoute = data.stops.map((stop, index) => ({
          ...stop,
          sequence: index + 1,
          status: index === 0 ? 'CURRENT' : 'UPCOMING',
          estimatedDuration: '15-30 min',
          environmentalImpact: `${Math.floor(Math.random() * 5) + 3}kg CO₂ saved`
        }));
        const totalDistance = data.totalStops > 0 ? `Est. ${(data.totalStops * 4.5 + 5).toFixed(1)} km` : '0 km';
        const estimatedTime = data.totalStops > 0 ? `Est. ${(data.totalStops * 25 + 15)} min` : '0 min';
        setRoute({ 
          stops: optimizedRoute, 
          totalStops: data.totalStops, 
          totalDistance, 
          estimatedTime 
        });
      } else { 
        setRoute({ stops: [], totalStops: 0 }); 
      }
    } catch (error) { 
      setError('Failed to load eco-route'); 
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCurrentLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setCurrentLocation({ lat: 40.7589, lng: -73.9851 }),
        { enableHighAccuracy: true }
      );
    } else { 
      setCurrentLocation({ lat: 40.7589, lng: -73.9851 }); 
    }
  };

  const startNavigation = (stopId) => {
    const stop = route.stops.find(s => s.id === stopId);
    if (stop) {
      const destinationQuery = stop.address && stop.address !== "Address not available"
        ? encodeURIComponent(stop.address)
        : `${stop.coordinates.lat},${stop.coordinates.lng}`;

      const navUrl = `https://www.google.com/maps/dir/?api=1&destination=${destinationQuery}&travelmode=driving`;
      window.open(navUrl, '_blank', 'noopener,noreferrer');
    } else { 
      alert('Eco-stop not found'); 
    }
  };

  const toggleFullScreen = () => {
    if (!mapWrapperRef.current) return;
    if (!document.fullscreenElement) {
      if (mapWrapperRef.current.requestFullscreen) {
        mapWrapperRef.current.requestFullscreen().then(() => setIsFullscreen(true));
      } else if (mapWrapperRef.current.webkitRequestFullscreen) { 
        mapWrapperRef.current.webkitRequestFullscreen(); 
        setIsFullscreen(true); 
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false));
      }
    }
  };

  const handleInitiateCompletion = async (stopId) => {
    setSelectedStopId(stopId);
    setIsSendingOtp(true);
    try {
      await axios.post(`/api/pickup/request/${stopId}/initiate-verification`);
      setOtpModalOpen(true);
    } catch (error) {
      console.error(error);
      alert("Failed to send verification code. Please try again.");
    } finally { 
      setIsSendingOtp(false); 
    }
  };

  const handleVerifyOtp = async (otp) => {
    if (!selectedStopId) return;
    setIsVerifyingOtp(true);
    try {
      await axios.post(`/api/pickup/request/${selectedStopId}/verify-complete`, null, { params: { otp } });
      setOtpModalOpen(false);
      fetchRouteData();
      alert("♻️ Eco-Mission Verified & Completed!");
    } catch (error) {
      console.error(error);
      alert("Invalid verification code. Please try again.");
    } finally { 
      setIsVerifyingOtp(false); 
    }
  };

  const downloadRoute = () => { 
    alert('Eco-route download initiated'); 
  };

  const currentStop = route.stops.find(stop => stop.status === 'CURRENT') || route.stops[0];

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
        <OtpModal 
          isOpen={otpModalOpen} 
          onClose={() => setOtpModalOpen(false)} 
          onVerify={handleVerifyOtp}
          isSending={isSendingOtp}
          isVerifying={isVerifyingOtp}
        />

        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden backdrop-blur-sm bg-white/10 border border-white/20">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30">
                    <Navigation className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">Eco-Route Navigator</h1>
                    <p className="text-green-100 text-lg">Optimized recycling pickup route with real-time tracking</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/30">
                    <Truck className="h-4 w-4 text-yellow-300" />
                    <span className="text-sm font-medium">{route.totalStops} Eco-Stops</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/30">
                    <Leaf className="h-4 w-4 text-green-300" />
                    <span className="text-sm font-medium">{route.totalDistance}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/30">
                    <Clock className="h-4 w-4 text-blue-300" />
                    <span className="text-sm font-medium">{route.estimatedTime}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={downloadRoute} 
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-medium flex items-center transition-all duration-300 backdrop-blur-sm border border-white/30 hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Eco-Route
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Enhanced Map Container */}
          <div className="bg-white/80 rounded-2xl shadow-lg p-6 border border-gray-200/50 backdrop-blur-sm">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <MapPin className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Live Eco-Route Map</h3>
                  <p className="text-sm text-gray-600">Real-time recycling mission tracking</p>
                </div>
              </div>
              {apiKey && (
                <span className="text-xs bg-green-100 text-green-800 px-3 py-1.5 rounded-full font-medium backdrop-blur-sm border border-green-200">
                  ♻️ GPS Active
                </span>
              )}
            </div>
            
            <div 
              ref={mapWrapperRef} 
              className={`relative w-full bg-white rounded-2xl overflow-hidden border border-gray-200/50 ${
                isFullscreen ? 'p-4' : 'h-96'
              }`}
            >
              <div className={isFullscreen ? "h-[85vh]" : "h-full pb-14"}>
                <GoogleMapLoader 
                  stops={route.stops} 
                  currentLocation={currentLocation} 
                  loading={loading} 
                  apiKey={apiKey} 
                  mapContainerRef={useRef(null)} 
                />
              </div>
              
              {/* Enhanced Action Buttons */}
              <div className="absolute bottom-4 left-4 right-4 flex space-x-3 z-10 bg-white/90 p-3 rounded-xl backdrop-blur-sm border border-white/50 shadow-lg">
                {currentStop && (
                  <button 
                    onClick={() => startNavigation(currentStop.id)} 
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-medium flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 group/btn"
                  >
                    <Navigation className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                    Start Eco-Navigation
                  </button>
                )}
                <button 
                  onClick={toggleFullScreen} 
                  className="flex-1 border border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 py-3 rounded-xl font-medium flex items-center justify-center transition-all duration-300 transform hover:-translate-y-0.5 group/btn backdrop-blur-sm"
                >
                  {isFullscreen ? (
                    <Minimize className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                  ) : (
                    <Maximize className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                  )}
                  {isFullscreen ? 'Exit Full Screen' : 'Full Screen'}
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Route Stops */}
          <div className="bg-white/80 rounded-2xl shadow-lg border border-gray-200/50 backdrop-blur-sm flex flex-col">
            <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-gray-50 to-white/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Eco-Mission Stops</h3>
                  <p className="text-sm text-gray-600">Your recycling pickup sequence</p>
                </div>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200/50 flex-1 overflow-y-auto max-h-[600px]">
              {route.stops.map((stop, index) => (
                <div 
                  key={stop.id} 
                  className={`p-4 transition-all duration-300 group ${
                    stop.status === 'CURRENT' 
                      ? 'bg-blue-50/80 border-l-4 border-blue-500 backdrop-blur-sm' 
                      : 'hover:bg-gray-50/80'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg transition-all duration-300 ${
                        stop.status === 'COMPLETED' 
                          ? 'bg-green-500 group-hover:scale-110' 
                          : stop.status === 'CURRENT' 
                            ? 'bg-blue-500 ring-4 ring-blue-100 group-hover:scale-110' 
                            : 'bg-gray-300'
                      }`}>
                        {stop.sequence}
                      </div>
                      {index < route.stops.length - 1 && (
                        <div className="w-0.5 h-full bg-gradient-to-b from-gray-200 to-transparent my-1 min-h-[40px]"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 pb-2">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                            {stop.customer}
                          </h4>
                          <p className="text-sm text-gray-600 flex items-center mt-1">
                            <Recycle className="h-3 w-3 mr-1.5 text-green-500" />
                            {stop.device}
                          </p>
                        </div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border ${
                          stop.status === 'COMPLETED' 
                            ? 'bg-green-100 text-green-800 border-green-200' 
                            : 'bg-gray-100 text-gray-800 border-gray-200'
                        }`}>
                          {stop.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-sm text-gray-600">
                        <div className="flex items-center bg-gray-50/50 px-3 py-2 rounded-lg backdrop-blur-sm">
                          <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                          <span className="truncate font-medium">{stop.address}</span>
                        </div>
                        <div className="flex items-center bg-gray-50/50 px-3 py-2 rounded-lg backdrop-blur-sm">
                          <Clock className="h-4 w-4 mr-2 text-purple-500" />
                          <span className="font-medium">{stop.scheduledTime}</span>
                        </div>
                      </div>

                      {stop.environmentalImpact && (
                        <div className="flex items-center gap-2 mt-2 text-xs text-green-600 bg-green-50/50 px-2 py-1 rounded-full backdrop-blur-sm w-fit">
                          <Leaf className="h-3 w-3" />
                          <span>{stop.environmentalImpact}</span>
                        </div>
                      )}
                      
                      <div className="mt-3 flex space-x-2">
                        <button 
                          onClick={() => startNavigation(stop.id)} 
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 group/btn"
                        >
                          <Navigation className="h-3 w-3 mr-1.5 group-hover/btn:scale-110 transition-transform" /> 
                          Navigate
                        </button>
                        <button className="bg-white border border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium flex items-center transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 group/btn">
                          <Phone className="h-3 w-3 mr-1.5 group-hover/btn:scale-110 transition-transform" /> 
                          Call
                        </button>
                        
                        {stop.status === 'CURRENT' && (
                          <button 
                            onClick={() => handleInitiateCompletion(stop.id)} 
                            disabled={isSendingOtp}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 group/btn disabled:bg-gray-300 disabled:cursor-not-allowed"
                          >
                            {isSendingOtp ? (
                              <div className="animate-spin h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1.5 group-hover/btn:scale-110 transition-transform" /> 
                                Verify & Complete
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
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

export default RouteMap;