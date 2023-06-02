import type { FC } from 'react'
import { Box, Heading } from '@chakra-ui/react'
import styles from './page-with-title.module.css'
import { useIsMobile } from '../../hooks'

interface Props {
  title: string
}

export const PageWithTitle: FC<Props> = ({ children, title }) => {
  const isMobile = useIsMobile()

  return (
    <Box mx={8} my={10}>
      {!isMobile && (
        <Heading as={'h1'} marginBottom={10} fontSize={28} className={styles.title}>
          {title}
        </Heading>
      )}
      {children}
    </Box>
  )
}
