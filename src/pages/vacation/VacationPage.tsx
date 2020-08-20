import React, { Suspense, useState } from 'react'
import {
  Flex,
  Grid,
  Select,
  Skeleton,
  Stack,
  Text,
  useDisclosure
} from '@chakra-ui/core'
import { VacationTable } from 'pages/vacation/VacationTable'
import { RequestVacationForm } from 'pages/vacation/RequestVacationForm'
import { useAsyncResource } from 'use-async-resource'
import { fetchHolidaysBetweenDate } from 'api/HolidaysAPI'

export function VacationPage() {
  const [year, setYear] = useState(new Date().getFullYear())
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [initialValues, setInitialValues] = useState({
    period: '',
    description: '',
    chargeYear: 'option3'
  })

  const [holidaysReader, fetchHolidays] = useAsyncResource(
    fetchHolidaysBetweenDate,
    new Date(year, 0, 1),
    new Date(year, 11, 31)
  )

  return (
    <Stack p="16px" spacing={4}>
      <RequestVacationForm
        initialValues={initialValues}
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
      />
      <Flex>
        <Text>Año</Text>
        <Select
          placeholder="Select option"
          value={year}
          onChange={(event: any) => setYear(event.target.value)}
        >
          <option value="2019">2019</option>
          <option value="2020">2020</option>
          <option value="2021">2021</option>
        </Select>
      </Flex>
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
      <Suspense
        fallback={
          <Stack>
            <Skeleton height="35px" />
            <Skeleton height="30px" />
            <Skeleton height="30px" />
          </Stack>
        }
      >
        <VacationTable
          holidays={holidaysReader}
          onRemove={() => {}}
          onEdit={(vacation) => {
            setInitialValues({
              period: '2019 - 2019',
              description: vacation.userComment || '',
              chargeYear: 'option1'
            })
            onOpen()
          }}
        />
      </Suspense>
    </Stack>
  )
}
