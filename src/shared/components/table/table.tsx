import { useColorModeValue } from '@chakra-ui/react'
import { DesktopView } from './desktop-view/desktop-view'
import { MobileView } from './mobile-view/mobile-view'
import { TableProps } from './table.types'
import { FC } from 'react'
import { useIsMobile } from '../../hooks/use-is-mobile'

export const Table: FC<TableProps> = ({ dataSource, columns, emptyTableKey }) => {
  const bgColor = useColorModeValue('dark', undefined)
  const isMobile = useIsMobile()

  return isMobile ? (
    <MobileView dataSource={dataSource} columns={columns} emptyTableKey={emptyTableKey} />
  ) : (
    <DesktopView
      dataSource={dataSource}
      columns={columns}
      emptyTableKey={emptyTableKey}
      bgColor={bgColor}
    />
  )
}
