import { useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

type QueryParams = { [k: string]: string }

export function useQueryParams<T extends QueryParams>(initialValue?: T) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [state, setState] = useState<T | undefined>(initialValue)

  const onQueryParamsChange = (object: T) => {
    setState(object)
  }

  const setInitialValue = () => {
    const formattedParams = Object.fromEntries(searchParams.entries()) as T
    const currentParams = initialValue ?? formattedParams
    setState(currentParams)
  }

  useEffect(setInitialValue, [])

  useEffect(() => {
    if (state) setSearchParams(Object.entries(state))
  }, [state])

  return {
    queryParams: state,
    onQueryParamsChange
  }
}
