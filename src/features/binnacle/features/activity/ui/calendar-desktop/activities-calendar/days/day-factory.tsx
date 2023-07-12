import { ComponentType, ReactNode, Ref } from 'react'
import { Weekday } from './weekday'
import { isSaturday, isSunday } from '../../../../../../../../shared/utils/chrono'
import { Weekend } from './weekend'
import { DayProps } from './day'

type DayType = 'weekday' | 'weekend'

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
    weekend: Weekend
  }

  function createComponent(date: Date, props?: Day): ReactNode {
    let name: DayType

    if (isSunday(date)) {
      // Since we render Sunday inside the Saturday cell vertically we don't need to render Sunday
      return null
    } else if (isSaturday(date)) {
      name = 'weekend'
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
