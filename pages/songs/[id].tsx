import SongCard from "@/components/song/songCard";
import AddNewPlayer from "@/components/song/addNewPlayer";
import Layout from "@/components/layout";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import useSWR, { mutate } from "swr";
import ErrorPage from "next/error";
import Loading from "@/components/loading";
import Audio from "@/components/song/audio";
import { SongWithSections } from "@/components/song/types";
import {
  CreateSection,
  UpdateSection,
  UpdateSong,
} from "@/components/song/types";
import { Section } from "@prisma/client";
import SongHeader from "@/components/song/header";

const fetcher = ([baseUrl, id]: string[]) => {
  if (id) {
    return fetch(`${baseUrl}${id}`).then((res) => res.json());
  }
};

function createAudioElement() {
  const audio = document.createElement("audio");
  return audio;
}

async function updateSection(payload: UpdateSection) {
  const response = await fetch(`/api/section/${payload.id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  const { status } = response;
  return { data, status };
}

async function updateSong(payload: UpdateSong) {
  const response = await fetch(`/api/song/${payload.id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  const { status } = response;
  return { data, status };
}

async function createSection(payload: CreateSection) {
  const response = await fetch("/api/sections", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  const { status } = response;
  return { data, status };
}

async function deleteSection(id: number) {
  const response = await fetch(`/api/section/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
}

async function _deleteSong(id: number) {
  const response = await fetch(`/api/song/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
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
  if (data && data.song) {
    song = data.song;
  } else {
    song = {} as SongWithSections;
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  async function addNewPlayer() {
    const nextSectionNum = song.sections.length + 1;
    const label = `Section ${nextSectionNum}`;
    const start = 0;
    const end = song.duration;
    const speed = 1;
    const songId = Number(id);
    const loop = true;
    const payload = { label, start, end, speed, songId, loop };
    const { data, status } = await createSection(payload);
    if (status === 201) {
      mutate(
        ["/api/song/", id],
        (cachedData: any) => {
          cachedData.song.sections.push(data);
          return cachedData;
        },
        true,
      );
    }
  }

  async function deletePlayer(sectionId: number) {
    const response = await deleteSection(sectionId);

    if (response.ok) {
      mutate(
        ["/api/song/", id],
        async (cachedData: any) => {
          cachedData.song.sections = cachedData.song.sections.filter(
            (section: Section) => section.id !== sectionId,
          );
          return cachedData;
        },
        true,
      );
    }
  }

  async function savePlayer(payload: UpdateSection) {
    updateSection(payload);
  }

  async function deleteSong(id: number) {
    const response = await _deleteSong(id);
    push("/");
  }

  async function saveSong(id: number, name: string, artist: string) {
    updateSong({ id, name, artist });
  }

  return (
    <Layout>
      <div className="my-10 grid w-full max-w-screen-xl animate-[slide-down-fade_0.5s_ease-in-out] grid-cols-1 gap-5 px-5 md:grid-cols-2 xl:px-0">
        <SongCard
          large={true}
          demo={
            <SongHeader
              song={song}
              deleteSong={deleteSong}
              saveSong={saveSong}
            />
          }
        />
        {song && song.sections
          ? song.sections.map((section) => (
              <SongCard
                key={section.id}
                demo={
                  <Audio
                    song={song}
                    section={section}
                    audio={createAudioElement()}
                    savePlayer={savePlayer}
                    deletePlayer={deletePlayer}
                  />
                }
              />
            ))
          : null}
        <SongCard demo={<AddNewPlayer addNewPlayer={addNewPlayer} />} />
      </div>
    </Layout>
  );
}
