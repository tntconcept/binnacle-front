import { Flex } from '@chakra-ui/react'
import { observer } from 'mobx-react'
import { BinnacleState } from 'modules/binnacle/data-access/state/binnacle-state'
import { getHoliday } from 'modules/binnacle/data-access/utils/getHoliday'
import { getVacation } from 'modules/binnacle/data-access/utils/getVacation'
import { ActivitiesList } from 'modules/binnacle/page/BinnacleMobile/BinnacleScreen/ActivitiesList/ActivitiesList'
import { FloatingActionButton } from 'modules/binnacle/page/BinnacleMobile/BinnacleScreen/ActivitiesList/FloatingActionButton'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useGlobalState } from 'shared/arch/hooks/use-global-state'
import type { Holidays } from 'shared/types/Holidays'
import chrono, { getHumanizedDuration } from 'shared/utils/chrono'

const ActivitiesSection: FC<{ selectedDate: Date }> = ({ selectedDate }) => {
  const { t } = useTranslation()
  const { holidays, activities } = useGlobalState(BinnacleState)

  const day = activities.find((activityDay) =>
    chrono(activityDay.interval.start).isSame(selectedDate, 'day')
  )

  const isHolidayOrVacation = (holidays: Holidays, date: Date) => {
    const holiday = getHoliday(holidays.holidays, date)
    const vacation = getVacation(holidays.vacations, date)

    if (holiday) {
      return holiday.description
    }

    if (vacation) {
      return t('vacations')
    }

    return undefined
  }

  return (
    <>
      <Flex width="100%" p="10px 16px" justify="flex-end" data-testid="activities_time">
        {isHolidayOrVacation(holidays, selectedDate) && (
          <span
            style={{
              marginRight: 'auto'
            }}
          >
            {isHolidayOrVacation(holidays, selectedDate)}
          </span>
        )}
        {day && getHumanizedDuration({ duration: day.interval.duration })}
      </Flex>

      <ActivitiesList activities={day?.activities ?? []} />
      <FloatingActionButton />
    </>
  )
}

export default observer(ActivitiesSection)
