import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Callback = ({ setAccessToken }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Extract the access token from the URL
    const params = new URLSearchParams(window.location.search);
    console.log("params", params.toString()); // Log params for debugging

    const accessToken = params.get("access_token");
    console.log("accessToken", accessToken); // Log accessToken for debugging

    if (accessToken) {
      // Update the state and local storage
      setAccessToken(accessToken);
      const lastUpdated = new Date().getTime();
      localStorage.setItem(
        "docebo_platform_auth",
        JSON.stringify({ accessToken, lastUpdated })
      );
      navigate("/"); // Redirect to the home page
    } else {
      // Handle the error case where access token is not found
      console.error("Access token not found in the URL");
    }
  }, [setAccessToken, navigate]);

  return <div>Loading...</div>;
};

export default Callback;
