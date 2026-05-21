import React, { useEffect, useState } from "react";
import { Container, PostCard } from "../components/index.js";
import { blogService } from "../api/services/blogService.js";

function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const res = await blogService.getMyBlogs();

        console.log("RAW MY POSTS:", res);

        const blogs = Array.isArray(res) ? res : res?.data ?? [];

        setPosts(blogs);
      } catch (err) {
        console.error("MY POSTS ERROR:", err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <Container>
      <div className="py-6">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No posts created by you
          </p>
        )}
      </div>
    </Container>
  );
}

export default MyPosts;