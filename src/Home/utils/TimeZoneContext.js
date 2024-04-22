//***********created by Himanshi feb 2024***********************/
import React, { createContext, useContext, useState } from 'react';
const TimeZoneContext = createContext();
export const TimeZoneProvider = ({ children }) => {
  const [timeZone, setTimeZone] = useState('Europe/Lisbon');
  
  return (
    <TimeZoneContext.Provider value={{ timeZone, setTimeZone }}>
      {children}
    </TimeZoneContext.Provider>
  );
};
export const useTimeZone = () => {
  const context = useContext(TimeZoneContext);
  if (!context) {
    throw new Error('useTimeZone must be used within a TimeZoneProvider');
  }
  return context;
};
