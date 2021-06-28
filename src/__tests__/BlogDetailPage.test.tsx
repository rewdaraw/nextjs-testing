/**

* @jest-environment jsdom

*/

import '@testing-library/jest-dom'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { getPage, initTestHelpers } from 'next-page-tester'
import { server } from '../mocks/server'
initTestHelpers()

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('Blog Detail pageのテスト', () => {
  it('Should render Blog Detail content of ID 1', async () => {
    // Blog Detail pageを取得、描画
    const { render } = await getPage({ route: '/posts/1' })
    render()
    // title, content, username, tag, created_at, 戻るボタンが表示されている事を確認
    expect(await screen.findByText('mock-title1')).toBeInTheDocument()
    expect(screen.getByText('mock-content1')).toBeInTheDocument()
    expect(screen.getByText('by mock-username1')).toBeInTheDocument()
    expect(screen.getByText('mock-tagname1')).toBeInTheDocument()
    expect(screen.getByText('mock-tagname2')).toBeInTheDocument()
    expect(screen.getByText('2011-11-11 11:11:11')).toBeInTheDocument()
    expect(screen.getByTestId('back-blog')).toBeInTheDocument()
  })

  it('Should render Blog Detail content of ID 2', async () => {
    // Blog Detail pageを取得、描画
    const { render } = await getPage({ route: '/posts/2' })
    render()
    // title, content, username, tag, created_at, 戻るボタンが表示されている事を確認
    expect(await screen.findByText('mock-title2')).toBeInTheDocument()
    expect(screen.getByText('mock-content2')).toBeInTheDocument()
    expect(screen.getByText('by mock-username2')).toBeInTheDocument()
    expect(screen.getByText('mock-tagname3')).toBeInTheDocument()
    expect(screen.getByText('mock-tagname4')).toBeInTheDocument()
    expect(screen.getByText('2012-12-12 12:12:12')).toBeInTheDocument()
    expect(screen.getByTestId('back-blog')).toBeInTheDocument()
  })

  it('Should route back to Blog page', async () => {
    // Blog Detail pageを取得、描画
    const { render } = await getPage({ route: '/posts/1' })
    render()
    // 戻るボタン押下でBlog pageへ画面遷移する事を確認
    expect(await screen.findByTestId('back-blog')).toBeInTheDocument()
    userEvent.click(screen.getByTestId('back-blog'))
    expect(await screen.findByText('Blog page')).toBeInTheDocument()
  })
})
