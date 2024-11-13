import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { addMealFromImage } from '../redux/slices/mealsSlice';

function ImageCapture({ onClose, mealType }) {
  const [imageData, setImageData] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const dispatch = useDispatch();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const captureImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
    setImageData(canvas.toDataURL('image/jpeg'));
    stopCamera();
  };

  const analyzeFoodImage = async () => {
    setAnalyzing(true);
    // Simulated food recognition - in real app, use AI service
    const mockAnalysis = {
      name: 'Detected Food Item',
      calories: 350,
      protein: 15,
      carbs: 45,
      fat: 12,
    };

    dispatch(addMealFromImage({
      mealType,
      meal: {
        ...mockAnalysis,
        image: imageData,
      }
    }));
    
    setAnalyzing(false);
    onClose();
  };

  React.useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-4 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Capture Food Image</h3>
          <button onClick={onClose} className="text-gray-500">✕</button>
        </div>

        <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-4">
          {!imageData ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={imageData}
              alt="Captured food"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div className="flex justify-center space-x-4">
          {!imageData ? (
            <button
              onClick={captureImage}
              className="btn btn-primary px-8"
            >
              Capture
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  setImageData(null);
                  startCamera();
                }}
                className="btn bg-gray-200 hover:bg-gray-300"
              >
                Retake
              </button>
              <button
                onClick={analyzeFoodImage}
                disabled={analyzing}
                className="btn btn-primary"
              >
                {analyzing ? 'Analyzing...' : 'Analyze Food'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ImageCapture;