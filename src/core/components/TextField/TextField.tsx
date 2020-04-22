import React from "react"
import styles from "core/components/TextField/TextField.module.css"
import {useFocus} from "core/hooks/useFocus"
import TextareaAutosize from "react-autosize-textarea"
import {useLabelWidth} from "core/components/TextField/useLabelWidth"
import {cls} from "utils/helpers"
import FieldMessage from "core/components/FieldMessage"

export interface IFloatingLabelInput
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  type?: string;
  isTextArea?: boolean;
  keepLabelUp?: boolean;
  innerRef?: undefined; // formik field innerRef prop
  error?: boolean;
  errorText?: string;
  hintText?: string;
  alignRightHelperText?: boolean;
}

const TextField = React.forwardRef<HTMLInputElement, IFloatingLabelInput>(
  (
    {
      className,
      children,
      isTextArea,
      label,
      keepLabelUp,
      innerRef,
      error,
      errorText,
      hintText,
      alignRightHelperText,
      ...props
    },
    ref
  ) => {
    const [labelRef, labelWidth] = useLabelWidth(label.length * 7.35 + 8);
    const [hasFocus, focusProps] = useFocus({
      onBlur: props.onBlur,
      onFocus: props.onFocus
    });
    const isFilled = props.value && props.value !== "";

    const id = "floating-label-" + props.name + "-input";
    const fieldMessageId = props.name + "-field-message";

    const labelUp =
      hasFocus || isFilled || props.type === "time" || keepLabelUp;
    const fieldsetPaddingLeft =
      // @ts-ignore
      labelUp ? "8px" : 8 + labelWidth / 2 + "px";
    const legendWidth = labelUp ? labelWidth + "px" : "0.01px";

    const refToPass = innerRef ? innerRef : ref;

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
                aria-invalid={error}
                aria-describedBy={fieldMessageId}
                {...props}
                // @ts-ignore
                onFocus={focusProps.onFocus}
                // @ts-ignore
                onBlur={focusProps.onBlur}
                data-testid={props.name}
              />
            ) : (
              <input
                id={id}
                className={styles.input}
                type={props.type}
                autoCapitalize="none"
                autoCorrect="off"
                aria-invalid={error}
                aria-describedby={fieldMessageId}
                {...props}
                onFocus={focusProps.onFocus}
                onBlur={focusProps.onBlur}
                data-testid={props.name}
                ref={refToPass}
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
        <FieldMessage
          id={fieldMessageId}
          error={error}
          errorText={errorText}
          hintText={hintText}
          alignRight={alignRightHelperText}
        />
      </div>
    );
  }
);

TextField.defaultProps = {
  isTextArea: false,
  type: "text"
};

export default TextField;
