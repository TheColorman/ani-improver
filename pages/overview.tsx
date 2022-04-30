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
  const { getItem, setItem } = useStorage()
  const avatar = getItem('avatar')
  const username = getItem('username')
  const overviewDataString = getItem('overview')
  const [overviewData, setOverviewData] = useState<ApiOverview | null>(null)

  // Fetch data from API
  const fetchOverviewData = async (username: string) => {
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
        // Get overview data
        const success = await fetchOverviewData(username)
        if (!success) {
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

  // Create human readable string (years, months, days, hours, minutes, seconds)
  const calculateTimeString = ((millis: number) => {
    const years = Math.floor(millis / (1000 * 60 * 60 * 24 * 365))
    const months = Math.floor((millis % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30))
    const days = Math.floor((millis % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24))
    const hours = Math.floor((millis % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((millis % (1000 * 60 * 60)) / (1000 * 60))
    const timeStrings = [
      years > 0 ? `${years} year${years > 1 ? 's' : ''}` : '',
      months > 0 ? `${months} month${months > 1 ? 's' : ''}` : '',
      days > 0 ? `${days} day${days > 1 ? 's' : ''}` : '',
      hours > 0 ? `${hours} hour${hours > 1 ? 's' : ''}` : '',
      minutes > 0 ? `${minutes} minute${minutes > 1 ? 's' : ''}` : '',
    ]
    return timeStrings.filter(str => str != '').join(', ')
  })

  // Time on Anilist
  const timeSinceCreationMili = (Date.now() - (overviewData?.User.createdAt ?? 0) * 1000)
  const timeSinceCreation = calculateTimeString(timeSinceCreationMili)

  // User anime stats
  const completedAnime = overviewData?.User.statistics.anime.statuses.find(status => status.status === 'COMPLETED')?.count ?? 0
  const episodesComplete = overviewData?.User.statistics.anime.episodesWatched ?? 0
  const time = episodesComplete * 24 * 60 * 1000
  const timeWatched = calculateTimeString(time)

  // Global anime stats
  const totalAnimeOnAnilist = overviewData?.SiteStatistics.anime.edges[0].node.count ?? 0
  const globalMeanScore = 80//* Unknown *//

  return (
    <>
      <Head>
        <title>Overview</title>
      </Head>
      <div className='fixed w-screen h-36'>
        <Header />
        <Nav selected={"overview"} />
      </div>
      {overviewData ? (
        <div className='flex flex-col items-center absolute top-36 w-screen bg-[#e5ebf1]'>
          <div className='flex flex-row w-10/12 h-80 justify-center items-center gap-28 border-b-2 border-[#9dc1e0]'>
            <div className='flex flex-col justify-center text-center'>
              <h2 className='text-xl font-semibold'>Time on Anilist:</h2>
              <h3 className='text-lg'>{timeSinceCreation}</h3>
              <a
                href={`https://anilist.co/user/${getItem("username")}/`}
                className="text-sky-500"
                target="_blank"
                rel="noreferrer"
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
          <div className='mt-8 flex flex-col items-center w-11/12 justify-center'>
            <h1 className="text-2xl">Summary</h1>
            <div className="mt-4 grid grid-cols-2 gap-12">
              {/* Animes and episdes */}
              <div className='text-center'>
                <p className='text-xl font-semibold'>{completedAnime} anime completed</p>
                <p className='text-base'>{(completedAnime/totalAnimeOnAnilist*100).toPrecision(4)}% of all anime</p>
              </div>
              <div className="text-center">
                <p className='text-xl font-semibold'>{episodesComplete} episodes watched</p>
                <p className='text-base'>{timeWatched}</p>
              </div>
            </div>
            <div className="mt-6 flex flex-col items-center text-center">
              {/* Mean score */}
              <h1 className="text-xl font-semibold">Mean score</h1>
              <div className='bg-gray-400 w-24 h-1 rounded relative'>
                <div className='bg-blue-500 h-1 rounded absolute left-0' style={{
                  width: `${overviewData.User.statistics.anime.meanScore}%`
                }} />
                {/* Global mean score */}
                <div className='bg-blue-600 w-0.5 h-2 rounded absolute top-1/2 -translate-y-1/2' style={{
                  // Width: 6rem
                  left: `${globalMeanScore/100*6}rem`
                }} />
              </div>
              <h2 className="text-lg">{overviewData.User.statistics.anime.meanScore}</h2>
            </div>
          </div>
        </div>
      ) : (
        <div className='flex w-screen h-screen items-center justify-center'>
          {/* Loading indicator */}
          <div className='text-center'>
            <h1 className='text-xl'>Loading...</h1>
          </div>
        </div>
      )}
    </>
  )
}

export default Overview