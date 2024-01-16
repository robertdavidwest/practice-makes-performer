import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

import { authOptions } from 'pages/api/auth/[...nextauth]'
import { getServerSession } from "next-auth";
import { Session } from "next-auth";
import { UpdateSection } from "@/components/song/types";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const session = await getServerSession(req, res, authOptions)
    if (session) {
      if (req.method === "DELETE") deleteSection(session, req, res);
      else if (req.method === "PUT") putSection(session, req, res);
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

async function validateSectionBelongsToUser(
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

  const section = await prisma.section.findUnique({
    where: { id },
    select: {
      song: { select: { userId: true } },
    },
  });
  if (!section) {
    res.status(404).json({ message: "section does not exist" });
    return false;
  } else if (section.song && section.song.userId !== userId) {
    res.status(401).json({
      error: { message: "Not authorized", status: 401 },
    });
    return false;
  }
  return true;
}

async function deleteSection(
  session: Session,
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query;
  const idNum = Number(id);

  if (await validateSectionBelongsToUser(session, idNum, res)) {
    const deletedSection = await prisma.section.delete({
      where: { id: idNum },
    });
    res.status(200).json({ deletedSection });
  }
}

async function putSection(
  session: Session,
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id, label, start, end, speed, loop, showMeasures } = req.body;
  if (id !== Number(req.query.id))
    res
      .status(500)
      .json({ message: "bad request, query id does not match payload" });

  const data: UpdateSection = {
    id,
    label,
    start,
    end,
    speed,
    loop,
    showMeasures,
  };
  if (await validateSectionBelongsToUser(session, id, res)) {
    const updatedSection = await prisma.section.update({
      where: { id },
      data,
    });
    res.status(200).json({ updatedSection });
  }
}
