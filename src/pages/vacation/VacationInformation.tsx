import React from 'react'
import { DataOrModifiedFn } from 'use-async-resource'
import { Grid, Text } from '@chakra-ui/core'
import { useTranslation } from 'react-i18next'
import { IUser } from 'api/interfaces/IUser'
import { IHolidays, PrivateHolidayState } from 'api/interfaces/IHolidays'
import isSameYear from 'date-fns/isSameYear'
import { differenceInCalendarMonths } from 'date-fns/esm'
import { lastDayOfYear, parseISO } from 'date-fns'

interface Props {
  holidaysReader: DataOrModifiedFn<IHolidays>
  userReader: DataOrModifiedFn<IUser>
}

export const VacationInformation: React.FC<Props> = (props) => {
  const selectedYear = new Date()
  const { t } = useTranslation()
  const user = props.userReader()
  const acceptedHolidays = props.holidaysReader((holidays) =>
    getAcceptedHolidays(holidays, selectedYear)
  )
  const holidaysSinceEntryDate = getHolidaysSinceEntryDate(user, selectedYear)

  return (
    <Grid templateColumns="1fr 30px">
      <Text>{t('vacation.according_agreement')}</Text>
      <Text justifySelf="center">{user.agreement.holidaysQuantity}</Text>
      <Text>{t('vacation.according_entry_date')}</Text>
      <Text justifySelf="center">{holidaysSinceEntryDate}</Text>
      <Text>{t('vacation.days_accepted')}</Text>
      <Text justifySelf="center">{acceptedHolidays}</Text>
      <Text>{t('vacation.days_pending')}</Text>
      <Text justifySelf="center">{holidaysSinceEntryDate - acceptedHolidays}</Text>
    </Grid>
  )
}

function getAcceptedHolidays(holidays: IHolidays, selectedYear: Date) {
  return holidays.privateHolidays
    .filter(
      (h) =>
        isSameYear(h.chargeYear, selectedYear) &&
        h.state === PrivateHolidayState.Accept
    )
    .reduce((prevValue, currentValue) => prevValue + currentValue.days.length, 0)
}

function getHolidaysSinceEntryDate(user: IUser, selectedYear: Date) {
  const holidaysByMonth = user.agreement.holidaysQuantity / 12
  // @ts-ignore
  const workingMonths = isSameYear(parseISO(user.hiringDate), selectedYear)
    ? // @ts-ignore
    differenceInCalendarMonths(
      parseISO(user.hiringDate),
      lastDayOfYear(selectedYear)
    )
    : 12
  return Math.round(holidaysByMonth * workingMonths)
}
