import axios from "axios";

const axiosSecureInstance = axios.create({
  baseURL: "http://localhost:5000",
});

const useAxiosSecure = () => {
  return axiosSecureInstance;
};

export default useAxiosSecure;