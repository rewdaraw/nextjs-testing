/**

* @jest-environment jsdom

*/

import { rest } from 'msw'
import { setupServer } from 'msw/node'

import '@testing-library/jest-dom'

import { initTestHelpers, getPage } from 'next-page-tester'

import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

initTestHelpers()
// テストファイルからは環境変数を読み込めないためここで代入
process.env.NEXT_PUBLIC_RESTAPI_URL = 'http://127.0.0.1:8000/api'

// 1. APIモックの作成
// handlers(擬似モック)の作成
const handlers = [
  // login時の/create/jwt/エンドポイントの成功レスポンスのモック
  rest.post(
    `${process.env.NEXT_PUBLIC_RESTAPI_URL}/jwt/create/`,
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json({ access: 'xxx123' }))
    }
  ),
  // Create user時の/register/エンドポイントの成功レスポンスのモック
  rest.post(
    `${process.env.NEXT_PUBLIC_RESTAPI_URL}/register/`,
    (req, res, ctx) => {
      return res(ctx.status(201), ctx.json({ id: 9, username: 'user8' }))
    }
  ),
  // Blog一覧取得時の/get-blogs/エンドポイントの成功レスポンスのモック
  rest.get(
    `${process.env.NEXT_PUBLIC_RESTAPI_URL}/get-blogs/`,
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json([
          {
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
          },
          {
            id: 2,
            title: 'mock-title2',
            content: 'mock-content2',
            username: 'mock-username2',
            tags: [
              {
                id: 3,
                name: 'mock-tagname3',
              },
              {
                id: 4,
                name: 'mock-tagname4',
              },
            ],
            created_at: '2012-12-12 12:12:12',
          },
        ])
      )
    }
  ),
]

// 2. server(擬似サーバー)の作成
const server = setupServer(...handlers)
// Establish API mocking before all tests.
beforeAll(() => server.listen())
// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers())
// Clean up after the tests are finished.
afterAll(() => server.close())

// 3. テストケースの作成
describe('Admin pageのテスト', () => {
  it('Should route to index page when login succeeded', async () => {
    // まずはadmin pageを取得、入力サブミットの結果自動でblog一覧ページに遷移するかどうか
    // admin pageを取得して描画
    const { render } = await getPage({ route: '/admin' })
    render()
    // Loginという文字があること
    expect(await screen.findByText('Login')).toBeInTheDocument()
    // username, passwordを入力
    userEvent.type(screen.getByPlaceholderText('Username'), 'user1')
    userEvent.type(screen.getByPlaceholderText('Password'), 'user1')
    // submitする
    userEvent.click(screen.getByText('Login with JWT'))
    // Blog pageという文字があること
    expect(await screen.findByText('Blog page')).toBeInTheDocument()
  })

  it('Should not route to index page when login failed', async () => {
    // ログイン失敗時のAPIレスポンスのモックを変更して上書き
    server.use(
      rest.post(
        `${process.env.NEXT_PUBLIC_RESTAPI_URL}/jwt/create/`,
        (req, res, ctx) => {
          return res(ctx.status(400))
        }
      )
    )

    const { render } = await getPage({ route: '/admin' })
    render()
    expect(await screen.findByText('Login')).toBeInTheDocument()
    userEvent.type(screen.getByPlaceholderText('Username'), 'user1')
    userEvent.type(screen.getByPlaceholderText('Password'), 'user1')
    userEvent.click(screen.getByText('Login with JWT'))
    expect(await screen.findByText('Loginに失敗しました')).toBeInTheDocument()
    expect(screen.queryByText('Blog page')).toBeNull()
  })

  it('Should change to register mode', async () => {
    const { render } = await getPage({ route: '/admin' })
    render()
    userEvent.click(screen.getByTestId('mode-change'))
    expect(screen.getByText('Sign up')).toBeInTheDocument()
  })

  it('Should route to index when register + login succeeded', async () => {
    const { render } = await getPage({ route: '/admin' })
    render()
    expect(await screen.findByText('Login')).toBeInTheDocument()
    userEvent.click(screen.getByTestId('mode-change'))
    userEvent.type(screen.getByPlaceholderText('Username'), 'user1')
    userEvent.type(screen.getByPlaceholderText('Password'), 'user1')
    userEvent.click(screen.getByText('Create new user'))
    expect(await screen.findByText('Blog page')).toBeInTheDocument()
  })

  it('Should not route to index when register + login failed', async () => {
    server.use(
      rest.post(
        `${process.env.NEXT_PUBLIC_RESTAPI_URL}/register/`,
        (req, res, ctx) => {
          return res(ctx.status(400))
        }
      )
    )

    const { render } = await getPage({ route: '/admin' })
    render()
    expect(await screen.findByText('Login')).toBeInTheDocument()
    userEvent.click(screen.getByTestId('mode-change'))
    userEvent.type(screen.getByPlaceholderText('Username'), 'user1')
    userEvent.type(screen.getByPlaceholderText('Password'), 'user1')
    userEvent.click(screen.getByText('Create new user'))
    expect(
      await screen.findByText('Create userに失敗しました')
    ).toBeInTheDocument()
    expect(screen.queryByText('Blog page')).toBeNull()
  })
})
