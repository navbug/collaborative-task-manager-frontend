import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { Bell, LogOut, User, Menu, X, Wifi, WifiOff } from 'lucide-react';
import { Button } from './Button';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { notifications, clearNotification, connected, socket } = useSocket();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [realtimeActivity, setRealtimeActivity] = useState(false);

  // Show realtime activity indicator
  useEffect(() => {
    if (!socket) return;

    const handleActivity = () => {
      setRealtimeActivity(true);
      setTimeout(() => setRealtimeActivity(false), 2000);
    };

    socket.on('task:created', handleActivity);
    socket.on('task:updated', handleActivity);
    socket.on('task:deleted', handleActivity);

    return () => {
      socket.off('task:created', handleActivity);
      socket.off('task:updated', handleActivity);
      socket.off('task:deleted', handleActivity);
    };
  }, [socket]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-2xl font-bold text-primary-600">
              TaskManager
            </Link>
            <div className="hidden md:flex ml-10 space-x-4">
              <Link
                to="/dashboard"
                className="px-3 py-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100"
              >
                Dashboard
              </Link>
              <Link
                to="/tasks"
                className="px-3 py-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100"
              >
                All Tasks
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Socket Connection Status */}
            <div className="hidden md:flex items-center gap-2">
              <div className="relative">
                {connected ? (
                  <Wifi className={`w-5 h-5 ${realtimeActivity ? 'text-green-500 animate-pulse' : 'text-green-500'}`} />
                ) : (
                  <WifiOff className="w-5 h-5 text-red-500" />
                )}
                {realtimeActivity && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                )}
              </div>
              <span className="text-sm text-gray-600">
                {connected ? 'Live' : 'Offline'}
              </span>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg relative"
              >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto">
                  <div className="p-4 border-b">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                  </div>
                  {notifications.length > 0 ? (
                    <div className="divide-y">
                      {notifications.map((notif) => (
                        <div key={notif.id} className="p-4 hover:bg-gray-50">
                          <p className="text-sm text-gray-900 font-medium">
                            {notif.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(notif.timestamp).toLocaleString()}
                          </p>
                          <button
                            onClick={() => {
                              clearNotification(notif.id);
                              navigate(`/tasks`);
                              setShowNotifications(false);
                            }}
                            className="text-xs text-primary-600 hover:text-primary-700 mt-2"
                          >
                            View Task
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      No notifications
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="hidden md:flex items-center gap-2">
              <User className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700 font-medium">{user?.name}</span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-600"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden py-4 border-t">
            <div className="space-y-2">
              <Link
                to="/dashboard"
                className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                onClick={() => setShowMobileMenu(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/tasks"
                className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                onClick={() => setShowMobileMenu(false)}
              >
                All Tasks
              </Link>
              <div className="px-3 py-2 text-gray-600 text-sm">
                Logged in as {user?.name}
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-md text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};