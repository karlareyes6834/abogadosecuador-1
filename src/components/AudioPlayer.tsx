import React, { useState, useRef, useEffect } from 'react';
import { PlayIcon, PauseIcon } from './icons/InterfaceIcons';

interface AudioPlayerProps {
  src: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(src);
    audioRef.current = audio;
    
    const updateProgress = () => {
      if (audio.duration > 0) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };
    
    const onEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    const onLoadedMetadata = () => {
        if(audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    }

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.pause();
    };
  }, [src]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds) || timeInSeconds === 0) return '0:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="flex items-center gap-2 w-48">
      <button onClick={togglePlay} className="p-1 rounded-full bg-purple-500/80 text-white flex-shrink-0">
        {isPlaying ? <PauseIcon className="h-5 w-5" /> : <PlayIcon className="h-5 w-5" />}
      </button>
      <div className="flex-grow bg-purple-400/50 h-1 rounded-full">
        <div className="bg-white h-1 rounded-full" style={{ width: `${progress}%` }}></div>
      </div>
      <span className="text-xs text-purple-200 font-mono w-10 text-right">{formatTime(duration)}</span>
    </div>
  );
};

export default AudioPlayer;
