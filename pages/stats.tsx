import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Header from '../components/Header'
import Nav from '../components/Nav'
import { Tooltip, Zoom } from '@mui/material'
import unixToRelative from '../lib/unixToRelative'

const Home: NextPage = () => {


  return (
    <>
    <Head>
      <title>Stats</title>
    </Head>
      <div className='fixed w-screen h-36'>
        <Header />
        <Nav selected={"stats"} />
      </div>
      <div className='flex flex-col items-center absolute top-36 w-full bg-[#e5ebf1] py-12'>
        {/* Anime */}
        <div className='w-10/12 grid grid-cols-2 gap-12 border-b-2 border-[#9dc1e0] pb-12'>
          <div className='rounded bg-[#fafafa] flex h-36'>
            <div className='min-w-[102px] h-full'>
              <Image className='rounded-l' width={102} height={144} src="https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx102976-WcNjDFdQbdCv.png" alt="Thumbnail" />
            </div>
            <div className='ml-2'>
              <h2 className='text-sm'>Most watched series</h2>
              <h1 className='text-xl font-medium hover:text-sky-500 hover:cursor-pointer hover:underline'>Anime name</h1>
              <p className='text-lg'><strong>123</strong> episodes</p>
              <p className='text-sm'>24 days, 16 hours, 12 minutes</p>
            </div>
          </div>
          <div className='rounded bg-[#fafafa] flex h-36'>
            <div className='min-w-[102px] h-full'>
              <Image className='rounded-l' width={102} height={144} src="https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx102976-WcNjDFdQbdCv.png" alt="Thumbnail" />
            </div>
            <div className='ml-2'>
              <h2 className='text-sm'>Most ???</h2>
              <h1 className='text-xl font-medium hover:text-sky-500 hover:cursor-pointer hover:underline'>Anime name</h1>
              <p className='text-lg'>Subtext</p>
            </div>
          </div>
          <div className='rounded bg-[#fafafa] flex h-36'>
            <div className='min-w-[102px] h-full'>
              <Image className='rounded-l' width={102} height={144} src="https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx102976-WcNjDFdQbdCv.png" alt="Thumbnail" />
            </div>
            <div className='ml-2'>
              <h2 className='text-sm'>Most underground series</h2>
              <h1 className='text-xl font-medium hover:text-sky-500 hover:cursor-pointer hover:underline'>Anime name</h1>
              <p className='text-lg'>Only <strong>12</strong> people have this in their list</p>
            </div>
          </div>
          <div className='rounded bg-[#fafafa] flex h-36'>
            <div className='min-w-[102px] h-full'>
              <Image className='rounded-l' width={102} height={144} src="https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx102976-WcNjDFdQbdCv.png" alt="Thumbnail" />
            </div>
            <div className='ml-2'>
              <h2 className='text-sm'>Most liked underground series</h2>
              <h1 className='text-xl font-medium hover:text-sky-500 hover:cursor-pointer hover:underline'>Anime name</h1>
              <p className='text-lg'>Only <strong>12</strong> people have this in their list</p>
              <p>You scored <strong>90</strong></p>
            </div>
          </div>
          <div className='rounded bg-[#fafafa] flex h-36'>
            <div className='min-w-[102px] h-full'>
              <Image className='rounded-l' width={102} height={144} src="https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx102976-WcNjDFdQbdCv.png" alt="Thumbnail" />
            </div>
            <div className='ml-2'>
              <h2 className='text-sm'>Most hated good series</h2>
              <h1 className='text-xl font-medium hover:text-sky-500 hover:cursor-pointer hover:underline'>Anime name</h1>
              <p className='text-lg'>Your score: <strong>10</strong></p>
              <p className='text-lg'>Average score: <strong>90</strong></p>
            </div>
          </div>
          <div className='rounded bg-[#fafafa] flex h-36'>
            <div className='min-w-[102px] h-full'>
              <Image className='rounded-l' width={102} height={144} src="https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx102976-WcNjDFdQbdCv.png" alt="Thumbnail" />
            </div>
            <div className='ml-2'>
              <h2 className='text-sm'>Most liked bad series</h2>
              <h1 className='text-xl font-medium hover:text-sky-500 hover:cursor-pointer hover:underline'>Anime name</h1>
              <p className='text-lg'>Your score: <strong>90</strong></p>
              <p className='text-lg'>Average score: <strong>10</strong></p>
            </div>
          </div>
        </div>
        {/* Genres/tags */}
        <div className='w-10/12 grid grid-cols-2 gap-12 border-b-2 border-[#9dc1e0] py-12'>
          <div className="bg-white relative rounded">
            <div className='min-w-[102px] absolute right-0 top-0'>
              <Image className='rounded-tr' width={102} height={144} src="https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx102976-WcNjDFdQbdCv.png" alt="Thumbnail" />
            </div>
            <div className='m-2 ml-3'>
              <h1 className='text-xl'>Top 5 genres</h1>
              <div className='ml-6'>
                <ol className='list-decimal'>
                  {new Array(5).fill("Action").map((genre, i) => (
                    <li key={i}>{genre}</li>
                  ))}
                </ol>
                <h2 className='-ml-3'>Based on ANIME TITLES</h2>
              </div>
            </div>
          </div>
          <div className="bg-white relative rounded">
            <div className='min-w-[102px] absolute right-0 top-0'>
              <Image className='rounded-tr' width={102} height={144} src="https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx102976-WcNjDFdQbdCv.png" alt="Thumbnail" />
            </div>
            <div className='m-2 ml-3'>
              <h1 className='text-xl'>Top 5 genres</h1>
              <div className='ml-6 max-w-[60%] h-auto'>
                <ol className='list-decimal'>
                  {new Array(5).fill("Isekai").map((genre, i) => (
                    <li key={i}>{genre}</li>
                  ))}
                </ol>
                <h2 className='-ml-3'>Based on ANIME TITLES</h2>
              </div>
            </div>
          </div>
        </div>
        {/* People */}
        <div className='w-10/12 grid grid-cols-2 gap-12 border-b-2 border-[#9dc1e0] py-12'>
          <div className='rounded bg-[#fafafa] flex h-36'>
            <div className='min-w-[102px] h-full'>
              <Image className='rounded-l' width={102} height={144} src="https://s4.anilist.co/file/anilistcdn/staff/large/n119331-0CYDTh2mwy62.png" alt="Thumbnail" />
            </div>
            <div className='ml-2'>
              <h2 className='text-sm'>Highested rated person</h2>
              <h1 className='text-xl font-semibold'>Name</h1>
              <ul>
                {new Array(2).fill({ role: "Visual Effects", source: "Neon Genesis Evangelion" }).map((role: { role: string, source: string }, i) => (
                  <li key={i} className='ml-2'>
                    <Tooltip title={role.role} arrow TransitionComponent={Zoom} disableInteractive>
                      <p>{role.source.length > 48 ? role.source.slice(0, 48) + '...' : role.source}</p>
                    </Tooltip>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className='rounded bg-[#fafafa] flex h-36'>
            <div className='min-w-[102px] h-full'>
              <Image className='rounded-l' width={102} height={144} src="https://s4.anilist.co/file/anilistcdn/staff/large/n119331-0CYDTh2mwy62.png" alt="Thumbnail" />
            </div>
            <div className='ml-2'>
              <h2 className='text-sm'>Highest rated director</h2>
              <h1 className='text-xl font-semibold'>Name</h1>
              <ul>
                {new Array(2).fill({ title: "KONOSUBA: God's Blessing on this Wonderful World", rating: 100 }).map(({ title, rating }: { title: string, rating: number }, i) => (
                  <li key={i} className='ml-2'>
                    <Tooltip title={`Your rating: ${rating}`} arrow TransitionComponent={Zoom} disableInteractive>
                      <p>{title.length > 22 ? title.slice(0, 22) + '...' : title}</p>
                    </Tooltip>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className='rounded bg-[#fafafa] flex h-36'>
            <div className='min-w-[102px] h-full'>
              <Image className='rounded-l' width={102} height={144} src="https://s4.anilist.co/file/anilistcdn/staff/large/n119331-0CYDTh2mwy62.png" alt="Thumbnail" />
            </div>
            <div className='ml-2'>
              <h2 className='text-sm'>Highested rated voice actor</h2>
              <h1 className='text-xl font-semibold'>Name</h1>
              <ul>
                {new Array(2).fill({ character: "Astolfo", anime: "Neon Genesis Evangelion", rating: 90 }).map(({ character, anime, rating }: { character: string, anime: string, rating: number }, i) => (
                  <li key={i} className='ml-2'>
                    <Tooltip title={`${anime} - ${rating}`} arrow TransitionComponent={Zoom} disableInteractive>
                      <p>{character.length > 48 ? character.slice(0, 48) + '...' : character}</p>
                    </Tooltip>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className='rounded bg-[#fafafa] flex h-36'>
            <div className='min-w-[102px] h-full'>
              <Image className='rounded-l' width={102} height={144} src="https://s4.anilist.co/file/anilistcdn/staff/large/n119331-0CYDTh2mwy62.png" alt="Thumbnail" />
            </div>
            <div className='ml-2'>
              <h2 className='text-sm'>Most watched voice actor</h2>
              <h1 className='text-xl font-semibold'>Name</h1>
              <h2>10 days 8 hours</h2>
              <ul>
                {new Array(2).fill({ character: "Iskandar", time: Date.now() }).map(({ character, time }: { character: string, time: number }, i) => (
                  <li key={i} className='ml-2'>
                    <Tooltip title={unixToRelative(time)} arrow TransitionComponent={Zoom} disableInteractive>
                      <p>{character.length > 48 ? character.slice(0, 48) + '...' : character}</p>
                    </Tooltip>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        {/* Blood type/gender */}
        <div className='w-10/12 flex flex-col gap-12 pt-12'>
          <div className="bg-white p-2 px-4">
            <h2 className='text-xl'>Highest rated blood type</h2>
            <div className='flex w-full my-8 items-center justify-center'>
              <h1 className="text-5xl font-semibold">AB</h1>
            </div>
            <div className="flex justify-between">
              <h2 className="text-lg">Average rating: 90</h2>
              <span className='text-sm'>
                <p>John Doe</p>
                <p>Yore Mohm</p>
              </span>
            </div>
          </div>
          <div className="bg-white p-2 px-4">
            <h2 className='text-xl'>Average score per. director gender</h2>
            <div className='grid grid-cols-4 mt-8 h-48'>
              {/* Graph. 100% height: h-40 (10rem) */}
              <Tooltip title='80' placement='bottom' arrow TransitionComponent={Zoom}>
                <div className="flex flex-col-reverse items-center">
                  <h1 className="text-lg">Female</h1>
                  <div className='w-12 rounded-t-lg h-[8rem] bg-blue-500' />
                </div>
              </Tooltip>
              <Tooltip title='70' placement='bottom' arrow TransitionComponent={Zoom}>
                <div className="flex flex-col-reverse items-center">
                  <h1 className="text-lg">Male</h1>
                  <div className='w-12 rounded-t-lg h-[7rem] bg-blue-500' />
                </div>
              </Tooltip>
              <Tooltip title='60' placement='bottom' arrow TransitionComponent={Zoom}>
                <div className="flex flex-col-reverse items-center">
                  <h1 className="text-lg">Non-binary</h1>
                  <div className='w-12 rounded-t-lg h-[6rem] bg-blue-500' />
                </div>
              </Tooltip>
              <Tooltip title='100' placement='bottom' arrow TransitionComponent={Zoom}>
                <div className="flex flex-col-reverse items-center">
                  <h1 className="text-lg">Other</h1>
                  <div className='w-12 rounded-t-lg h-[10rem] bg-blue-500' />
                </div>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home