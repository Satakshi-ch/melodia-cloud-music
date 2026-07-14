import React, { createContext, useState, useEffect, useRef, useContext } from 'react';
import { Howl } from 'howler';
import API from '../services/api';
import { useAuth } from './AuthContext';

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const { user, refreshUser } = useAuth();
  
  const [queue, setQueue] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(-1);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [progress, setProgress] = useState(0); // in seconds
  const [duration, setDuration] = useState(0); // in seconds
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState('none'); // 'none' | 'all' | 'one'
  
  const soundRef = useRef(null);
  const progressIntervalRef = useRef(null);
  
  // Track queue index details
  const queueRef = useRef([]);
  const indexRef = useRef(-1);

  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);

  useEffect(() => {
    indexRef.current = currentTrackIndex;
    setCurrentTrack(queue[currentTrackIndex] || null);
  }, [currentTrackIndex, queue]);

  // Clean up sound on unmount
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
      clearInterval(progressIntervalRef.current);
    };
  }, []);

  // Update progress helper
  const startProgressInterval = () => {
    clearInterval(progressIntervalRef.current);
    progressIntervalRef.current = setInterval(() => {
      if (soundRef.current && soundRef.current.playing()) {
        const seek = soundRef.current.seek();
        setProgress(typeof seek === 'number' ? seek : 0);
      }
    }, 250);
  };

  // Log track play history to backend
  const logTrackPlay = async (trackId) => {
    if (!user) return;
    try {
      await API.post(`/songs/play/${trackId}`);
      refreshUser(); // Updates history in user profile context
    } catch (err) {
      console.error('Failed to log play history:', err);
    }
  };

  // Play a specific track and set the queue context
  const playTrack = (track, trackList = []) => {
    if (!track) return;

    // Build queue: If trackList is provided and contains the track, set it. Otherwise, set queue to single track
    let newQueue = trackList.length > 0 ? [...trackList] : [track];
    
    // Find index of the track in the list
    let idx = newQueue.findIndex((t) => t._id === track._id);
    if (idx === -1) {
      newQueue = [track, ...newQueue];
      idx = 0;
    }

    setQueue(newQueue);
    setCurrentTrackIndex(idx);
    startAudio(track, idx, newQueue);
  };

  // Helper to construct Howl instance and begin play
  const startAudio = (track, index, activeQueue) => {
    // Unload previous audio
    if (soundRef.current) {
      soundRef.current.unload();
    }
    clearInterval(progressIntervalRef.current);
    setProgress(0);
    setIsPlaying(false);

    const sound = new Howl({
      src: [track.audioUrl],
      html5: true, // Enable HTML5 Audio to support streaming files and large MP3s
      volume: volume,
      onplay: () => {
        setIsPlaying(true);
        setDuration(sound.duration());
        startProgressInterval();
        logTrackPlay(track._id);
      },
      onpause: () => {
        setIsPlaying(false);
      },
      onstop: () => {
        setIsPlaying(false);
        setProgress(0);
      },
      onend: () => {
        setIsPlaying(false);
        setProgress(0);
        handleTrackEnd();
      },
      onloaderror: (id, err) => {
        console.error('Error loading audio track:', err);
        setIsPlaying(false);
      },
      onplayerror: (id, err) => {
        console.error('Error playing audio track:', err);
        sound.once('unlock', () => {
          sound.play();
        });
      }
    });

    soundRef.current = sound;
    sound.play();
  };

  // Toggle play/pause
  const togglePlay = () => {
    if (!soundRef.current) {
      // If there's a queue, start playing the first song
      if (queue.length > 0) {
        playTrack(queue[0], queue);
      }
      return;
    }

    if (soundRef.current.playing()) {
      soundRef.current.pause();
      setIsPlaying(false);
    } else {
      soundRef.current.play();
      setIsPlaying(true);
      startProgressInterval();
    }
  };

  // Next Track logic
  const nextTrack = () => {
    const q = queueRef.current;
    const idx = indexRef.current;
    
    if (q.length === 0) return;

    let nextIdx = -1;

    if (repeatMode === 'one') {
      nextIdx = idx;
    } else if (isShuffle) {
      // Get random index that is not the current one, unless queue size is 1
      if (q.length === 1) {
        nextIdx = 0;
      } else {
        do {
          nextIdx = Math.floor(Math.random() * q.length);
        } while (nextIdx === idx);
      }
    } else {
      nextIdx = idx + 1;
      if (nextIdx >= q.length) {
        nextIdx = repeatMode === 'all' ? 0 : -1;
      }
    }

    if (nextIdx !== -1) {
      setCurrentTrackIndex(nextIdx);
      startAudio(q[nextIdx], nextIdx, q);
    } else {
      // No more songs to play, stop and reset index
      if (soundRef.current) {
        soundRef.current.stop();
      }
      setCurrentTrackIndex(-1);
      setProgress(0);
    }
  };

  // Previous Track logic
  const prevTrack = () => {
    const q = queueRef.current;
    const idx = indexRef.current;

    if (q.length === 0) return;

    // If more than 3 seconds has passed, restart the current song
    if (soundRef.current && soundRef.current.seek() > 3) {
      soundRef.current.seek(0);
      setProgress(0);
      return;
    }

    let prevIdx = -1;

    if (repeatMode === 'one') {
      prevIdx = idx;
    } else if (isShuffle) {
      if (q.length === 1) {
        prevIdx = 0;
      } else {
        do {
          prevIdx = Math.floor(Math.random() * q.length);
        } while (prevIdx === idx);
      }
    } else {
      prevIdx = idx - 1;
      if (prevIdx < 0) {
        prevIdx = repeatMode === 'all' ? q.length - 1 : 0;
      }
    }

    if (prevIdx !== -1) {
      setCurrentTrackIndex(prevIdx);
      startAudio(q[prevIdx], prevIdx, q);
    }
  };

  // End of track callback
  const handleTrackEnd = () => {
    nextTrack();
  };

  // Seek position update
  const seekTo = (seconds) => {
    if (soundRef.current) {
      soundRef.current.seek(seconds);
      setProgress(seconds);
    }
  };

  // Volume control
  const changeVolume = (val) => {
    const numericVal = parseFloat(val);
    setVolume(numericVal);
    if (soundRef.current) {
      soundRef.current.volume(numericVal);
    }
    if (numericVal > 0) {
      setIsMuted(false);
    }
  };

  // Mute control
  const toggleMute = () => {
    if (isMuted) {
      if (soundRef.current) {
        soundRef.current.volume(volume);
      }
      setIsMuted(false);
    } else {
      if (soundRef.current) {
        soundRef.current.volume(0);
      }
      setIsMuted(true);
    }
  };

  // Add a song to the queue
  const addToQueue = (track) => {
    if (queue.some(t => t._id === track._id)) return; // Avoid duplicates in quick queue
    setQueue([...queue, track]);
    if (currentTrackIndex === -1) {
      setCurrentTrackIndex(0);
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        queue,
        setQueue,
        currentTrack,
        isPlaying,
        volume,
        progress,
        duration,
        isMuted,
        isShuffle,
        repeatMode,
        playTrack,
        togglePlay,
        nextTrack,
        prevTrack,
        seekTo,
        changeVolume,
        toggleMute,
        addToQueue,
        setIsShuffle,
        setRepeatMode,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
