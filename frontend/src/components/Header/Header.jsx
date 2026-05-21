import React from "react";
import { Link } from "react-router-dom";
import { Logo, LogoutBtn, Container } from "../index";
import { useSelector } from "react-redux";

function Header() {
  const user = useSelector((state) => state.user.user);

  const navOptions = [
    { name: "Home", slug: "/", active: true },
    { name: "Login", slug: "/login", active: !user },
    { name: "Sign Up", slug: "/signup", active: !user },
    { name: "Dashboard", slug: "/dashboard", active: user },
    { name: "Add Post", slug: "/add-post", active: user },
    { name: "My Posts", slug: "/my-posts", active: user },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900 shadow-md border-b border-slate-700">
      <Container>
        <nav className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Logo width="80px" />
          </Link>

          {/* Nav Items */}
          <ul className="flex items-center gap-2">
            {navOptions.map((item) =>
              item.active ? (
                <li key={item.name}>
                  <Link
                    to={item.slug}
                    className="px-4 py-2 text-sm font-medium text-gray-200 rounded-lg transition duration-300 hover:bg-blue-500 hover:text-white"
                  >
                    {item.name}
                  </Link>
                </li>
              ) : null
            )}

            {user && (
              <li className="ml-2">
                <LogoutBtn />
              </li>
            )}
          </ul>
        </nav>
      </Container>
    </header>
  );
}

export default Header;