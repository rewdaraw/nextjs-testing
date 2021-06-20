import { getData } from '../hooks/useFetch'
import { IPost } from '../types/types'

export const getAllPostsData = async (): Promise<IPost[]> =>
  await getData('get-blogs')

export const getAllPostIds = async (): Promise<
  { params: { [slug: string]: string } }[]
> => {
  const posts: IPost[] = await getData('get-blogs')

  return posts.map((post) => {
    return { params: { id: String(post.id) } }
  })
}

export const getPostData = async (id: string): Promise<IPost> =>
  await getData(`get-blogs/${id}`)
