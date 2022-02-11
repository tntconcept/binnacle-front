import { lazy } from 'react'

export const LazyBinnaclePage = lazy(
  () =>
    import(
      /* webpackChunkName: "binnacle", webpackPrefetch: true */ 'modules/binnacle/page/BinnaclePage'
    )
)
