import { createContext, useState } from 'react';

export const ZoomLevelContext = createContext(null);

export const ZoomLevelContextProvider = ({ children }) => {
  const [zoomLevel, setZoomLevel] = useState(4);
  const [mapLayers, setMapLayers] = useState('');
  const [dataYear, setDataYear] = useState(2012);

  return (
    <ZoomLevelContext.Provider value={{
      contextZoomLevel: [zoomLevel, setZoomLevel],
      contextMapLayers: [mapLayers, setMapLayers],
      contextDataYear: [dataYear, setDataYear], }}>
      {children}
    </ZoomLevelContext.Provider>
  );
}