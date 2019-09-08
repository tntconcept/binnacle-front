import React from "react";
import { IHolidayResponse } from "services/holidaysService";
import { IActivityResponse } from "services/activitiesService";

export interface CalendarInfo {
  activities: IActivityResponse[];
  holidays: IHolidayResponse;
}

interface CalendarData {
  calendarData: CalendarInfo;
  updateCalendarData: (newCalendarData: CalendarInfo) => void;
}

export const CalendarDataContext = React.createContext<
  CalendarData | undefined
>(undefined);
