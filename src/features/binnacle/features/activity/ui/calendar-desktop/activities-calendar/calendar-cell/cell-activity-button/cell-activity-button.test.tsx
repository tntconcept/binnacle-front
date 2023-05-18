// TODO: Fix test
// import { fireEvent, waitFor } from '@testing-library/react'
// import { SettingsState } from 'shared/data-access/state/settings-state'
// import { render, screen, userEvent } from 'test-utils/app-test-utils'
// import { container } from 'tsyringe'
// import { CellActivityButton } from './cell-activity-button'
// import { ActivityMother } from "../../../../../../../../../test-utils/mothers/activity-mother";
//
// describe('CellActivityButton', () => {
//   it('should show description', () => {
//     jest.useFakeTimers('modern').setSystemTime(new Date('2021-07-12T21:30:00').getTime())
//
//     const settings = container.resolve(SettingsState)
//     settings.settings = { ...settings.settings, showDescription: true }
//
//     setup(false)
//
//     expect(screen.getByRole('button')).toHaveTextContent('21:30 - 23:10 Lorem Ipsum...')
//     expect(screen.getByRole('button').firstChild).toHaveAttribute(
//       'aria-label',
//       '21:30 - 23:10, Lorem Ipsum...'
//     )
//
//     jest.useRealTimers()
//   })
//
//   it('should show project name', () => {
//     jest.useFakeTimers('modern').setSystemTime(new Date('2021-07-12T21:30:00').getTime())
//
//     const settings = container.resolve(SettingsState)
//     settings.settings = { ...settings.settings, showDescription: false }
//
//     setup(false, true)
//
//     expect(screen.getByRole('button')).toHaveTextContent('21:30 - 23:10 Test Project Name')
//     expect(screen.getByRole('button').firstChild).toHaveAttribute(
//       'aria-label',
//       '21:30 - 23:10, activity_form.billable, activity_form.project:Test Project Name'
//     )
//
//     jest.useRealTimers()
//   })
//
//   it('should open update activity form on click', () => {
//     //TODO
//   })
//
//   it('should show activity preview on hover', async () => {
//     setup(false)
//
//     const button = screen.getByRole('button')
//     expect(button).toHaveAttribute('tabIndex', '-1')
//
//     fireEvent.focus(screen.getByRole('button'))
//
//     await waitFor(() => {
//       expect(screen.queryByTestId('activity_tooltip')).not.toBeInTheDocument()
//     })
//
//     userEvent.hover(screen.getByRole('button'))
//
//     await waitFor(() => {
//       expect(screen.getByTestId('activity_tooltip')).toBeInTheDocument()
//     })
//
//     expect(screen.getByTestId('activity_tooltip')).toBeInTheDocument()
//   })
//
//   it('should show activity preview on focus', async () => {
//     setup(true)
//
//     const button = screen.getByRole('button')
//     expect(button).toHaveAttribute('tabIndex', '0')
//
//     fireEvent.focus(button)
//
//     await waitFor(() => {
//       expect(screen.getByTestId('activity_tooltip')).toBeInTheDocument()
//     })
//   })
// })
//
// const setup = (canFocus: boolean, billable?: boolean) => {
//   const activity = ActivityMother.minutesBillableActivityWithoutEvidence()
//   activity.billable = billable ?? false
//
//   render(<CellActivityButton activity={activity} canFocus={canFocus} />)
//
//   return { activity }
// }
