import {
  binnacleReducer,
  changeMonth,
  createActivity,
  IBinnacleState,
  initialBinnacleState
} from "core/controllers/useBinnacleReducer"
import {addMonths} from "date-fns"
import {IActivity} from "interfaces/IActivity"

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

it('should change month', function () {
  const month = addMonths(new Date(), 1)
  const expectedState: IBinnacleState = {
    ...initialBinnacleState,
    month
  }

  const state = binnacleReducer(initialBinnacleState, changeMonth(month))

  expect(state).toEqual(expectedState)
})

it('should add a new activity to activities', function () {
  const activity: IActivity = {
    ...baseActivity,
    id: 300
  }
  const expectedState: IBinnacleState = {
    ...initialBinnacleState,
    activities: [activity],
    timeBalance: {
      differenceInMinutes: 0,
      minutesToWork: 0,
      minutesWorked: 180
    }
  }

  const reducer = binnacleReducer(initialBinnacleState, createActivity(activity))

  expect(reducer).toEqual(expectedState)
})

it('should update an activity of activities', function () {

})