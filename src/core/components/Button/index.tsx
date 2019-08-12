import React from "react";
import styles from "./button.module.css";

interface ButtonProps {
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = props => {
  return (
    <button
      type={props.type}
      className={styles.button}
      onClick={props.onClick}>
      {props.children}
    </button>
  );
};

export default Button;
