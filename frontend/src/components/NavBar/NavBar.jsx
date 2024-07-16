import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import styles from "./NavBar.module.css";

const NavBar = ({ domain, authenticated }) => {
  const [path, setPath] = useState("");

  const { pathname } = useLocation();

  useEffect(() => {
    setPath(pathname);
  }, [pathname]);

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
      <div className={styles.mainNavDiv}>
        <Link
          className={path === "/" ? styles.selectedNavItem : styles.navItem}
          to="/"
        >
          Home
        </Link>
        <Link
          className={path === "/logs" ? styles.selectedNavItem : styles.navItem}
          to="/logs"
        >
          Logs
        </Link>
      </div>
      <div style={{ color: authenticated ? "green" : "red" }}>{domain}</div>
      <div>
        <Link
          className={
            path === "/authentication" ? styles.selectedNavItem : styles.navItem
          }
          to="/authentication"
        >
          Authenticate
        </Link>
      </div>
    </div>
  );
};

export default NavBar;
