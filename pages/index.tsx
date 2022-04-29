import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Script from 'next/script'
import styles from '../styles/Home.module.css'
import Header from '../components/Header'

const Home: NextPage = () => {
  return (
    <>
      <Header />
      <div className='flex justify-center items-center w-screen h-screen bg-[#e5ebf1]'>
        <div className='flex-col justify-center items-center max-w-3xl text-center'>
          <div>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            Possimus, fuga tempore deserunt eaque, accusantium, ea omnis ducimus modi obcaecati quibusdam saepe
            eius optio debitis? Deserunt temporibus magnam quos eos quo blanditiis quia? Dicta, quod consequatur
            perspiciatis debitis quisquam at maiores facere suscipit tempore nobis? Enim consectetur iusto nemo hic sint!
            Earum est adipisci provident, minus porro facilis! Sit, excepturi quod!
          </div>
          <div className='flex justify-center items-center'>
            <input type="text" placeholder="Username" className='m-2 p-2 border-2 border-black' />
            <button className='bg-[#b368e6] m-2 p-2'>Proceed</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home