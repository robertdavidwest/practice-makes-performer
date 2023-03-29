import { Song } from "@prisma/client";
import { SongWithSections } from "@/components/song/types";

export const sampleSongs: Song[] = [
  {
    id: 0,
    name: "Shine on your crazy diamond",
    artist: "Pink Floyd",
    duration: 788,
    userId: 0,
    audioUrl:
      "https://ia601904.us.archive.org/33/items/pink-floyd-shine-on-you-crazy-diamond/Pink%20Floyd%20-%20Shine%20On%20You%20Crazy%20Diamond.mp3",
    createdAt: new Date("2021-09-01T00:00:00.000Z"),
    updatedAt: new Date("2021-09-01T00:00:00.000Z"),
  },
];

export const sampleSong: SongWithSections = {
  id: 0,
  name: "Shine on your crazy diamond",
  artist: "Pink Floyd",
  duration: 788,
  userId: 0,
  audioUrl:
    "https://ia601904.us.archive.org/33/items/pink-floyd-shine-on-you-crazy-diamond/Pink%20Floyd%20-%20Shine%20On%20You%20Crazy%20Diamond.mp3",
  createdAt: new Date("2021-09-01T00:00:00.000Z"),
  updatedAt: new Date("2021-09-01T00:00:00.000Z"),
  sections: [
    {
      id: 1,
      songId: 0,
      label: "Guitar Intro",
      start: 103,
      end: 492,
      speed: 1.0,
      loop: true,
      createdAt: new Date("2021-09-01T00:00:00.000Z"),
      updatedAt: new Date("2021-09-01T00:00:00.000Z"),
      showMeasures: false,
    },
    {
      id: 2,
      songId: 0,
      label: "Sax Solo 1",
      start: 646,
      end: 696,
      speed: 0.7,
      loop: true,
      createdAt: new Date("2021-09-01T00:00:00.000Z"),
      updatedAt: new Date("2021-09-01T00:00:00.000Z"),
      showMeasures: false,
    },
  ],
};
