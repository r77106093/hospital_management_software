import React, { useState } from 'react';
import { Search, Plus, User, Phone, Mail, Calendar, MapPin, FileText, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  bloodType: string;
  emergencyContact: string;
  medicalHistory: string[];
  lastVisit: string;
  status: 'active' | 'inactive';
}

const Patients: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Mock patient data
  const [patients] = useState<Patient[]>([
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@email.com',
      phone: '+1234567890',
      dateOfBirth: '1985-06-15',
      address: '123 Main St, City, State 12345',
      bloodType: 'O+',
      emergencyContact: '+1234567891',
      medicalHistory: ['Hypertension', 'Diabetes Type 2'],
      lastVisit: '2024-01-10',
      status: 'active'
    },
    {
      id: '2',
      firstName: 'Mary',
      lastName: 'Smith',
      email: 'mary.smith@email.com',
      phone: '+1234567892',
      dateOfBirth: '1990-03-22',
      address: '456 Oak Ave, City, State 12345',
      bloodType: 'A-',
      emergencyContact: '+1234567893',
      medicalHistory: ['Asthma', 'Allergies'],
      lastVisit: '2024-01-08',
      status: 'active'
    },
    {
      id: '3',
      firstName: 'Robert',
      lastName: 'Johnson',
      email: 'robert.johnson@email.com',
      phone: '+1234567894',
      dateOfBirth: '1978-11-30',
      address: '789 Pine St, City, State 12345',
      bloodType: 'B+',
      emergencyContact: '+1234567895',
      medicalHistory: ['Heart Disease', 'High Cholesterol'],
      lastVisit: '2024-01-05',
      status: 'active'
    }
  ]);

  const filteredPatients = patients.filter(patient =>
    `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const PatientModal: React.FC<{ patient: Patient | null; onClose: () => void }> = ({ patient, onClose }) => {
    if (!patient) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Patient Details</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Full Name</label>
                    <p className="text-gray-800">{patient.firstName} {patient.lastName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Age</label>
                    <p className="text-gray-800">{calculateAge(patient.dateOfBirth)} years</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Blood Type</label>
                    <p className="text-gray-800">{patient.bloodType}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Phone</label>
                    <p className="text-gray-800">{patient.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-gray-800">{patient.email}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Address</label>
                    <p className="text-gray-800">{patient.address}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Emergency Contact</label>
                    <p className="text-gray-800">{patient.emergencyContact}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Last Visit</label>
                    <p className="text-gray-800">{new Date(patient.lastVisit).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Status</label>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                      patient.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Medical History</h3>
              <div className="space-y-2">
                {patient.medicalHistory.map((condition, index) => (
                  <span
                    key={index}
                    className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm mr-2 mb-2"
                  >
                    {condition}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              Close
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
              Edit Patient
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Patient Management</h1>
            <p className="text-gray-600 mt-2">Manage patient records and information</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Patient</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search patients by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
            />
          </div>
          <div className="text-sm text-gray-600">
            {filteredPatients.length} patient{filteredPatients.length !== 1 ? 's' : ''} found
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => (
            <div key={patient.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{patient.firstName} {patient.lastName}</h3>
                    <p className="text-sm text-gray-600">{calculateAge(patient.dateOfBirth)} years old</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  patient.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {patient.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{patient.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{patient.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Last visit: {new Date(patient.lastVisit).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Medical History:</p>
                <div className="flex flex-wrap gap-1">
                  {patient.medicalHistory.slice(0, 2).map((condition, index) => (
                    <span
                      key={index}
                      className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                    >
                      {condition}
                    </span>
                  ))}
                  {patient.medicalHistory.length > 2 && (
                    <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                      +{patient.medicalHistory.length - 2} more
                    </span>
                  )}
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedPatient(patient)}
                  className="flex-1 bg-blue-50 text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                >
                  View Details
                </button>
                <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredPatients.length === 0 && (
          <div className="text-center py-12">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No patients found matching your search.</p>
          </div>
        )}
      </div>

      {selectedPatient && (
        <PatientModal
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
        />
      )}
    </div>
  );
};

export default Patients;