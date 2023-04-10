import { Button, Flex, Icon, useColorModeValue } from '@chakra-ui/react'
import { ChevronLeftIcon } from '@heroicons/react/outline'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { paths } from 'shared/router/paths'
import { formatDayAndMonth } from './utils/formatDayAndMonth'

interface Props {
  date: Date
}

export const ActivityFormNavbar: FC<Props> = (props) => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const bgColor = useColorModeValue('white', 'gray.800')

  const handleClick = () => {
    navigate(paths.binnacle)
  }

  return (
    <Flex
      position="fixed"
      width="full"
      as="nav"
      height="50px"
      align="center"
      justify="space-between"
      pr="16px"
      bgColor={bgColor}
      zIndex={200}
    >
      <Button
        onClick={handleClick}
        leftIcon={<Icon as={ChevronLeftIcon} boxSize={6} />}
        variant="unstyled"
        p="0 10px"
        d="flex"
      >
        {t('actions.back')}
      </Button>
      <span>{formatDayAndMonth(props.date, i18n.language)}</span>
    </Flex>
  )
}
