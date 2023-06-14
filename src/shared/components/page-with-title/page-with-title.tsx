import { Box, Button, Flex, Heading } from '@chakra-ui/react'
import type { FC } from 'react'
import React from 'react'
import { useIsMobile, useTitle } from '../../hooks'
import styles from './page-with-title.module.css'
import { useTranslation } from 'react-i18next'

interface Props {
  title: string
  onClickAction?: () => void
}

export const PageWithTitle: FC<Props> = ({ children, title, onClickAction }) => {
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  useTitle(title)

  return (
    <Box mx={isMobile ? 4 : 8} my={0}>
      <Flex justifyContent={isMobile ? 'flex-end' : 'space-between'} alignItems="flex-start">
        {!isMobile && (
          <Heading as={'h1'} marginBottom={8} fontSize={28} className={styles.title}>
            {title}
          </Heading>
        )}
        {onClickAction && (
          <Button
            data-testid="show_activity_modal"
            onClick={() => onClickAction()}
            type="button"
            colorScheme="grey"
            variant="outline"
            size="sm"
            px="29px"
            py="6px"
          >
            {t('activity.create')}
          </Button>
        )}
      </Flex>
      {children}
    </Box>
  )
}
