import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';

function FaceDetector({ onBack }) {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const webcamRef = useRef(null);

  const captureImage = () => {
    if (!webcamRef.current) return null;
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
      return imageSrc;
    } else {
      alert('Failed to capture image. Please ensure the camera is accessible.');
      return null;
    }
  };

  const handleFaceRecognition = async () => {
    // Open the camera when the Face Detector button is clicked
    setIsCameraOpen(true);
    setCapturedImage(null); // Reset captured image
    setIsScanning(true);

    try {
      // Clear session before starting new face recognition
      await fetch('http://localhost:5000/api/clear-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      // Wait briefly to ensure the webcam is ready
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Capture image from webcam
      const imageSrc = captureImage();
      if (!imageSrc) {
        setIsScanning(false);
        setIsCameraOpen(false); // Close the camera on failure
        return;
      }

      // Send the captured image to the backend for face recognition
      const response = await fetch('http://localhost:5000/api/recognize-face', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageSrc }),
      });
      const recognitionData = await response.json();

      if (recognitionData.status !== 200) {
        if (recognitionData.message.includes('No faces detected')) {
          alert('No faces detected. Please ensure your face is visible and well-lit.');
        } else if (recognitionData.message.includes('not trained')) {
          alert('Face recognition model is not trained. Please train the model first.');
        } else {
          alert(recognitionData.message || 'Face recognition failed.');
        }
        setIsScanning(false);
        setIsCameraOpen(false); // Close the camera after failure
        return;
      }

      const studentId = recognitionData.student_id;
      if (!studentId) {
        alert('No face recognized.');
        setIsScanning(false);
        setIsCameraOpen(false); // Close the camera if no face is recognized
        return;
      }

      // Mark attendance with the recognized student_id
      const attendanceResponse = await fetch('http://localhost:5000/api/mark-attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId }),
      });
      const attendanceData = await attendanceResponse.json();
      alert(attendanceData.message);

      if (attendanceData.status === 200 && attendanceData.student) {
        const { id, name, roll, department } = attendanceData.student;
        alert(`Recognized Student:\nID: ${id}\nName: ${name}\nRoll: ${roll}\nDepartment: ${department}`);
      }
    } catch (error) {
      console.error('Error during face recognition:', error);
      alert('Failed to perform face recognition. Please ensure your camera is working and check the console for details.');
    } finally {
      setTimeout(() => {
        setIsScanning(false);
        setIsCameraOpen(false); // Close the camera after completion
      }, 2000);
    }
  };

  const handleTrainModel = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/train', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error('Error training model:', error);
      alert('Failed to train model. Please check the console for details.');
    }
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: 'url(/images/bb.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
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
      <div className="relative z-10">
        <div className="bg-gradient-to-r from-blue-900 to-purple-900 text-white p-4 flex flex-col sm:flex-row justify-between items-center rounded-b-2xl shadow-lg space-y-4 sm:space-y-0">
          <button
            onClick={onBack}
            className="flex items-center bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 hover:scale-105 transition-all shadow-md"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Back Home
          </button>
          <h1 className="text-xl sm:text-3xl font-bold font-['Montserrat',_sans-serif] tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">
            Welcome to Face Recognition Panel
          </h1>
          <div className="w-12 h-12"></div>
        </div>
        <div className="flex justify-center">
          <div className="w-64 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded animate-pulse mt-2"></div>
        </div>
        <div className="flex justify-center items-center min-h-[calc(100vh-120px)] px-4">
          <div className="flex flex-col items-center">
            <div className="relative w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 mb-6">
              {isCameraOpen && !capturedImage ? (
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  width={384}
                  height={384}
                  videoConstraints={{ facingMode: 'user' }}
                  className="w-full h-full object-cover rounded-2xl border-4 border-transparent hover:border-blue-500 transition-all duration-300 shadow-lg"
                />
              ) : capturedImage ? (
                <img
                  src={capturedImage}
                  alt="Captured Face"
                  className="w-full h-full object-cover rounded-2xl border-4 border-blue-500 shadow-lg"
                />
              ) : (
                <div className="w-full h-full bg-gray-800 rounded-2xl flex items-center justify-center text-white text-lg font-bold">
                  Camera Off
                </div>
              )}
              {isScanning && isCameraOpen && !capturedImage && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="scan-line"></div>
                </div>
              )}
              <div className="absolute inset-0 rounded-2xl shadow-[0_0_20px_rgba(59,130,246,0.5)] opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
            <button
              onClick={handleFaceRecognition}
              className="relative w-64 sm:w-80 md:w-96 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 rounded-xl hover:scale-105 hover:shadow-xl transition-all duration-300 shadow-md flex items-center justify-center"
            >
              <svg
                className="w-6 h-6 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 12h18M3 6h18M3 18h18M9 6v12M15 6v12"
                ></path>
              </svg>
              Face Detector
            </button>
            <button
              onClick={handleTrainModel}
              className="relative w-64 sm:w-80 md:w-96 bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold py-3 rounded-xl hover:scale-105 hover:shadow-xl transition-all duration-300 shadow-md flex items-center justify-center mt-4"
            >
              <svg
                className="w-6 h-6 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                ></path>
              </svg>
              Train Model
            </button>
          </div>
        </div>
      </div>
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          @keyframes scan {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100%); }
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
          .scan-line {
            position: absolute;
            width: 100%;
            height: 2px;
            background: linear-gradient(to right, transparent, #3b82f6, transparent);
            animation: scan 1s infinite linear;
          }
        `}
      </style>
    </div>
  );
}

export default FaceDetector;