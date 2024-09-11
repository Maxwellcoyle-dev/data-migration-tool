import React, { useEffect, useState } from "react";
import { Image, Layout, Menu, Typography, Popconfirm, Button } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  HomeOutlined,
  FileTextOutlined,
  SafetyOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

import { useAppContext } from "../../context/appContext";
import logo from "../../assets/trainicity-logo.png";
import styles from "./NavBar.module.css";

const { Header } = Layout;
const { Text } = Typography;

const NavBar = ({ signOut }) => {
  const [path, setPath] = useState("");
  const { pathname } = useLocation();

  const navigate = useNavigate();

  const {
    currentPlatformInfo,
    setCurrentPlatformInfo,
    authenticated,
    setAuthenticated,
  } = useAppContext();

  useEffect(() => {
    setPath(pathname);
  }, [pathname]);

  const onConfirmSignout = () => {
    signOut();
    navigate("/");
  };

  return (
    <Layout>
      <Header className={styles.navHeader}>
        <div className={styles.logo}>
          <Image
            src={logo}
            alt="logo"
            preview={false}
            className={styles.logoImage}
            onClick={() => navigate("/")}
          />
        </div>
        <Menu
          theme="light"
          mode="horizontal"
          selectedKeys={[path]}
          style={{ flex: 1, display: "flex", justifyContent: "center" }}
        >
          <Menu.Item key="/" icon={<HomeOutlined />}>
            <Link to="/" className={styles.menuItem}>
              Home
            </Link>
          </Menu.Item>
          <Menu.Item key="/logs" icon={<FileTextOutlined />}>
            <Link to="/logs" className={styles.menuItem}>
              Logs
            </Link>
          </Menu.Item>
          <Menu.Item key="/authentication" icon={<SafetyOutlined />}>
            <Link to="/authentication" className={styles.menuItem}>
              Authenticate
            </Link>
          </Menu.Item>
        </Menu>
        <div className={styles.status}>
          <Text
            // onclick open up a new tab with the domain
            onClick={() =>
              window.open(`https://${currentPlatformInfo.domain}`, "_blank")
            }
            type={authenticated ? "success" : "danger"}
            className={styles.domainText}
          >
            {currentPlatformInfo.domain}
          </Text>
          <Popconfirm
            title="Confirm"
            description="Are you sure to log out?"
            okText="Yes"
            cancelText="No"
            placement="bottomLeft"
            onConfirm={onConfirmSignout}
          >
            <Button icon={<LogoutOutlined />}></Button>
          </Popconfirm>
        </div>
      </Header>
    </Layout>
  );
};

export default NavBar;
