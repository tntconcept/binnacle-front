import React, { Suspense, useState } from 'react'
import { Box, Grid, Select, Text } from '@chakra-ui/core'
import { VacationTable } from 'pages/vacation/VacationTable'
import { RequestVacationForm } from 'pages/vacation/RequestVacationForm'
import { useAsyncResource } from 'use-async-resource'
import { fetchHolidaysBetweenDate } from 'api/HolidaysAPI'

export function VacationPage() {
  const [year, setYear] = useState(new Date().getFullYear())

  const [holidaysReader, fetchHolidays] = useAsyncResource(
    fetchHolidaysBetweenDate,
    new Date(year, 0, 1),
    new Date(year, 11, 31)
  )

  return (
    <Box p="16px">
      <Select
        placeholder="Select option"
        value={year}
        onChange={(event: any) => setYear(event.target.value)}
      >
        <option value="2019">2019</option>
        <option value="2020">2020</option>
        <option value="2021">2021</option>
      </Select>
      <RequestVacationForm />
      <Grid
        templateColumns="1fr 30px"
        mt={4}>
        <Text>Annual holidays (according the agreement)</Text>
        <Text justifySelf="center">22</Text>
        <Text>Holidays this year (according entry date)</Text>
        <Text justifySelf="center">11</Text>
        <Text>Accepted holidays</Text>
        <Text justifySelf="center">11</Text>
        <Text>Pending holidays</Text>
        <Text justifySelf="center">11</Text>
      </Grid>
      <Suspense fallback={<p>Loading...</p>}>
        <VacationTable holidays={holidaysReader} />
      </Suspense>
    </Box>
  )
}
