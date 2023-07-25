import type { FC, PropsWithChildren } from 'react'
import { useTitle } from '../hooks/use-title'

interface Props {
  title: string
}

export const PageTitle: FC<PropsWithChildren<Props>> = ({ children, title }) => {
  useTitle(title)
  return <>{children}</>
}
