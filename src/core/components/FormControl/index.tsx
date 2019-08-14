import React from "react";
import { useStyletron } from "styletron-react";
import { SIZES } from "core/components/aspect-guide/spacing";

interface FormControlProps {
  label: string;
  error?: string;
  direction?: "vertical" | "horizontal";
}

const FormControl: React.FC<FormControlProps> = props => {
  const [css] = useStyletron();
  const errorStyle = css({
    marginTop: SIZES.base
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
          textTransform: "capitalize"
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
