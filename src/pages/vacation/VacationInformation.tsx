import React from 'react'
import { DataOrModifiedFn } from 'use-async-resource'
import { Grid, Text } from '@chakra-ui/core'
import { useTranslation } from 'react-i18next'
import { IUser } from 'api/interfaces/IUser'
import { IHolidays, PrivateHolidayState } from 'api/interfaces/IHolidays'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

interface Props {
  holidaysReader: DataOrModifiedFn<IHolidays>
  userReader: DataOrModifiedFn<IUser>
  selectedYear: Date
}

export const VacationInformation: React.FC<Props> = (props) => {
  const { t } = useTranslation()
  const user = props.userReader()
  const acceptedHolidays = props.holidaysReader((holidays) =>
    getAcceptedHolidays(holidays, props.selectedYear)
  )

  const holidaysSinceEntryDate = getHolidaysSinceEntryDate(user, props.selectedYear)

  return (
    <Grid templateColumns="1fr 30px">
      <Text>{t('vacation.according_agreement')}</Text>
      <Text justifySelf="center" data-testid="agreement_holidays">
        {user.agreement.holidaysQuantity}
      </Text>
      <Text>{t('vacation.according_entry_date')}</Text>
      <Text justifySelf="center" data-testid="since_hiring_date">
        {holidaysSinceEntryDate}
      </Text>
      <Text>{t('vacation.days_accepted')}</Text>
      <Text justifySelf="center" data-testid="accepted_holidays">
        {acceptedHolidays}
      </Text>
      <Text>{t('vacation.days_pending')}</Text>
      <Text justifySelf="center" data-testid="pending_holidays">
        {holidaysSinceEntryDate - acceptedHolidays}
      </Text>
    </Grid>
  )
}

function getAcceptedHolidays(holidays: IHolidays, selectedYear: Date) {
  return holidays.privateHolidays
    .filter(
      (h) =>
        dayjs(selectedYear)
          .utc()
          .isSame(h.chargeYear, 'year') && h.state === PrivateHolidayState.Accept
    )
    .reduce((prevValue, currentValue) => prevValue + currentValue.days.length, 0)
}

function getHolidaysSinceEntryDate(user: IUser, selectedYear: Date) {
  const holidaysByMonth = user.agreement.holidaysQuantity / 12

  const isSameYear = dayjs(selectedYear)
    .utc()
    .isSame(user.hiringDate, 'year')

  const workingMonths = isSameYear
    ? dayjs(selectedYear)
      .utc()
      .endOf('year')
      .diff(user.hiringDate, 'month')
    : 12
  return Math.round(holidaysByMonth * workingMonths)
}
