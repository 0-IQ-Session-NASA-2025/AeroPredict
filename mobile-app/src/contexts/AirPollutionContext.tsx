import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AirPollutionData {
  predictionText: string;
  location: string;
  timestamp: string;
}

interface AirPollutionContextType {
  airPollutionData: AirPollutionData;
  updateAirPollutionData: (data: Partial<AirPollutionData>) => void;
}

const defaultAirPollutionData: AirPollutionData = {
  predictionText: "Air quality is moderate today with good visibility for outdoor activities",
  location: "Current Location",
  timestamp: new Date().toLocaleString(),
};

const AirPollutionContext = createContext<AirPollutionContextType | undefined>(undefined);

export const AirPollutionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [airPollutionData, setAirPollutionData] = useState<AirPollutionData>(defaultAirPollutionData);

  const updateAirPollutionData = (data: Partial<AirPollutionData>) => {
    setAirPollutionData(prev => ({ ...prev, ...data }));
  };

  return (
    <AirPollutionContext.Provider value={{ airPollutionData, updateAirPollutionData }}>
      {children}
    </AirPollutionContext.Provider>
  );
};

export const useAirPollution = () => {
  const context = useContext(AirPollutionContext);
  if (context === undefined) {
    throw new Error('useAirPollution must be used within an AirPollutionProvider');
  }
  return context;
};