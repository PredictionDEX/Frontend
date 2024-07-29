import { axiosInstance } from 'src/api/axiosInterceptor'

export const addNewUserMarket = async formData => {
  const { data } = await axiosInstance.post(`/markets/add`, formData)

  return data
}
export const uploadMarketImage = async file => {
  const { data } = await axiosInstance.post(`/markets/upload`, file)
  return data.Location
}
