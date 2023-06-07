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
import { YearBalance } from 'features/binnacle/features/activity/domain/year-balance'
import { getDurationByHours } from 'features/binnacle/features/activity/utils/getDuration'
import { useMemo } from 'react'
import { Chart } from 'react-chartjs-2'
import { useTranslation } from 'react-i18next'
import { getMonthNames } from 'shared/utils/chrono'
import { useCalendarContext } from '../../../contexts/calendar-context'
import { LegendItem } from './legend-item'
import { YearBalanceDatasetData } from './types/dataset-data'
import { TooltipItem } from './types/tooltip-item'
import { TooltipLabelContext } from './types/tooltip-label-context'
import { getTooltipAfterBody, getTooltipLabel, getTooltipTitle } from './utils/tooltip-callbacks'
import styles from './year-balance-chart.module.css'

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

export const YearBalanceChart: React.FC<{ yearBalance: YearBalance }> = ({ yearBalance }) => {
  const { t } = useTranslation()
  const monthNames = getMonthNames()
  const { shouldUseDecimalTimeFormat } = useCalendarContext()

  const recommendedColor = useToken('colors', useColorModeValue('black', 'white'))
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

  const labels = useMemo(
    () =>
      yearBalance.months.map((month, index) => {
        return [monthNames[index], getDurationByHours(month.total, shouldUseDecimalTimeFormat)]
      }),
    [shouldUseDecimalTimeFormat]
  )

  const maxRecommendedValue = yearBalance.months.reduce(
    (prev, { recommended, worked }) =>
      Math.max(recommended, worked) > prev ? Math.max(recommended, worked) : prev,
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
          title: getTooltipTitle,
          label: (context: TooltipLabelContext) =>
            getTooltipLabel(context, shouldUseDecimalTimeFormat),
          afterBody: (tooltipItems: TooltipItem[]) =>
            getTooltipAfterBody(tooltipItems, yearBalance, shouldUseDecimalTimeFormat)
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
    label: t('time_tracking.monthly_recommendation'),
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
    data: vacations.map(({ hours, percentage }, index) => ({
      y: hours,
      x: index,
      percentage,
      isVacation: true
    }))
  }

  const rolesDataset = yearBalance.roles.map((role, index) => {
    const colorIndex = index % barColors.length
    const barTokenColor = barColors[colorIndex]
    return {
      type: 'bar',
      label: [role.organization, role.project, role.role],
      data: role.months.map(({ hours, percentage }, index) => ({
        y: hours,
        percentage,
        x: index,
        organization: role.organization,
        project: role.project,
        role: role.role,
        isVacation: false
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
      <Box className={styles['chart-container']}>
        <Chart data={data as any} options={chartOptions as any} type="bar" />
      </Box>

      <Wrap
        display="flex"
        justifyContent="center"
        spacing={8}
        className={styles['legend-container']}
      >
        {data.datasets.map((dataset, index) => {
          const labels = Array.isArray(dataset.label) ? dataset.label : [dataset.label]
          const totalSum = (dataset.data as YearBalanceDatasetData[]).reduce(
            (acc: number, data) => acc + data.y,
            0
          )
          const isRecommendedDataset = dataset.type === 'line'
          const total = isRecommendedDataset
            ? ''
            : getDurationByHours(totalSum, shouldUseDecimalTimeFormat)

          return (
            <WrapItem key={index} alignItems="center">
              <LegendItem color={dataset.backgroundColor} labels={labels} total={total} />
            </WrapItem>
          )
        })}
      </Wrap>
    </>
  )
}
