import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Text
} from '@chakra-ui/react'
import { YearBalance } from 'modules/binnacle/data-access/interfaces/year-balance.interface'
import { getDurationByHours } from 'modules/binnacle/data-access/utils/getDuration'
import { useTranslation } from 'react-i18next'
import { useGlobalState } from 'shared/arch/hooks/use-global-state'
import { SettingsState } from 'shared/data-access/state/settings-state'
import { PercentageFormatter } from 'shared/percentage/percentage-formatter'
import { getMonthNames } from 'shared/utils/chrono'

interface Props {
  yearBalance: YearBalance
}

const monthNames = getMonthNames()
const YearBalanceTableMobile: React.FC<Props> = ({ yearBalance }) => {
  const { t } = useTranslation()
  const { settings } = useGlobalState(SettingsState)

  const monthWidthSize = 90
  const roleWidthSize = 175
  const recommendedWidthSize = '125px'

  return (
    <Box>
      <Flex textAlign="left" align="center" h={35}>
        <Text w={monthWidthSize} fontSize="sm" fontWeight="bold" textTransform="uppercase">
          {t('year_balance.month')}
        </Text>
        <Text
          w={recommendedWidthSize}
          mx={3}
          fontSize="sm"
          fontWeight="bold"
          textTransform="uppercase"
        >
          {t('year_balance.recommended')}
        </Text>
        <Text fontSize="sm" fontWeight="bold" textTransform="uppercase">
          {t('year_balance.worked')}
        </Text>
      </Flex>

      <Accordion allowToggle allowMultiple>
        {yearBalance.months.map((month, monthIndex) => {
          const monthHasRolesWithActivities = yearBalance.roles.some(
            (role) => role.months[monthIndex].hours !== 0
          )
          const monthHasVacations = month.vacations.hours !== 0
          const recommended = getDurationByHours(month.recommended, settings.useDecimalTimeFormat)
          const worked = getDurationByHours(month.worked, settings.useDecimalTimeFormat)
          const monthAccordionButtonAriaLabel = `${monthNames[monthIndex]} ${recommended} ${t(
            'year_balance.recommended'
          )}) ${worked} ${t('year_balance.worked')})`

          return (
            <AccordionItem key={monthIndex}>
              <AccordionButton px={0} aria-label={monthAccordionButtonAriaLabel}>
                <Flex flex={1} textAlign="left" align="center">
                  <Text w={monthWidthSize} fontSize="sm">
                    {monthNames[monthIndex]}
                  </Text>
                  <Text w={recommendedWidthSize} mx={3} fontSize="sm">
                    {recommended}
                  </Text>
                  <Text fontSize="sm">{worked}</Text>
                </Flex>
                <AccordionIcon />
              </AccordionButton>

              <AccordionPanel px={0}>
                {!monthHasRolesWithActivities && !monthHasVacations && (
                  <Text fontSize="small" textAlign="center" mt={2} tabIndex={0}>
                    {t('year_balance.monthIsEmpty')}
                  </Text>
                )}

                {monthHasRolesWithActivities &&
                  yearBalance.roles.map((role) => {
                    if (role.months[monthIndex].hours === 0) return
                    const hours = getDurationByHours(
                      role.months[monthIndex].hours,
                      settings.useDecimalTimeFormat
                    )
                    const percentage = PercentageFormatter.format(
                      role.months[monthIndex].percentage
                    )
                    const roleAriaLabel = `${role.organization} ${role.project} ${
                      role.role
                    } ${hours} ${t('year_balance.worked')} ${percentage}`

                    return (
                      <Flex
                        key={role.roleId}
                        flex={1}
                        textAlign="left"
                        align="center"
                        justify="space-between"
                        mb={4}
                        tabIndex={0}
                        aria-label={roleAriaLabel}
                      >
                        <Box>
                          <Text w={roleWidthSize} fontSize="sm" mb={2}>
                            {role.organization}
                          </Text>
                          <Text w={roleWidthSize} fontSize="xs" mb={2}>
                            {role.project}
                          </Text>
                          <Text w={roleWidthSize} fontSize="xs">
                            {role.role}
                          </Text>
                        </Box>
                        <Text fontSize="sm">{hours}</Text>
                        <Text fontSize="sm">{percentage}</Text>
                      </Flex>
                    )
                  })}

                {monthHasVacations && (
                  <Flex
                    flex={1}
                    textAlign="left"
                    align="center"
                    justify="space-between"
                    mb={4}
                    tabIndex={0}
                    aria-label={`${t('vacations')} ${getDurationByHours(
                      month.vacations.hours,
                      settings.useDecimalTimeFormat
                    )} ${t('time_tracking.imputed_hours')} ${PercentageFormatter.format(
                      month.vacations.percentage
                    )}`}
                  >
                    <Box>
                      <Text w={roleWidthSize} fontSize="sm">
                        {t('vacations')}
                      </Text>
                    </Box>
                    <Text fontSize="sm">
                      {getDurationByHours(month.vacations.hours, settings.useDecimalTimeFormat)}
                    </Text>
                    <Text fontSize="sm">
                      {PercentageFormatter.format(month.vacations.percentage)}
                    </Text>
                  </Flex>
                )}
              </AccordionPanel>
            </AccordionItem>
          )
        })}
      </Accordion>
    </Box>
  )
}

export default YearBalanceTableMobile
