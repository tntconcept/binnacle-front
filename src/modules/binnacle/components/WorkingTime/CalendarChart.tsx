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
import { Chart } from 'react-chartjs-2'

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

const labels = [
  ['January', '80h'],
  ['February', '120h'],
  ['March', '30h'],
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

const totalHours = (tooltipItems) => {
  let sum = 0

  tooltipItems.forEach(function (tooltipItem) {
    if (tooltipItem.dataset.type !== 'line') sum += tooltipItem.parsed.y
  })
  return 'Total: ' + sum
}

const options = {
  interaction: {
    mode: 'index',
    intersect: false
  },
  plugins: {
    tooltip: {
      callbacks: {
        footer: totalHours
      }
    }
  },
  responsive: true,
  scales: {
    x: {
      stacked: true
    },
    y: {
      stacked: true,
      suggestedMax: 180
    }
  },
  maintainAspectRatio: false,
  layout: {
    padding: {
      bottom: 50
    }
  }
}

const plugin = {
  id: 'increase-legend-spacing',
  beforeInit(chart: any) {
    // Get reference to the original fit function
    const originalFit = chart.legend.fit

    // Override the fit function
    chart.legend.fit = function fit() {
      // Call original function and bind scope in order to use `this` correctly inside it
      originalFit.bind(chart.legend)()
      // Change the height as suggested in another answers
      this.height += 20
    }
  }
}

export const data = {
  labels,
  datasets: [
    {
      type: 'line' as const,
      label: 'Target',
      borderColor: 'rgb(255, 99, 132)',
      fill: false,
      data: [140, 130, 140, 160, 130, 150, 130, 150, 160, 140, 150, 100]
    },
    {
      type: 'bar' as const,
      label: 'Nuestra empresa - Vacaciones - Vacaciones',
      backgroundColor: 'rgb(75, 192, 192)',
      data: [50, 120],
      borderColor: 'white'
    },
    {
      type: 'bar' as const,
      label:
        'Digital55 (Lextrend Information Technologies, SL) - Consultoria Angular - Consultor  ',
      backgroundColor: 'rgb(53, 162, 235)',
      data: [50, 30, 20]
    }
  ]
}

export function CalendarChart() {
  return (
    <Chart plugins={[plugin]} type="bar" data={data} options={options} width={100} height={500} />
  )
}
