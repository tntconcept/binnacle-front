import { Button, Text } from '@chakra-ui/react'
import { GetCalendarDataAction } from 'modules/binnacle/data-access/actions/get-calendar-data-action'
import { FC, MouseEventHandler, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useActionLoadable } from 'shared/arch/hooks/use-action-loadable'
import chrono from 'shared/utils/chrono'

interface Props {
  selectedDate: Date
}

export const TodayButton: FC<Props> = ({ selectedDate }) => {
  const { t } = useTranslation()
  const [loadBinnacleData, isLoading] = useActionLoadable(GetCalendarDataAction)

  const [isCurrentMonth, setIsCurrentMonth] = useState(false)

  useEffect(() => {
    setIsCurrentMonth(chrono(selectedDate).isThisMonth())
  }, [selectedDate])

  const handleSetCurrentMonth: MouseEventHandler<HTMLButtonElement> = (e: any) => {
    e.preventDefault()

    if (isCurrentMonth) return

    loadBinnacleData(new Date())
  }

  return (
    <Button variant={'outline'} onClick={handleSetCurrentMonth} isLoading={isLoading}>
      <Text as="span" fontSize="2xl" fontWeight="900">
        {t('time.today')}
      </Text>
    </Button>
  )
}
