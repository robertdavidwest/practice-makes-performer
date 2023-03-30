import Card from "@/components/home/card";
import PortalCard from "@/components/portal/portalCard";
import Layout from "@/components/layout";
import Balancer from "react-wrap-balancer";
import { motion } from "framer-motion";
import { FADE_DOWN_ANIMATION_VARIANTS } from "@/lib/constants";
import Image from "next/image";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { Container } from "@mui/material";
import EnhancedTable from "@/components/portal/songsTable";
import { sampleSongs } from "sampleData/song";
import Link from "next/link";
import { signIn } from "next-auth/react";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (session) {
    return {
      redirect: { destination: "/portal", permanent: true },
    };
  }
  return { props: {} };
};

export default function Home() {
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
          <Balancer>Practice. Makes. Performer.</Balancer>
        </motion.h1>
        <motion.p
          className="mt-6 text-center text-gray-500 md:text-xl"
          variants={FADE_DOWN_ANIMATION_VARIANTS}
        >
          <Balancer>
            Designed to help musicians of all kinds improve their skills by
            customizing the playback of any song... and saving the state.
          </Balancer>
        </motion.p>
        <motion.div
          className="mx-auto mt-6 flex items-center justify-center space-x-5"
          variants={FADE_DOWN_ANIMATION_VARIANTS}
        >
          <Link
            className="group flex max-w-fit items-center justify-center space-x-2 rounded-full border border-black bg-black px-5 py-2 text-sm text-white transition-colors hover:bg-white hover:text-black"
            href="/demoSongs/0"
          >
            <p>Try it out!</p>
          </Link>
          <div
            className="group flex max-w-fit cursor-pointer items-center justify-center space-x-2 rounded-full border border-black bg-purple-700 px-5 py-2 text-sm text-white transition-colors hover:bg-white hover:text-black"
            onClick={() => signIn("auth0")}
          >
            <p>Create An Account</p>
          </div>
        </motion.div>
      </motion.div>
      {/* here we are animating with Tailwind instead of Framer Motion because Framer Motion messes up the z-index for child components */}
      <div className="my-10 grid w-full max-w-screen-xl animate-[slide-down-fade_0.5s_ease-in-out] grid-cols-1 gap-5 px-5 md:grid-cols-3 xl:px-0">
        {features.map(({ title, description, demo, large }) =>
          title === "Sample Song Library" ? (
            <PortalCard
              key={title}
              title={title}
              description={description}
              demo={
                <Container>
                  <EnhancedTable demo={true} songs={sampleSongs} />{" "}
                </Container>
              }
              large={true}
            />
          ) : (
            <Card
              key={title}
              title={title}
              description={description}
              demo={demo}
              large={large}
            />
          ),
        )}
      </div>
    </Layout>
  );
}
const features = [
  {
    title: "Sample Song Library",
    description: "Select one of your songs below to begin practicing",
    large: true,
  },
  {
    title: "Integrated with GoogleDrive",
    description:
      "Own your own data. Store your files on GoogleDrive and link them to your account",
    demo: (
      <div className="flex items-center justify-center space-x-20">
        <Image
          width={150}
          height={150}
          src={"/GoogleDrive_2020.svg"}
          alt="GoogleDrive logo"
        />
      </div>
    ),
  },
];
