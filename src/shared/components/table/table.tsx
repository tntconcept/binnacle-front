import { useIsMobile } from 'shared/hooks'
import DesktopView from './desktop-view/desktop-view'
import MobileView from './mobile-view/mobile-view'
import { TableProps } from './table.types'

const Table: React.FC<TableProps> = ({ dataSource, columns }) => {
  const isMobile = useIsMobile()

  return isMobile ? (
    <MobileView />
  ) : (
    <DesktopView dataSource={dataSource} columns={columns} emptyTableKey={''} />
  )
}

export default Table
