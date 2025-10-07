import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Calendar, 
  FileText, 
  Users, 
  Activity, 
  Upload, 
  Settings, 
  LogOut,
  Stethoscope,
  UserCircle,
  ClipboardList
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();

  const getNavItems = () => {
    switch (user?.role) {
      case 'doctor':
        return [
          { path: '/dashboard', icon: Activity, label: 'Dashboard' },
          { path: '/appointments', icon: Calendar, label: 'Appointments' },
          { path: '/patients', icon: Users, label: 'Patients' },
          { path: '/reports', icon: FileText, label: 'Medical Reports' },
        ];
      case 'patient':
        return [
          { path: '/dashboard', icon: Activity, label: 'Dashboard' },
          { path: '/appointments', icon: Calendar, label: 'My Appointments' },
          { path: '/reports', icon: FileText, label: 'My Reports' },
          { path: '/book-appointment', icon: ClipboardList, label: 'Book Appointment' },
        ];
      case 'staff':
        return [
          { path: '/dashboard', icon: Activity, label: 'Dashboard' },
          { path: '/appointments', icon: Calendar, label: 'Manage Appointments' },
          { path: '/reports', icon: FileText, label: 'Reports' },
          { path: '/upload', icon: Upload, label: 'Upload Documents' },
          { path: '/patients', icon: Users, label: 'Patient Records' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="bg-white shadow-lg h-screen w-64 fixed left-0 top-0 z-10">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Stethoscope className="h-8 w-8 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-800">MedCare</h1>
        </div>
        <div className="mt-4">
          <div className="flex items-center space-x-2">
            <UserCircle className="h-6 w-6 text-gray-600" />
            <div>
              <p className="text-sm font-medium text-gray-800">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
      
      <nav className="mt-6 px-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-colors duration-200 ${
                isActive
                  ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
        <button
          onClick={() => {}}
          className="flex items-center space-x-3 px-4 py-3 w-full text-gray-600 hover:bg-gray-50 rounded-lg mb-2 transition-colors duration-200"
        >
          <Settings className="h-5 w-5" />
          <span className="font-medium">Settings</span>
        </button>
        <button
          onClick={logout}
          className="flex items-center space-x-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;