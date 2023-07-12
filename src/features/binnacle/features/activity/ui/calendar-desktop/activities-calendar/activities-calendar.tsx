import { Button, Grid, useColorModeValue } from '@chakra-ui/react'
import { FC, forwardRef, memo, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getWeeksInMonth } from 'shared/utils/chrono'
import { SubmitButton } from '../../../../../../../shared/components/form-fields/submit-button'
import { Activity } from '../../../domain/activity'
import { ActivityWithRenderDays } from '../../../domain/activity-with-render-days'
import { CalendarData } from '../../../domain/calendar-data'
import { ACTIVITY_FORM_ID } from '../../components/activity-form/activity-form'
import { RemoveActivityButton } from '../../components/activity-form/components/remove-activity-button'
import { ActivityModal } from '../../components/activity-modal/activity-modal'
import { useCalendarContext } from '../../contexts/calendar-context'
import { CalendarHeader } from './calendar-header'
import { CalendarSkeleton } from './calendar-skeleton'
import { useCalendarKeysNavigation } from './use-calendar-keyboard-navigation'
import { SkipNavContent } from '../../../../../../../shared/components/navbar/skip-nav-content'
import { createDayComponentFactory } from './days/day-factory'
import { TimeUnits } from '../../../../../../../shared/types/time-unit'

interface ActivitiesCalendarProps {
  calendarData: CalendarData
  selectedDate: Date
  isLoadingCalendarData: boolean
}

const ActivitiesCalendarComponent: FC<ActivitiesCalendarProps> = ({
  calendarData,
  isLoadingCalendarData,
  selectedDate
}) => {
  const { t } = useTranslation()
  const [activityDate, setActivityDate] = useState(new Date())
  const [lastEndTime, setLastEndTime] = useState<Date | undefined>()
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>()
  const [showActivityModal, setShowActivityModal] = useState(false)
  const [selectedCell, setSelectedCell] = useState<number | null>(null)
  const [isLoadingForm, setIsLoadingForm] = useState(false)
  const { calendarRef, registerCellRef } = useCalendarKeysNavigation(selectedDate, setSelectedCell)
  const isFirstLoad = useRef(true)

  useEffect(() => {
    if (isFirstLoad.current) isFirstLoad.current = false
  }, [selectedDate])

  const addActivity = (activities: ActivityWithRenderDays[]) => {
    const searchActivity = activities
      .slice()
      .reverse()
      .find((element) => element.projectRole.timeUnit === TimeUnits.MINUTES)
    const lastEndTime = searchActivity ? searchActivity.interval.end : undefined
    setSelectedActivity(undefined)
    setActivityDate(selectedDate)
    setShowActivityModal(true)
    setLastEndTime(lastEndTime)
  }

  const editActivity = (activity: Activity) => {
    setActivityDate(activity.interval.start)
    setSelectedActivity(activity)
    setShowActivityModal(true)
    setLastEndTime(undefined)
  }

  const onCloseActivity = () => {
    setShowActivityModal(false)
  }

  const canEditActivity = useMemo(() => {
    return selectedActivity?.approvalState !== 'ACCEPTED'
  }, [selectedActivity])

  return (
    <>
      {isLoadingCalendarData && isFirstLoad.current ? (
        <CalendarSkeleton />
      ) : (
        <SkipNavContent id="calendar-content" style={{ flexGrow: '1' }}>
          <CalendarContainer ref={calendarRef}>
            <CalendarHeader />
            {calendarData.map((activityDaySummary, index) =>
              createDayComponentFactory().createComponent(activityDaySummary.date, {
                key: index,
                isSelected: selectedCell === index,
                selectedDate,
                calendarData: activityDaySummary,
                ref: registerCellRef(index),
                onActivityClicked: editActivity,
                onClick: () => addActivity(activityDaySummary.activities),
                onEscKey: () => setSelectedCell(null)
              })
            )}
          </CalendarContainer>
        </SkipNavContent>
      )}

      {showActivityModal && (
        <ActivityModal
          isOpen={showActivityModal}
          onClose={onCloseActivity}
          onSave={onCloseActivity}
          onLoading={setIsLoadingForm}
          activityDate={activityDate}
          activity={selectedActivity}
          lastEndTime={lastEndTime}
          isReadOnly={!canEditActivity}
          actions={
            canEditActivity ? (
              <>
                {selectedActivity && (
                  <RemoveActivityButton activity={selectedActivity} onDeleted={onCloseActivity} />
                )}
                <SubmitButton isLoading={isLoadingForm} formId={ACTIVITY_FORM_ID}>
                  {t('actions.save')}
                </SubmitButton>
              </>
            ) : (
              <Button onClick={onCloseActivity}>{t('actions.close')}</Button>
            )
          }
        />
      )}
    </>
  )
}

export const ActivitiesCalendar = memo(ActivitiesCalendarComponent, (prevProps, props) => {
  return prevProps.calendarData === props.calendarData
})

const CalendarContainer = forwardRef<HTMLDivElement, any>((props, ref) => {
  const bg = useColorModeValue('white', 'gray.800')
  const { selectedDate } = useCalendarContext()
  const borderColor = useColorModeValue('gray.300', 'gray.700')
  const weeksInMonthSelected = getWeeksInMonth(selectedDate)
  const maxPercentagePerCalendarRow = 100 / weeksInMonthSelected

  return (
    <Grid
      bg={bg}
      ref={ref}
      h="100%"
      mx="32px"
      role="application"
      templateColumns="repeat(6, minmax(178px, 1fr))"
      templateRows="40px"
      autoRows={`minmax(100px, ${maxPercentagePerCalendarRow}%)`}
      boxShadow="0 3px 15px 0 rgba(0, 0, 0, 0.15)"
      border="solid 1px"
      borderColor={borderColor}
      overflowX="auto"
      overflowY="hidden"
    >
      {props.children}
    </Grid>
  )
})

CalendarContainer.displayName = 'CalendarContainer'
