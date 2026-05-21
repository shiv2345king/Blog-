import React from "react";
import { Link } from "react-router-dom";
import { Logo } from "../index";

function Footer() {
  return (
    <footer className="bg-slate-900 text-gray-300 border-t border-slate-700 py-8 ">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Logo Section */}
          <div>
            <Logo width="140px" />
            <p className="mt-3 text-sm text-gray-400">
              Share ideas, stories, and knowledge through blogging.
            </p>
            <p className="mt-4 text-xs text-gray-500">
              © 2026 All Rights Reserved.
            </p>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              Company
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-blue-400 transition">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-blue-400 transition">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-blue-400 transition">
                  Affiliate Program
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              Support
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-blue-400 transition">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-blue-400 transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-blue-400 transition">
                  Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              Legal
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-blue-400 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-blue-400 transition">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-blue-400 transition">
                  Licensing
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;