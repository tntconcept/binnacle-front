import React, {useEffect, useRef, useState} from 'react'
import style from './floatinglabelinput.module.css'
import classNames from 'classnames/bind'

const cx = classNames.bind(style)

interface IFloatingLabelInput {
  name: string,
  label: string,
  type: string,
  value: string,
  onChange: (e: React.ChangeEvent<any>) => void;
}

const useLabelWidth = (initialValue: number = 0) => {
  const [labelOffsetWidth, setLabelOffsetWidth] = useState(initialValue)
  const labelRef = useRef<HTMLLabelElement>(null);
  useEffect(() => {
    const width = labelRef.current ? labelRef.current.offsetWidth : 0;
    setLabelOffsetWidth(width)
  }, []);

  const labelWidth = labelOffsetWidth > 0 ? labelOffsetWidth * 0.75 + 8 : 0;
  return {
    labelRef: labelRef,
    labelWidth: labelWidth
  }
}


const FloatingLabelInput: React.FC<IFloatingLabelInput> = (props) => {

  const [hasFocus, setFocus] = useState(false)
  const { labelRef, labelWidth } = useLabelWidth(0)

  const isFilled = props.value && props.value !== ""

  const handleFocus = () => {
    setFocus(true)
  }

  const handleBlur = () => {
    setFocus(false)
  }

  const id = "floating-label-" + props.name + "-input"

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
        ref={labelRef}
      >
        {props.label}
      </label>
      <div className={style.wrapper} >
        <input
          className={style.input}
          type={props.type}
          id={id}
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
            {/* Use the nominal use case of the legend, avoid rendering artefacts. */}
            {/* eslint-disable-next-line react/no-danger */}
            <span dangerouslySetInnerHTML={{ __html: '&#8203;' }} />
          </legend>
        </fieldset>
      </div>
    </div>
  )
}

export default FloatingLabelInput