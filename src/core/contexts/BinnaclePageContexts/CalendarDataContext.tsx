import React from "react";
import { IHolidayResponse } from "services/holidaysService";
import { IActivityDay } from "services/activitiesService";

export interface CalendarInfo {
  activities: IActivityDay[];
  holidays: IHolidayResponse;
}

interface CalendarData {
  calendarData: CalendarInfo;
  updateCalendarData: (newCalendarData: CalendarInfo) => void;
}

export const CalendarDataContext = React.createContext<
  CalendarData | undefined
>(undefined);
