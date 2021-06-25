import { IPost } from '../types/types'
import { useServerAxios } from '../hooks/useFetch'
import { AxiosResponse } from 'axios'

export const getAllPostsData = async () => {
  const res = await useServerAxios<IPost[]>({
    url: "get-blogs",
    method: "get"
  })

  // type guard
  const isAllPostResponse = (res: any): res is AxiosResponse<IPost[]> => {
    return res.data
  }

  if (isAllPostResponse(res)) {
    return res.data
  }
}

export const getAllPostIds = async () => {
  const res = await useServerAxios<IPost[]>({
    url: `get-blogs`,
    method: 'get',
  })

  // type guard
  const isAllPostResponse = (res: any): res is AxiosResponse<IPost[]> => {
    return res.data
  }

  if (isAllPostResponse(res)) {
    return res.data.map((post) => {
      return { params: { id: String(post.id) } }
    })
  }
}

export const getPostData = async (id: string) => {
  const res = await useServerAxios<IPost>({
    url: `get-blogs/${id}`,
    method: 'get',
  })

  // type guard
  const isPostResponse = (res: any): res is AxiosResponse<IPost> => {
    return res.data
  }

  if (isPostResponse(res)) {
    return res.data
  }
}
