// @ts-ignore
import {unstable_useTransition as useTransition} from "react"
import {useBinnacleResources} from "features/BinnacleResourcesProvider"
import {SUSPENSE_CONFIG} from "utils/constants"

const useTimeBalance = () => {
  const { fetchTimeResource, timeBalanceMode } = useBinnacleResources();
  const [startTransition, isPending] = useTransition(SUSPENSE_CONFIG)

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
