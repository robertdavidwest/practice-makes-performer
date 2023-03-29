import React, { useRef, useState, useEffect } from "react";
import Player from "./player";
import { AudioType } from "./types";

const Audio = ({ song, section, savePlayer, deletePlayer }: AudioType) => {
  const audio = useRef(document.createElement("audio"));
  const [loaded, setLoaded] = useState(false);
  const [duration, setDuration] = useState(0);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loop, setLoop] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [loading, setLoading] = useState(false);
  const addSrc = React.useCallback(() => {
    let src = song.audioUrl;
    let _start;
    if (!start) _start = 0;
    else _start = start;
    src += `#t=${_start}`;
    if (end) {
      src += `,${end}`;
    }
    audio.current.src = src;
  }, [audio, end, song.audioUrl, start]);

  const play = React.useCallback(async () => {
    await audio.current.play();
    setIsPlaying(true);
  }, [audio]);

  function pause() {
    audio.current.pause();
    setIsPlaying(false);
  }

  const setAudioPlaybackRate = React.useCallback(
    (value: number) => {
      audio.current.playbackRate = value;
      setSpeed(value);
    },
    [audio],
  );

  const load = React.useCallback(async () => {
    setLoading(true);
    addSrc();
    audio.current.load();
    setLoaded(true);
    audio.current.onloadedmetadata = function () {
      const orig = Math.round(audio.current.duration);
      setDuration(orig);
      setLoading(false);
    };
    setAudioPlaybackRate(speed);
  }, [audio, addSrc, speed, setAudioPlaybackRate]);

  async function startSong() {
    pause();
    load();
    await play();
  }

  async function loadPlayPause() {
    if (loaded) {
      await playPauseToggle();
    } else {
      await startSong();
    }
  }

  async function playPauseToggle() {
    if (isPlaying) pause();
    else await play();
  }

  const toggleLoop = () => {
    setLoop(!loop);
  };

  const setPlayback = (value: number) => {
    audio.current.currentTime = value;
  };

  audio.current.addEventListener(
    "timeupdate",
    () => setCurrentTime(audio.current.currentTime),
    false,
  );

  // useEffect(() => {
  //   const wasPlaying = isPlaying;
  //   load();
  //   if (wasPlaying) play();
  // }, [start, end, isPlaying, load, play]);

  useEffect(() => {
    if (end !== 0 && audio.current.currentTime >= end) {
      setIsPlaying(false);
      load();
      if (loop) play();
    }
  }, [audio.current.currentTime, audio.current.paused, end, load, loop, play]);

  useEffect(() => {
    if (song.duration) setDuration(song.duration);
    setStart(section.start);
    setEnd(section.end);
    setLoop(section.loop);
    setAudioPlaybackRate(section.speed);
  }, [song, section, setAudioPlaybackRate]);

  const sectionId = section.id;
  const label = section.label;

  return (
    <Player
      sectionId={sectionId}
      label={label}
      restart={startSong}
      start={start}
      setStart={setStart}
      end={end}
      setEnd={setEnd}
      duration={duration}
      currentTime={currentTime}
      loadPlayPause={loadPlayPause}
      loop={loop}
      toggleLoop={toggleLoop}
      isPlaying={isPlaying}
      setPlayback={setPlayback}
      speed={speed}
      setAudioPlaybackRate={setAudioPlaybackRate}
      savePlayer={savePlayer}
      deletePlayer={deletePlayer}
      loading={loading}
    />
  );
};

export default Audio;
