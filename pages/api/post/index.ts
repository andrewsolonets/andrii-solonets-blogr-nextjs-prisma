import { getSession } from "next-auth/react";
import prisma from "../../../lib/prisma";
import { NextApiRequest } from "next";
import { NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { title, content } = req.body;

  const session = await getSession({ req });
  const result = await prisma.post.create({
    data: {
      title,
      content,
      author: { connect: { email: session?.user?.email } },
    },
  });
  res.json(result);
}
