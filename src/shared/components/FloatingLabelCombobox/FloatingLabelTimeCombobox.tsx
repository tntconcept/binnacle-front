import { InputProps } from '@chakra-ui/react'
import type { Ref } from 'react'
import { forwardRef, useEffect, useState } from 'react'
import { useCombobox } from 'downshift'
import { ComboboxInput } from 'shared/components/FloatingLabelCombobox/ComboboxInput'
import { ComboboxList } from './ComboboxList'
import { ComboboxItem } from 'shared/components/FloatingLabelCombobox/ComboboxItem'
import { matchSorter } from 'match-sorter'

interface Props extends Omit<InputProps, 'onChange'> {
  label: string
  items: any[]
  isLoading: boolean
  onChange: (value: any) => void
  value: string
  inputStyle?: string
}

const FloatingLabelTimeCombobox = (
  { value, items, onChange, label, isDisabled, isLoading, inputStyle, ...props }: Props,
  /* eslint-disable  @typescript-eslint/no-unused-vars */
  ref: Ref<HTMLInputElement>
) => {
  const [inputItems, setInputItems] = useState(items)
  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    setHighlightedIndex,
    highlightedIndex,
    getItemProps,
    openMenu,
    closeMenu,
    setInputValue,
    inputValue,
    selectItem
  } = useCombobox({
    items: inputItems,
    initialInputValue: value,
    onInputValueChange: ({ inputValue, selectedItem }) => {
      // if the value does not match the structure, delete it
      if (
        !(
          /^\d$/.test(inputValue!) ||
          /^\d{2}$/.test(inputValue!) ||
          /^\d{2}:\d$/.test(inputValue!) ||
          /^\d{2}:\d{2}$/.test(inputValue!)
        )
      ) {
        setInputValue(inputValue!.slice(0, -1))
      }
      // on empty value or where an item is selected, show all items
      if (inputValue === '' || selectedItem === inputValue) {
        setInputItems(items)
      } else {
        const filteredItems = matchSorter(items, inputValue!)
        if (filteredItems.length !== 0) setHighlightedIndex(0)
        setInputItems(filteredItems)
      }
      if (inputValue?.length == 3) {
        if (!inputValue.includes(':')) {
          const splitValue = inputValue.split('')
          inputValue = splitValue[0] + splitValue[1] + ':' + splitValue[2]
          setInputValue(inputValue)
        } else {
          const splitValue = inputValue.split('')
          inputValue = splitValue[0] + splitValue[1]
          setInputValue(inputValue)
        }
      }
      if (inputValue?.length == 5) {
        onChange(inputValue)
      }
    },
    onSelectedItemChange: (changes) => {
      changes.selectedItem && onChange(changes.selectedItem)
      setInputValue(changes.selectedItem)
      closeMenu()
    },
    id: props.id,
    labelId: `${props.id}-label`,
    inputId: props.id,
    menuId: `${props.id}-menu`
  })

  // emit an undefined on change value when input value is empty and there exist an selected item
  useEffect(() => {
    if (inputValue === '' && value !== undefined) {
      onChange(undefined)
      selectItem(undefined)
    }
  }, [inputValue, value, selectItem, onChange])

  // on new items update internal input items
  useEffect(() => {
    setInputItems(items)
  }, [items])

  return (
    <div {...getComboboxProps()}>
      <ComboboxInput
        {...props}
        label={label}
        {...getInputProps({
          type: 'text',
          onFocus: openMenu,
          onBlur: props.onBlur
        })}
        isDisabled={isDisabled}
        isLoading={isLoading}
        inputStyle={inputStyle}
      />
      <ComboboxList isOpen={isOpen} {...getMenuProps()}>
        {inputItems.map((item, index) => (
          <ComboboxItem
            {...getItemProps({ item, index, key: index })}
            isActive={index === highlightedIndex}
            key={index}
          >
            {item}
          </ComboboxItem>
        ))}
      </ComboboxList>
    </div>
  )
}

export default forwardRef(FloatingLabelTimeCombobox)
