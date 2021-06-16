import React from 'react'
import Head from 'next/head'
import Link from 'next/link'

interface ILayout {
  title: string
}

const Layout: React.FC<ILayout> = ({ children, title }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen font-sans">
      <Head>
        <title>{title}</title>
      </Head>
      <header className="shadow">
        <nav className="flex items-center w-screen h-16 px-4">
          <div className="p-2 rounded hover:text-gray-500">
            <Link href="/blog">
              <a data-testid="blog-nav">Blog</a>
            </Link>
          </div>
          <div className="p-2 rounded hover:text-gray-500">
            <Link href="/admin">
              <a data-testid="admin-nav">Admin</a>
            </Link>
          </div>
        </nav>
      </header>
      <main className="flex items-center justify-center flex-1">
        {children}
      </main>
      <footer className="flex items-center justify-center w-screen h-16">
        footer
      </footer>
    </div>
  )
}

export default Layout
