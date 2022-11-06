import React from "react";
import prisma from "../../lib/prisma";
import { GetServerSideProps } from "next";
import ReactMarkdown from "react-markdown";
import { useSession } from "next-auth/react";
import Layout from "../../components/Layout";
import { PostProps } from "../../components/Post";
import Router from "next/router";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const post = await prisma.post.findUnique({
    where: {
      id: String(params?.id),
    },
    include: {
      author: {
        select: { name: true, email: true },
      },
    },
  });
  return {
    props: post,
  };
};

async function publishPost(id: string): Promise<void> {
  await fetch(`/api/publish/${id}`, {
    method: "PUT",
  });
  await Router.push("/");
}

async function deletePost(id: string): Promise<void> {
  await fetch(`/api/post/${id}`, {
    method: "DELETE",
  });
  Router.push("/");
}

const Post: React.FC<PostProps> = (props) => {
  const { data: session, status } = useSession();
  if (status === "loading") {
    return <div>Authenticating...</div>;
  }
  const userHasValidSession = Boolean(session);
  const postBelongsToUser = session?.user?.email === props.author?.email;
  let title = props.title;
  if (!props.published) {
    title = `${title} (Draft)`;
  }

  return (
    <Layout>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold">{title}</h2>
          <p>By {props?.author?.name || "Unknown author"}</p>
        </div>
        <ReactMarkdown
          className="bg-white p-2 rounded-sm capitalize"
          children={props.content}
        />
        <div className="flex gap-2">
          {!props.published && userHasValidSession && postBelongsToUser && (
            <button
              className="px-4 py-2 bg-slate-400 text-white font-bold"
              onClick={() => publishPost(props.id)}
            >
              Publish
            </button>
          )}
          {userHasValidSession && postBelongsToUser && (
            <button
              className="px-4 py-2 bg-red-500 text-white font-bold"
              onClick={() => deletePost(props.id)}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Post;
