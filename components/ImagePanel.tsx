
import React from 'react';
import Spinner from './Spinner';
import { ImageIcon } from './Icons';

interface ImagePanelProps {
  title: string;
  imageUrl: string | null;
  isLoading?: boolean;
}

const ImagePanel: React.FC<ImagePanelProps> = ({ title, imageUrl, isLoading = false }) => {
  return (
    <div className="flex-1 flex flex-col bg-gray-900/70 p-4 rounded-lg border border-gray-700 min-h-[300px] md:min-h-[400px]">
      <h2 className="text-xl font-semibold text-center text-gray-300 mb-4">{title}</h2>
      <div className="flex-grow w-full h-full flex items-center justify-center rounded-md overflow-hidden bg-gray-800/50 relative">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/80 z-10">
            <Spinner />
            <p className="text-gray-400 mt-2">AI is enhancing the image...</p>
          </div>
        )}
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="max-w-full max-h-full object-contain" />
        ) : (
          !isLoading && (
            <div className="text-center text-gray-500">
              <ImageIcon className="w-16 h-16 mx-auto mb-2" />
              <p>{title === 'Original' ? 'Upload an image to begin' : 'Processed image will appear here'}</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ImagePanel;
