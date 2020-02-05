import React from "react"
import styles from "./Button.module.css"
import {cls} from "utils/helpers"

interface ButtonStyle {
  isFullWidth?: boolean;
}

interface ButtonProps extends ButtonStyle {
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({
  type,
  onClick,
  isFullWidth,
  children,
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={cls(styles.button, isFullWidth && styles.isFullWidth)}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

Button.defaultProps = {
  isFullWidth: false
};
