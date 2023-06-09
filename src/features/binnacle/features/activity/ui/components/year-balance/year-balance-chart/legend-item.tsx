import { Box, Flex, Text } from '@chakra-ui/react'

interface Props {
  color: string
  total?: number | string
  children: React.ReactNode
}

export const LegendItem = ({ color, total, children }: Props) => {
  return (
    <Flex gap={4} alignItems="center">
      <Box w={4} h={4} backgroundColor={color} />
      <Flex flexDirection="column">
        {children}
        {total && <Text fontSize="sm">{total}</Text>}
      </Flex>
    </Flex>
  )
}
