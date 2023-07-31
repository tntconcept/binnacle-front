import { useExecuteUseCaseOnMount } from '../../../../../../../../../shared/arch/hooks/use-execute-use-case-on-mount'
import { UserMother } from '../../../../../../../../../test-utils/mothers/user-mother'
import { ActivityUserFilter } from './activity-user-filter'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

jest.mock('../../../../../../../../../shared/arch/hooks/use-execute-use-case-on-mount')

describe('ActivityUserFilter', () => {
  it('should emit on change', function () {
    const { onChange } = setup()
    userEvent.click(screen.getByText('John'))
    expect(onChange).toHaveBeenCalledWith({ id: 1, name: 'John', username: 'john' })
  })

  const setup = () => {
    const users = UserMother.userList()
    const mockFn = jest.fn()

    ;(useExecuteUseCaseOnMount as jest.Mock).mockImplementation((arg) => {
      if (arg.prototype.key === 'GetUsersListQry') {
        return {
          isLoading: false,
          result: users
        }
      }
    })

    render(<ActivityUserFilter onChange={mockFn}></ActivityUserFilter>)

    return { onChange: mockFn }
  }
})
