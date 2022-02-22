import { waitForElementToBeRemoved } from '@testing-library/react'
import type { MockProxy } from 'jest-mock-extended'
import { mock } from 'jest-mock-extended'
import {
  ACTIVITY_FORM_ID,
  ActivityForm
} from 'modules/binnacle/components/ActivityForm/ActivityForm'
import { ActivityFormProvider } from 'modules/binnacle/components/ActivityForm/ActivityFormProvider'
import RemoveActivityButton from 'modules/binnacle/components/ActivityForm/components/RemoveActivityButton'
import { SubmitActivityFormAction } from 'modules/binnacle/data-access/actions/submit-activity-form-action'
import type { Activity } from 'modules/binnacle/data-access/interfaces/activity.interface'
import { CombosRepository } from 'modules/binnacle/data-access/repositories/combos-repository'
import { ActivityFormState } from 'modules/binnacle/data-access/state/activity-form-state'
import { BinnacleState } from 'modules/binnacle/data-access/state/binnacle-state'
import React, { Fragment } from 'react'
import SubmitButton from 'shared/components/FormFields/SubmitButton'
import chrono from 'shared/utils/chrono'
import {
  createAxiosError,
  render,
  screen,
  userEvent,
  waitFor,
  waitForLoadingToFinish,
  waitForNotification
} from 'test-utils/app-test-utils'
import {
  buildOrganization,
  buildProject,
  mockActivity,
  mockProjectRole
} from 'test-utils/generateTestMocks'
import { container } from 'tsyringe'
import { GetCalendarDataAction } from 'modules/binnacle/data-access/actions/get-calendar-data-action'
import { ActivitiesRepository } from 'modules/binnacle/data-access/repositories/activities-repository'

jest.mock('shared/components/FloatingLabelCombobox/FloatingLabelCombobox')

describe('ActivityForm', () => {
  let combosRepository: MockProxy<CombosRepository>

  beforeEach(() => {
    jest.spyOn(chrono, 'now').mockImplementation(() => new Date('2020-06-06'))

    const binnacleState = container.resolve(BinnacleState)
    binnacleState.recentRoles = [
      {
        id: 101,
        name: 'Junior',
        requireEvidence: false,
        projectName: 'Marketing',
        projectBillable: false,
        organizationName: 'Viajes XL',
        date: chrono().getDate().toISOString()
      },
      {
        id: 100,
        name: 'Senior',
        requireEvidence: true,
        projectName: 'Marketing',
        projectBillable: true,
        organizationName: 'Viajes XL',
        date: '2020-01-30T00:00:00Z'
      }
    ]

    combosRepository = mock<CombosRepository>()
    container.registerInstance(CombosRepository, combosRepository)

    combosRepository.getOrganizations.mockResolvedValue([{ id: 2, name: 'Grupo QSK' }])

    combosRepository.getProjects.mockResolvedValue([
      {
        id: 12,
        name: 'Developer',
        billable: false,
        open: true
      }
    ])

    combosRepository.getProjectRoles.mockResolvedValue([
      {
        id: 103,
        name: 'Scrum master',
        requireEvidence: true
      }
    ])

    const getCalendarDataAction = mock<GetCalendarDataAction>()
    container.registerInstance(GetCalendarDataAction, getCalendarDataAction)
  })

  describe('Create an activity', () => {
    it('should create an activity using recent roles list', async () => {
      const submitActivityFormAction = mock<SubmitActivityFormAction>()
      container.registerInstance(SubmitActivityFormAction, submitActivityFormAction)
      submitActivityFormAction.execute.mockResolvedValue()

      const { mockOnAfterSubmit } = setup()

      userEvent.type(screen.getByLabelText('activity_form.start_time'), '10:00')
      userEvent.type(screen.getByLabelText('activity_form.end_time'), '10:30')
      userEvent.type(screen.getByLabelText('activity_form.description'), 'Lorem ipsum')

      userEvent.click(screen.getByRole('button', { name: /save/i }))

      await waitFor(() => {
        expect(mockOnAfterSubmit).toHaveBeenCalledTimes(1)
      })

      expect(submitActivityFormAction.execute).toHaveBeenCalledWith({
        activityId: undefined,
        activityDate: new Date('2020-06-06'),
        values: {
          startTime: '10:00',
          endTime: '10:30',
          description: 'Lorem ipsum',
          billable: false,
          organization: undefined,
          project: undefined,
          role: undefined,
          recentRole: {
            date: '2020-06-06T00:00:00.000Z',
            id: 101,
            name: 'Junior',
            organizationName: 'Viajes XL',
            projectBillable: false,
            projectName: 'Marketing',
            requireEvidence: false
          },
          imageBase64: null,
          showRecentRole: true
        }
      })
    })

    it('should show notification error if create request fails', async () => {
      const submitActivityFormAction = mock<SubmitActivityFormAction>()
      container.registerInstance(SubmitActivityFormAction, submitActivityFormAction)
      submitActivityFormAction.execute.mockRejectedValue(createAxiosError(408))

      const { mockOnAfterSubmit } = setup()

      userEvent.type(screen.getByLabelText('activity_form.start_time'), '10:00')
      userEvent.type(screen.getByLabelText('activity_form.end_time'), '10:30')
      userEvent.type(screen.getByLabelText('activity_form.description'), 'Lorem ipsum')

      userEvent.click(screen.getByRole('button', { name: /save/i }))

      await waitForNotification(408)

      expect(mockOnAfterSubmit).not.toHaveBeenCalledTimes(1)
      expect(submitActivityFormAction.execute).toHaveBeenCalledWith({
        activityId: undefined,
        activityDate: new Date('2020-06-06'),
        values: {
          startTime: '10:00',
          endTime: '10:30',
          description: 'Lorem ipsum',
          billable: false,
          organization: undefined,
          project: undefined,
          role: undefined,
          recentRole: {
            date: '2020-06-06T00:00:00.000Z',
            id: 101,
            name: 'Junior',
            organizationName: 'Viajes XL',
            projectBillable: false,
            projectName: 'Marketing',
            requireEvidence: false
          },
          imageBase64: null,
          showRecentRole: true
        }
      })
    })
  })

  describe('Update an activity', () => {
    it('should update an activity using recent roles list', async () => {
      const submitActivityFormAction = mock<SubmitActivityFormAction>()
      container.registerInstance(SubmitActivityFormAction, submitActivityFormAction)
      submitActivityFormAction.execute.mockResolvedValue()

      const activityToEdit = mockActivity({
        id: 10,
        startDate: chrono('2020-01-01T09:15:00').getDate(),
        duration: 110,
        billable: false,
        organization: buildOrganization({ id: 20 }),
        project: buildProject({ id: 100 }),
        projectRole: {
          id: 100,
          name: 'Role name',
          requireEvidence: true
        }
      })

      const newActivity = {
        ...activityToEdit,
        description: 'Description changed'
      }

      const { mockOnAfterSubmit } = await setup(activityToEdit)

      // Check fields
      expect(screen.getByLabelText('activity_form.start_time')).toHaveValue('09:15')
      expect(screen.getByLabelText('activity_form.end_time')).toHaveValue('11:05')
      expect(screen.getByTestId('role_100')).toBeChecked()
      expect(screen.getByLabelText('activity_form.billable')).not.toBeChecked()
      expect(screen.getByLabelText('activity_form.description')).toHaveValue(
        activityToEdit.description
      )

      // Change fields
      userEvent.type(screen.getByLabelText('activity_form.description'), newActivity.description)

      userEvent.click(screen.getByRole('button', { name: /save/i }))

      await waitFor(() => {
        expect(mockOnAfterSubmit).toHaveBeenCalledTimes(1)
      })

      expect(submitActivityFormAction.execute).toHaveBeenCalledWith({
        activityId: 10,
        activityDate: new Date('2020-06-06'),
        values: {
          billable: false,
          description: 'Lorem Ipsum...Description changed',
          startTime: '09:15',
          endTime: '11:05',
          imageBase64: null,
          organization: {
            id: 20,
            name: 'Test Organization Name'
          },
          showRecentRole: true,
          project: {
            id: 100,
            billable: false,
            name: 'Test Project Name',
            open: true
          },
          recentRole: {
            date: '2020-01-30T00:00:00Z',
            id: 100,
            name: 'Senior',
            organizationName: 'Viajes XL',
            projectBillable: true,
            projectName: 'Marketing',
            requireEvidence: true
          },
          role: {
            id: 100,
            name: 'Role name',
            requireEvidence: true
          }
        }
      })
    })

    it('should show notification error if update request fails', async () => {
      const submitActivityFormAction = mock<SubmitActivityFormAction>()
      container.registerInstance(SubmitActivityFormAction, submitActivityFormAction)
      submitActivityFormAction.execute.mockRejectedValue(createAxiosError(408))

      const activityToEdit = mockActivity({
        id: 10,
        startDate: chrono('2020-01-01T09:15:00').getDate(),
        duration: 110,
        billable: false,
        organization: buildOrganization({ id: 20 }),
        project: buildProject({ id: 100 }),
        projectRole: {
          id: 100,
          name: 'Role name',
          requireEvidence: true
        }
      })

      const newActivity = {
        ...activityToEdit,
        description: 'Description changed'
      }

      const { mockOnAfterSubmit } = await setup(activityToEdit)

      // Change fields
      userEvent.type(screen.getByLabelText('activity_form.description'), newActivity.description)

      userEvent.click(screen.getByRole('button', { name: /save/i }))

      await waitForNotification(408)

      expect(mockOnAfterSubmit).not.toHaveBeenCalledTimes(1)
      expect(submitActivityFormAction.execute).toHaveBeenCalledWith({
        activityId: 10,
        activityDate: new Date('2020-06-06'),
        values: {
          billable: false,
          description: 'Lorem Ipsum...Description changed',
          startTime: '09:15',
          endTime: '11:05',
          imageBase64: null,
          organization: {
            id: 20,
            name: 'Test Organization Name'
          },
          showRecentRole: true,
          project: {
            id: 100,
            billable: false,
            name: 'Test Project Name',
            open: true
          },
          recentRole: {
            date: '2020-01-30T00:00:00Z',
            id: 100,
            name: 'Senior',
            organizationName: 'Viajes XL',
            projectBillable: true,
            projectName: 'Marketing',
            requireEvidence: true
          },
          role: {
            id: 100,
            name: 'Role name',
            requireEvidence: true
          }
        }
      })
    })
  })

  describe('Delete an activity', () => {
    it('should delete the activity', async () => {
      const activitiesRepository = mock<ActivitiesRepository>()
      container.registerInstance(ActivitiesRepository, activitiesRepository)
      activitiesRepository.deleteActivity.mockResolvedValue()

      const activityToDelete = mockActivity({
        id: 100,
        projectRole: mockProjectRole({ id: 100 })
      })

      const { mockOnAfterSubmit } = await setup(activityToDelete)

      userEvent.click(screen.getByText('actions.remove'))

      const yesModalButton = await screen.findByText('activity_form.remove_activity')
      userEvent.click(yesModalButton)

      await waitForElementToBeRemoved(yesModalButton)

      expect(mockOnAfterSubmit).toHaveBeenCalled()
      expect(activitiesRepository.deleteActivity).toHaveBeenCalledWith(100)
    })

    it('should show a notification error if delete request fails', async () => {
      const activitiesRepository = mock<ActivitiesRepository>()
      container.registerInstance(ActivitiesRepository, activitiesRepository)
      activitiesRepository.deleteActivity.mockRejectedValue(createAxiosError(408))

      const activityToDelete = mockActivity({
        id: 100,
        projectRole: mockProjectRole({ id: 100 })
      })

      const { mockOnAfterSubmit } = await setup(activityToDelete)

      userEvent.click(screen.getByText('actions.remove'))

      const yesModalButton = await screen.findByText('activity_form.remove_activity')
      userEvent.click(yesModalButton)

      await waitForNotification(408)

      expect(yesModalButton).toBeInTheDocument()

      expect(mockOnAfterSubmit).not.toHaveBeenCalled()
      expect(activitiesRepository.deleteActivity).toHaveBeenCalledWith(100)
    })

    it('should NOT delete the activity if the user cancel the delete operation', async () => {
      const activityToDelete = mockActivity({
        id: 100,
        projectRole: mockProjectRole({ id: 100 })
      })

      const { mockOnAfterSubmit } = await setup(activityToDelete)

      userEvent.click(screen.getByText('actions.remove'))

      const noModalButton = await screen.findByText('actions.cancel')
      userEvent.click(noModalButton)

      await waitForElementToBeRemoved(noModalButton)

      expect(mockOnAfterSubmit).not.toHaveBeenCalled()
      expect(screen.getByText('actions.remove')).toBeInTheDocument()
    })
  })

  describe('Activity errors', () => {
    it('should show a notification when the activity time overlaps', async () => {
      const submitActivityFormAction = mock<SubmitActivityFormAction>()
      container.registerInstance(SubmitActivityFormAction, submitActivityFormAction)
      submitActivityFormAction.execute.mockRejectedValue(
        createAxiosError(400, { data: { code: 'ACTIVITY_TIME_OVERLAPS' } })
      )

      const activityToEdit = mockActivity({
        id: 10,
        startDate: chrono('2020-01-01T09:15:00').getDate(),
        duration: 110,
        billable: false,
        organization: buildOrganization({ id: 20 }),
        project: buildProject({ id: 100 }),
        projectRole: {
          id: 100,
          name: 'Role name',
          requireEvidence: true
        }
      })

      const newActivity = {
        ...activityToEdit,
        description: 'Description changed'
      }

      const { mockOnAfterSubmit } = await setup(activityToEdit)

      // Change fields
      userEvent.type(screen.getByLabelText('activity_form.description'), newActivity.description)

      userEvent.click(screen.getByRole('button', { name: /save/i }))

      await waitForNotification({
        title: 'activity_api_errors.time_overlaps_title',
        description: 'activity_api_errors.time_overlaps_description'
      })

      expect(mockOnAfterSubmit).not.toHaveBeenCalledTimes(1)
      expect(submitActivityFormAction.execute).toHaveBeenCalledWith({
        activityId: 10,
        activityDate: new Date('2020-06-06'),
        values: {
          billable: false,
          description: 'Lorem Ipsum...Description changed',
          startTime: '09:15',
          endTime: '11:05',
          imageBase64: null,
          organization: {
            id: 20,
            name: 'Test Organization Name'
          },
          showRecentRole: true,
          project: {
            id: 100,
            billable: false,
            name: 'Test Project Name',
            open: true
          },
          recentRole: {
            date: '2020-01-30T00:00:00Z',
            id: 100,
            name: 'Senior',
            organizationName: 'Viajes XL',
            projectBillable: true,
            projectName: 'Marketing',
            requireEvidence: true
          },
          role: {
            id: 100,
            name: 'Role name',
            requireEvidence: true
          }
        }
      })
    })

    it("should show a notification when the activity's project is closed", async () => {
      const submitActivityFormAction = mock<SubmitActivityFormAction>()
      container.registerInstance(SubmitActivityFormAction, submitActivityFormAction)
      submitActivityFormAction.execute.mockRejectedValue(
        createAxiosError(400, { data: { code: 'CLOSED_PROJECT' } })
      )

      const activityToEdit = mockActivity({
        id: 10,
        startDate: chrono('2020-01-01T09:15:00').getDate(),
        duration: 110,
        billable: false,
        organization: buildOrganization({ id: 20 }),
        project: buildProject({ id: 100 }),
        projectRole: {
          id: 100,
          name: 'Role name',
          requireEvidence: true
        }
      })

      const newActivity = {
        ...activityToEdit,
        description: 'Description changed'
      }

      const { mockOnAfterSubmit } = await setup(activityToEdit)

      // Change fields
      userEvent.type(screen.getByLabelText('activity_form.description'), newActivity.description)

      userEvent.click(screen.getByRole('button', { name: /save/i }))

      // await waitFor(() => {
      //   expect(screen.getByText('activity_api_errors.closed_project_title')).toBeInTheDocument()
      //   expect(screen.getByText('activity_api_errors.closed_project_description')).toBeInTheDocument()
      // })

      await waitForNotification({
        title: 'activity_api_errors.closed_project_title',
        description: 'activity_api_errors.closed_project_description'
      })

      expect(mockOnAfterSubmit).not.toHaveBeenCalledTimes(1)
      expect(submitActivityFormAction.execute).toHaveBeenCalledWith({
        activityId: 10,
        activityDate: new Date('2020-06-06'),
        values: {
          billable: false,
          description: 'Lorem Ipsum...Description changed',
          startTime: '09:15',
          endTime: '11:05',
          imageBase64: null,
          organization: {
            id: 20,
            name: 'Test Organization Name'
          },
          showRecentRole: true,
          project: {
            id: 100,
            billable: false,
            name: 'Test Project Name',
            open: true
          },
          recentRole: {
            date: '2020-01-30T00:00:00Z',
            id: 100,
            name: 'Senior',
            organizationName: 'Viajes XL',
            projectBillable: true,
            projectName: 'Marketing',
            requireEvidence: true
          },
          role: {
            id: 100,
            name: 'Role name',
            requireEvidence: true
          }
        }
      })
    })

    it("should show a notification when the activity's period is closed", async () => {
      const submitActivityFormAction = mock<SubmitActivityFormAction>()
      container.registerInstance(SubmitActivityFormAction, submitActivityFormAction)
      submitActivityFormAction.execute.mockRejectedValue(
        createAxiosError(400, { data: { code: 'ACTIVITY_PERIOD_CLOSED' } })
      )

      const activityToEdit = mockActivity({
        id: 10,
        startDate: chrono('2020-01-01T09:15:00').getDate(),
        duration: 110,
        billable: false,
        organization: buildOrganization({ id: 20 }),
        project: buildProject({ id: 100 }),
        projectRole: {
          id: 100,
          name: 'Role name',
          requireEvidence: true
        }
      })

      const newActivity = {
        ...activityToEdit,
        description: 'Description changed'
      }

      const { mockOnAfterSubmit } = await setup(activityToEdit)

      // Change fields
      userEvent.type(screen.getByLabelText('activity_form.description'), newActivity.description)

      userEvent.click(screen.getByRole('button', { name: /save/i }))

      await waitForNotification({
        title: 'activity_api_errors.activity_closed_period_title',
        description: 'activity_api_errors.activity_closed_period_description'
      })

      expect(mockOnAfterSubmit).not.toHaveBeenCalledTimes(1)
      expect(submitActivityFormAction.execute).toHaveBeenCalledWith({
        activityId: 10,
        activityDate: new Date('2020-06-06'),
        values: {
          billable: false,
          description: 'Lorem Ipsum...Description changed',
          startTime: '09:15',
          endTime: '11:05',
          imageBase64: null,
          organization: {
            id: 20,
            name: 'Test Organization Name'
          },
          showRecentRole: true,
          project: {
            id: 100,
            billable: false,
            name: 'Test Project Name',
            open: true
          },
          recentRole: {
            date: '2020-01-30T00:00:00Z',
            id: 100,
            name: 'Senior',
            organizationName: 'Viajes XL',
            projectBillable: true,
            projectName: 'Marketing',
            requireEvidence: true
          },
          role: {
            id: 100,
            name: 'Role name',
            requireEvidence: true
          }
        }
      })
    })

    it("should show a notification when the activity's period is before hiring", async () => {
      const submitActivityFormAction = mock<SubmitActivityFormAction>()
      container.registerInstance(SubmitActivityFormAction, submitActivityFormAction)
      submitActivityFormAction.execute.mockRejectedValue(
        createAxiosError(400, { data: { code: 'ACTIVITY_BEFORE_HIRING_DATE' } })
      )

      const activityToEdit = mockActivity({
        id: 10,
        startDate: chrono('2010-01-01T09:15:00').getDate(),
        duration: 110,
        billable: false,
        organization: buildOrganization({ id: 20 }),
        project: buildProject({ id: 100 }),
        projectRole: {
          id: 100,
          name: 'Role name',
          requireEvidence: true
        }
      })

      const newActivity = {
        ...activityToEdit,
        description: 'Description changed'
      }

      const { mockOnAfterSubmit } = await setup(activityToEdit)

      // Change fields
      userEvent.type(screen.getByLabelText('activity_form.description'), newActivity.description)

      userEvent.click(screen.getByRole('button', { name: /save/i }))

      await waitForNotification({
        title: 'activity_api_errors.activity_before_hiring_date_title',
        description: 'activity_api_errors.activity_before_hiring_date_description'
      })

      expect(mockOnAfterSubmit).not.toHaveBeenCalledTimes(1)
    })

    describe('With recent roles section', function () {
      it('should select the last recent role when the user create a new activity', async () => {
        await setup()

        // API returns the project roles ordered by date
        expect(screen.getByTestId('role_101')).toBeChecked()
      })

      it('should update the billable field selecting another recent role', async () => {
        await setup()

        // Billable field is not checked because by default gets the billable value of the last recent role
        expect(screen.getByLabelText('activity_form.billable')).not.toBeChecked()

        const billableRecentRoleElement = screen.getByLabelText(/Senior/i)
        userEvent.click(billableRecentRoleElement)

        expect(screen.getByLabelText('activity_form.billable')).toBeChecked()
      })

      it('should reset the state of billable field and select combos when the user toggles recent roles on and off', async () => {
        setup()

        // Show selects
        userEvent.click(screen.getByText('activity_form.add_role'))

        // Select organization, project and role
        await selectComboboxOption('activity_form.organization', 'Grupo QSK')
        await selectComboboxOption('activity_form.project', 'Developer')
        await selectComboboxOption('activity_form.role', 'Scrum master')

        // Back to recent roles
        userEvent.click(screen.getByText('activity_form.back_to_recent_roles'))

        // Expect that last recent role is selected and billable field is not checked
        expect(screen.getByTestId('role_100')).not.toBeChecked()
        expect(screen.getByLabelText('activity_form.billable')).not.toBeChecked()

        // Show select combos again
        userEvent.click(screen.getByText('activity_form.add_role'))

        await waitFor(() => {
          expect(combosRepository.getOrganizations).toHaveBeenCalledTimes(2)
        })

        // Expect that the select fields are empty
        expect(screen.getByLabelText('activity_form.organization')).toHaveValue('')
        expect(screen.getByLabelText('activity_form.project')).toHaveValue('')
        expect(screen.getByLabelText('activity_form.role')).toHaveValue('')
      }, 10_000)
    })

    it('when the role does not exist in recent role list should allow the user to update the activity role selecting the most recent role', async () => {
      const activity = mockActivity()

      setup(activity)

      await waitForLoadingToFinish()

      expect(screen.getByLabelText('activity_form.organization')).toHaveValue(
        activity.organization.name
      )
      expect(screen.getByLabelText('activity_form.project')).toHaveValue(activity.project.name)
      expect(screen.getByLabelText('activity_form.role')).toHaveValue(activity.projectRole.name)

      userEvent.click(screen.getByText('activity_form.back_to_recent_roles'))

      // We know that the API always return the most recent role in the first position of the list
      expect(screen.getByTestId('role_101')).toBeChecked()
      expect(screen.getByLabelText('activity_form.billable')).not.toBeChecked()
    })
  })

  describe('Without recent roles section', () => {
    let combosRepository: MockProxy<CombosRepository>

    beforeEach(() => {
      const binnacleState = container.resolve(BinnacleState)
      binnacleState.recentRoles = []

      combosRepository = mock<CombosRepository>()
      container.registerInstance(CombosRepository, combosRepository)

      combosRepository.getOrganizations.mockResolvedValue([
        {
          id: 1,
          name: 'Viajes XL'
        }
      ])

      combosRepository.getProjects.mockResolvedValue([
        {
          id: 1,
          name: 'Marketing',
          billable: true,
          open: true
        }
      ])

      combosRepository.getProjectRoles.mockResolvedValue([
        {
          id: 1,
          name: 'Senior',
          requireEvidence: false
        }
      ])
    })

    it('should validate fields', async () => {
      setup()

      await waitForLoadingToFinish()

      userEvent.type(screen.getByLabelText('activity_form.start_time'), '09:00')
      userEvent.type(screen.getByLabelText('activity_form.end_time'), '07:30')

      userEvent.click(screen.getByRole('button', { name: /save/i }))

      await waitFor(() => {
        expect(screen.getByText('form_errors.end_time_greater')).toBeInTheDocument()
      })

      // Clear both time fields
      userEvent.clear(screen.getByLabelText('activity_form.start_time'))
      userEvent.clear(screen.getByLabelText('activity_form.end_time'))

      userEvent.click(screen.getByRole('button', { name: /save/i }))

      await waitFor(() => {
        expect(screen.getAllByText('form_errors.select_an_option').length).toBe(1)

        // start time, end time and description
        expect(screen.getAllByText('form_errors.field_required').length).toBe(3)
      })
    })

    it("should display select combos filled with the activity's data when it's role has not been found in recent roles list", async () => {
      const activity = mockActivity()

      setup(activity)

      await waitForLoadingToFinish()

      expect(screen.getByLabelText('activity_form.organization')).toHaveValue(
        activity.organization.name
      )
      expect(screen.getByLabelText('activity_form.project')).toHaveValue(activity.project.name)
      expect(screen.getByLabelText('activity_form.role')).toHaveValue(activity.projectRole.name)
    })

    it('should update billable field selecting the role', async () => {
      setup()

      expect(screen.getByLabelText('activity_form.billable')).not.toBeChecked()

      await selectComboboxOption('activity_form.organization', 'Viajes XL')
      await selectComboboxOption('activity_form.project', 'Marketing')
      await waitFor(() => expect(combosRepository.getProjectRoles).toHaveBeenCalled())

      expect(screen.getByLabelText('activity_form.billable')).toBeChecked()
    })

    it('should display select combos when the user makes his first-ever imputation', async () => {
      setup()

      await waitForLoadingToFinish()

      expect(screen.getByText('activity_form.select_role')).toBeInTheDocument()
    })

    it('should create activity selecting a role', async () => {
      const submitActivityFormAction = mock<SubmitActivityFormAction>()
      container.registerInstance(SubmitActivityFormAction, submitActivityFormAction)
      submitActivityFormAction.execute.mockResolvedValue()

      const { mockOnAfterSubmit } = setup()

      userEvent.type(screen.getByLabelText('activity_form.start_time'), '10:00')
      userEvent.type(screen.getByLabelText('activity_form.end_time'), '10:30')
      userEvent.type(screen.getByLabelText('activity_form.description'), 'Lorem ipsum')

      await selectComboboxOption('activity_form.organization', 'Viajes XL')
      await selectComboboxOption('activity_form.project', 'Marketing')
      await selectComboboxOption('activity_form.role', 'Senior')

      userEvent.click(screen.getByRole('button', { name: /save/i }))

      await waitFor(() => {
        expect(mockOnAfterSubmit).toHaveBeenCalledTimes(1)
      })

      expect(submitActivityFormAction.execute).toHaveBeenCalledWith({
        activityId: undefined,
        activityDate: new Date('2020-06-06'),
        values: {
          startTime: '10:00',
          endTime: '10:30',
          description: 'Lorem ipsum',
          billable: true,
          organization: { id: 1, name: 'Viajes XL' },
          project: { billable: true, id: 1, name: 'Marketing', open: true },
          role: { id: 1, name: 'Senior', requireEvidence: false },
          recentRole: undefined,
          imageBase64: null,
          showRecentRole: false
        }
      })
    })
  })

  describe('Image actions', () => {
    it('should upload an image and perform actions', async () => {
      await setup()

      const file = new File(['(⌐□_□)'], 'test.jpg', {
        type: 'image/jpg'
      })

      const uploadImgButton = screen.getByTestId('upload_img')
      userEvent.upload(uploadImgButton, file)

      const openImgButton = await screen.findByTestId('open-image')
      expect(openImgButton).toBeInTheDocument()

      const openMock = jest.fn()
      window.open = openMock

      userEvent.click(openImgButton)
      expect(openMock).toHaveBeenCalled()

      const deleteImgButton = screen.getByTestId('delete-image')
      userEvent.click(deleteImgButton)

      expect(deleteImgButton).not.toBeInTheDocument()
      expect(openImgButton).not.toBeInTheDocument()
      expect(uploadImgButton).toBeInTheDocument()
    })

    it('should download the image base64 when the user wants to see the image', async () => {
      const activitiesRepository = mock<ActivitiesRepository>()
      container.registerInstance(ActivitiesRepository, activitiesRepository)
      activitiesRepository.getActivityImage.mockResolvedValue('mocked-image')

      const activity = mockActivity({
        id: 10,
        startDate: chrono('2020-01-01T09:15:00').getDate(),
        duration: 110,
        billable: false,
        organization: buildOrganization({ id: 20 }),
        project: buildProject({ id: 30 }),
        projectRole: {
          id: 100,
          name: 'Role name',
          requireEvidence: true
        },
        hasImage: true
      })

      await setup(activity)

      const openImgButton = await screen.findByTestId('open-image')

      const openMock = jest.fn()
      window.open = openMock

      userEvent.click(openImgButton)

      await waitFor(() => {
        expect(openMock).toHaveBeenCalledTimes(1)
      })

      expect(activitiesRepository.getActivityImage).toHaveBeenCalledWith(activity.id)
    })

    it('should show a notification when get image request fails', async () => {
      const activitiesRepository = mock<ActivitiesRepository>()
      container.registerInstance(ActivitiesRepository, activitiesRepository)
      activitiesRepository.getActivityImage.mockRejectedValue(createAxiosError(408))

      const activity = mockActivity({
        id: 10,
        startDate: chrono('2020-01-01T09:15:00').getDate(),
        duration: 110,
        billable: false,
        organization: buildOrganization({ id: 20 }),
        project: buildProject({ id: 30 }),
        projectRole: {
          id: 100,
          name: 'Role name',
          requireEvidence: true
        },
        hasImage: true
      })

      setup(activity)

      const openImgButton = await screen.findByTestId('open-image')

      const openMock = jest.fn()
      window.open = openMock

      userEvent.click(openImgButton)

      await waitForNotification(408)

      expect(openMock).not.toHaveBeenCalledTimes(1)
      expect(activitiesRepository.getActivityImage).toHaveBeenCalledWith(activity.id)
    })
  })
})

function setup(activity: Activity | undefined = undefined) {
  const activityFormState = container.resolve(ActivityFormState)
  activityFormState.activity = activity

  const date = chrono.now()
  const mockOnAfterSubmit = jest.fn()

  render(
    <ActivityFormProvider activity={activity} date={date} onAfterSubmit={mockOnAfterSubmit}>
      <Fragment>
        <ActivityForm />
        {activity && <RemoveActivityButton activity={activity} onDeleted={mockOnAfterSubmit} />}
        <SubmitButton formId={ACTIVITY_FORM_ID}>Save</SubmitButton>
      </Fragment>
    </ActivityFormProvider>
  )

  return {
    mockOnAfterSubmit
  }
}

async function selectComboboxOption(
  label: 'activity_form.organization' | 'activity_form.project' | 'activity_form.role',
  optionText: string
) {
  // userEvent.type(screen.getByLabelText(label), optionText)
  const option = await screen.findByText(optionText)
  userEvent.click(option)

  expect(screen.getByLabelText(label)).toHaveValue(optionText)
  // expect(screen.getByLabelText(label)).toHaveAttribute('aria-expanded', 'false')
}
