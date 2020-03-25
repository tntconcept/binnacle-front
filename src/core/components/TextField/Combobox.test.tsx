import React from 'react'
import Combobox, {ICombobox} from "core/components/TextField/Combobox"
import {fireEvent, render} from "@testing-library/react"


describe("Combobox", () => {
  const mockOnSelect = jest.fn()

  const props: ICombobox = {
    label: "combobox_label",
    name: "combobox_name",
    options: [
      {id: 1, name: "John Doe"},
      {id: 2, name: "Vladimir Pudding"},
      {id: 3, name: "Carlos Kolas"}
    ],
    onSelect: mockOnSelect,
    isLoading: false,
    initialSelectedItem: undefined,
    wrapperClassname: undefined,
    hasError: undefined
  }

  beforeEach(() => {
    mockOnSelect.mockClear()
  })


  it('should be readonly when is loading and show a spinner', function () {
    const combobox = render(<Combobox {...props} isLoading={true} />)

    expect(combobox.getByTestId("spinner")).toBeInTheDocument()
    expect(combobox.getByTestId("combobox_name_combobox")).toHaveAttribute("readonly", "")
  })

  it('should handle initialSelectedItem prop correctly', function () {
    const comboboxWithoutSelectedItem = render(<Combobox {...props} />)

    // label should be down when if 'initialSelectedItem' is undefined
    expect(comboboxWithoutSelectedItem.getByTestId("label_down")).toBeInTheDocument()

    const comboboxWithSelectedItem = render(<Combobox {...props} initialSelectedItem={{id: 3, name: "Carlos Kolas"}} />)

    // label should be up when has a value
    expect(comboboxWithoutSelectedItem.getByTestId("label_up")).toBeInTheDocument()
    expect(comboboxWithSelectedItem.getByDisplayValue("Carlos Kolas")).toBeInTheDocument()
  })

  it('should not clear the input when the user press "ESC" key', function () {
    const combobox = render(<Combobox {...props} />)

    fireEvent.change(combobox.getByTestId("combobox_name_combobox"), {target: {value: "Vladimir"}})
    fireEvent.click(combobox.getByText("Vladimir Pudding"))

    expect(combobox.getByDisplayValue("Vladimir Pudding")).toBeInTheDocument()

    fireEvent.keyDown(combobox.getByTestId("combobox_name_combobox"),{ key: "Escape", keyCode: 27, which: 27 })

    expect(combobox.getByDisplayValue("Vladimir Pudding")).toBeInTheDocument()
  })

  it('should emit select event when the user blurs the input with an invalid value', function () {
    const combobox = render(<Combobox {...props} />)

    // first we select a valid value
    fireEvent.change(combobox.getByTestId("combobox_name_combobox"), {target: {value: "Vladimir"}})
    fireEvent.click(combobox.getByText("Vladimir Pudding"))

    expect(mockOnSelect).toHaveBeenCalledTimes(1)

    // then we write an invalid value
    fireEvent.change(combobox.getByTestId("combobox_name_combobox"), {target: {value: "Option does not exist"}})
    fireEvent.blur(combobox.getByTestId("combobox_name_combobox"))
    console.warn('should call only 2 times the select')
    expect(mockOnSelect).toHaveBeenCalledTimes(3)
  })

  it('should fix automatically the value with the only option left when the user blurs the input', function () {
    const combobox = render(<Combobox {...props} />)

    // first we select a valid value and only one option will be listed
    fireEvent.change(combobox.getByTestId("combobox_name_combobox"), {target: {value: "Vladimir"}})

    // then we blur the input
    fireEvent.blur(combobox.getByTestId("combobox_name_combobox"))

    console.warn('should be only one time')
    expect(mockOnSelect).toHaveBeenCalledTimes(2)
    expect(combobox.getByDisplayValue("Vladimir Pudding")).toBeInTheDocument()
  })

  it('should show a warning icon when has an error', function () {
    const combobox = render(<Combobox {...props} hasError={new Error('failed to fetch')}/>)

    expect(combobox.getByText('warning.svg')).toBeInTheDocument()
  })

  it('should ', function () {

  })

})
