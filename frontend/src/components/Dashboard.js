import React from 'react';

function Dashboard({ onBack }) {
  const openGmailAniket = () => {
    window.open('https://mail.google.com/mail/u/aniket.mishra.er@gmail.com', '_blank');
  };

  const openGmailAnshul = () => {
    window.open('https://mail.google.com/mail/u/anshul.15.vish@gmail.com', '_blank');
  };

  const openGmailAmitesh = () => {
    window.open('https://mail.google.com/mail/u/amiteshdube4444@gmail.com', '_blank');
  };

  const openLinkedIn = (profile) => {
    window.open(profile, '_blank');
  };

  const callPhone = (phone) => {
    window.open(`tel:${phone}`);
  };

  return (
    <div
      className="min-h-screen bg-gray-900 relative"
      style={{
        backgroundImage: `url('/images/fd.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Overlay for soft glowing effect */}
      <div className="absolute inset-0 bg-black opacity-60"></div>

      {/* Header */}
      <div className="relative z-10">
        <div className="flex items-center justify-between p-6">
          <button
            onClick={onBack}
            className="bg-gradient-to-r from-gray-600 to-gray-800 text-white px-6 py-2 rounded-full shadow-lg hover:from-gray-700 hover:to-gray-900 transition-all duration-300"
          >
            Back Home
          </button>
          <h1 className="text-4xl font-bold text-white text-center flex-1 drop-shadow-lg animate-pulse">
            Help Support
          </h1>
          <div className="w-24"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex justify-center gap-8 pt-12 px-4">
        {/* Aniket Mishra */}
        <div className="flex flex-col items-center">
          <div className="w-64 bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
            <img
              src="/images/aniket.jpg"
              alt="Aniket Mishra"
              className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-blue-500"
            />
            <h2 className="text-xl font-semibold text-white text-center">Aniket Mishra</h2>
            <p className="text-sm text-gray-300 text-center">Technical Support Specialist</p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={openGmailAniket}
                className="text-white hover:text-blue-400 transition-colors"
                aria-label="Email Aniket Mishra"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"></path>
                </svg>
              </button>
              <button
                onClick={() => openLinkedIn('https://www.linkedin.com/in/aniket-mishra')}
                className="text-white hover:text-blue-400 transition-colors"
                aria-label="LinkedIn Aniket Mishra"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-1.337-.027-3.063-1.867-3.063-1.872 0-2.159 1.462-2.159 2.971v5.696h-3v-11h2.878v1.496h.041c.401-.761 1.381-1.496 2.84-1.496 3.038 0 3.6 2.001 3.6 4.604v6.396z"></path>
                </svg>
              </button>
              <button
                onClick={() => callPhone('+917510028100')}
                className="text-white hover:text-blue-400 transition-colors"
                aria-label="Call Aniket Mishra"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.65 3 4.19 3 15.06 12.95 24 23.81 24c.54 0 .99-.45.99-.99v-3.53c0-.54-.45-.99-.99-.99z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Anshul Sharma */}
        <div className="flex flex-col items-center">
          <div className="w-64 bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
            <img
              src="/images/anshul.jpeg"
              alt="Anshul Sharma"
              className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-blue-500"
            />
            <h2 className="text-xl font-semibold text-white text-center">Anshul Sharma</h2>
            <p className="text-sm text-gray-300 text-center">Technical Support Specialist</p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={openGmailAnshul}
                className="text-white hover:text-blue-400 transition-colors"
                aria-label="Email Anshul Sharma"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"></path>
                </svg>
              </button>
              <button
                onClick={() => openLinkedIn('https://www.linkedin.com/in/anshul-sharma')}
                className="text-white hover:text-blue-400 transition-colors"
                aria-label="LinkedIn Anshul Sharma"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-1.337-.027-3.063-1.867-3.063-1.872 0-2.159 1.462-2.159 2.971v5.696h-3v-11h2.878v1.496h.041c.401-.761 1.381-1.496 2.84-1.496 3.038 0 3.6 2.001 3.6 4.604v6.396z"></path>
                </svg>
              </button>
              <button
                onClick={() => callPhone('+918924873881')}
                className="text-white hover:text-blue-400 transition-colors"
                aria-label="Call Anshul Sharma"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.65 3 4.19 3 15.06 12.95 24 23.81 24c.54 0 .99-.45.99-.99v-3.53c0-.54-.45-.99-.99-.99z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Amitesh Dwivedi */}
        <div className="flex flex-col items-center">
          <div className="w-64 bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
            <img
              src="/images/amitesh.jpg"
              alt="Amitesh Dwivedi"
              className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-blue-500"
            />
            <h2 className="text-xl font-semibold text-white text-center">Amitesh Dwivedi</h2>
            <p className="text-sm text-gray-300 text-center">Technical Support Specialist</p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={openGmailAmitesh}
                className="text-white hover:text-blue-400 transition-colors"
                aria-label="Email Amitesh Dwivedi"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"></path>
                </svg>
              </button>
              <button
                onClick={() => openLinkedIn('https://www.linkedin.com/in/amitesh-dwivedi')}
                className="text-white hover:text-blue-400 transition-colors"
                aria-label="LinkedIn Amitesh Dwivedi"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-1.337-.027-3.063-1.867-3.063-1.872 0-2.159 1.462-2.159 2.971v5.696h-3v-11h2.878v1.496h.041c.401-.761 1.381-1.496 2.84-1.496 3.038 0 3.6 2.001 3.6 4.604v6.396z"></path>
                </svg>
              </button>
              <button
                onClick={() => callPhone('+919260981195')}
                className="text-white hover:text-blue-400 transition-colors"
                aria-label="Call Amitesh Dwivedi"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.65 3 4.19 3 15.06 12.95 24 23.81 24c.54 0 .99-.45.99-.99v-3.53c0-.54-.45-.99-.99-.99z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;