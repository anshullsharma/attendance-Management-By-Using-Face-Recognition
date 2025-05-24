import React, { useState, useEffect } from 'react';

function Train({ onBack }) {
  const [isTraining, setIsTraining] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState(''); // For textual status indicator
  const [theme, setTheme] = useState('dark'); // Theme state (dark/light)

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('light', savedTheme === 'light');
  }, []);

  // Toggle between dark and light mode
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('light', newTheme === 'light');
  };

  // Parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      const background = document.querySelector('.background-image');
      if (background) {
        const scrollPosition = window.scrollY;
        background.style.transform = `translateY(${scrollPosition * 0.5}px)`; // Parallax effect
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const trainClassifier = async () => {
    setIsTraining(true);
    setProgress(0);
    setStatus('In Progress');

    try {
      // Simulate progress updates
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 300);

      const response = await fetch('http://localhost:5000/api/train', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok) {
        setStatus('Completed');
        alert('Training Dataset Completed!');
      } else {
        setStatus('Failed');
        alert(`Error: ${result.message || 'Training failed'}`);
      }
    } catch (error) {
      setStatus('Failed');
      alert(`Error: ${error.message || 'Failed to connect to the server'}`);
    } finally {
      setTimeout(() => {
        setIsTraining(false);
        setProgress(0);
        setStatus('');
      }, 1000);
    }
  };

  return (
    <div className={`min-h-screen relative overflow-hidden ${theme}`}>
      {/* Background Image with Parallax */}
      <div
        className="absolute inset-0 z-0 background-image"
        style={{
          backgroundImage: 'url(/images/at.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed', // Helps with parallax
        }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-60 dark:bg-opacity-60 light:bg-opacity-30"></div>

      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10">
        <div className="bg-gradient-to-r from-blue-800 to-indigo-600 dark:from-blue-800 dark:to-indigo-600 light:from-blue-500 light:to-indigo-400 text-white p-4 flex justify-between items-center rounded-b-2xl shadow-lg">
          <button
            onClick={onBack}
            className="flex items-center bg-gray-600 dark:bg-gray-600 light:bg-gray-300 text-white dark:text-white light:text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-700 light:hover:bg-gray-400 hover:scale-105 transition-all shadow-md"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Back Home
          </button>
          <h1 className="text-3xl font-bold font-poppins tracking-wide flex-1 text-center">
            Welcome to Training Panel
          </h1>
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="flex items-center bg-gray-600 dark:bg-gray-600 light:bg-gray-300 text-white dark:text-white light:text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-700 light:hover:bg-gray-400 hover:scale-105 transition-all shadow-md"
          >
            {theme === 'dark' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"></path>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex justify-center items-center min-h-[calc(100vh-80px)] px-4">
        <div className="flex flex-col items-center bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-lg border border-white/20 dark:border-white/20 light:border-gray-300/50">
          <div className="relative group">
            <button
              onClick={trainClassifier}
              className="w-48 h-48 bg-white/20 backdrop-blur-md flex items-center justify-center rounded-2xl border-4 border-transparent hover:border-blue-500 dark:hover:border-blue-500 light:hover:border-blue-400 transition-all duration-300 shadow-md"
              disabled={isTraining}
            >
              <img
                src="/images/t_btn1.png"
                alt="Train Dataset"
                className={`w-full h-full object-cover rounded-2xl ${isTraining ? 'animate-pulse' : ''}`}
              />
            </button>
            {/* Glowing Hover Effect */}
            <div className="absolute inset-0 rounded-2xl shadow-[0_0_20px_rgba(59,130,246,0.5)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            {/* Tooltip */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-12 bg-gray-800 dark:bg-gray-800 light:bg-gray-200 text-white dark:text-white light:text-gray-800 text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              Train the dataset for face recognition
            </div>
          </div>
          <button
            onClick={trainClassifier}
            className="mt-6 w-48 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-600 dark:to-indigo-600 light:from-blue-500 light:to-indigo-400 text-white dark:text-white light:text-white font-bold py-3 rounded-xl hover:scale-105 hover:shadow-[0_0_15px_rgba(59,130,246,0.7)] transition-all duration-300 shadow-md flex items-center justify-center font-poppins"
            disabled={isTraining}
          >
            {isTraining ? (
              <svg className="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 12a8 8 0 0116 0 8 8 0 01-16 0zm8-8a8 8 0 00-8 8"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12H9m6 0a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            )}
            Train Dataset
          </button>
          {isTraining && (
            <div className="mt-4 w-48">
              <div className="bg-gray-200 dark:bg-gray-600 light:bg-gray-300 rounded-full h-2.5">
                <div
                  className="bg-blue-600 dark:bg-blue-600 light:bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="mt-2 text-center text-white dark:text-white light:text-gray-800 font-poppins text-sm">
                Status: {status}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* CSS for Animations, Effects, and Theming */}
      <style>
        {`
          /* Theme Variables */
          :root {
            --background-opacity: 0.6;
            --text-color: #ffffff;
            --button-bg: #4b5563;
            --button-text: #ffffff;
            --card-bg: rgba(255, 255, 255, 0.1);
            --card-border: rgba(255, 255, 255, 0.2);
            --tooltip-bg: #1f2937;
            --tooltip-text: #ffffff;
          }

          .light {
            --background-opacity: 0.3;
            --text-color: #1f2937;
            --button-bg: #d1d5db;
            --button-text: #1f2937;
            --card-bg: rgba(255, 255, 255, 0.5);
            --card-border: rgba(209, 213, 219, 0.5);
            --tooltip-bg: #e5e7eb;
            --tooltip-text: #1f2937;
          }

          /* Particle Animation */
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          .particle {
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(59, 130, 246, 0.7);
            border-radius: 50%;
            animation: float 5s infinite ease-in-out;
            box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
          }

          /* Font Loading */
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap');
          .font-poppins {
            font-family: 'Poppins', sans-serif;
          }
        `}
      </style>
    </div>
  );
}

export default Train;