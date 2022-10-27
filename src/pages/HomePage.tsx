import React, { useState, useEffect } from 'react'
import { RepoCard } from '../components/RepoCard'
import { useDebounse } from '../hooks/debounce'
import { useSearchUsersQuery, useLazyGetUserReposQuery } from '../store/github/github.api'


export function HomePage() {
  const [search, setSearch] = useState('')
  const [dropdoun, setDropdoun] = useState(false)
  const debounced = useDebounse(search)
  const {isLoading, isError, data} = useSearchUsersQuery(debounced, {
    skip: debounced.length < 3,
    refetchOnFocus: true
  })

  const [fetchRepos, {isLoading: areReposFoading, data: repos}] = useLazyGetUserReposQuery()

  useEffect(() =>{
    setDropdoun( debounced.length > 3 && data?.length! > 0)
    console.log(debounced)
  }, [debounced, data])

  const clickHandler = ( username: string ) => {
    fetchRepos(username)
    setDropdoun(false)
  }

  return (
    <div className='flex justify-center pt-10 mx-auto h-screan w-screan'>
      { isError && <p className='text-center text-red-600'>Something went wrong....</p>}

      <div className="relative w-[560px]">
      <input 
          type="text"
          className="border py-2 px-4 w-full h-[42] mb-2"
          placeholder="Search for Github username..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        {dropdoun && <ul className='list-none absolute top-[42px] left-0 right-0 max-h-[200px] overflow-y-scroll shadow-md bg-white'>
          { isLoading && <p className='text-center'>Loading...</p> }
          {data?.map(user => (
            <li
              key={user.id}
              onClick={() => clickHandler(user.login)}
              className="py-2 px-4 hover:bg-gray-500 hover:text-white transition-colors cursor-pointer"
            >{ user.login }</li>
          ))}
        </ul>}

        <div className='container'>
          { areReposFoading && <p className='text-center'>Repos are loading...</p> }
          { repos?.map(repo => <p>{<RepoCard repo={repo} key={repo.id}/>}</p>) }
        </div>
      </div>
    </div>
  )
}