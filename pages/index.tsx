import React from "react";
import prisma from "../lib/prisma";
import { GetStaticProps } from "next";
import Layout from "../components/Layout";

import Post, { PostProps } from "../components/Post";

export const getStaticProps: GetStaticProps = async () => {
  const feed = await prisma.post.findMany({
    where: { published: true },
    include: {
      author: { select: { name: true } },
    },
  });
  return {
    props: { feed },
    revalidate: 10,
  };
};

type Props = {
  feed: PostProps[];
};

const Blog: React.FC<Props> = (props) => {
  return (
    <Layout>
      <div className="">
        <h1 className="text-3xl font-bold">Public Feed</h1>
        <main>
          {props.feed.map((post) => (
            <div
              key={post.id}
              className="bg-white transition-shadow hover:shadow-lg mt-8"
            >
              <Post post={post} />
            </div>
          ))}
        </main>
      </div>
    </Layout>
  );
};

export default Blog;
