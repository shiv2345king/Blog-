import React, { useState, useEffect } from "react";
import { Container, PostCard } from "../components/index";
import { blogService } from "../api/services/blogService";

function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await blogService.getAllBlogs();

        // safer handling (handles both array and axios-style response)
        setPosts(Array.isArray(data) ? data : data?.data || []);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch auto-rows-fr">
            {posts.map((post) => (
              <div key={post._id} className="h-full flex">
                <PostCard post={post} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No posts found
          </p>
        )}
      </div>
    </Container>
  );
}

export default AllPosts;