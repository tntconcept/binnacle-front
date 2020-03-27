import React from "react"
import styles from "core/components/TextField/TextField.module.css"
import {useFocus} from "core/hooks/useFocus"
import TextareaAutosize from "react-autosize-textarea"
import {useLabelWidth} from "core/components/TextField/useLabelWidth"
import {cls} from "utils/helpers"

interface IFloatingLabelInput
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  type?: string;
  isTextArea?: boolean;
  keepLabelUp?: boolean;
}

const TextField = React.forwardRef<HTMLInputElement, IFloatingLabelInput>(
  ({ className, children, isTextArea, label, keepLabelUp, ...props }, ref) => {
    const [labelRef, labelWidth] = useLabelWidth(label.length * 7.35 + 8);
    const [hasFocus, focusProps] = useFocus({ onBlur: props.onBlur });
    const isFilled = props.value && props.value !== "";

    const id = "floating-label-" + props.name + "-input";

    const labelUp =
      hasFocus || isFilled || props.type === "time" || keepLabelUp;
    const fieldsetPaddingLeft =
      // @ts-ignore
      labelUp ? "8px" : 8 + labelWidth / 2 + "px";
    const legendWidth = labelUp ? labelWidth + "px" : "0.01px";

    return (
      <div className={className}>
        <div className={cls(styles.base, props.disabled && styles.disabled)}>
          <label
            className={cls(
              styles.label,
              labelUp && styles.labelFocused,
              hasFocus && styles.labelFocusedColor
            )}
            id={id + "-label"}
            htmlFor={id}
            // @ts-ignore
            ref={labelRef}
          >
            {label}
          </label>
          <div className={styles.wrapper}>
            {isTextArea ? (
              <TextareaAutosize
                className={styles.input}
                id={id}
                rows={5}
                style={{
                  minHeight: 150,
                  resize: "none"
                }}
                {...props}
                // @ts-ignore
                onFocus={focusProps.onFocus}
                // @ts-ignore
                onBlur={focusProps.onBlur}
              />
            ) : (
              <input
                id={id}
                className={styles.input}
                type={props.type}
                autoCapitalize="false"
                {...props}
                onFocus={focusProps.onFocus}
                onBlur={focusProps.onBlur}
                data-testid={props.name}
              />
            )}
            <fieldset
              aria-hidden={true}
              className={cls(
                styles.fieldset,
                hasFocus && styles.fieldsetFocused
              )}
              style={{
                paddingLeft: fieldsetPaddingLeft
              }}
            >
              <legend
                className={styles.legend}
                style={{
                  width: legendWidth
                }}
              >
                <span>&#8203;</span>
              </legend>
            </fieldset>
          </div>
        </div>
        {children}
      </div>
    );
  }
);

TextField.defaultProps = {
  isTextArea: false,
  type: "text"
};

export default TextField;
