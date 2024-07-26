import React, { useEffect, useState } from "react";
import { Form, Input, Button, Typography, Space } from "antd";
import useGetPlatforms from "../hooks/useGetPlatforms";
import useDeletePlatform from "../hooks/useDeletePlatform";
import { useAppContext } from "../context/appContext";

const { Title, Text } = Typography;

const Authentication = ({ user }) => {
  const [editPlatformDetails, setEditPlatformDetails] = useState(false);
  const [domain, setDomain] = useState("");
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");

  const { setCurrentPlatformInfo, setAuthenticated, authenticated } =
    useAppContext();

  const { platforms } = useGetPlatforms({ userId: user.userId });

  const {
    deletePlatformMutation,
    deletePlatformIsLoading,
    deletePlatformIsError,
  } = useDeletePlatform();

  const handleSaveCredentials = () => {
    setEditPlatformDetails(!editPlatformDetails);
    setCurrentPlatformInfo({ domain, clientId, clientSecret });
  };

  const handleDeletePlatform = () => {
    deletePlatformMutation({ platformDomain: domain });
  };

  useEffect(() => {
    if (platforms?.length) {
      const platform = platforms[0];
      setDomain(platform.platformUrl);
      setClientId(platform.clientId);
      setClientSecret(platform.clientSecret);
    }
  }, [platforms]);

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

  const anonymizeClientSecret = (secret) => {
    return secret.replace(/.(?=.{4})/g, "*");
  };

  const sectionStyle = {
    border: `1px dashed ${authenticated ? "lightgreen" : "red"}`,
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "20px",
  };

  return (
    <div style={{ padding: "0 3rem" }}>
      <div style={{ paddingTop: 20, paddingBottom: 20 }}>
        <Title level={3} style={{ fontSize: "24px" }}>
          Authenticate with Docebo
        </Title>
        <div style={sectionStyle}>
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
            <Space>
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
                onClick={authenticate}
                size="large"
              >
                {authenticated ? "Refresh" : "Authenticate"}
              </Button>
              <Button
                type="danger"
                onClick={handleDeletePlatform}
                size="large"
                loading={deletePlatformIsLoading}
              >
                Delete
              </Button>
            </Space>
            {deletePlatformIsError && (
              <Text type="danger">Error deleting platform</Text>
            )}
          </Form>
        </div>
      </div>

      <div style={{ paddingTop: 20, paddingBottom: 20 }}>
        <Title level={3} style={{ fontSize: "24px" }}>
          Platforms
        </Title>
        <div style={sectionStyle}>
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
        </div>
      </div>
    </div>
  );
};

export default Authentication;
