import * as nextRouter from 'next/router'
// @ts-ignore
nextRouter.useRouter = jest.fn()
// @ts-ignore
export const mockedRouter = nextRouter.useRouter.mockImplementation(() => ({
  isFallback: false,
}))
