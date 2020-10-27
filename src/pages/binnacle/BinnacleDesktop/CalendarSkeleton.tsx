import React from 'react'
import { Grid, Skeleton } from '@chakra-ui/core'

const CalendarSkeleton = () => {
  return (
    <Grid
      templateColumns="repeat(6, minmax(178px, 1fr))"
      gap="10px"
      mx="32px"
      mb="32px"
      data-testid="calendar_placeholder"
    >
      <Skeleton height="50px" gridColumn="1 / span 6" />
      {Array(24)
        .fill(0)
        .map((_, index) => (
          <Skeleton key={index} height="100px" />
        ))}
    </Grid>
  )
}

export default CalendarSkeleton
