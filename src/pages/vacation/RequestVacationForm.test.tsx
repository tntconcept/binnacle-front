import { render, screen, userEvent, fireEvent, waitFor } from 'test-utils/app-test-utils'
import { RequestVacationForm } from 'pages/vacation/RequestVacationForm'
import React from 'react'
import { fetchCorrespondingPrivateHolidayDays as mockFetchCorrespondingPrivateHolidays } from 'api/vacation/fetchCorrespondingPrivateHolidayDays'

jest.mock('api/vacation/fetchCorrespondingPrivateHolidayDays')

describe('RequestVacationForm', () => {
  function renderRequestVacationForm({
    initialValues = {
      id: undefined,
      startDate: '',
      endDate: '',
      description: '',
      chargeYear: '2020-01-01'
    },
    isOpen = true,
    onClose = jest.fn(),
    onRefreshHolidays = jest.fn(),
    createVacationPeriod = jest.fn(),
    updateVacationPeriod = jest.fn()
  }: any = {}) {
    // @ts-ignore
    mockFetchCorrespondingPrivateHolidays.mockResolvedValue(10)

    render(
      <RequestVacationForm
        initialValues={initialValues}
        isOpen={isOpen}
        onClose={onClose}
        onRefreshHolidays={onRefreshHolidays}
        createVacationPeriod={createVacationPeriod}
        updateVacationPeriod={updateVacationPeriod}
      />
    )

    return {
      initialValues,
      onClose,
      onRefreshHolidays,
      createVacationPeriod,
      updateVacationPeriod
    }
  }

  describe('validation', () => {
    it('check that validation runs on submit', async () => {
      const largeDescription = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Eget aliquet nibh praesent tristique magna sit amet. Lacinia quis vel eros donec ac. Ut sem viverra aliquet eget sit amet tellus cras. In tellus integer feugiat scelerisque varius morbi enim nunc. Blandit aliquam etiam erat velit. Urna id volutpat lacus laoreet non curabitur gravida arcu ac. Lorem mollis aliquam ut porttitor leo a diam. Vitae purus faucibus ornare suspendisse sed nisi lacus sed viverra. Pharetra massa massa ultricies mi quis hendrerit dolor magna. Facilisi morbi tempus iaculis urna id volutpat lacus.
      Commodo quis imperdiet massa tincidunt nunc pulvinar sapien et ligula. Enim sed faucibus turpis in eu mi bibendum neque egestas. Egestas integer eget aliquet nibh. Ut diam quam nulla porttitor massa id neque aliquam vestibulum. Aliquam malesuada bibendum arcu vitae elementum. Lacus viverra vitae congue eu consequat ac felis. Adipiscing commodo elit at imperdiet dui accumsan. Consectetur purus ut faucibus pulvinar elementum integer.`

      const { createVacationPeriod, onRefreshHolidays, onClose } = renderRequestVacationForm({
        initialValues: {
          id: undefined,
          startDate: '',
          endDate: '',
          description: largeDescription,
          chargeYear: '2020-01-01'
        }
      })

      userEvent.click(screen.getByRole('button', { name: 'actions.save' }))

      expect(createVacationPeriod).not.toHaveBeenCalled()
      expect(onRefreshHolidays).not.toHaveBeenCalled()
      expect(onClose).not.toHaveBeenCalled()

      expect(await screen.findAllByText('form_errors.field_required')).toHaveLength(2)
      expect(screen.getByText('form_errors.max_length 1088 / 1024')).toBeInTheDocument()
    })

    it('check max attribute of date inputs', function() {
      renderRequestVacationForm()
      const maxYear = new Date().getFullYear() + 1
      expect(screen.getByLabelText('vacation_form.start_date')).toHaveAttribute(
        'max',
        `${maxYear}-12-31`
      )
      expect(screen.getByLabelText('vacation_form.end_date')).toHaveAttribute(
        'max',
        `${maxYear}-12-31`
      )
    })

    it('check validation of max date', async () => {
      renderRequestVacationForm()

      userEvent.type(screen.getByLabelText('vacation_form.start_date'), '2100-01-02')
      userEvent.type(screen.getByLabelText('vacation_form.end_date'), '2100-01-03')

      userEvent.click(screen.getByRole('button', { name: 'actions.save' }))

      expect(
        await screen.findAllByText(`form_errors.year_max ${new Date().getFullYear() + 2}`)
      ).toHaveLength(2)
    })

    it('Check that allows to enter a date of next year', async () => {
      renderRequestVacationForm()
      userEvent.type(screen.getByLabelText('vacation_form.start_date'), '2100-01-02')
      userEvent.type(screen.getByLabelText('vacation_form.start_date'), '2100-01-03')

      userEvent.click(screen.getByRole('button', { name: 'actions.save' }))
      await waitFor(() => {
        expect(screen.queryByText(/form_errors.year_max/)).not.toBeInTheDocument()
      })
    })

    it('Check validation of end date after the start date', async () => {
      renderRequestVacationForm()

      userEvent.type(screen.getByLabelText('vacation_form.start_date'), '2020-01-20')
      userEvent.type(screen.getByLabelText('vacation_form.end_date'), '2020-01-10')

      userEvent.click(screen.getByRole('button', { name: 'actions.save' }))
      expect(await screen.findByText('form_errors.end_date_greater')).toBeInTheDocument()
    })
  })

  it('should fill the fields and send create request', async () => {
    const { createVacationPeriod, onRefreshHolidays, onClose } = renderRequestVacationForm()

    const startDate = '2020-08-10'
    const endDate = '2020-08-20'
    const description = 'Lorem ipsum ...'

    userEvent.type(screen.getByLabelText('vacation_form.start_date'), startDate)
    userEvent.type(screen.getByLabelText('vacation_form.end_date'), endDate)
    userEvent.type(screen.getByLabelText('vacation_form.description'), description)

    userEvent.click(screen.getByRole('button', { name: 'actions.save' }))
    await waitFor(() => {
      expect(createVacationPeriod).toHaveBeenCalledWith({
        id: undefined,
        startDate: startDate + 'T00:00:00.000Z',
        endDate: endDate + 'T00:00:00.000Z',
        description: description
      })
      expect(onRefreshHolidays).toHaveBeenCalled()
      expect(onClose).toHaveBeenCalled()
    })
  })

  it('should open the modal with the fields filled and send update request', async () => {
    const initialValues = {
      id: 1,
      startDate: '2020-08-05',
      endDate: '2020-08-06',
      description: 'Lorem ipsum dolorum...',
      chargeYear: '2020-01-01'
    }

    const { updateVacationPeriod, onClose, onRefreshHolidays } = renderRequestVacationForm({
      initialValues: initialValues
    })

    expect(screen.getByLabelText('vacation_form.start_date')).toHaveValue(initialValues.startDate)
    expect(screen.getByLabelText('vacation_form.end_date')).toHaveValue(initialValues.endDate)
    expect(screen.getByLabelText('vacation_form.description')).toHaveValue(
      initialValues.description
    )

    userEvent.click(screen.getByRole('button', { name: 'actions.save' }))

    await waitFor(() => {
      expect(updateVacationPeriod).toHaveBeenCalledWith({
        id: initialValues.id,
        startDate: initialValues.startDate + 'T00:00:00.000Z',
        endDate: initialValues.endDate + 'T00:00:00.000Z',
        description: initialValues.description
      })
      expect(onRefreshHolidays).toHaveBeenCalled()
      expect(onClose).toHaveBeenCalled()
    })
  })

  it('should be hidden', function() {
    renderRequestVacationForm({ isOpen: false })

    expect(screen.queryByText(/vacation_form/)).not.toBeInTheDocument()
  })

  it('should close the modal clicking on the close button', function() {
    const { onClose } = renderRequestVacationForm()

    userEvent.click(screen.getByLabelText('actions.close'))
    expect(onClose).toHaveBeenCalled()
  })

  xit('should close the modal clicking away', function() {
    const { onClose } = renderRequestVacationForm()

    // simulate that the user clicks outside of the modal
    fireEvent.mouseDown(document.body)
    expect(onClose).toHaveBeenCalled()
  })
})
