useEffect(() => {
  const load = async () => {
    try {
      setLoading(true);

      const res = await blogService.getMyBlogs();

      console.log("RAW MY POSTS:", res);

      const blogs = Array.isArray(res) ? res : res?.data ?? [];

      setPosts(blogs);
    } catch (err) {
      console.error(err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  load();
}, []);