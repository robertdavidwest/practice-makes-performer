import * as React from "react";
import Layout from "@/components/layout";
import Audio from "@/components/song/audio";
import SongHeader from "@/components/song/header";
import { sampleSong } from "sampleData/song";
import dynamic from "next/dynamic";

// ensure this is only run client side
// or the audio el creation in <Audio /> will break the app
const SongCard = dynamic(() => import("@/components/song/songCard"), {
  ssr: false,
});

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
                demo={<Audio song={song} section={section} />}
              />
            ))
          : null}
      </div>
    </Layout>
  );
}
