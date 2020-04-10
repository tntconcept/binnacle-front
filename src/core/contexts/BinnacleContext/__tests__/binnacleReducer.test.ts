import {binnacleReducer, initialBinnacleState} from "core/contexts/BinnacleContext/BinnacleReducer"
import {IActivity, IActivityDay} from "api/interfaces/IActivity"
import {BinnacleActions} from "core/contexts/BinnacleContext/BinnacleActions"
import {IHolidaysResponse} from "api/interfaces/IHolidays"
import {ITimeBalance} from "api/interfaces/ITimeBalance"
import {IRecentRole} from "api/interfaces/IRecentRole"
import mockDate from "mockdate"

const buildActivity = (date: Date, duration: number, billable: boolean = true): IActivity => {
  return {
    id: 1,
    startDate: date,
    duration,
    description: "Is Billable",
    billable,
    userId: 200,
    organization: {
      id: 1000,
      name: "Organization Test"
    },
    project: {
      id: 2000,
      name: "Project Test",
      billable,
      open: true
    },
    projectRole: {
      id: 15,
      name: "Role Test"
    },
    hasImage: false
  }
}

const buildRecentRole = (activity: IActivity) => {
  return {
    id: activity.projectRole.id,
    name: activity.projectRole.name,
    date: activity.startDate,
    projectName: activity.project.name,
    projectBillable: activity.project.billable
  };
};

describe("Binnacle Reducer", () => {
  it("should save binnacle data and update last imputed role", function() {
    const activity = buildActivity(new Date("2020-02-10"), 10)
    const activities: IActivityDay[] = [
      {
        date: new Date(),
        workedMinutes: 10,
        activities: [activity]
      }
    ];
    const holidays: IHolidaysResponse = {
      publicHolidays: [],
      privateHolidays: []
    };
    const timeBalance: ITimeBalance = {
      timeDifference: -190,
      timeToWork: 200,
      timeWorked: 10
    };

    const recentRoles: IRecentRole[] = [
      {
        id: 1,
        date: new Date(),
        projectName: "",
        projectBillable: false,
        name: ""
      }
    ];

    const month = new Date(2019, 20, 1);

    const state = binnacleReducer(
      initialBinnacleState,
      BinnacleActions.saveBinnacleData(
        month,
        activities,
        holidays,
        timeBalance,
        recentRoles
      )
    );

    expect(state).toEqual({
      ...initialBinnacleState,
      activities,
      holidays,
      timeBalance,
      month,
      recentRoles,
      lastImputedRole: buildRecentRole(activity)
    });
  });

  it("should add a new activity to activities and update the time balance correctly", function() {
    const customState = {
      ...initialBinnacleState,
      month: new Date("2020-02-01"),
      activities: [
        {
          date: new Date("2020-02-03"),
          workedMinutes: 0,
          activities: []
        }
      ],
      timeBalance: {
        minutesToWork: 480,
        minutesWorked: 0,
        differenceInMinutes: -480
      }
    };

    const activityToCreate = buildActivity(new Date("2020-02-03"), 120)
    const state = binnacleReducer(
      customState,
      BinnacleActions.createActivity(activityToCreate)
    );

    expect(state).toEqual({
      ...customState,
      activities: [
        {
          date: new Date("2020-02-03"),
          workedMinutes: 120,
          activities: [activityToCreate]
        }
      ],
      timeBalance: {
        minutesToWork: 480,
        minutesWorked: 120,
        differenceInMinutes: -360,
      }
    });
  });

  it("should update an activity of activities and update the time balance correctly", function() {
    const activityDayDate = new Date("2020-02-04");
    const activity = buildActivity(new Date("2020-02-04"), 120)

    const customState = {
      ...initialBinnacleState,
      month: new Date("2020-02-01"),
      activities: [
        {
          date: activityDayDate,
          workedMinutes: 120,
          activities: [activity]
        }
      ],
      timeBalance: {
        minutesToWork: 200,
        minutesWorked: 120,
        differenceInMinutes: -80,
      }
    };

    const activityUpdated =  {...activity, duration: 200}
    const state = binnacleReducer(
      customState,
      BinnacleActions.updateActivity(activityUpdated)
    );

    expect(state).toEqual({
      ...customState,
      activities: [
        {
          date: activityDayDate,
          workedMinutes: 200,
          activities: [activityUpdated]
        }
      ],
      timeBalance: {
        minutesToWork: 200,
        minutesWorked: 200,
        differenceInMinutes: 0,
      }
    });
  });

  it("should delete an activity and update time balance correctly and last imputed role", function() {
    const activityDayDate = new Date("2020-02-04")
    const activity = buildActivity(new Date("2020-02-04"), 100)

    const customState = {
      ...initialBinnacleState,
      month: new Date("2020-02-01"),
      activities: [
        {
          date: activityDayDate,
          workedMinutes: 100,
          activities: [activity]
        }
      ],
      timeBalance: {
        minutesToWork: 200,
        minutesWorked: 100,
        differenceInMinutes: -100,
      },
      lastImputedRole: buildRecentRole(activity)
    };

    const state = binnacleReducer(
      customState,
      BinnacleActions.deleteActivity(activity)
    );

    expect(state).toEqual({
      ...customState,
      activities: [
        {
          date: activityDayDate,
          workedMinutes: 0,
          activities: []
        }
      ],
      timeBalance: {
        minutesToWork: 200,
        minutesWorked: 0,
        differenceInMinutes: -200,
      },
      // TODO should return first item of recent roles list instead of not doing anything when does not exist more imputed activities in that date period.
      lastImputedRole: buildRecentRole(activity)
    });
  });

  it("should change global loading", function() {
    const state = binnacleReducer(
      initialBinnacleState,
      BinnacleActions.changeGlobalLoading(true)
    );

    expect(state).toEqual({
      ...initialBinnacleState,
      loadingData: true,
      loadingTimeBalance: true
    });
  });

  it("should store global error when the any fetch fails", function() {
    const error = new Error("Request Failed :D");
    const state = binnacleReducer(
      initialBinnacleState,
      BinnacleActions.fetchGlobalFailed(error)
    );

    expect(state).toEqual({
      ...initialBinnacleState,
      loadingData: false,
      loadingTimeBalance: false,
      error
    });
  });

  it("should change only loading state of balance time", function() {
    const state = binnacleReducer(
      initialBinnacleState,
      BinnacleActions.changeLoadingTimeBalance(true)
    );

    expect(state).toEqual({
      ...initialBinnacleState,
      loadingTimeBalance: true
    });
  });

  it("should update balance time and fetching time mode", function() {
    const timeBalance: ITimeBalance = {
      timeWorked: 400,
      timeToWork: 450,
      timeDifference: 50
    };

    const state = binnacleReducer(
      initialBinnacleState,
      BinnacleActions.updateTimeBalance(timeBalance, true)
    );

    expect(state).toEqual({
      ...initialBinnacleState,
      timeBalance,
      isTimeCalculatedByYear: true
    });
  });

  it('should add a recent role if date is valid', function () {
    mockDate.set("2020-02-25")

    const recentRole: IRecentRole = {
      id: 1,
      name: "a",
      projectName: "b",
      projectBillable: false,
      date: new Date("2020-02-20")
    }

    const initialState = {
      ...initialBinnacleState,
      month: new Date("2020-02-01")
    }

    const state = binnacleReducer(
      initialState,
      BinnacleActions.addRecentRole(recentRole)
    );

    expect(state).toEqual({
      ...initialState,
      recentRoles: [recentRole],
      lastImputedRole: recentRole
    })

    mockDate.reset()
  })

  it('should update last imputed role', function () {
    const lastImputedRole: IRecentRole = {
      id: 2,
      name: "z",
      projectName: "y",
      projectBillable: true,
      date: new Date("2020-02-24")
    }

    const state = binnacleReducer(
      initialBinnacleState,
      BinnacleActions.updateLastImputedRole(lastImputedRole)
    );

    expect(state).toEqual({
      ...initialBinnacleState,
      lastImputedRole
    })
  })
});
