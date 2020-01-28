import {binnacleReducer, initialBinnacleState} from "core/controllers/useBinnacleReducer"
import {addMonths} from "date-fns"
import {IActivity, IActivityDay} from "interfaces/IActivity"
import {BinnacleActions} from "core/controllers/binnacleActions"
import {IHolidaysResponse} from "interfaces/IHolidays"
import {ITimeTracker} from "interfaces/ITimeTracker"

describe("useBinnacleReducer", () => {
  const dateMock = new Date(2020, 0, 2)

  const baseActivity: IActivity = {
    id: 1,
    startDate: new Date(2020, 0, 2, 9, 0, 0),
    duration: 180,
    description: "Is Billable",
    billable: true,
    userId: 200,
    organization: {
      id: 1000,
      name: "Organization Test"
    },
    project: {
      id: 2000,
      name: "Project Test",
      billable: true,
      open: true
    },
    projectRole: {
      id: 15,
      name: "Role Test"
    }
  }

  it("should change the month", function () {
    const month = addMonths(new Date(), 1)

    const state = binnacleReducer(
      initialBinnacleState,
      BinnacleActions.changeMonth(month)
    )

    expect(state).toEqual({
      ...initialBinnacleState,
      month
    })
  })

  it('should save binnacle data', function () {

    const activities: IActivityDay[] = [
      {
        date: new Date(),
        workedMinutes: 0,
        activities: []
      }
    ]
    const holidays: IHolidaysResponse = {
      // @ts-ignore
      publicHolidays: [],
      // @ts-ignore
      privateHolidays: []
    }
    const timeBalance: ITimeTracker = {
      differenceInMinutes: -100,
      minutesToWork: 200,
      minutesWorked: 100
    }

    const state = binnacleReducer(
      initialBinnacleState,
      BinnacleActions.saveBinnacleData(activities, holidays, timeBalance)
    )

    expect(state).toEqual({
      ...initialBinnacleState,
      activities,
      holidays,
      timeBalance
    })
  })

  it("should add a new activity to activities and update the time balance correctly", function () {
    const activityToCreate: IActivity = {
      ...baseActivity,
      id: 300
    }

    const customState = {
      ...initialBinnacleState,
      activities: [
        {
          date: dateMock,
          workedMinutes: 0,
          activities: []
        }
      ],
      timeBalance: {
        minutesToWork: 480,
        minutesWorked: 0,
        differenceInMinutes: -480
      }
    }

    const state = binnacleReducer(
      customState,
      BinnacleActions.createActivity(activityToCreate)
    )

    expect(state).toEqual({
      ...customState,
      activities: [
        {
          date: dateMock,
          workedMinutes: 180,
          activities: [activityToCreate]
        }
      ],
      timeBalance: {
        differenceInMinutes: -300,
        minutesToWork: 480,
        minutesWorked: 180
      }
    })
  })

  it("should update an activity of activities and update the time balance correctly", function () {
    const activityToUpdate: IActivity = {
      ...baseActivity,
      duration: 100,
      id: 8
    }

    const customState = {
      ...initialBinnacleState,
      activities: [
        {
          date: dateMock,
          workedMinutes: 180,
          activities: [
            {
              ...baseActivity,
              id: 8
            }
          ]
        }
      ],
      timeBalance: {
        differenceInMinutes: -20,
        minutesToWork: 200,
        minutesWorked: 180
      }
    }


    const state = binnacleReducer(
      customState,
      BinnacleActions.updateActivity(activityToUpdate)
    )

    expect(state).toEqual({
      ...customState,
      activities: [
        {
          date: dateMock,
          workedMinutes: 100,
          activities: [activityToUpdate]
        }
      ],
      timeBalance: {
        differenceInMinutes: -100,
        minutesToWork: 200,
        minutesWorked: 100
      }
    })
  })

  it('should delete an activity and update time balance correctly', function () {
    const activityToDelete: IActivity = {
      ...baseActivity,
      id: 1
    }

    const customState = {
      ...initialBinnacleState,
      activities: [
        {
          date: dateMock,
          workedMinutes: 180,
          activities: [
            {
              ...baseActivity,
              id: 1
            }
          ]
        }
      ],
      timeBalance: {
        differenceInMinutes: -20,
        minutesToWork: 200,
        minutesWorked: 180
      }
    }


    const state = binnacleReducer(
      customState,
      BinnacleActions.deleteActivity(activityToDelete)
    )

    expect(state).toEqual({
      ...customState,
      activities: [
        {
          date: dateMock,
          workedMinutes: 0,
          activities: []
        }
      ],
      timeBalance: {
        differenceInMinutes: -200,
        minutesToWork: 200,
        minutesWorked: 0
      }
    })
  })

  it('should change global loading', function () {
    const state = binnacleReducer(initialBinnacleState, BinnacleActions.changeGlobalLoading(true))

    expect(state).toEqual({
      ...initialBinnacleState,
      loadingData: true,
      loadingTimeBalance: true
    })
  })

  it('should store global error when the any fetch fails', function () {
    const error = new Error("Request Failed :D")
    const state = binnacleReducer(initialBinnacleState, BinnacleActions.fetchGlobalFailed(error))

    expect(state).toEqual({
      ...initialBinnacleState,
      loadingData: false,
      loadingTimeBalance: false,
      error
    })
  })

  it('should change only loading state of balance time', function () {
    const state = binnacleReducer(initialBinnacleState, BinnacleActions.changeLoadingTimeBalance(true))

    expect(state).toEqual({
      ...initialBinnacleState,
      loadingTimeBalance: true,
    })
  })

  it('should update balance time and fetching time mode', function () {
    const timeBalance: ITimeTracker = {
      minutesWorked: 400,
      minutesToWork: 450,
      differenceInMinutes: 50
    }

    const state = binnacleReducer(initialBinnacleState, BinnacleActions.updateTimeBalance(timeBalance, true))

    expect(state).toEqual({
      ...initialBinnacleState,
      timeBalance,
      isTimeCalculatedByYear: true
    })
  })
})
