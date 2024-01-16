import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { CreateSection } from "@/components/song/types";

import { authOptions } from 'pages/api/auth/[...nextauth]'
import { getServerSession } from "next-auth";
import { Session } from "next-auth";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authOptions)
  try {
    if (session) {
      if (req.method === "POST") postSection(session, req, res);
      else res.status(405).json({ message: "Method not allowed" });
    } else {
      // Not Signed in
      res.status(401).send("not signed in");
    }
  } catch (error) {
    res.status(500).json({ message: "unexpected  error" });
  }
}

async function postSection(
  session: Session,
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { label, start, end, speed, loop, songId, showMeasures } = req.body;
  const data: CreateSection = {
    label,
    start,
    end,
    speed,
    loop,
    songId,
    showMeasures,
  };
  const song = await prisma.song.findUnique({
    where: { id: songId },
    select: { user: { select: { email: true } } },
  });
  if (!song) {
    res.status(400).json({ message: `songId: ${songId} doesnt exist` });
  } else if (session.user && session.user.email !== song.user.email) {
    res
      .status(401)
      .json({ message: "Cannot create section on anoter user song" });
  } else {
    const newSection = await prisma.section.create({
      data,
    });
    res.status(201).json(newSection);
  }
}
