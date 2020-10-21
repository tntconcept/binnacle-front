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
  Icon,
  IconButton,
  InputGroup,
  InputRightElement,
  Spinner,
  useColorModeValue
} from '@chakra-ui/core'
import { useTranslation } from 'react-i18next'

interface Props {
  label: string
  isLoading: boolean
  isDisabled: boolean
  items: any[]
}

export const FloatingLabelCombobox: React.FC<Props | any> = ({
  value,
  items,
  onChange,
  label,
  onBlur,
  isDisabled,
  isLoading
}) => {
  const { t } = useTranslation()
  const [matches, setMatches] = React.useState<string[]>([])
  const combobox = useComboboxState({
    list: true,
    inline: true,
    gutter: 8,
    // @ts-ignore
    inputValue: value?.name || ''
  })

  // console.log('props', props)
  // console.log('values', values)
  // console.log('combobox', combobox)

  useEffect(() => {
    setMatches(items.map((item: any) => item.name))
  }, [items])

  useEffect(() => {
    const found = items.find((item: any) => item.name === combobox.inputValue)
    console.log('found', found)
    if (found) {
      onChange(found)
    }
  }, [combobox.inputValue, items, onChange])

  console.count('FloatingLabelCombobox')

  const labelBgColor = useColorModeValue('white', ['gray.800', 'gray.700'])

  return (
    <>
      <InputGroup size="md">
        <FloatingLabelInput
          // @ts-ignore
          as={Combobox}
          {...(combobox as any)}
          aria-label={label}
          label={label}
          labelBgColor={labelBgColor}
          // @ts-ignore
          isDisabled={isDisabled}
          // @ts-ignore
          onBlur={onBlur}
          pr="2.5rem"
        />
        <InputRightElement w="unset" h="full">
          {isLoading && <Spinner size="sm" label={t('accessibility.loading')} />}
        </InputRightElement>
      </InputGroup>
      <Box
        as={ComboboxPopover as any}
        {...combobox}
        aria-label="Fruits"
        fontSize="md"
        bgColor="white"
        color="gray.700"
        zIndex="999"
        width="full"
        padding={4}
        borderRadius="4px"
        boxShadow=" 0 0 8px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.05), 0 20px 25px -5px rgba(0, 0, 0, 0.1)"
      >
        {matches.length
          ? matches.map((value) => (
              <Box
                as={ComboboxOption as any}
                {...combobox}
                key={value}
                value={value}
                cursor="pointer"
                padding="0.5em"
                margin="0 -0.5em"
                borderRadius="4px"
                bgColor={combobox.currentValue === value ? '#e3f2fd' : 'transparent'}
                _first={{
                  mb: '-0.5em'
                }}
                _last={{
                  mt: '-0.5em'
                }}
                _hover={{
                  bgColor: '#e3f2fd'
                }}
              />
            ))
          : 'No results found'}
      </Box>
    </>
  )
}
