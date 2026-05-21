import React, { useEffect, useState } from "react";
import { Container, PostCard } from "../components/index";
import { blogService } from "../api/services/blogService";

function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        setLoading(true);

        const res = await blogService.getMyBlogs();

        // FIX: backend ApiResponse => { success, data }
        const blogs = res?.data ?? res ?? [];

        setPosts(Array.isArray(blogs) ? blogs : []);
      } catch (error) {
        console.error("Error fetching my posts:", error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <Container>
      {posts.length === 0 ? (
        <p className="text-center text-gray-500">
          No posts created by you
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </Container>
  );
}

export default MyPosts;