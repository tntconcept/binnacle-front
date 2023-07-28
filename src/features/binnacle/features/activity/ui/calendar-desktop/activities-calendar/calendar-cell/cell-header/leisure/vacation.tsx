import { FC } from 'react'
import { Leisure } from './leisure'
import { CellHeaderProps } from '../cell-header-props'
import { useTranslation } from 'react-i18next'

type Props = CellHeaderProps

export const Vacation: FC<Props> = ({ date, selectedMonth, time, activities }) => {
  const { t } = useTranslation()

  return (
    <Leisure
      date={date}
      time={time}
      headerColor={'blue.400'}
      description={t('vacation.title')}
      selectedMonth={selectedMonth}
      activities={activities}
    />
  )
}
