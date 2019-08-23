import React from "react";
import { useStyletron } from "styletron-react";
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

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  (
    { name, onChange, onBlur, autoFocus, value, hasError, id, ...props },
    ref
  ) => {
    const [css] = useStyletron();
    return (
      <input
        ref={ref}
        className={css({
          height: "35px",
          paddingLeft: SIZES.half,
          fontSize: "14px",
          borderRadius: "3px",
          border: hasError
            ? "1px solid var(--error-color)"
            : "2px solid hsl(243, 9%, 89%)",
          outline: "none",
          ":focus": {
            border: hasError
              ? "2px solid var(--error-color)"
              : "2px solid hsl(243, 65%, 33%)"
          }
        })}
        type="text"
        id={id}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        autoFocus={autoFocus}
        name={name}
        {...props}
      />
    );
  }
);

export default TextInput;

TextInput.defaultProps = {
  hasError: false
};
