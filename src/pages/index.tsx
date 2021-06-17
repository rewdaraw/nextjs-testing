import { InferGetStaticPropsType } from 'next'
import { getAllPostsData } from '../lib/fetch'
import Cookies from 'universal-cookie'
import { useState } from 'react'
import { useEffect } from 'react'

// MEMO: InferGetStaticPropsType<typeof getStaticProps>でpropsの型を類推できる
type IProps = InferGetStaticPropsType<typeof getStaticProps>

// TODO: 外部に切り出しコンポーネント毎にnew Cookies()しなくていいようにする
const cookie = new Cookies()

const BlogPage: React.FC<IProps> = ({ posts }) => {
  // ページに訪れるユーザーがログイン済みか判定するフラグ
  const [hasToken, setHasToken] = useState(false)
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
