import { Box, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { DesktopViewProps } from '../table.types'
import { FC } from 'react'

const DesktopView: FC<DesktopViewProps> = ({ columns, dataSource, emptyTableKey, bgColor }) => {
  const { t } = useTranslation()
  return (
    <Box overflowX={'auto'}>
      <Table color={bgColor}>
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
              <Td data-testid="empty-desktop-view" colSpan={columns.length}>
                {t(emptyTableKey)}
              </Td>
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
    </Box>
  )
}

export default DesktopView
