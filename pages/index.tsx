import type { NextPage } from 'next'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import useStorage from '../lib/useStorage'
import Header from '../components/Header'
import { ApiUserResponse } from '../types'

const Home: NextPage = () => {
  const [username, setUsername] = useState<string>('')
  const [isUser, setIsUser] = useState<boolean>(false)
  const [textIsFocused, setTextIsFocused] = useState<boolean>(true)
  const [previousUsername, setPreviousUsername] = useState<string>('')
  const router = useRouter()
  const { setItem, removeItem } = useStorage()

  useEffect(() => {
    // Remove previous data
    console.log("Removing previous data");
    removeItem('overview')
    removeItem('username')
    removeItem('avatar')
    removeItem('yourlists')
  }, [])

  const handleUsernameChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value)
  }

  const fetchUser = async (username: string) => {
    if (previousUsername == username) {
      return false
    }
    const data = await fetch(`/api/user?username=${username}`).then((res) => res.json()) as ApiUserResponse
    if (('error' in data) || data.User == null) {
      setPreviousUsername(username)
      setIsUser(false)
      return false
    }
    return data
  }

  const handleFocusOut = async () => {
    setTextIsFocused(false)
    if (await fetchUser(username) === false) return
    setIsUser(true)
  }
  const handleProceed = async () => {
    const data = await fetchUser(username)
    if (data === false || data.User === null) return
    setItem('username', data.User.name)
    setItem('avatar', data.User.avatar.large)
    router.push('/overview')
  }

  return (
    <>
      <Header />
      <div className='flex justify-center items-center w-screen h-screen bg-[#e5ebf1]'>
        <div className='flex-col justify-center items-center max-w-4xl text-center'>
          <div>
            Welcome to Ani Improver! This is the place to view all kinds of statistics about your anime list from AniList.
            Here you can see the different lists you have, the amount of episodes you have watched and statistics about the anime you watch!
            <br />
            Ani Improver is using the AniList API to fetch data from AniList, and is not affiliated with AniList in any way.
          </div>
          <div className='flex justify-center items-center mt-6'>
            <div className='relative'>
              <input
                type="text"
                placeholder="Username"
                className='m-2 p-2 border-2 border-gray-300 rounded'
                onChange={handleUsernameChange}
                onBlur={handleFocusOut}
                onFocus={() => setTextIsFocused(true)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    handleProceed()
                  }
                }}
              />
              {!textIsFocused && !isUser && (
                <p className='text-sm text-red-500 -bottom-2 -translate-x-1/2 left-1/2 absolute'>Invalid username</p>
              )}
            </div>
            {isUser ? (
              <button
                className='bg-[#b368e6] m-2 p-2 rounded'
                onClick={handleProceed}
              >
                Proceed
              </button>
            ) : (
              <button
                className='bg-[#D2AFEA] m-2 p-2 rounded hover:cursor-not-allowed relative'
              >
                Proceed
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Home