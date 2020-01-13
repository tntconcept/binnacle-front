import React, {useState} from "react"
import {useCombobox, UseComboboxState, UseComboboxStateChangeOptions} from "downshift"
import style from './floatinglabelinput.module.css'
import classNames from 'classnames/bind'
import {useLabelWidth} from "core/components/FloatingLabelInput"
import {useFocus} from "core/hooks/useFocus"

const cx = classNames.bind(style)

interface IOption {
  id: number;
  name: string
}

interface ICombobox {
  label: string
  name: string
  initialSelectedItem?: IOption
  options: IOption[]
  onChange: any
  wrapperClassname?: string
  isLoading: boolean
}

const stateReducer = (state: UseComboboxState<IOption>, actionAndChanges: UseComboboxStateChangeOptions<IOption>) => {
  switch (actionAndChanges.type) {
    case '__input_keydown_escape__':
      return {...actionAndChanges.changes, isOpen: false}
    /*    case '__input_keydown_enter__': {
          return {...actionAndChanges.changes, isOpen: false}
        }
        case '__input_blur__': {
          console.log(state)
          console.log(actionAndChanges)
          return actionAndChanges.changes
        }*/
  }

  return actionAndChanges.changes
}

const Combobox: React.FC<ICombobox> = props => {
  const [filteredOptions, setFilteredOptions] = useState(props.options)
  const [labelRef, labelWidth] = useLabelWidth(props.label.length * 7.35 + 8)
  const [hasFocus, focusProps] = useFocus()

  const combobox = useCombobox({
    items: filteredOptions,
    itemToString: (item: IOption): string => String(item.name),
    // initialSelectedItem: props.options.find(item => item.name === props.initialSelectedId),
    onSelectedItemChange: props.onChange,
    onInputValueChange: ({inputValue}) => {
      setFilteredOptions(
        props.options.filter(item => !inputValue ||
          String(item.name)
            .toLocaleLowerCase()
            .includes(inputValue.toLocaleLowerCase()),)
      )
    },
    initialSelectedItem: props.initialSelectedItem,
    stateReducer
  })


  console.log("isLoading", props.isLoading)


  const isFilled = combobox.inputValue && combobox.inputValue !== ""
  // @ts-ignore
  const fieldsetPaddingLeft = hasFocus || isFilled ? "8px" : 8 + labelWidth / 2 + "px"
  const legendWidth = hasFocus || isFilled ? labelWidth + "px" : "0.01px"

  return (
    <div className={style.base + " " + props.wrapperClassname}>
      <label
        className={cx({
          label: true,
          labelFocused: hasFocus || isFilled,
          labelFocusedColor: hasFocus
        })}
        // @ts-ignore
        ref={labelRef}
        {...combobox.getLabelProps()}
      >
        {props.label}
      </label>
      <div
        className={style.wrapper}
        // @ts-ignore
        {...combobox.getComboboxProps()}>
        <input
          className={style.input}
          {...combobox.getInputProps(
            {
              onFocus: focusProps.onFocus,
              onBlur: focusProps.onBlur
            }
          )}
        />
        <button className={cx({
          dropdownIcon: true,
          dropdownIconActivated: hasFocus
        })} {...combobox.getToggleButtonProps()} aria-label={'toggle menu'}/>
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
        {combobox.isOpen && props.options.length &&
        filteredOptions.map((item, index) => (
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
    </div>
  )
}

export default Combobox
