import React, { useState } from 'react';
import { Calendar, Clock, User, Stethoscope, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  department: string;
  availableSlots: string[];
}

interface AppointmentForm {
  doctorId: string;
  date: string;
  time: string;
  reason: string;
  notes: string;
  urgency: 'routine' | 'urgent' | 'emergency';
}

const BookAppointment: React.FC = () => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState<AppointmentForm>({
    doctorId: '',
    date: '',
    time: '',
    reason: '',
    notes: '',
    urgency: 'routine'
  });

  // Mock doctors data
  const doctors: Doctor[] = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      specialization: 'Cardiology',
      department: 'Heart & Vascular',
      availableSlots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      specialization: 'Neurology',
      department: 'Brain & Spine',
      availableSlots: ['08:00', '09:30', '11:00', '13:30', '15:00', '16:30']
    },
    {
      id: '3',
      name: 'Dr. Emily Rodriguez',
      specialization: 'Dermatology',
      department: 'Skin Care',
      availableSlots: ['09:00', '10:30', '12:00', '14:30', '16:00']
    },
    {
      id: '4',
      name: 'Dr. David Wilson',
      specialization: 'Orthopedics',
      department: 'Bone & Joint',
      availableSlots: ['08:30', '10:00', '11:30', '14:00', '15:30']
    }
  ];

  const selectedDoctor = doctors.find(doc => doc.id === formData.doctorId);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Booking appointment:', formData);
    setShowSuccess(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
      setStep(1);
      setFormData({
        doctorId: '',
        date: '',
        time: '',
        reason: '',
        notes: '',
        urgency: 'routine'
      });
    }, 3000);
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30); // 30 days from now
    return maxDate.toISOString().split('T')[0];
  };

  if (showSuccess) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center max-w-md">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Appointment Booked!</h2>
          <p className="text-gray-600 mb-4">
            Your appointment has been successfully scheduled with {selectedDoctor?.name} on{' '}
            {new Date(formData.date).toLocaleDateString()} at {formData.time}.
          </p>
          <p className="text-sm text-gray-500">
            You will receive a confirmation email shortly. You can view your appointments in the dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800">Book New Appointment</h1>
        <p className="text-gray-600 mt-2">Schedule an appointment with one of our healthcare professionals</p>
        
        {/* Progress Steps */}
        <div className="flex items-center space-x-4 mt-6">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= stepNumber ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {stepNumber}
              </div>
              {stepNumber < 3 && (
                <div className={`w-16 h-1 mx-2 ${
                  step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        
        <div className="flex space-x-4 mt-2 text-sm">
          <span className={step >= 1 ? 'text-blue-600 font-medium' : 'text-gray-500'}>Select Doctor</span>
          <span className={step >= 2 ? 'text-blue-600 font-medium' : 'text-gray-500'}>Choose Date & Time</span>
          <span className={step >= 3 ? 'text-blue-600 font-medium' : 'text-gray-500'}>Appointment Details</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Select Doctor */}
        {step === 1 && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Select a Doctor</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {doctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                    formData.doctorId === doctor.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, doctorId: doctor.id }))}
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Stethoscope className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{doctor.name}</h3>
                      <p className="text-sm text-gray-600">{doctor.specialization}</p>
                      <p className="text-xs text-gray-500">{doctor.department}</p>
                      <div className="mt-2">
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          {doctor.availableSlots.length} slots available
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!formData.doctorId}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next: Choose Date & Time
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Select Date and Time */}
        {step === 2 && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Choose Date & Time</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  min={getMinDate()}
                  max={getMaxDate()}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Time Slots
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {selectedDoctor?.availableSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, time: slot }))}
                      className={`p-3 text-sm font-medium rounded-lg border transition-colors ${
                        formData.time === slot
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-gray-600 hover:text-gray-800 font-medium"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                disabled={!formData.date || !formData.time}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next: Appointment Details
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Appointment Details */}
        {step === 3 && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Appointment Details</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Visit *
                </label>
                <input
                  type="text"
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  placeholder="e.g., Regular checkup, Follow-up, Specific symptoms"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Urgency Level
                </label>
                <select
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="routine">Routine</option>
                  <option value="urgent">Urgent</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Any additional information you'd like the doctor to know..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {/* Appointment Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Appointment Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Doctor:</span>
                    <span className="font-medium">{selectedDoctor?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Specialization:</span>
                    <span className="font-medium">{selectedDoctor?.specialization}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{formData.date ? new Date(formData.date).toLocaleDateString() : '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">{formData.time || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Urgency:</span>
                    <span className={`font-medium capitalize ${
                      formData.urgency === 'emergency' ? 'text-red-600' :
                      formData.urgency === 'urgent' ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {formData.urgency}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-gray-600 hover:text-gray-800 font-medium"
              >
                Back
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
              >
                <CheckCircle className="h-5 w-5" />
                <span>Book Appointment</span>
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default BookAppointment;