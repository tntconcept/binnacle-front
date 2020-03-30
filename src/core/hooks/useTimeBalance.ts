import {Dispatch, useContext, useState} from "react"
import {TBinnacleActions} from "core/contexts/BinnacleContext/BinnacleActions"
import {NotificationsContext} from "core/contexts/NotificationsContext"
import {fetchTimeBalanceByMonth, fetchTimeBalanceByYear} from "services/BinnacleService"

const useTimeBalance = (month: Date, dispatch: Dispatch<TBinnacleActions>) => {
  const showNotification = useContext(NotificationsContext)
  const [selectedBalance, setBalance] = useState<"by_month" | "by_year">("by_month")

  const handleBalanceByYear = () => {
    return fetchTimeBalanceByYear(month, dispatch)
      .catch(error => showNotification(error))
  }

  const handleBalanceByMonth = () => {
    fetchTimeBalanceByMonth(month, dispatch)
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
