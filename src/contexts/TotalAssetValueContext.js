import { createContext, useState } from 'react';
import {initialTotalAssetValue} from '../const/InitialState';

export const TotalAssetValueContext = createContext(null);

export const TotalAssetValueContextProvider = ({ children }) => {
  const [totalAssetValue, setTotalAssetValue] = useState(initialTotalAssetValue);

  return (
    <TotalAssetValueContext.Provider
      value={{
        contextTotalAssetValue: [totalAssetValue, setTotalAssetValue],
      }}>
      {children}
    </TotalAssetValueContext.Provider>
  );
}