import React, { useEffect, useState } from "react";
import { Container, PostCard } from "../components/index.js";
import { blogService } from "../api/services/blogService.js";
import { useSelector } from "react-redux";

function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ REDUX USER
  const currentUser = useSelector(
    (state) => state.user.user
  );

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const res =
          await blogService.getMyBlogs();

        setPosts(
          Array.isArray(res) ? res : []
        );
      } catch (err) {
        console.error(
          "MY POSTS ERROR:",
          err
        );

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
              <PostCard
                key={post._id}
                post={post}
                currentUser={currentUser}
              />
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