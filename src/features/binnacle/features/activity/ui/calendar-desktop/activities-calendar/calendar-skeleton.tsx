import { Grid, Skeleton } from '@chakra-ui/react'

export const CalendarSkeleton = () => {
  return (
    <Grid
      height="100vh"
      templateRows="50px"
      templateColumns="repeat(6, minmax(178px, 1fr))"
      gap="2px"
      mx="32px"
      mb="32px"
      data-testid="calendar_placeholder"
    >
      <Skeleton height="50px" gridColumn="1 / span 6" />
      {Array(24)
        .fill(0)
        .map((_, index) => (
          <Skeleton key={index} minHeight="100px" />
        ))}
    </Grid>
  )
}
