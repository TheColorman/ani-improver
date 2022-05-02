import type { NextPage } from 'next'
import Header from '../components/Header'
import Nav from '../components/Nav'

const Home: NextPage = () => {
  return (
    <>
    <div className='fixed w-screen h-36'>
      <Header />
      <Nav selected={"createlist"} />
    </div>
      <div className='flex justify-center items-center w-screen h-screen bg-[#e5ebf1]'>
        <div className='flex-col justify-center items-center max-w-3xl text-center'>
          <div>
            Vi nåede ikke at lave den her :(
          </div>
        </div>
      </div>
    </>
  )
}

export default Home