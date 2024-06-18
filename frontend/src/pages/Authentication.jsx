import React, { useEffect, useState } from "react";

const Authentication = ({ platformAuth, setCurrentPlatformInfo }) => {
  const [editPlatformDetails, setEditPlatformDetails] = useState(false);
  const [domain, setDomain] = useState("");
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    const platformDetails = JSON.parse(
      localStorage.getItem("platform_details")
    );

    if (platformDetails) {
      const { domain, clientId, clientSecret } = platformDetails;
      if (domain && clientId && clientSecret) {
        setDomain(domain);
        setClientId(clientId);
        setClientSecret(clientSecret);
      } else {
        setEditPlatformDetails(true);
      }
    }
  }, []);

  const handleSaveCredntials = () => {
    console.log("Save", domain, clientId, clientSecret);

    localStorage.setItem(
      "platform_details",
      JSON.stringify({ domain, clientId, clientSecret })
    );
    setEditPlatformDetails(!editPlatformDetails);
    setCurrentPlatformInfo({ domain, clientId, clientSecret });
  };

  const authenticate = () => {
    console.log("Authenticate", clientId, domain, clientSecret);
    const redirectUri = `https://ug6n0hw9wg.execute-api.us-east-2.amazonaws.com/Stage/callback`;

    // Add clientId, domain, and clientSecret to the state parameter
    const state = encodeURIComponent(
      JSON.stringify({ clientId, domain, clientSecret })
    );

    const authorizeUrl = `https://${domain}/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=api&state=${state}`;

    window.location.href = authorizeUrl;
  };

  return (
    <div style={{ padding: "0 3rem" }}>
      <div style={{ paddingTop: 40, paddingBottom: 40 }}>
        <h2>
          {platformAuth.authenticated ? "Authenticated" : "Please Authenticate"}
        </h2>
      </div>
      <div style={{ paddingTop: 40, paddingBottom: 40 }}>
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
          <button type="button" onClick={handleSaveCredntials}>
            {editPlatformDetails ? "Save" : "Edit"}
          </button>
          <button type="button" onClick={authenticate}>
            Authenticate
          </button>
        </form>
      </div>
    </div>
  );
};

export default Authentication;
