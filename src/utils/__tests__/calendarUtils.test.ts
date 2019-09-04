import {
  firstDayOfFirstWeekOfMonth,
  formatDateForRequest,
  getDatesIntervalByMonth,
  lastDayOfLastWeekOfMonth
} from "utils/calendarUtils";
import { getDate, isSameDay, isSunday, parseISO } from "date-fns";

describe("Calendar utilities test", () => {
  it("should get first date of the first week of the month", function() {
    const date = parseISO("2019-09-10");
    const firstDateOfFirstWeekOfMonth = parseISO("2019-08-26");
    const result = firstDayOfFirstWeekOfMonth(date);
    expect(isSameDay(result, firstDateOfFirstWeekOfMonth)).toBeTruthy();
  });

  it("should get last date of the last week of the month", function() {
    const date = parseISO("2019-09-10");
    const lastDateOfLastWeekOfMonth = parseISO("2019-10-06");
    const result = lastDayOfLastWeekOfMonth(date);
    expect(isSameDay(result, lastDateOfLastWeekOfMonth)).toBeTruthy();
  });

  it("should get all dates of the month with the whole weeks", function() {
    const date = parseISO("2019-09-10");
    const result = getDatesIntervalByMonth(date);
    expect(result.length).toBe(42);
  });

  it("should format the date correctly", function() {
    const date = parseISO("2019-09-10");
    const result = formatDateForRequest(date);
    expect(result).toBe("2019-09-10");
  });
});
