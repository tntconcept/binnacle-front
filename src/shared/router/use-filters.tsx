import { useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

export function useFilters<Filter extends { [k: string]: string }>(initialValue?: Filter) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filters, setFilters] = useState<Filter | undefined>(initialValue)

  const onFilterChange = (object: Filter) => {
    setFilters(object)
  }

  const setInitialValueFromQuery = () => {
    const formattedParams = Object.fromEntries(searchParams.entries()) as Filter
    const currentParams = formattedParams ? formattedParams : initialValue
    setFilters(currentParams)
  }

  useEffect(setInitialValueFromQuery, [])

  useEffect(() => {
    if (filters) setSearchParams(Object.entries(filters))
  }, [filters])

  return {
    filters,
    onFilterChange
  }
}
