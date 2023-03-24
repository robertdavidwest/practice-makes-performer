import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

import { getSession } from "next-auth/react";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getSession({ req });
  if (session) {
    const { id } = req.query;
    const idNum = Number(id);

    const { user } = session;
    const email = user?.email as string;
    const dbUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true },
    });
    const userId = dbUser?.id as number;

    const song = await prisma.song.findUnique({
      where: { id: idNum },
      select: {
        id: true,
        name: true,
        audioUrl: true,
        artist: true,
        duration: true,
        createdAt: true,
        sections: true,
        userId: true,
      },
    });
    if (song?.userId !== userId) {
      res.status(404).send("cannot access other users data");
    }
    res.status(200).json({ song });
  } else {
    // Not Signed in
    res.status(401).send("not signed in");
  }
}
