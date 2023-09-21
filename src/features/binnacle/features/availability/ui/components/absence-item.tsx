import { Box } from '@chakra-ui/react'
import { FC } from 'react'

interface Props {
  duration: number
  type: string
}

export const AbsenceItem: FC<Props> = ({ duration, type }) => {
  return (
    <Box
      fontSize="xs"
      py="4px"
      px="8px"
      gap="4px"
      overflow="hidden"
      textOverflow="ellipsis"
      whiteSpace="nowrap"
      width={`calc(${duration * 100}% - 1em)`}
      border="none"
      display="flex"
      bgColor={'gray.400'}
      borderRadius="14px"
      zIndex={1}
      style={{
        position: 'absolute',
        top: '50%',
        transform: 'translate(0, -50%)'
      }}
    >
      {type}
    </Box>
  )
}
