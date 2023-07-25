import { ComponentType, ReactNode, Ref } from 'react'
import { CellHeaderProps } from './cell-header-props'
import { Holiday } from '../../../../../../holiday/domain/holiday'
import { Vacation } from '../../../../../../vacation/domain/vacation'
import { Vacation as VacationComponent } from './leisure/vacation'
import { Holidays } from './leisure/holidays'
import { ActivityWithRenderDays } from '../../../../../domain/activity-with-render-days'
import { DefaultDay } from './default-day/default-day'

type Props = CellHeaderProps & { holiday?: Holiday; vacation?: Vacation }

type LeisureType = 'vacation' | 'holiday' | 'default-day'

type LeisureComponentMap = {
  // TODO Remove any
  [key in LeisureType]: ComponentType<any>
}

interface ComponentFactory {
  createComponent(props: {
    date: Date
    ref: Ref<HTMLButtonElement>
    selectedMonth: Date
    activities: ActivityWithRenderDays[]
    time: number
    holiday: Holiday | undefined
    vacation: Vacation | undefined
  }): ReactNode
}

export function createCellHeaderComponentFactory(): ComponentFactory {
  const componentMap: LeisureComponentMap = {
    vacation: VacationComponent,
    holiday: Holidays,
    'default-day': DefaultDay
  }

  function createComponent(props: Props): ReactNode {
    let name: LeisureType

    if (props.holiday !== undefined) {
      name = 'holiday'
    } else if (props.vacation !== undefined) {
      name = 'vacation'
    } else {
      name = 'default-day'
    }

    const Component = componentMap[name]

    return <Component {...props} />
  }

  return { createComponent }
}
