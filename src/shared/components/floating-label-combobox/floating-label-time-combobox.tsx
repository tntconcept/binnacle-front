import { InputProps } from '@chakra-ui/react'
import { useCombobox } from 'downshift'
import { matchSorter } from 'match-sorter'
import type { Ref } from 'react'
import { forwardRef, useEffect, useState } from 'react'
import { getNearestTimeOption } from '../../utils/chrono'
import { ComboboxInput } from './combobox-input'
import { ComboboxItem } from './combobox-item'
import { ComboboxList } from './combobox-list'

interface Props extends Omit<InputProps, 'onChange'> {
  label: string
  items: any[]
  isLoading: boolean
  onChange: (value: any) => void
  value: string
  inputStyle?: string
}

export const FloatingLabelTimeCombobox = forwardRef(
  (
    { value, items, onChange, label, isDisabled, isLoading, inputStyle, ...props }: Props,
    ref: Ref<HTMLInputElement>
  ) => {
    const NUMBER_DIGITS_TIME_INPUT = 5
    const POSITION_COLON_TIME_INPUT = 3
    const [dropdownItems, setDropdownItems] = useState(items)

    const [isInputValueValid, setIsInputValueValid] = useState(false)

    const {
      isOpen,
      selectItem,
      getMenuProps,
      inputValue,
      getInputProps,
      highlightedIndex,
      setHighlightedIndex,
      getItemProps,
      setInputValue
    } = useCombobox({
      items: dropdownItems,
      initialInputValue: value,
      scrollIntoView: (node, menuNode) => {
        if (node && menuNode) {
          const { offsetTop, offsetHeight } = node
          const { offsetHeight: menuHeight, scrollTop } = menuNode
          const itemCenter = offsetTop + offsetHeight / 2
          const menuCenter = scrollTop + menuHeight / 2

          if (itemCenter < menuCenter) {
            menuNode.scrollTo({ top: offsetTop - menuHeight / 2 + offsetHeight / 2 })
          } else if (itemCenter > menuCenter) {
            menuNode.scrollTo({ top: offsetTop + offsetHeight / 2 - menuHeight / 2 })
          }
        }
      },
      onIsOpenChange: (changes) => {
        if (changes.isOpen) {
          setDropdownItems(items)
          setHighlightedIndex(items.indexOf(inputValue))
        }
      },
      onInputValueChange: ({ inputValue }) => {
        checkInputValueStructure(inputValue)
        setDropdownItemsBasedOnInputValue(inputValue)

        if (inputValue?.length === POSITION_COLON_TIME_INPUT) {
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

        if (inputValue && inputValue.length < NUMBER_DIGITS_TIME_INPUT) {
          onChange(undefined)
        }
        if (inputValue && inputValue.length < NUMBER_DIGITS_TIME_INPUT && isInputValueValid) {
          setIsInputValueValid(false)
        }
        if (inputValue?.length === NUMBER_DIGITS_TIME_INPUT && !isInputValueValid) {
          const validInputValue = getNearestTimeOption(inputValue)
          onChange(validInputValue)
          setInputValue(validInputValue)
          setIsInputValueValid(true)
        }
      },
      onSelectedItemChange: (changes) => {
        if (changes.selectedItem !== undefined) {
          onChange(changes.selectedItem)
        }
      },
      id: props.id,
      labelId: `${props.id}-label`,
      inputId: props.id,
      menuId: `${props.id}-menu`
    })

    const checkInputValueStructure = (inputValue: string | undefined) => {
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
    }
    const setDropdownItemsBasedOnInputValue = (inputValue: string | undefined) => {
      if (inputValue === '' || inputValue === undefined) {
        setDropdownItems(items)
      } else {
        const filteredItems = matchSorter(items, inputValue!)
        setDropdownItems(filteredItems)
        setHighlightedIndex(0)
      }
    }

    useEffect(() => {
      setDropdownItemsBasedOnInputValue(inputValue)
    }, [items])

    const inputProps = getInputProps({
      onFocus: () => {
        selectItem(inputValue)
      },
      onBlur: () => {
        if (!inputValue && highlightedIndex === -1) return

        const filteredItems = matchSorter(items, inputValue)
        if (filteredItems.length > 0) {
          highlightedIndex === -1
            ? selectItem(filteredItems[0])
            : selectItem(dropdownItems[highlightedIndex])
        }
      },
      ref
    })

    return (
      <div>
        <ComboboxInput
          {...props}
          {...inputProps}
          label={label}
          isDisabled={isDisabled}
          isLoading={isLoading}
          inputStyle={inputStyle}
        />
        <ComboboxList isOpen={isOpen} {...getMenuProps()}>
          {dropdownItems.map((item, index) => (
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
)

FloatingLabelTimeCombobox.displayName = 'FloatingLabelTimeCombobox'
