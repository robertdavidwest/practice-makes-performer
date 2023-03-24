import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

import { useSession, signIn, getSession } from "next-auth/react";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getSession({ req });
  if (session) {
    const { user } = session;
    const email = user?.email as string;
    const dbUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true },
    });
    const userId = dbUser?.id as number;
    const songs = await prisma.song.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        audioUrl: true,
        artist: true,
        duration: true,
        createdAt: true,
      },
    });
    res.status(200).json({ songs });
  } else {
    // Not Signed in
    res.status(401).send("not signed in");
  }
}