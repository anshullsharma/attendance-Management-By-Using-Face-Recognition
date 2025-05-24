import React from 'react';

function Developers({ onBack }) {
  const showAniketInfo = () => {
    alert("🔷 𝗜 Hey, my name is Aniket Mishra. Transform ideas into seamless digital experiences. 💡");
  };

  const showAnshulInfo = () => {
    alert("🔷 𝗜 Hey, my name is Anshul Sharma. I blend logic with creativity to build impactful digital solutions. 💡");
  };

  const showAmiteshInfo = () => {
    alert("🔷 𝗜 Hey, my name is Amitesh Dwivedi. Enthusiastic about tech that empowers people. 💡");
  };

  return (
    <div
      className="min-h-screen bg-gray-900 relative"
      style={{
        backgroundImage: `url('/images/bg2.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Subtle Overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Header */}
      <div className="relative z-10">
        <div className="flex flex-col items-center justify-between p-6">
          <div className="w-full flex justify-start">
            <button
              onClick={onBack}
              className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-2 rounded-full shadow-lg hover:from-blue-700 hover:to-blue-900 transform hover:scale-105 transition-all duration-300"
            >
              Back Home
            </button>
          </div>
          <div className="text-center mt-4">
            <h1 className="text-5xl font-bold text-white font-['Montserrat',_sans-serif] drop-shadow-lg">
              Developer Panel
            </h1>
            <p className="text-lg text-gray-300 mt-2 font-['Roboto',_sans-serif]">
              Meet the minds behind the code
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex justify-center items-center min-h-[calc(100vh-200px)] px-4">
        <div className="flex justify-center gap-12">
          {/* Aniket Mishra */}
          <div className="flex flex-col items-center animate-fadeIn">
            <button
              onClick={showAniketInfo}
              className="w-64 bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <img
                src="/images/aniket.jpg"
                alt="Aniket Mishra"
                className="w-40 h-40 rounded-full mx-auto mb-4 border-4 border-blue-500"
              />
              <h2 className="text-xl font-semibold text-white text-center">Aniket Mishra</h2>
              <p className="text-sm text-gray-300 text-center mt-1">Frontend Developer</p>
            </button>
          </div>

          {/* Anshul Sharma */}
          <div className="flex flex-col items-center animate-fadeIn animation-delay-200">
            <button
              onClick={showAnshulInfo}
              className="w-64 bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <img
                src="/images/anshul.jpeg"
                alt="Anshul Sharma"
                className="w-40 h-40 rounded-full mx-auto mb-4 border-4 border-blue-500"
              />
              <h2 className="text-xl font-semibold text-white text-center">Anshul Sharma</h2>
              <p className="text-sm text-gray-300 text-center mt-1">Full Stack Developer</p>
            </button>
          </div>

          {/* Amitesh Dwivedi */}
          <div className="flex flex-col items-center animate-fadeIn animation-delay-400">
            <button
              onClick={showAmiteshInfo}
              className="w-64 bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <img
                src="/images/amitesh.jpg"
                alt="Amitesh Dwivedi"
                className="w-40 h-40 rounded-full mx-auto mb-4 border-4 border-blue-500"
              />
              <h2 className="text-xl font-semibold text-white text-center">Amitesh Dwivedi</h2>
              <p className="text-sm text-gray-300 text-center mt-1">Data Analyst</p>
            </button>
          </div>
        </div>
      </div>

      {/* Custom Animation Styles */}
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.6s ease-out forwards;
          }
          .animation-delay-200 {
            animation-delay: 0.2s;
          }
          .animation-delay-400 {
            animation-delay: 0.4s;
          }
        `}
      </style>
    </div>
  );
}

export default Developers;