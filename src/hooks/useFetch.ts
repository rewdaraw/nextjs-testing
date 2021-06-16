import axios from 'axios'

export const useFetch = async (uri: string) => {
  return await axios
    .get(`${process.env.NEXT_PUBLIC_RESTAPI_URL}/${uri}`)
    .then((response) => {
      return response.data
    })
    .catch(() => {
      throw new Error('データ取得に失敗しました')
    })
}
