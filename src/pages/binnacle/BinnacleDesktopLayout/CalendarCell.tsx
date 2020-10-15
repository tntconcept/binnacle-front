import React from 'react'
import { Flex } from '@chakra-ui/core'

interface Props {
  noBorderRight: boolean
}

const CalendarCell: React.FC<Props> = (props) => {
  return (
    <Flex
      direction="column"
      height="100%"
      minHeight="100px"
      borderTop="1px solid"
      borderRight={props.noBorderRight ? 0 : '1px solid'}
      borderColor="gray.300"
    >
      {props.children}
    </Flex>
  )
}

export default CalendarCell
