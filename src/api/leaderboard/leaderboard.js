import { axiosInstance } from 'src/api/axiosInterceptor'

export const leaderBoardData = async ({month, year, walletAddressBase16}) => {
  const { data } = await axiosInstance.get(`/leaderboard`,{
    params: {
        month,
        year,
        walletAddress: walletAddressBase16
    }
  })
  return data
}

export const getUserRewards = async ({walletAddressBase16}) => {
  const { rewards: data} = await axiosInstance.get(`/leaderboard/get-user-rewards`,{
    params: {
        walletAddress: walletAddressBase16.toString().toLowerCase()
    }
  })
  return data
}