import React from "react";
import { styled } from "styletron-react";

interface ButtonStyle {
  isFullWidth?: boolean;
}

interface ButtonProps extends ButtonStyle {
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

const ButtonStyled = styled("button", (props: ButtonStyle) => ({
  height: "40px",
  backgroundColor: "#10069f",
  color: "white",
  borderRadius: "3px",
  border: "none",
  fontSize: "14px",
  ":focus": {
    outline: "2px solid #10069f",
    outlineOffset: "2px"
  },
  width: props.isFullWidth ? "100%" : "inherit"
}));

const Button: React.FC<ButtonProps> = props => {
  return (
    <ButtonStyled
      type={props.type}
      onClick={props.onClick}
      isFullWidth={props.isFullWidth}
      {...props}
    >
      {props.children}
    </ButtonStyled>
  );
};

export default Button;

Button.defaultProps = {
  isFullWidth: false
};
