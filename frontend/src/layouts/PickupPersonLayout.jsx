import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Package, 
  MapPin, 
  Calendar,
  CheckCircle,
  BarChart3,
  FileText,
  LogOut,
  Truck,
  User,
  Settings,
  Navigation,
  TrendingUp
} from 'lucide-react';

const PickupPersonLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/pickup-person', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/pickup-person/assignments', icon: Package, label: 'My Assignments' },
    { path: '/pickup-person/schedule', icon: Calendar, label: 'Schedule' },
    { path: '/pickup-person/route', icon: Navigation, label: 'Route Map' },
    { path: '/pickup-person/completed', icon: CheckCircle, label: 'Completed Jobs' },
    { path: '/pickup-person/performance', icon: TrendingUp, label: 'Performance' },
    { path: '/pickup-person/reports', icon: FileText, label: 'Daily Reports' },
    { path: '/pickup-person/settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="flex items-center p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Truck className="h-8 w-8 text-green-500" />
            <span className="text-xl font-bold text-gray-900">EcoWaste</span>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{user?.name}</p>
              <p className="text-sm text-gray-500">Pickup Person</p>
              <p className="text-xs text-gray-400">Vehicle: {user?.vehicleNumber}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-green-50 text-green-700 border-r-2 border-green-500'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg w-full transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">
                {navItems.find(item => item.path === location.pathname)?.label || 'Pickup Person Dashboard'}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Pickup Person: {user?.name}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PickupPersonLayout;