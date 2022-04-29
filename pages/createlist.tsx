import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Script from 'next/script'
import styles from '../styles/Home.module.css'
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
            I'm stuff
          </div>
        </div>
      </div>
    </>
  )
}

export default Home