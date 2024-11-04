import React, { useState, useEffect, useRef } from "react";
import * as Tone from "tone";
import ProgressBar from "./ProgressBar";
import { useAudio } from "./AudioContext";

const AudioPlayer = () => {
  const [offset, setOffset] = useState(0);
  const { setCurrentAudio, currentAudio } = useAudio();
  const [audioBuffer, setAudioBuffer] = useState(null);
  const [originalPlayer, setOriginalPlayer] = useState(null);
  const [isPlayingOriginal, setIsPlayingOriginal] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [contextStarted, setContextStarted] = useState(false);
  const fileInputRef = useRef(null);

  const startAudioContext = async () => {
    if (!contextStarted) {
      console.log("startAudioContext");
      await Tone.start();
      setContextStarted(true);
    }
  };

  const handleFileChange = async (event) => {
    await startAudioContext();
    const file = event.target.files[0];
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const decodedData = await Tone.getContext().decodeAudioData(arrayBuffer);
      setAudioBuffer(decodedData);
      setCurrentAudio(decodedData);
      const newPlayer = new Tone.Player(decodedData).toDestination();
      setOriginalPlayer(newPlayer);
      setDuration(decodedData.duration);
      setProgress(0); // Reset progress to 0
    }
  };

  const onSeek = (value) => {
    if (originalPlayer) {
      originalPlayer.seek(value); // Seek to the value
      setProgress(value); // Update progress to the new value
      setOffset(value);
    }
  };

  const playOriginal = async () => {
    console.log("handle Play Original");
    await startAudioContext();
    if (originalPlayer) {
      originalPlayer.start();
      console.log("Do you see this HELP");
      setIsPlayingOriginal(true);
    }
  };

  const handlePlayPause = async () => {
    await startAudioContext();
    if (isPlayingOriginal) {
      originalPlayer.stop();
      setIsPlayingOriginal(false);
    } else {
      originalPlayer.start();
      setIsPlayingOriginal(true);
      //   updateProgress(); // Start updating progress when playing
    }
  };

  const updateProgress = () => {
    if (isPlayingOriginal && originalPlayer) {
      console.log("update Progress");
      const currentTime = originalPlayer.now(); // Get the current playback time
      setProgress(currentTime);
      if (currentTime < duration) {
        requestAnimationFrame(updateProgress); // Continue updating if playing
      } else {
        setIsPlayingOriginal(false); // Stop updating if the song has ended
      }
    }
  };

  useEffect(() => {
    updateProgress();
  }, [isPlayingOriginal, originalPlayer]);


  useEffect(() => {
    if (originalPlayer) {
      originalPlayer.sync().start(); // Sync the player
    }
    return () => {
      if (originalPlayer) {
        originalPlayer.dispose(); // Clean up on unmount
      }
    };
  }, [originalPlayer]);

  useEffect(() => {
    if (originalPlayer && currentAudio) {
      setDuration(currentAudio.duration);
    }
  }, [currentAudio, originalPlayer]);

  // Progress Update Effect
  //   useEffect(() => {
  //     const updateProgress = () => {
  //       if (isPlayingOriginal && originalPlayer) {
  //         const currentTime = originalPlayer.now(); // Get the current playback time
  //         setProgress(currentTime);
  //         if (currentTime < duration) {
  //           requestAnimationFrame(updateProgress); // Continue updating if playing
  //         } else {
  //           console.log("setting to false");
  //           setIsPlayingOriginal(false); // Stop updating if the song has ended
  //         }
  //       }
  //     };

  //     if (isPlayingOriginal) {
  //       requestAnimationFrame(updateProgress);
  //     }

  //     // return () => {
  //     //   console.log("return setting false");
  //     //   setIsPlayingOriginal(false); // Clean up on unmount
  //     // };
  //   }, [isPlayingOriginal, originalPlayer, duration]);
  console.log("is playing original", isPlayingOriginal);
  //When the progress changes update the starting point of the song
  //   useEffect(() => {
  //     if (currentAudio) {
  //       const newPlayer = new Tone.Player(currentAudio).toDestination();
  //       newPlayer.sync().start(0, offset);
  //       setOriginalPlayer(newPlayer);
  //       return () => {
  //         newPlayer.dispose();
  //       };
  //     }
  //   }, [offset, currentAudio]); //curr

  // Update duration when audio is loaded
  //   useEffect(() => {
  //     if (originalPlayer && audioBuffer) {
  //       setDuration(audioBuffer.duration);
  //     }
  //   }, [audioBuffer, originalPlayer]);

  // Format time from seconds to MM:SS
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  return (
    <div>
      <h1>Upload, Edit, and Play MP3</h1>
      <input
        type="file"
        ref={fileInputRef}
        accept=".mp3"
        onChange={handleFileChange}
      />
      <ProgressBar
        progress={progress}
        duration={duration}
        onSeek={onSeek}
        isPlaying={isPlayingOriginal}
        onPlayPause={handlePlayPause}
      />
      <div>
        {formatTime(progress)} / {formatTime(duration)} minutes
      </div>
    </div>
  );
};

export default AudioPlayer;
