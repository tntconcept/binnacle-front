import React from "react";
import { styled } from "styletron-react";

interface ButtonProps {
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

const ButtonStyled = styled("button", {
  height: "40px",
  backgroundColor: "#10069f",
  color: "white",
  borderRadius: "3px",
  border: "none",
  fontSize: "14px",
  ":focus": {
    outline: "2px solid #10069f",
    outlineOffset: "2px"
  }
});

const Button: React.FC<ButtonProps> = props => {
  return (
    <ButtonStyled
      type={props.type}
      onClick={props.onClick}>
      {props.children}
    </ButtonStyled>
  );
};

export default Button;
