import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  Space,
  Popconfirm,
  Spin,
  notification,
  Alert,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import useGetPlatforms from "../hooks/useGetPlatforms";
import useDeletePlatform from "../hooks/useDeletePlatform";
import { useAppContext } from "../context/appContext";

const { Title, Text } = Typography;

const Authentication = ({ user }) => {
  const [editPlatformDetails, setEditPlatformDetails] = useState(false);
  const [domain, setDomain] = useState("");
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");

  const {
    setCurrentPlatformInfo,
    currentPlatformInfo,
    setAuthenticated,
    authenticated,
  } = useAppContext();
  const { platforms, platformIsLoading, platformsError } = useGetPlatforms({
    userId: user.userId,
  });

  const {
    deletePlatformMutation,
    deletePlatformIsSuccess,
    deletePlatformIsLoading,
    deletePlatformIsError,
  } = useDeletePlatform();

  useEffect(() => {
    console.log("delete is loading: ", deletePlatformIsLoading);
  });

  useEffect(() => {
    if (domain === "" && clientId === "" && clientSecret === "") {
      setEditPlatformDetails(true);
    }
  }, [domain, clientId, clientSecret]);

  useEffect(() => {
    if (platforms?.length) {
      const platform = platforms[0];
      setCurrentPlatformInfo({
        domain: platform.platformUrl,
        clientId: platform.clientId,
        clientSecret: platform.clientSecret,
      });

      setDomain(platform.platformUrl);
      setClientId(platform.clientId);
      setClientSecret(platform.clientSecret);
    }
  }, [platforms]);

  useEffect(() => {
    if (deletePlatformIsSuccess) {
      notification.success({
        message: "Success",
        description: "Platform deleted successfully.",
      });
      setDomain("");
      setClientId("");
      setClientSecret("");
    }
    if (deletePlatformIsError) {
      notification.error({
        message: "Error",
        description: "Failed to delete platform. Please try again.",
      });
    }
  }, [deletePlatformIsSuccess, deletePlatformIsError]);

  const handleSaveCredentials = () => {
    setCurrentPlatformInfo({ domain, clientId, clientSecret });
    setEditPlatformDetails(!editPlatformDetails);
  };

  const handleDeletePlatform = () => {
    deletePlatformMutation({ platformDomain: domain });
  };

  const authenticate = () => {
    console.log("Authenticate", clientId, domain, clientSecret);
    const redirectUri = `https://jg2x5ta8g1.execute-api.us-east-2.amazonaws.com/Stage/callback`;

    const state = encodeURIComponent(
      JSON.stringify({ clientId, domain, clientSecret, userId: user.userId })
    );

    const authorizeUrl = `https://${domain}/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=api&state=${state}`;

    window.location.href = authorizeUrl;
  };

  const handleSelectPlatform = (index) => {
    const platform = platforms[index];
    setDomain(platform?.platformUrl);
    setClientId(platform?.clientId);
    setClientSecret(platform?.clientSecret);
    setCurrentPlatformInfo({
      domain: platform?.platformUrl,
      clientId: platform?.clientId,
      clientSecret: platform.clientSecret,
    });

    const timeStamp = new Date(platform.timeStamp).getTime();
    const currentTime = new Date().getTime();
    const difference = currentTime - timeStamp;
    const minutes = difference / 1000 / 60;
    if (minutes < 60) {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
    }
  };

  const handleNewPlatform = () => {
    setDomain("");
    setClientId("");
    setClientSecret("");
    setCurrentPlatformInfo({ domain: "", clientId: "", clientSecret: "" });
    setEditPlatformDetails(true);
  };

  const anonymizeClientSecret = (secret) => {
    return secret.replace(/.(?=.{4})/g, "*");
  };

  const authenticatorSectionStyle = {
    border: `1px dashed ${authenticated ? "lightgreen" : "red"}`,
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "20px",
  };

  const sectionStyle = {
    border: `1px dashed charcoal`,
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "20px",
  };

  return (
    <div style={{ padding: "0 3rem" }}>
      <div
        style={{
          paddingTop: 20,
          paddingBottom: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Title level={3} style={{ fontSize: "24px" }}>
          Authenticate with Docebo
        </Title>
        <Button onClick={handleNewPlatform} type="dashed" size="large">
          + New Platform
        </Button>
      </div>
      <Spin
        spinning={
          deletePlatformIsLoading === undefined
            ? false
            : deletePlatformIsLoading
        }
      >
        <div style={authenticatorSectionStyle}>
          <Form layout="vertical" size="large">
            <Form.Item label="Domain">
              {!editPlatformDetails ? (
                <Text style={{ fontSize: "18px" }}>{domain}</Text>
              ) : (
                <Input
                  style={{ width: "100%" }}
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                />
              )}
            </Form.Item>
            <Form.Item label="Client ID">
              {!editPlatformDetails ? (
                <Text style={{ fontSize: "18px" }}>{clientId}</Text>
              ) : (
                <Input
                  style={{ width: "100%" }}
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                />
              )}
            </Form.Item>
            <Form.Item label="Client Secret">
              {!editPlatformDetails ? (
                <Text style={{ fontSize: "18px" }}>
                  {anonymizeClientSecret(clientSecret)}
                </Text>
              ) : (
                <Input
                  style={{ width: "100%" }}
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                />
              )}
            </Form.Item>
            <Space style={{ justifyContent: "space-between", width: "100%" }}>
              <div style={{ display: "flex", gap: "1rem" }}>
                <Button
                  type={editPlatformDetails ? "primary" : "default"}
                  onClick={handleSaveCredentials}
                  size="large"
                >
                  {editPlatformDetails ? "Save" : "Edit"}
                </Button>
                <Button
                  type={
                    authenticated || editPlatformDetails ? "default" : "primary"
                  }
                  disabled={
                    currentPlatformInfo.domain === "" ||
                    currentPlatformInfo.clientId === "" ||
                    currentPlatformInfo.clientSecret === "" ||
                    editPlatformDetails
                  }
                  onClick={authenticate}
                  size="large"
                >
                  {authenticated ? "Refresh" : "Authenticate"}
                </Button>
              </div>
              <Popconfirm
                title="Are you sure you want to delete this platform?"
                onConfirm={handleDeletePlatform}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  danger
                  disabled={currentPlatformInfo}
                  icon={<DeleteOutlined />}
                  size="large"
                />
              </Popconfirm>
            </Space>
          </Form>
        </div>
      </Spin>

      <div style={{ paddingTop: 20, paddingBottom: 20 }}>
        <Title level={3} style={{ fontSize: "24px" }}>
          Platforms
        </Title>
        <div style={sectionStyle}>
          {platformIsLoading && <Spin />}
          {platformsError && (
            <Alert message="Error" description={platformsError} type="error" />
          )}
          {platforms?.length > 0 && (
            <Space direction="vertical" style={{ width: "100%" }}>
              {platforms?.map((platform, index) => (
                <Button
                  key={index}
                  onClick={() => handleSelectPlatform(index)}
                  size="large"
                  style={{ width: "100%" }}
                >
                  {platform.platformUrl}
                </Button>
              ))}
            </Space>
          )}
        </div>
      </div>
    </div>
  );
};

export default Authentication;
