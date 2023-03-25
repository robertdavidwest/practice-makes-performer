import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

import { getSession } from "next-auth/react";
import { Session } from "next-auth";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getSession({ req });
  if (session) {
    if (req.method === "DELETE") deleteSection(session, req, res);
    else if (req.method === "PUT") putSection(session, req, res);
  } else {
    // Not Signed in
    res.status(401).json({
      error: { message: "not signed in", status: 404 },
    });
  }
}

async function deleteSection(
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

  const section = await prisma.section.findUnique({
    where: { id: idNum },
    select: {
      song: { select: { userId: true } },
    },
  });
  if (!section) {
    res.status(404).json({ message: "section does not exist" });
  } else if (section.song && section.song.userId !== userId) {
    res.status(401).json({
      error: { message: "cannot delete other users data", status: 401 },
    });
  }
  const del = await prisma.section.delete({
    where: { id: idNum },
  });
  res.status(200).json({ del });
}

async function putSection(
  session: Session,
  req: NextApiRequest,
  res: NextApiResponse,
) {}
