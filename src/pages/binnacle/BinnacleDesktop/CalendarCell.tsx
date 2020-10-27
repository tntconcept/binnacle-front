import React from 'react'
import { Flex, useColorModeValue } from '@chakra-ui/core'

interface Props {
  noBorderRight: boolean
}

const CalendarCell: React.FC<Props> = (props) => {
  const borderColor = useColorModeValue('gray.300', 'gray.700')

  return (
    <Flex
      direction="column"
      height="100%"
      minHeight="100px"
      borderTop="1px solid"
      borderRight={props.noBorderRight ? 0 : '1px solid'}
      borderColor={borderColor}
    >
      {props.children}
    </Flex>
  )
}

export default CalendarCell
