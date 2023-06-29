import { useMediaQuery } from 'react-responsive'

function useIsMobile() {
  return useMediaQuery({
    query: '(max-width: 767px)'
  })
}

export default useIsMobile
