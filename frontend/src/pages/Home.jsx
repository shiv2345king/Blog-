import React, { useEffect, useState } from "react";
import { blogService } from "../api/services/blogService.js";
import { Container, PostCard } from "../components";

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const response = await blogService.getAllBlogs();

        const postsData =
          response?.data ||
          response?.posts ||
          response ||
          [];

        setPosts(Array.isArray(postsData) ? postsData : []);

        const user = JSON.parse(localStorage.getItem("user") || "null");
        setCurrentUser(user);
      } catch (error) {
        console.error("Error fetching posts:", error);
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
        <p className="text-center py-10">No posts available</p>
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