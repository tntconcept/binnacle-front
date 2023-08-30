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
    const [dropdownItems, setDropdownItems] = useState(items)

    const {
      getInputProps,
      isOpen,
      getMenuProps,
      highlightedIndex,
      inputValue,
      getItemProps,
      setInputValue,
      selectItem
    } = useCombobox({
      items: dropdownItems,
      itemToString: (item) => item?.name ?? '',
      initialInputValue: value?.name ?? '',
      onSelectedItemChange: (changes) => {
        onChange(changes.selectedItem)
      },
      onIsOpenChange: (changes) => {
        if (changes.isOpen) {
          setDropdownItems(items)
        }
      },
      onInputValueChange: ({ inputValue }) => {
        if (inputValue === '' || inputValue === undefined) {
          onChange(undefined)
          selectItem(undefined)
          setDropdownItems(items)
          return
        }

        const filteredItems = matchSorter(items, inputValue, {
          keys: ['name']
        })

        setDropdownItems(filteredItems)
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
        setDropdownItems(items)
      }

      onNewItemsUpdateInternalInputItems()
    }, [items])

    const inputProps = getInputProps({
      ref,
      onBlur: () => {
        const filteredItems = matchSorter(items, inputValue!, { keys: ['name'] })
        if (filteredItems.length > 0) {
          selectItem(filteredItems[0])
          onChange(filteredItems[0])
        }

        // if (dropdownItems.length > 0) {
        //   selectItem(dropdownItems[0])
        //   onChange(dropdownItems[0])
        // }
      }
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
          {dropdownItems.map((item, index) => (
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
