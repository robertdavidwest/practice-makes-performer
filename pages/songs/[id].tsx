import SongCard from "@/components/song/songCard";
import ComponentGrid from "@/components/home/component-grid";
import Layout from "@/components/layout";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import ErrorPage from "next/error";
import Loading from "@/components/loading";
import Audio from "@/components/song/audio";
import { Section, Song as SongType } from "@prisma/client";

interface SongWithSections extends SongType {
  sections: Section[];
}

const fetcher = ([baseUrl, id]: string[]) => {
  if (id) {
    return fetch(`${baseUrl}${id}`).then((res) => res.json());
  }
};

function createAudioElement() {
  const audio = document.createElement("audio");
  return audio;
}

async function deletePlayer(sectionId: number, inMemoryId: number) {
  sectionId = Number(sectionId);
  inMemoryId = Number(inMemoryId);
  console.log("NEED TO DEELETE THIS ID: ", sectionId);
  // if (sectionId) await dispatch(deleteSectionAsync(sectionId));
  // dispatch(deleteSection(inMemoryId));
}

export default function Song() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { push } = router;
  const { id } = router.query;
  const { data } = useSWR(["/api/song/", id], fetcher);
  if (!session) {
    if (status === "unauthenticated") {
      push("/");
      return (
        <Layout>
          <Loading />
        </Layout>
      );
    } else if (status === "loading")
      return (
        <Layout>
          <Loading />
        </Layout>
      );
  }
  if (data && data.error) {
    const errStatus = data.error.status as number;
    return <ErrorPage statusCode={errStatus} />;
  }

  let song: SongWithSections;
  let section: Section;
  if (data && data.song) {
    song = data.song;
    section = song.sections[0];
  } else {
    song = {} as SongWithSections;
    section = {} as Section;
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="my-10 grid w-full max-w-screen-xl animate-[slide-down-fade_0.5s_ease-in-out] grid-cols-1 gap-5 px-5 md:grid-cols-2 xl:px-0">
        {song && song.sections
          ? song.sections.map((section) => (
              <SongCard
                key={section.id}
                demo={
                  <Audio
                    song={song}
                    section={section}
                    audio={createAudioElement()}
                    deletePlayer={deletePlayer}
                  />
                }
              />
            ))
          : null}
      </div>
    </Layout>
  );
}
