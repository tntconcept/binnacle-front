import { useMediaQuery } from 'react-responsive'

function useIsMobile() {
  const isMobile = useMediaQuery({
    query: '(max-width: 650px)'
  })

  return isMobile
}

export default useIsMobile
