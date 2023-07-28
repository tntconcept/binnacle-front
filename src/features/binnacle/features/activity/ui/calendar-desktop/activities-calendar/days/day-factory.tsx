import { cloneElement, ReactNode, Ref } from 'react'
import { Weekday } from './weekday'
import { isSaturday, isSunday } from '../../../../../../../../shared/utils/chrono'
import { DayProps } from './day'
import { Saturday } from './saturday'
import { Sunday } from './sunday'
import { Flex } from '@chakra-ui/react'

export type Day = Omit<DayProps, 'weekendDay' | 'borderBottom'> & {
  ref: Ref<HTMLButtonElement>
  key: number
}

interface ComponentFactory {
  createComponent(name: Date, props: Day): ReactNode
}

export function createDayComponentFactory(): ComponentFactory {
  let weekend: JSX.Element[] = []

  function createComponent(date: Date, props: Day): ReactNode {
    // We don't render Sunday since we paint Saturday and Sunday together in the same cell
    if (isSaturday(date)) {
      weekend.push(<Saturday {...props} key={props.key} />)
      return null
    }

    if (isSunday(date)) {
      weekend.push(<Sunday {...props} />)
      const render = (
        <Flex direction={'column'} key={props.key}>
          {weekend.map((Component, i) => cloneElement(Component, { key: `${props.key}-${i}` }))}
        </Flex>
      )
      weekend = []
      return render
    }

    return <Weekday {...props} key={props.key} />
  }

  return { createComponent }
}
