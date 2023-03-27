import {
  useState,
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
} from "react";

import { Song, Section } from "@prisma/client";

export interface PlayerType {
  sectionId: number;
  label: string;
  start: number;
  setStart: Dispatch<SetStateAction<number>>;
  end: number;
  setEnd: Dispatch<SetStateAction<number>>;
  duration: number;
  currentTime: number;
  restart: () => void;
  loadPlayPause: () => void;
  isPlaying: boolean;
  loop: boolean;
  toggleLoop: () => void;
  setPlayback: (value: number) => void;
  speed: number;
  setAudioPlaybackRate: (value: number) => void;
  deletePlayer: (sectionId: number) => void;
  savePlayer: (payload: UpdateSection) => void;
  loading: boolean;
}

export interface AudioType {
  song: Song;
  section: Section;
  audio: HTMLAudioElement;
  savePlayer: (payload: UpdateSection) => void;
  deletePlayer: (sectionId: number) => void;
  loading: boolean;
}

export type CreateSection = Omit<Section, "id" | "createdAt" | "updatedAt">;
export type UpdateSection = Omit<Section, "songId" | "createdAt" | "updatedAt">;

export type UpdateSong = Pick<Song, "id" | "name" | "artist">;

export interface SongWithSections extends Song {
  sections: Section[];
}
