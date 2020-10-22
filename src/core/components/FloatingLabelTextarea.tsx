import React from 'react'
import { Box, FormLabel, Textarea, useColorModeValue } from '@chakra-ui/core'
import ResizeTextarea from 'react-textarea-autosize'

interface Props extends React.InputHTMLAttributes<Omit<HTMLTextAreaElement, 'size'>> {
  label: string
}

export const FloatingLabelTextarea = React.forwardRef<HTMLTextAreaElement, Props>(
  ({ label, ...props }, ref) => {
    const labelBgColor = useColorModeValue('white', ['gray.800', 'gray.700'])
    const focusBorderColor = useColorModeValue('brand.500', 'brand.50')

    return (
      <Box position="relative" width="full">
        <Textarea
          minH="unset"
          overflow="hidden"
          w="100%"
          resize="none"
          minRows={5}
          transition="height none"
          focusBorderColor={focusBorderColor}
          as={ResizeTextarea}
          ref={ref}
          {...(props as any)}
        />
        <Box
          position="absolute"
          // up -12px ### down 15px
          top="-12px"
          left="14px"
          zIndex="1"
          padding="0 4px"
          bgColor={labelBgColor}
        >
          <FormLabel m={0}>{label}</FormLabel>
        </Box>
      </Box>
    )
  }
)
