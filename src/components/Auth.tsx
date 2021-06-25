import axios, { AxiosResponse } from 'axios'
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Cookies from 'universal-cookie'
import { useAxios } from '../hooks/useAxios'

const cookie = new Cookies()

const Auth: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true) // Login mode希望しているかどうか
  const [error, setError] = useState('')
  const router = useRouter()

  const login = async () => {
    const response = await useAxios({
      url: 'jwt/create/',
      method: 'post',
      data: { username, password },
    }).catch((error) => {
      setError('Loginに失敗しました')
      console.log({ error })
    })

    if (response) {
      // type guard
      const isLoginSuccess = (
        res: any
      ): res is AxiosResponse<{ access: string; refresh: string }> => {
        return res.data.access
      }

      if (isLoginSuccess(response)) {
        cookie.set('access_token', response.data.access, { path: '/' })
        router.push('/')
      }
    }
  }

  const authUser = async (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isLogin) {
      login()
    } else {
      const response = await useAxios({
        url: 'register/',
        method: 'post',
        data: { username, password },
      }).catch(() => {
        setError('Create userに失敗しました')
        console.log({ error })
      })

      if (response) {
        // type guard
        const isAuthSuccess = (
          res: any
        ): res is AxiosResponse<{ username: string; password: string }> => {
          return res.data.username
        }

        if (isAuthSuccess) login()
      }
    }
  }

  return (
    <>
      <p className="text-3xl text-center">{isLogin ? 'Login' : 'Sign up'}</p>
      <form className="mt-8 space-y-3" onSubmit={authUser}>
        <div>
          <input
            type="text"
            required
            className="px-3 py-2 border border-gray-300"
            placeholder="Username"
            value={username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setUsername(e.target.value)
            }
          />
        </div>
        <div>
          <input
            type="password"
            required
            className="px-3 py-2 border border-gray-300"
            placeholder="Password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
          />
        </div>
        <p
          data-testid="mode-change"
          className="flex flex-col items-center justify-center font-medium cursor-pointer hover:text-indigo-500 "
          onClick={() => {
            setIsLogin(!isLogin)
            setError('')
          }}
        >
          change mode ?
        </p>

        <div className="flex flex-col items-center justify-center">
          <button
            disabled={!username || !password}
            type="submit"
            className="px-4 py-2 text-white bg-indigo-600 disabled:opacity-40 hover:bg-indigo-700 focus:outline-none"
          >
            {isLogin ? 'Login with JWT' : 'Create new user'}
          </button>
        </div>
      </form>
      {error && <p className="mt-5 text-red-600">{error}</p>}
    </>
  )
}
export default Auth
