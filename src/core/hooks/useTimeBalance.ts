import {useContext, useEffect, useState} from "react"
import {NotificationsContext} from "core/contexts/NotificationsContext"
import {fetchTimeBalanceByMonth, fetchTimeBalanceByYear} from "services/BinnacleService"
import {BinnacleDataContext} from "core/contexts/BinnacleContext/BinnacleDataProvider"
import {isSameMonth} from "date-fns"

const useTimeBalance = () => {
  const showNotification = useContext(NotificationsContext)
  const {state, dispatch} = useContext(BinnacleDataContext)
  const [selectedBalance, setBalance] = useState<"by_month" | "by_year">()

  useEffect(() => {
    if (!isSameMonth(new Date(), state.month)) {
      setBalance("by_month")
    }
  }, [state.month])


  const handleBalanceByYear = () => {
    return fetchTimeBalanceByYear(state.month, dispatch)
      .catch(error => showNotification(error))
  }

  const handleBalanceByMonth = () => {
    fetchTimeBalanceByMonth(state.month, dispatch)
      .catch(error => {
        showNotification(error)
      })
  }

  const handleSelect = (event: any) => {
    const optionSelected = event.target.value
    setBalance(optionSelected)

    if (optionSelected === "by_month") {
      handleBalanceByMonth()
    } else {
      handleBalanceByYear()
        .catch(() => setBalance("by_month"))
    }
  }

  return {
    selectedBalance,
    handleSelect
  }
}

export default useTimeBalance
