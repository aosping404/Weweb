import { createContext, useState } from 'react';

export const ScanningContext = createContext();

export const ScanningProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <ScanningContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </ScanningContext.Provider>
  );
};
