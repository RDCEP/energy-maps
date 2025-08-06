import { createContext, useState } from 'react';
import {initializeLayerState, getLayersFromState} from '../components/map/Layers';
import {InitialState} from '../const/InitialState';

export const ZoomLevelContext = createContext(null);

export const ZoomLevelContextProvider = ({ children }) => {
  const [zoomLevel, setZoomLevel] = useState(InitialState);

  return (
    <ZoomLevelContext.Provider
      value={{
        contextZoomLevel: [zoomLevel, setZoomLevel],
      }}>
      {children}
    </ZoomLevelContext.Provider>
  );
}