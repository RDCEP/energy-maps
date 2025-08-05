import { createContext, useState } from 'react';
import {initializeLayerState, getLayersFromState} from '../components/map/Layers';
import {InitialZoomLevel} from '../const/InitialZoomLevel';

export const ZoomLevelContext = createContext(null);

export const ZoomLevelContextProvider = ({ children }) => {
  const [zoomLevel, setZoomLevel] = useState(InitialZoomLevel);

  return (
    <ZoomLevelContext.Provider
      value={{
        contextZoomLevel: [zoomLevel, setZoomLevel],
      }}>
      {children}
    </ZoomLevelContext.Provider>
  );
}