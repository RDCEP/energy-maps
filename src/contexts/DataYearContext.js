import { createContext, useState } from 'react';
import {initialDataYear} from '../const/InitialState';

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