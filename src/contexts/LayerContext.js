import { createContext, useState } from 'react';
import {initializeLayerState, getLayersFromState} from '../components/map/Layers';
import {InitialZoomLevel} from '../const/InitialZoomLevel';

export const LayerContext = createContext(null);

export const LayerContextProvider = ({ children }) => {
  const [layerState, setLayerState] = useState(initializeLayerState());
  const [mapLayers, setMapLayers] = useState(getLayersFromState(layerState, InitialZoomLevel));

  return (
    <LayerContext.Provider value={{
      contextLayerState: [layerState, setLayerState],
      contextMapLayers: [mapLayers, setMapLayers], }}
    >
      {children}
    </LayerContext.Provider>
  );
}