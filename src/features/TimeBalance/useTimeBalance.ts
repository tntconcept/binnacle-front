// @ts-ignore
import {unstable_useTransition as useTransition} from "react"
import {useCalendarResources} from "core/contexts/CalendarResourcesContext"
import {suspenseConfig} from "utils/config"

const useTimeBalance = () => {
  const { fetchTimeResource, timeBalanceMode } = useCalendarResources();
  const [startTransition, isPending] = useTransition(suspenseConfig)

  const handleSelect = (event: any) => {
    const optionSelected = event.target.value;

    if (optionSelected === "by_month") {
      startTransition(() => {
        fetchTimeResource("by_month")
      })
    } else {
      startTransition(() => {
        fetchTimeResource("by_year")
      })
    }
  };

  return {
    selectedBalance: timeBalanceMode,
    handleSelect,
    isPending
  };
};

export default useTimeBalance;
