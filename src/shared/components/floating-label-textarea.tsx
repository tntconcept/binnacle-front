import type { TextareaProps } from '@chakra-ui/react'
import { Box, FormLabel, Textarea, useColorModeValue } from '@chakra-ui/react'
import { forwardRef } from 'react'
import ResizeTextarea from 'react-textarea-autosize'

interface Props extends TextareaProps {
  label: string
}

export const FloatingLabelTextarea = forwardRef<HTMLTextAreaElement, Props>(
  ({ label, ...props }, ref) => {
    const focusBorderColor = useColorModeValue('brand.500', 'gray.500')
    const labelBgColor = useColorModeValue('white', 'gray.700')

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
          {...props}
        />
        <Box
          position="absolute"
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

FloatingLabelTextarea.displayName = 'FloatingLabelTextarea'
