import {Dispatch, useContext, useState} from "react"
import {TBinnacleActions} from "core/contexts/BinnacleContext/binnacleActions"
import {NotificationsContext} from "core/contexts/NotificationsContext"
import {fetchTimeBalanceByMonth, fetchTimeBalanceByYear} from "core/contexts/BinnacleContext/binnacleService"

const useTimeBalance = (month: Date, dispatch: Dispatch<TBinnacleActions>) => {
  const addNotification = useContext(NotificationsContext)
  const [selectedBalance, setBalance] = useState<"by_month" | "by_year">("by_month")

  const handleBalanceByYear = () => {
    return fetchTimeBalanceByYear(month, dispatch)
      .catch(error => addNotification(error))
  }

  const handleBalanceByMonth = () => {
    fetchTimeBalanceByMonth(month, dispatch)
      .catch(error => {
        addNotification(error)
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