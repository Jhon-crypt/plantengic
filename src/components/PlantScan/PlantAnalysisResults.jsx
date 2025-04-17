import React from 'react';

const PlantAnalysisResults = ({ results, onScanAnother }) => {
  console.log('Rendering analysis results:', results);
  
  if (!results) {
    return (
      <div className="plant-results">
        <div className="result-card">
          <div className="note-container">
            <p>No analysis results available. Please try again.</p>
          </div>
          <button className="scan-another-button" onClick={onScanAnother}>
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  // Extract plant data from the new JSON structure
  const plant = results?.plant || results;
  
  // Handle both potential structures
  const scientificName = plant?.scientific_name || plant?.name || "Unknown";
  const commonName = plant?.common_name || plant?.commonName || "Unknown";
  const family = plant?.family || "Unknown";
  const lifespan = plant?.lifespan || "Unknown";
  const careLevel = plant?.care_level || plant?.careLevel || "Unknown";
  
  // Get care requirements/details from either structure
  const careDetails = plant?.care_requirements || plant?.details || {};
  
  // Note for special messages
  const note = plant?.note;
  
  // Default confidence if analyzing an unknown plant
  const confidence = plant?.confidence || 0.6;

  // Format confidence percentage
  const confidencePercent = Math.round(confidence * 100);

  return (
    <div className="plant-results">
      <div className="result-card">
        <div className="result-heading">
          <span className="result-icon">🌿</span>
          <div>
            <h3 className="result-title">{scientificName}</h3>
            <p className="result-subtitle">{commonName}</p>
          </div>
        </div>
        
        <div className="ai-badge">
          <div className="ai-badge-icon">🧠</div>
          <div className="ai-badge-text">Analyzed by Gemini AI Vision</div>
        </div>
        
        {note && (
          <div className="note-container">
            <p>{note}</p>
          </div>
        )}
        
        <div className="confidence-bar">
          <div className="confidence-label">
            Match confidence: <strong>{confidencePercent}%</strong>
          </div>
          <div className="confidence-track">
            <div 
              className="confidence-fill" 
              style={{ width: `${confidencePercent}%` }}
            ></div>
          </div>
        </div>
        
        <div className="result-details">
          <div className="result-detail-item">
            <span className="result-detail-label">Plant Family:</span>
            <span>{family}</span>
          </div>
          <div className="result-detail-item">
            <span className="result-detail-label">Typical Lifespan:</span>
            <span>{lifespan}</span>
          </div>
          <div className="result-detail-item">
            <span className="result-detail-label">Care Level:</span>
            <span>{careLevel}</span>
          </div>
        </div>
      </div>

      {Object.keys(careDetails).length > 0 && (
        <div className="result-card">
          <div className="result-heading">
            <span className="result-icon">🔍</span>
            <h3 className="result-title">Care Details</h3>
          </div>
          
          <div className="result-details">
            {Object.entries(careDetails).map(([key, value]) => (
              <div className="result-detail-item" key={key}>
                <span className="result-detail-label">
                  {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}:
                </span>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <button className="scan-another-button" onClick={onScanAnother}>
        Scan Another Plant
      </button>
      
      <div className="gemini-attribution">
        Plant analysis powered by <span className="gemini-name">Gemini AI Vision</span>
        <div className="gemini-model-info">Using Gemini 2.0 Flash multimodal model</div>
      </div>
    </div>
  );
};

export default PlantAnalysisResults; 