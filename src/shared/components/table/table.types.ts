import { ReactNode } from 'react'

interface ColumnsProps {
  title?: string
  key?: string
  render?: (text) => ReactNode
  dataIndex: string
}

export interface TableProps<RecordType = any> {
  columns: ColumnsProps[]
  dataSource: RecordType[]
  emptyTableKey: string
}
