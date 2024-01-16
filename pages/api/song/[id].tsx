import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

import { getSession } from "next-auth/react";
import { Session } from "next-auth";
import { UpdateSong } from "@/components/song/types";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const session = await getSession({ req });
    console.log("$$$$$$$$$$$$")
    console.log("$$$$$$$$$$$$")
    console.log("Session:", session);
    console.log("$$$$$$$$$$$$")
    console.log("$$$$$$$$$$$$")
    if (session) {
      if (req.method === "GET") getSong(session, req, res);
      else if (req.method === "PUT") putSong(session, req, res);
      else if (req.method === "DELETE") deleteSong(session, req, res);
    } else {
      // Not Signed in
      res.status(401).json({
        error: { message: "not signed in", status: 404 },
      });
    }
  } catch (error) {
    res.status(500).json({ message: "unexpected  error" });
  }
}

async function validateSongBelongsToUser(
  session: Session,
  id: number,
  res: NextApiResponse,
) {
  const { user } = session;
  const email = user?.email as string;
  const dbUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true },
  });
  const userId = dbUser?.id as number;

  const song = await prisma.song.findUnique({
    where: { id },
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
    return false;
  }
  if (song?.userId !== userId) {
    res.status(401).json({
      error: { message: "cannot access other users data", status: 401 },
    });
    return false;
  }
  return song;
}

async function getSong(
  session: Session,
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query;
  const idNum = Number(id);

  const { user } = session;
  const email = user?.email as string;
  const dbUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true },
  });
  const userId = dbUser?.id as number;

  const song = await validateSongBelongsToUser(session, idNum, res);
  if (song) {
    res.status(200).json({ song });
  }
}

async function deleteSong(
  session: Session,
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query;
  const idNum = Number(id);

  if (await validateSongBelongsToUser(session, idNum, res)) {
    const deletedSong = await prisma.song.delete({
      where: { id: idNum },
    });
    res.status(200).json({ deletedSong });
  }
}

async function putSong(
  session: Session,
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id, name, artist } = req.body;
  if (id !== Number(req.query.id))
    res
      .status(500)
      .json({ message: "bad request, query id does not match payload" });

  const data: UpdateSong = { id, name, artist };
  if (await validateSongBelongsToUser(session, id, res)) {
    const updatedSong = await prisma.song.update({
      where: { id },
      data,
    });
    res.status(200).json({ updatedSong });
  }
}
