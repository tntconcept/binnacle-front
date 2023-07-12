import { FC } from 'react'
import { LeisureProps } from './leisure-props'
import { Holiday } from '../../../../../../holiday/domain/holiday'
import { Vacation } from '../../../../../../vacation/domain/vacation'

import { Vacation as VacationComponent } from './vacation'
import { Holidays } from './holidays'

type Props = LeisureProps & { holiday?: Holiday; vacation?: Vacation }
export const LeisureFactory: FC<Props> = (props) => {
  return (
    <>
      {props.holiday ? (
        <Holidays
          date={props.date}
          time={props.time}
          holiday={props.holiday}
          activities={props.activities}
          selectedMonth={props.selectedMonth}
        ></Holidays>
      ) : (
        <VacationComponent
          date={props.date}
          time={props.time}
          activities={props.activities}
          selectedMonth={props.selectedMonth}
        ></VacationComponent>
      )}
    </>
  )
}
