import type { InputProps } from "@chakra-ui/react";
import {
  Box,
  FormLabel,
  Input,
  Text,
  useColorModeValue,
  useFormControlContext
} from "@chakra-ui/react";
import { forwardRef, useState } from "react";

interface Props extends InputProps {
  label: string
  inputBgColor?: string | string[]
}

export const FloatingLabelInput = forwardRef<HTMLInputElement, Props>(
  ({ label, inputBgColor, ...props }, ref) => {
    const field = useFormControlContext();

    const getBorderColor = (theme: 'light' | 'dark') => {
      switch (theme) {
        case 'light': {
          if (field.isDisabled) {
            return 'whiteAlpha.200'
          }

          if (field.isInvalid) {
            return '#E53E3E'
          }

          return 'gray.200'
        }
        case 'dark': {
          if (field.isDisabled) {
            return 'whiteAlpha.200'
          }

          if (field.isInvalid) {
            return '#E53E3E'
          }

          return 'whiteAlpha.300'
        }
      }
    }

    const borderColor = useColorModeValue(getBorderColor('light'), getBorderColor('dark'))
    const focusBorderColor = useColorModeValue('brand.500', 'gray.500')
    const [focused, setFocused] = useState(false)

    return (
      <Box position="relative" width="full" borderRadius="4px">
        <FormLabel
          color={props.isDisabled ? 'gray.400' : undefined}
          sx={{
            m: 0,
            position: 'absolute',
            top: '-10px',
            left: '13px',
            zIndex: '1'
          }}
        >
          {label}
        </FormLabel>
        <Input
          autoCorrect="off"
          autoComplete="off"
          spellCheck="false"
          autoCapitalize="none"
          h="47px"
          border="0"
          outline="none"
          {...(props as any)}
          onFocus={(event) => {
            setFocused(true)
            props.onFocus && props.onFocus(event)
          }}
          onBlur={(event) => {
            setFocused(false)
            props.onBlur && props.onBlur(event)
          }}
          backgroundColor={inputBgColor}
          ref={ref}
        />
        <Box
          as="fieldset"
          aria-hidden="true"
          sx={{
            position: 'absolute',
            margin: '0',
            padding: '0px 8px',
            pointerEvents: 'none',
            borderRadius: 'inherit',
            borderStyle: 'solid',
            borderWidth: focused || field.isInvalid ? '2px' : '1px',
            overflow: 'hidden',
            minWidth: '0%',
            borderColor: focused ? focusBorderColor : borderColor
          }}
          style={{
            inset: '-5px 0 0'
          }}
        >
          <Box
            as="legend"
            sx={{
              display: 'block',
              width: 'auto',
              p: '0',
              height: '11px',
              visibility: 'hidden',
              maxWidth: '100%'
            }}
          >
            <Text as="span" px="5px" display="inline-block">
              {label}
            </Text>
          </Box>
        </Box>
      </Box>
    )
  }
)

FloatingLabelInput.displayName = 'FloatingLabelInput'
