import React from 'react'
import { Combobox } from 'core/components'
import { fireEvent, render } from '@testing-library/react'

describe('Combobox', () => {
  const props = {
    onChange: jest.fn(),
    label: 'Fruits',
    name: 'test name',
    options: [
      {
        id: 1,
        name: 'Apple'
      },
      {
        id: 2,
        name: 'Orange'
      },
      {
        id: 3,
        name: 'Black berry'
      }
    ],
    isLoading: false
  }

  test('escape key closes the dropdown and reverts to the previously selected option', () => {
    const onChangeMocked = jest.fn()
    const combobox = render(<Combobox
      {...props}
      onChange={onChangeMocked} />)

    fireEvent.change(combobox.getByLabelText(props.label), {
      target: { value: 'App' }
    })
    fireEvent.click(combobox.getByText('Apple'))

    // Escape keyword does not trigger onChange again
    fireEvent.change(combobox.getByLabelText(props.label), {
      target: { value: '1923901' }
    })
    fireEvent.keyDown(combobox.getByLabelText(props.label), { key: 'Escape' })

    expect(onChangeMocked).toHaveBeenCalledTimes(1)
    expect(onChangeMocked).toHaveBeenCalledWith({ id: 1, name: 'Apple' })
    expect(combobox.getByLabelText(props.label)).toHaveValue('Apple')
  })

  test('home/end key selects the first or last option when open', () => {
    const combobox = render(<Combobox {...props} />)

    // Workaround to be able to send the keyboard event key
    combobox.getByLabelText(props.label).focus()
    fireEvent.change(combobox.getByLabelText(props.label), {
      target: { value: 'l' }
    })
    fireEvent.keyDown(document.activeElement!, { key: 'End' })

    expect(combobox.getByText('Black berry')).toHaveAttribute(
      'aria-selected',
      'true'
    )

    fireEvent.keyDown(document.activeElement!, { key: 'Home' })

    expect(combobox.getByText('Apple')).toHaveAttribute('aria-selected', 'true')
  })

  test('up/down arrows key expand the dropdown and move the selected option up or down', () => {
    const combobox = render(<Combobox {...props} />)

    combobox.getByLabelText(props.label).focus()
    fireEvent.change(combobox.getByLabelText(props.label), {
      target: { value: 'l' }
    })
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' })

    expect(combobox.getByText('Black berry')).toHaveAttribute(
      'aria-selected',
      'true'
    )

    fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' })

    expect(combobox.getByText('Apple')).toHaveAttribute('aria-selected', 'true')
  })

  it('enter key expands the dropdown when closed, and selects the current option and closes the dropdown when open', () => {
    const combobox = render(<Combobox {...props} />)

    combobox.getByLabelText(props.label).focus()
    fireEvent.change(combobox.getByLabelText(props.label), {
      target: { value: 'l' }
    })
    fireEvent.keyDown(document.activeElement!, { key: 'Enter' })

    expect(combobox.getByLabelText(props.label)).toHaveValue('Apple')
  })

  it('should emit undefined when blurs on an invalid option', function() {
    const onChangeMocked = jest.fn()
    const combobox = render(<Combobox
      {...props}
      onChange={onChangeMocked} />)

    combobox.getByLabelText(props.label).focus()
    fireEvent.change(combobox.getByLabelText(props.label), {
      target: { value: '123010' }
    })
    fireEvent.keyDown(document.activeElement!, { key: 'Tab' })
    combobox.getByLabelText(props.label).blur()

    expect(combobox.getByLabelText(props.label)).toHaveValue('123010')
    expect(onChangeMocked).toHaveBeenCalledWith(undefined)
  })

  it('should close the menu when an item is clicked', function() {
    const combobox = render(<Combobox {...props} />)
    fireEvent.change(combobox.getByLabelText(props.label), {
      target: { value: 'App' }
    })
    fireEvent.click(combobox.getByText('Apple'))

    expect(combobox.queryByText('Apple')).not.toBeInTheDocument()
  })
})
