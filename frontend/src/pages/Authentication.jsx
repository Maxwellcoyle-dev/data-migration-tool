import React, { useEffect, useState } from "react";

import useGetPlatforms from "../hooks/useGetPlatforms";

const Authentication = ({ user, setCurrentPlatformInfo }) => {
  const [editPlatformDetails, setEditPlatformDetails] = useState(false);
  const [domain, setDomain] = useState("");
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");

  const { platforms } = useGetPlatforms({ userId: user.userId });

  const handleSaveCredntials = () => {
    console.log("Save", domain, clientId, clientSecret);

    setEditPlatformDetails(!editPlatformDetails);
    setCurrentPlatformInfo({ domain, clientId, clientSecret });
  };

  // set the domain, clientId, and clientSecret to the first item in the platforms array
  useEffect(() => {
    if (platforms.length) {
      const platform = platforms[0];
      setDomain(platform.platformUrl);
      setClientId(platform.clientId);
      setClientSecret(platform.clientSecret);
    }
  }, [platforms]);

  const authenticate = () => {
    console.log("Authenticate", clientId, domain, clientSecret);
    const redirectUri = `https://jg2x5ta8g1.execute-api.us-east-2.amazonaws.com/Stage/callback`;

    // Add clientId, domain, and clientSecret to the state parameter
    const state = encodeURIComponent(
      JSON.stringify({ clientId, domain, clientSecret, userId: user.userId })
    );

    const authorizeUrl = `https://${domain}/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=api&state=${state}`;

    window.location.href = authorizeUrl;
  };

  const handleSelectPlatform = (index) => {
    console.log("Selected Index", index);
    const platform = platforms[index];
    console.log("Selected Platform", platform);
    setDomain(platform?.platformUrl);
    setClientId(platform?.clientId);
    setClientSecret(platform?.clientSecret);
    setCurrentPlatformInfo({
      domain: platform?.platformUrl,
      clientId: platform?.clientId,
      clientSecret: platform.clientSecret,
    });
  };

  return (
    <div style={{ padding: "0 3rem" }}>
      <div style={{ paddingTop: 20, paddingBottom: 20 }}>
        <h3>Authenticate with Docebo</h3>
        <form style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label
              style={{ display: "flex", alignItems: "center", gap: "1rem" }}
            >
              Domain:
              {!editPlatformDetails ? (
                <p style={{ padding: 0, margin: 0 }}>{domain}</p>
              ) : (
                <input
                  style={{ width: "400px" }}
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                />
              )}
            </label>
          </div>
          <div>
            <label
              style={{ display: "flex", alignItems: "center", gap: "1rem" }}
            >
              Client ID:
              {!editPlatformDetails ? (
                <p style={{ padding: 0, margin: 0 }}>{clientId}</p>
              ) : (
                <input
                  style={{ width: "400px" }}
                  type="text"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                />
              )}
            </label>
          </div>
          <div>
            <label
              style={{ display: "flex", alignItems: "center", gap: "1rem" }}
            >
              Client Secret:
              {!editPlatformDetails ? (
                <p style={{ padding: 0, margin: 0 }}>{clientSecret}</p>
              ) : (
                <input
                  style={{ width: "400px" }}
                  type="password"
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                />
              )}
            </label>
          </div>
          <button
            type="button"
            onClick={handleSaveCredntials}
            style={{ width: "10rem" }}
          >
            {editPlatformDetails ? "Save" : "Edit"}
          </button>
          <button
            type="button"
            onClick={authenticate}
            style={{ width: "10rem" }}
          >
            Authenticate
          </button>
        </form>
      </div>

      <div style={{ paddingTop: 20, paddingBottom: 20, width: "50%" }}>
        <h3>Platforms</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {platforms.map((platform, index) => (
            <button key={index} onClick={() => handleSelectPlatform(index)}>
              {platform.platformUrl}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Authentication;
