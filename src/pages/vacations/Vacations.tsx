import React from 'react'
import { Input, Box, FormControl, FormLabel } from '@chakra-ui/core'
import { DatePicker } from 'pages/vacations/DatePicker'

export function Vacations() {
  return (
    <Box p={10}>
      <DatePicker />
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
