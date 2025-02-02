import axios from 'axios'

const timeout = 30 * 1000

export const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}`,
  timeout
})
axiosInstance.interceptors.request.use(config => {
  // eslint-disable-next-line no-param-reassign
  config.headers.Authorization = process.env.NEXT_PUBLIC_BACKEND_AUTH

  return config
})

axiosInstance.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response && error.response.data) {
      if (error.response.data.message) {
        const { message } = error.response.data

        return Promise.reject(new Error(message))
      }
      return Promise.reject(error.response.data)
    }
    return Promise.reject(error)
  }
)
