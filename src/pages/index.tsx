import { InferGetStaticPropsType } from 'next'
import { getAllPostsData } from '../lib/fetch'
import Cookies from 'universal-cookie'
import { useState } from 'react'
import axios from 'axios'
import { useEffect } from 'react'

// MEMO: InferGetStaticPropsType<typeof getStaticProps>でpropsの型を類推できる
type IProps = InferGetStaticPropsType<typeof getStaticProps>

// TODO: 外部に切り出しコンポーネント毎にnew Cookies()しなくていいようにする
const cookie = new Cookies()

const BlogPage: React.FC<IProps> = ({ posts }) => {
  // ページに訪れるユーザーがログイン済みか判定するフラグ
  const [hasToken, setHasToken] = useState(false)

  const logout = () => {
    cookie.remove('access_token')
    setHasToken(false)
  }

  const deletePost = async (id: string) => {
    const axiosInstance = axios.create({
      baseURL: `${process.env.NEXT_PUBLIC_RESTAPI_URL}`,
    })
    axiosInstance.interceptors.request.use(
      (config) => {
        if (cookie.get('access_token')) {
          config.headers.Authorization = `JWT ${cookie.get('access_token')}`
          return config
        }
      },
      function (error) {
        return Promise.reject(error)
      }
    )
    await axiosInstance
      .delete(`${process.env.local}/delete-blog/${id}`)
      .catch(() => {
        throw new Error('削除リクエストに失敗しました')
      })
  }

  // cookieが存在するかしないかの判定
  useEffect(() => {
    if (cookie.get('access_token')) {
      setHasToken(true)
    }
    return () => {
      // cleanup
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen font-mono">
      Hello Nextjs
      {posts &&
        posts.map((post) => (
          <p className="text-2xl" key={post.title}>
            {post.title}
          </p>
        ))}
    </div>
  )
}
export default BlogPage

export const getStaticProps = async () => {
  const posts = await getAllPostsData()

  return {
    props: { posts },
    revalidate: 3,
  }
}
