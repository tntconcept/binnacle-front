import { Box, Flex, Text } from '@chakra-ui/react'
import { FC, PropsWithChildren } from 'react'

interface Props {
  color: string
  total?: number | string
}

export const LegendItem: FC<PropsWithChildren<Props>> = ({ color, total, children }) => {
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
