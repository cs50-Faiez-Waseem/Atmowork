import axios from 'axios'

const api = axios.create({
  baseURL : process.env.NEXT_PUBLIC_backendURL,
  timeout : 15000,
  withCredentials : true
})

export default api

