import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  Method,
} from 'axios'
import { useEffect, useState } from 'react'

interface IUseAxiosParams {
  url: string
  method: Method
  data?: {} | null
  headers?: { [key: string]: string }
}

export const useAxios = <T>({
  url,
  method,
  data = null,
  headers = null,
}: IUseAxiosParams) => {
  const [response, setResponse] = useState<AxiosResponse<T>>(null)
  const [error, setError] = useState<AxiosError<T>>(null)
  const [loading, setLoading] = useState(false)

  let axiosInstance = axios.create({
    // baseURL: `https://jsonplaceholder.typicode.com`,
    baseURL: `${process.env.NEXT_PUBLIC_RESTAPI_URL}`,
    headers: {
      'Content-Type': 'application/json',
      headers,
    },
    timeout: 1000,
  })

  const fetchData = () => {
    setLoading(true)
    axiosInstance[method](url, data, headers)
      .then((response: AxiosResponse<T>) => {
        setResponse(response)
      })
      .catch((error: AxiosError<T>) => {
        setError(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchData()
  }, [])

  return { response, error, loading }
}
