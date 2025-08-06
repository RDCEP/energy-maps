import { createContext, useState } from 'react';
import {initializeLayerState, getLayersFromState} from '../components/map/Layers';
import {InitialState} from '../const/InitialState';

export const DataYearContext = createContext(null);

export const DataYearContextProvider = ({ children }) => {
  const [dataYear, setDataYear] = useState(2012);

  return (
    <DataYearContext.Provider
      value={{
        contextDataYear: [dataYear, setDataYear],
      }}>
      {children}
    </DataYearContext.Provider>
  );
}