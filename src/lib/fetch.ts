import { IPost } from '../types/types'
import { useAxios } from '../hooks/useAxios'
import { AxiosResponse } from 'axios'

export const getAllPostsData = async () => {
  const res = await useAxios<IPost[]>({
    url: 'get-blogs',
    method: 'get',
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
  const res = await useAxios<IPost[]>({
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
  const res = await useAxios<IPost>({
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
