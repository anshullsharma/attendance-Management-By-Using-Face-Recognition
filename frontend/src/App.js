import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import Student from './components/Student';
import FaceDetector from './components/FaceDetector';
import Login from './components/Login';
import Register from './components/Register';
import Attendance from './components/Attendance';
import Dashboard from './components/Dashboard';
import Developers from './components/Developers';
import Goodbye from './components/Goodbye';
import ChatBot from './components/ChatBot';
import Train from './components/Train';
import LoadingScreen from './components/LoadingScreen';

function MainPage() {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [profilePic, setProfilePic] = useState('/images/user-avatar.jpg'); // Default profile picture

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleStudentPanel = () => {
    navigate('/student');
  };

  const handleFaceDetector = () => {
    navigate('/face-detector');
  };

  const handleAttendance = () => {
    navigate('/attendance');
  };

  const handleHelpSupport = () => {
    navigate('/dashboard');
  };

  const handleDataTrain = () => {
    navigate('/train');
  };

  const handlePhotos = () => {
    alert('The file you are trying to access is encrypted and can\'t be opened.');
  };

  const handleDevelopers = () => {
    navigate('/developers');
  };

  const handleExit = () => {
    if (window.confirm('Are you sure you want to exit?')) {
      navigate('/goodbye');
    }
  };

  const handleChatBot = () => {
    setIsChatOpen((prev) => !prev);
  };

  const handleChatBotClose = () => {
    setIsChatOpen(false);
  };

  const handleSettingsToggle = () => {
    setIsSettingsOpen((prev) => !prev);
  };

  const handleSettingsClose = () => {
    setIsSettingsOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('password');
    window.dispatchEvent(new Event('storageChange'));
    navigate('/login');
  };

  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePic(e.target.result); // Update profile picture preview
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteProfile = () => {
    if (window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
      localStorage.removeItem('loggedIn');
      localStorage.removeItem('username');
      localStorage.removeItem('email');
      localStorage.removeItem('password');
      window.dispatchEvent(new Event('storageChange'));
      navigate('/login');
    }
  };

  // Fetch registration credentials from localStorage
  const username = localStorage.getItem('username') || 'User';
  const email = localStorage.getItem('email') || 'user@example.com';

  // Debug: Log the credentials when the Settings Panel is opened
  useEffect(() => {
    if (isSettingsOpen) {
      console.log('Settings Panel Credentials:', { username, email });
    }
  }, [isSettingsOpen, username, email]);

  return (
    <div
      className="min-h-screen bg-gray-900 relative flex flex-col"
      style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e1e1e 100%)',
      }}
    >
      {/* Background Blur Overlay */}
      <div className="absolute inset-0 backdrop-blur-sm bg-opacity-30 bg-black"></div>

      {/* Header Section */}
      <div className="relative z-10 bg-blue-900 text-white flex items-center justify-between p-4 shadow-lg">
        <div className="bg-black text-white px-4 py-2 rounded-lg">{time}</div>
        <div className="relative flex-1 text-center">
          <h1 className="text-4xl font-bold font-['Montserrat',_sans-serif] text-white">
            Attendance Management System
          </h1>
          <p className="text-lg text-gray-300 font-['Roboto',_sans-serif] mt-1">
            Seamless and Secure Attendance Tracking
          </p>
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 to-blue-800 animate-pulse"></div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleSettingsToggle}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
          >
            Settings
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {/* Student Panel */}
          <div className="flex flex-col items-center animate-zoomIn">
            <button
              onClick={handleStudentPanel}
              className="w-56 h-56 bg-gray-800 rounded-2xl shadow-lg border-2 border-gradient-to-r from-blue-500 to-blue-800 hover:scale-105 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
            >
              <img
                src="/images/std1.jpg"
                alt="Student Panel"
                className="w-3/4 h-3/4 mx-auto mt-4 object-contain"
              />
              <span className="absolute inset-0 bg-blue-500 opacity-0 hover:opacity-20 transition-opacity duration-300 pointer-events-none"></span>
            </button>
            <button
              onClick={handleStudentPanel}
              className="mt-4 w-56 bg-white text-blue-900 font-bold py-2 rounded-lg"
            >
              Student Panel
            </button>
          </div>

          {/* Face Detector */}
          <div className="flex flex-col items-center animate-zoomIn animation-delay-100">
            <button
              onClick={handleFaceDetector}
              className="w-56 h-56 bg-gray-800 rounded-2xl shadow-lg border-2 border-gradient-to-r from-blue-500 to-blue-800 hover:scale-105 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
            >
              <img
                src="/images/det1.jpg"
                alt="Face Detector"
                className="w-3/4 h-3/4 mx-auto mt-4 object-contain"
              />
              <span className="absolute inset-0 bg-blue-500 opacity-0 hover:opacity-20 transition-opacity duration-300 pointer-events-none"></span>
            </button>
            <button
              onClick={handleFaceDetector}
              className="mt-4 w-56 bg-white text-blue-900 font-bold py-2 rounded-lg"
            >
              Face Detector
            </button>
          </div>

          {/* Attendance */}
          <div className="flex flex-col items-center animate-zoomIn animation-delay-200">
            <button
              onClick={handleAttendance}
              className="w-56 h-56 bg-gray-800 rounded-2xl shadow-lg border-2 border-gradient-to-r from-blue-500 to-blue-800 hover:scale-105 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
            >
              <img
                src="/images/att.jpg"
                alt="Attendance"
                className="w-3/4 h-3/4 mx-auto mt-4 object-contain"
              />
              <span className="absolute inset-0 bg-blue-500 opacity-0 hover:opacity-20 transition-opacity duration-300 pointer-events-none"></span>
            </button>
            <button
              onClick={handleAttendance}
              className="mt-4 w-56 bg-white text-blue-900 font-bold py-2 rounded-lg"
            >
              Attendance
            </button>
          </div>

          {/* Help Support */}
          <div className="flex flex-col items-center animate-zoomIn animation-delay-300">
            <button
              onClick={handleHelpSupport}
              className="w-56 h-56 bg-gray-800 rounded-2xl shadow-lg border-2 border-gradient-to-r from-blue-500 to-blue-800 hover:scale-105 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
            >
              <img
                src="/images/hlp.jpg"
                alt="Help Support"
                className="w-3/4 h-3/4 mx-auto mt-4 object-contain"
              />
              <span className="absolute inset-0 bg-blue-500 opacity-0 hover:opacity-20 transition-opacity duration-300 pointer-events-none"></span>
            </button>
            <button
              onClick={handleHelpSupport}
              className="mt-4 w-56 bg-white text-blue-900 font-bold py-2 rounded-lg"
            >
              Help Support
            </button>
          </div>

          {/* Data Train */}
          <div className="flex flex-col items-center animate-zoomIn animation-delay-400">
            <button
              onClick={handleDataTrain}
              className="w-56 h-56 bg-gray-800 rounded-2xl shadow-lg border-2 border-gradient-to-r from-blue-500 to-blue-800 hover:scale-105 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
            >
              <img
                src="/images/tra1.jpg"
                alt="Data Train"
                className="w-3/4 h-3/4 mx-auto mt-4 object-contain"
              />
              <span className="absolute inset-0 bg-blue-500 opacity-0 hover:opacity-20 transition-opacity duration-300 pointer-events-none"></span>
            </button>
            <button
              onClick={handleDataTrain}
              className="mt-4 w-56 bg-white text-blue-900 font-bold py-2 rounded-lg"
            >
              Data Train
            </button>
          </div>

          {/* Photos */}
          <div className="flex flex-col items-center animate-zoomIn animation-delay-500">
            <button
              onClick={handlePhotos}
              className="w-56 h-56 bg-gray-800 rounded-2xl shadow-lg border-2 border-gradient-to-r from-blue-500 to-blue-800 hover:scale-105 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
            >
              <img
                src="/images/people.png"
                alt="Photos"
                className="w-3/4 h-3/4 mx-auto mt-4 object-contain"
              />
              <span className="absolute inset-0 bg-blue-500 opacity-0 hover:opacity-20 transition-opacity duration-300 pointer-events-none"></span>
            </button>
            <button
              onClick={handlePhotos}
              className="mt-4 w-56 bg-white text-blue-900 font-bold py-2 rounded-lg"
            >
              Photos
            </button>
          </div>

          {/* Developers */}
          <div className="flex flex-col items-center animate-zoomIn animation-delay-600">
            <button
              onClick={handleDevelopers}
              className="w-56 h-56 bg-gray-800 rounded-2xl shadow-lg border-2 border-gradient-to-r from-blue-500 to-blue-800 hover:scale-105 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
            >
              <img
                src="/images/develop.jpg"
                alt="Developers"
                className="w-3/4 h-3/4 mx-auto mt-4 object-contain"
              />
              <span className="absolute inset-0 bg-blue-500 opacity-0 hover:opacity-20 transition-opacity duration-300 pointer-events-none"></span>
            </button>
            <button
              onClick={handleDevelopers}
              className="mt-4 w-56 bg-white text-blue-900 font-bold py-2 rounded-lg"
            >
              Developers
            </button>
          </div>

          {/* Exit */}
          <div className="flex flex-col items-center animate-zoomIn animation-delay-700">
            <button
              onClick={handleExit}
              className="w-56 h-56 bg-gray-800 rounded-2xl shadow-lg border-2 border-gradient-to-r from-blue-500 to-blue-800 hover:scale-105 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
            >
              <img
                src="/images/exit1.jpg"
                alt="Exit"
                className="w-3/4 h-3/4 mx-auto mt-4 object-contain"
              />
              <span className="absolute inset-0 bg-blue-500 opacity-0 hover:opacity-20 transition-opacity duration-300 pointer-events-none"></span>
            </button>
            <button
              onClick={handleExit}
              className="mt-4 w-56 bg-white text-blue-900 font-bold py-2 rounded-lg"
            >
              Exit
            </button>
          </div>
        </div>

        {/* ChatBot Icon */}
        <div className="fixed bottom-8 right-4 flex flex-col items-end z-50">
          <button
            onClick={handleChatBot}
            className="relative w-14 h-14 bg-blue-500 text-white flex items-center justify-center rounded-full shadow-lg hover:bg-blue-600 hover:scale-110 transition-all duration-300"
          >
            <img
              src="/images/chatbot.jpg"
              alt="ChatBot"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span
              className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4 w-0 h-0 border-t-6 border-t-blue-500 border-l-6 border-l-transparent border-r-6 border-r-transparent"
            ></span>
          </button>
        </div>

        {/* ChatBot Sliding Panel */}
        <div
          className={`fixed top-0 right-0 h-full w-full max-w-md transform transition-transform duration-300 z-50 ${
            isChatOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <ChatBot onBack={handleChatBotClose} />
        </div>

        {/* Settings Sliding Panel */}
        <div
          className={`fixed top-0 right-0 h-full w-full max-w-md transform transition-transform duration-300 z-50 bg-gray-800 text-white p-6 ${
            isSettingsOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <button
            onClick={handleSettingsClose}
            className="absolute top-4 right-4 text-gray-300 hover:text-white"
          >
            ✕
          </button>
          <h2 className="text-2xl font-bold mb-6">Settings</h2>

          {/* Registration Credentials */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Profile Information</h3>
            <p><strong>Username:</strong> {username}</p>
            <p><strong>Email:</strong> {email}</p>
          </div>

          {/* Profile Picture Upload */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Profile Picture</h3>
            <img
              src={profilePic}
              alt="Profile Preview"
              className="w-32 h-32 rounded-full mb-4 object-cover border-2 border-blue-500"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePicChange}
              className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
            />
          </div>

          {/* Delete Profile */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Account Actions</h3>
            <button
              onClick={handleDeleteProfile}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
            >
              Delete Profile
            </button>
          </div>
        </div>

        {/* Backdrop for Panels */}
        {(isChatOpen || isSettingsOpen) && (
          <div
            className="fixed inset-0 bg-black opacity-30 z-40"
            onClick={() => {
              handleChatBotClose();
              handleSettingsClose();
            }}
          ></div>
        )}
      </div>

      {/* Footer Section */}
      <footer className="relative z-10 bg-blue-900 text-white p-4 text-center">
        <p className="text-sm">
          © 2025 Attendance Management System | Version 1.0.0
        </p>
        <div className="mt-2">
          <a href="/dashboard" className="text-blue-300 hover:underline mx-2">Support</a>
          <a href="/developers" className="text-blue-300 hover:underline mx-2">Developers</a>
        </div>
      </footer>

      {/* Animation Styles */}
      <style>
        {`
          @keyframes zoomIn {
            from {
              opacity: 0;
              transform: scale(0.8);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          .animate-zoomIn {
            animation: zoomIn 0.5s ease-out forwards;
          }
          .animation-delay-100 {
            animation-delay: 0.1s;
          }
          .animation-delay-200 {
            animation-delay: 0.2s;
          }
          .animation-delay-300 {
            animation-delay: 0.3s;
          }
          .animation-delay-400 {
            animation-delay: 0.4s;
          }
          .animation-delay-500 {
            animation-delay: 0.5s;
          }
          .animation-delay-600 {
            animation-delay: 0.6s;
          }
          .animation-delay-700 {
            animation-delay: 0.7s;
          }
          .border-gradient-to-r {
            border-image: linear-gradient(to right, #3b82f6, #1d4ed8) 1;
          }
        `}
      </style>
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('loggedIn') === 'true');
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    const handleStorageChange = () => {
      const loggedIn = localStorage.getItem('loggedIn') === 'true';
      setIsLoggedIn(loggedIn);
      if (loggedIn && !showLoading) {
        setShowLoading(true);
      }
    };

    window.addEventListener('storageChange', handleStorageChange);

    return () => {
      window.removeEventListener('storageChange', handleStorageChange);
    };
  }, [showLoading]);

  const handleLoadingFinish = () => {
    setShowLoading(false);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            isLoggedIn ? (
              showLoading ? (
                <LoadingScreen onFinish={handleLoadingFinish} />
              ) : (
                <MainPage />
              )
            ) : (
              <Login />
            )
          }
        />
        <Route path="/loading" element={<LoadingScreen onFinish={handleLoadingFinish} />} />
        <Route path="/register" element={<Register onBack={() => window.location.href = '/login'} />} />
        <Route path="/student" element={isLoggedIn ? <Student onBack={() => window.location.href = '/'} /> : <Login />} />
        <Route path="/face-detector" element={isLoggedIn ? <FaceDetector onBack={() => window.location.href = '/'} /> : <Login />} />
        <Route path="/attendance" element={isLoggedIn ? <Attendance onBack={() => window.location.href = '/'} /> : <Login />} />
        <Route path="/dashboard" element={isLoggedIn ? <Dashboard onBack={() => window.location.href = '/'} /> : <Login />} />
        <Route path="/developers" element={isLoggedIn ? <Developers onBack={() => window.location.href = '/'} /> : <Login />} />
        <Route path="/goodbye" element={<Goodbye />} />
        <Route path="/train" element={isLoggedIn ? <Train onBack={() => window.location.href = '/'} /> : <Login />} />
      </Routes>
    </Router>
  );
}

export default App;