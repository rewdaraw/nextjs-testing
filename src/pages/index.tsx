import { InferGetStaticPropsType } from 'next'
import { getAllPostsData } from '../lib/fetch'

// MEMO: InferGetStaticPropsType<typeof getStaticProps>でpropsの型を類推できる
type IProps = InferGetStaticPropsType<typeof getStaticProps>

const BlogPage: React.FC<IProps> = ({ posts }) => {
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
