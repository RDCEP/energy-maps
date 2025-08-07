import { createContext, useState } from 'react';
import {initializeLayerState, getLayersFromState} from '../components/map/Layers';
import {initialDataYear, initialZoom} from '../const/InitialZoom';

export const LayerContext = createContext(null);

export const LayerContextProvider = ({ children }) => {
  const [layerState, setLayerState] = useState(initializeLayerState(initialDataYear));
  const [mapLayers, setMapLayers] = useState(getLayersFromState(layerState, initialZoom, initialDataYear));

  return (
    <LayerContext.Provider value={{
      contextLayerState: [layerState, setLayerState],
      contextMapLayers: [mapLayers, setMapLayers], }}
    >
      {children}
    </LayerContext.Provider>
  );
}