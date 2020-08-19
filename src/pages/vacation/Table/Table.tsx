import React from 'react'
import { Box, BoxProps, useColorModeValue } from '@chakra-ui/core'

/**
 * Represents tabular data - that is, information presented in a
 * two-dimensional table comprised of rows and columns of cells containing
 * data. It renders a `<table>` HTML element.
 */
export function Table(props: BoxProps) {
  return (
    <Box
      shadow="sm"
      rounded="md"
      overflow="hidden">
      <Box
        as="table"
        width="full"
        {...props} />
    </Box>
  )
}

/**
 * Defines a set of rows defining the head of the columns of the table. It
 * renders a `<thead>` HTML element.
 */
export function TableHead(props: BoxProps) {
  return <Box
    as="thead"
    {...props} />
}

/**
 * Defines a row of cells in a table. The row's cells can then be established
 * using a mix of `TableCell` and `TableHeader` elements. It renders a `<tr>`
 * HTML element.
 */
export function TableRow(props: BoxProps) {
  return <Box
    as="tr"
    {...props} />
}

/**
 * Defines a cell as header of a group of table cells. It renders a `<th>` HTML
 * element.
 */
export function TableHeader(props: BoxProps) {
  const bg = useColorModeValue('gray.50', 'gray.700')
  const color = useColorModeValue('gray.500', 'gray.400')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  return (
    <Box
      as="th"
      px="5"
      py="3"
      borderBottomWidth="1px"
      borderColor={borderColor}
      bg={bg}
      color={color}
      textAlign="left"
      fontSize="xs"
      textTransform="uppercase"
      letterSpacing="wider"
      lineHeight="1rem"
      fontWeight="medium"
      {...props}
    />
  )
}

/**
 * Encapsulates a set of table rows, indicating that they comprise the body of
 * the table. It renders a `<tbody>` HTML element.
 */
export function TableBody(props: BoxProps) {
  const bg = useColorModeValue('white', 'gray.800')

  return <Box
    as="tbody"
    bg={bg}
    {...props} />
}

/**
 * Defines a cell of a table that contains data. It renders a `<td>` HTML
 * element.
 */
export function TableCell(props: BoxProps) {
  // const color = useColorModeValue('gray.500', 'gray.400')
  return <Box
    as="td"
    px="5"
    py="3"
    lineHeight="1.25rem"
    {...props} />
}
