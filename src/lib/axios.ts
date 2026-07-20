import axios from "axios"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
})

api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token")
      localStorage.removeItem("user")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)

export default api
