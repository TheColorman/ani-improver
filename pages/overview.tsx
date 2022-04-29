import type { NextPage } from 'next'
import type { ApiOverviewResponse, ApiOverview } from '../types'
import Header from '../components/Header'
import Nav from '../components/Nav'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import useStorage from '../lib/useStorage'
import { useState, useEffect } from 'react'

const RedirectUser = () => (
  <>
    <Head>
      <title>Overview | Not logged in</title>
    </Head>
    <div className='fixed w-screen h-36'>
      <Header />
      <Nav selected={"overview"} />
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


const Overview: NextPage = () => {
  const { getItem, setItem, isBrowser } = useStorage()
  const avatar = getItem('avatar')
  const username = getItem('username')
  const overviewDataString = getItem('overview')
  const [overviewData, setOverviewData] = useState<ApiOverview | null>(null)

  // Fetch data from API
  const fetchOverviewData = async (username: string) => {
    console.log("Fetching new data");
    const data = (await fetch(`/api/overview?username=${username}`).then(res => res.json())) as ApiOverviewResponse

    if (("error" in data) || data.User == null) {
      return false
    }
    setItem('overview', JSON.stringify(data))
    setOverviewData(data)
    return true
  }

  useEffect(() => {
    // If overview data is not set, fetch it
    if (!overviewDataString) {
      (async () => {
        console.log("No data found");
        // Get overview data
        const success = await fetchOverviewData(username)
        if (!success) {
          console.log("Failed to fetch data");
          return
        }
      })()
    } else {
      // If overview data is set, parse it
      setOverviewData(JSON.parse(overviewDataString))
    }
  }, [])

  if (!username || !avatar) {
    // Redirect user to homepage
    return <RedirectUser />
  }

  const timeSinceCreationMili = (Date.now() - (overviewData?.User.createdAt ?? 0) * 1000)
  // Create human readable string (years, months, days, hours, minutes, seconds)
  const timeSinceCreation = (() => {
    const years = Math.floor(timeSinceCreationMili / (1000 * 60 * 60 * 24 * 365))
    const months = Math.floor((timeSinceCreationMili % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30))
    const days = Math.floor((timeSinceCreationMili % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24))
    const hours = Math.floor((timeSinceCreationMili % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((timeSinceCreationMili % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((timeSinceCreationMili % (1000 * 60)) / 1000)
    const timeStrings = [
      years > 0 ? `${years} year${years > 1 ? 's' : ''}` : '',
      months > 0 ? `${months} month${months > 1 ? 's' : ''}` : '',
      days > 0 ? `${days} day${days > 1 ? 's' : ''}` : '',
      hours > 0 ? `${hours} hour${hours > 1 ? 's' : ''}` : '',
      minutes > 0 ? `${minutes} minute${minutes > 1 ? 's' : ''}` : '',
      seconds > 0 ? `${seconds} second${seconds > 1 ? 's' : ''}` : '',
    ]
    return timeStrings.filter(str => str != '').join(', ')
  })()

  return (
    <>
      <Head>
        <title>Overview</title>
      </Head>
      <div className='fixed w-screen h-36'>
        <Header />
        <Nav selected={"overview"} />
      </div>
      <div className='flex flex-col absolute top-36 w-screen bg-[#e5ebf1]'>
        {overviewData ? (
          <div className='flex flex-row w-11/12 h-96 justify-center items-center gap-28 border-b-2 border-[#9dc1e0]'>
            <div className='flex flex-col justify-center text-center'>
              <h2 className='text-xl'>Time on Anilist: {timeSinceCreation}</h2>
              <a
                href={`https://anilist.co/user/${getItem("username")}/`}
                className="text-sky-500"
              >
                Go to profile
              </a>
            </div>
            <Image
              src={avatar}
              width={200}
              height={200}
              alt='avatar'
              className='rounded'
            />
          </div>
        ) : (
          <div className='flex w-screen h-screen items-center justify-center'>
            {/* Loading indicator */}
            <div className='text-center'>
              <h1 className='text-xl'>Loading...</h1>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Overview