import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import {
  ArrowLeft, Upload, Trash2, Camera, CheckCircle,
  Smartphone, Laptop, Monitor, Printer, Headphones,
  Tablet, Tv, Cpu, HardDrive, Battery, Recycle, Zap, Leaf, TrendingUp,
  MapPin, Image as ImageIcon, Loader
} from 'lucide-react';

const NewRequest = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    deviceType: '',
    brand: '',
    model: '',
    condition: '',
    quantity: 1,
    pickupAddress: user?.pickupAddress || '',
    remarks: '',
    images: {
      front: null,
      back: null,
      left: null,
      right: null,
      accessories: null
    }
  });

  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false); // Specific loading state for location
  const [imagePreviews, setImagePreviews] = useState({
    front: null,
    back: null,
    left: null,
    right: null,
    accessories: null
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDevice, setSelectedDevice] = useState(null);

  const imageSlots = [
    { id: 'front', label: 'Front Side', required: true },
    { id: 'back', label: 'Back Side', required: true },
    { id: 'left', label: 'Left Side', required: false },
    { id: 'right', label: 'Right Side', required: false },
    { id: 'accessories', label: 'Accessories/Other', required: false },
  ];

  const deviceTypes = [
    { value: 'MOBILE', label: 'Mobile Phone', icon: Smartphone, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9', color: 'from-blue-500 to-cyan-500', bgColor: 'bg-blue-100 border-blue-200 text-blue-600' },
    { value: 'LAPTOP', label: 'Laptop', icon: Laptop, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853', color: 'from-purple-500 to-pink-500', bgColor: 'bg-purple-100 border-purple-200 text-purple-600' },
    { value: 'DESKTOP', label: 'Desktop', icon: Monitor, image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c', color: 'from-green-500 to-emerald-500', bgColor: 'bg-green-100 border-green-200 text-green-600' },
    { value: 'TABLET', label: 'Tablet', icon: Tablet, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64', color: 'from-orange-500 to-red-500', bgColor: 'bg-orange-100 border-orange-200 text-orange-600' },
    { value: 'PRINTER', label: 'Printer', icon: Printer, image: 'https://images.unsplash.com/photo-1558756522-0c2b4d1b257a', color: 'from-gray-500 to-blue-500', bgColor: 'bg-gray-100 border-gray-200 text-gray-600' },
    { value: 'MONITOR', label: 'Monitor', icon: Monitor, image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f', color: 'from-indigo-500 to-purple-500', bgColor: 'bg-indigo-100 border-indigo-200 text-indigo-600' },
    { value: 'TV', label: 'Television', icon: Tv, image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1', color: 'from-red-500 to-pink-500', bgColor: 'bg-red-100 border-red-200 text-red-600' },
    { value: 'CAMERA', label: 'Camera', icon: Camera, image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd', color: 'from-yellow-500 to-orange-500', bgColor: 'bg-yellow-100 border-yellow-200 text-yellow-600' },
    { value: 'HEADPHONES', label: 'Headphones', icon: Headphones, image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90', color: 'from-teal-500 to-cyan-500', bgColor: 'bg-teal-100 border-teal-200 text-teal-600' },
    { value: 'OTHER', label: 'Other', icon: Cpu, image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b', color: 'from-gray-600 to-gray-800', bgColor: 'bg-gray-100 border-gray-200 text-gray-600' }
  ];

  const conditions = [
    { value: 'WORKING', label: 'Working Perfectly', description: 'Device functions normally without issues', color: 'border-green-200 bg-green-50 hover:bg-green-100 text-green-700', icon: CheckCircle },
    { value: 'DAMAGED', label: 'Damaged but Functional', description: 'Some issues but still usable', color: 'border-yellow-200 bg-yellow-50 hover:bg-yellow-100 text-yellow-700', icon: CheckCircle },
    { value: 'BROKEN', label: 'Broken/Not Working', description: 'Device does not function properly', color: 'border-orange-200 bg-orange-50 hover:bg-orange-100 text-orange-700', icon: CheckCircle },
    { value: 'FOR_PARTS', label: 'For Parts Only', description: 'Can be used for spare parts', color: 'border-red-200 bg-red-50 hover:bg-red-100 text-red-700', icon: CheckCircle }
  ];

  const steps = [
    { number: 1, title: 'Device Type', completed: currentStep > 1, icon: Cpu },
    { number: 2, title: 'Details', completed: currentStep > 2, icon: Laptop },
    { number: 3, title: 'Condition & Images', completed: currentStep > 3, icon: Camera },
    { number: 4, title: 'Pickup Details', completed: currentStep > 4, icon: MapPin }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDeviceSelect = (device) => {
    setFormData(prev => ({ ...prev, deviceType: device.value }));
    setSelectedDevice(device);
    setCurrentStep(2);
  };

  const handleImageUpload = (e, side) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        images: { ...prev.images, [side]: file }
      }));
      setImagePreviews(prev => ({
        ...prev,
        [side]: URL.createObjectURL(file)
      }));
    }
  };

  const removeImage = (side) => {
    setFormData(prev => ({
      ...prev,
      images: { ...prev.images, [side]: null }
    }));
    setImagePreviews(prev => ({
      ...prev,
      [side]: null
    }));
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // --- NEW: Handle Current Location ---
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Use OpenStreetMap Nominatim for Reverse Geocoding (Free)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();

          if (data && data.display_name) {
            setFormData((prev) => ({ ...prev, pickupAddress: data.display_name }));
          } else {
            // Fallback to coordinates if address lookup fails
            setFormData((prev) => ({ 
              ...prev, 
              pickupAddress: `Lat: ${latitude}, Long: ${longitude}` 
            }));
          }
        } catch (error) {
          console.error("Error fetching address:", error);
          // Fallback to coordinates
          setFormData((prev) => ({ 
            ...prev, 
            pickupAddress: `Lat: ${position.coords.latitude}, Long: ${position.coords.longitude}` 
          }));
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to retrieve location. Please check your browser permissions.");
        setLocationLoading(false);
      }
    );
  };
  // ------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Safety check to ensure we are on the final step
    if (currentStep !== 4) return;

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Please login again.");
        navigate('/login');
        return;
      }

      // Validation
      if (!formData.condition) {
        alert("Please select a device condition.");
        setLoading(false);
        return;
      }

      const submitData = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (key !== 'images') submitData.append(key, formData[key]);
      });

      Object.keys(formData.images).forEach(key => {
        if (formData.images[key]) submitData.append('images', formData.images[key]);
      });

      await axios.post('http://localhost:8080/api/requests', submitData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      document.getElementById('successAnimation').classList.remove('hidden');
      setTimeout(() => navigate('/dashboard'), 2000);

    } catch (error) {
      console.error('Error submitting request:', error);
      if (error.response?.status === 401) alert("Session expired. Please login again.");
      else if (error.response?.status === 413) alert("Files are too large!");
      else alert(`Error: ${error.response?.data?.message || 'Submission failed'}`);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">What type of device are you recycling?</h2>
              <p className="text-gray-600">Select the category that best describes your electronic device</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {deviceTypes.map((device) => {
                const IconComponent = device.icon;
                return (
                  <button
                    key={device.value}
                    type="button"
                    onClick={() => handleDeviceSelect(device)}
                    className={`group relative overflow-hidden rounded-2xl border-2 p-6 text-center transition-all duration-300 backdrop-blur-sm hover:shadow-xl ${formData.deviceType === device.value
                        ? 'border-green-500 bg-green-50/50 shadow-lg scale-105'
                        : 'border-gray-200/50 bg-white/50 hover:border-green-300'
                      }`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${device.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                    <div className={`p-3 rounded-xl border mb-4 mx-auto w-16 h-16 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform ${formData.deviceType === device.value ? 'bg-green-100 border-green-200' : device.bgColor
                      }`}>
                      <IconComponent className={`h-6 w-6 ${formData.deviceType === device.value ? 'text-green-600' : 'text-current'
                        }`} />
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 block">
                      {device.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 animate-fade-in">
            {selectedDevice && (
              <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl border border-green-200/50 backdrop-blur-sm mb-6">
                <div className={`p-3 rounded-xl border ${selectedDevice.bgColor} backdrop-blur-sm`}>
                  {React.createElement(selectedDevice.icon, { className: "h-8 w-8" })}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{selectedDevice.label}</h3>
                  <p className="text-sm text-gray-600">Selected device type</p>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-500" /> Brand *
                </label>
                <input type="text" id="brand" name="brand" required value={formData.brand} onChange={handleChange} className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all rounded-xl outline-none backdrop-blur-sm" placeholder="e.g., Samsung, Apple, Dell" />
              </div>
              <div className="group">
                <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-purple-500" /> Model *
                </label>
                <input type="text" id="model" name="model" required value={formData.model} onChange={handleChange} className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all rounded-xl outline-none backdrop-blur-sm" placeholder="e.g., iPhone 13, Galaxy S21" />
              </div>
              <div className="group">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" /> Quantity *
                </label>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setFormData(prev => ({ ...prev, quantity: Math.max(1, prev.quantity - 1) }))} className="w-12 h-12 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all duration-300 backdrop-blur-sm hover:shadow-md">
                    <span className="text-lg font-semibold">-</span>
                  </button>
                  <div className="w-20 px-3 py-2 border border-gray-200 rounded-xl text-center bg-white/50 backdrop-blur-sm font-semibold text-lg">
                    {formData.quantity}
                  </div>
                  <button type="button" onClick={() => setFormData(prev => ({ ...prev, quantity: Math.min(10, prev.quantity + 1) }))} className="w-12 h-12 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all duration-300 backdrop-blur-sm hover:shadow-md">
                    <span className="text-lg font-semibold">+</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg border border-green-200">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Device Condition</h3>
                  <p className="text-gray-600">Select the current state of your device</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {conditions.map(condition => {
                  const ConditionIcon = condition.icon;
                  return (
                    <button key={condition.value} type="button" onClick={() => setFormData(prev => ({ ...prev, condition: condition.value }))} className={`p-6 border-2 rounded-2xl text-left transition-all duration-300 backdrop-blur-sm hover:shadow-lg group ${formData.condition === condition.value ? `${condition.color} border-current scale-105 shadow-lg` : 'border-gray-200/50 bg-white/50 hover:border-green-300'}`}>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-semibold text-lg">{condition.label}</span>
                        {formData.condition === condition.value && (
                          <div className="p-2 bg-green-100 rounded-xl border border-green-200">
                            <ConditionIcon className="h-5 w-5 text-green-600" />
                          </div>
                        )}
                      </div>
                      <p className="text-sm opacity-75">{condition.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="space-y-4 pt-4 border-t border-gray-200/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg border border-blue-200">
                  <Camera className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Upload Photos</h3>
                  <p className="text-gray-600">Please upload photos for each side</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {imageSlots.map((slot) => (
                  <div key={slot.id} className="relative group animate-scale-in">
                    {imagePreviews[slot.id] ? (
                      <div className="relative h-40 w-full">
                        <img src={imagePreviews[slot.id]} alt={slot.label} className="w-full h-full object-cover rounded-2xl border-2 border-gray-200/50 group-hover:border-green-300 transition-all duration-300 backdrop-blur-sm" />
                        <div className="absolute inset-x-0 bottom-0 bg-black/50 p-2 rounded-b-2xl backdrop-blur-sm">
                          <span className="text-white text-xs font-medium block text-center">{slot.label}</span>
                        </div>
                        <button type="button" onClick={() => removeImage(slot.id)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110 backdrop-blur-sm border border-red-200 z-10">
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <label className="h-40 w-full border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-green-400 hover:bg-green-50/50 transition-all duration-300 group backdrop-blur-sm bg-white/30">
                        <div className="p-3 bg-white/50 rounded-full mb-2 group-hover:scale-110 transition-transform duration-300">
                          <Upload className="h-6 w-6 text-gray-400 group-hover:text-green-500 transition-colors" />
                        </div>
                        <span className="text-sm font-semibold text-gray-600 group-hover:text-green-600">{slot.label}</span>
                        <span className="text-xs text-gray-400 mt-1">{slot.required ? '(Required)' : '(Optional)'}</span>
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, slot.id)} className="hidden" />
                      </label>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg border border-purple-200">
                  <Leaf className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Pickup Information</h3>
                  <p className="text-gray-600">Tell us where to collect your device</p>
                </div>
              </div>
              <div className="group">
                {/* --- ADDED: Flex container for label and Current Location button --- */}
                <div className="flex justify-between items-center mb-3">
                  <label htmlFor="pickupAddress" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" /> Pickup Address *
                  </label>
                  <button
                    type="button"
                    onClick={handleGetCurrentLocation}
                    disabled={locationLoading}
                    className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 hover:border-blue-200 transition-all hover:shadow-sm disabled:opacity-50"
                  >
                    {locationLoading ? (
                      <Loader className="h-3 w-3 animate-spin" />
                    ) : (
                      <MapPin className="h-3 w-3" />
                    )}
                    {locationLoading ? 'Detecting...' : 'Use Current Location'}
                  </button>
                </div>
                {/* ----------------------------------------------------------------- */}
                <textarea id="pickupAddress" name="pickupAddress" required rows={4} value={formData.pickupAddress} onChange={handleChange} className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all rounded-xl outline-none backdrop-blur-sm resize-none" placeholder="Enter complete pickup address including landmarks..." />
              </div>
              <div className="group">
                <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-500" /> Additional Remarks
                </label>
                <textarea id="remarks" name="remarks" rows={3} value={formData.remarks} onChange={handleChange} className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all rounded-xl outline-none backdrop-blur-sm resize-none" placeholder="Any special instructions, access codes, or additional information about the device..." />
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50/50 to-blue-50/50 border border-green-200/50 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg border border-green-200">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 text-lg">Request Summary</h4>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white/50 rounded-xl p-3 border border-gray-200/50 backdrop-blur-sm"><span className="text-gray-600 text-xs font-medium">Device:</span><p className="font-semibold text-gray-900">{selectedDevice?.label}</p></div>
                <div className="bg-white/50 rounded-xl p-3 border border-gray-200/50 backdrop-blur-sm"><span className="text-gray-600 text-xs font-medium">Brand & Model:</span><p className="font-semibold text-gray-900">{formData.brand} {formData.model}</p></div>
                <div className="bg-white/50 rounded-xl p-3 border border-gray-200/50 backdrop-blur-sm"><span className="text-gray-600 text-xs font-medium">Condition:</span><p className="font-semibold text-gray-900">{conditions.find(c => c.value === formData.condition)?.label}</p></div>
                <div className="bg-white/50 rounded-xl p-3 border border-gray-200/50 backdrop-blur-sm"><span className="text-gray-600 text-xs font-medium">Quantity:</span><p className="font-semibold text-gray-900">{formData.quantity}</p></div>
                <div className="bg-white/50 rounded-xl p-3 border border-gray-200/50 backdrop-blur-sm col-span-2">
                  <span className="text-gray-600 text-xs font-medium">Images Uploaded:</span>
                  <div className="flex gap-2 mt-1">
                    {Object.entries(imagePreviews).map(([key, value]) => (value && (<span key={key} className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-md border border-green-200 capitalize">{key}</span>)))}
                    {!Object.values(imagePreviews).some(Boolean) && <span className="text-gray-400 italic">None</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-6 space-y-6 relative overflow-hidden bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-64 h-64 opacity-5 animate-recycle-spin-slow"><Recycle className="w-full h-full text-green-400" /></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 opacity-5 animate-recycle-spin-reverse"><Recycle className="w-full h-full text-blue-400" /></div>
        <div className="absolute top-1/4 right-1/4 w-48 h-48 opacity-5 animate-recycle-spin-medium"><Recycle className="w-full h-full text-purple-400" /></div>
        <div className="absolute top-20 left-20 w-8 h-8 opacity-10 animate-recycle-float"><Recycle className="w-full h-full text-green-500" /></div>
        <div className="absolute top-40 right-32 w-6 h-6 opacity-15 animate-recycle-float delay-2000"><Recycle className="w-full h-full text-blue-500" /></div>
        <div className="absolute bottom-32 left-44 w-10 h-10 opacity-10 animate-recycle-float delay-4000"><Recycle className="w-full h-full text-purple-500" /></div>
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs><pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse"><path d="M0 50 L100 50 M50 0 L50 100" stroke="currentColor" strokeWidth="2" fill="none" /><circle cx="50" cy="50" r="8" fill="none" stroke="currentColor" strokeWidth="2" /></pattern></defs>
            <rect width="100%" height="100%" fill="url(#circuit)" className="text-green-300" />
          </svg>
        </div>
        <div className="absolute -top-48 -left-48 w-96 h-96 bg-gradient-to-r from-green-200 to-emerald-200 rounded-full opacity-20 blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-48 -right-48 w-96 h-96 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full opacity-20 blur-3xl animate-pulse-slow delay-2000"></div>
      </div>

      <div id="successAnimation" className="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="bg-white/95 rounded-2xl p-8 text-center border border-gray-200/50 backdrop-blur-sm animate-bounce-in max-w-sm w-full mx-4">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-green-200"><CheckCircle className="h-10 w-10 text-white" /></div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted!</h3>
          <p className="text-gray-600 mb-4">Your e-waste pickup request has been successfully submitted.</p>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500 mx-auto"></div>
        </div>
      </div>

      <div className="relative z-10 space-y-6">
        <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden backdrop-blur-sm bg-white/10 border border-white/20">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30"><Recycle className="h-6 w-6" /></div>
                  <div><h1 className="text-2xl md:text-3xl font-bold">New E-Waste Request</h1><p className="text-green-100 text-lg">Help us recycle your electronics responsibly</p></div>
                </div>
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/30"><Zap className="h-4 w-4 text-green-300" /><span className="text-sm font-medium">Step {currentStep} of 4</span></div>
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/30"><Leaf className="h-4 w-4 text-yellow-300" /><span className="text-sm font-medium">Environmental Impact</span></div>
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/30"><TrendingUp className="h-4 w-4 text-blue-300" /><span className="text-sm font-medium">Quick & Easy Process</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 rounded-2xl shadow-lg border border-gray-200/50 backdrop-blur-sm p-6">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-xl border-2 transition-all duration-300 backdrop-blur-sm ${step.completed || currentStep === step.number ? 'bg-green-500 border-green-500 text-white transform scale-110 shadow-lg' : 'border-gray-300 text-gray-400 bg-white/50'}`}>
                    {step.completed ? (<CheckCircle className="h-6 w-6" />) : (<StepIcon className="h-5 w-5" />)}
                  </div>
                  <span className={`ml-3 text-sm font-medium hidden sm:block ${currentStep === step.number ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>{step.title}</span>
                  {index < steps.length - 1 && (<div className={`w-16 h-1 mx-4 rounded-full ${step.completed ? 'bg-green-500' : 'bg-gray-300'}`}></div>)}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white/80 rounded-2xl shadow-lg border border-gray-200/50 backdrop-blur-sm p-6">
          <form onSubmit={handleSubmit}>
            {renderStepContent()}
            <div className="flex justify-between pt-8 mt-8 border-t border-gray-200/50">
              <button type="button" onClick={prevStep} className={`px-8 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50/50 transition-all duration-300 backdrop-blur-sm hover:shadow-lg transform hover:-translate-y-0.5 ${currentStep === 1 ? 'invisible' : ''}`}>Back</button>
              {currentStep < 4 ? (
                <button 
                  key="continue-btn" // Correct Key
                  type="button" 
                  onClick={nextStep} 
                  disabled={
                    !formData.deviceType || 
                    (currentStep === 2 && (!formData.brand || !formData.model)) || 
                    (currentStep === 3 && !formData.condition)
                  } 
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium py-3 px-8 rounded-xl flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                    Continue<ArrowLeft className="h-4 w-4 rotate-180" />
                </button>
              ) : (
                <button 
                  key="submit-btn" // Correct Key
                  type="submit" 
                  disabled={loading || !formData.pickupAddress || !formData.condition} 
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium py-3 px-8 rounded-xl flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                  {loading ? (<><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>Submitting...</>) : (<><CheckCircle className="h-4 w-4" />Submit Request</>)}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      <style>{`
        @keyframes recycle-spin-slow { from { transform: rotate(0deg) scale(1); } to { transform: rotate(360deg) scale(1); } }
        @keyframes recycle-spin-medium { from { transform: rotate(0deg) scale(1.1); } to { transform: rotate(360deg) scale(1.1); } }
        @keyframes recycle-spin-reverse { from { transform: rotate(360deg) scale(1); } to { transform: rotate(0deg) scale(1); } }
        @keyframes recycle-float { 0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); opacity: 0.1; } 33% { transform: translateY(-20px) rotate(120deg) scale(1.1); opacity: 0.15; } 66% { transform: translateY(-10px) rotate(240deg) scale(0.9); opacity: 0.2; } }
        @keyframes pulse-slow { 0%, 100% { opacity: 0.15; } 50% { opacity: 0.25; } }
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scale-in { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
        @keyframes bounce-in { 0% { opacity: 0; transform: scale(0.3); } 50% { opacity: 1; transform: scale(1.05); } 70% { transform: scale(0.9); } 100% { opacity: 1; transform: scale(1); } }
        .animate-recycle-spin-slow { animation: recycle-spin-slow 20s linear infinite; }
        .animate-recycle-spin-medium { animation: recycle-spin-slow 15s linear infinite; }
        .animate-recycle-spin-reverse { animation: recycle-spin-reverse 25s linear infinite; }
        .animate-recycle-float { animation: recycle-float 8s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 8s ease-in-out infinite; }
        .animate-fade-in { animation: fade-in 0.5s ease-out; }
        .animate-scale-in { animation: scale-in 0.3s ease-out; }
        .animate-bounce-in { animation: bounce-in 0.6s ease-out; }
      `}</style>
    </div>
  );
};

export default NewRequest;