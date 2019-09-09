import React from "react";
import { NotificationsProvider } from "core/contexts/NotificationsContext";
import { render, waitForDomChange, fireEvent } from "@testing-library/react";
import BinnaclePage from "pages/binnacle/BinnaclePage";
import { axiosMock } from "utils/testing";
import mockDate from "mockdate";
import {
  ACTIVITIES_ENDPOINT,
  TIME_TRACKER_ENDPOINT,
  HOLIDAYS_ENDPOINT
} from "services/endpoints";
import {
  buildActivitiesResponse,
  buildHolidaysResponse,
  buildTimeStatsResponse
} from "utils/testing/mocks";

const activitiesResponse = buildActivitiesResponse();
const timeStatsResponse = buildTimeStatsResponse();

const Wrapper: React.FC = ({ children }) => {
  return <NotificationsProvider>{children}</NotificationsProvider>;
};

describe("Binnacle Page", () => {
  beforeAll(() => {
    mockDate.set("2019-09-09 14:00:00");
  });

  afterAll(() => {
    axiosMock.reset();
    mockDate.reset();
  });

  // TODO CHECK VACATIONS, HOLIDAYS, TIME IMPUTED BY DAY, AND YOU DONT HAVE ANY ACTIVITIES MESSAGE
  it("should render correctly on mount", async () => {
    axiosMock
      .onGet(ACTIVITIES_ENDPOINT, {
        params: {
          startDate: "2019-08-26",
          endDate: "2019-10-06"
        }
      })
      .reply(200, buildActivitiesResponse());
    axiosMock
      .onGet(HOLIDAYS_ENDPOINT, {
        params: {
          startDate: "2019-08-26",
          endDate: "2019-10-06"
        }
      })
      .reply(200, buildHolidaysResponse());
    axiosMock
      .onGet(TIME_TRACKER_ENDPOINT, {
        params: {
          startDate: "2019-09-01",
          endDate: "2019-09-09"
        }
      })
      .reply(200, buildTimeStatsResponse());

    const result = render(<BinnaclePage />, { wrapper: Wrapper });

    await waitForDomChange();

    expect(result.getByTestId("time_balance_value")).toHaveTextContent(
      timeStatsResponse[9].differenceInMinutes.toString()
    );

    expect(result.getByTestId("selected_date")).toHaveTextContent(
      "September 2019"
    );

    // shows the prev month days and next month days
    expect(result.getByText("26 August")).toBeInTheDocument();
    expect(result.getByText("6 October")).toBeInTheDocument();

    // shows an activity description
    expect(result.getByText("11:00 - 12:00")).toBeInTheDocument();
  });

  it("should change month correctly", async () => {
    axiosMock
      .onGet(ACTIVITIES_ENDPOINT, {
        params: {
          startDate: "2019-08-26",
          endDate: "2019-10-06"
        }
      })
      .replyOnce(200, buildActivitiesResponse());
    axiosMock
      .onGet(HOLIDAYS_ENDPOINT, {
        params: {
          startDate: "2019-08-26",
          endDate: "2019-10-06"
        }
      })
      .replyOnce(200, buildHolidaysResponse());
    axiosMock
      .onGet(TIME_TRACKER_ENDPOINT, {
        params: {
          startDate: "2019-09-01",
          endDate: "2019-09-09"
        }
      })
      .replyOnce(200, buildTimeStatsResponse());

    const result = render(<BinnaclePage />, { wrapper: Wrapper });

    await waitForDomChange();

    axiosMock
      .onGet(ACTIVITIES_ENDPOINT, {
        params: {
          startDate: "2019-09-30",
          endDate: "2019-11-03"
        }
      })
      .replyOnce(200, buildActivitiesResponse());
    axiosMock
      .onGet(HOLIDAYS_ENDPOINT, {
        params: {
          startDate: "2019-09-30",
          endDate: "2019-11-03"
        }
      })
      .replyOnce(200, buildHolidaysResponse());
    axiosMock
      .onGet(TIME_TRACKER_ENDPOINT, {
        params: {
          startDate: "2019-10-01",
          endDate: "2019-10-31"
        }
      })
      .replyOnce(200, buildTimeStatsResponse());

    fireEvent.click(result.getByTestId("next_month_button"));
  });
});
