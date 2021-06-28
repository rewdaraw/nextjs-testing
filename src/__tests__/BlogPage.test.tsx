/**

* @jest-environment jsdom

*/

import { initTestHelpers, getPage } from 'next-page-tester'
import '@testing-library/jest-dom'
import { screen } from '@testing-library/react'

import { server } from '../mocks/server'
import userEvent from '@testing-library/user-event'

initTestHelpers()

beforeAll(() => server.listen())
afterEach(() => {
  server.resetHandlers()
  document.cookie =
    'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
})
afterAll(() => server.close())

// 3. テストケースの作成
describe('Blog Pageのテスト', () => {
  it('Should route to Admin page and route back to Blog page', async () => {
    // Blog pageを取得
    const { render } = await getPage({ route: '/' })
    // Blog pageを描画
    render()
    // "Admin"という文字列があるか確認
    expect(screen.getByText('Admin')).toBeInTheDocument()
    // "Admin"をクリック
    userEvent.click(screen.getByText('Admin'))
    // "Login"という文字列があるか確認
    expect(await screen.findByText('Login')).toBeInTheDocument()
    // "Blog"をクリック
    userEvent.click(screen.getByText('Blog'))
    // "Blog page"という文字列があるか確認
    expect(await screen.findByText('Blog page')).toBeInTheDocument()
  })

  it('Should render Trash / Logout icon when JWT token is in cookie', async () => {
    // cookieを擬似的に割当て
    document.cookie = 'access_token=123xyz'
    // Blog pageを取得
    const { render } = await getPage({ route: '/' })
    // Blog pageを描画
    render()
    // "Blog page"という文字列があるか確認
    expect(await screen.findByText('Blog page')).toBeInTheDocument()
    // Trash / Logout iconがあるか確認
    expect(screen.getByTestId('btn-1')).toBeInTheDocument()
    expect(screen.getByTestId('btn-2')).toBeInTheDocument()
    expect(screen.getByTestId('logout-icon')).toBeInTheDocument()
  })

  it('Should not render Trash / Logout icon when JWT token is not in cookie', async () => {
    // Blog pageを取得
    const { render } = await getPage({ route: '/' })
    // Blog pageを描画
    render()
    // "Blog page"という文字列があるか確認
    expect(await screen.findByText('Blog page')).toBeInTheDocument()
    // Trash / Logout iconがないか確認
    expect(screen.queryByTestId('btn-1')).toBeNull()
    expect(screen.queryByTestId('btn-2')).toBeNull()
    expect(screen.queryByTestId('logout-icon')).toBeNull()
  })

  it('Should render the list of blogs pre-fetched by getStaticProps', async () => {
    // Blog pageを取得
    const { render } = await getPage({ route: '/' })
    // Blog pageを描画
    render()
    // "Blog page"という文字列があるか確認
    expect(await screen.findByText('Blog page')).toBeInTheDocument()
    // 記事のタイトルがあるか確認
    expect(screen.getByText('mock-title1')).toBeInTheDocument()
    expect(screen.getByText('mock-title2')).toBeInTheDocument()
  })
})
