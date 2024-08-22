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
  Image,
  message,
  Collapse,
  List,
} from "antd";
import { DeleteOutlined, CopyOutlined } from "@ant-design/icons";
import useGetPlatforms from "../hooks/useGetPlatforms";
import useDeletePlatform from "../hooks/useDeletePlatform";
import { useAppContext } from "../context/appContext";

import doceboAPIGuide from "../assets/docebo_api_config_guide.png";

const { Title, Text } = Typography;

const PlatformAuthenticator = ({ user }) => {
  const [editPlatformDetails, setEditPlatformDetails] = useState(false);
  const [domain, setDomain] = useState("");
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");

  const [messageApi, contextHolder] = message.useMessage();

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
    if (domain === "") {
      setEditPlatformDetails(true);
    }

    if (currentPlatformInfo.domain !== "") {
      setEditPlatformDetails(false);
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

  // Success message for when user copies Redirect URL
  const success = () => {
    messageApi.open({
      type: "success",
      content: "Copied to your clipboard",
      duration: 0.5,
    });
  };

  const instructionListItems = [
    {
      title: "Step 1",
      content: {
        content: (
          <Text style={{ fontSize: "16px" }}>
            Go to the API and SSO app in the platform.
          </Text>
        ),
      },
    },
    {
      title: "Step 2",
      content: {
        content: (
          <Text style={{ fontSize: "16px" }}>
            In the API Credentials tab, click "Add OAuth2 app".
          </Text>
        ),
      },
    },
    {
      title: "Step 3",
      content: {
        content: (
          <Text style={{ fontSize: "16px" }}>
            Create a App name and description. This can be anything - you can
            use the example in the screenshot below.
          </Text>
        ),
      },
    },
    {
      title: "Step 4",
      content: {
        content: (
          <Text style={{ fontSize: "16px" }}>
            Create a client Id. The copy it into the Client ID field.
          </Text>
        ),
      },
    },
    {
      title: "Step 5",
      content: {
        content: (
          <Text style={{ fontSize: "16px" }}>
            Copy the Client Secret from the platform and paste it into the
            Client Secret field.
          </Text>
        ),
      },
    },
    {
      title: "Step 6",
      content: {
        content: (
          <>
            <Text style={{ fontSize: "16px" }}>
              6. Copy the Redirect URI from below and paste it into the Redirect
              URI field in the platform.
            </Text>

            <div
              style={{
                display: "flex",
                gap: ".5rem",
                background: "#f1f0f1",
                padding: ".25rem",
                marginTop: ".25rem",
              }}
            >
              {/* onclick I want to copy the uri value into the users clipboard */}
              <Button
                icon={<CopyOutlined />}
                onClick={() => {
                  navigator.clipboard.writeText(
                    "https://jg2x5ta8g1.execute-api.us-east-2.amazonaws.com/Stage/callback"
                  );
                  success();
                }}
              />

              <Text style={{ fontSize: "16px" }}>
                https://jg2x5ta8g1.execute-api.us-east-2.amazonaws.com/Stage/callback
              </Text>
            </div>
          </>
        ),
      },
    },
    {
      title: "Step 8",
      content: {
        content: (
          <Text style={{ fontSize: "16px" }}>
            Copy the platform Url into the the Domain field. For example:
            traintopia.docebosaas.com
          </Text>
        ),
      },
    },
  ];

  const authenticatorSectionStyle = {
    border: `1px dashed ${authenticated ? "blue" : "red"}`,
    borderRadius: "8px",
    background: `${authenticated ? "lightblue" : "lightred"}`,
    padding: "20px",
    width: "100%",
    marginTop: "1rem",
  };

  const collapsceItems = [
    {
      key: "1",
      label: (
        <Text
          style={{ fontSize: "18px", fontWeight: "800", alignItems: "center" }}
        >
          Example Screenshot
        </Text>
      ),
      children: <Image src={doceboAPIGuide} preview={false} />,
    },
  ];

  return (
    <div style={{ padding: "2rem 3rem 5rem 3rem" }}>
      {contextHolder}
      <div
        style={{
          paddingTop: 20,
          paddingBottom: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: ".5rem",
            width: "50%",
            paddingBottom: "1rem",
          }}
        >
          <Title level={2} style={{ fontSize: "28px", padding: 0, margin: 0 }}>
            Docebo Platform Authenticator
          </Title>
          <Text style={{ fontSize: "18px", color: "gray" }}>
            The Authenticator allows you to add multiple platforms, switch
            between platforms, and delete platforms once your finished with a
            project.
          </Text>
        </div>
        <Button
          onClick={handleNewPlatform}
          type={platforms?.length < 1 ? "primary" : "dashed"}
          size="large"
          style={{ width: "15%" }}
        >
          + New Platform
        </Button>
      </div>
      <div style={{ display: "flex", width: "100%", gap: "2rem" }}>
        <div style={{ display: "flex", flexDirection: "column", width: "50%" }}>
          <Spin
            spinning={
              deletePlatformIsLoading === undefined
                ? false
                : deletePlatformIsLoading
            }
          >
            <Title level={3} style={{ fontSize: "24px", marginBottom: 0 }}>
              Current Platform
            </Title>
            <Text style={{ fontSize: "18px", color: "gray" }}>
              This is the platform you are currently connected to. Make sure you
              refresh the authentication every hour.
            </Text>
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
                <Space
                  style={{ justifyContent: "space-between", width: "100%" }}
                >
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
                        editPlatformDetails || platforms?.length < 1
                          ? "default"
                          : "primary"
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
                      Authenticate
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
                      disabled={
                        domain === "" ||
                        clientId === "" ||
                        clientSecret === "" ||
                        editPlatformDetails
                      }
                      icon={<DeleteOutlined />}
                      size="large"
                    />
                  </Popconfirm>
                </Space>
              </Form>
            </div>
          </Spin>

          <div
            style={{
              width: "100%",
            }}
          >
            <Title
              level={3}
              style={{ fontSize: "24px", paddingBottom: 0, marginBottom: 0 }}
            >
              Platforms
            </Title>
            <Text style={{ fontSize: "18px", color: "gray" }}>
              Your saved platforms. Click on a platform to select it.
            </Text>
            <div>
              {platformIsLoading && <Spin />}
              {platformsError && (
                <Alert
                  message="Error"
                  description={platformsError}
                  type="error"
                />
              )}
              {platforms?.length > 0 && (
                <Space
                  direction="vertical"
                  style={{
                    width: "100%",
                    border: "1px solid lightblue",
                    borderRadius: "8px",
                    padding: "1rem",
                    marginTop: "1rem",
                  }}
                >
                  {platforms?.map((platform, index) => (
                    <Button
                      key={index}
                      onClick={() => handleSelectPlatform(index)}
                      size="large"
                      style={{ width: "100%" }}
                      type={
                        platform.platformUrl === domain ? "primary" : "default"
                      }
                    >
                      {platform.platformUrl}
                    </Button>
                  ))}
                </Space>
              )}
            </div>
          </div>
        </div>
        <div
          style={{
            width: "50%",
          }}
        >
          <Title level={3} style={{ fontSize: "24px", marginBottom: 0 }}>
            Instructions
          </Title>
          <Text style={{ fontSize: "18px", color: "gray" }}>
            Follow these instructions to set up a connection with a new
            platform.
          </Text>
          <div
            style={{
              border: "1px solid blue",
              borderRadius: "8px",
              padding: "1rem",
              marginTop: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: ".5rem",
            }}
          >
            <List
              dataSource={instructionListItems}
              renderItem={(item, index) => (
                <List.Item key={index}>
                  <List.Item.Meta
                    title={item.title}
                    description={item.content.content}
                  />
                </List.Item>
              )}
            />
            <Collapse items={collapsceItems} defaultActiveKey={[]} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformAuthenticator;
