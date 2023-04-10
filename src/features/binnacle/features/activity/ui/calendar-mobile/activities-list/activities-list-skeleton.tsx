import { Box, Skeleton, SkeletonText, Stack } from '@chakra-ui/react'

const ActivitiesListSkeleton = () => {
  return (
    <Stack p="16px" spacing={6} direction="column">
      <Skeleton height="20px" />
      {Array(2)
        .fill(0)
        .map((_, index) => (
          <Box key={index} width="full">
            <Skeleton height="10px" />
            <SkeletonText mt="3" noOfLines={3} spacing="2" />
          </Box>
        ))}
    </Stack>
  )
}

export default ActivitiesListSkeleton
