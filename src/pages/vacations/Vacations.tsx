import React from 'react'
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Link,
  SimpleGrid,
  Tag,
  TagLabel,
  Text
} from '@chakra-ui/core'
import { DatePicker } from 'pages/vacations/DatePicker/DatePicker'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from 'pages/vacations/Table'

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
      <SimpleGrid columns={2}>
        <Text>Annual holidays (according the agreement)</Text>
        <Text>22</Text>
        <Text>Holidays this year (according entry date)</Text>
        <Text>11</Text>
        <Text>Accepted holidays</Text>
        <Text>11</Text>
        <Text>Pending holidays</Text>
        <Text>11</Text>
      </SimpleGrid>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Periodo</TableHeader>
            <TableHeader>Días</TableHeader>
            <TableHeader>Estado</TableHeader>
            <TableHeader>Descripción</TableHeader>
            <TableHeader>Observaciones</TableHeader>
            <TableHeader />
            <TableHeader />
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell whiteSpace="nowrap">
              <Text
                fontWeight="bold"
                fontSize="sm">
                10 mayo - 21 mayo
              </Text>
            </TableCell>
            <TableCell>
              <Text fontSize="sm">11</Text>
            </TableCell>
            <TableCell>
              <Tag
                colorScheme="orange"
                borderRadius="full"
                size="md">
                <TagLabel>Canceled</TagLabel>
              </Tag>
            </TableCell>
            <TableCell>
              <Text fontSize="sm">
                At vero eos et accusamus et iusto odio dignissimos ducimus qui
                blanditiis praesentium voluptatum.
              </Text>
            </TableCell>
            <TableCell>
              <Text fontSize="sm">
                At vero eos et accusamus et iusto odio dignissimos ducimus qui
                blanditiis praesentium voluptatum.
              </Text>
            </TableCell>
            <TableCell textAlign="right">
              <Link
                fontSize="sm"
                fontWeight="medium"
                color="blue.600">
                E
              </Link>
            </TableCell>
            <TableCell textAlign="right">
              <Link
                fontSize="sm"
                fontWeight="medium"
                color="blue.600">
                D
              </Link>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  )
}

// <TableRow bg="gray.50">
