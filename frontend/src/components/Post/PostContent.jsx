import React from "react";
import parse from "html-react-parser";

export default function PostContent({ post }) {
  return (
    <>
      {post.image && (
        <div className="mb-4">
          <img
            src={post.image}
            alt={post.title}
            className="rounded-xl w-full max-h-[500px] object-cover"
          />
        </div>
      )}

      <h1 className="text-3xl font-bold mb-4">
        {post.title}
      </h1>

      <div className="prose max-w-none">
        {parse(post.content)}
      </div>
    </>
  );
}