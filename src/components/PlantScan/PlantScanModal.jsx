import React, { useState, useEffect, useRef } from 'react';
import PlantAnalysisResults from './PlantAnalysisResults';
import { useGemini } from '../../context/GeminiContext';
import './PlantScanModal.css';

const PlantScanModal = ({ onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, _setCameraError] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [cameraPermissionDenied, setCameraPermissionDenied] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [_usingFrontCamera, _setUsingFrontCamera] = useState(false);
  
  // Use Gemini context
  const { analyzePlantImage } = useGemini();

  // Initialize camera
  useEffect(() => {
    // Check if we're on a mobile device
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /mobile|android|iphone|ipad|ipod|windows phone/i.test(userAgent);
      setIsMobile(isMobileDevice);
    };
    
    checkMobile();
    initCamera();
    
    // Cleanup camera when component unmounts
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  // Initialize camera
  const initCamera = async () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
    }
    
    try {
      const constraints = {
        video: {
          facingMode: isMobile ? "environment" : "user",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setCameraStream(stream);
      setCameraPermissionDenied(false);
      setCapturedImage(null);
    } catch (err) {
      console.error('Error accessing camera:', err);
      setCameraPermissionDenied(true);
      _setCameraError(err.message || 'Camera error');
      setCapturedImage(null);
    }
  };
  
  // Process image for analysis
  const handleImageProcess = (imageData) => {
    setLoading(true);
    _setCameraError(null);
    
    console.log('Processing image for plant analysis...');
    
    // Call the Gemini API to analyze the plant image
    analyzePlantImage(imageData)
      .then(results => {
        console.log('Analysis results received:', results);
        if (!results) {
          throw new Error('No results returned from analysis');
        }
        setAnalysisResults(results);
      })
      .catch(err => {
        console.error('Error analyzing plant:', err);
        _setCameraError(err.message || 'Failed to analyze plant');
      })
      .finally(() => {
        setLoading(false);
      });
  };
  
  // Return to camera view and clear results
  const retakePhoto = () => {
    setCapturedImage(null);
    setAnalysisResults(null);
    _setCameraError(null);
    setShowUpload(false);
    
    // Ensure camera is reinitialized when going back
    initCamera();
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      _setCameraError("Please select a valid image file (JPEG, PNG, etc.)");
      return;
    }
    
    // Show loading state
    setLoading(true);
    _setCameraError(null);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imageData = e.target.result;
        
        if (!imageData || typeof imageData !== 'string') {
          throw new Error("Failed to read image file");
        }
        
        console.log('Image file loaded successfully');
        setCapturedImage(imageData);
        setShowUpload(false);
        
        // Analyze the uploaded image
        handleImageProcess(imageData);
      } catch (err) {
        console.error('Error processing uploaded file:', err);
        _setCameraError(`Failed to process image: ${err.message}`);
        setLoading(false);
      }
    };
    reader.onerror = (e) => {
      console.error('FileReader error:', e);
      _setCameraError("Failed to read the selected image file");
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };
  
  // Toggle between camera and upload modes
  const toggleUploadMode = () => {
    setShowUpload(!showUpload);
  };

  // Function to take photo
  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    // Show loading indicator
    setLoading(true);
    
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      
      // Draw video frame to canvas
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Get image data from canvas
      const imageData = canvas.toDataURL('image/jpeg', 0.95);
      
      if (!imageData || imageData === 'data:,') {
        throw new Error('Failed to capture image from camera');
      }
      
      console.log('Image captured successfully');
      setCapturedImage(imageData);
      
      // Wait a short moment to show the captured image before analysis
      setTimeout(() => {
        // Analyze the captured image
        handleImageProcess(imageData);
      }, 500);
    } catch (err) {
      console.error('Error capturing image:', err);
      _setCameraError(`Failed to capture image: ${err.message}`);
      setLoading(false);
    }
  };

  return (
    <div className="plant-scan-modal" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <div className="modal-title">
          <span className="modal-icon">🔍</span>
          Plant Scanner
        </div>
        <button className="close-button" onClick={(e) => {
          e.stopPropagation();
          onClose(e);
        }}>×</button>
      </div>

      <div className="modal-content">
        {error && (
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button className="action-button" onClick={retakePhoto}>
              Try Again
            </button>
          </div>
        )}

        {cameraPermissionDenied && (
          <div className="permission-denied">
            <p>Camera access was denied. Please enable camera permissions and try again.</p>
            <button className="action-button" onClick={initCamera}>Try Again</button>
          </div>
        )}

        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Analyzing your plant...</p>
          </div>
        )}

        {analysisResults && (
          <PlantAnalysisResults 
            results={analysisResults} 
            onScanAnother={retakePhoto} 
          />
        )}

        {!capturedImage && !analysisResults && !cameraPermissionDenied && !showUpload && (
          <div className="camera-container">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted
              className="camera-preview"
            ></video>
            <div className="capture-controls">
              <button 
                className="capture-button" 
                onClick={captureImage}
              >
                <span className="capture-icon">📷</span>
              </button>
              <button 
                className="upload-toggle-button" 
                onClick={toggleUploadMode}
              >
                <span className="upload-icon">📤</span>
              </button>
            </div>
          </div>
        )}

        {!capturedImage && !analysisResults && !cameraPermissionDenied && showUpload && (
          <div className="upload-container">
            <div className="upload-prompt">
              <div className="upload-icon">📤</div>
              <p>Upload a photo of your plant</p>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <button 
                className="upload-button"
                onClick={() => fileInputRef.current.click()}
              >
                Select Image
              </button>
              <button 
                className="back-to-camera-button"
                onClick={toggleUploadMode}
              >
                Back to Camera
              </button>
            </div>
          </div>
        )}

        {capturedImage && !analysisResults && (
          <div className="preview-container">
            <img 
              src={capturedImage} 
              alt="Captured plant" 
              className="captured-image"
            />
            <div className="preview-controls">
              <button 
                className="action-button back-button" 
                onClick={retakePhoto}
              >
                <span className="action-icon">←</span>
                <span className="action-text">BACK</span>
              </button>
              <button 
                className="action-button analyze-button" 
                onClick={() => handleImageProcess(capturedImage)}
              >
                <span className="action-icon">✓</span>
                <span className="action-text">ANALYZE</span>
              </button>
            </div>
          </div>
        )}
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
    </div>
  );
};

export default PlantScanModal; 