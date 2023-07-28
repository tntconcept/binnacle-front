import { useMediaQuery } from '@chakra-ui/react'

export function useIsMobile() {
  return useMediaQuery('(max-width: 767px)')
}
