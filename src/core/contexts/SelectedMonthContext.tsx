import React, { useState } from "react";

interface SelectedMonth {
  selectedMonth: Date;
  changeSelectedMonth: (newMonth: Date) => void;
}

export const SelectedMonthContext = React.createContext<SelectedMonth>({
  selectedMonth: new Date(),
  changeSelectedMonth(newMonth: Date) {
    throw Error("changeSelectedMonth() not implemented");
  }
});

export const SelectedMonthProvider: React.FC = props => {
  const [selectedMonth, changeSelectedMonth] = useState(new Date());
  return (
    <SelectedMonthContext.Provider
      value={{
        selectedMonth,
        changeSelectedMonth
      }}
    >
      {props.children}
    </SelectedMonthContext.Provider>
  );
};
