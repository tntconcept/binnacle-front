import { ComponentType, ReactNode, Ref } from 'react'
import { Weekday } from './weekday'
import { isSaturday, isSunday } from '../../../../../../../../shared/utils/chrono'
import { DayProps } from './day'
import { Saturday } from './saturday'
import { Sunday } from './sunday'

type DayType = 'weekday' | 'sunday' | 'saturday'

export type Day = Omit<DayProps, 'weekendDay' | 'borderBottom'> & {
  ref: Ref<HTMLButtonElement>
  key: number
}

type DayComponentMap = {
  [key in DayType]: ComponentType<any>
}

interface ComponentFactory {
  createComponent(name: Date, props?: Day): ReactNode
}

export function createDayComponentFactory(): ComponentFactory {
  const componentMap: DayComponentMap = {
    weekday: Weekday,
    saturday: Saturday,
    sunday: Sunday
  }

  function createComponent(date: Date, props?: Day): ReactNode {
    let name: DayType

    if (isSunday(date)) {
      name = 'sunday'
    } else if (isSaturday(date)) {
      name = 'saturday'
    } else {
      name = 'weekday'
    }

    const Component = componentMap[name]

    if (!Component) {
      throw new Error(`Component '${name}' is not registered.`)
    }

    return <Component {...props} />
  }

  return { createComponent }
}
