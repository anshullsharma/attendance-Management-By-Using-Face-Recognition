import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function LoadingScreen({ onFinish }) {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onFinish) {
        onFinish();
      }
      navigate('/', { replace: true });
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate, onFinish]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center overflow-hidden">
      <img
        src="/images/f_det1.gif"
        alt="Loading Animation"
        className="w-screen h-screen object-cover"
      />
    </div>
  );
}

export default LoadingScreen;