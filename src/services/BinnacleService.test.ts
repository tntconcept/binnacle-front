import {fetchBinnacleData, fetchTimeBalanceByMonth, fetchTimeBalanceByYear} from "services/BinnacleService"
import fetchMock from 'fetch-mock/es5/client'
import {IActivityDay} from "api/interfaces/IActivity"
import {IHolidaysResponse} from "api/interfaces/IHolidays"
import {ITimeBalanceResponse} from "api/interfaces/ITimeBalance"
import endpoints from "api/endpoints"

describe("Binnacle Service", () => {
  const month = new Date(2019, 0, 10);

  const activitiesDate: IActivityDay[] = [
    {
      activities: [],
      workedMinutes: 0,
      date: new Date(2019, 1, 20)
    }
  ];

  const holidaysResponse: IHolidaysResponse = {
    publicHolidays: [],
    privateHolidays: []
  };

  const timeBalance: ITimeBalanceResponse = {
    "1": {
      timeDifference: -100,
      timeToWork: 100,
      timeWorked: 0
    }
  };

  afterEach(fetchMock.reset)

  it("should fetch all binnacle data correctly", async () => {
    fetchMock
      .getOnce("path:/" + endpoints.activities, activitiesDate)
      .getOnce("path:/" + endpoints.holidays, holidaysResponse)
      .getOnce("path:/" + endpoints.timeBalance, timeBalance)
      .getOnce("path:/" + endpoints.recentProjectRoles, []);

    const dispatch = jest.fn();
    const isTimeCalculatedByYear = false;

    await fetchBinnacleData(month, isTimeCalculatedByYear, dispatch);

    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        loadingData: true
      })
    );
    expect(dispatch).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        activities: activitiesDate,
        holidays: holidaysResponse,
        timeBalance: timeBalance["1"],
        recentRoles: []
      })
    );

  });

  it("should dispatch fetch failed when any request fails", async () => {
    fetchMock
      .getOnce("path:/" + endpoints.activities, activitiesDate)
      .getOnce("path:/" + endpoints.holidays, 400)

    const dispatch = jest.fn();
    const isTimeCalculatedByYear = false;

    await expect(
      fetchBinnacleData(month, isTimeCalculatedByYear, dispatch)
    ).rejects.toMatchInlineSnapshot(`[HTTPError: Bad Request]`);

    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        loadingData: true
      })
    );
    expect(dispatch).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        error: expect.any(Error)
      })
    );
  });

  it("should fetch time balance by YEAR", async () => {
    fetchMock.get("path:/" + endpoints.timeBalance, timeBalance)

    const dispatch = jest.fn();

    await fetchTimeBalanceByYear(month, dispatch);

    // Calls two times change loading state of time balance
    expect(dispatch).toHaveBeenCalledTimes(2);

    expect(dispatch).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        loadingTimeBalance: true
      })
    );
    expect(dispatch).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        isCalculatedByYear: true,
        timeBalance: {
          timeWorked: timeBalance[1].timeWorked,
          timeToWork: timeBalance[1].timeToWork,
          differenceInMinutes: -100
        }
      })
    );
  });

  it("should throw error when fetching time by YEAR fails", async () => {
    fetchMock.getOnce("path:/" + endpoints.timeBalance, 400);

    const dispatch = jest.fn();

    await expect(
      fetchTimeBalanceByYear(month, dispatch)
    ).rejects.toMatchInlineSnapshot(`[HTTPError: Bad Request]`);

    // Calls two times change loading state of time balance
    expect(dispatch).toHaveBeenCalledTimes(2);
  });

  it("should fetch time balance by MONTH", async () => {
    fetchMock.getOnce("path:/" + endpoints.timeBalance, timeBalance);

    const dispatch = jest.fn();

    await fetchTimeBalanceByMonth(month, dispatch);

    // Calls two times change loading state of time balance
    expect(dispatch).toHaveBeenCalledTimes(3);

    expect(dispatch).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        loadingTimeBalance: true
      })
    );
    expect(dispatch).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        isCalculatedByYear: false,
        timeBalance: {
          timeWorked: timeBalance[1].timeWorked,
          timeToWork: timeBalance[1].timeToWork,
          differenceInMinutes: -100
        }
      })
    );
  });

  it("should throw error when fetching time by MONTH fails", async () => {
    fetchMock.getOnce("path:/" + endpoints.timeBalance, 400);

    const dispatch = jest.fn();

    await expect(
      fetchTimeBalanceByMonth(month, dispatch)
    ).rejects.toMatchInlineSnapshot(`[HTTPError: Bad Request]`);

    // Calls two times change loading state of time balance
    expect(dispatch).toHaveBeenCalledTimes(2);
  });
});
