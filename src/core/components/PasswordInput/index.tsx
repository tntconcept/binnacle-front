import React, { useState } from "react";
import { styled, useStyletron } from "styletron-react";
import { SIZES } from "core/components/aspect-guide/spacing";

interface PasswordInputProps {
  name?: string;
  onChange?: (e: React.ChangeEvent<any>) => void;
  onBlur?: (e: React.FocusEvent<any>) => void;
  autoFocus?: boolean;
  value?: string | string[] | number;
  hasError?: boolean;
  id?: string;
}

const InputStyled = styled("input", {
  paddingLeft: SIZES.half,
  flex: 1,
  height: "33px",
  fontSize: "14px",
  outline: "none",
  border: "none",
  backgroundColor: "transparent",
  lineHeight: "35px"
});

const ButtonStyled = styled("button", {
  border: "none",
  height: "31px",
  width: "36px",
  lineHeight: "4",
  verticalAlign: "middle",
  backgroundColor: "transparent",
  ":focus": {
    outline: "none"
  }
});

const PasswordInput: React.FC<PasswordInputProps> = props => {
  const [isPassword, changeToPasswordType] = useState(true);
  const [css] = useStyletron();
  const togglePasswordVisibility = () =>
    changeToPasswordType(passwordVisibility => !passwordVisibility);

  return (
    <div
      className={css({
        display: "flex",
        border: props.hasError
          ? "1px solid var(--error-color)"
          : "2px solid hsl(243, 9%, 89%)",
        height: "35px",
        fontSize: "14px",
        borderRadius: "3px",
        fill: "hsl(243, 9%, 75%)",
        ":focus-within": {
          border: props.hasError
            ? "2px solid var(--error-color)"
            : "2px solid hsl(243, 65%, 33%)"
        }
      })}
    >
      <InputStyled
        type={isPassword ? "password" : "text"}
        id={props.id}
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        onBlur={props.onBlur}
        autoFocus={props.autoFocus}
      />
      <ButtonStyled
        onClick={togglePasswordVisibility}
        type="button"
        tabIndex={-1}
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
      </ButtonStyled>
    </div>
  );
};

export default PasswordInput;

PasswordInput.defaultProps = {
  hasError: false
};
