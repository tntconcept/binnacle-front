import {
  fetchBinnacleData,
  fetchTimeBalanceByMonth,
  fetchTimeBalanceByYear
} from "core/contexts/BinnacleContext/binnacleService"
// @ts-ignore
import fetchMock from "fetch-mock/es5/client"
import {IActivityDay} from "interfaces/IActivity"
import {IHolidaysResponse} from "interfaces/IHolidays"
import {ITimeTrackerResponse} from "interfaces/ITimeTracker"
import {
  ACTIVITIES_ENDPOINT,
  FREQUENT_ROLES_ENDPOINT,
  HOLIDAYS_ENDPOINT,
  TIME_TRACKER_ENDPOINT
} from "services/endpoints"

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

  const timeBalance: ITimeTrackerResponse = {
    "1": {
      differenceInMinutes: -100,
      minutesToWork: 100,
      minutesWorked: 0
    }
  };

  beforeEach(fetchMock.restore);

  it("should fetch all binnacle data correctly", async () => {
    fetchMock
      .getOnce("path:/" + ACTIVITIES_ENDPOINT, activitiesDate)
      .getOnce("path:/" + HOLIDAYS_ENDPOINT, holidaysResponse)
      .getOnce("path:/" + TIME_TRACKER_ENDPOINT, timeBalance)
      .getOnce("path:/" + FREQUENT_ROLES_ENDPOINT, [])

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
      .getOnce("path:/" + ACTIVITIES_ENDPOINT, activitiesDate)
      .getOnce("path:/" + HOLIDAYS_ENDPOINT, 400)
      .getOnce("path:/" + TIME_TRACKER_ENDPOINT, timeBalance)
      .getOnce("path:/" + FREQUENT_ROLES_ENDPOINT, [])

    const dispatch = jest.fn();
    const isTimeCalculatedByYear = false;

    await expect(
      fetchBinnacleData(month, isTimeCalculatedByYear, dispatch)
    ).rejects.toMatchInlineSnapshot(
      `[Error: Request failed with status code 400]`
    );

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

  it('should fetch time balance by YEAR', async () => {
    fetchMock.getOnce("path:/" + TIME_TRACKER_ENDPOINT, timeBalance);

    const dispatch = jest.fn();

    await fetchTimeBalanceByYear(month, dispatch)

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
        isCalculatedByYear: true,
        timeBalance: {
          minutesWorked: timeBalance[1].minutesWorked,
          minutesToWork: timeBalance[1].minutesToWork,
          differenceInMinutes: -100
        }
      })
    );
  })

  it('should throw error when fetching time by YEAR fails', async () => {
    fetchMock.getOnce("path:/" + TIME_TRACKER_ENDPOINT, 400);

    const dispatch = jest.fn();

    await expect(
      fetchTimeBalanceByYear(month, dispatch)
    ).rejects.toMatchInlineSnapshot(
      `[Error: Request failed with status code 400]`
    );

    // Calls two times change loading state of time balance
    expect(dispatch).toHaveBeenCalledTimes(2);
  })

  it('should fetch time balance by MONTH', async () => {
    fetchMock.getOnce("path:/" + TIME_TRACKER_ENDPOINT, timeBalance);

    const dispatch = jest.fn();

    await fetchTimeBalanceByMonth(month, dispatch)

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
          minutesWorked: timeBalance[1].minutesWorked,
          minutesToWork: timeBalance[1].minutesToWork,
          differenceInMinutes: -100
        }
      })
    );
  })

  it('should throw error when fetching time by MONTH fails', async () => {
    fetchMock.getOnce("path:/" + TIME_TRACKER_ENDPOINT, 400);

    const dispatch = jest.fn();

    await expect(
      fetchTimeBalanceByMonth(month, dispatch)
    ).rejects.toMatchInlineSnapshot(
      `[Error: Request failed with status code 400]`
    );

    // Calls two times change loading state of time balance
    expect(dispatch).toHaveBeenCalledTimes(2);
  })
});
