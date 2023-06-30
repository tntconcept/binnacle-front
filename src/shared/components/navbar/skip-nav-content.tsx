import { FC, HTMLAttributes } from 'react'

interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'id'> {
  id: string
}

export const SkipNavContent: FC<Props> = ({ id, ...props }) => {
  return <section {...props} id={id} />
}
