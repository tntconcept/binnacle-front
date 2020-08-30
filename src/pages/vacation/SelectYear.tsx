// @ts-ignore
import React, { unstable_useTransition as useTransition, useState } from 'react'
import {
  Flex,
  FormControl,
  FormLabel,
  Select,
  Spinner,
  Stack
} from '@chakra-ui/core'
import { eachYearOfInterval } from 'date-fns/esm'
import endpoints from 'api/endpoints'
import { IUser } from 'api/interfaces/IUser'
import { useAsyncResource } from 'use-async-resource/lib'
import HttpClient from 'services/HttpClient'
import { SUSPENSE_CONFIG } from 'utils/constants'
import { useTranslation } from 'react-i18next'

interface Props {
  onRefreshHolidays: (year: number) => void
  fetchUser?: () => Promise<IUser>
}

export const SelectYear: React.FC<Props> = (props) => {
  const { t } = useTranslation()
  const [startTransition, isPending] = useTransition(SUSPENSE_CONFIG)
  const [userReader] = useAsyncResource(fetchUser, [])
  const [year, setYear] = useState(new Date().getFullYear())

  const hiringDate = new Date(userReader().hiringDate)

  const years = eachYearOfInterval({
    start: hiringDate,
    end: Date.now()
  })

  return (
    <Flex>
      <FormControl id="year">
        <FormLabel>{t('vacation.select_year')}</FormLabel>
        <Stack direction="row" spacing={2} alignItems="center">
          <Select
            value={year}
            onChange={(event: any) => {
              setYear(event.target.value)
              startTransition(() => {
                props.onRefreshHolidays(event.target.value)
              })
            }}
            size="sm"
            variant="filled"
            w={100}
          >
            {years.map((year, index) => (
              <option key={index} value={year.getFullYear()}>
                {year.getFullYear()}
              </option>
            ))}
          </Select>
          {isPending && <Spinner size="sm" />}
        </Stack>
      </FormControl>
    </Flex>
  )
}

async function fetchUser() {
  return await HttpClient.get(endpoints.user).json<IUser>()
}

SelectYear.defaultProps = {
  fetchUser
}

// Cuando se actualiza el estado y también en el mismo componente se suspende la transición se ignora.
// Por tanto ese estado se debe de pasar al componente que empieza la transición.
