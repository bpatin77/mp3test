import React from "react";
import AudioPlayer from "./components/AudioPlayer";
import { AudioProvider } from "./components/AudioContext";
import { useAudio } from "./components/AudioContext";

const App = () => {
  return (
    <AudioProvider>
      <AudioPlayer />
    </AudioProvider>
  );
};

export default App;
