import React from "react";
import { ITimeTracker } from "../../../services/timeTrackingService";

interface TimeStats {
  timeStats: ITimeTracker;
  updateTimeStats: (newTimeStats: ITimeTracker) => void;
}

export const TimeStatsContext = React.createContext<TimeStats | undefined>(
  undefined
);
