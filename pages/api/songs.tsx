import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

import { getSession } from "next-auth/react";
import { Session } from "next-auth";
import { CreateSong } from "@/components/song/types";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const session = await getSession({ req });
    if (true) {
      if (req.method === "GET") getSongs(session, res);
      //else if (req.method === "POST") postSong(session, req, res);
      else res.status(405).json({ message: "Method not allowed" });
    } else {
      // Not Signed in
      res.status(401).send("not signed in");
    }
  } catch (error) {
    res.status(500).json({ message: "unexpected  error" });
  }
}

async function getSongs(session: Session | null, res: NextApiResponse) {
  //const { user } = session;
  //const email = user?.email as str;
  const email = "robert.david.west@gmail.com"
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
}

async function postSong(
  session: Session,
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { name, audioUrl, artist, duration, userId } = req.body;
  const data: CreateSong = { name, audioUrl, artist, duration, userId };
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });
  if (!user) {
    res.status(400).json({ message: `userId: ${userId} doesnt exist` });
  } else if (session.user && session.user.email !== user.email) {
    res
      .status(401)
      .json({ message: "Cannot create song on anoter user account" });
  } else {
    console.log(data);
    const newSong = await prisma.song.create({
      data,
    });
    res.status(201).json(newSong);
  }
}
