import httpClient from "api/HttpClient"
import {formatDateForQuery} from "utils/DateUtils"
import {IHolidaysResponse} from "api/interfaces/IHolidays"
import {parseISO} from "date-fns"
import produce from "immer"
import endpoints from "api/endpoints"

export const getHolidaysBetweenDate = async (
  startDate: Date,
  endDate: Date
) => {
  const response = await httpClient
    .get(endpoints.holidays, {
      searchParams: {
        startDate: formatDateForQuery(startDate),
        endDate: formatDateForQuery(endDate)
      }
    })
    .json<IHolidaysResponse>();

  return holidaysMapper(response);
};

const holidaysMapper = (response: IHolidaysResponse) => {
  return produce(response, draftState => {
    draftState.publicHolidays = draftState.publicHolidays.map(holiday => ({
      ...holiday,
      date: parseISO((holiday.date as unknown) as string)
    }));
    draftState.privateHolidays = draftState.privateHolidays.map(holiday => ({
      ...holiday,
      days: holiday.days.map(date => parseISO((date as unknown) as string))
    }));
  });
};
