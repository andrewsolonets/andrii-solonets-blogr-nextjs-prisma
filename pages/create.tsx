import React, { useState } from "react";
import Layout from "../components/Layout";
import Router from "next/router";

const Draft: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    try {
      const body = { title, content };
      await fetch("/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await Router.push("/drafts");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout>
      <div>
        <form onSubmit={submitData} className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">New Draft</h1>
          <input
            autoFocus
            className="p-2"
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            type="text"
            value={title}
          />
          <textarea
            cols={50}
            className="p-2"
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
            rows={8}
            value={content}
          />
          <div className="flex gap-2 items-center">
            <input
              disabled={!content || !title}
              className="px-4 py-2 cursor-pointer rounded-sm bg-zinc-600 text-white font-semibold"
              type="submit"
              value="Create"
            />
            <a className="back" href="#" onClick={() => Router.push("/")}>
              Or Cancel
            </a>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Draft;
