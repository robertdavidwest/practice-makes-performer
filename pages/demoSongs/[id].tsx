import * as React from "react";
import SongCard from "@/components/song/songCard";
import Layout from "@/components/layout";
import Audio from "@/components/song/audio";
import SongHeader from "@/components/song/header";
import { sampleSong } from "sampleData/song";

function createAudioElement() {
  const audio = document.createElement("audio");
  return audio;
}

export default function DemoSong() {
  const song = sampleSong;
  return (
    <Layout>
      <div className="my-10 grid w-full max-w-screen-xl animate-[slide-down-fade_0.5s_ease-in-out] grid-cols-1 gap-5 px-5 md:grid-cols-2 xl:px-0">
        <SongCard large={true} demo={<SongHeader song={song} />} />
        {song && song.sections
          ? song.sections.map((section) => (
              <SongCard
                key={section.id}
                demo={
                  <Audio
                    song={song}
                    section={section}
                    audio={createAudioElement()}
                  />
                }
              />
            ))
          : null}
      </div>
    </Layout>
  );
}
