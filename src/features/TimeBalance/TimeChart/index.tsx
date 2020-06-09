import React from 'react'
import {
  Bar as RBar,
  BarChart,
  CartesianGrid,
  LabelList,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const data = [
  {
    "month": "Jan",
    "minutesToWork": 120,
    "minutesWorked": 122
  },
  {
    "month": "Feb",
    "minutesToWork": 150,
    "minutesWorked": 155
  },
  {
    "month": "Mar",
    "minutesToWork": 160,
    "minutesWorked": 160
  },
  {
    "month": "Apr",
    "minutesToWork": 170,
    "minutesWorked": 170
  },
  {
    "month": "May",
    "minutesToWork": 120,
    "minutesWorked": 122
  },
  {
    "month": "Jun",
    "minutesToWork": 150,
    "minutesWorked": 155
  },
  {
    "month": "Jul",
    "minutesToWork": 160,
    "minutesWorked": 160
  },
  {
    "month": "Aug",
    "minutesToWork": 170,
    "minutesWorked": 170
  },
  {
    "month": "Sept",
    "minutesToWork": 120,
    "minutesWorked": 122
  },
  {
    "month": "Oct",
    "minutesToWork": 150,
    "minutesWorked": 155
  },
  {
    "month": "Nov",
    "minutesToWork": 160,
    "minutesWorked": 160
  },
  {
    "month": "Dec",
    "minutesToWork": 170,
    "minutesWorked": 170
  }
]

const TimeChartRecharts = () => {
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", height: "100%" }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{ top: 25, right: 25, bottom: 25, left: 0 }}
          layout='vertical'
        >
          <Legend align='center' verticalAlign='top'/>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number"/>
          <YAxis type="category" dataKey="month" />
          <Tooltip />
          <RBar dataKey="minutesToWork" fill="#8884d8">
            <LabelList dataKey="minutesToWork" position="insideRight" />
          </RBar>
          <RBar dataKey="minutesWorked" fill="#82ca9d">
            <LabelList dataKey="minutesWorked" position="insideRight" />
          </RBar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default TimeChartRecharts
