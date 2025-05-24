import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Register({ onBack }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    cnum: '',
    email: '',
    ssq: 'Select',
    sa: '',
    pwd: '',
    cpwd: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [formValid, setFormValid] = useState(false);
  const [fieldValid, setFieldValid] = useState({
    fname: true,
    lname: true,
    cnum: true,
    email: true,
    ssq: true,
    sa: true,
    pwd: true,
    cpwd: true,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Auto-format phone number
    if (name === 'cnum') {
      const digits = value.replace(/\D/g, '');
      if (digits.length <= 10) {
        formattedValue = digits
          .replace(/(\d{0,3})(\d{0,3})(\d{0,4})/, (match, p1, p2, p3) => {
            let result = '';
            if (p1) result += p1;
            if (p2) result += '-' + p2;
            if (p3) result += '-' + p3;
            return result;
          })
          .trim();
      } else {
        formattedValue = digits
          .slice(0, 10)
          .replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  // Real-time validation and password strength
  useEffect(() => {
    const { fname, lname, cnum, email, ssq, sa, pwd, cpwd } = formData;

    // Validation rules
    const nameRegex = /^[A-Za-z\s]+$/;
    const contactRegex = /^\d{3}-\d{3}-\d{4}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).+$/;

    const fnameValid = fname && nameRegex.test(fname) && fname[0]?.toUpperCase() === fname[0];
    const lnameValid = lname && nameRegex.test(lname) && lname[0]?.toUpperCase() === lname[0];
    const cnumValid = cnum && contactRegex.test(cnum) && cnum.replace(/\D/g, '').length === 10;
    const emailValid = email && emailRegex.test(email);
    const ssqValid = ssq !== 'Select';
    const saValid = !ssqValid || (ssq !== 'Select' && sa);
    const pwdValid = pwd && passwordRegex.test(pwd);
    const cpwdValid = cpwd && pwd === cpwd;

    setFieldValid({
      fname: fnameValid,
      lname: lnameValid,
      cnum: cnumValid,
      email: emailValid,
      ssq: ssqValid,
      sa: saValid,
      pwd: pwdValid,
      cpwd: cpwdValid,
    });

    setFormValid(
      fnameValid &&
      lnameValid &&
      cnumValid &&
      emailValid &&
      ssqValid &&
      saValid &&
      pwdValid &&
      cpwdValid
    );

    // Password strength
    if (!pwd) {
      setPasswordStrength('');
    } else if (pwd.length < 6) {
      setPasswordStrength('Weak');
    } else if (pwd.length < 10 || !passwordRegex.test(pwd)) {
      setPasswordStrength('Medium');
    } else {
      setPasswordStrength('Strong');
    }
  }, [formData]);

  const handleRegister = async () => {
    if (!formValid) {
      alert('Please correct the errors in the form!');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fname: formData.fname,
          lname: formData.lname,
          cnum: formData.cnum.replace(/\D/g, ''),
          email: formData.email,
          ssq: formData.ssq,
          sa: formData.sa,
          pwd: formData.pwd,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        const username = `${formData.fname} ${formData.lname}`;
        localStorage.setItem('username', username);
        localStorage.setItem('email', formData.email);
        localStorage.setItem('password', formData.pwd);
        localStorage.setItem('loggedIn', 'true');
        window.dispatchEvent(new Event('storageChange'));

        alert('Successfully Registered!');
        navigate('/login');
      } else {
        alert(result.message || 'Registration failed');
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleSwitchToLogin = () => {
    navigate('/login');
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
          filter: 'brightness(0.5)',
        }}
      ></div>

      {/* Registration Card with Glassmorphism Effect */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/5 backdrop-blur-xl w-full max-w-4xl p-6 rounded-2xl shadow-xl flex flex-col border border-white/30 sm:p-8 md:max-w-[900px] md:h-[580px]">
        {/* Title */}
        <h1 className="text-center text-white text-3xl font-bold mt-6 font-['Montserrat',_sans-serif]">
          Registration
        </h1>

        {/* Form Sections */}
        <div className="flex flex-col md:flex-row mt-8 space-y-6 md:space-y-0 md:space-x-8 px-4 md:px-8">
          {/* Column 1 */}
          <div className="w-full md:w-1/2 space-y-4">
            {/* First Name */}
            <div className="relative">
              <label className="text-gray-300 text-sm mb-1 flex items-center gap-2 font-bold">
                <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                First Name
              </label>
              <input
                type="text"
                name="fname"
                value={formData.fname}
                onChange={handleChange}
                className={`w-full p-3 bg-transparent border-2 ${
                  fieldValid.fname ? 'border-gray-300' : 'border-red-500'
                } rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 hover:border-blue-400 transition-all outline-none font-['Times_New_Roman',_serif] text-[15px] font-bold`}
                placeholder="Enter your first name"
                aria-label="First Name"
                tabIndex={1}
              />
            </div>

            {/* Last Name */}
            <div className="relative">
              <label className="text-gray-300 text-sm mb-1 flex items-center gap-2 font-bold">
                <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                Last Name
              </label>
              <input
                type="text"
                name="lname"
                value={formData.lname}
                onChange={handleChange}
                className={`w-full p-3 bg-transparent border-2 ${
                  fieldValid.lname ? 'border-gray-300' : 'border-red-500'
                } rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 hover:border-blue-400 transition-all outline-none font-['Times_New_Roman',_serif] text-[15px] font-bold`}
                placeholder="Enter your last name"
                aria-label="Last Name"
                tabIndex={2}
              />
            </div>

            {/* Security Question */}
            <div className="relative">
              <label className="text-gray-300 text-sm mb-1 flex items-center gap-2 font-bold">
                <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Security Question
              </label>
              <select
                name="ssq"
                value={formData.ssq}
                onChange={handleChange}
                className={`w-full p-3 bg-transparent border-2 ${
                  fieldValid.ssq ? 'border-gray-300' : 'border-red-500'
                } rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 hover:border-blue-400 transition-all outline-none font-['Times_New_Roman',_serif] text-[15px] font-bold appearance-none`}
                aria-label="Security Question"
                tabIndex={3}
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

            {/* Security Answer (Progressive Disclosure) */}
            {formData.ssq !== 'Select' && (
              <div className="relative">
                <label className="text-gray-300 text-sm mb-1 flex items-center gap-2 font-bold">
                  <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  Security Answer
                </label>
                <input
                  type="text"
                  name="sa"
                  value={formData.sa}
                  onChange={handleChange}
                  className={`w-full p-3 bg-transparent border-2 ${
                    fieldValid.sa ? 'border-gray-300' : 'border-red-500'
                  } rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 hover:border-blue-400 transition-all outline-none font-['Times_New_Roman',_serif] text-[15px] font-bold`}
                  placeholder="Enter your answer"
                  aria-label="Security Answer"
                  tabIndex={4}
                />
              </div>
            )}
          </div>

          {/* Column 2 */}
          <div className="w-full md:w-1/2 space-y-4">
            {/* Contact Number */}
            <div className="relative">
              <label className="text-gray-300 text-sm mb-1 flex items-center gap-2 font-bold">
                <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                Contact Number
              </label>
              <input
                type="text"
                name="cnum"
                value={formData.cnum}
                onChange={handleChange}
                className={`w-full p-3 bg-transparent border-2 ${
                  fieldValid.cnum ? 'border-gray-300' : 'border-red-500'
                } rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 hover:border-blue-400 transition-all outline-none font-['Times_New_Roman',_serif] text-[15px] font-bold`}
                placeholder="123-456-7890"
                aria-label="Contact Number"
                tabIndex={5}
              />
            </div>

            {/* Email */}
            <div className="relative">
              <label className="text-gray-300 text-sm mb-1 flex items-center gap-2 font-bold">
                <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l9-6 9 6v10a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 12v6"></path>
                </svg>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-3 bg-transparent border-2 ${
                  fieldValid.email ? 'border-gray-300' : 'border-red-500'
                } rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 hover:border-blue-400 transition-all outline-none font-['Times_New_Roman',_serif] text-[15px] font-bold`}
                placeholder="Enter your email"
                aria-label="Email"
                tabIndex={6}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label className="text-gray-300 text-sm mb-1 flex items-center gap-2 font-bold">
                <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2zm0 2c-1.104 0-2 .896-2 2v3h4v-3c0-1.104-.896-2-2-2zm5-7h1a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h1m4-2h2a2 2 0 012 2v2H9V6a2 2 0 012-2z"></path>
                </svg>
                Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="pwd"
                value={formData.pwd}
                onChange={handleChange}
                className={`w-full p-3 bg-transparent border-2 ${
                  fieldValid.pwd ? 'border-gray-300' : 'border-red-500'
                } rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 hover:border-blue-400 transition-all outline-none font-['Times_New_Roman',_serif] text-[15px] font-bold`}
                placeholder="Enter your password"
                aria-label="Password"
                tabIndex={7}
              />
              <button
                onClick={togglePassword}
                className="absolute right-3 top-1/2 transform -translate-y-[-2px] text-gray-300 hover:text-white focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={8}
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
              {passwordStrength && (
                <div className="mt-1 text-sm">
                  <span
                    className={
                      passwordStrength === 'Weak'
                        ? 'text-red-500'
                        : passwordStrength === 'Medium'
                        ? 'text-yellow-500'
                        : 'text-green-500'
                    }
                  >
                    Password Strength: {passwordStrength}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label className="text-gray-300 text-sm mb-1 flex items-center gap-2 font-bold">
                <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2zm0 2c-1.104 0-2 .896-2 2v3h4v-3c0-1.104-.896-2-2-2zm5-7h1a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h1m4-2h2a2 2 0 012 2v2H9V6a2 2 0 012-2z"></path>
                </svg>
                Confirm Password
              </label>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="cpwd"
                value={formData.cpwd}
                onChange={handleChange}
                className={`w-full p-3 bg-transparent border-2 ${
                  fieldValid.cpwd ? 'border-gray-300' : 'border-red-500'
                } rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 hover:border-blue-400 transition-all outline-none font-['Times_New_Roman',_serif] text-[15px] font-bold`}
                placeholder="Confirm your password"
                aria-label="Confirm Password"
                tabIndex={9}
              />
              <button
                onClick={toggleConfirmPassword}
                className="absolute right-3 top-1/2 transform -translate-y-[-2px] text-gray-300 hover:text-white focus:outline-none"
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                tabIndex={10}
              >
                {showConfirmPassword ? (
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
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row justify-between px-4 md:px-8 mt-6 space-y-4 md:space-y-0 md:space-x-4">
          <button
            onClick={handleRegister}
            disabled={!formValid}
            className={`w-full md:w-[270px] bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-blue-500/50 active:scale-95 transition-all duration-300 shadow-md ${
              !formValid ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            aria-label="Register"
            tabIndex={11}
          >
            Register
          </button>
          <button
            onClick={handleSwitchToLogin}
            className="w-full md:w-[270px] bg-gradient-to-r from-gray-500 to-gray-700 text-white font-bold py-3 rounded-lg hover:from-gray-600 hover:to-gray-800 focus:ring-2 focus:ring-gray-500/50 active:scale-95 transition-all duration-300 shadow-md"
            aria-label="Switch to Login"
            tabIndex={12}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;