// @ts-ignore
import {unstable_useTransition as useTransition, useState} from "react"
import {useCalendarResources} from "core/contexts/CalendarResourcesContext"
import {suspenseConfig} from "utils/config"

const useTimeBalance = () => {
  const { fetchTimeResource } = useCalendarResources();
  const [selectedBalance, setBalance] = useState<"by_month" | "by_year">();
  const [startTransition, isPending] = useTransition(suspenseConfig)

  const handleSelect = (event: any) => {
    const optionSelected = event.target.value;

    if (optionSelected === "by_month") {
      startTransition(() => {
        fetchTimeResource("by_month")
        setBalance(optionSelected);
      })
    } else {
      startTransition(() => {
        fetchTimeResource("by_year")
        setBalance(optionSelected);
      })
    }
  };

  return {
    selectedBalance,
    handleSelect,
    isPending
  };
};

export default useTimeBalance;
