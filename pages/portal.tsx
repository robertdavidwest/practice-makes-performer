import PortalCard from "@/components/portal/portalCard";
import Card from "@/components/home/card";
import Layout from "@/components/layout";
import Loading from "@/components/loading";
import { motion } from "framer-motion";
import { FADE_DOWN_ANIMATION_VARIANTS } from "@/lib/constants";
import ComponentGrid from "@/components/home/component-grid";

import EnhancedTable from "@/components/portal/songsTable";
import { Container } from "@mui/material";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { User, Song } from "@prisma/client";
import { CreateSong } from "@/components/song/types";
import useSWR, { mutate } from "swr";

const fetcher = (key: string) => fetch(key).then((res) => res.json());

export default function Portal() {
  const { data: session, status } = useSession();
  const { push } = useRouter();
  const { data } = useSWR("/api/songs", fetcher);

  let user = {} as User;
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
  } else {
    user = session.user as User;
  }
  let songs: Song[] = [];
  if (data && data.songs) {
    songs = data.songs;
  }

  async function appendToSongs(song: CreateSong) {
    mutate(
      "/api/songs",
      (cachedData: any) => {
        cachedData.songs.push(song);
        return cachedData;
      },
      true,
    );
  }

  return (
    <Layout>
      <motion.div
        className="max-w-xl px-5 xl:px-0"
        initial="hidden"
        whileInView="show"
        animate="show"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.15,
            },
          },
        }}
      >
        <motion.h1
          className="bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent drop-shadow-sm md:text-7xl md:leading-[5rem]"
          variants={FADE_DOWN_ANIMATION_VARIANTS}
        >
          {`Welcome ${user.name}`}
        </motion.h1>
      </motion.div>
      {/* here we are animating with Tailwind instead of Framer Motion because Framer Motion messes up the z-index for child components */}
      <div className="my-10 w-full max-w-screen-xl animate-[slide-down-fade_0.5s_ease-in-out] grid-cols-1 gap-5 px-5 md:grid-cols-3 xl:px-0">
        <PortalCard
          key={features[0].title}
          title={features[0].title}
          description={features[0].description}
          appendToSongs={appendToSongs}
          demo={
            <Container>
              <EnhancedTable songs={songs} />{" "}
            </Container>
          }
          large={true}
        />
        {features.slice(1).map(({ title, description, large }) => (
          <Card
            key={title}
            title={title}
            description={description}
            demo={<ComponentGrid />}
            large={large}
          />
        ))}
      </div>
    </Layout>
  );
}
const features = [
  {
    title: "Your Song Library",
    description: "Select one of your songs below to begin practicing",
    large: true,
  },
];
