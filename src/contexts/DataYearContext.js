import { createContext, useState } from 'react';
import {initializeLayerState, getLayersFromState} from '../components/map/Layers';
import {initialDataYear} from '../const/InitialZoom';

export const DataYearContext = createContext(null);

export const DataYearContextProvider = ({ children }) => {
  const [dataYear, setDataYear] = useState(initialDataYear);

  return (
    <DataYearContext.Provider
      value={{
        contextDataYear: [dataYear, setDataYear],
      }}>
      {children}
    </DataYearContext.Provider>
  );
}