import { InputProps } from '@chakra-ui/react'
import { useCombobox } from 'downshift'
import { matchSorter } from 'match-sorter'
import { forwardRef, useEffect, useState } from 'react'
import { ComboboxInput } from './combobox-input'
import { ComboboxItem } from './combobox-item'
import { ComboboxList } from './combobox-list'

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
    const [isShiftTabPressed, setIsShiftTabPressed] = useState<boolean>(false)

    const {
      getInputProps,
      isOpen,
      getMenuProps,
      highlightedIndex,
      setHighlightedIndex,
      inputValue,
      getItemProps,
      setInputValue,
      selectItem
    } = useCombobox({
      items: dropdownItems,
      itemToString: (item) => item?.name ?? '',
      initialInputValue: value?.name ?? '',
      onIsOpenChange: (changes) => {
        if (changes.isOpen) {
          setDropdownItems(items)
          setHighlightedIndex(
            inputValue === '' ? 0 : items.map((item) => item.name).indexOf(inputValue)
          )
        }
      },
      onSelectedItemChange: (changes) => {
        onChange(changes.selectedItem)
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
        setHighlightedIndex(0)
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
      onKeyDown: (e) => {
        if (e.code === 'Tab' && e.shiftKey) {
          setIsShiftTabPressed(true)
          return
        }

        setIsShiftTabPressed(false)
      },
      onBlur: () => {
        setTimeout(() => {
          const hasHighlightedItem = highlightedIndex !== -1
          if (!inputValue && !hasHighlightedItem) return
          if (isShiftTabPressed) return

          const filteredItems =
            inputValue === '' ? dropdownItems : matchSorter(items, inputValue, { keys: ['name'] })

          if (filteredItems.length === 0) return
          hasHighlightedItem
            ? selectItem(dropdownItems[highlightedIndex])
            : selectItem(filteredItems[0])
        }, 0)
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
        <ComboboxList isOpen={isOpen && !isDisabled} {...getMenuProps()}>
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
