import { createContext, useState } from 'react';
import {initializeLayerState, getLayersFromState} from './components/map/Layers';

export const ZoomLevelContext = createContext(null);

export const ZoomLevelContextProvider = ({ children }) => {
  const INITIAL_ZOOM = 4;
  const [zoomLevel, setZoomLevel] = useState(INITIAL_ZOOM);
  const [layerState, setLayerState] = useState(initializeLayerState());
  const [mapLayers, setMapLayers] = useState(getLayersFromState(layerState, zoomLevel));
  const [dataYear, setDataYear] = useState(2012);

  return (
    <ZoomLevelContext.Provider value={{
      contextZoomLevel: [zoomLevel, setZoomLevel],
      contextLayerState: [layerState, setLayerState],
      contextMapLayers: [mapLayers, setMapLayers],
      contextDataYear: [dataYear, setDataYear], }}>
      {children}
    </ZoomLevelContext.Provider>
  );
}