import React, { useEffect, useState } from "react";
import { blogService } from "../api/services/blogService.js";
import { Container, PostCard } from "../components";
import { useSelector } from "react-redux";

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ GET USER FROM REDUX
  const currentUser = useSelector(
    (state) => state.user.user
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const postsData =
          await blogService.getAllBlogs();

        setPosts(
          Array.isArray(postsData)
            ? postsData
            : []
        );
      } catch (error) {
        console.error(
          "Error fetching posts:",
          error
        );

        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading posts...</p>
      </div>
    );
  }

  if (!posts.length) {
    return (
      <Container>
        <p className="text-center py-10 text-gray-500">
          No posts available
        </p>
      </Container>
    );
  }

  return (
    <div className="w-full py-8">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              currentUser={currentUser}
            />
          ))}
        </div>
      </Container>
    </div>
  );
}

export default Home;