import React, { createContext, useContext, useState } from 'react';

// Create a context for Gemini interactions
const GeminiContext = createContext();

// Get the API key directly from environment
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// // Add debugging to help identify API key loading issues
// console.log('API Key loading status:', {
//   keyExists: Boolean(GEMINI_API_KEY),
//   keyLength: GEMINI_API_KEY ? GEMINI_API_KEY.length : 0,
//   envAccess: Boolean(import.meta && import.meta.env)
// });

// // Log masked API key for debugging
// if (GEMINI_API_KEY) {
//   const maskedKey = GEMINI_API_KEY.substring(0, 4) + '...' + GEMINI_API_KEY.substring(GEMINI_API_KEY.length - 4);
//   console.log('API Key (masked):', maskedKey);
// }

// Provider component
export const GeminiProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Function to analyze plant image
  const analyzePlantImage = async (_imageData) => {
    // _imageData would be used in production to send to the API
    // Mock response for demo purposes
    setIsLoading(true);
    setError(null);
    
    try {
      // Extract base64 data from the data URL if needed
      const base64Image = _imageData.startsWith('data:image') 
        ? _imageData.split(',')[1] 
        : _imageData;
      
      console.log('Sending image to Gemini API for analysis...');
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [
                {
                  text: "Analyze this plant image and provide the following information: plant name (scientific and common), family, lifespan, care level, and detailed care requirements including light, water, soil, temperature, humidity, fertilization, propagation, toxicity, and growth habits. Format response as structured data in JSON."
                },
                {
                  inline_data: {
                    mime_type: "image/jpeg",
                    data: base64Image
                  }
                }
              ]
            }]
          }),
          // Prevent redirect
          redirect: 'follow',
          // Prevent CORS issues
          mode: 'cors',
          cache: 'no-cache',
          credentials: 'same-origin',
          referrerPolicy: 'no-referrer'
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Gemini API error:', errorData);
        throw new Error(`Gemini API error: ${errorData.error?.message || response.status}`);
      }
      
      const data = await response.json();
      console.log("Gemini API response:", data);
      
      if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content || !data.candidates[0].content.parts || data.candidates[0].content.parts.length === 0) {
        console.error('Invalid response format from Gemini API:', data);
        throw new Error('Invalid response format from Gemini API');
      }
      
      // Extract the response text from the model
      const responseText = data.candidates[0].content.parts[0].text;
      
      // Check if response contains JSON code block
      let jsonData;
      if (responseText.includes('```json')) {
        // Extract JSON from code block
        const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch && jsonMatch[1]) {
          try {
            jsonData = JSON.parse(jsonMatch[1]);
          } catch (parseError) {
            console.error('Failed to parse JSON from code block:', parseError, jsonMatch[1]);
            throw new Error('Failed to parse JSON response');
          }
        } else {
          throw new Error("Could not extract JSON from response");
        }
      } else {
        // Try parsing the whole text as JSON
        try {
          jsonData = JSON.parse(responseText);
        } catch (/* eslint-disable no-unused-vars */ _) {
          // If not JSON, return the text as is
          console.warn("Could not parse response as JSON, handling as text");
          
          // If there's text indicating no plant detected, return unknown
          if (responseText.toLowerCase().includes("not a plant") ||
              responseText.toLowerCase().includes("unable to identify") ||
              responseText.toLowerCase().includes("not identify")) {
            return { 
              plant: { 
                common_name: "Unknown Plant", 
                scientific_name: "Unknown",
                family: "Unknown",
                lifespan: "Unknown", 
                care_level: "Unknown",
                care_requirements: {
                  light: "Unknown",
                  water: "Unknown",
                  soil: "Unknown",
                  temperature: "Unknown",
                  humidity: "Unknown",
                  fertilization: "Unknown",
                  propagation: "Unknown",
                  toxicity: "Unknown",
                  growth_habits: "Unknown"
                }
              }
            };
          }
          
          // Return a default structure with the response text as a note
          return { 
            plant: { 
              common_name: "Unknown Plant", 
              scientific_name: "Unknown",
              family: "Unknown",
              lifespan: "Unknown", 
              care_level: "Unknown",
              note: responseText,
              care_requirements: {
                light: "Unknown",
                water: "Unknown",
                soil: "Unknown",
                temperature: "Unknown",
                humidity: "Unknown",
                fertilization: "Unknown",
                propagation: "Unknown",
                toxicity: "Unknown",
                growth_habits: "Unknown"
              }
            }
          };
        }
      }
      
      console.log("Successfully parsed plant data:", jsonData);
      return jsonData;
    } catch (error) {
      console.error('Error analyzing image:', error);
      setError(`Error analyzing image: ${error.message}`);
      
      // Return a fallback response for unknown plants
      return { 
        plant: { 
          common_name: "Unknown Plant", 
          scientific_name: "Unknown",
          family: "Unknown",
          lifespan: "Unknown", 
          care_level: "Unknown",
          note: `Analysis error: ${error.message}`,
          care_requirements: {
            light: "Unknown",
            water: "Unknown",
            soil: "Unknown",
            temperature: "Unknown",
            humidity: "Unknown",
            fertilization: "Unknown",
            propagation: "Unknown",
            toxicity: "Unknown",
            growth_habits: "Unknown"
          }
        }
      };
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    analyzePlantImage,
    isLoading,
    error
  };

  return (
    <GeminiContext.Provider value={value}>
      {children}
    </GeminiContext.Provider>
  );
};

// Hook to use the Gemini context
export const useGemini = () => {
  const context = useContext(GeminiContext);
  if (!context) {
    throw new Error('useGemini must be used within a GeminiProvider');
  }
  return context;
};

export default GeminiContext; 