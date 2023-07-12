import { FC } from 'react'
import { Leisure } from './leisure'
import { HeaderProps } from './header-props'
import { useTranslation } from 'react-i18next'

type Props = HeaderProps

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
