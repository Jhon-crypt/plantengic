# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# PlantEngic 🌱

> **Identify, learn, and nurture plants with AI-powered precision**

PlantEngic combines cutting-edge AI technology with beautiful visualization to create a seamless plant identification experience. Simply point your camera at any plant to instantly receive detailed care instructions, scientific information, and growth tips.

![PlantEngic Demo](https://plantengic.brimble.app/)

## ✨ Features

- 🔍 **Instant Identification** - Recognize over 25,000 plant species with exceptional accuracy
- 📋 **Comprehensive Care Guides** - Get detailed information about light, water, soil, temperature requirements
- 📱 **Seamless Mobile Experience** - Responsive design with intuitive camera integration
- 🌈 **Beautiful Visualizations** - Immersive 3D plant particles create an engaging user interface
- 🧠 **Powered by Gemini AI** - Google's advanced multimodal AI ensures accurate plant analysis
- 🔄 **Offline Capabilities** - Basic features work without an internet connection

## 🎨 Unique Visual Experience

PlantEngic features a stunning 3D visualization of floating plant particles on the home screen. This immersive background uses Three.js to create an interactive and dynamic representation of plant elements:

- **Varied Leaf Shapes** - Multiple procedurally generated leaf geometries (maple, fern, simple, broad)
- **Natural Movement** - Leaves gently float and flutter with realistic motion physics
- **Responsive Design** - The particle system automatically adapts to all screen sizes
- **Performance Optimized** - Efficient rendering even on mobile devices

## Getting Started

### Prerequisites

- Node.js (version 16.0.0 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/plantengic.git
   cd plantengic
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Set up your Gemini API key:
   - Get your API key from [Google AI Studio](https://ai.google.dev/)
   - Create a `.env.local` file in the root directory
   - Add your API key to the file:
     ```
     VITE_GEMINI_API_KEY=your_api_key_here
     ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Launch PlantEngic in your browser
2. Click the "Scan a Plant Now" button on the homepage
3. Allow camera access when prompted, or upload an image from your device
4. Capture or select a clear image of the plant you want to identify
5. Wait a moment while Gemini AI analyzes the image
6. Explore the detailed information about your plant including care instructions

## Technology Stack

- **Frontend**: React.js with custom hooks and context API
- **3D Rendering**: Three.js for interactive particle effects
- **AI Integration**: Google's Gemini Vision API for plant analysis
- **Build Tools**: Vite for optimized development and production builds
- **Styling**: Custom CSS with responsive design principles

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google Gemini AI for providing the powerful multimodal vision API
- Three.js community for 3D rendering capabilities and documentation
- React.js ecosystem for building the interactive user interface
- The botanical community for inspiration and plant care knowledge
