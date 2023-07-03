import { InputProps } from '@chakra-ui/react'
import { forwardRef, useEffect, useState } from 'react'
import { useCombobox } from 'downshift'
import { ComboboxInput } from 'shared/components/floating-label-combobox/combobox-input'
import { ComboboxList } from './combobox-list'
import { ComboboxItem } from 'shared/components/floating-label-combobox/combobox-item'
import { matchSorter } from 'match-sorter'

interface Props extends Omit<InputProps, 'onChange'> {
  label: string
  items: any[]
  isLoading: boolean
  onChange: (value: any) => void
  value: any
}

export const FloatingLabelCombobox = forwardRef<HTMLInputElement, Props>(
  ({ value, items, onChange, label, isDisabled, isLoading, ...props }, ref) => {
    const [inputItems, setInputItems] = useState(items)

    const {
      isOpen,
      getMenuProps,
      getInputProps,
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
      onInputValueChange: ({ inputValue, selectedItem }) => {
        // on empty value or where an item is selected, show all items
        if (inputValue === '' || selectedItem?.name === inputValue) {
          setInputItems(items)
        } else {
          const filteredItems = matchSorter(items, inputValue!, {
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

    // emit an undefined on change value when input value is empty and a selected item exists
    useEffect(() => {
      if (inputValue === '' && value !== undefined) {
        onChange(undefined)
        selectItem(undefined)
      }
    }, [inputValue, value, selectItem, onChange])

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

    const inputProps = getInputProps({
      type: 'text',
      onFocus: openMenu,
      onBlur: props.onBlur,
      ref
    })

    return (
      <>
        <ComboboxInput
          {...props}
          {...inputProps}
          label={label}
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
      </>
    )
  }
)

FloatingLabelCombobox.displayName = 'FloatingLabelCombobox'
