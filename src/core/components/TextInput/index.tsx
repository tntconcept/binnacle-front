import React from "react";
import styles from "./Input.module.css";

interface TextInputProps {
  name?: string;
  onChange?: () => void;
  autoFocus?: boolean;
  value?: string | string[] | number;
  id?: string;
  className?: string;
}

const TextInput = React.forwardRef(
  (props: TextInputProps, ref?: React.Ref<HTMLInputElement>) => {
    return (
      <input
        type="text"
        id={props.id}
        value={props.value}
        onChange={props.onChange}
        autoFocus={props.autoFocus}
        name={props.name}
        ref={ref}
        className={
          styles.input + `${props.className ? " " + props.className : ""}`
        }
      />
    );
  }
);

export default TextInput;
