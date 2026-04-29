import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { Logo, LogoutBtn, Container } from '../index'
import { useSelector } from 'react-redux'

function Header() {
  const userStatus = useSelector((state) => !!state.user.user);
  const navigate = useNavigate();

  const navOptions = [
    { name: "Home", slug: "/", active: true },
    { name: "Login", slug: "/login", active: !userStatus },
    { name: "Sign Up", slug: "/signup", active: !userStatus },
    { name: "Dashboard", slug: "/dashboard", active: userStatus },
    {name: "Add post", slug: "/add-post", active: userStatus},
    {name: "My posts", slug: "/my-posts", active: userStatus},
  ];

  return (
    <header className='py-3 shadow bg-gray-500'>
      <Container>
        <nav className='flex'>
          <div className='mr-4'>
            <Link to='/'>
              <Logo width='70px' />
            </Link>
          </div>

          <ul className='flex ml-auto'>
            {navOptions.map((item) =>
              item.active ? (
                <li key={item.name}>
                  <button
                    onClick={() => navigate(item.slug)}
                    className='inline-block px-6 py-2 duration-200 hover:bg-blue-100 rounded-full'
                  >
                    {item.name}
                  </button>
                </li>
              ) : null
            )}

            {userStatus && (
              <li>
                <LogoutBtn />
              </li>
            )}
            
          </ul>
        </nav>
      </Container>
    </header>
  )
}

export default Header;
