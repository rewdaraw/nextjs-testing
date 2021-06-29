/**

* @jest-environment jsdom

*/

import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import PostDetail from '../pages/posts/[id]'
import { IPost } from '../types/types'
import { mockedRouter } from '../mocks/router'

describe('Blog Detail pageのテスト', () => {
  const dummyProps: IPost = {
    id: 1,
    title: 'mock-title1',
    content: 'mock-content1',
    username: 'mock-username1',
    tags: [
      {
        id: 1,
        name: 'mock-tagname1',
      },
      {
        id: 2,
        name: 'mock-tagname2',
      },
    ],
    created_at: '2011-11-11 11:11:11',
  }

  // mockしたuseRouterを実行
  mockedRouter()

  it('Should render correctly with given props value', async () => {
    // PostDetailコンポーネントを描画
    render(<PostDetail {...{ post: dummyProps }} />)
    // Propsのデータが描画されている事を確認
    expect(await screen.findByText(dummyProps.title)).toBeInTheDocument()
    expect(screen.getByText(dummyProps.content)).toBeInTheDocument()
    expect(screen.getByText(`by ${dummyProps.username}`)).toBeInTheDocument()
    expect(screen.getByText(dummyProps.tags[0].name)).toBeInTheDocument()
    expect(screen.getByText(dummyProps.tags[1].name)).toBeInTheDocument()
    expect(screen.getByText(dummyProps.created_at)).toBeInTheDocument()
  })
})
