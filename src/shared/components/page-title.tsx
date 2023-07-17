import type { FC } from 'react'
import { useTitle } from '../hooks/use-title'

interface Props {
  title: string
}

export const PageTitle: FC<Props> = ({ children, title }) => {
  useTitle(title)
  return <>{children}</>
}
