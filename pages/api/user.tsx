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
    if (session) {
      if (req.method === "GET") getUserId(session, res);
      else res.status(405).json({ message: "Method not allowed" });
    } else {
      // Not Signed in
      res.status(401).send("not signed in");
    }
  } catch (error) {
    res.status(500).json({ message: "unexpected  error" });
  }
}

async function getUserId(session: Session, res: NextApiResponse) {
  const { user } = session;
  const email = user?.email as string;
  const dbUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true },
  });
  const userId = dbUser?.id as number;
  res.status(200).json({ userId });
}
