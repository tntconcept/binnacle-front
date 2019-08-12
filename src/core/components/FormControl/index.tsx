import React from "react";
import styles from "./FormControl.module.css";

interface FormControlProps {
  label: string;
  error?: string;
  direction?: "vertical" | "horizontal";
}

const FormControl: React.FC<FormControlProps> = props => {
  const classNameCalculated =
    props.direction === "vertical" ? styles.vertical : styles.horizontal;

  return (
    <div className={classNameCalculated}>
      <label
        className={styles.label}
        htmlFor={props.label}>
        {props.label}
      </label>
      {props.children}
      {props.error && <span className={styles.error}>{props.error}</span>}
    </div>
  );
};

export default FormControl;

FormControl.defaultProps = {
  direction: "vertical"
};
