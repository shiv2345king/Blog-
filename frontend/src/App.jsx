import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { Routes, Route } from "react-router-dom";

import { userService } from "./api/services/userService";
import { login, logout } from "./store/userSlice";

import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";

// ================= PAGES =================
import Home from "./pages/Home.jsx";
import Login from "./components/Login.jsx";
import SignUp from "./components/SignUp.jsx";
import Post from "./pages/Post.jsx";
import AllPosts from "./pages/AllPost.jsx";
import UpdatePost from "./pages/UpdatePost.jsx";
import AddPost from "./pages/AddPost.jsx";
import Dashboard from "./pages/Dashboard.jsx";

import "./App.css";

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const fetchUser = async () => {
      try {
        const userData = await userService.getCurrentUser();

        const user = userData?.data ?? userData?.user ?? userData;

        if (user?._id) dispatch(login(user));
        else dispatch(logout());
      } catch (error) {
        console.log("User not authenticated:", error?.message);
        dispatch(logout());
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-100">
        <div className="text-xl font-semibold text-gray-700">
          Loading...
        </div>
      </div>
    );
  }

 return (
  <div className="min-h-screen w-full flex flex-col bg-blue-100">
    <Header />

    <main className="flex-1 w-full flex flex-col">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/posts/:id" element={<Post />} />
        <Route path="/posts/:id/edit" element={<UpdatePost />} />
        <Route path="/add-post" element={<AddPost />} />
        <Route path="/all-posts" element={<AllPosts />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </main>

    <Footer className="w-full mt-auto" />
  </div>
);
}

export default App;