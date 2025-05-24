import React, { useState, useEffect } from 'react';

function Settings() {
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Retrieve the username from localStorage
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      // Fallback: Fetch from backend if needed
      const email = localStorage.getItem('email');
      if (email) {
        fetch(`http://localhost:5000/api/user?email=${encodeURIComponent(email)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((response) => response.json())
          .then((data) => {
            const userData = data.user || data;
            const fname = userData.fname || '';
            const lname = userData.lname || '';
            const displayName = fname && lname ? `${fname} ${lname}`.trim() : 'User';
            setUsername(displayName);
            localStorage.setItem('username', displayName); // Update localStorage
          })
          .catch((error) => {
            console.error('Error fetching user details:', error);
            setUsername('User');
          });
      } else {
        setUsername('User');
      }
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-xl w-[380px] border border-white/30">
        <h2 className="text-center text-white text-2xl font-bold font-['Montserrat',_sans-serif]">
          Settings
        </h2>
        <div className="mt-6">
          <label className="text-gray-300 text-sm mb-1 block">Username</label>
          <div className="p-3 bg-transparent border-2 border-gray-300 rounded-lg text-white">
            {username || 'User'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;