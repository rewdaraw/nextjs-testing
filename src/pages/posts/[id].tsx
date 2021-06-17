import React from 'react'
import {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from 'next'
import { getAllPostIds, getPostData } from '../../lib/fetch'
import Layout from '../../components/Layout'
import Link from 'next/link'

type IProps = InferGetStaticPropsType<typeof getStaticProps>

const PostDetail: React.VFC<IProps> = ({ post }) => {
  return (
    <Layout title={post.title}>
      <div>
        {post.tags &&
          post.tags.map((tag, i) => (
            <span
              key={tag.id}
              className={`px-2 py-2 m-1 text-white rounded ${
                i === 0
                  ? 'bg-blue-500'
                  : 1
                  ? 'bg-gray-500'
                  : 2
                  ? 'bg-green-500'
                  : 3
                  ? 'bg-yellow-500'
                  : 4
                  ? 'bg-purple-500'
                  : 'bg-gray-500'
              }`}
            >
              {tag.name}
            </span>
          ))}
      </div>
      <p className="m-10 text-xl font-bold">{post.title}</p>
      <p className="mx-10 mb-12">{post.content}</p>
      <p>{post.created_at}</p>
      <p className="mt-3">
        {'by '} {post.username}
      </p>
      <Link href="/">
        <div className="flex justify-center mt-12 cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 mr-3"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          <a data-testid="back-blog">Back to Blog page</a>
        </div>
      </Link>
    </Layout>
  )
}

export default PostDetail

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await getAllPostIds()

  return {
    paths,
    fallback: true,
  }
}

export const getStaticProps = async (ctx: GetStaticPropsContext) => {
  const post = await getPostData(ctx.params.id as string)

  return {
    props: {
      post,
    },
    revalidate: 3,
  }
}
