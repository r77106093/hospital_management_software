import React from 'react';
import { Calendar, Users, FileText, Activity, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const getDashboardStats = () => {
    switch (user?.role) {
      case 'doctor':
        return [
          { title: 'Today\'s Appointments', value: '12', icon: Calendar, color: 'bg-blue-500' },
          { title: 'Total Patients', value: '248', icon: Users, color: 'bg-green-500' },
          { title: 'Pending Reports', value: '6', icon: FileText, color: 'bg-yellow-500' },
          { title: 'Completed Today', value: '8', icon: CheckCircle, color: 'bg-teal-500' },
        ];
      case 'patient':
        return [
          { title: 'Upcoming Appointments', value: '2', icon: Calendar, color: 'bg-blue-500' },
          { title: 'Medical Reports', value: '15', icon: FileText, color: 'bg-green-500' },
          { title: 'Prescriptions', value: '3', icon: Activity, color: 'bg-yellow-500' },
          { title: 'Last Visit', value: '3 days ago', icon: Clock, color: 'bg-teal-500' },
        ];
      case 'staff':
        return [
          { title: 'Appointments Today', value: '45', icon: Calendar, color: 'bg-blue-500' },
          { title: 'Reports Uploaded', value: '23', icon: FileText, color: 'bg-green-500' },
          { title: 'Active Patients', value: '156', icon: Users, color: 'bg-yellow-500' },
          { title: 'Pending Tasks', value: '7', icon: Activity, color: 'bg-teal-500' },
        ];
      default:
        return [];
    }
  };

  const stats = getDashboardStats();

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    return `${greeting}, ${user?.firstName}!`;
  };

  const getRecentActivity = () => {
    switch (user?.role) {
      case 'doctor':
        return [
          { type: 'appointment', message: 'Appointment with John Doe completed', time: '2 hours ago' },
          { type: 'report', message: 'Lab report reviewed for Mary Smith', time: '4 hours ago' },
          { type: 'appointment', message: 'New appointment scheduled with Alex Johnson', time: '1 day ago' },
        ];
      case 'patient':
        return [
          { type: 'appointment', message: 'Appointment scheduled with Dr. Johnson', time: '1 day ago' },
          { type: 'report', message: 'New lab report available', time: '3 days ago' },
          { type: 'prescription', message: 'Prescription updated', time: '1 week ago' },
        ];
      case 'staff':
        return [
          { type: 'upload', message: 'Uploaded 5 patient reports', time: '1 hour ago' },
          { type: 'appointment', message: 'Scheduled 12 new appointments', time: '3 hours ago' },
          { type: 'report', message: 'Generated monthly report', time: '1 day ago' },
        ];
      default:
        return [];
    }
  };

  const recentActivity = getRecentActivity();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800">{getWelcomeMessage()}</h1>
        <p className="text-gray-600 mt-2">Here's what's happening with your {user?.role === 'doctor' ? 'practice' : user?.role === 'patient' ? 'health' : 'work'} today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {user?.role === 'doctor' && (
              <>
                <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200 text-left">
                  <Calendar className="h-6 w-6 text-blue-600 mb-2" />
                  <p className="text-sm font-medium text-gray-800">View Schedule</p>
                </button>
                <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200 text-left">
                  <Users className="h-6 w-6 text-green-600 mb-2" />
                  <p className="text-sm font-medium text-gray-800">Patient List</p>
                </button>
                <button className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors duration-200 text-left">
                  <FileText className="h-6 w-6 text-yellow-600 mb-2" />
                  <p className="text-sm font-medium text-gray-800">Review Reports</p>
                </button>
                <button className="p-4 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors duration-200 text-left">
                  <Activity className="h-6 w-6 text-teal-600 mb-2" />
                  <p className="text-sm font-medium text-gray-800">Add Notes</p>
                </button>
              </>
            )}
            
            {user?.role === 'patient' && (
              <>
                <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200 text-left">
                  <Calendar className="h-6 w-6 text-blue-600 mb-2" />
                  <p className="text-sm font-medium text-gray-800">Book Appointment</p>
                </button>
                <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200 text-left">
                  <FileText className="h-6 w-6 text-green-600 mb-2" />
                  <p className="text-sm font-medium text-gray-800">View Reports</p>
                </button>
                <button className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors duration-200 text-left">
                  <Activity className="h-6 w-6 text-yellow-600 mb-2" />
                  <p className="text-sm font-medium text-gray-800">Prescriptions</p>
                </button>
                <button className="p-4 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors duration-200 text-left">
                  <Clock className="h-6 w-6 text-teal-600 mb-2" />
                  <p className="text-sm font-medium text-gray-800">Health History</p>
                </button>
              </>
            )}
            
            {user?.role === 'staff' && (
              <>
                <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200 text-left">
                  <Calendar className="h-6 w-6 text-blue-600 mb-2" />
                  <p className="text-sm font-medium text-gray-800">Manage Schedule</p>
                </button>
                <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200 text-left">
                  <FileText className="h-6 w-6 text-green-600 mb-2" />
                  <p className="text-sm font-medium text-gray-800">Upload Reports</p>
                </button>
                <button className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors duration-200 text-left">
                  <Users className="h-6 w-6 text-yellow-600 mb-2" />
                  <p className="text-sm font-medium text-gray-800">Patient Records</p>
                </button>
                <button className="p-4 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors duration-200 text-left">
                  <Activity className="h-6 w-6 text-teal-600 mb-2" />
                  <p className="text-sm font-medium text-gray-800">System Reports</p>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;