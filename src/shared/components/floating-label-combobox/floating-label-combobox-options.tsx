import { InputProps } from '@chakra-ui/react'
import { forwardRef, useEffect, useState } from 'react'
import { useCombobox } from 'downshift'
import { ComboboxInput } from './combobox-input'
import { ComboboxList } from './combobox-list'
import { ComboboxItem } from './combobox-item'
import { matchSorter } from 'match-sorter'

interface Props extends Omit<InputProps, 'onChange'> {
  label: string
  items: any[]
  isLoading: boolean
  onChange: (value: any) => void
  value: any
}

export const FloatingLabelComboboxOptions = forwardRef<HTMLInputElement, Props>(
  ({ value, items, onChange, label, isDisabled, isLoading, ...props }, ref) => {
    const [inputItems, setInputItems] = useState(items)

    const {
      getInputProps,
      isOpen,
      getMenuProps,
      highlightedIndex,
      getItemProps,
      setInputValue,
      selectItem
    } = useCombobox({
      items: inputItems,
      itemToString: (item) => item?.name ?? '',
      initialInputValue: value?.name ?? '',
      onSelectedItemChange: (changes) => {
        onChange(changes.selectedItem)
      },
      onInputValueChange: ({ inputValue, selectedItem }) => {
        if (inputValue === '') {
          onChange(undefined)
          selectItem(undefined)
          return
        }

        const shouldShowAllItems =
          inputValue === '' || inputValue === undefined || selectedItem?.name === inputValue
        if (shouldShowAllItems) {
          setInputItems(items)
          return
        }

        const filteredItems = matchSorter(items, inputValue, {
          keys: ['name']
        })
        setInputItems(filteredItems)
      },
      id: props.id,
      labelId: `${props.id}-label`,
      inputId: props.id,
      menuId: `${props.id}-menu`
    })

    useEffect(() => {
      const clearInputOnUndefinedValue = () => {
        if (value === undefined) {
          setInputValue('')
        }
      }

      clearInputOnUndefinedValue()
    }, [setInputValue, value])

    useEffect(() => {
      const onNewItemsUpdateInternalInputItems = () => {
        setInputItems(items)
      }

      onNewItemsUpdateInternalInputItems()
    }, [items])

    const inputProps = getInputProps({ ref })

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

FloatingLabelComboboxOptions.displayName = 'FloatingLabelComboboxOptions'
