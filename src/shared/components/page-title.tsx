import type { FC } from 'react'
import { useTitle } from 'shared/hooks'

interface Props {
  title: string
}

export const PageTitle: FC<Props> = ({ children, title }) => {
  useTitle(title)
  return <>{children}</>
}
