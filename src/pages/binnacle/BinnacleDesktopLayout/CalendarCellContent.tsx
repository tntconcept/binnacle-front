import React, { useContext } from 'react'
import CalendarCellHeader from 'pages/binnacle/BinnacleDesktopLayout/CalendarCellHeader'
import CalendarCellBody from 'pages/binnacle/BinnacleDesktopLayout/CalendarCellBody'
import { IActivity, IActivityDay } from 'api/interfaces/IActivity'
import CalendarCellActivityButton from 'pages/binnacle/BinnacleDesktopLayout/CalendarCellActivityButton'
import { CalendarModalContext } from 'pages/binnacle/BinnacleDesktopLayout/CalendarModalContext'
import { useBinnacleResources } from 'core/features/BinnacleResourcesProvider'
import { Box, useColorModeValue } from '@chakra-ui/core'
import chrono from 'services/Chrono'

interface ICellContent {
  borderBottom?: boolean
  activityDay: IActivityDay
  isSelected: boolean
  setSelectedCell: (a?: any) => any
  registerRef: (instance: HTMLButtonElement | null) => void
}

interface IActivitiesList {
  activities: IActivity[]
  canFocus: boolean
}

const ActivitiesList: React.FC<IActivitiesList> = ({ activities, canFocus }) => {
  return (
    <React.Fragment>
      {activities.map((activity) => (
        <CalendarCellActivityButton key={activity.id} activity={activity} canFocus={canFocus} />
      ))}
    </React.Fragment>
  )
}

export const CalendarCellContent: React.FC<ICellContent> = (props) => {
  const { selectedMonth } = useBinnacleResources()
  const updateModalData = useContext(CalendarModalContext)

  const isOtherMonth = !chrono(props.activityDay.date).isSame(selectedMonth, 'month')

  const createActivity = () => {
    updateModalData({
      date: props.activityDay.date,
      lastEndTime: getLastActivityEndTime(props.activityDay),
      activity: undefined
    })
  }
  const bgOtherMonth = useColorModeValue('#f0f0f4', '#1d232f')
  const borderColor = useColorModeValue('gray.300', 'gray.700')
  const borderHoverColor = useColorModeValue('brand.700', 'white')

  return (
    <Box
      position="relative"
      py="4px"
      px="8px"
      height="100%"
      cursor="pointer"
      border="1px solid transparent"
      bg={isOtherMonth ? bgOtherMonth : undefined}
      borderBottom={props.borderBottom ? '1px solid' : undefined}
      borderBottomColor={props.borderBottom ? borderColor : undefined}
      _hover={{
        border: '1px solid',
        borderColor: borderHoverColor
      }}
      onClick={createActivity}
    >
      <CalendarCellHeader
        date={props.activityDay.date}
        time={props.activityDay.workedMinutes}
        ref={props.registerRef}
      />
      <CalendarCellBody isSelected={props.isSelected} onEscKey={props.setSelectedCell}>
        <ActivitiesList activities={props.activityDay.activities} canFocus={props.isSelected} />
      </CalendarCellBody>
    </Box>
  )
}

const getLastActivityEndTime = (activityDay: IActivityDay) => {
  if (activityDay.activities.length > 0) {
    const lastImputedActivity = activityDay.activities[activityDay.activities.length - 1]

    return chrono(lastImputedActivity.startDate)
      .plus(lastImputedActivity.duration, 'minute')
      .getDate()
  }

  return undefined
}
