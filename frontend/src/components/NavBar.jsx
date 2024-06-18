import React from "react";
import { Link } from "react-router-dom";

const NavBar = ({ domain, authenticated }) => {
  return (
    <div
      style={{
        padding: "1rem 3rem",
        margin: 0,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
      }}
    >
      <Link to="/">Home</Link>
      <div style={{ color: authenticated ? "green" : "red" }}>{domain}</div>
      <Link to="/authentication">Authenticate</Link>
    </div>
  );
};

export default NavBar;
