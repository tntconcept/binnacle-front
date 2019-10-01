import React from "react";
import { useStyletron } from "styletron-react";
import { SIZES } from "core/components/style-guide/spacing";

interface FormControlProps {
  label: string;
  error?: string;
  direction?: "vertical" | "horizontal";
}

const FormControl: React.FC<FormControlProps> = props => {
  const [css] = useStyletron();
  const errorStyle = css({
    marginTop: "12px",
    color: props.error ? "var(--error-color)" : "inherit"
  });
  return (
    <div
      className={css({
        marginBottom: SIZES.large,
        display: "flex",
        flexDirection: props.direction === "vertical" ? "column" : "row"
      })}
    >
      <label
        className={css({
          marginBottom: SIZES.half,
          textTransform: "capitalize",
          color: props.error ? "var(--error-color)" : "inherit"
        })}
        htmlFor={props.label}
      >
        {props.label}
      </label>
      {props.children}
      {props.error && <span className={errorStyle}>{props.error}</span>}
    </div>
  );
};

export default FormControl;

FormControl.defaultProps = {
  direction: "vertical"
};
