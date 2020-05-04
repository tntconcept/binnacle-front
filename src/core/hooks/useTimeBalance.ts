import {useState} from "react"
import {useCalendarResources} from "pages/binnacle/desktop/CalendarResourcesContext"

const useTimeBalance = () => {
  const { selectedMonth, fetchTimeResource } = useCalendarResources();
  const [selectedBalance, setBalance] = useState<"by_month" | "by_year">();

  // useEffect(() => {
  //   if (!isSameMonth(new Date(), selectedMonth)) {
  //     setBalance("by_month");
  //   }
  // }, [selectedMonth]);

  const handleSelect = (event: any) => {
    const optionSelected = event.target.value;
    setBalance(optionSelected);

    if (optionSelected === "by_month") {
      fetchTimeResource("by_month");
    } else {
      fetchTimeResource("by_year");
    }
  };

  return {
    selectedBalance,
    handleSelect
  };
};

export default useTimeBalance;
