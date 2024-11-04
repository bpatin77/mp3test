import React from "react";

const ProgressBar = ({
  progress,
  duration,
  onSeek,
  isPlaying,
  onPlayPause,
}) => {
  const handleProgressChange = (event) => {
    const value = Number(event.target.value);
    onSeek(value); // Call onSeek when the slider is changed
  };

  return (
    <div>
      <input
        type="range"
        value={progress}
        min="0"
        max={duration}
        onChange={handleProgressChange}
      />
      <button onClick={onPlayPause}>{isPlaying ? "Pause" : "Play"}</button>
      <div>
        {Math.floor(progress)} / {Math.floor(duration)} seconds
      </div>
    </div>
  );
};

export default ProgressBar;
