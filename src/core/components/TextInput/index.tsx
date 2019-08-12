import React from "react";
import styles from "./Input.module.css";

interface TextInputProps {
  name?: string;
  onChange?: (e: React.ChangeEvent<any>) => void;
  onBlur?: (e: React.FocusEvent<any>) => void;
  autoFocus?: boolean;
  value?: string | string[] | number;
  id?: string;
  className?: string;
}

const TextInput: React.FC<TextInputProps> = props => {
  return (
    <input
      type="text"
      id={props.id}
      value={props.value}
      onChange={props.onChange}
      onBlur={props.onBlur}
      autoFocus={props.autoFocus}
      name={props.name}
      className={
        styles.input + `${props.className ? " " + props.className : ""}`
      }
    />
  );
};

export default TextInput;
