import { Song, Section } from "@prisma/client";

export interface PlayerType {
  sectionId: number;
  label: string;
  start: number;
  setStart: any;
  end: number;
  setEnd: any;
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
}

export interface AudioType {
  song: Song;
  section: Section;
  audio: HTMLAudioElement;
  savePlayer: (payload: UpdateSection) => void;
  deletePlayer: (sectionId: number) => void;
}

export type CreateSection = Omit<Section, "id" | "createdAt" | "updatedAt">;
export type UpdateSection = Omit<Section, "songId" | "createdAt" | "updatedAt">;

export interface SongWithSections extends Song {
  sections: Section[];
}
