import { IResponseToken, IUser } from "services/authService";
import { IActivityResponse } from "services/activitiesService";
import { ITimeTracker } from "services/timeTrackingService";
import { IHolidayResponse } from "services/holidaysService";

export const buildOAuthResponse = (): IResponseToken => ({
  access_token: "demo access token",
  token_type: "bearer",
  refresh_token: "demo refresh token",
  expires_in: 360,
  scope: "tnt",
  jti: "jti code"
});

export const buildUserResponse = (): IUser => ({
  id: 1,
  dayDuration: 480,
  departmentId: 1,
  email: "username@email.com",
  genre: "male",
  hiringDate: new Date().toDateString(),
  name: "john",
  photoUrl: undefined,
  role: {
    id: 1,
    name: "User"
  },
  username: "jdoe"
});

export const buildActivitiesResponse = (): IActivityResponse[] => [
  {
    date: "2019-08-25",
    workedMinutes: 0,
    activities: []
  },
  {
    date: "2019-08-26",
    workedMinutes: 0,
    activities: [
      {
        id: 4,
        startDate: "2019-08-26T02:00:00",
        duration: 0,
        description: "Dia de Compensacion",
        projectRole: {
          id: 2,
          name: "React"
        },
        userId: 2,
        billable: false,
        organization: {
          id: 2,
          name: "Empresa 2"
        },
        project: {
          id: 2,
          name: "Dashboard",
          open: true,
          billable: true
        }
      }
    ]
  },
  {
    date: "2019-08-27",
    workedMinutes: 0,
    activities: []
  },
  {
    date: "2019-08-28",
    workedMinutes: 0,
    activities: []
  },
  {
    date: "2019-08-29",
    workedMinutes: 0,
    activities: []
  },
  {
    date: "2019-08-30",
    workedMinutes: 0,
    activities: []
  },
  {
    date: "2019-08-31",
    workedMinutes: 0,
    activities: []
  },
  {
    date: "2019-09-01",
    workedMinutes: 0,
    activities: []
  },
  {
    date: "2019-09-02",
    workedMinutes: 0,
    activities: []
  },
  {
    date: "2019-09-03",
    workedMinutes: 0,
    activities: [
      {
        id: 5,
        startDate: "2019-09-03T02:00:00",
        duration: 0,
        description: "Dia de Compensacion",
        projectRole: {
          id: 3,
          name: "Front-End"
        },
        userId: 2,
        billable: false,
        organization: {
          id: 3,
          name: "Autentia"
        },
        project: {
          id: 3,
          name: "Teams",
          open: true,
          billable: false
        }
      }
    ]
  },
  {
    date: "2019-09-04",
    workedMinutes: 0,
    activities: []
  },
  {
    date: "2019-09-05",
    workedMinutes: 0,
    activities: []
  },
  {
    date: "2019-09-06",
    workedMinutes: 0,
    activities: []
  },
  {
    date: "2019-09-07",
    workedMinutes: 120,
    activities: [
      {
        id: 6,
        startDate: "2019-09-07T11:00:00",
        duration: 120,
        description: "Actividad 17",
        projectRole: {
          id: 3,
          name: "Front-End"
        },
        userId: 2,
        billable: true,
        organization: {
          id: 3,
          name: "Autentia"
        },
        project: {
          id: 3,
          name: "Teams",
          open: true,
          billable: false
        }
      }
    ]
  },
  {
    date: "2019-09-08",
    workedMinutes: 120,
    activities: [
      {
        id: 7,
        startDate: "2019-09-08T11:00:00",
        duration: 120,
        description: "Actividad 17",
        projectRole: {
          id: 3,
          name: "Front-End"
        },
        userId: 2,
        billable: false,
        organization: {
          id: 3,
          name: "Autentia"
        },
        project: {
          id: 3,
          name: "Teams",
          open: true,
          billable: false
        }
      }
    ]
  },
  {
    date: "2019-09-09",
    workedMinutes: 0,
    activities: []
  },
  {
    date: "2019-09-10",
    workedMinutes: 0,
    activities: []
  },
  {
    date: "2019-09-11",
    workedMinutes: 0,
    activities: []
  },
  {
    date: "2019-09-12",
    workedMinutes: 0,
    activities: []
  },
  {
    date: "2019-09-13",
    workedMinutes: 0,
    activities: []
  },
  {
    date: "2019-09-14",
    workedMinutes: 0,
    activities: []
  },
  {
    date: "2019-09-15",
    workedMinutes: 0,
    activities: []
  },
  {
    date: "2019-09-16",
    workedMinutes: 60,
    activities: [
      {
        id: 8,
        startDate: "2019-09-16T11:00:00",
        duration: 60,
        description: "Actividad de prueba 2",
        projectRole: {
          id: 4,
          name: "Back-End"
        },
        userId: 2,
        billable: false,
        organization: {
          id: 3,
          name: "Autentia"
        },
        project: {
          id: 4,
          name: "TNT",
          open: true,
          billable: false
        }
      }
    ]
  },
  {
    date: "2019-09-17",
    workedMinutes: 0,
    activities: []
  },
  {
    date: "2019-09-18",
    workedMinutes: 0,
    activities: []
  },
  {
    date: "2019-09-19",
    workedMinutes: 0,
    activities: []
  },
  {
    date: "2019-09-20",
    workedMinutes: 0,
    activities: []
  },
  {
    date: "2019-09-21",
    workedMinutes: 0,
    activities: []
  },
  {
    date: "2019-09-22",
    workedMinutes: 0,
    activities: []
  },
  {
    date: "2019-09-23",
    workedMinutes: 0,
    activities: []
  },
  {
    date: "2019-09-24",
    workedMinutes: 0,
    activities: []
  },
  {
    date: "2019-09-25",
    workedMinutes: 0,
    activities: []
  },
  {
    date: "2019-09-26",
    workedMinutes: 0,
    activities: []
  },
  {
    date: "2019-09-27",
    workedMinutes: 0,
    activities: []
  },
  {
    date: "2019-09-28",
    workedMinutes: 0,
    activities: []
  },
  {
    date: "2019-09-29",
    workedMinutes: 0,
    activities: []
  },
  {
    date: "2019-09-30",
    workedMinutes: 0,
    activities: []
  },
  {
    date: "2019-10-01",
    workedMinutes: 0,
    activities: []
  },
  {
    date: "2019-10-02",
    workedMinutes: 0,
    activities: []
  },
  {
    date: "2019-10-03",
    workedMinutes: 0,
    activities: []
  },
  {
    date: "2019-10-04",
    workedMinutes: 0,
    activities: []
  },
  {
    date: "2019-10-05",
    workedMinutes: 0,
    activities: []
  },
  {
    date: "2019-10-06",
    workedMinutes: 0,
    activities: []
  }
];

export const buildTimeStatsResponse = (): Record<string, ITimeTracker> => ({
  "9": {
    minutesToWork: 160,
    minutesWorked: 5,
    differenceInMinutes: -155
  },
  "10": {
    minutesToWork: 180,
    minutesWorked: 160,
    differenceInMinutes: -20
  }
});

export const buildHolidaysResponse = (): IHolidayResponse => ({
  publicHolidays: {},
  privateHolidays: {}
});
