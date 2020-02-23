import {fetchClient} from "services/FetchClient"
import {HOLIDAYS_ENDPOINT} from "services/endpoints"
import {formatDateForQuery} from "utils/DateUtils"
import {IHolidaysResponse} from "interfaces/IHolidays"
import {parseISO} from "date-fns"
import produce from "immer"

export const getHolidaysBetweenDate = async (
  startDate: Date,
  endDate: Date
) => {
  const response = await fetchClient
    .get(HOLIDAYS_ENDPOINT, {
      searchParams: {
        startDate: formatDateForQuery(startDate),
        endDate: formatDateForQuery(endDate)
      }
    })
    .json<IHolidaysResponse>();

  return transformDTO(response);
};

const transformDTO = (response: IHolidaysResponse) => {
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
