import { InferGetStaticPropsType } from 'next'
import { getAllPostsData } from '../lib/fetch'
import Cookies from 'universal-cookie'
import { useState } from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import Layout from '../components/Layout'
import Link from 'next/link'

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

  // TODO: 外部に切り出しaxiosInstance呼ぶだけにする
  const deletePost = async (id: number) => {
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
      .delete(`${process.env.NEXT_PUBLIC_RESTAPI_URL}/delete-blog/${id}`)
      .catch((error) => {
        console.log(error)
      })
  }

  // cookieが存在するかしないかの判定
  useEffect(() => {
    if (cookie.get('access_token')) {
      setHasToken(true)
    }
  }, [])

  return (
    <Layout title="Blog">
      <p className="mb-10 text-4xl">Blog page</p>
      <ul>
        {posts &&
          posts.map((post) => (
            <li key={post.id}>
              <Link href={`/posts/${post.id}`}>
                <a className="border-b border-gray-500 cursor-pointer hover:bg-gray-300">
                  {post.title}
                </a>
              </Link>
              {hasToken && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="float-right w-6 h-6 ml-10 cursor-pointer"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  onClick={() => {
                    deletePost(post.id)
                  }}
                  data-testid={`btn-${post.id}`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              )}
            </li>
          ))}
      </ul>
      {hasToken && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 mt-10 cursor-pointer"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          onClick={logout}
          data-testid="logout-icon"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
      )}
    </Layout>
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
