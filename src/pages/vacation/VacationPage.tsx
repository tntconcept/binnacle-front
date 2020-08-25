// @ts-ignore
// prettier-ignore
import React, { useState } from 'react'
import {
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Select,
  Stack,
  Text,
  useDisclosure
} from '@chakra-ui/core'
import {
  RequestVacationForm,
  RequestVacationFormValues
} from 'pages/vacation/RequestVacationForm'
import { useAsyncResource } from 'use-async-resource'
import { fetchHolidaysBetweenDate } from 'api/HolidaysAPI'
import { resourceCache } from 'use-async-resource/lib'
import { format } from 'date-fns'
import { last } from 'utils/helpers'
import httpClient from 'services/HttpClient'
import endpoints from 'api/endpoints'
import { VacationTable } from './VacationTable/VacationTable'

const startDate = new Date(2020, 0, 1)
const endDate = new Date(2020, 11, 31)

export function VacationPage() {
  const [year, setYear] = useState(new Date().getFullYear())
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [initialValues, setInitialValues] = useState<RequestVacationFormValues>({
    id: undefined,
    period: '',
    description: '',
    chargeYear: 'option3'
  })

  const [holidaysReader, fetchHolidays] = useAsyncResource(
    fetchHolidaysBetweenDate,
    startDate,
    endDate
  )

  const refreshHolidays = (value: number) => {
    resourceCache(fetchHolidaysBetweenDate).clear()
    fetchHolidays(new Date(value, 0, 1), new Date(value, 11, 31))
  }

  return (
    <Stack
      p="16px"
      spacing={4}>
      <RequestVacationForm
        initialValues={initialValues}
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        onSubmit={() => refreshHolidays(year)}
      />
      <SelectYear
        year={year}
        onChangeYear={(value) => {
          setYear(value)
          refreshHolidays(value)
        }}
      />
      <Grid templateColumns="1fr 30px">
        <Text>Annual holidays (according the agreement)</Text>
        <Text justifySelf="center">22</Text>
        <Text>Holidays this year (according entry date)</Text>
        <Text justifySelf="center">11</Text>
        <Text>Accepted holidays</Text>
        <Text justifySelf="center">11</Text>
        <Text>Pending holidays</Text>
        <Text justifySelf="center">11</Text>
      </Grid>
      <VacationTable
        holidays={holidaysReader}
        onRemove={async (id) => {
          await httpClient.delete(`${endpoints.holidays}/${id}`).text()
          refreshHolidays(year)
        }}
        onEdit={(vacation) => {
          const formatString = 'dd/MM/yyyy'
          const period =
            format(vacation.days[0], formatString) +
            ' - ' +
            format(last(vacation.days)!, formatString)

          setInitialValues({
            // @ts-ignore
            id: vacation.id,
            period: period,
            description: vacation.userComment || '',
            chargeYear: 'option1'
          })
          onOpen()
        }}
      />
    </Stack>
  )
}

interface Props {
  year: number
  onChangeYear: (year: number) => void
}

export function SelectYear(props: Props) {
  return (
    <Flex>
      <FormControl id="year">
        <FormLabel>Year</FormLabel>
        <Select
          placeholder="Select option"
          value={props.year}
          onChange={(event: any) => {
            props.onChangeYear(event.target.value)
          }}
          size="sm"
          variant="filled"
          w={100}
        >
          <option value="2019">2019</option>
          <option value="2020">2020</option>
          <option value="2021">2021</option>
        </Select>
      </FormControl>
    </Flex>
  )
}
