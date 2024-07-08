import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://jg2x5ta8g1.execute-api.us-east-2.amazonaws.com/Stage",
});

export default axiosInstance;
