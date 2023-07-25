import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Stack,
  Text
} from '@chakra-ui/react'
import { Vacation } from '../../../../domain/vacation'
import { useTranslation } from 'react-i18next'
import { chrono } from '../../../../../../../../shared/utils/chrono'
import { RemoveVacationButton } from '../remove-vacation-button/remove-vacation-button'
import { VacationBadge } from '../vacation-badge'
import { FC } from 'react'

interface Props {
  vacations: Vacation[]
  onUpdateVacation: (vacation: Vacation) => void
}

const VacationTableMobile: FC<Props> = (props) => {
  const { t } = useTranslation()

  return (
    <Box>
      <Flex textAlign="left" align="center" h={35}>
        <Text w={175} fontSize="sm" fontWeight="bold" textTransform="uppercase">
          {t('vacation_table.period')}
        </Text>
        <Text w="40px" mx={3} fontSize="sm" fontWeight="bold" textTransform="uppercase">
          {t('vacation_table.days')}
        </Text>
        <Text fontSize="sm" fontWeight="bold" textTransform="uppercase">
          {t('vacation_table.status')}
        </Text>
      </Flex>
      {props.vacations.length === 0 && <p>{t('vacation_table.empty')}</p>}
      <Accordion allowToggle allowMultiple>
        {props.vacations.map((vacation, index) => {
          const period = `${chrono(vacation.startDate).format('yyyy-MM-dd')} - ${chrono(
            vacation.endDate
          ).format('yyyy-MM-dd')}`

          return (
            <AccordionItem key={index}>
              <AccordionButton px={0}>
                <Flex flex={1} textAlign="left" align="center">
                  <Text w={175} fontSize="sm">
                    {period}
                  </Text>
                  <Text w="40px" mx={3} fontSize="sm">
                    {vacation.days.length}
                  </Text>
                  <VacationBadge status={vacation.state} />
                </Flex>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel px={0}>
                <Text>
                  {t('vacation_table.description')}: {vacation.description || '-'}
                </Text>
                <Text>
                  {t('vacation_table.observations')}: {vacation.observations || '-'}
                </Text>
                {vacation.state === 'PENDING' && (
                  <Stack direction="row" spacing={2}>
                    <Button
                      colorScheme="blue"
                      variant="ghost"
                      size="sm"
                      onClick={() => props.onUpdateVacation(vacation)}
                    >
                      {t('actions.edit')}
                    </Button>
                    <RemoveVacationButton vacationId={vacation.id} />
                  </Stack>
                )}
              </AccordionPanel>
            </AccordionItem>
          )
        })}
      </Accordion>
    </Box>
  )
}

export default VacationTableMobile
