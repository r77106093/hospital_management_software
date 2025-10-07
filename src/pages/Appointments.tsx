import React, { useState } from 'react';
import { Calendar, Clock, User, Phone, MapPin, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Appointments: React.FC = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'completed' | 'cancelled'>('all');

  // Mock data - in real app, this would come from API
  const mockAppointments = [
    {
      id: '1',
      patientName: 'John Doe',
      doctorName: 'Dr. Sarah Johnson',
      date: '2024-01-15',
      time: '10:00 AM',
      status: 'scheduled' as const,
      reason: 'Regular Checkup',
      notes: 'Annual health checkup',
      phone: '+1234567890'
    },
    {
      id: '2',
      patientName: 'Mary Smith',
      doctorName: 'Dr. Sarah Johnson',
      date: '2024-01-14',
      time: '2:30 PM',
      status: 'completed' as const,
      reason: 'Follow-up Consultation',
      notes: 'Blood pressure monitoring',
      phone: '+1234567891'
    },
    {
      id: '3',
      patientName: 'Alex Johnson',
      doctorName: 'Dr. Sarah Johnson',
      date: '2024-01-16',
      time: '11:15 AM',
      status: 'scheduled' as const,
      reason: 'Consultation',
      notes: 'Chest pain investigation',
      phone: '+1234567892'
    },
  ];

  const filteredAppointments = filter === 'all' 
    ? mockAppointments 
    : mockAppointments.filter(apt => apt.status === filter);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPageTitle = () => {
    switch (user?.role) {
      case 'doctor':
        return 'Patient Appointments';
      case 'patient':
        return 'My Appointments';
      case 'staff':
        return 'Manage Appointments';
      default:
        return 'Appointments';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{getPageTitle()}</h1>
            <p className="text-gray-600 mt-2">
              {user?.role === 'doctor' && 'View and manage your patient appointments'}
              {user?.role === 'patient' && 'View and manage your upcoming appointments'}
              {user?.role === 'staff' && 'Manage hospital appointments and scheduling'}
            </p>
          </div>
          {user?.role === 'patient' && (
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Book New Appointment
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center space-x-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Filter Appointments</h2>
          <div className="flex space-x-2">
            {(['all', 'scheduled', 'completed', 'cancelled'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === status
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <div key={appointment.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {user?.role === 'doctor' ? 'Patient' : 'Doctor'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {user?.role === 'doctor' ? appointment.patientName : appointment.doctorName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">Date</p>
                      <p className="text-sm text-gray-600">{appointment.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">Time</p>
                      <p className="text-sm text-gray-600">{appointment.time}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {getStatusIcon(appointment.status)}
                    <div>
                      <p className="text-sm font-medium text-gray-800">Status</p>
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="ml-6 flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View Details
                  </button>
                  {appointment.status === 'scheduled' && (
                    <>
                      <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                        Complete
                      </button>
                      <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-800">Reason</p>
                    <p className="text-sm text-gray-600">{appointment.reason}</p>
                  </div>
                  {appointment.notes && (
                    <div>
                      <p className="text-sm font-medium text-gray-800">Notes</p>
                      <p className="text-sm text-gray-600">{appointment.notes}</p>
                    </div>
                  )}
                </div>
                {user?.role !== 'patient' && (
                  <div className="mt-2 flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <p className="text-sm text-gray-600">{appointment.phone}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredAppointments.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No appointments found for the selected filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;