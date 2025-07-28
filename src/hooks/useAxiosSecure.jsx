import axios from "axios";

const axiosSecureInstance = axios.create({
  baseURL: "https://taskhubserverside.onrender.com",
});

const useAxiosSecure = () => {
  return axiosSecureInstance;
};

export default useAxiosSecure;