import { useColorModeValue } from '@chakra-ui/react'
import { useIsMobile } from 'shared/hooks'
import DesktopView from './desktop-view/desktop-view'
import MobileView from './mobile-view/mobile-view'
import { TableProps } from './table.types'

const Table: React.FC<TableProps> = ({ dataSource, columns }) => {
  const bgColor = useColorModeValue('white', undefined)
  const isMobile = useIsMobile()

  return isMobile ? (
    <MobileView dataSource={dataSource} columns={columns} emptyTableKey="any-key" />
  ) : (
    <DesktopView dataSource={dataSource} columns={columns} emptyTableKey={''} bgColor={bgColor} />
  )
}

export default Table
