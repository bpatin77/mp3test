import React, { createContext, useContext, useState } from "react";

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [currentAudio, setCurrentAudio] = useState(null);
  return (
    <AudioContext.Provider value={{ currentAudio, setCurrentAudio }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};
