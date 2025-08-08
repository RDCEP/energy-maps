import { createContext, useState } from 'react';
import {initialZoom} from '../const/InitialState';

export const ZoomLevelContext = createContext(null);

export const ZoomLevelContextProvider = ({ children }) => {
  const [zoomLevel, setZoomLevel] = useState(initialZoom);

  return (
    <ZoomLevelContext.Provider
      value={{
        contextZoomLevel: [zoomLevel, setZoomLevel],
      }}>
      {children}
    </ZoomLevelContext.Provider>
  );
}