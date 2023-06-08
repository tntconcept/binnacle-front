import { ResponsiveValue } from '@chakra-ui/react'
import { ReactNode } from 'react'

export type Item<T = any> = T

export interface ColumnsProps {
  /** Title of this column */
  title: string
  /** Key of this column */
  key: string
  /** Renderer of the table cell. The return value should be a react node or an object */
  render?: (item?: Item, key?: string) => ReactNode
  /** Display the field of the data record */
  dataIndex: string
  /** Display the column in the mobile accordion label */
  showInMobile?: boolean
  showLabelInMobile?: boolean
}

export interface TableProps<RecordType = any> {
  /** Columns of table */
  columns: ColumnsProps[]
  /** Data record arry to be displayed */
  dataSource: RecordType[]
  /** Key of the text to show on an empty table */
  emptyTableKey: string
}

export interface DesktopViewProps<Color = any> extends TableProps {
  /** Table background */
  bgColor: ResponsiveValue<Color>
}

export type MobileViewProps = TableProps
