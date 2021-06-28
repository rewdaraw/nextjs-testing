import { rest } from 'msw'

// テストファイルからは環境変数を読み込めないためここで代入
process.env.NEXT_PUBLIC_RESTAPI_URL = 'http://127.0.0.1:8000/api'

export const handlers = [
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
