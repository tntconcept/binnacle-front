import { Box, Heading } from '@chakra-ui/react'
import type { FC } from 'react'
import { useIsMobile, useTitle } from '../../hooks'
import styles from './page-with-title.module.css'

interface Props {
  title: string
}

export const PageWithTitle: FC<Props> = ({ children, title }) => {
  const isMobile = useIsMobile()
  useTitle(title)

  return (
    <Box mx={8} my={0}>
      {!isMobile && (
        <Heading as={'h1'} marginBottom={8} fontSize={28} className={styles.title}>
          {title}
        </Heading>
      )}
      {children}
    </Box>
  )
}
