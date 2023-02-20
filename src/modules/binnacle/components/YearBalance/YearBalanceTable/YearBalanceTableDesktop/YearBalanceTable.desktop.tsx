import {
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue
} from '@chakra-ui/react'
import { YearBalance } from 'modules/binnacle/data-access/interfaces/year-balance.interface'
import { getDurationByHours } from 'modules/binnacle/data-access/utils/getDuration'
import { useTranslation } from 'react-i18next'
import { useGlobalState } from 'shared/arch/hooks/use-global-state'
import { SettingsState } from 'shared/data-access/state/settings-state'
import { PercentageFormatter } from 'shared/percentage/percentage-formatter'
import { getMonthNames } from 'shared/utils/chrono'

import styles from './YearBalanceTable.module.css'

interface Props {
  yearBalance: YearBalance
}

const YearBalanceTableDesktop: React.FC<Props> = ({ yearBalance }) => {
  const { t } = useTranslation()
  const { settings } = useGlobalState(SettingsState)
  const bgColor = useColorModeValue('white', undefined)
  const balancePositiveColor = useColorModeValue('green.600', 'green.200')
  const balanceNegativeColor = useColorModeValue('red.600', 'red.200')
  const monthNames = getMonthNames()

  const tableHeaders = (
    <Thead>
      <Tr>
        <Th scope="col" id="concept-title" fontSize="small">
          {t('year_balance.concept')}
        </Th>
        {monthNames.map((monthName, index) => (
          <Th scope="col" id={`month-${index}`} key={monthName} fontSize="small">
            {monthName}
          </Th>
        ))}
        <Th scope="col" id="total">
          {t('year_balance.total')}
        </Th>
      </Tr>
    </Thead>
  )

  const tableRoleRows = yearBalance.roles.map((role) => {
    return (
      <Tr key={role.roleId}>
        <Th scope="row" id="concept" display="inline-block" className={styles['concept-cell']}>
          <Text>{role.organization}</Text>
          <Text>{role.project}</Text>
          <Text>{role.role}</Text>
        </Th>
        {role.months.map((roleMonth, index) => {
          const text =
            roleMonth.hours !== 0
              ? getDurationByHours(roleMonth.hours, settings.useDecimalTimeFormat)
              : '-'
          return (
            <Td headers={`concept month-${index}`} key={index} tabIndex={0}>
              <Text
                aria-label={`${role.organization} ${role.project} ${role.role} ${monthNames[index]} ${text}`}
              >
                {text}
              </Text>
              {roleMonth.hours !== 0 && (
                <Text fontSize="sm">{PercentageFormatter.format(roleMonth.percentage)}</Text>
              )}
            </Td>
          )
        })}

        <Td headers="concept total" w="7%" tabIndex={0}>
          <Text
            aria-label={`${role.organization} ${role.project} ${role.role}  ${t(
              'total'
            )} ${getDurationByHours(role.worked, settings.useDecimalTimeFormat)}`}
          >
            {getDurationByHours(role.worked, settings.useDecimalTimeFormat)}
          </Text>
        </Td>
      </Tr>
    )
  })

  const tableVacationsRow = () => {
    let totalYear = 0
    return (
      <Tr>
        <Th scope="row" id="concept" fontWeight="semibold">
          {t('vacations')}
        </Th>
        {yearBalance.months.map((month, index) => {
          totalYear += month.vacations.hours
          const text =
            month.vacations.hours !== 0
              ? getDurationByHours(month.vacations.hours, settings.useDecimalTimeFormat)
              : '-'
          return (
            <Td headers={`concept month-${index}`} key={index} tabIndex={0}>
              <Text aria-label={`${t('vacations')} ${monthNames[index]} ${text}`}>{text}</Text>
              {month.vacations.hours !== 0 && (
                <Text fontSize="sm">{PercentageFormatter.format(month.vacations.percentage)}</Text>
              )}
            </Td>
          )
        })}
        <Td headers="concept total" tabIndex={0}>
          <Text
            aria-label={`${t('vacations')} ${t('total')} ${getDurationByHours(
              totalYear,
              settings.useDecimalTimeFormat
            )}`}
          >
            {getDurationByHours(totalYear, settings.useDecimalTimeFormat)}
          </Text>
        </Td>
      </Tr>
    )
  }

  const tableWorkedRow = () => {
    let totalYear = 0
    return (
      <Tr>
        <Th scope="row" id="concept" fontWeight="semibold">
          {t('year_balance.worked')}
        </Th>
        {yearBalance.months.map((month, index) => {
          totalYear += month.worked
          return (
            <Td headers={`concept month-${index}`} key={index} tabIndex={0}>
              <Text
                aria-label={`${t('year_balance.worked')} ${monthNames[index]} ${getDurationByHours(
                  month.worked,
                  settings.useDecimalTimeFormat
                )}`}
              >
                {getDurationByHours(month.worked, settings.useDecimalTimeFormat)}
              </Text>
            </Td>
          )
        })}
        <Td headers="concept total" tabIndex={0}>
          <Text
            aria-label={`${t('year_balance.worked')} ${t('total')} ${getDurationByHours(
              totalYear,
              settings.useDecimalTimeFormat
            )}`}
          >
            {getDurationByHours(totalYear, settings.useDecimalTimeFormat)}
          </Text>
        </Td>
      </Tr>
    )
  }

  const tableRecommendedRow = () => {
    let recommendedYear = 0
    return (
      <Tr>
        <Th scope="row" id="concept" fontWeight="semibold">
          {t('year_balance.recommended')}
        </Th>
        {yearBalance.months.map((month, index) => {
          recommendedYear += month.recommended
          return (
            <Td headers={`concept month-${index}`} key={index} tabIndex={0}>
              <Text
                aria-label={`${t('year_balance.recommended')} ${
                  monthNames[index]
                } ${getDurationByHours(month.recommended, settings.useDecimalTimeFormat)}`}
              >
                {getDurationByHours(month.recommended, settings.useDecimalTimeFormat)}
              </Text>
            </Td>
          )
        })}
        <Td headers="concept total" tabIndex={0}>
          <Text
            aria-label={`${t('year_balance.recommended')} ${t('total')} ${getDurationByHours(
              recommendedYear,
              settings.useDecimalTimeFormat
            )}`}
          >
            {getDurationByHours(recommendedYear, settings.useDecimalTimeFormat)}
          </Text>
        </Td>
      </Tr>
    )
  }

  const tableBalanceRow = () => {
    let balanceYear = 0
    return (
      <Tr>
        <Th scope="row" id="concept" fontWeight="semibold">
          {t('year_balance.balance')}
        </Th>
        {yearBalance.months.map((month, index) => {
          balanceYear += month.balance
          const isNegativeBalance = month.balance < 0
          return (
            <Td headers={`concept month-${index}`} key={index} tabIndex={0}>
              <Text
                aria-label={`${t('year_balance.balance')} ${monthNames[index]} ${getDurationByHours(
                  month.balance,
                  settings.useDecimalTimeFormat,
                  true
                )}`}
                color={isNegativeBalance ? balanceNegativeColor : balancePositiveColor}
              >
                {getDurationByHours(month.balance, settings.useDecimalTimeFormat, true)}
              </Text>
            </Td>
          )
        })}
        <Td headers="concept total" tabIndex={0}>
          <Text
            aria-label={`${t('year_balance.balance')} ${t('total')} ${getDurationByHours(
              balanceYear,
              settings.useDecimalTimeFormat,
              true
            )}`}
            color={balanceYear < 0 ? balanceNegativeColor : balancePositiveColor}
          >
            {getDurationByHours(balanceYear, settings.useDecimalTimeFormat)}
          </Text>
        </Td>
      </Tr>
    )
  }

  return (
    <TableContainer py={4}>
      <Table bgColor={bgColor} className={styles['data-table']}>
        <TableCaption display="none" tabIndex={0}>
          {t('year_balance.table_caption')}
        </TableCaption>
        {tableHeaders}
        <Tbody>
          {tableRoleRows}
          {tableVacationsRow()}
          {tableWorkedRow()}
          {tableRecommendedRow()}
          {tableBalanceRow()}
        </Tbody>
      </Table>
    </TableContainer>
  )
}

export default YearBalanceTableDesktop
