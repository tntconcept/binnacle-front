import { Flex, SkeletonCircle } from '@chakra-ui/react'

const CalendarWeekSkeleton = () => {
  return (
    <Flex justify="space-between" direction="row" m="0 16px 16px">
      {Array(7)
        .fill(0)
        .map((_, index) => (
          <SkeletonCircle key={index} />
        ))}
    </Flex>
  )
}

export default CalendarWeekSkeleton
