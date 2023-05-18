// TODO: Fix test
// import { Activity } from 'features/binnacle/features/activity/domain/activity'
// import { render, screen, userEvent } from 'test-utils/app-test-utils'
// import { mockActivity } from 'test-utils/generateTestMocks'
// import { CellBody } from './cell-body'
//
// jest.mock(
//   'features/binnacle/features/activity/ui/calendar-desktop/activities-calendar/calendar-cell/cell-activity-button/cell-activity-button.tsx',
//   () => {
//     return {
//       CellActivityButton: (props: any) => <button>{props.activity.description}</button>
//     }
//   }
// )
//
// describe('CellBody', () => {
//   it('should trap focus', () => {
//     setup(true, [
//       mockActivity({ description: 'first activity' }),
//       mockActivity({ description: 'second activity' })
//     ])
//
//     expect(screen.getByText('accessibility.new_activity')).toHaveFocus()
//
//     userEvent.tab()
//     expect(screen.getByText('first activity')).toHaveFocus()
//
//     userEvent.tab()
//     expect(screen.getByText('second activity')).toHaveFocus()
//
//     userEvent.tab()
//     expect(screen.getByText('outside button')).not.toHaveFocus()
//
//     expect(screen.getByText('accessibility.new_activity')).toHaveFocus()
//   })
//
//   it('should not trap focus', () => {
//     setup(false, [
//       mockActivity({ description: 'first activity' }),
//       mockActivity({ description: 'second activity' })
//     ])
//
//     userEvent.tab()
//     expect(screen.getByText('accessibility.new_activity')).not.toHaveFocus()
//     expect(screen.getByText('first activity')).toHaveFocus()
//
//     userEvent.tab()
//     expect(screen.getByText('second activity')).toHaveFocus()
//
//     userEvent.tab()
//     expect(screen.getByText('outside button')).toHaveFocus()
//   })
//
//   it('should disable trap on escape key', () => {
//     const { mockOnEscKey } = setup(true, [])
//
//     userEvent.keyboard('{Escape}')
//
//     expect(mockOnEscKey).toHaveBeenCalled()
//   })
// })
//
// const setup = (isSelected: boolean, activities: Activity[]) => {
//   const mockOnEscKey = jest.fn()
//
//   render(
//     <>
//       <CellBody
//         isSelected={isSelected}
//         onEscKey={mockOnEscKey}
//         activities={[]}
//         onActivityClicked={() => {}}
//       />
//       <button>outside button</button>
//     </>
//   )
//
//   return {
//     mockOnEscKey
//   }
// }
