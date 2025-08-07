import { createContext, useState } from 'react';
import {initializeLayerState, getLayersFromState} from '../components/map/Layers';
import {initialZoom} from '../const/InitialZoom';

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