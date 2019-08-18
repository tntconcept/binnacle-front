import React from "react";
import { styled, useStyletron } from "styletron-react";
import { SIZES } from "core/components/aspect-guide/spacing";

interface TextInputProps {
  name?: string;
  onChange?: (e: React.ChangeEvent<any>) => void;
  onBlur?: (e: React.FocusEvent<any>) => void;
  autoFocus?: boolean;
  value?: string | string[] | number;
  hasError?: boolean;
  id?: string;
}

const Input = styled("input", {
  height: "35px",
  paddingLeft: SIZES.half,
  fontSize: "14px",
  borderRadius: "3px",
  border: "2px solid hsl(243, 9%, 89%)",
  outline: "none",
  ":focus": {
    border: "2px solid hsl(243, 65%, 33%)"
  }
});

const TextInput: React.FC<TextInputProps> = props => {
  const [css] = useStyletron();
  return (
    <input
      className={css({
        height: "35px",
        paddingLeft: SIZES.half,
        fontSize: "14px",
        borderRadius: "3px",
        border: props.hasError
          ? "1px solid var(--error-color)"
          : "2px solid hsl(243, 9%, 89%)",
        outline: "none",
        ":focus": {
          border: props.hasError
            ? "2px solid var(--error-color)"
            : "2px solid hsl(243, 65%, 33%)"
        }
      })}
      type="text"
      id={props.id}
      value={props.value}
      onChange={props.onChange}
      onBlur={props.onBlur}
      autoFocus={props.autoFocus}
      name={props.name}
    />
  );
};

export default TextInput;

TextInput.defaultProps = {
  hasError: false
};
