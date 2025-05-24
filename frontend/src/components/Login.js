import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgetModal, setShowForgetModal] = useState(false);
  const [securityQuestion, setSecurityQuestion] = useState('Select');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [usernameValid, setUsernameValid] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Load "Remember Me" data from localStorage on mount
  useEffect(() => {
    const storedUsername = localStorage.getItem('rememberedUsername');
    const storedPassword = localStorage.getItem('rememberedPassword');
    if (storedUsername && storedPassword) {
      setUsername(storedUsername);
      setPassword(storedPassword);
      setRememberMe(true);
    }
  }, []);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  // Real-time validation
  useEffect(() => {
    // Username should be a valid email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setUsernameValid(username === '' || emailRegex.test(username));
    // Password should be at least 6 characters
    setPasswordValid(password === '' || password.length >= 6);
  }, [username, password]);

  const handleLogin = async () => {
    if (!username || !password) {
      setMessage('All Fields Required!');
      return;
    }

    if (!usernameValid || !passwordValid) {
      setMessage('Please correct the errors in the form!');
      return;
    }

    setIsLoading(true);

    if (username === 'admin' && password === 'admin') {
      setMessage('Welcome to Attendance Management System Using Facial Recognition');
      // Do NOT overwrite the username set by Register.js
      localStorage.setItem('adminDisplayName', 'Admin User'); // Use a separate key for admin
      localStorage.setItem('email', 'admin@example.com');
      localStorage.setItem('loggedIn', 'true');
      window.dispatchEvent(new Event('storageChange'));
      if (rememberMe) {
        localStorage.setItem('rememberedUsername', username);
        localStorage.setItem('rememberedPassword', password);
      } else {
        localStorage.removeItem('rememberedUsername');
        localStorage.removeItem('rememberedPassword');
      }
      setIsLoading(false);
      navigate('/');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: username, password }),
      });

      const result = await response.json();
      console.log('Login API Response:', result);

      if (response.ok) {
        let fname = '';
        let lname = '';
        let email = username;
        let pwd = password;

        try {
          const userResponse = await fetch(`http://localhost:5000/api/user?email=${encodeURIComponent(username)}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          const userResult = await userResponse.json();
          console.log('User API Response:', userResult);

          if (userResponse.ok) {
            const userData = userResult.user || userResult;
            fname = userData.fname || userData.firstName || userData.first_name || userData.given_name || userData.name?.split(' ')[0] || '';
            lname = userData.lname || userData.lastName || userData.last_name || userData.family_name || userData.name?.split(' ')[1] || '';
            email = userData.email || username;
            pwd = userData.pwd || userData.password || userData.pass || password;
          }
        } catch (error) {
          console.log('Error fetching user details:', error.message);
        }

        // Use the username from localStorage (set by Register.js) unless the backend provides fname and lname
        const storedUsername = localStorage.getItem('username');
        const displayName = fname && lname
          ? `${fname} ${lname}`.trim()
          : storedUsername || 'User';

        // Only update username if we have new fname and lname from the backend
        if (fname && lname) {
          localStorage.setItem('username', displayName);
        }
        localStorage.setItem('email', email);
        localStorage.setItem('password', pwd);
        localStorage.setItem('loggedIn', 'true');

        if (rememberMe) {
          localStorage.setItem('rememberedUsername', username);
          localStorage.setItem('rememberedPassword', password);
        } else {
          localStorage.removeItem('rememberedUsername');
          localStorage.removeItem('rememberedPassword');
        }

        console.log('Storing in localStorage:', {
          username: localStorage.getItem('username'),
          email: email,
          password: pwd,
        });

        window.dispatchEvent(new Event('storageChange'));
        setMessage('Login Successful\nATTEND');
        setIsLoading(false);
        navigate('/');
      } else {
        setMessage(result.message || 'Invalid Username or Password!');
        setIsLoading(false);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const handleForgetPassword = async () => {
    if (!username) {
      setMessage('Please Enter the Email ID to reset Password!');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/check-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: username }),
      });

      const result = await response.json();

      if (response.ok && result.exists) {
        setShowForgetModal(true);
      } else {
        setMessage('Please Enter the Valid Email ID!');
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleResetPassword = async () => {
    if (securityQuestion === 'Select') {
      setMessage('Select the Security Question!');
      return;
    }
    if (!securityAnswer) {
      setMessage('Please Enter the Answer!');
      return;
    }
    if (!newPassword) {
      setMessage('Please Enter the New Password!');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: username,
          securityQuestion,
          securityAnswer,
          newPassword,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem('password', newPassword);
        setMessage('Successfully Your password has been reset, Please login with new Password!');
        setShowForgetModal(false);
        setSecurityQuestion('Select');
        setSecurityAnswer('');
        setNewPassword('');
      } else {
        setMessage('Please Enter the Correct Answer!');
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image with Gradient Overlay, Darkened, and Blurred */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-black/80 to-blue-900/80 backdrop-blur-sm"
        style={{
          backgroundImage: 'url(/images/bg2.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.5)', // Darken the background image
        }}
      ></div>

      {/* Login Card with Enhanced Glassmorphism Effect */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/5 backdrop-blur-xl w-[380px] p-6 rounded-2xl shadow-xl flex flex-col border border-white/30">
        {/* Header Image with Pulse Animation */}
        <div className="flex justify-center">
          <img
            src="/images/log1.png"
            alt="Login Icon"
            className="w-[100px] h-[100px] animate-pulse"
          />
        </div>

        {/* Title */}
        <h1 className="text-center text-white text-2xl font-bold mt-2 font-['Montserrat',_sans-serif]">
          Login
        </h1>

        {/* Message Display */}
        {message && (
          <div className="mt-4 text-center text-white bg-red-500/90 p-2 rounded-lg text-sm backdrop-blur-sm">
            {message}
          </div>
        )}

        {/* Form Fields */}
        <div className="flex-1 mt-6 space-y-6">
          {/* Username Field with Icon and Tooltip */}
          <div className="relative group">
            <label className="text-gray-300 text-sm mb-1 block">Email</label>
            <div className="absolute left-3 top-1/2 transform -translate-y-[-2px] text-gray-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l9-6 9 6v10a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 12v6"></path>
              </svg>
            </div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              className={`w-full pl-10 p-3 bg-transparent border-2 ${
                usernameValid ? 'border-gray-300' : 'border-red-500'
              } rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 hover:border-blue-400 transition-all outline-none`}
              placeholder="Enter your email"
            />
            <div className="absolute hidden group-hover:block -right-2 top-1/2 transform -translate-y-[-2px] bg-gray-800 text-white text-xs rounded py-1 px-2">
              Enter a valid email (e.g., user@example.com)
            </div>
          </div>

          {/* Password Field with Icon and Modern Eye Icon */}
          <div className="relative group">
            <label className="text-gray-300 text-sm mb-1 block">Password</label>
            <div className="absolute left-3 top-1/2 transform -translate-y-[-2px] text-gray-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2zm0 2c-1.104 0-2 .896-2 2v3h4v-3c0-1.104-.896-2-2-2zm5-7h1a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h1m4-2h2a2 2 0 012 2v2H9V6a2 2 0 012-2z"></path>
              </svg>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className={`w-full pl-10 p-3 bg-transparent border-2 ${
                passwordValid ? 'border-gray-300' : 'border-red-500'
              } rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 hover:border-blue-400 transition-all outline-none`}
              placeholder="Enter your password"
            />
            <button
              onClick={togglePassword}
              className="absolute right-3 top-1/2 transform -translate-y-[-2px] text-gray-300 hover:text-white focus:outline-none"
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              )}
            </button>
            <div className="absolute hidden group-hover:block -right-2 top-1/2 transform -translate-y-[-2px] bg-gray-800 text-white text-xs rounded py-1 px-2">
              Minimum 6 characters
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="ml-2 text-sm text-gray-300">Remember Me</label>
          </div>
        </div>

        {/* Login Button with Gradient, Microinteraction, and Loading Animation */}
        <div className="mt-6">
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className={`w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 active:scale-95 transition-all duration-300 shadow-md flex items-center justify-center ${
              isLoading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : null}
            {isLoading ? 'Logging In...' : 'Login'}
          </button>
        </div>

        {/* Register and Forget Password Links */}
        <div className="mt-4 flex justify-between">
          <button
            onClick={handleRegister}
            className="text-gray-300 font-bold hover:text-blue-400 focus:text-blue-400 transition-all"
          >
            Register
          </button>
          <button
            onClick={handleForgetPassword}
            className="text-gray-300 font-bold hover:text-blue-400 focus:text-blue-400 transition-all"
          >
            Forget Password?
          </button>
        </div>
      </div>

      {/* Forget Password Modal with Enhanced Glassmorphism */}
      {showForgetModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl shadow-xl w-[420px] border border-white/30">
            <h2 className="text-center text-white text-2xl font-bold font-['Montserrat',_sans-serif]">
              Reset Password
            </h2>

            {/* Security Question */}
            <div className="mt-6">
              <label className="text-gray-300 text-sm mb-1 block">Select Security Question</label>
              <select
                value={securityQuestion}
                onChange={(e) => setSecurityQuestion(e.target.value)}
                className="w-full p-3 bg-transparent border-2 border-gray-300 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 hover:border-blue-400 transition-all outline-none appearance-none"
              >
                <option className="text-black" value="Select">
                  Select
                </option>
                <option className="text-black" value="Your Date of Birth">
                  Your Date of Birth
                </option>
                <option className="text-black" value="Your Nick Name">
                  Your Nick Name
                </option>
                <option className="text-black" value="Your Favorite Book">
                  Your Favorite Book
                </option>
              </select>
            </div>

            {/* Security Answer */}
            <div className="mt-6">
              <label className="text-gray-300 text-sm mb-1 block">Security Answer</label>
              <input
                type="text"
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                className="w-full p-3 bg-transparent border-2 border-gray-300 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 hover:border-blue-400 transition-all outline-none"
                placeholder="Enter your answer"
              />
            </div>

            {/* New Password */}
            <div className="mt-6">
              <label className="text-gray-300 text-sm mb-1 block">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 bg-transparent border-2 border-gray-300 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 hover:border-blue-400 transition-all outline-none"
                placeholder="Enter new password"
              />
            </div>

            {/* Reset Password Button */}
            <div className="mt-6">
              <button
                onClick={handleResetPassword}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 active:scale-95 transition-all duration-300 shadow-md"
              >
                Reset Password
              </button>
            </div>

            {/* Close Modal Button */}
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowForgetModal(false)}
                className="text-gray-300 font-bold hover:text-red-400 focus:text-red-400 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;