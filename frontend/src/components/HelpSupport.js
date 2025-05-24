import React from 'react';

function HelpSupport({ onBack }) {
  const openGmailAniket = () => {
    window.open('https://mail.google.com/mail/u/aniket.mishra.er@gmail.com', '_blank');
  };

  const openGmailAnshul = () => {
    window.open('https://mail.google.com/mail/u/anshul.15.vish@gmail.com', '_blank');
  };

  const openGmailAmitesh = () => {
    window.open('https://mail.google.com/mail/u/amiteshdube4444@gmail.com', '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="relative">
        <img src="/images/banner1.jpg" alt="Banner" className="w-full h-32 object-cover" />
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-between px-4 bg-opacity-50 bg-black">
          <button onClick={onBack} className="bg-gray-500 text-white px-4 py-2 rounded">
            Back Home
          </button>
          <h1 className="text-3xl font-bold text-white">Help Support</h1>
          <div></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative">
        <img src="/images/bb.jpg" alt="Background" className="w-full h-screen object-cover absolute top-0 left-0 z-0" />
        <div className="relative z-10 flex justify-center gap-8 pt-20">
          {/* Aniket Mishra */}
          <div className="flex flex-col items-center">
            <button onClick={openGmailAniket} className="w-48 h-48 bg-gray-300 flex items-center justify-center">
              <img src="/images/gmail.png" alt="Gmail" className="w-full h-full object-cover" />
            </button>
            <button onClick={openGmailAniket} className="mt-4 w-48 bg-white text-blue-900 font-bold py-2">
              Aniket Mishra
            </button>
          </div>

          {/* Anshul Sharma */}
          <div className="flex flex-col items-center">
            <button onClick={openGmailAnshul} className="w-48 h-48 bg-gray-300 flex items-center justify-center">
              <img src="/images/gmail.png" alt="Gmail" className="w-full h-full object-cover" />
            </button>
            <button onClick={openGmailAnshul} className="mt-4 w-48 bg-white text-blue-900 font-bold py-2">
              Anshul Sharma
            </button>
          </div>

          {/* Amitesh Dwivedi */}
          <div className="flex flex-col items-center">
            <button onClick={openGmailAmitesh} className="w-48 h-48 bg-gray-300 flex items-center justify-center">
              <img src="/images/gmail.png" alt="Gmail" className="w-full h-full object-cover" />
            </button>
            <button onClick={openGmailAmitesh} className="mt-4 w-48 bg-white text-blue-900 font-bold py-2">
              Amitesh Dwivedi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HelpSupport;