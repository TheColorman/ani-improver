import type { NextPage } from 'next'
import Head from 'next/head'
import Header from '../components/Header'
import Nav from '../components/Nav'
import styles from '../styles/yourlists.module.css'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Your lists</title>
      </Head>
      <div className='fixed w-screen h-36'>
        <Header />
        <Nav selected={"yourlists"} />
      </div>
      <div className='flex flex-col items-center absolute top-36 w-screen bg-[#e5ebf1]'>
        {/* Controls */}
        <div className='w-10/12 h-36 bg-black/10 flex justify-between items-center'>
          {/* Left element */}
          <div className='bg-black/10 h-8'>
            {/* Dropdown of lists */}
            <select name="LISTS" id="LISTS" className='p-1 px-2 h-full bg-white rounded'>
              {/*//! Dummy elements, fill in with API data */}
              <option value="WATCHING">Watching</option>
              <option value="COMPLETED">Completed</option>
              <option value="DROPPED">Dropped</option>
              <option value="PLANNING">Planning</option>
            </select>
          </div>
          {/* Right element */}
          <div className='flex gap-4 h-8'>
            {/* Columns, filter, list style buttons */}
            <button className={`${styles['button']}`}>X</button>
            <button className={`${styles['button']}`}>Y</button>
            <ul className='grid grid-cols-3'>
              <li>
                <input className='hidden' id='tab1' type='radio' name='displayStyles' />
                <label className={`${styles["button-group"]} rounded-l`} htmlFor="tab1">A</label>
              </li>
              <li>
                <input className='hidden' id='tab2' type='radio' name='displayStyles' />
                <label className={styles["button-group"]} htmlFor="tab2">B</label>
              </li>
              <li>
                <input className='hidden' id='tab3' type='radio' name='displayStyles' />
                <label className={`${styles["button-group"]} rounded-r`} htmlFor="tab3">C</label>
              </li>
            </ul>
          </div>
        </div>
        {/* List table */}
        <div className='bg-blue-500/20 w-10/12 relative mt-8'>
          <h1 className="text-xl absolute left-4 -top-8">Completed</h1>
          <table>
            <thead>
              <tr>
                {/* Title, Score, Progress, Type, Last updated, Last added, Start date, Completed date, Release date, Average score, Popularity */}
                <th className='text-left'>Title</th>
                <th className='text-left'>Score</th>
                <th className='text-left'>Progress</th>
                <th className='text-left'>Type</th>
                <th className='text-left'>Last updated</th>
                <th className='text-left'>Last added</th>
                <th className='text-left'>Start date</th>
                <th className='text-left'>Completed date</th>
                <th className='text-left'>Release date</th>
                <th className='text-left'>Average score</th>
                <th className='text-left'>Popularity</th>
              </tr>
            </thead>
            <tbody>
              {/*//! Dummy elements, fill in with API data */}
              <tr>
                <td className='text-left'>
                  <a href='/anime/1'>
                    <img src='https://cdn.myanimelist.net/images/anime/13/13891.jpg' alt='Anime' className='rounded-lg' />
                    <span className='ml-2'>
                      Anime
                    </span>
                  </a>
                </td>
                <td className='text-left'>
                  <span className='text-sm'>
                    <span className='text-gray-600'>Score:</span>
                    <span className='text-gray-800'>10</span>
                  </span>
                </td>
                <td className='text-left'>
                  <span className='text-sm'>
                    <span className='text-gray-600'>Progress:</span>
                    <span className='text-gray-800'>Completed</span>
                  </span>
                </td>
                <td className='text-left'>
                  <span className='text-sm'>
                    <span className='text-gray-600'>Type:</span>
                    <span className='text-gray-800'>TV</span>
                  </span>
                </td>
                <td className='text-left'>
                  <span className='text-sm'>
                    <span className='text-gray-600'>Last updated:</span>
                    <span className='text-gray-800'>1 day ago</span>
                  </span>
                </td>
                <td className='text-left'>
                  <span className='text-sm'>
                    <span className='text-gray-600'>Last added:</span>
                    <span className='text-gray-800'>1 day ago</span>
                  </span>
                </td>
                <td className='text-left'>
                  <span className='text-sm'>
                    <span className='text-gray-600'>Start date:</span>
                    <span className='text-gray-800'>1 day ago</span>
                  </span>
                </td>
                <td className='text-left'>
                  <span className='text-sm'>
                    <span className='text-gray-600'>Completed date:</span>
                    <span className='text-gray-800'>1 day ago</span>
                  </span>
                </td>
                <td className='text-left'>
                  <span className='text-sm'>
                    <span className='text-gray-600'>Release date:</span>
                    <span className='text-gray-800'>1 day ago</span>
                  </span>
                </td>
                <td className='text-left'>
                  <span className='text-sm'>
                    <span className='text-gray-600'>Average score:</span>
                    <span className='text-gray-800'>10</span>
                  </span>
                </td>
                <td className='text-left'>
                  <span className='text-sm'>
                    <span className='text-gray-600'>Popularity:</span>
                    <span className='text-gray-800'>10</span>
                  </span>
                </td>
              </tr>
            </tbody>

          </table>
        </div>
      </div>
    </>
  )
}

export default Home