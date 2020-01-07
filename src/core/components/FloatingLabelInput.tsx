import React, {useCallback, useState} from 'react'
import style from './floatinglabelinput.module.css'
import classNames from 'classnames/bind'

const cx = classNames.bind(style)

interface IFloatingLabelInput extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string,
  label: string,
  type: string,
  value: string,
  onChange: (e: React.ChangeEvent<any>) => void;
  onBlur?: (e: React.ChangeEvent<any>) => void;
}

const useLabelWidth = (initialValue: number = 0) => {
  const [labelOffsetWidth, setLabelOffsetWidth] = useState(initialValue)
  const measuredRef = useCallback(node => {
    if (node !== null) {
      setLabelOffsetWidth(node.offsetWidth);
    }
  }, []);

  const labelWidth = labelOffsetWidth > 0 ? labelOffsetWidth * 0.75 + 8 : 0;
  return [measuredRef, labelWidth]
}


const FloatingLabelInput: React.FC<IFloatingLabelInput> = (props) => {

  const [hasFocus, setFocus] = useState(false)
  const [ labelRef, labelWidth ] = useLabelWidth(props.label.length * 7.35 + 8)

  const isFilled = props.value && props.value !== ""

  const handleFocus = () => {
    setFocus(true)
  }

  const handleBlur = (event: React.ChangeEvent) => {
    setFocus(false)
    props.onBlur && props.onBlur(event)
  }

  const id = "floating-label-" + props.name + "-input"

  // @ts-ignore
  const fieldsetPaddingLeft = hasFocus || isFilled ? "8px" : 8 + labelWidth / 2 + "px"
  const legendWidth = hasFocus || isFilled ? labelWidth + "px" : "0.01px"

  return (
    <div className={style.base}>
      <label
        className={cx({
          label: true,
          labelFocused: hasFocus || isFilled,
          labelFocusedColor: hasFocus
        })}
        id={id + "-label"}
        htmlFor={id}
        // @ts-ignore
        ref={labelRef}
      >
        {props.label}
      </label>
      <div className={style.wrapper} >
        <input
          {...props}
          className={style.input}
          name={props.name}
          id={id}
          type={props.type}
          value={props.value}
          onChange={props.onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
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
  )
}

export default FloatingLabelInput