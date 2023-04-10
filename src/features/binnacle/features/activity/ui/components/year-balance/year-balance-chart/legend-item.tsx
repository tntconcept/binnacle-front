import { Box, Flex, Text } from '@chakra-ui/react'

type Props = {
  color: string
  labels: string[]
  total?: number | string
}

export const LegendItem: React.FC<Props> = ({ labels, color, total }) => {
  return (
    <Flex gap={4} alignItems="center">
      <Box w={4} h={4} backgroundColor={color} />
      <Flex flexDirection="column">
        {labels.map((label, i) => (
          <Text key={i} fontSize="sm">
            {label}
          </Text>
        ))}
        {total && <Text fontSize="sm">{total}</Text>}
      </Flex>
    </Flex>
  )
}
