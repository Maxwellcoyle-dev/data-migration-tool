import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    console.log("params", params.toString()); // Log params for debugging

    navigate("/"); // Redirect to the home page
  }, []);

  return <div>Loading...</div>;
};

export default Callback;
