import { useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

type QueryParams = { [k: string]: string }

export function useQueryParams<T extends QueryParams>(initialValue?: T) {
  const [searchParams, setSearchParams] = useSearchParams()
  const getInitialQueryParams = () => {
    const formattedParamsFromQuery = Object.fromEntries(searchParams.entries()) as T
    return formattedParamsFromQuery ?? initialValue
  }

  const [state, setState] = useState<T>(() => {
    return getInitialQueryParams()
  })

  const onQueryParamsChange = (object: T) => {
    setState(object)
  }

  useEffect(() => {
    if (state) setSearchParams(Object.entries(state))
  }, [setSearchParams, state])

  return {
    queryParams: state,
    onQueryParamsChange
  }
}
