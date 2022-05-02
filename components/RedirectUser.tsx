import Head from "next/head"
import Link from "next/link"
import Header from "./Header"
import Nav from "./Nav"

const RedirectUser = ({ title, page }: { title: string, page: 'overview' | 'stats' | 'yourlists' | 'createlist'}) => (
  <>
    <Head>
      <title>{title} | Not logged in</title>
    </Head>
    <div className='fixed w-screen h-36'>
      <Header />
      <Nav selected={page} />
    </div>
    <div className="flex w-screen h-screen justify-center items-center bg-[#e5ebf1]">
      <div className='text-center'>
        <h1 className='text-xl'>No username provided</h1>
        <Link
          href='/'
        >
          <a className='text-lg text-sky-500 hover:underline'>
            Go back
          </a>
        </Link>
      </div>
    </div>
  </>
)

export default RedirectUser