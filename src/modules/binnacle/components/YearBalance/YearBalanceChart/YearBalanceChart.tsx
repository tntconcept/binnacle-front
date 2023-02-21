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
import { getMonthNames } from 'shared/utils/chrono'
import { LegendItem } from './LegendItem'
import { YearBalanceDatasetData } from './types/dataset-data'
import { TooltipItem } from './types/tooltip-item'
import { TooltipLabelContext } from './types/tooltip-label-context'
import { getTooltipAfterBody, getTooltipLabel, getTooltipTitle } from './utils/tooltip-callbacks'
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

export const YearBalanceChart: React.FC<{ yearBalance: YearBalance }> = ({ yearBalance }) => {
  const { t } = useTranslation()
  const { settings } = useGlobalState(SettingsState)
  const monthNames = getMonthNames()

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
    return [monthNames[index], getDurationByHours(month.total, settings.useDecimalTimeFormat)]
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
          title: getTooltipTitle,
          label: (context: TooltipLabelContext) => getTooltipLabel(context, settings),
          afterBody: (tooltipItems: TooltipItem[]) =>
            getTooltipAfterBody(tooltipItems, yearBalance, settings)
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
      <Wrap align="center" spacing={8} className={styles['legend-container']}>
        {data.datasets.map((dataset, index) => {
          const labels = Array.isArray(dataset.label) ? dataset.label : [dataset.label]
          const totalSum = (dataset.data as YearBalanceDatasetData[]).reduce(
            (acc: number, data) => acc + data.y,
            0
          )
          const total = getDurationByHours(totalSum, settings.useDecimalTimeFormat)
          return (
            <WrapItem key={index}>
              <LegendItem color={dataset.backgroundColor} labels={labels} total={total} />
            </WrapItem>
          )
        })}
      </Wrap>

      <Box className={styles['chart-container']}>
        <Chart data={data as any} options={chartOptions as any} type="bar" />
      </Box>
    </>
  )
}
