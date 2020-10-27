import React, { useEffect } from 'react'
import {
  unstable_useComboboxState as useComboboxState,
  unstable_Combobox as Combobox,
  unstable_ComboboxPopover as ComboboxPopover,
  unstable_ComboboxOption as ComboboxOption
} from 'reakit/Combobox'

import { FloatingLabelInput } from 'core/components/FloatingLabelInput'
import {
  Box,
  InputGroup,
  InputProps,
  InputRightElement,
  Spinner,
  useColorModeValue
} from '@chakra-ui/core'
import { useTranslation } from 'react-i18next'
import { matchSorter } from 'match-sorter'

interface Props extends Omit<InputProps, 'onChange'> {
  label: string
  items: any[]
  isLoading: boolean
  onChange: (value: any) => void
  value: any
}

export const FloatingLabelCombobox: React.FC<Props> = ({
  value,
  items,
  onChange,
  label,
  onBlur,
  isDisabled,
  isLoading,
  ...props
}) => {
  const { t, i18n } = useTranslation()
  const [matches, setMatches] = React.useState<{ id: number; name: string }[]>([])
  const combobox = useComboboxState({
    list: true,
    inline: true,
    gutter: 8,
    // @ts-ignore
    inputValue: value?.name || ''
  })

  // When the input value match an option then trigger the onChange callback
  useEffect(() => {
    const found = items.find((item: any) => item.name === combobox.inputValue)
    if (found && combobox.inputValue !== (value?.name || '')) {
      onChange(found)
    }
  }, [combobox.inputValue, items, onChange, value])

  // When the input value changes, update list with the new matches
  useEffect(() => {
    setMatches(
      matchSorter(items, combobox.inputValue, {
        keys: ['name']
      })
    )
  }, [combobox.inputValue, items])

  // When the value is undefined clear the input value.
  useEffect(() => {
    if (value === undefined) {
      combobox.setInputValue('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [combobox.setInputValue, value])

  const labelBgColor = useColorModeValue('white', ['gray.800', 'gray.700'])
  const listBgColor = useColorModeValue('white', 'gray.600')
  const optionColor = useColorModeValue('black', 'whiteAlpha.900')
  const optionHoverBgColor = useColorModeValue('brand.500', 'darkBrand.600')

  const listBoxLabelNamePlural = i18n.language.includes('es') ? 'es' : 's'

  return (
    <div>
      <InputGroup size="md">
        <FloatingLabelInput
          as={Combobox as any}
          {...(combobox as any)}
          aria-label={label}
          label={label}
          labelBgColor={labelBgColor}
          isDisabled={isDisabled}
          onBlur={onBlur}
          pr="2.5rem"
          {...props}
        />
        <InputRightElement w="unset" h="full">
          {isLoading && <Spinner size="sm" label={t('accessibility.loading')} />}
        </InputRightElement>
      </InputGroup>
      <Box
        as={ComboboxPopover as any}
        {...combobox}
        aria-label={label + listBoxLabelNamePlural}
        fontSize="md"
        bgColor={listBgColor}
        color="gray.700"
        zIndex="999"
        width="full"
        padding={4}
        borderRadius="4px"
        boxShadow=" 0 0 8px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.05), 0 20px 25px -5px rgba(0, 0, 0, 0.1)"
        maxHeight="200px"
        overflow="scroll"
        // workaround to fix layout blink... popover transform value is invalid in the first render
        // this disable the transform property and use the top value to set the list below the combobox input
        style={{
          transform: undefined,
          top: '55px'
        }}
      >
        {matches.length && !isLoading
          ? matches.map((value) => (
              <Box
                as={ComboboxOption as any}
                {...combobox}
                key={value.id}
                value={value.name}
                cursor="pointer"
                padding="0.5em"
                margin="0 -0.5em"
                borderRadius="4px"
                color={combobox.currentValue === value.name ? 'white' : optionColor}
                bgColor={combobox.currentValue === value.name ? optionHoverBgColor : 'transparent'}
                _first={{
                  mt: '-0.5em'
                }}
                _last={{
                  mb: '-0.5em'
                }}
                _hover={{
                  bgColor: optionHoverBgColor,
                  color: 'white'
                }}
              />
            ))
          : 'No results found'}
      </Box>
    </div>
  )
}
