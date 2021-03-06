import axios, { AxiosResponse, AxiosError, Method } from 'axios'
interface IUseAxiosParams {
  url: string
  method: Method
  data?: {} | null
  headers?: { [key: string]: string }
}

export const useAxios = async <T>({
  url,
  method,
  data = null,
  headers = null,
}: IUseAxiosParams): Promise<AxiosResponse<T> | AxiosError<T>> => {
  let axiosInstance = axios.create({
    // baseURL: `https://jsonplaceholder.typicode.com`,
    baseURL: `${process.env.NEXT_PUBLIC_RESTAPI_URL}`,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    timeout: 1000,
  })

  const res = await axiosInstance[method](url, data, headers)
  // .catch(
  //   (error: AxiosError<T>) => {
  //     console.log({ error })
  //     return error
  //   }
  // )

  return res
}
