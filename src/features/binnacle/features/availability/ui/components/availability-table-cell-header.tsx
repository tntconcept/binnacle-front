import { FC } from 'react'

interface Props {
  day: Date
}

export const AvailabilityTableCellHeader: FC<Props> = (props) => {
  return <h1>{props.day.getDate()}</h1>
}
