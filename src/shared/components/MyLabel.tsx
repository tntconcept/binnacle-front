import type { FC } from 'react'

interface Props extends React.HTMLProps<HTMLLabelElement> {}

export const MyLabel: FC<Props> = ({ className, ...props }) => {
  return (
    <label className={`my-label ${className}`} {...props}>
      {props.children}
    </label>
  )
}
