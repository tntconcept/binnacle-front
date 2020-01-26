import React from "react"
import style from "core/components/FloatingLabelField/floatinglabelinput.module.css"
import classNames from "classnames/bind"
import {useFocus} from "core/hooks/useFocus"
import TextareaAutosize from "react-autosize-textarea"
import {useLabelWidth} from "core/components/FloatingLabelField/useLabelWidth"

const cx = classNames.bind(style)

interface IFloatingLabelInput extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<any>) => void;
  onBlur?: (e: React.ChangeEvent<any>) => void;
  isTextArea?: boolean
}

const FloatingLabelInput: React.FC<IFloatingLabelInput> = ({className, children, isTextArea, ...props}) => {
  const [labelRef, labelWidth] = useLabelWidth(props.label.length * 7.35 + 8)
  const [hasFocus, focusProps] = useFocus({
    onBlur: props.onBlur
  })
  const isFilled = props.value && props.value !== ""

  const id = "floating-label-" + props.name + "-input"

  const labelUp = hasFocus || isFilled || props.type === "time"
  const fieldsetPaddingLeft =
    // @ts-ignore
    labelUp ? "8px" : 8 + labelWidth / 2 + "px"
  const legendWidth = labelUp ? labelWidth + "px" : "0.01px"

  return (
    <div className={className}>
      <div className={style.base}>
        <label
          className={cx({
            label: true,
            labelFocused: hasFocus || isFilled || props.type === "time",
            labelFocusedColor: hasFocus
          })}
          id={id + "-label"}
          htmlFor={id}
          // @ts-ignore
          ref={labelRef}
        >
          {props.label}
        </label>
        <div className={style.wrapper}>
          {isTextArea ? (
            <TextareaAutosize
              className={style.input}
              name={props.name}
              id={id}
              value={props.value}
              onChange={props.onChange}
              onFocus={focusProps.onFocus}
              onBlur={focusProps.onBlur}
              rows={5}
              style={{
                minHeight: 150,
                resize: "none"
              }}
            />
          ) : (
            <input
              {...props}
              className={style.input}
              name={props.name}
              id={id}
              type={props.type}
              value={props.value}
              onChange={props.onChange}
              onFocus={focusProps.onFocus}
              onBlur={focusProps.onBlur}
            />
          )}
          <fieldset
            aria-hidden={true}
            className={cx({
              fieldset: true,
              fieldsetFocused: hasFocus
            })}
            style={{
              paddingLeft: fieldsetPaddingLeft
            }}
          >
            <legend
              className={style.legend}
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
  )
}

FloatingLabelInput.defaultProps = {
  isTextArea: false,
  type: "text"
}

export default FloatingLabelInput
