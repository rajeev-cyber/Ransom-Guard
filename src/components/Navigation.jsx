import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'

const Navigation = ({ onUploadClick, notifications, setNotifications, showNotifications, setShowNotifications, isDarkMode, toggleTheme, onSignInClick, onSignUpClick }) => {
  const dropdownRef = useRef(null);
  const { currentUser, logout } = useAuth();

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications, setShowNotifications]);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div>
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-50 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img src="/Logo.svg" alt="Logo" className='h-9 w-15' />
              <h3 className="text-xl font-bold text-slate-800 dark:text-white ml-2">RANSOM-GUARD</h3>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="h-7 w-px bg-slate-300 dark:bg-slate-500"></div>
              <button 
                onClick={onUploadClick}
                className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
                title="Upload File"
              >
                <img src="/up2.svg" alt="Upload" className='h-7 w-7 opacity-70 dark:opacity-100 hover:opacity-100 transition-opacity' />
              </button>
              
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition relative flex items-center" 
                  title="Notifications"
                >
                  <img src="/not.svg" alt="Notifications" className='h-5 w-5 opacity-70 dark:opacity-100 hover:opacity-100 transition-opacity' />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600 dark:bg-blue-500 text-[8px] items-center justify-center text-white font-bold">
                        {unreadCount}
                      </span>
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown - Correctly Positioned */}
                {showNotifications && (
                  <div className="absolute top-10 right-0 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                      <h3 className="text-slate-800 dark:text-white font-semibold text-sm">Notifications</h3>
                      {unreadCount > 0 && (
                        <span 
                          onClick={(e) => { e.stopPropagation(); markAllAsRead(); }}
                          className="text-blue-600 dark:text-blue-400 text-[10px] font-medium cursor-pointer hover:underline"
                        >
                          Mark all as read
                        </span>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((n) => (
                          <div 
                            key={n.id} 
                            onClick={() => markAsRead(n.id)}
                            className={`p-4 border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition cursor-pointer ${n.unread ? 'bg-blue-50 dark:bg-blue-400/5' : ''}`}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <h4 className={`text-xs ${n.unread ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-700 dark:text-white'}`}>{n.title}</h4>
                              <span className="text-[10px] text-slate-500">{n.time}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{n.message}</p>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-slate-500 text-xs">
                          No notifications
                        </div>
                      )}
                    </div>
                    <div className="p-2 text-center bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700">
                      <button className="text-[11px] text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition">View all notifications</button>
                    </div>
                  </div>
                )}
              </div>

              <button className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition" title="Search">
                <img src="/search.svg" alt="Search" className='h-5 w-5 opacity-70 dark:opacity-100 hover:opacity-100 transition-opacity' />
              </button>
              <button 
                onClick={toggleTheme}
                className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition" 
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                <img 
                  src={isDarkMode ? "/Light.svg" : "/Dark.svg"} 
                  alt="Theme Toggle" 
                  className='h-5 w-5 opacity-70 dark:opacity-100 hover:opacity-100 transition-opacity' 
                />
              </button>
              <div className="h-7 w-px bg-slate-300 dark:bg-slate-500"></div>
              
              {currentUser ? (
                // Show user profile when logged in
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {currentUser.photoURL ? (
                      <img 
                        src={currentUser.photoURL} 
                        alt={currentUser.displayName || 'User'} 
                        className="w-8 h-8 rounded-full border-2 border-slate-200 dark:border-slate-600"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                        {currentUser.email?.[0].toUpperCase() || 'U'}
                      </div>
                    )}
                    <span className="text-sm font-medium text-slate-700 dark:text-white">
                      {currentUser.displayName || currentUser.email}
                    </span>
                  </div>
                  <button 
                    onClick={logout}
                    className="px-4 py-2 text-slate-700 dark:text-white hover:text-red-600 dark:hover:text-red-400 transition text-sm font-medium"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                // Show sign in/up buttons when not logged in
                <>
                  <button 
                    onClick={onSignInClick}
                    className="px-4 py-2 text-slate-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-500 transition text-sm font-medium"
                  >
                    Sign in
                  </button>
                  <button 
                    onClick={onSignUpClick}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-4xl transition text-sm font-medium shadow-md shadow-blue-500/20"
                  >
                    Sign up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    </div>
  )
}

export default Navigation
