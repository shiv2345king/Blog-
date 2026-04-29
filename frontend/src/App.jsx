import { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { userService } from './api/services/userService';
import { login, logout } from './store/userSlice';
import Header from './components/Header/Header.jsx';
import Footer from './components/Footer/Footer.jsx';
import './App.css';

function App() {
  console.log("App rendered");
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  // Prevent multiple runs (important for stability)
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const fetchUser = async () => {
      try {
        const userData = await userService.getCurrentUser();

        if (userData) {
          dispatch(login(userData));
        } else {
          dispatch(logout());
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        dispatch(logout());
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [dispatch]);

  if (loading) {
  return <div>Loading...</div>;
}

return (
  <div className='min-h-screen flex flex-wrap content-between bg-blue-100'>
    <div className='w-full block text-center'>
      <Header/>
      <main>
         <h1 className='text-bold'>Siuuuuu</h1>
      </main>
      <Footer/>
    </div>
  </div>
);
}

export default App;