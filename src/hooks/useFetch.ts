import axios from 'axios'

export const getData = async (uri: string) => {
  return await axios
    .get(`${process.env.NEXT_PUBLIC_RESTAPI_URL}/${uri}`)
    .then((response) => {
      return response.data
    })
    .catch(() => {
      throw new Error('データ取得に失敗しました')
    })
}

export const postData = async (uri: string, data: any) => {
  return await axios
    .post(`${process.env.NEXT_PUBLIC_RESTAPI_URL}/${uri}`, data)
    .then((response) => {
      return response.data
    })
}
