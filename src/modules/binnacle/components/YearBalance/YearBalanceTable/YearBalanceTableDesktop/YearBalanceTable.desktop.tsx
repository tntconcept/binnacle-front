import {
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  TableContainer,
  Text
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

  const tableHeaders = (
    <Thead>
      <Tr>
        <Th fontSize="small">{t('year_balance.concept')}</Th>
        {getMonthNames().map((monthName) => (
          <Th key={monthName} fontSize="small">
            {monthName}
          </Th>
        ))}
        <Th>{t('year_balance.total')}</Th>
      </Tr>
    </Thead>
  )

  const tableRoleRows = yearBalance.roles.map((role) => {
    return (
      <Tr key={role.roleId}>
        <Td display="inline-block" className={styles['concept-cell']}>
          <Text>{role.organization}</Text>
          <Text>{role.project}</Text>
          <Text>{role.role}</Text>
        </Td>
        {role.months.map((roleMonth, index) => {
          const text =
            roleMonth.worked !== 0
              ? getDurationByHours(roleMonth.worked, settings.useDecimalTimeFormat)
              : '-'
          return (
            <Td key={index}>
              <Text> {text}</Text>
              {roleMonth.worked !== 0 && (
                <Text fontSize="sm">{PercentageFormatter.format(roleMonth.percentage)}</Text>
              )}
            </Td>
          )
        })}
        <Td w="7%">{getDurationByHours(role.worked, settings.useDecimalTimeFormat)}</Td>
      </Tr>
    )
  })

  const tableWorkedRow = () => {
    let totalYear = 0
    return (
      <Tr>
        <Td fontWeight="semibold">{t('year_balance.worked')}</Td>
        {yearBalance.months.map((month, index) => {
          totalYear += month.worked
          return (
            <Td key={index}>{getDurationByHours(month.worked, settings.useDecimalTimeFormat)}</Td>
          )
        })}
        <Td>{getDurationByHours(totalYear, settings.useDecimalTimeFormat)}</Td>
      </Tr>
    )
  }

  const tableRecommendedRow = () => {
    let recommendedYear = 0
    return (
      <Tr>
        <Td fontWeight="semibold">{t('year_balance.recommended')}</Td>
        {yearBalance.months.map((month, index) => {
          recommendedYear += month.recommended
          return (
            <Td key={index}>
              {getDurationByHours(month.recommended, settings.useDecimalTimeFormat)}
            </Td>
          )
        })}
        <Td>{getDurationByHours(recommendedYear, settings.useDecimalTimeFormat)}</Td>
      </Tr>
    )
  }

  const tableBalanceRow = () => {
    let balanceYear = 0
    return (
      <Tr>
        <Td fontWeight="semibold">{t('year_balance.balance')}</Td>
        {yearBalance.months.map((month, index) => {
          balanceYear += month.balance
          const isNegativeBalance = month.balance < 0
          return (
            <Td key={index}>
              <Text color={isNegativeBalance ? balanceNegativeColor : balancePositiveColor}>
                {getDurationByHours(month.balance, settings.useDecimalTimeFormat, true)}
              </Text>
            </Td>
          )
        })}
        <Td>
          <Text color={balanceYear < 0 ? balanceNegativeColor : balancePositiveColor}>
            {getDurationByHours(balanceYear, settings.useDecimalTimeFormat)}
          </Text>
        </Td>
      </Tr>
    )
  }

  return (
    <TableContainer py={4}>
      <Table bgColor={bgColor} className={styles['data-table']}>
        {tableHeaders}
        <Tbody>
          {tableRoleRows.length === 0 && (
            <Tr>
              <Td colSpan={5}>{t('year_balance.tableIsEmpty')}</Td>
            </Tr>
          )}
          {tableRoleRows}
          {tableWorkedRow()}
          {tableRecommendedRow()}
          {tableBalanceRow()}
        </Tbody>
      </Table>
    </TableContainer>
  )
}

export default YearBalanceTableDesktop
