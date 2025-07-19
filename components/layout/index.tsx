import { FADE_IN_ANIMATION_SETTINGS } from "@/lib/constants";
import { AnimatePresence, motion } from "framer-motion";
import { useSession, signIn } from "next-auth/react";
import Image from "next/image";
import { ReactNode } from "react";
import useScroll from "@/lib/hooks/use-scroll";
import Meta from "./meta";
import UserDropdown from "./user-dropdown";
import { useRouter } from "next/router";

import GitHubIcon from "@mui/icons-material/GitHub";

export default function Layout({
  meta,
  children,
}: {
  meta?: {
    title?: string;
    description?: string;
    image?: string;
  };
  children: ReactNode;
}) {
  const { data: session, status } = useSession();
  const scrolled = useScroll(5);
  const router = useRouter();
  return (
    <>
      <Meta {...meta} />
      <div className="fixed h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-cyan-100" />
      <div
        className={`fixed top-0 w-full ${
          scrolled
            ? "border-b border-gray-200 bg-white/50 backdrop-blur-xl"
            : "bg-white/0"
        } z-30 transition-all`}
      >
        <div className="mx-5 flex h-16 max-w-screen-xl items-center justify-between xl:mx-auto">
          <button
            className="flex items-center font-display text-2xl"
            onClick={() => {
              router.push("/");
            }}
          >
            <Image
              src="/logo.png"
              alt="PracticeMakesPerformer logo"
              width="30"
              height="30"
              className="mr-2 rounded-sm"
            ></Image>
            <p>Practice. Makes. Performer</p>
          </button>
          <div>
            <AnimatePresence>
              {!session && status !== "loading" ? (
                <motion.button
                  className="rounded-full border border-black bg-black p-1.5 px-4 text-sm text-white transition-all hover:bg-white hover:text-black"
                  onClick={() => signIn("auth0")}
                  {...FADE_IN_ANIMATION_SETTINGS}
                >
                  Sign In / Sign Up
                </motion.button>
              ) : (
                <UserDropdown />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <main className="main flex w-full flex-col items-center justify-center py-32">
        {children}
      </main>
      <div className="footer absolute w-full border-t border-gray-200 bg-white py-5 text-center">
        <a
          href="https://github.com/robertdavidwest/practice-makes-performer"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GitHubIcon />
        </a>
        <p className="text-gray-500">
          Practice Makes Performer. By{" "}
          <a
            className="font-medium text-gray-800 underline transition-colors"
            href="https://robertdavidwest.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Robert West
          </a>
        </p>
      </div>
    </>
  );
}
