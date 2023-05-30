import { Table, Tbody, Td, Th, Thead, Tr, useColorModeValue } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { TableProps } from '../table.types'

const DesktopView: React.FC<TableProps> = ({ columns, dataSource, emptyTableKey }) => {
  const { t } = useTranslation()
  const bgColor = useColorModeValue('white', undefined)

  return (
    <Table bgColor={bgColor}>
      <Thead>
        <Tr>
          {columns.map(({ title, key }) => {
            return title && <Th key={key}>{t(title)}</Th>
          })}
        </Tr>
      </Thead>
      <Tbody>
        {dataSource.length === 0 && (
          <Tr>
            <Td colSpan={6}>{t(emptyTableKey)}</Td>
          </Tr>
        )}
        {dataSource.map((item) => (
          <Tr key={item.key}>
            {columns.map(({ key, render, dataIndex }) => (
              <Td key={key}>{render ? render(item[dataIndex]) : item[dataIndex]}</Td>
            ))}
          </Tr>
        ))}
      </Tbody>
    </Table>
  )
}

export default DesktopView
