// @ts-ignore
import React, { unstable_useTransition as useTransition, useState } from 'react'
import { Flex, FormControl, FormLabel, Select, Spinner, Stack } from '@chakra-ui/core'
import { IUser } from 'core/api/interfaces'
import { SUSPENSE_CONFIG } from 'core/utils/constants'
import { useTranslation } from 'react-i18next'
import { DataOrModifiedFn } from 'use-async-resource'
import chrono, { eachYearOfInterval } from 'core/services/Chrono'

interface Props {
  onRefreshHolidays: (year: number) => void
  onChangeYear: (year: number) => void
  userReader: DataOrModifiedFn<IUser>
}

export const SelectYear: React.FC<Props> = (props) => {
  const { t } = useTranslation()
  const [startTransition, isPending] = useTransition(SUSPENSE_CONFIG)
  const [year, setYear] = useState(chrono().get('year'))

  const hiringDate = chrono(props.userReader().hiringDate).getDate()

  const years = eachYearOfInterval({
    start: hiringDate,
    end: chrono()
      .plus(1, 'year')
      .getDate()
  })

  return (
    <Flex flexBasis={['150px', 'unset']}>
      <FormControl id="year">
        <FormLabel>{t('vacation.select_year')}</FormLabel>
        <Stack direction="row" spacing={2} alignItems="center">
          <Select
            value={year}
            onChange={(event: any) => {
              setYear(event.target.value)
              startTransition(() => {
                props.onRefreshHolidays(event.target.value)
                props.onChangeYear(event.target.value)
              })
            }}
            size="sm"
            variant="filled"
            w={100}
          >
            {years.map((year, index) => (
              <option key={index} value={chrono(year).get('year')}>
                {chrono(year).get('year')}
              </option>
            ))}
          </Select>
          {isPending && <Spinner size="sm" />}
        </Stack>
      </FormControl>
    </Flex>
  )
}
