import React from 'react'
import { Box, FormControl, FormLabel, Input } from '@chakra-ui/core'
import { DatePicker } from 'pages/vacations/DatePicker/DatePicker'

export function Vacations() {
  return (
    <Box p={10}>
      <DatePicker currentDate={new Date()} />
      <FormControl id="start-date">
        <FormLabel>Start-Date</FormLabel>
        <Input placeholder="Start-date" />
      </FormControl>

      <FormControl id="end-date">
        <FormLabel>End-Date</FormLabel>
        <Input placeholder="End-date" />
      </FormControl>
    </Box>
  )
}
