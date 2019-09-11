import React from "react";
import { fireEvent, render } from "@testing-library/react";
import DesktopTimeStatsLayout from "desktop/layouts/calendar/DesktopTimeStatsLayout";
import { axiosMock } from "utils/testing";
import { NotificationsProvider } from "core/contexts/NotificationsContext";
import { SelectedMonthContext } from "core/contexts/BinnaclePageContexts/SelectedMonthContext";
import DesktopCalendarControlsLayout from "desktop/layouts/calendar/DesktopCalendarControlsLayout";
import { TimeStatsContext } from "core/contexts/BinnaclePageContexts/TimeStatsContext";
import mockDate from "mockdate";
import { TIME_TRACKER_ENDPOINT } from "services/endpoints";
import { buildTimeStatsResponse } from "utils/testing/mocks";

const mockAxiosError = (statusCode: number) =>
  ({
    response: {
      status: statusCode
    }
  } as any);

const wrapperSuccess: React.FC = props => {
  return (
    <NotificationsProvider>
      <SelectedMonthContext.Provider
        value={{
          selectedMonth: new Date(),
          changeSelectedMonth: jest.fn().mockResolvedValue({})
        }}
      >
        <TimeStatsContext.Provider
          value={{
            timeStats: ({} as unknown) as any,
            updateTimeStats: updateTimeStatsMock
          }}
        >
          {props.children}
        </TimeStatsContext.Provider>
      </SelectedMonthContext.Provider>
    </NotificationsProvider>
  );
};

const updateTimeStatsMock = jest.fn();

describe("Time Stats Layout", () => {
  beforeAll(() => {
    mockDate.set("2019-09-09 14:00:00");
  });

  afterAll(() => {
    axiosMock.reset();
    mockDate.reset();
  });

  it("should fetch correctly by month", async () => {
    axiosMock
      .onGet(TIME_TRACKER_ENDPOINT, {
        params: {
          startDate: "2019-09-01",
          endDate: "2019-09-09"
        }
      })
      .replyOnce(200, buildTimeStatsResponse());

    const result = render(<DesktopTimeStatsLayout />, {
      wrapper: wrapperSuccess
    });

    fireEvent.click(result.getByTestId("balance_by_month_button"));

    expect(result.getByTestId("time_balance_value")).toHaveTextContent(
      "Loading..."
    );

    expect(
      await result.findByTestId("time_balance_value")
    ).not.toHaveTextContent("Loading...");

    expect(updateTimeStatsMock).toHaveBeenCalled();
  });

  it("should fetch correctly by month", async () => {
    axiosMock
      .onGet(TIME_TRACKER_ENDPOINT, {
        params: {
          startDate: "2019-01-01",
          endDate: "2019-09-09"
        }
      })
      .replyOnce(200, buildTimeStatsResponse());

    const result = render(<DesktopTimeStatsLayout />, {
      wrapper: wrapperSuccess
    });

    fireEvent.click(result.getByTestId("balance_by_year_button"));

    expect(result.getByTestId("time_balance_value")).toHaveTextContent(
      "Loading..."
    );

    expect(
      await result.findByTestId("time_balance_value")
    ).not.toHaveTextContent("Loading...");

    expect(updateTimeStatsMock).toHaveBeenCalled();
  });
});
