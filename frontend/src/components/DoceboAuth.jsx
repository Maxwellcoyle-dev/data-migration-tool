import React, { useState } from "react";

import { authenticator } from "./authenticator";

const DoceboAuth = () => {
  const [siteUrl, setSiteUrl] = useState("");
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const redirectUri =
      "https://ug6n0hw9wg.execute-api.us-east-2.amazonaws.com/Stage/token";
    const state = "someUniqueState"; // Generate a unique state to prevent CSRF attacks

    const authUrl = `https://${siteUrl}/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&state=${state}`;

    window.location.href = authUrl;
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
      }}
    >
      <label>
        Docebo Site URL:
        <input
          type="text"
          value={siteUrl}
          onChange={(e) => setSiteUrl(e.target.value)}
          required
        />
      </label>
      <label>
        Client ID:
        <input
          type="text"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          required
        />
      </label>
      <label>
        Client Secret:
        <input
          type="text"
          value={clientSecret}
          onChange={(e) => setClientSecret(e.target.value)}
          required
        />
      </label>
      <button type="submit" onClick={authenticator}>
        Authenticate
      </button>
    </form>
  );
};

export default DoceboAuth;
