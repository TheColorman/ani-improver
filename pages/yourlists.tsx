import type { NextPage } from 'next'
import Head from 'next/head'
import Header from '../components/Header'
import Nav from '../components/Nav'
import Link from 'next/link'
import Image from 'next/image'
import styles from '../styles/yourlists.module.css'
import type { } from '@mui/x-data-grid/themeAugmentation';
import { DataGrid, GridColDef, GridRenderCellParams, GridRowsProp, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarFilterButton } from '@mui/x-data-grid'
import useStorage from '../lib/useStorage'
import { ChangeEvent, useEffect, useState } from 'react'
import { ApiYourlists, ApiYourlistsResponse } from '../types'

const RedirectUser = () => (
  <>
    <Head>
      <title>Your lists | Not logged in</title>
    </Head>
    <div className='fixed w-screen h-36'>
      <Header />
      <Nav selected={"yourlists"} />
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

const Home: NextPage = () => {
  const { getItem, setItem } = useStorage()
  const avatar = getItem('avatar')
  const username = getItem('username')
  const yourlistsDataString = getItem('yourlists')
  const [yourlistsData, setYourlistsData] = useState<ApiYourlists | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [rows, setRows] = useState<GridRowsProp>([])

  // Fetch data from API
  const fetchYourlistsData = async (username: string) => {
    console.log("Fetching new data")
    const data = (await fetch(`/api/yourlists?username=${username}`).then(res => res.json())) as ApiYourlistsResponse

    if (("error" in data) || data.MediaListCollection == null) {
      return false
    }
    setItem('yourlists', JSON.stringify(data))
    setYourlistsData(data)
    return true
  }

  useEffect(() => {
    // If yourlists data is not set, fetch it
    if (!yourlistsDataString) {
      console.log("No data found");
      (async () => {
        // Get yourlists data
        const success = await fetchYourlistsData(username)
        if (!success) {
          console.log("Failed to fetch data")
          return
        }
      })()
    } else {
      // If yourlists data is set, parse it
      setYourlistsData(JSON.parse(yourlistsDataString))
    }
  }, [])

  if (!username || !avatar) {
    // Redirect user to homepage
    return <RedirectUser />
  }

  // Create data
  const listNames: string[] = yourlistsData?.MediaListCollection.lists.map(list => list.name) ?? []
  // Create object of lists, adapted to GridRowsProp
  const lists = Object.fromEntries(yourlistsData?.MediaListCollection.lists.map(list => [list.name.toUpperCase(), list.entries.map(entry => {
    return {
      id: entry.media.id,
      thumbnail: entry.media.coverImage.large,
      title: entry.media.title.userPreferred,
      score: entry.score,
      progress: `${entry.progress} / ${entry.media.episodes ?? "[?]"}`,
      updated: entry.updatedAt * 1000,
      added: entry.createdAt * 1000,
      startDate: entry.startedAt.year && entry.startedAt.month && entry.startedAt.day ? new Date(entry.startedAt.year, entry.startedAt.month - 1, entry.startedAt.day) : 0,
      completedDate: entry.completedAt.year && entry.completedAt.month && entry.completedAt.day ? new Date(entry.completedAt.year, entry.completedAt.month - 1, entry.completedAt.day) : 0,
      releaseDate: entry.media.startDate.year && entry.media.startDate.month && entry.media.startDate.day ? new Date(entry.media.startDate.year, entry.media.startDate.month - 1, entry.media.startDate.day) : 0,
      averageScore: entry.media.averageScore,
      meanScore: entry.media.meanScore,
      popularity: entry.media.popularity,
    }
  })]) ?? [])

  const columns: GridColDef[] = [
    {
      field: "thumbnail", headerName: "", width: 55, disableColumnMenu: true, hideSortIcons: true, hideable: false, renderCell: (params: GridRenderCellParams<string>) => (
        <>
          {params.value && (
            <Image
              src={params.value}
              alt="Thumbnail"
              width={100}
              height={100}
            />
          )}
        </>
      )
    },
    {
      field: "title", headerName: "Title", description: "Title of the anime, based on your preferred display.", width: 300, hideable: false, renderCell: (params: GridRenderCellParams<string>) => (
        <a href={`https://anilist.co/anime/${params.row.id}`} target="_blank" rel="noreferrer" className="hover:underline">{params.value}</a>
      )
    },
    { field: "score", headerName: "Score", description: "Your personal score for the anime.", type: "number", width: 90, cellClassName: styles['center-cell'] },
    { field: "progress", headerName: "Progress", description: "Your personal progress for the anime.", type: "number", width: 110, cellClassName: styles['center-cell'], sortComparator: (a: string, b: string) => parseInt(a.split(" / ")[0]) - parseInt(b.split(" / ")[0]) },
    { field: "updated", headerName: "Updated", description: "The date the you last updated the anime on this list.", type: "date", width: 110, cellClassName: styles['center-cell'], renderCell: ({ value }: { value?: number }) => value ? new Date(value).toLocaleDateString() : "" },
    { field: "added", headerName: "Added", description: "The date the anime was added to your list.", type: "date", width: 90, cellClassName: styles['center-cell'], renderCell: ({ value }: { value?: number }) => value ? new Date(value).toLocaleDateString() : "" },
    { field: "startDate", headerName: "Start date", description: "The date you started watching the anime.", type: "date", width: 120, cellClassName: styles['center-cell'], renderCell: ({ value }: { value?: number }) => value ? new Date(value).toLocaleDateString() : "" },
    { field: "completedDate", headerName: "Completed date", description: "The date you completed the anime.", type: "date" , width: 150, cellClassName: styles['center-cell'], renderCell: ({ value }: { value?: number }) => value ? new Date(value).toLocaleDateString() : "" },
    { field: "releaseDate", headerName: "Release date", description: "The date the anime was released.", type: "date", width: 140, cellClassName: styles['center-cell'], renderCell: ({ value }: { value?: number }) => value ? new Date(value).toLocaleDateString() : "" },
    { field: "averageScore", headerName: "Average score", description: "The global average score of the anime.", type: "number", width: 140, cellClassName: styles['center-cell'] },
    { field: "meanScore", headerName: "Mean score", description: "The global mean score of the anime.", type: "number", width: 130, cellClassName: styles['center-cell'] },
    { field: "popularity", headerName: "Popularity", description: "The number of users who have this anime in their list", type: "number", width: 120, cellClassName: styles['center-cell'] },
  ]

  const handleSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    setRows(lists[event.currentTarget.value])
    setSelected(event.target.value)
  }

  return (
    <div className={styles.God}>
      <Head>
        <title>Your lists</title>
      </Head>
      <div className='fixed w-screen h-36'>
        <Header />
        <Nav selected={"yourlists"} />
      </div>
      <div className='flex flex-col items-center absolute top-36 w-full bg-[#e5ebf1]'>
        {/* Controls */}
        <div className='w-10/12 h-36 flex justify-between items-center'>
          {/* Left element */}
          <div className='h-8'>
            {/* Dropdown of lists */}
            <select name="LISTS" id="LISTS" className='p-1 px-2 h-full bg-white rounded' onChange={handleSelect}>
              {listNames.map((name, index) => (
                <option key={`${index}-${name}`} value={name.toUpperCase()}>{name}</option>
              ))}
            </select>
          </div>

          {/*//! Couldn't even use these buttons because the MUI table doesn't allow external buttons to things like filter */}
          {/*//// Right element */}
          {/*//// Columns, filter, list style buttons */}
          {/* <div className='flex gap-4 h-8'>
            <button className={`${styles['button']}`}>X</button>
            <button className={`${styles['button']}`}>Y</button>
            <ul className='grid grid-cols-3'>
              <li>
                <input className='sr-only peer' id='tab1' type='radio' name='displayStyles' onClick={() => { console.log("Clicked!"); }} />
                <label className={`${styles["button-group"]} rounded-l peer-checked:bg-sky-600 peer-checked:text-white peer-focus-visible:outline`} htmlFor="tab1">A</label>
              </li>
              <li>
                <input className='sr-only peer' id='tab2' type='radio' name='displayStyles' />
                <label className={`${styles["button-group"]} rounded-r peer-checked:bg-sky-600 peer-checked:text-white peer-focus-visible:outline`} htmlFor="tab2">B</label>
              </li>
            </ul>
          </div> */}
        </div>
        {/* List table */}
        {yourlistsData && (
          <div className='bg-[#fafafa] rounded w-10/12 relative my-8'>
            <h1 className="text-xl absolute left-4 -top-8">{selected ? selected[0] + selected.slice(1).toLowerCase() : listNames[0]}</h1>
            <DataGrid
              className=''
              rows={rows.length > 0 ? rows : lists[listNames[0].toUpperCase()]}
              columns={columns}
              autoHeight
              components={{
                Toolbar: () => (
                  <GridToolbarContainer>
                    <GridToolbarColumnsButton />
                    <GridToolbarFilterButton />
                    <GridToolbarDensitySelector />
                  </GridToolbarContainer>
                )
              }}
              getCellClassName={() => styles.cell}
              getRowClassName={() => styles.row}
              disableColumnMenu
            />
          </div>
        )}
        {!yourlistsData && (
          <div className='flex w-screen h-screen items-center justify-center'>
            {/* Loading indicator */}
            <div className='text-center'>
              <h1 className='text-xl'>Loading...</h1>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home