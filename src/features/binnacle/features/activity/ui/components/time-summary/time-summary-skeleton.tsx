import { Box, HStack, Skeleton } from '@chakra-ui/react'
import type { FC } from 'react'

export const TimeSummarySkeleton: FC<{ isMobile?: boolean }> = (props) => {
  return (
    <Box>
      {!props.isMobile && <Skeleton height="20px" width="100px" mb={2} />}
      <HStack spacing={4} justifyContent={props.isMobile ? 'center' : undefined}>
        <Skeleton height="24px" width="40px" />
        <Skeleton height="24px" width="40px" />
        <Skeleton height="24px" width="80px" />
      </HStack>
    </Box>
  )
}
