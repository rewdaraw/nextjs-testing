const Auth: React.FC = () => {
  return (
    <>
      <p className="text-3xl text-center">'Login' : 'Sign up'</p>
      <form className="mt-8 space-y-3">
        <div>
          <input
            type="text"
            required
            className="px-3 py-2 border border-gray-300"
            placeholder="Username"
            value="username"
          />
        </div>
        <div>
          <input
            type="password"
            required
            className="px-3 py-2 border border-gray-300"
            placeholder="Password"
            value="password"
          />
        </div>
        <p
          data-testid="mode-change"
          className="flex flex-col items-center justify-center font-medium cursor-pointer hover:text-indigo-500 "
        >
          change mode ?
        </p>

        <div className="flex flex-col items-center justify-center">
          <button
            // disabled={!username || !password}
            type="submit"
            className="px-4 py-2 text-white bg-indigo-600 disabled:opacity-40 hover:bg-indigo-700 focus:outline-none"
          >
            'Login with JWT' : 'Create new user'
          </button>
        </div>
      </form>
      <p className="mt-5 text-red-600">error</p>
    </>
  )
}
export default Auth
