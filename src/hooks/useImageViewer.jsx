import { createContext, useContext, useState } from 'react';
import ImageLightbox from '../components/ui/ImageLightbox';

const ImageViewerContext = createContext(null);

export function ImageViewerProvider({ children }) {
  const [image, setImage] = useState(null);
  return (
    <ImageViewerContext.Provider value={setImage}>
      {children}
      {image && <ImageLightbox key={image.src} image={image} onClose={() => setImage(null)} />}
    </ImageViewerContext.Provider>
  );
}

export default function useImageViewer() {
  return useContext(ImageViewerContext);
}
