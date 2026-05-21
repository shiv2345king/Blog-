import React from "react";
import logo from "../assets/logo.png"; // adjust path if needed

function Logo({ width = "500px" }) {
  return (
    <div style={{ width }}>
      <img
        src={logo}
        alt="Blog Logo"
        style={{
          width: "100%",
          height: "auto",
          objectFit: "contain",
        }}
      />
    </div>
  );
}

export default Logo;