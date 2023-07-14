import { Box, Flex, Heading } from '@chakra-ui/react'
import type { FC, ReactNode } from 'react'
import styles from './page-with-title.module.css'
import { useIsMobile } from '../../hooks/use-is-mobile'
import { useTitle } from '../../hooks/use-title'

interface Props {
  title: string
  actions?: ReactNode
}

export const PageWithTitle: FC<Props> = ({ children, title, actions }) => {
  const isMobile = useIsMobile()
  useTitle(title)

  return (
    <Box mx={isMobile ? 4 : 8} my={0}>
      <Flex justifyContent={isMobile ? 'flex-end' : 'space-between'} alignItems="flex-start">
        {!isMobile && (
          <Heading as={'h1'} marginBottom={4} fontSize={28} className={styles.title}>
            {title}
          </Heading>
        )}
        {actions}
      </Flex>
      {children}
    </Box>
  )
}
