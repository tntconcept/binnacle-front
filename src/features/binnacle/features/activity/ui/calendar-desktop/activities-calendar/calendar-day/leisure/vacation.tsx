import { FC } from 'react'
import { Leisure } from './leisure'
import { LeisureProps } from './leisure-props'
import { useTranslation } from 'react-i18next'

type Props = LeisureProps

export const Vacation: FC<Props> = ({ date, selectedMonth, time, activities }) => {
  const { t } = useTranslation()

  return (
    <Leisure
      date={date}
      time={time}
      headerColor={'blue.400'}
      description={t('vacation')}
      selectedMonth={selectedMonth}
      activities={activities}
    />
  )
}
