import React, { forwardRef } from 'react'
import { FormLabel, Input, Box, InputProps, useColorModeValue } from '@chakra-ui/core'

interface Props extends InputProps {
  label: string
  labelBgColor: string | string[]
}

export const FloatingLabelInput = forwardRef<HTMLInputElement, Props>(
  ({ label, labelBgColor, ...props }, ref) => {
    const focusBorderColor = useColorModeValue('brand.500', 'brand.50')

    return (
      <Box position="relative" width="full">
        <Input
          autoCorrect="off"
          autoComplete="off"
          spellCheck="false"
          h="47px"
          focusBorderColor={focusBorderColor}
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
          borderRadius="4px"
        >
          <FormLabel m={0} color={props.isDisabled ? 'gray.400' : undefined}>
            {label}
          </FormLabel>
        </Box>
      </Box>
    )
  }
)
