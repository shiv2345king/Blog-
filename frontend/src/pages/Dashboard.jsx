// pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { dashboardService } from "../api/services/dashboard.service.js";
import { Container } from "../components";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const dashboardData = await dashboardService.getDashboardData();
        
        console.log("📊 DASHBOARD DATA:", dashboardData);
        
        setData(dashboardData);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboard();
    }
  }, [user]);

  if (loading) {
    return (
      <Container>
        <div className="text-center py-10">Loading dashboard...</div>
      </Container>
    );
  }

  if (!data) {
    return (
      <Container>
        <div className="text-center py-10">Failed to load dashboard</div>
      </Container>
    );
  }

  return (
    <Container>
      <h1 className="text-3xl font-bold mb-6">My Dashboard</h1>

      {/* USER INFO */}
      <div className="bg-gray-100 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-2">Welcome, {data.user?.username}!</h2>
        <p className="text-gray-600">{data.user?.email}</p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Total Blogs</h3>
          <p className="text-4xl font-bold text-blue-600">
            {data.stats?.totalBlogs || 0}
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800 mb-2">Total Likes</h3>
          <p className="text-4xl font-bold text-green-600">
            {data.stats?.totalLikes || 0}
          </p>
        </div>

        <div className="bg-purple-50 border border-purple-200 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-800 mb-2">Total Comments</h3>
          <p className="text-4xl font-bold text-purple-600">
            {data.stats?.totalComments || 0}
          </p>
        </div>
      </div>

      {/* RECENT BLOGS */}
      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Recent Blogs</h2>
        
        {data.recentBlogs?.length === 0 ? (
          <p className="text-gray-500">No blogs yet. Create your first blog!</p>
        ) : (
          <div className="space-y-3">
            {data.recentBlogs?.map((blog) => (
              <div
                key={blog._id}
                className="border-l-4 border-blue-500 bg-gray-50 p-4 rounded"
              >
                <h3 className="font-semibold text-lg">{blog.title}</h3>
                <p className="text-sm text-gray-500">
                  Created: {new Date(blog.createdAt).toLocaleDateString()}
                </p>
                <Link
                  to={`/posts/${blog.slug || blog._id}`}
                  className="text-blue-600 text-sm hover:underline"
                >
                  View Post →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}