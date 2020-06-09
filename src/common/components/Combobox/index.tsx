import React, {useEffect, useMemo, useRef, useState} from "react"
import fuzzysearch from "fuzzysearch"
import {Spinner, TextField, VisuallyHidden} from "common/components"
import {getActionFromKey, getUpdatedIndex, isScrollable, maintainScrollVisibility, MenuActions} from "./ComboboxHelpers"
import styles from "./Combobox.module.css"
import {cls} from "utils/helpers"

export interface ComboboxOption {
  id: number;
  name: string;
}

interface ICombobox {
  label: string
  name: string
  value?: ComboboxOption
  onChange: (value: ComboboxOption) => void;
  options: ComboboxOption[];
  isLoading: boolean;
  isDisabled?: boolean;
  hasError?: boolean
  errorText?: string
}

const Combobox: React.FC<ICombobox> = props => {
  const [keepLabelUp, setKeepLabelUp] = useState(false)

  /** Active option index */
  const [activeIndex, setActiveIndex] = useState(0);
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const [inputValue, setInputValue] = useState(props.value?.name ?? "");

  const activeOptionRef = useRef<HTMLElement | null>(null);
  /** Prevent menu closing before click completed */
  const ignoreBlur = useRef<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  /** save the last selected value */
  const selectedValue = useRef<string>("");

  const filteredOptions = useMemo(() => {
    return props.options.filter(
      item =>
        !inputValue ||
        fuzzysearch(
          inputValue.toLocaleLowerCase(),
          item.name.toLocaleLowerCase()
        )
    );
  }, [inputValue, props.options]);

  const selectOption = (index: number) => {
    const selected = filteredOptions[index];

    if (selected) {
      setInputValue(selected.name);
      selectedValue.current = selected.name;
      setActiveIndex(0);
    }

    props.onChange(selected);
  };

  const updateMenuState = (open: boolean, callFocus = true) => {
    setMenuIsOpen(open);
    callFocus && inputRef.current && inputRef.current.focus();
  };

  const handleBlur = () => {
    if (ignoreBlur.current) {
      ignoreBlur.current = false;
      return;
    }

    if (menuIsOpen) {
      selectOption(activeIndex);
      updateMenuState(false, false);
    } else {
      // console.log("blur with menu closed", filteredOptions[activeIndex])
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.currentTarget.value);

    // TODO RESET ACTIVE INDEX AFTER THE OPTIONS ARE FILTERED

    const menuState = filteredOptions.length > 0;
    if (menuIsOpen !== menuState) {
      updateMenuState(menuState, false);
    }
  };

  const onOptionChange = (index: number) => {
    setActiveIndex(index);
  };

  const onOptionClick = (index: number) => {
    onOptionChange(index);
    selectOption(index);
    setMenuIsOpen(false)
  };

  const onOptionMouseDown = () => {
    ignoreBlur.current = true;
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = event;
    const max = filteredOptions.length - 1;
    const action = getActionFromKey(key, menuIsOpen)!;

    switch (action) {
      case MenuActions.Next:
      case MenuActions.Last:
      case MenuActions.First:
      case MenuActions.Previous:
        event.preventDefault();
        return onOptionChange(getUpdatedIndex(activeIndex, max, action));
      case MenuActions.CloseSelect:
        event.preventDefault();
        selectOption(activeIndex);
        return updateMenuState(false);
      case MenuActions.Close:
        event.preventDefault();
        ignoreBlur.current = true
        setActiveIndex(0);
        setInputValue(selectedValue.current);
        return updateMenuState(false);
      case MenuActions.Open:
        return updateMenuState(true);
    }
  };

  useEffect(() => {
    if (menuIsOpen && isScrollable(listboxRef)) {
      maintainScrollVisibility(activeOptionRef, listboxRef);
    }
  });

  // Clear the input value when the value prop is undefined
  useEffect(() => {
    if (props.value === undefined) {
      setInputValue('')
      setKeepLabelUp(false)
    }
  }, [props.value])

  const htmlId = "ComboboxPoc";
  const activeId = menuIsOpen ? `${htmlId}-${activeIndex}` : "";

  return (
    <div className={styles.base}>
      <TextField
        name={props.name+ "_combobox"}
        label={props.label}
        aria-activedescendant={activeId}
        aria-autocomplete="list"
        aria-controls={`${htmlId}-listbox`}
        aria-expanded={menuIsOpen}
        aria-haspopup="listbox"
        aria-labelledby={htmlId}
        autoComplete='off'
        role="combobox"
        ref={inputRef}
        type="text"
        value={inputValue}
        disabled={props.isDisabled}
        onBlur={handleBlur}
        onFocus={() => setMenuIsOpen(true)}
        onClick={() => updateMenuState(true)}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        keepLabelUp={keepLabelUp}
        error={props.hasError}
        errorText={props.errorText}
      />
      {props.isLoading && <Spinner className={styles.spinner}/>}
      {!props.isLoading && (
        <button
          tabIndex={-1}
          className={cls(
            styles.dropdownIcon,
            menuIsOpen && styles.dropdownIconActivated
          )}
        />
      )}
      <ul
        className={menuIsOpen ? styles.menu : undefined}
        role="listbox"
        ref={listboxRef}
        id={`${htmlId}-listbox`}>
        {menuIsOpen && filteredOptions.map((option, index) => (
          <li
            key={option.name}
            style={{
              fontWeight: activeIndex === index ? "bold" : "inherit"
            }}
            id={`${htmlId}-${index}`}
            aria-selected={activeIndex === index ? "true" : false}
            ref={el => {
              if (activeIndex === index) {
                activeOptionRef.current = el;
              }
            }}
            role="option"
            onClick={() => onOptionClick(index)}
            onMouseEnter={() => {
              setKeepLabelUp(true)
            }}
            onMouseLeave={() => {
              setKeepLabelUp(false)
            }}
            onMouseDown={onOptionMouseDown}
          >
            {option.name} <VisuallyHidden>({index + 1} of {filteredOptions.length})</VisuallyHidden>
          </li>
        ))}
      </ul>
      {props.children}
    </div>
  );
};

export default Combobox;
