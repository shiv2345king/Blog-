import React, { useEffect, useState } from "react";
import { Container, PostCard } from "../components";
import { blogService } from "../api/services/blogService";

function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        setLoading(true);

        const res = await blogService.getMyBlogs();

        // IMPORTANT FIX
        const blogs = Array.isArray(res) ? res : [];

        setPosts(blogs);
      } catch (err) {
        console.error("MyPosts error:", err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-600">
        Loading...
      </div>
    );
  }

  return (
    <Container>
      <div className="w-full py-6">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div key={post._id} className="flex">
                <PostCard post={post} />
              </div>
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