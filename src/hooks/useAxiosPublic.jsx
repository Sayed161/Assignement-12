import axios from "axios"

const axiosPublic = axios.create({
    baseURL:'https://taskhubserverside.onrender.com'

})
const useAxiosPublic = () => {
  return axiosPublic
}

export default useAxiosPublic
