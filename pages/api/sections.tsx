import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { CreateSection } from "@/components/song/types";

import { getSession } from "next-auth/react";
import { Session } from "next-auth";
import { Section } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getSession({ req });
  if (session) {
    if (req.method === "POST") postSection(session, req, res);
    else res.status(405).json({ message: "Method not allowed" });
  } else {
    // Not Signed in
    res.status(401).send("not signed in");
  }
}

async function postSection(
  session: Session,
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { label, start, end, speed, loop, songId } = req.body;
    const data: CreateSection = { label, start, end, speed, loop, songId };
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
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating section" });
  }
}
