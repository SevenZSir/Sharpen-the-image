
import React, { useState, useCallback } from 'react';
import { sharpenImage } from './services/geminiService';
import { fileToBase64 } from './utils/imageHelper';
import ImagePanel from './components/ImagePanel';
import { UploadIcon, SparklesIcon } from './components/Icons';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [sharpenedImageUrl, setSharpenedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file (e.g., JPEG, PNG).');
        return;
      }
      setOriginalImage(file);
      setOriginalImageUrl(URL.createObjectURL(file));
      setSharpenedImageUrl(null);
      setError(null);
    }
  };

  const handleSharpen = useCallback(async () => {
    if (!originalImage) return;

    setIsLoading(true);
    setError(null);
    setSharpenedImageUrl(null);

    try {
      const { base64, mimeType } = await fileToBase64(originalImage);
      const sharpenedBase64 = await sharpenImage(base64, mimeType);
      
      if (sharpenedBase64) {
        setSharpenedImageUrl(`data:${mimeType};base64,${sharpenedBase64}`);
      } else {
        throw new Error('The API did not return an image. Please try again.');
      }

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [originalImage]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans">
      <header className="w-full max-w-6xl text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
          Gemini Image Sharpener
        </h1>
        <p className="text-gray-400 mt-2 text-lg">
          Upload an image and let AI enhance its clarity and detail.
        </p>
      </header>

      <main className="w-full max-w-6xl flex flex-col items-center">
        <div className="w-full bg-gray-800/50 rounded-xl shadow-2xl p-6 border border-gray-700 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <ImagePanel title="Original" imageUrl={originalImageUrl} />
            <ImagePanel title="Sharpened" imageUrl={sharpenedImageUrl} isLoading={isLoading} />
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg relative text-center mb-6" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <label htmlFor="file-upload" className="cursor-pointer inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 transition-transform duration-200 hover:scale-105 w-full sm:w-auto">
              <UploadIcon className="w-5 h-5 mr-2" />
              {originalImage ? 'Change Image' : 'Select Image'}
            </label>
            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
            
            <button
              onClick={handleSharpen}
              disabled={!originalImage || isLoading}
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 bg-cyan-400 hover:bg-cyan-500 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 disabled:hover:scale-100 w-full sm:w-auto"
            >
              <SparklesIcon className={`w-5 h-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Sharpening...' : 'Sharpen Image'}
            </button>
          </div>
        </div>
        
        <footer className="mt-8 text-center text-gray-500 text-sm">
            <p>Powered by Google Gemini. Images are not stored.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
