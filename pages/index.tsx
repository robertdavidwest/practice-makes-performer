import Card from "@/components/home/card";
import PortalCard from "@/components/portal/portalCard";
import Layout from "@/components/layout";
import Balancer from "react-wrap-balancer";
import { motion } from "framer-motion";
import { DEPLOY_URL, FADE_DOWN_ANIMATION_VARIANTS } from "@/lib/constants";
import { Twitter } from "@/components/shared/icons";
import WebVitals from "@/components/home/web-vitals";
import ComponentGrid from "@/components/home/component-grid";
import Image from "next/image";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { Container } from "@mui/material";
import EnhancedTable from "@/components/portal/songsTable";
import { sampleSongs } from "sampleData/song";
import Link from "next/link";
import { IconButton, Tooltip } from "@mui/material";
import { useSession, signIn } from "next-auth/react";

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
        <motion.a
          variants={FADE_DOWN_ANIMATION_VARIANTS}
          // href="https://twitter.com/steventey/status/1613928948915920896"
          href="https://twitter.com/robertdavidwest"
          target="_blank"
          rel="noreferrer"
          className="max-w-it mx-auto mb-5 flex items-center justify-center space-x-2 overflow-hidden rounded-full bg-blue-100 px-7 py-2 transition-colors hover:bg-blue-200"
        >
          <Twitter className="h-5 w-5 text-[#1d9bf0]" />
          <p className="text-sm font-semibold text-[#1d9bf0]">
            Introducing PracticeMakesPerformer
          </p>
        </motion.a>
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
            An online tool that lets you... slow down songs, select a
            subsection, loop the playback AND save the state of multiple
            subsections... So you can <strong>quickly</strong> and{" "}
            <strong>easily</strong> pick up where you left off the next time you
            are playing.
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
          <Tooltip title="With an account you can save your settings, come back and practice anytime">
            <IconButton
              className="group flex max-w-fit items-center justify-center space-x-2 rounded-full border border-black bg-purple-700 px-5 py-2 text-sm text-white transition-colors hover:bg-white hover:text-black"
              onClick={() => signIn("auth0")}
            >
              <p>Create An Account</p>
            </IconButton>
          </Tooltip>
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
              demo={
                title === "Beautiful, reusable components" ? (
                  <ComponentGrid />
                ) : (
                  demo
                )
              }
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
