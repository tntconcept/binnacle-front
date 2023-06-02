import { Grid, useColorModeValue } from '@chakra-ui/react'
import React, { forwardRef, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SkipNavContent } from 'shared/components/Navbar/SkipNavLink'
import { getWeeksInMonth, isSaturday, isSunday } from 'shared/utils/chrono'
import SubmitButton from '../../../../../../../shared/components/FormFields/SubmitButton'
import { Activity } from '../../../domain/activity'
import { ActivityWithRenderDays } from '../../../domain/activity-with-render-days'
import { CalendarData } from '../../../domain/calendar-data'
import { ACTIVITY_FORM_ID } from '../../components/activity-form/activity-form'
import RemoveActivityButton from '../../components/activity-form/components/remove-activity-button'
import { ActivityModal } from '../../components/activity-modal/activity-modal'
import { useCalendarContext } from '../../contexts/calendar-context'
import { CalendarCellBlock } from './calendar-cell/calendar-cell-block'
import { CellBody } from './calendar-cell/cell-body/cell-body'
import { CellContent } from './calendar-cell/cell-content/cell-content'
import { CellHeader } from './calendar-cell/cell-header/cell-header'
import CalendarHeader from './calendar-header'
import { CalendarSkeleton } from './calendar-skeleton'
import { useCalendarKeysNavigation } from './useCalendarKeyboardNavigation'

interface ActivitiesCalendarProps {
  calendarData: CalendarData
  selectedDate: Date
  isLoadingCalendarData: boolean
}

const ActivitiesCalendarComponent: React.FC<ActivitiesCalendarProps> = ({
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

  const addActivity = (date: Date, activities: ActivityWithRenderDays[]) => {
    const searchActivity = activities
      .slice()
      .reverse()
      .find((element) => element.projectRole.timeUnit === 'MINUTES')
    const lastEndTime = searchActivity ? searchActivity.interval.end : undefined
    setSelectedActivity(undefined)
    setActivityDate(date)
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

  return (
    <>
      {isLoadingCalendarData && isFirstLoad.current ? (
        <CalendarSkeleton />
      ) : (
        <SkipNavContent id="calendar-content" style={{ flexGrow: '1' }}>
          <CalendarContainer ref={calendarRef}>
            <CalendarHeader />
            {calendarData.map((activityDaySummary, index: number) => {
              const { activities, holiday, vacation } = activityDaySummary

              if (isSunday(activityDaySummary.date)) {
                return null
              }

              const shouldRenderWeekendCells = isSaturday(activityDaySummary.date)

              return (
                <CalendarCellBlock
                  key={activityDaySummary.date.getTime() + index}
                  noBorderRight={shouldRenderWeekendCells}
                >
                  {shouldRenderWeekendCells ? (
                    // Weekend cells
                    <>
                      <CellContent
                        key={index}
                        selectedMonth={selectedDate}
                        borderBottom={true}
                        activityDaySummary={activityDaySummary}
                        onClick={(selectedDate) => addActivity(selectedDate, activities)}
                      >
                        <CellHeader
                          selectedMonth={selectedDate}
                          holiday={holiday}
                          vacation={vacation}
                          activities={activities}
                          date={activityDaySummary.date}
                          time={activityDaySummary.worked}
                          ref={registerCellRef(index)}
                        />
                        <CellBody
                          isSelected={selectedCell === index}
                          onEscKey={setSelectedCell}
                          activities={activities}
                          onActivityClicked={editActivity}
                        />
                      </CellContent>
                      <CellContent
                        key={index + 1}
                        selectedMonth={selectedDate}
                        activityDaySummary={calendarData[index + 1]}
                        onClick={(selectedDate) => addActivity(selectedDate, activities)}
                      >
                        <CellHeader
                          selectedMonth={selectedDate}
                          holiday={holiday}
                          vacation={vacation}
                          activities={activities}
                          date={calendarData[index + 1].date}
                          time={calendarData[index + 1].worked}
                          ref={registerCellRef(index + 1)}
                        />
                        <CellBody
                          isSelected={selectedCell === index + 1}
                          onEscKey={setSelectedCell}
                          activities={[]}
                          onActivityClicked={editActivity}
                        />
                      </CellContent>
                    </>
                  ) : (
                    <CellContent
                      key={index}
                      selectedMonth={selectedDate}
                      activityDaySummary={activityDaySummary}
                      onClick={(selectedDate) => addActivity(selectedDate, activities)}
                    >
                      <CellHeader
                        selectedMonth={selectedDate}
                        holiday={holiday}
                        vacation={vacation}
                        activities={activities}
                        date={activityDaySummary.date}
                        time={activityDaySummary.worked}
                        ref={registerCellRef(index)}
                      />
                      <CellBody
                        isSelected={selectedCell === index}
                        onEscKey={setSelectedCell}
                        activities={activities}
                        onActivityClicked={editActivity}
                      />
                    </CellContent>
                  )}
                </CalendarCellBlock>
              )
            })}
          </CalendarContainer>
        </SkipNavContent>
      )}

      {showActivityModal && (
        <ActivityModal
          isOpen={showActivityModal}
          onClose={onCloseActivity}
          onSave={onCloseActivity}
          setIsLoadingForm={(isLoading) => setIsLoadingForm(isLoading)}
          activityDate={activityDate}
          activity={selectedActivity}
          lastEndTime={lastEndTime}
          actions={
            <>
              {selectedActivity && (
                <RemoveActivityButton activity={selectedActivity} onDeleted={onCloseActivity} />
              )}
              <SubmitButton isLoading={isLoadingForm} formId={ACTIVITY_FORM_ID}>
                {t('actions.save')}
              </SubmitButton>
            </>
          }
        />
      )}
    </>
  )
}

export const ActivitiesCalendar = React.memo(ActivitiesCalendarComponent, (prevProps, props) => {
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
