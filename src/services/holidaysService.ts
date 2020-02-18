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
  return await fetchClient
    .url(HOLIDAYS_ENDPOINT)
    .query({
      startDate: formatDateForQuery(startDate),
      endDate: formatDateForQuery(endDate)
    })
    .get()
    .json(response => {
      const responseParsed = produce(
        response as IHolidaysResponse,
        draftState => {
          draftState.publicHolidays = draftState.publicHolidays.map(
            holiday => ({
              ...holiday,
              date: parseISO((holiday.date as unknown) as string)
            })
          );
          draftState.privateHolidays = draftState.privateHolidays.map(
            holiday => ({
              ...holiday,
              days: holiday.days.map(date =>
                parseISO((date as unknown) as string)
              )
            })
          );
        }
      );

      return responseParsed;
    });
};
