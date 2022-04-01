import { InputProps } from '@chakra-ui/react'
import type { Ref } from 'react'
import { forwardRef, useEffect, useRef, useState } from 'react'
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
  value: any
}

const FloatingLabelCombobox = (
  { value, items, onChange, label, isDisabled, isLoading, ...props }: Props,
  /* eslint-disable  @typescript-eslint/no-unused-vars */
  ref: Ref<HTMLInputElement>
) => {
  const [inputItems, setInputItems] = useState(items)
  const initialOnChangeRef = useRef(() => onChange(undefined))

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
    openMenu,
    closeMenu,
    setInputValue,
    inputValue,
    selectItem
  } = useCombobox({
    items: inputItems,
    itemToString: (item) => (item ? item.name : ''),
    initialInputValue: value !== undefined ? value.name : '',
    onInputValueChange: ({ selectedItem }) => {
      // on empty value or where an item is selected, show all items
      if (inputValue === '' || selectedItem?.name === inputValue) {
        setInputItems(items)
      } else {
        const filteredItems = matchSorter(items, inputValue, {
          keys: ['name']
        })
        setInputItems(filteredItems)
      }
    },
    onSelectedItemChange: (changes) => {
      changes.selectedItem && onChange(changes.selectedItem)
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
      initialOnChangeRef.current()
      selectItem(undefined)
    }
  }, [inputValue, value, initialOnChangeRef, selectItem])

  // when the new value is undefined, clear the input value.
  useEffect(() => {
    if (value === undefined) {
      setInputValue('')
    }
  }, [setInputValue, value])

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
      />
      <ComboboxList isOpen={isOpen} {...getMenuProps()}>
        {inputItems.map((item, index) => (
          <ComboboxItem
            {...getItemProps({ item, index, key: item.id })}
            isActive={index === highlightedIndex}
            key={item.id}
          >
            {item.name}
          </ComboboxItem>
        ))}
      </ComboboxList>
    </div>
  )
}

export default forwardRef(FloatingLabelCombobox)
