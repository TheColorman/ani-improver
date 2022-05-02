import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Header from '../components/Header'
import Nav from '../components/Nav'
import { Tooltip, Zoom } from '@mui/material'
import unixToRelative from '../lib/unixToRelative'
import useStorage from '../lib/useStorage'
import { useEffect, useState } from 'react'
import { ApiStatsAnime, ApiStatsDirector, ApiStatsResponse, ApiStatsVoiceActor } from '../types'
import RedirectUser from '../components/RedirectUser'

const Home: NextPage = () => {
  const { getItem, setItem } = useStorage()
  const avatar = getItem('avatar')
  const username = getItem('username')
  const statsAnimeString = getItem('statsAnime')
  const statsDirectorsString = getItem('statsDirectors')
  const statsVoiceActorsString = getItem('statsVoiceActors')
  const [statsAnime, setStatsAnime] = useState<ApiStatsAnime[] | null>(null)
  const [statsDirectors, setStatsDirectors] = useState<ApiStatsDirector[] | null>(null)
  const [statsVoiceActors, setStatsVoiceActors] = useState<ApiStatsVoiceActor[] | null>(null)

  // Fetch data from API
  const fetchYourlistsData = async (username: string) => {
    console.log("Fetching new data")
    const data = (await fetch(`/api/stats?username=${username}`).then(res => res.json())) as ApiStatsResponse

    if (("error" in data)) {
      return false
    }
    setItem('statsAnime', JSON.stringify(data.anime))
    setItem('statsDirectors', JSON.stringify(data.directors))
    setItem('statsVoiceActors', JSON.stringify(data.voiceActors))
    setStatsAnime(data.anime)
    setStatsDirectors(data.directors)
    setStatsVoiceActors(data.voiceActors)
    return true
  }

  useEffect(() => {
    // If yourlists data is not set, fetch it
    if (!statsAnimeString || !statsDirectorsString || !statsVoiceActorsString) {
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
      setStatsAnime(JSON.parse(statsAnimeString))
      setStatsDirectors(JSON.parse(statsDirectorsString))
      setStatsVoiceActors(JSON.parse(statsVoiceActorsString))
    }
  }, [])

  if (!username || !avatar) {
    // Redirect user to homepage
    return <RedirectUser title='Stats' page='stats' />
  }

  //          === Data Creation ===
  //  -- Anime --
  // Most watched series
  const mostWatchedSeries = statsAnime?.reduce((mostWatched, curr) => {
    if (curr.progress * (curr.duration ?? 20) > mostWatched.progress * (mostWatched.duration ?? 20)) {
      return curr
    }
    return mostWatched
  })
  // Random rewatch anime
  const toRewatch = statsAnime?.filter(anime => anime.status === 'COMPLETED' && anime.score >= 8)
  const randomRewatch = toRewatch?.[Math.floor(Math.random() * toRewatch?.length)]
  
  // Most underground series
  const mostUndergroundSeries = statsAnime?.reduce((mostUnderground, curr) => {
    if (curr.progress && curr.popularity < mostUnderground.popularity) {
      return curr
    }
    return mostUnderground
  })
  // Most liked underground series
  const scoredAnime = statsAnime?.filter(anime => anime.score)
  const averagePopularity = scoredAnime ? scoredAnime.reduce((sum, curr) => sum + curr.popularity, 0) / scoredAnime.length : 0
  let minScore = 1
  let topTenTotalPopularity = 0
  let leastPopular
  while (topTenTotalPopularity < averagePopularity) {
    if (minScore > 10) break;
    minScore += 0.1
    const passedAnime = scoredAnime?.filter(anime => anime.score >= minScore) ?? []
    // Top 10 least popular
    const topTen = passedAnime.sort((a, b) => a.popularity - b.popularity).slice(0, 10)
    leastPopular = topTen[0]
    topTenTotalPopularity = topTen.reduce((total, curr) => total + curr.popularity, 0)
    // console.log(passedAnime, minScore, topTen, topTenTotalPopularity);
  }
  const mostLikedUndergroundSeries = leastPopular
  // Most disliked good series
  const averageMeanScore = scoredAnime ? scoredAnime.reduce((sum, curr) => sum + (curr.meanScore ?? 0), 0) / scoredAnime.length : 0
  let maxScore = 9
  let highestMeanScore = 100
  let recentHighestScorers: [null | ApiStatsAnime, null | ApiStatsAnime] = [null, null]
  while (highestMeanScore > averageMeanScore) {
    if (maxScore < 0) break;
    maxScore -= 0.1
    const passedAnime = scoredAnime?.filter(anime => anime.score <= maxScore) ?? []
    // Highest mean score 
    const top = passedAnime.sort((a, b) => (b.meanScore ?? 0) - (a.meanScore ?? 0))[0]
    if (!top) break;
    recentHighestScorers.pop()
    recentHighestScorers.unshift(top)
    highestMeanScore = top.meanScore ?? 0
  }
  const mostDislikedGoodSeries = recentHighestScorers[1]
  // Most liked bad series
  const lowestFifty = scoredAnime?.sort((a, b) => (a.meanScore ?? 0) - (b.meanScore ?? 0)).slice(0, 50) ?? []
  const averageMeanScoreLowestFifty = lowestFifty.reduce((sum, curr) => sum + (curr.meanScore ?? 0), 0) / lowestFifty.length
  minScore = 1
  let lowestMeanScore = 0
  let recentLowestScorers: [null | ApiStatsAnime, null | ApiStatsAnime] = [null, null]
  while (lowestMeanScore < averageMeanScoreLowestFifty) {
    if (minScore > 10) break;
    minScore += 0.1
    const passedAnime = scoredAnime?.filter(anime => anime.score >= minScore) ?? []
    // Lowest mean score
    const top = passedAnime.sort((a, b) => (a.meanScore ?? 0) - (b.meanScore ?? 0))[0]
    if (!top) break;
    recentLowestScorers.pop()
    recentLowestScorers.unshift(top)
    lowestMeanScore = top.meanScore ?? 0
  }
  const mostLikedBadSeries = recentLowestScorers[1]
  //  -- Genres --
  // Top 5 genres
  const genres = Object.values(scoredAnime?.map(anime => anime.genres.map(genre => {
    return {
      genre,
      value: anime.score,
      count: 0,
      previousValue: 0,
      anime: anime.title,
      animeId: anime.id
    }
  })).flat(1).reduce((acc, curr) => {
    if (acc[curr.genre]) {
      acc[curr.genre].value += curr.value
      acc[curr.genre].count += 1
      if (curr.value > acc[curr.genre].previousValue) {
        acc[curr.genre].previousValue = curr.value
        acc[curr.genre].anime = curr.anime
        acc[curr.genre].animeId = curr.animeId
      }
    } else {
      acc[curr.genre] = {
        genre: curr.genre,
        value: curr.value,
        count: 1,
        previousValue: curr.value,
        anime: curr.anime,
        animeId: curr.animeId
      }
    }
    return acc
  }, {} as { [key: string]: { genre: string, value: number, count: number, previousValue: number, anime: string, animeId: number } }) ?? {}).map(genre => {
    return {
      ...genre,
      value: genre.value / genre.count
    }
  }).map(genre => {
    const series = statsAnime?.find(anime => anime.id === genre.animeId)
    return {
      genre: genre.genre,
      anime: genre.anime,
      image: series?.image ?? null,
      animeId: genre.animeId,
      value: genre.value,
    }
  })
  const topGenres = genres.sort((a, b) => b.value - a.value).slice(0, 5)
  // Top 5 tags
  const tags = Object.values(scoredAnime?.map(anime => anime.tags.map(tag => {
    return {
      tag,
      value: anime.score * tag.rank / 100,
      count: 0,
      previousValue: 0,
      anime: anime.title,
      animeId: anime.id
    }
  })).flat(1).reduce((acc, curr) => {
    if (acc[curr.tag.name]) {
      acc[curr.tag.name].value += curr.value
      acc[curr.tag.name].count += 1
      if (curr.value > acc[curr.tag.name].previousValue) {
        acc[curr.tag.name].previousValue = curr.value
        acc[curr.tag.name].anime = curr.anime
        acc[curr.tag.name].animeId = curr.animeId
      }
    } else {
      acc[curr.tag.name] = {
        name: curr.tag.name,
        value: curr.value,
        count: 1,
        previousValue: curr.value,
        anime: curr.anime,
        animeId: curr.animeId
      }
    }
    return acc
  }, {} as { [key: string]: { name: string, value: number, count: number, previousValue: number, anime: string, animeId: number } }) ?? {}).map(tag => {
    return {
      ...tag,
      value: tag.value / tag.count
    }
  }).map(tag => {
    const series = statsAnime?.find(anime => anime.id === tag.animeId)
    return {
      tag: tag.name,
      anime: tag.anime,
      image: series?.image ?? null,
      animeId: tag.animeId,
      value: tag.value,
    }
  })
  const topTags = tags.sort((a, b) => b.value - a.value).slice(0, 5)
  //  -- People --
  // Highest rated person
  const highestRatedPerson = Object.values((statsDirectors?.map(director => {
    return {
      series: director.series,
      person: {
        name: director.director.name,
        id: director.director.id,
        image: director.director.image,
        role: 'Director'
      }
    }
  }).concat(statsVoiceActors?.map(voiceActor => {
    return {
      series: voiceActor.series,
      person: {
        name: voiceActor.voiceActor.name,
        id: voiceActor.voiceActor.id,
        image: voiceActor.voiceActor.image,
        role: `Voice Actor - ${voiceActor.characterName}`
      }
    }
  }) ?? []) ?? []).filter(person => {
    const series = statsAnime?.find(anime => anime.id === person.series)
    return series?.score
  }).map(person => {
    const series = statsAnime?.find(anime => anime.id === person.series)
    return {
      ...person,
      value: series?.score ?? 0,
      count: 1,
      previousValue: 0,
    }
  }).reduce((acc, curr) => {
    if (acc[curr.person.id]) {
      acc[curr.person.id].value += curr.value
      acc[curr.person.id].count += 1
      if (curr.value > acc[curr.person.id].previousValue) {
        acc[curr.person.id].previousValue = curr.value
        acc[curr.person.id].series = curr.series
      }
    } else {
      acc[curr.person.id] = {
        person: curr.person,
        value: curr.value,
        count: 1,
        previousValue: curr.value,
        series: curr.series,
      }
    }
    return acc
  }, {} as { [key: string]: { person: { name: string, id: number, image: string, role: string }, value: number, count: number, previousValue: number, series: number } }) ?? {}).map(person => {
    return {
      ...person,
      value: person.value / person.count
    }
  }).map(person => {
    const series = statsAnime?.find(anime => anime.id === person.series)
    return {
      person: person.person,
      series: person.series,
      value: person.value,
      anime: series?.title ?? '',
    }
  }).sort((a, b) => b.value - a.value)[0]
  // Highest rated director
  const highestRatedDirector = Object.values((statsDirectors?.filter(director => {
    const series = statsAnime?.find(anime => anime.id === director.series)
    return series?.score
  }).map(director => {
    const series = statsAnime?.find(anime => anime.id === director.series)
    return {
      ...director,
      value: series?.score ?? 0,
    }
  }).reduce((acc, curr) => {
    if (acc[curr.director.id]) {
      acc[curr.director.id].value += curr.value
    } else {
      acc[curr.director.id] = {
        director: curr.director,
        value: curr.value,
      }
    }
    return acc
  }, {} as { [key: string]: { director: { name: string, id: number, image: string }, value: number } }) ?? {})).sort((a, b) => b.value - a.value)[0]
  const highestDirectorAnime = statsDirectors?.filter(director => director.director.id === highestRatedDirector.director.id).map(director => statsAnime?.find(anime => anime.id === director.series)).sort((a, b) => (b?.score ?? 0) - (a?.score ?? 0)).slice(0, 2)
  // Highest rated voice actor
  const highestVoiceActor = Object.values((statsVoiceActors?.filter(voiceActor => {
    const series = statsAnime?.find(anime => anime.id === voiceActor.series)
    return series?.score
  }).map(voiceActor => {
    const series = statsAnime?.find(anime => anime.id === voiceActor.series)
    return {
      ...voiceActor,
      value: series?.score ?? 0,
    }
  }).reduce((acc, curr) => {
    if (acc[curr.voiceActor.id]) {
      acc[curr.voiceActor.id].value += curr.value
    } else {
      acc[curr.voiceActor.id] = {
        voiceActor: curr.voiceActor,
        value: curr.value,
      }
    }
    return acc
  }, {} as { [key: string]: { voiceActor: { name: string, id: number, image: string }, value: number } }) ?? {})).sort((a, b) => b.value - a.value)[0]
  const highestVoiceActorAnime = statsVoiceActors?.filter(voiceActor => voiceActor.voiceActor.id === highestVoiceActor.voiceActor.id).map(voiceActor => statsAnime?.find(anime => anime.id === voiceActor.series)).sort((a, b) => (b?.score ?? 0) - (a?.score ?? 0)).slice(0, 2).map(anime => {
    const character = statsVoiceActors?.find(voiceActor => voiceActor.voiceActor.id === highestVoiceActor.voiceActor.id && voiceActor.series === anime?.id)
    return {
      anime: anime,
      character: {
        name: character?.characterName ?? '',
        image: character?.characterImage ?? '',
      }
    }
  })
  // Most watched voice actor
  const mostWatchedVoiceActor = Object.values((statsVoiceActors?.filter(voiceActor => {
    const series = statsAnime?.find(anime => anime.id === voiceActor.series)
    return series?.progress
  }).map(voiceActor => {
    const series = statsAnime?.find(anime => anime.id === voiceActor.series)
    return {
      ...voiceActor,
      value: (series?.progress ?? 0) * (series?.duration ?? 0),
    }
  }).reduce((acc, curr) => {
    if (acc[curr.voiceActor.id]) {
      acc[curr.voiceActor.id].value += curr.value
    } else {
      acc[curr.voiceActor.id] = {
        voiceActor: curr.voiceActor,
        value: curr.value,
      }
    }
    return acc
  }, {} as { [key: string]: { voiceActor: { name: string, id: number, image: string }, value: number } }) ?? {})).sort((a, b) => b.value - a.value)[0]
  const mostWatchedVoiceActorAnime = statsVoiceActors?.filter(voiceActor => voiceActor.voiceActor.id === mostWatchedVoiceActor.voiceActor.id).map(voiceActor => statsAnime?.find(anime => anime.id === voiceActor.series)).sort((a, b) => (b?.progress ?? 0) - (a?.progress ?? 0)).slice(0, 2).map(anime => {
    const character = statsVoiceActors?.find(voiceActor => voiceActor.voiceActor.id === mostWatchedVoiceActor.voiceActor.id && voiceActor.series === anime?.id)
    return {
      anime: anime,
      character: {
        name: character?.characterName ?? '',
        image: character?.characterImage ?? '',
        timeWatched: (anime?.progress ?? 0) * (anime?.duration ?? 0),
      }
    }
  })
  //  -- Blood type/gender --
  // Highest rated blood type
  const highestRatedBloodType = Object.values(Object.values(statsDirectors?.map(director => {
    return {
      name: director.director.name,
      series: director.series,
      bloodType: director.director.bloodType?.replace(/[^a-zA-Z]/gi, '').replace('TypeB', 'B')
    }
  }).concat(statsVoiceActors?.map(voiceActor => {
    return {
      name: voiceActor.voiceActor.name,
      series: voiceActor.series,
      bloodType: voiceActor.voiceActor.bloodType?.replace(/[^a-zA-Z]/gi, '').replace('TypeB', 'B')
    }
  }) ?? []) ?? []).filter(person => {
    const series = statsAnime?.find(anime => anime.id === person.series)
    return person.bloodType && series?.score
  }).map(person => {
    const series = statsAnime?.find(anime => anime.id === person.series)
    return {
      ...person,
      value: series!?.score,
      count: 1,
    }
  }).reduce((acc, curr) => {
    if (curr.bloodType === null || curr.bloodType === undefined) {
      return acc
    }
    if (acc[curr.bloodType]) {
      acc[curr.bloodType].value += curr.value
      acc[curr.bloodType].count++
      acc[curr.bloodType].names.push(curr.name)
      acc[curr.bloodType].names = Array.from(new Set(acc[curr.bloodType].names))
    } else {
      acc[curr.bloodType] = {
        bloodType: curr.bloodType,
        value: curr.value,
        count: curr.count,
        names: [curr.name],
      }
    }
    return acc
  }, {} as { [key: string]: { bloodType: string, value: number, count: number, names: string[] } }) ?? {}).sort((a, b) => b.value - a.value)[0] ?? {}
  // Mean score per. director gender
  const meanScorePerDirectorGender = Object.values(Object.values(statsDirectors?.map(director => {
    return {
      series: director.series,
      gender: director.director.gender,
      value: statsAnime?.find(anime => anime.id === director.series)?.score
    }
  }).filter(director => {
    return director.value
  }) ?? {}).reduce((acc, curr) => {
    if (acc[curr.gender ?? "Other/unknown"]) {
      acc[curr.gender ?? "Other/unknown"].value += curr.value as number
      acc[curr.gender ?? "Other/unknown"].count++
    } else {
      acc[curr.gender ?? "Other/unknown"] = {
        gender: curr.gender ?? "Other/unknown",
        value: curr.value as number,
        count: 1
      }
    }
    return acc
  }, {} as { [key: string]: { gender: string, value: number, count: number } })).map(genderScore => {
    return {
      gender: genderScore.gender,
      score: genderScore.value / genderScore.count
    }
  })

  return (
    <>
      <Head>
        <title>Stats</title>
      </Head>
      <div className='fixed w-screen h-36'>
        <Header />
        <Nav selected={"stats"} />
      </div>
      {statsAnime && (
        <div className='flex flex-col items-center absolute top-36 w-full bg-[#e5ebf1] py-12'>
          {/* Anime */}
          <div className='w-10/12 grid grid-cols-2 gap-12 border-b-2 border-[#9dc1e0] pb-12'>
            <div className='rounded-lg bg-[#fafafa] flex h-36'>
              <div className='min-w-[102px] h-full'>
                <Image className='rounded-l-lg' width={102} height={144} src={mostWatchedSeries?.image ?? 'https://s4.anilist.co/file/anilistcdn/staff/large/default.jpg'} alt="Thumbnail" />
              </div>
              <div className='ml-2'>
                <h2 className='text-sm'>Most watched series</h2>
                <a href={`https://anilist.co/anime/${mostWatchedSeries?.id}`} target='_blank' rel='noreferrer' className='text-xl font-medium hover:text-sky-500 hover:cursor-pointer hover:underline'>{mostWatchedSeries?.title}</a>
                <p className='text-lg'><strong>{mostWatchedSeries?.progress}</strong> episodes</p>
                <p className='text-sm'>{unixToRelative((mostWatchedSeries?.progress ?? 0) * (mostWatchedSeries?.duration ?? 0) * 60 * 1000)}</p>
              </div>
            </div>
            <div className='rounded-lg bg-[#fafafa] flex h-36'>
              <div className='min-w-[102px] h-full'>
                <Image className='rounded-l-lg' width={102} height={144} src={randomRewatch?.image ?? "https://s4.anilist.co/file/anilistcdn/staff/large/default.jpg"} alt="Thumbnail" />
              </div>
              <div className='ml-2'>
                <h2 className='text-sm'>Random anime to rewatch</h2>
                <a href={`https://anilist.co/anime/${randomRewatch?.id}`} target='_blank' rel='noreferrer' className='text-xl font-medium hover:text-sky-500 hover:cursor-pointer hover:underline'>{randomRewatch?.title ?? "No anime on Plan to Watch!"}</a>
                <p className='text-lg'>{randomRewatch ? 'Randomly chosen completed anime for you to rewatch. Re-experience it!' : "There's no anime that fits the criteria for a rewatch!"}</p>
              </div>
            </div>
            <div className='rounded-lg bg-[#fafafa] flex h-36'>
              <div className='min-w-[102px] h-full'>
                <Image className='rounded-l-lg' width={102} height={144} src={mostUndergroundSeries?.image ?? 'https://s4.anilist.co/file/anilistcdn/staff/large/default.jpg'} alt="Thumbnail" />
              </div>
              <div className='ml-2'>
                <h2 className='text-sm'>Most underground series</h2>
                <a href={`https://anilist.co/anime/${mostUndergroundSeries?.id}`} target='_blank' rel='noreferrer' className='text-xl font-medium hover:text-sky-500 hover:cursor-pointer hover:underline'>{mostUndergroundSeries?.title}</a>
                <p className='text-lg'>Only <strong>{mostUndergroundSeries?.popularity}</strong> people have this in their list</p>
              </div>
            </div>
            <div className='rounded-lg bg-[#fafafa] flex h-36'>
              <div className='min-w-[102px] h-full'>
                <Image className='rounded-l-lg' width={102} height={144} src={mostLikedUndergroundSeries?.image ?? "https://s4.anilist.co/file/anilistcdn/staff/large/default.jpg"} alt="Thumbnail" />
              </div>
              <div className='ml-2'>
                <h2 className='text-sm'>Most liked underground series</h2>
                <a href={`https://anilist.co/anime/${mostLikedUndergroundSeries?.id}`} target='_blank' rel='noreferrer' className='text-xl font-medium hover:text-sky-500 hover:cursor-pointer hover:underline'>{mostLikedUndergroundSeries?.title}</a>
                <p className='text-lg'>Only <strong>{mostLikedUndergroundSeries?.popularity}</strong> people have this in their list</p>
                <p>You scored <strong>{mostLikedUndergroundSeries?.score}</strong></p>
              </div>
            </div>
            <div className='rounded-lg bg-[#fafafa] flex h-36'>
              <div className='min-w-[102px] h-full'>
                <Image className='rounded-l-lg' width={102} height={144} src={mostDislikedGoodSeries?.image ?? "https://s4.anilist.co/file/anilistcdn/staff/large/default.jpg"} alt="Thumbnail" />
              </div>
              <div className='ml-2'>
                <h2 className='text-sm'>Most disliked good series</h2>
                <a href={`https://anilist.co/anime/${mostDislikedGoodSeries?.id}`} target='_blank' rel='noreferrer' className='text-xl font-medium hover:text-sky-500 hover:cursor-pointer hover:underline'>{mostDislikedGoodSeries?.title}</a>
                <p className='text-lg'>Your score: <strong>{(mostDislikedGoodSeries?.score ?? 0) * 10}</strong></p>
                <p className='text-lg'>Mean score: <strong>{mostDislikedGoodSeries?.meanScore}</strong></p>
              </div>
            </div>
            <div className='rounded-lg bg-[#fafafa] flex h-36'>
              <div className='min-w-[102px] h-full'>
                <Image className='rounded-l-lg' width={102} height={144} src={mostLikedBadSeries?.image ?? "https://s4.anilist.co/file/anilistcdn/staff/large/default.jpg"} alt="Thumbnail" />
              </div>
              <div className='ml-2'>
                <h2 className='text-sm'>Most liked bad series</h2>
                <a href={`https://anilist.co/anime/${mostLikedBadSeries?.id}`} target='_blank' rel='noreferrer' className='text-xl font-medium hover:text-sky-500 hover:cursor-pointer hover:underline'>{mostLikedBadSeries?.title}</a>
                <p className='text-lg'>Your score: <strong>{(mostLikedBadSeries?.score ?? 0) * 10}</strong></p>
                <p className='text-lg'>Mean score: <strong>{mostLikedBadSeries?.meanScore}</strong></p>
              </div>
            </div>
          </div>
          {/* Genres/tags */}
          <div className='w-10/12 grid grid-cols-2 gap-12 border-b-2 border-[#9dc1e0] py-12'>
            <div className="bg-white relative rounded">
              <div className='min-w-[102px] absolute right-0 top-0'>
                <a href={`https://anilist.co/anime/${topGenres[0].animeId}`} target='_blank' rel='noreferrer'>
                  <Image className='rounded-tr' width={102} height={144} src={topGenres[0].image ?? "https://s4.anilist.co/file/anilistcdn/staff/large/default.jpg"} alt="Thumbnail" />
                </a>
              </div>
              <div className='m-2 ml-3'>
                <h1 className='text-xl'>Top 5 genres</h1>
                <div className='ml-6'>
                  <ol className='list-decimal'>
                    {topGenres.map((genre, i) => (
                      <li key={i}>{genre.genre}</li>
                    ))}
                  </ol>
                  <h2 className='-ml-3 text-sm'>Based on {Array.from(new Set(topGenres.map(genre => genre.anime))).join(", ")}</h2>
                </div>
              </div>
            </div>
            <div className="bg-white relative rounded">
              <div className='min-w-[102px] absolute right-0 top-0'>
                <a href={`https://anilist.co/anime/${topTags[0].animeId}`} target='_blank' rel='noreferrer'>
                  <Image className='rounded-tr' width={102} height={144} src={topTags[0].image ?? "https://s4.anilist.co/file/anilistcdn/staff/large/default.jpg"} alt="Thumbnail" />
                </a>
              </div>
              <div className='m-2 ml-3'>
                <h1 className='text-xl'>Top 5 tags</h1>
                <div className='ml-6'>
                  <ol className='list-decimal'>
                    {topTags.map((tag, i) => (
                      <li key={i}>{tag.tag}</li>
                    ))}
                  </ol>
                  <h2 className='-ml-3 text-sm'>Based on {Array.from(new Set(topTags.map(tag => tag.anime))).join(", ")}</h2>
                </div>
              </div>
            </div>
          </div>
          {/* People */}
          <div className='w-10/12 grid grid-cols-2 gap-12 border-b-2 border-[#9dc1e0] py-12'>
            <div className='rounded-lg bg-[#fafafa] flex h-36'>
              <div className='min-w-[102px] h-full'>
                <Image className='rounded-l-lg' width={102} height={144} src={highestRatedPerson?.person.image ?? "https://s4.anilist.co/file/anilistcdn/staff/large/default.jpg"} alt="Thumbnail" />
              </div>
              <div className='ml-2'>
                <h2 className='text-sm'>Highested rated person</h2>
                <a target='_blank' rel='noreferrer' href={`https://anilist.co/staff/${highestRatedPerson?.person.id}`} className='text-xl font-semibold hover:cursor-pointer hover:text-sky-500 hover:underline'>
                  {highestRatedPerson?.person.name}
                </a>
                <Tooltip title={highestRatedPerson?.person.role} arrow TransitionComponent={Zoom} disableInteractive className='ml-2'>
                  <p>{highestRatedPerson?.anime}</p>
                </Tooltip>
              </div>
            </div>
            <div className='rounded-lg bg-[#fafafa] flex h-36'>
              <div className='min-w-[102px] h-full'>
                <Image className='rounded-l-lg' width={102} height={144} src={highestRatedDirector?.director.image ?? "https://s4.anilist.co/file/anilistcdn/staff/large/default.jpg"} alt="Thumbnail" />
              </div>
              <div className='ml-2'>
                <h2 className='text-sm'>Highest rated director</h2>
                <a target='_blank' rel='noreferrer' href={`https://anilist.co/staff/${highestRatedDirector?.director.id}`} className='text-xl font-semibold hover:cursor-pointer hover:text-sky-500 hover:underline'>
                  {highestRatedDirector?.director.name}
                </a>
                <ul>
                  {highestDirectorAnime?.map((anime, i) => (
                    <li key={i} className='ml-2'>
                      <Tooltip title={`Your score: ${anime?.score}`} arrow TransitionComponent={Zoom} disableInteractive>
                        <p>{anime && (
                          anime.title.length > 40 ? `${anime.title.substring(0, 40)}...` : anime.title
                        )}</p>
                      </Tooltip>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className='rounded-lg bg-[#fafafa] flex h-36 relative'>
              <div className='min-w-[102px] h-full'>
                <Image className='rounded-l-lg' width={102} height={144} src={highestVoiceActor?.voiceActor.image ?? "https://s4.anilist.co/file/anilistcdn/staff/large/default.jpg"} alt="Thumbnail" />
              </div>
              <div className='ml-2'>
                <h2 className='text-sm'>Highested rated voice actor</h2>
                <a target='_blank' rel='noreferrer' href={`https://anilist.co/staff/${highestVoiceActor?.voiceActor.id}`} className='text-xl font-semibold hover:cursor-pointer hover:text-sky-500 hover:underline'>
                  {highestVoiceActor?.voiceActor.name}
                </a>
                <ul>
                  {highestVoiceActorAnime?.map((anime, i) => (
                    <li key={i} className='ml-2'>
                      <Tooltip title={`${anime.anime?.title} - ${anime.anime?.score}`} arrow TransitionComponent={Zoom} disableInteractive>
                        <p>{anime.character.name.length > 25 ? `${anime.character.name.substring(0, 25)}...` : anime.character.name}</p>
                      </Tooltip>
                    </li>
                  ))}
                </ul>
              </div>
              <div className='absolute right-0 min-w-[102px] h-full'>
                <Image className='rounded-r-lg' width={102} height={144} src={highestVoiceActorAnime ? highestVoiceActorAnime[0].character.image ?? "https://s4.anilist.co/file/anilistcdn/staff/large/default.jpg" : "https://s4.anilist.co/file/anilistcdn/staff/large/default.jpg"} alt="Thumbnail" />
              </div>
            </div>
            <div className='rounded-lg bg-[#fafafa] flex h-36 relative'>
              <div className='min-w-[102px] h-full'>
                <Image className='rounded-l-lg' width={102} height={144} src={mostWatchedVoiceActor?.voiceActor.image ?? "https://s4.anilist.co/file/anilistcdn/staff/large/default.jpg"} alt="Thumbnail" />
              </div>
              <div className='ml-2'>
                <h2 className='text-sm'>Most watched voice actor</h2>
                <a target='_blank' rel='noreferrer' href={`https://anilist.co/staff/${mostWatchedVoiceActor?.voiceActor.id}`} className='text-xl font-semibold hover:cursor-pointer hover:text-sky-500 hover:underline'>
                  {mostWatchedVoiceActor?.voiceActor.name}
                </a>
                <h2>{unixToRelative(mostWatchedVoiceActor?.value * 60 * 1000)}</h2>
                {mostWatchedVoiceActorAnime?.map((anime, i) => (
                  <Tooltip key={i} title={`${anime.anime?.title} - ${unixToRelative(anime.character.timeWatched * 60 * 1000)}`} arrow TransitionComponent={Zoom} disableInteractive>
                    <p>{anime.character.name.length > 48 ? `${anime.character.name.substring(0, 48)}...` : anime.character.name}</p>
                  </Tooltip>
                ))}
              </div>
              <div className='absolute right-0 min-w-[102px] h-full'>
                <Image className='rounded-r-lg' width={102} height={144} src={mostWatchedVoiceActorAnime ? mostWatchedVoiceActorAnime[0].character.image ?? "https://s4.anilist.co/file/anilistcdn/staff/large/default.jpg" : "https://s4.anilist.co/file/anilistcdn/staff/large/default.jpg"} alt="Thumbnail" />
              </div>
            </div>
          </div>
          {/* Blood type/gender */}
          <div className='w-10/12 flex flex-col gap-12 pt-12'>
            <div className="bg-white p-2 px-4">
              <h2 className='text-xl'>Highest rated blood type</h2>
              <div className='flex w-full my-8 items-center justify-center'>
                <h1 className="text-5xl font-semibold">{highestRatedBloodType?.bloodType}</h1>
              </div>
              <div className="flex justify-between">
                <h2 className="text-lg">Mean score: <strong>{(highestRatedBloodType?.value / highestRatedBloodType?.count * 10).toPrecision(2)}</strong></h2>
                <span className='text-sm'>
                  {highestRatedBloodType?.names?.slice(0, 2).map((name, i) => (
                    <p key={i}>{name}</p>
                  ))}
                </span>
              </div>
            </div>
            <div className="bg-white p-2 px-4">
              <h2 className='text-xl'>Mean score per. director gender</h2>
              <div className='flex justify-around mt-8 h-48'>
                {/* Graph. 100% height: h-40 (10rem) */}
                {meanScorePerDirectorGender.map((score, i) => (
                <Tooltip key={i} title={`Mean score: ${(score.score * 10).toPrecision(2)}`} placement='bottom' arrow TransitionComponent={Zoom}>
                  <div className="flex flex-col-reverse items-center">
                    <h1 className="text-lg">{score.gender}</h1>
                    <div className='w-12 rounded-t-lg bg-blue-500' style={{ height: `${score.score}rem`}} />
                  </div>
                </Tooltip>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {!statsAnime && (
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

export default Home