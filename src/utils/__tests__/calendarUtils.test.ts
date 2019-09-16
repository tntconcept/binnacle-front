import {
  customRelativeFormat,
  firstDayOfFirstWeekOfMonth,
  formatDateForRequest,
  getDatesIntervalByMonth,
  lastDayOfLastWeekOfMonth
} from "utils/calendarUtils";
import {
  formatDistance,
  formatRelative,
  getDate,
  isSameDay,
  isSunday,
  parseISO
} from "date-fns";
import mockDate from "mockdate";
import getErrorMessage from "utils/apiErrorMessage";
import { AxiosError } from "axios";

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

  it("should format relative as expected", function() {
    mockDate.set("2019-09-10 14:00:00");
    const relativeText = customRelativeFormat(parseISO("2019-09-10"));

    expect(relativeText).toBe("Sep, Today");

    mockDate.reset();
  });

  test.only.each`
    date            | result
    ${"2019-09-10"} | ${"Sep, Today"}
    ${"2019-09-09"} | ${"Sep, Yesterday"}
    ${"2019-09-08"} | ${"Sep, Last Sunday"}
    ${"2019-09-01"} | ${"Sep, 01"}
    ${"2019-09-11"} | ${"Sep, Tomorrow"}
    ${"2019-09-16"} | ${"Sep, Next Monday"}
    ${"2019-10-01"} | ${"Oct, 01"}
  `("relative format for $date is $result", ({ date, result }) => {
  mockDate.set("2019-09-10 14:00:00");
  const relativeText = customRelativeFormat(parseISO(date));

  expect(relativeText).toBe(result);

  mockDate.reset();
});
});
