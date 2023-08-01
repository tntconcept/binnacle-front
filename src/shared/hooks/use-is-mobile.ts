import { useMediaQuery } from '@chakra-ui/react'

export function useIsMobile() {
  const [isMobile] = useMediaQuery('(max-width: 767px)')
  return isMobile
}
