import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, MapPin, Phone, Mail } from 'lucide-react';

const SchedulePickupModal = ({ 
  isOpen, 
  onClose, 
  request, 
  onSchedule,
  pickupPersons = [] 
}) => {
  const [formData, setFormData] = useState({
    pickupDate: '',
    pickupTime: '',
    pickupPersonId: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && request) {
      // Set default values
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const defaultDate = tomorrow.toISOString().split('T')[0];
      const defaultTime = '10:00';

      setFormData({
        pickupDate: defaultDate,
        pickupTime: defaultTime,
        pickupPersonId: pickupPersons[0]?.id || '',
        notes: ''
      });
    }
  }, [isOpen, request, pickupPersons]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const pickupDateTime = new Date(`${formData.pickupDate}T${formData.pickupTime}`);
      
      await onSchedule({
        ...formData,
        pickupDateTime: pickupDateTime.toISOString(),
        requestId: request.id
      });
      
      onClose();
    } catch (error) {
      console.error('Error scheduling pickup:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      pickupDate: '',
      pickupTime: '',
      pickupPersonId: '',
      notes: ''
    });
    onClose();
  };

  if (!isOpen || !request) return null;

  // Mock pickup persons data
  const mockPickupPersons = [
    { id: '1', name: 'John Doe', phone: '+1234567890', email: 'john@ewaste.com', area: 'Downtown' },
    { id: '2', name: 'Jane Smith', phone: '+1234567891', email: 'jane@ewaste.com', area: 'Uptown' },
    { id: '3', name: 'Mike Johnson', phone: '+1234567892', email: 'mike@ewaste.com', area: 'Suburbs' }
  ];

  const availablePersons = pickupPersons.length > 0 ? pickupPersons : mockPickupPersons;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Schedule Pickup</h2>
            <p className="text-gray-600 mt-1">Schedule e-waste collection for user</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Request Details */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Device Type</p>
              <p className="font-medium text-gray-900">{request.deviceType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Brand & Model</p>
              <p className="font-medium text-gray-900">{request.brand} {request.model}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Condition</p>
              <p className="font-medium text-gray-900 capitalize">{request.condition?.toLowerCase()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Quantity</p>
              <p className="font-medium text-gray-900">{request.quantity}</p>
            </div>
          </div>

          {/* User Information */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="text-md font-semibold text-gray-900 mb-3">User Information</h4>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-900">{request.user?.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{request.user?.email}</span>
              </div>
              {request.user?.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{request.user.phone}</span>
                </div>
              )}
            </div>
            <div className="mt-2 flex items-start space-x-2">
              <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
              <span className="text-sm text-gray-600 flex-1">{request.pickupAddress}</span>
            </div>
          </div>
        </div>

        {/* Schedule Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>Pickup Date</span>
                  </div>
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.pickupDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, pickupDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>Pickup Time</span>
                  </div>
                </label>
                <input
                  type="time"
                  required
                  value={formData.pickupTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, pickupTime: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Pickup Person */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assign Pickup Person
              </label>
              <select
                required
                value={formData.pickupPersonId}
                onChange={(e) => setFormData(prev => ({ ...prev, pickupPersonId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select pickup person</option>
                {availablePersons.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.name} - {person.area} ({person.phone})
                  </option>
                ))}
              </select>
              
              {formData.pickupPersonId && (
                <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700">
                    Selected: {availablePersons.find(p => p.id === formData.pickupPersonId)?.name}
                  </p>
                </div>
              )}
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add any special instructions for the pickup person..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Schedule Summary */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">Schedule Summary</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>
                  <span className="font-medium">Pickup Date:</span>{' '}
                  {formData.pickupDate ? new Date(formData.pickupDate).toLocaleDateString() : 'Not set'}
                </p>
                <p>
                  <span className="font-medium">Pickup Time:</span>{' '}
                  {formData.pickupTime || 'Not set'}
                </p>
                <p>
                  <span className="font-medium">Assigned To:</span>{' '}
                  {formData.pickupPersonId 
                    ? availablePersons.find(p => p.id === formData.pickupPersonId)?.name
                    : 'Not assigned'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.pickupDate || !formData.pickupTime || !formData.pickupPersonId}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Scheduling...' : 'Schedule Pickup'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SchedulePickupModal;