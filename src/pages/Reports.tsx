import React, { useState } from 'react';
import { FileText, Download, Eye, Calendar, User, Filter, Search, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface MedicalReport {
  id: string;
  patientId: string;
  patientName: string;
  doctorId?: string;
  doctorName?: string;
  title: string;
  description: string;
  type: 'lab' | 'scan' | 'prescription' | 'diagnosis';
  date: string;
  status: 'pending' | 'completed' | 'reviewed';
  fileUrl?: string;
  uploadedBy: string;
}

const Reports: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'lab' | 'scan' | 'prescription' | 'diagnosis'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed' | 'reviewed'>('all');
  const [selectedReport, setSelectedReport] = useState<MedicalReport | null>(null);

  // Mock reports data
  const [reports] = useState<MedicalReport[]>([
    {
      id: '1',
      patientId: '1',
      patientName: 'John Doe',
      doctorId: '1',
      doctorName: 'Dr. Sarah Johnson',
      title: 'Blood Test Results',
      description: 'Complete blood count and metabolic panel results',
      type: 'lab',
      date: '2024-01-15',
      status: 'completed',
      fileUrl: '/reports/blood-test-john-doe.pdf',
      uploadedBy: 'Lab Technician'
    },
    {
      id: '2',
      patientId: '2',
      patientName: 'Mary Smith',
      doctorId: '1',
      doctorName: 'Dr. Sarah Johnson',
      title: 'Chest X-Ray',
      description: 'Chest X-ray for respiratory symptoms evaluation',
      type: 'scan',
      date: '2024-01-14',
      status: 'reviewed',
      fileUrl: '/reports/chest-xray-mary-smith.pdf',
      uploadedBy: 'Radiology Staff'
    },
    {
      id: '3',
      patientId: '1',
      patientName: 'John Doe',
      doctorId: '1',
      doctorName: 'Dr. Sarah Johnson',
      title: 'Diabetes Medication',
      description: 'Prescription for diabetes management',
      type: 'prescription',
      date: '2024-01-13',
      status: 'completed',
      uploadedBy: 'Dr. Sarah Johnson'
    },
    {
      id: '4',
      patientId: '3',
      patientName: 'Robert Johnson',
      doctorId: '1',
      doctorName: 'Dr. Sarah Johnson',
      title: 'Cardiac Assessment',
      description: 'Comprehensive cardiac evaluation and diagnosis',
      type: 'diagnosis',
      date: '2024-01-12',
      status: 'pending',
      uploadedBy: 'Dr. Sarah Johnson'
    }
  ]);

  const getFilteredReports = () => {
    let filtered = reports;

    // Filter by user role
    if (user?.role === 'patient') {
      filtered = filtered.filter(report => report.patientName === `${user.firstName} ${user.lastName}`);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(report =>
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(report => report.type === filterType);
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(report => report.status === filterStatus);
    }

    return filtered;
  };

  const filteredReports = getFilteredReports();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lab':
        return '🧪';
      case 'scan':
        return '📷';
      case 'prescription':
        return '💊';
      case 'diagnosis':
        return '🩺';
      default:
        return '📄';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lab':
        return 'bg-blue-100 text-blue-800';
      case 'scan':
        return 'bg-purple-100 text-purple-800';
      case 'prescription':
        return 'bg-green-100 text-green-800';
      case 'diagnosis':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const ReportModal: React.FC<{ report: MedicalReport | null; onClose: () => void }> = ({ report, onClose }) => {
    if (!report) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Report Details</h2>
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
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Report Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Title</label>
                    <p className="text-gray-800">{report.title}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Type</label>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(report.type)}`}>
                      {getTypeIcon(report.type)} {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                    </span>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Status</label>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(report.status)}`}>
                      {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                    </span>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Date</label>
                    <p className="text-gray-800">{new Date(report.date).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">People Involved</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Patient</label>
                    <p className="text-gray-800">{report.patientName}</p>
                  </div>
                  {report.doctorName && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Doctor</label>
                      <p className="text-gray-800">{report.doctorName}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-600">Uploaded By</label>
                    <p className="text-gray-800">{report.uploadedBy}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Description</h3>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{report.description}</p>
            </div>

            {report.fileUrl && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Attached File</h3>
                <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">Report Document</p>
                    <p className="text-sm text-gray-600">PDF Document</p>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              Close
            </button>
            {user?.role === 'doctor' && (
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                Mark as Reviewed
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const getPageTitle = () => {
    switch (user?.role) {
      case 'doctor':
        return 'Medical Reports';
      case 'patient':
        return 'My Medical Reports';
      case 'staff':
        return 'Manage Reports';
      default:
        return 'Reports';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{getPageTitle()}</h1>
            <p className="text-gray-600 mt-2">
              {user?.role === 'doctor' && 'Review and manage patient medical reports'}
              {user?.role === 'patient' && 'View your medical reports and test results'}
              {user?.role === 'staff' && 'Upload and manage medical reports'}
            </p>
          </div>
          {user?.role === 'staff' && (
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Upload Report</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
            />
          </div>
          
          <div className="flex space-x-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="lab">Lab Results</option>
              <option value="scan">Scans</option>
              <option value="prescription">Prescriptions</option>
              <option value="diagnosis">Diagnosis</option>
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="reviewed">Reviewed</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredReports.map((report) => (
            <div key={report.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-2xl">{getTypeIcon(report.type)}</span>
                    <div>
                      <h3 className="font-semibold text-gray-800">{report.title}</h3>
                      <p className="text-sm text-gray-600">{report.description}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <User className="h-4 w-4" />
                      <span>{report.patientName}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(report.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <FileText className="h-4 w-4" />
                      <span>By {report.uploadedBy}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(report.type)}`}>
                      {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(report.status)}`}>
                      {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                    </span>
                  </div>
                </div>
                
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => setSelectedReport(report)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  {report.fileUrl && (
                    <button
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Download"
                    >
                      <Download className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredReports.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No reports found matching your criteria.</p>
          </div>
        )}
      </div>

      {selectedReport && (
        <ReportModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}
    </div>
  );
};

export default Reports;