import { createContext, useState } from 'react';

export const AssetValueContext = createContext(null);

export const AssetValueContextProvider = ({ children }) => {
  const [totalAssetValue, setTotalAssetValue] = useState('');

  return (
    <AssetValueContext.Provider
      value={{
        contextAssetValue: [totalAssetValue, setTotalAssetValue],
      }}>
      {children}
    </AssetValueContext.Provider>
  );
}