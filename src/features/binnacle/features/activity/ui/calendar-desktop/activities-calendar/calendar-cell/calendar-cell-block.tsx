import { Flex, useColorModeValue } from '@chakra-ui/react'
import type { FC, PropsWithChildren } from 'react'

interface Props {
  noBorderRight: boolean
}

export const CalendarCellBlock: FC<PropsWithChildren<Props>> = (props) => {
  const borderColor = useColorModeValue('gray.300', 'gray.700')

  return (
    <Flex
      direction="column"
      height="100%"
      borderTop="1px solid"
      borderRight={props.noBorderRight ? 0 : '1px solid'}
      borderColor={borderColor}
    >
      {props.children}
    </Flex>
  )
}
