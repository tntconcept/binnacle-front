import React from "react";
import { render, fireEvent } from "@testing-library/react";
import DesktopCalendarControlsLayout from "desktop/layouts/calendar/DesktopCalendarControlsLayout";
import { SelectedMonthContext } from "core/contexts/BinnaclePageContexts/SelectedMonthContext";
import { NotificationsProvider } from "core/contexts/NotificationsContext";
import { axiosMock } from "utils/testing";

const mockAxiosError = (statusCode: number) =>
  ({
    response: {
      status: statusCode
    }
  } as any);

describe("DesktopCalendarControlsLayout", function() {
  afterAll(() => {
    axiosMock.reset();
  });

  const Wrapper: React.FC = props => {
    return (
      <SelectedMonthContext.Provider
        value={{
          selectedMonth: new Date(),
          changeSelectedMonth: jest.fn().mockResolvedValue("success")
        }}
      >
        {props.children}
      </SelectedMonthContext.Provider>
    );
  };

  it("should fetch prev month data", async () => {
    const result = render(<DesktopCalendarControlsLayout />, {
      wrapper: Wrapper
    });

    fireEvent.click(result.getByTestId("prev_month_button"));

    expect(result.getByTestId("prev_month_button")).toHaveTextContent(
      "loading"
    );
    expect(
      await result.findByTestId("prev_month_button")
    ).not.toHaveTextContent("loading");
  });

  it("should show a notification with the error message if the request fails fetching the prev month", async () => {
    const result = render(
      <NotificationsProvider>
        <SelectedMonthContext.Provider
          value={{
            selectedMonth: new Date(),
            changeSelectedMonth: jest
              .fn()
              .mockRejectedValue(mockAxiosError(408))
          }}
        >
          <DesktopCalendarControlsLayout />
        </SelectedMonthContext.Provider>
      </NotificationsProvider>
    );

    fireEvent.click(result.getByTestId("prev_month_button"));

    expect(result.getByTestId("prev_month_button")).toHaveTextContent(
      "loading"
    );
    expect(
      await result.findByTestId("prev_month_button")
    ).not.toHaveTextContent("loading");

    expect(await result.findByText("api_errors.timeout")).toBeInTheDocument();
  });

  it("should fetch next month data", async () => {
    const result = render(<DesktopCalendarControlsLayout />, {
      wrapper: Wrapper
    });

    fireEvent.click(result.getByTestId("next_month_button"));

    expect(result.getByTestId("next_month_button")).toHaveTextContent(
      "loading"
    );
    expect(
      await result.findByTestId("next_month_button")
    ).not.toHaveTextContent("loading");
  });

  it("should show a notification with the error message if the request fails fetching the next month", async () => {
    const result = render(
      <NotificationsProvider>
        <SelectedMonthContext.Provider
          value={{
            selectedMonth: new Date(),
            changeSelectedMonth: jest
              .fn()
              .mockRejectedValue(mockAxiosError(408))
          }}
        >
          <DesktopCalendarControlsLayout />
        </SelectedMonthContext.Provider>
      </NotificationsProvider>
    );

    fireEvent.click(result.getByTestId("next_month_button"));

    expect(result.getByTestId("next_month_button")).toHaveTextContent(
      "loading"
    );
    expect(
      await result.findByTestId("next_month_button")
    ).not.toHaveTextContent("loading");

    expect(await result.findByText("api_errors.timeout")).toBeInTheDocument();
  });
});
