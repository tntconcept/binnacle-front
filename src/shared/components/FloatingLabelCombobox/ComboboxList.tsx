import { forwardRef } from 'react'
import { List, useColorModeValue } from '@chakra-ui/react'

export const ComboboxList = forwardRef<any, any>(({ isOpen, ...props }, ref) => {
  const bgColor = useColorModeValue('white', 'gray.600')

  return (
    <List
      display={isOpen ? null : 'none'}
      fontSize="md"
      position="absolute"
      mt="5px"
      bgColor={bgColor}
      color="gray.700"
      zIndex="999"
      width="full"
      padding={4}
      borderRadius="4px"
      boxShadow=" 0 0 8px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.05), 0 20px 25px -5px rgba(0, 0, 0, 0.1)"
      maxHeight="200px"
      overflow="auto"
      {...props}
      ref={ref}
    />
  )
})
