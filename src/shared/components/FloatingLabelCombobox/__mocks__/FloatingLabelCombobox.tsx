import type { InputProps } from '@chakra-ui/react'
import type { ChangeEvent } from 'react'
import React, { forwardRef, useState } from 'react'

interface Props extends Omit<InputProps, 'onChange'> {
  label: string
  items: any[]
  isLoading: boolean
  onChange: (value: any) => void
  value: any
}

const FloatingLabelCombobox = (props: Props, ref: any) => {
  const [text, setText] = useState(props.value?.name ?? '')

  const filteredItems = props.items.filter(item => item.name.includes(text))

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value)
    const item = props.items.find(item => item.name === text)
    if (item) {
      props.onChange(item)
    }
  }

  const handleItemClick = (item: any) => {
    setText(item.name)
    props.onChange(item)
  }

  const id = props.label + '-label'

  const showOptions = !props.isLoading && !props.isDisabled

  return (
    <div>
      <label htmlFor={id}>
        {props.label}
      </label>
      <input
        id={id}
        name={props.name}
        type='text'
        ref={ref}
        value={text}
        onChange={handleOnChange}
        onBlur={props.onBlur}
        disabled={props.isDisabled}
      />
      {props.isLoading && <p>loading...</p> }
      {showOptions && (
        <ul>
          {filteredItems.map(item => <li key={item.name} onClick={() => handleItemClick(item)}>{item.name}</li>)}
        </ul>
      )}
    </div>
  )
}

export default forwardRef(FloatingLabelCombobox)
