import React from "react";

interface SelectedMonth {
  selectedMonth: Date;
  changeSelectedMonth: (newMonth: Date) => Promise<void>;
}

export const SelectedMonthContext = React.createContext<
  SelectedMonth | undefined
>(undefined);
