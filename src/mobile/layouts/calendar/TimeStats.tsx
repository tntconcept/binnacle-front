import React from "react"

interface ITimeStats {
  timeBalance: any;
}

// Works, tiene la misma referencia y no se renderiza mas
export const TimeStats: React.FC<ITimeStats> = React.memo(props => {
  console.count("Time Stats")
  return <div>Time Stats</div>
})