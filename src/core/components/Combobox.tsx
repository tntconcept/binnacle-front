import React from "react"
import Downshift, {ControllerStateAndHelpers} from "downshift"

interface Item {
  id: number; name: string
}

interface ICombobox {
  label: string;
  name: string;
  initialSelectedId?: number;
  items: Item[];
}

const Combobox: React.FC<ICombobox> = props => {

  const handleChange = (selection: Item | null, stateAndHelpers: ControllerStateAndHelpers<Item>) => {
    alert(
      selection ? `You selected ${selection.name}` : "Selection Cleared"
    )
  }

  return (
    <Downshift
      onChange={handleChange}
      itemToString={item => (item ? item.name : "")}
    >
      {({
        getInputProps,
        getItemProps,
        getLabelProps,
        getMenuProps,
        isOpen,
        inputValue,
        highlightedIndex,
        selectedItem,
        getRootProps
      }) => (
        <div>
          <label {...getLabelProps()}>{props.label}</label>
          <div
            style={{ display: "inline-block" }}
            // @ts-ignore
            {...getRootProps({}, { suppressRefError: true })}
          >
            <input {...getInputProps()} />
          </div>
          <ul {...getMenuProps()}>
            {isOpen
              ? props.items
                .filter(item => !inputValue || item.name.includes(inputValue))
                .map((item, index) => (
                  <li
                    {...getItemProps({
                      key: item.id,
                      index,
                      item,
                      style: {
                        backgroundColor:
                            highlightedIndex === index ? "lightgray" : "white",
                        fontWeight: selectedItem === item ? "bold" : "normal"
                      }
                    })}
                  >
                    {item.name}
                  </li>
                ))
              : null}
          </ul>
        </div>
      )}
    </Downshift>
  );
};

export default Combobox;
