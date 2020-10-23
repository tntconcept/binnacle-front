import React from 'react'
import './MyLabel.css'

interface Props extends React.HTMLProps<HTMLLabelElement> {}

export const MyLabel: React.FC<Props> = ({ className, ...props }) => {
  return (
    <label className={`my-label ${className}`} {...props}>
      {props.children}
    </label>
  )
}
