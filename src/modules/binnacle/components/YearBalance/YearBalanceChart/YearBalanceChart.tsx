import { Box, useColorModeValue, useToken, Wrap, WrapItem } from '@chakra-ui/react'
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip
} from 'chart.js'
import { YearBalance } from 'modules/binnacle/data-access/interfaces/year-balance.interface'
import { getDurationByHours } from 'modules/binnacle/data-access/utils/getDuration'
import { Chart } from 'react-chartjs-2'
import { useTranslation } from 'react-i18next'
import { useGlobalState } from 'shared/arch/hooks/use-global-state'
import { SettingsState } from 'shared/data-access/state/settings-state'
import { PercentageFormatter } from 'shared/percentage/percentage-formatter'
import { getMonthNames } from 'shared/utils/chrono'
import { LegendItem } from './LegendItem'
import styles from './YearBalanceChart.module.css'

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController
)

const monthNames = getMonthNames()
export const YearBalanceChart: React.FC<{ yearBalance: YearBalance }> = ({ yearBalance }) => {
  const { t } = useTranslation()
  const { settings } = useGlobalState(SettingsState)

  const recommendedColor = useToken('colors', useColorModeValue('red.600', 'red.200'))
  const vacationsColor = useToken('colors', useColorModeValue('blue.400', 'blue.400'))
  const fontColor = useToken('colors', useColorModeValue('black', 'whiteAlpha.900'))
  const barColors = [
    useToken('colors', useColorModeValue('green.500', 'green.200')),
    useToken('colors', useColorModeValue('orange.400', 'orange.200')),
    useToken('colors', useColorModeValue('purple.500', 'purple.200')),
    useToken('colors', useColorModeValue('teal.500', 'teal.200')),
    useToken('colors', useColorModeValue('yellow.500', 'yellow.200')),
    useToken('colors', useColorModeValue('cyan.500', 'cyan.200')),
    useToken('colors', useColorModeValue('pink.500', 'pink.200')),
    useToken('colors', useColorModeValue('green.900', 'green.200')),
    useToken('colors', useColorModeValue('orange.900', 'orange.200')),
    useToken('colors', useColorModeValue('teal.900', 'teal.200')),
    useToken('colors', useColorModeValue('yellow.900', 'yellow.200')),
    useToken('colors', useColorModeValue('cyan.900', 'cyan.200')),
    useToken('colors', useColorModeValue('purple.900', 'purple.200')),
    useToken('colors', useColorModeValue('pink.900', 'pink.200'))
  ]

  const labels = yearBalance.months.map((month, index) => {
    return [monthNames[index], getDurationByHours(month.worked, settings.useDecimalTimeFormat)]
  })

  const maxRecommendedValue = yearBalance.months.reduce(
    (prev, month) => (month.recommended > prev ? month.recommended : prev),
    0
  )

  const chartOptions = {
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems: any) => {
            if (tooltipItems.length === 0) return

            const dataIndex = tooltipItems.at(0).dataIndex
            return monthNames[dataIndex]
          },
          label: (context: { label: any; dataIndex: any; dataset: any; type: any }) => {
            const { dataIndex, dataset } = context
            const isRecommendedDataset = dataset.type === 'line'
            if (isRecommendedDataset)
              return [
                dataset.label,
                getDurationByHours(dataset.data[dataIndex].y, settings.useDecimalTimeFormat),
                ''
              ]

            const { organization, project, role, percentage, y: value } = dataset.data[dataIndex]

            if (value === 0) return ''
            return [
              organization,
              project,
              role,
              `${getDurationByHours(
                value,
                settings.useDecimalTimeFormat
              )} - ${PercentageFormatter.format(percentage)}`,
              ''
            ]
          },
          afterBody: (tooltipItems: any[]) => {
            if (tooltipItems.length === 0) return

            const dataIndex = tooltipItems.at(0).dataIndex
            const { worked, balance } = yearBalance.months[dataIndex]
            return [
              `${t('year_balance.worked')}: ${getDurationByHours(
                worked,
                settings.useDecimalTimeFormat
              )}`,
              `${t('year_balance.balance')}: ${getDurationByHours(
                balance,
                settings.useDecimalTimeFormat,
                true
              )}`
            ]
          }
        }
      }
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
        ticks: {
          color: fontColor
        }
      },
      y: {
        stacked: true,
        suggestedMax: maxRecommendedValue + 20,
        ticks: {
          color: fontColor
        }
      }
    },
    layout: {
      padding: {
        bottom: 50
      }
    }
  }
  const recommended = yearBalance.months.map((month) => month.recommended)
  const recommendedDataset = {
    type: 'line',
    label: t('time_tracking.target_hours'),
    backgroundColor: recommendedColor,
    borderColor: recommendedColor,
    fill: false,
    data: recommended.map((value, index) => ({ y: value, x: index }))
  }
  const vacations = yearBalance.months.map((month) => month.vacations)
  const vacationsDataset = {
    type: 'bar',
    label: t('vacations'),
    backgroundColor: vacationsColor,
    borderColor: vacationsColor,
    data: vacations.map((value, index) => ({ y: value, x: index }))
  }

  const rolesDataset = yearBalance.roles.map((role, index) => {
    const colorIndex = index % barColors.length
    const barTokenColor = barColors[colorIndex]
    return {
      type: 'bar',
      label: [role.organization, role.project, role.role],
      data: role.months.map(({ worked, percentage }, index) => ({
        y: worked,
        percentage,
        x: index,
        organization: role.organization,
        project: role.project,
        role: role.role
      })),
      backgroundColor: barTokenColor,
      borderColor: barTokenColor
    }
  })

  const data = {
    labels,
    datasets: [recommendedDataset, vacationsDataset, ...rolesDataset]
  }

  return (
    <>
      <Wrap align="center" spacing={8} className={styles['legend-container']}>
        {data.datasets.map((dataset, index) => {
          const labels = Array.isArray(dataset.label) ? dataset.label : [dataset.label]
          const totalSum = dataset.data.reduce((acc: number, data) => acc + data.y, 0)
          const total = getDurationByHours(totalSum, settings.useDecimalTimeFormat)
          return (
            <WrapItem key={index}>
              <LegendItem color={dataset.backgroundColor} labels={labels} total={total} />
            </WrapItem>
          )
        })}
      </Wrap>

      <Box className={styles['chart-container']}>
        <Chart data={data} options={chartOptions} />
      </Box>
    </>
  )
}
