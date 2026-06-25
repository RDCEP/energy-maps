import { createContext, useState } from 'react';
import {initialSelectedAssetValue, initialTotalAssetValue} from '../const/InitialState';

export const AssetValueContext = createContext(null);

export const AssetValueContextProvider = ({ children }) => {
  const [selectedAssetValue, setSelectedAssetValue] = useState(initialSelectedAssetValue);
  const [totalAssetValue, setTotalAssetValue] = useState(initialTotalAssetValue);

  return (
    <AssetValueContext.Provider
      value={{
        contextSelectedAssetValue: [selectedAssetValue, setSelectedAssetValue],
        contextTotalAssetValue: [totalAssetValue, setTotalAssetValue],
      }}>
      {children}
    </AssetValueContext.Provider>
  );
}