import React from 'react'
import {
  Notifications,
  useShowErrorNotification,
  useShowNotification
} from 'features/Notifications'
import { act, fireEvent, render, waitFor } from '@testing-library/react'

const TestNotification: React.FC<{
  buttonText: string
  notificationTitle: string
}> = (props) => {
  const showNotification = useShowNotification()

  return (
    <button
      onClick={() =>
        showNotification({
          title: props.notificationTitle,
          description: 'Lorem Ipsum..'
        })
      }
    >
      {props.buttonText}
    </button>
  )
}

describe('Notifications', () => {
  it('should show notification', function() {
    const { getByText } = render(
      <TestNotification
        buttonText="Show Notification"
        notificationTitle="Test Notification"
      />,
      {
        wrapper: Notifications
      }
    )

    fireEvent.click(getByText('Show Notification'))

    expect(getByText('Test Notification')).toBeInTheDocument()
    expect(getByText('Lorem Ipsum..')).toBeInTheDocument()
  })

  it('should close the target notification when the user clicks the close button', async () => {
    const { getByText, getAllByTestId, queryByText } = render(
      <div>
        <TestNotification
          buttonText="Show FIRST notification"
          notificationTitle="FIRST notification title"
        />
        <TestNotification
          buttonText="Show SECOND notification"
          notificationTitle="SECOND notification title"
        />
      </div>,
      {
        wrapper: Notifications
      }
    )

    // Show two notifications
    fireEvent.click(getByText('Show FIRST notification'))
    fireEvent.click(getByText('Show SECOND notification'))

    expect(getByText('FIRST notification title')).toBeInTheDocument()
    expect(getByText('SECOND notification title')).toBeInTheDocument()

    // Close the FIRST notification
    fireEvent.click(getAllByTestId('close_notification')[0])

    await waitFor(() => {
      expect(queryByText('FIRST notification title')).not.toBeInTheDocument()
    })

    expect(getByText('SECOND notification title')).toBeInTheDocument()
  })

  it('should close automatically after 3s', async () => {
    jest.useFakeTimers()

    const { getByText, queryByText } = render(
      <TestNotification
        buttonText="Show Notification"
        notificationTitle="Test Notification"
      />,
      {
        wrapper: Notifications
      }
    )

    fireEvent.click(getByText('Show Notification'))

    act(() => {
      jest.runAllTimers()
    })

    await waitFor(() => {
      expect(queryByText('Test Notification')).not.toBeInTheDocument()
    })
  })

  it('should show error notification', function() {
    const TestErrorNotification = () => {
      const showErrorNotification = useShowErrorNotification()

      return (
        <button onClick={() => showErrorNotification(new Error())}>
          Show Error Notification
        </button>
      )
    }

    const { getByText } = render(<TestErrorNotification />, {
      wrapper: Notifications
    })

    fireEvent.click(getByText('Show Error Notification'))

    expect(getByText('api_errors.general_description')).toBeInTheDocument()
  })
})
