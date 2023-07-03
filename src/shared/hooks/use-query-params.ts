import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

type QueryParams = Record<string, string>
type UpdateQueryParamsFn = (newParams: QueryParams) => void

export function useQueryParams(initialParams: QueryParams): {
  queryParams: QueryParams
  updateQueryParams: UpdateQueryParamsFn
} {
  const [urlQueryParams, setUrlQueryParams] = useSearchParams()
  const [filters, setFilters] = useState<QueryParams>(initialParams)

  useEffect(() => {
    const filters = Object.fromEntries(urlQueryParams.entries())
    setFilters(filters)
  }, [urlQueryParams])

  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      setUrlQueryParams(filters)
    }
  }, [filters, setUrlQueryParams])

  const updateQueryParams = (params: QueryParams) => {
    setUrlQueryParams(params)
  }

  return { queryParams: filters, updateQueryParams }
}
