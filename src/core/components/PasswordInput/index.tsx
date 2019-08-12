import React, { useState } from "react";
import styles from "core/components/PasswordInput/password.module.css";

interface PasswordInputProps {
  name?: string;
  onChange?: (e: React.ChangeEvent<any>) => void;
  onBlur?: (e: React.FocusEvent<any>) => void;
  autoFocus?: boolean;
  value?: string | string[] | number;
  id?: string;
  className?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = props => {
  const [isPassword, changeToPasswordType] = useState(true);

  const togglePasswordVisibility = () =>
    changeToPasswordType(passwordVisibility => !passwordVisibility);

  return (
    <div
      className={
        styles.baseInput + `${props.className ? " " + props.className : ""}`
      }
    >
      <input
        className={styles.input}
        type={isPassword ? "password" : "text"}
        id={props.id}
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        onBlur={props.onBlur}
        autoFocus={props.autoFocus}
      />
      <button
        className={styles.button}
        onClick={togglePasswordVisibility}
        type="button"
      >
        {isPassword ? (
          <svg viewBox="0 0 20 20">
            <path d="M.2 10a11 11 0 0119.6 0A11 11 0 01.2 10zm9.8 4a4 4 0 100-8 4 4 0 000 8zm0-2a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        ) : (
          <svg viewBox="0 0 20 20">
            <path d="M12.81 4.36l-1.77 1.78a4 4 0 00-4.9 4.9l-2.76 2.75C2.06 12.79.96 11.49.2 10a11 11 0 0112.6-5.64zm3.8 1.85c1.33 1 2.43 2.3 3.2 3.79a11 11 0 01-12.62 5.64l1.77-1.78a4 4 0 004.9-4.9l2.76-2.75zm-.25-3.99l1.42 1.42L3.64 17.78l-1.42-1.42L16.36 2.22z"></path>
          </svg>
        )}
      </button>
    </div>
  );
};

export default PasswordInput;
