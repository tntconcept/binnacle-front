import React, {useEffect, useRef, useState} from "react"
import {useCombobox, UseComboboxState, UseComboboxStateChangeOptions} from "downshift"
import style from 'core/components/FloatingLabelField/floatinglabelinput.module.css'
import classNames from 'classnames/bind'
import {useFocus} from "core/hooks/useFocus"
import Spinner from "core/components/Spinner"
import {useLabelWidth} from "core/components/FloatingLabelField/useLabelWidth"

const cx = classNames.bind(style)

// Rename to ComboboxOption
export interface IOption {
  id: number;
  name: string
}

export interface ICombobox {
  label: string
  name: string
  initialSelectedItem?: IOption
  options: IOption[]
  onSelect: (changes: Partial<UseComboboxState<IOption>>) => void
  wrapperClassname?: string
  isLoading: boolean,
  hasError?: Error | null,
  isDisabled?: boolean
}

const stateReducer = (state: UseComboboxState<IOption>, actionAndChanges: UseComboboxStateChangeOptions<IOption>) => {
  switch (actionAndChanges.type) {
    case '__input_keydown_escape__': {
      return {...state, isOpen: false}
    }
  }
  return actionAndChanges.changes
}

const Combobox: React.FC<ICombobox> = props => {
  const [filteredOptions, setFilteredOptions] = useState(props.options)
  const [labelRef, labelWidth] = useLabelWidth(props.label.length * 7.35 + 8)
  const [hasFocus, focusProps] = useFocus()
  const optionFound = useRef<IOption | undefined>(undefined)

  const combobox = useCombobox({
    items: filteredOptions,
    itemToString: (item: IOption): string => item ? item.name : '',
    onSelectedItemChange: props.onSelect,
    onInputValueChange: ({inputValue}) => {
      const filteredOptions = props.options.filter(item => !inputValue ||
        String(item.name)
          .toLocaleLowerCase()
          .includes(inputValue.toLocaleLowerCase()))

      // optionFound.current = filteredOptions.length === 1
      if (filteredOptions.length === 1) {
        optionFound.current = filteredOptions[0]
      } else {
        optionFound.current = undefined
      }

      setFilteredOptions(filteredOptions)
    },
    initialSelectedItem: props.initialSelectedItem,
    stateReducer,
  })

  useEffect(() => {
    setFilteredOptions(props.options)
  }, [props.options])

  const isFilled = combobox.inputValue && combobox.inputValue !== ""
  // @ts-ignore
  const fieldsetPaddingLeft = hasFocus || isFilled ? "8px" : 8 + labelWidth / 2 + "px"
  const legendWidth = hasFocus || isFilled ? labelWidth + "px" : "0.01px"

  const classDisabled = props.isDisabled ? ` ${style.disabled}` : ''

  return (
    <div className={style.base + " " + props.wrapperClassname || ''}>
      <label
        className={cx({
          label: true,
          labelFocused: hasFocus || isFilled,
          labelFocusedColor: hasFocus
        })}
        data-testid={(hasFocus || isFilled) ? 'label_up' : 'label_down'}
        // @ts-ignore
        ref={labelRef}
        {...combobox.getLabelProps()}
      >
        {props.label}
      </label>
      <div
        className={style.wrapper + classDisabled}
        // @ts-ignore
        {...combobox.getComboboxProps()}>
        <input
          className={style.input}
          data-testid={props.name + "_combobox"}
          readOnly={props.isLoading}
          disabled={props.isDisabled}
          {...combobox.getInputProps(
            {
              onFocus: (event) => {
                focusProps.onFocus(event)
                // combobox.openMenu()
              },
              onBlur: (event) => {
                if (optionFound.current) {
                  if (combobox.selectedItem) {
                    if (optionFound.current.id !== combobox.selectedItem.id) {
                      combobox.selectItem(optionFound.current)
                    }
                  }
                  combobox.selectItem(optionFound.current)
                  props.onSelect(
                    {
                      highlightedIndex: combobox.highlightedIndex,
                      selectedItem: optionFound.current,
                      isOpen: false,
                      inputValue: combobox.inputValue
                    }
                  )
                  combobox.setInputValue(optionFound.current.name)
                } else {
                  combobox.selectItem(undefined!)
                  props.onSelect({
                    highlightedIndex: combobox.highlightedIndex,
                    selectedItem: undefined,
                    isOpen: false,
                    inputValue: combobox.inputValue
                  })
                }

                focusProps.onBlur(event)
              }
            }
          )}
        />
        {
          props.isLoading && <Spinner />
        }
        {
          !props.isLoading && <button
            className={cx({
              dropdownIcon: true,
              dropdownIconActivated: hasFocus
            })} {...combobox.getToggleButtonProps()} aria-label={'toggleIsOpen menu'}
          />
        }
        <fieldset
          aria-hidden={true}
          className={cx({
            fieldset: true,
            fieldsetFocused: hasFocus
          })}
          style={{
            paddingLeft: fieldsetPaddingLeft
          }}
        >
          <legend
            className={style.legend}
            style={{
              width: legendWidth
            }}
          >
            <span>&#8203;</span>
          </legend>
        </fieldset>
      </div>
      <ul
        style={{
          margin: 0,
        }}
        className={cx({
          list: combobox.isOpen
        })}
        {...combobox.getMenuProps()}
      >
        {combobox.isOpen && filteredOptions.map((item, index) => (
          <li
            style={
              combobox.highlightedIndex === index ? {
                textDecoration: "underline",
                textUnderlinePosition: "under"
              } : {
                cursor: "pointer"
              }
            }
            key={item.id}
            {...combobox.getItemProps({item, index})}
          >
            {item.name}
          </li>
        ))}
      </ul>
      {props.children}
    </div>
  )
}

export default Combobox
