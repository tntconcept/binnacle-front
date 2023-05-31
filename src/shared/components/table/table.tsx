import { useColorModeValue } from '@chakra-ui/react'
import { useIsMobile } from 'shared/hooks'
import DesktopView from './desktop-view/desktop-view'
import MobileView from './mobile-view/mobile-view'
import { TableProps } from './table.types'

const Table: React.FC<TableProps> = ({ dataSource, columns, emptyTableKey }) => {
  const bgColor = useColorModeValue('white', undefined)
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

export default Table
