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
    if (!song) {
      res
        .status(404)
        .json({ error: { message: "This page does not exist", status: 404 } });
    }
    if (song?.userId !== userId) {
      res.status(401).json({
        error: { message: "cannot access other users data", status: 401 },
      });
    }
    console.log("song", song);
    res.status(200).json({ song });
  } else {
    // Not Signed in
    res.status(401).json({
      error: { message: "not signed in", status: 404 },
    });
  }
}
