import {
  Icon,
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
import { BuildingOfficeIcon, UserIcon, UsersIcon } from '@heroicons/react/24/outline'
import { YearBalance } from '../../../../../domain/year-balance'
import { getDurationByHours } from '../../../../../utils/get-duration'
import { useTranslation } from 'react-i18next'
import { PercentageFormatter } from '../../../../../../../../../shared/percentage/percentage-formatter'
import { getMonthNames } from '../../../../../../../../../shared/utils/chrono'
import { useCalendarContext } from '../../../../contexts/calendar-context'
import styles from './year-balance-table.module.css'
import { FC } from 'react'

interface Props {
  yearBalance: YearBalance
}

const YearBalanceTableDesktop: FC<Props> = ({ yearBalance }) => {
  const { t } = useTranslation()
  const { shouldUseDecimalTimeFormat } = useCalendarContext()
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
          <Text maxWidth="27ch" isTruncated>
            <Icon
              as={BuildingOfficeIcon}
              aria-label={t('activity_form.organization') + ':'}
              color="gray.400"
              mr={1}
            />
            {role.organization}
          </Text>
          <Text maxWidth="27ch" isTruncated>
            <Icon
              as={UsersIcon}
              aria-label={t('activity_form.project') + ':'}
              color="gray.400"
              mr={1}
            />
            {role.project}
          </Text>
          <Text maxWidth="27ch" isTruncated>
            <Icon
              as={UserIcon}
              aria-label={t('activity_form.role') + ':'}
              color="gray.400"
              mr={1}
            />
            {role.role}
          </Text>
        </Th>
        {role.months.map((roleMonth, index) => {
          const text =
            roleMonth.hours !== 0
              ? getDurationByHours(roleMonth.hours, shouldUseDecimalTimeFormat)
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
            )} ${getDurationByHours(role.worked, shouldUseDecimalTimeFormat)}`}
          >
            {getDurationByHours(role.worked, shouldUseDecimalTimeFormat)}
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
              ? getDurationByHours(month.vacations.hours, shouldUseDecimalTimeFormat)
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
              shouldUseDecimalTimeFormat
            )}`}
          >
            {getDurationByHours(totalYear, shouldUseDecimalTimeFormat)}
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
                  shouldUseDecimalTimeFormat
                )}`}
              >
                {getDurationByHours(month.worked, shouldUseDecimalTimeFormat)}
              </Text>
            </Td>
          )
        })}
        <Td headers="concept total" tabIndex={0}>
          <Text
            aria-label={`${t('year_balance.worked')} ${t('total')} ${getDurationByHours(
              totalYear,
              shouldUseDecimalTimeFormat
            )}`}
          >
            {getDurationByHours(totalYear, shouldUseDecimalTimeFormat)}
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
                } ${getDurationByHours(month.recommended, shouldUseDecimalTimeFormat)}`}
              >
                {getDurationByHours(month.recommended, shouldUseDecimalTimeFormat)}
              </Text>
            </Td>
          )
        })}
        <Td headers="concept total" tabIndex={0}>
          <Text
            aria-label={`${t('year_balance.recommended')} ${t('total')} ${getDurationByHours(
              recommendedYear,
              shouldUseDecimalTimeFormat
            )}`}
          >
            {getDurationByHours(recommendedYear, shouldUseDecimalTimeFormat)}
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
                  shouldUseDecimalTimeFormat,
                  true
                )}`}
                color={isNegativeBalance ? balanceNegativeColor : balancePositiveColor}
              >
                {getDurationByHours(month.balance, shouldUseDecimalTimeFormat, true)}
              </Text>
            </Td>
          )
        })}
        <Td headers="concept total" tabIndex={0}>
          <Text
            aria-label={`${t('year_balance.balance')} ${t('total')} ${getDurationByHours(
              balanceYear,
              shouldUseDecimalTimeFormat,
              true
            )}`}
            color={balanceYear < 0 ? balanceNegativeColor : balancePositiveColor}
          >
            {getDurationByHours(balanceYear, shouldUseDecimalTimeFormat)}
          </Text>
        </Td>
      </Tr>
    )
  }

  return (
    <TableContainer className={styles['table-container']}>
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
