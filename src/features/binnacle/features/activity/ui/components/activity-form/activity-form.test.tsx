import { SubmitButton } from '../../../../../../../shared/components/form-fields/submit-button'
import { chrono } from '../../../../../../../shared/utils/chrono'
import {
  act,
  render,
  screen,
  userEvent,
  waitFor,
  waitForElementToBeRemoved
} from '../../../../../../../test-utils/render'
import { OrganizationMother } from '../../../../../../../test-utils/mothers/organization-mother'
import { LiteProjectMother } from '../../../../../../../test-utils/mothers/lite-project-mother'
import { ProjectRoleMother } from '../../../../../../../test-utils/mothers/project-role-mother'
import { useExecuteUseCaseOnMount } from '../../../../../../../shared/arch/hooks/use-execute-use-case-on-mount'
import { useGetUseCase } from '../../../../../../../shared/arch/hooks/use-get-use-case'
import { useResolve } from '../../../../../../../shared/di/use-resolve'
import { ActivityMother } from '../../../../../../../test-utils/mothers/activity-mother'
import { UserSettingsMother } from '../../../../../../../test-utils/mothers/user-settings-mother'
import { ProjectRole } from '../../../../project-role/domain/project-role'
import { Activity } from '../../../domain/activity'
import { ACTIVITY_FORM_ID, ActivityForm } from './activity-form'
import { RemoveActivityButton } from './components/remove-activity-button'

jest.mock('../../../../../../../shared/di/use-resolve')
jest.mock('../../../../../../../shared/arch/hooks/use-get-use-case')
jest.mock('../../../../../../../shared/arch/hooks/use-execute-use-case-on-mount')

describe.skip('ActivityForm', () => {
  describe('Create an activity', () => {
    it('should create an activity', async () => {
      const { useCaseSpy, useResolveSpy, onAfterSubmit, onSubmit } = setup()
      const today = new Date()

      await act(async () => {
        await userEvent.type(screen.getByLabelText('activity_form.description'), 'Lorem ipsum')
        await userEvent.click(screen.getByRole('button', { name: /save/i }))
      })

      await waitFor(() => {
        expect(onSubmit).toBeCalledTimes(1)
        expect(useCaseSpy.execute).toHaveBeenCalledTimes(1)
      })

      expect(useCaseSpy.execute).toHaveBeenCalledWith(
        {
          billable: true,
          description: 'Lorem ipsum',
          hasEvidences: false,
          evidence: undefined,
          interval: {
            end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 13, 0, 0),
            start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0, 0)
          },
          projectRoleId: 1
        },
        {
          errorMessage: useResolveSpy.get,
          showToastError: true,
          successMessage: 'activity_form.create_activity_notification'
        }
      )
      expect(onAfterSubmit).toBeCalledTimes(1)
    })

    it('should error if create request fails', async () => {
      const { useCaseSpy, onSubmitError } = setup()

      useCaseSpy.execute.mockImplementation(() => {
        return Promise.reject()
      })

      await act(async () => {
        await userEvent.type(screen.getByLabelText('activity_form.description'), 'Lorem ipsum')
        await userEvent.click(screen.getByRole('button', { name: /save/i }))
      })

      await waitFor(() => {
        expect(useCaseSpy.execute).toHaveBeenCalledTimes(1)
      })

      expect(useCaseSpy.execute).toHaveBeenCalled()
      expect(onSubmitError).toHaveBeenCalled()
    })
  })

  describe('Update an activity', () => {
    const assertRoleCardContainText = (roleCard: HTMLElement | null, text: string) => {
      expect(roleCard).toContainElement(screen.getByText(text))
    }

    it('should be a recent role based on the activity', async () => {
      const activity = ActivityMother.daysActivityWithoutEvidencePending()
      const projectRole = ProjectRoleMother.projectRoleInDaysRequireApproval()
      setup(activity, [projectRole])

      const recentRolesHeading = screen.getByText('activity_form.recent_roles')
      expect(recentRolesHeading).toBeInTheDocument()

      const recentRoleCard = screen.getByText(activity.projectRole.name).closest('label')
      await waitFor(() => {
        assertRoleCardContainText(recentRoleCard, activity.projectRole.name)
        assertRoleCardContainText(recentRoleCard, activity.organization.name)
        assertRoleCardContainText(recentRoleCard, 'No billable project')
      })
    })

    it('should update an activity using recent roles list', async () => {
      const activityToEdit = ActivityMother.minutesBillableActivityWithoutEvidence()
      const projectRole = ProjectRoleMother.projectRoleInMinutes()

      const newActivity = {
        ...activityToEdit,
        description: 'Description changed'
      }

      const { useCaseSpy } = setup(activityToEdit, [projectRole])

      expect(screen.getByTestId('startTime_field')).toHaveValue('09:00')
      expect(screen.getByTestId('endTime_field')).toHaveValue('13:00')
      expect(screen.getByTestId('role_1')).toBeChecked()
      expect(screen.getByLabelText('activity_form.billable')).toBeChecked()
      expect(screen.getByLabelText('activity_form.description')).toHaveValue(
        activityToEdit.description
      )

      await act(async () => {
        await userEvent.type(
          screen.getByLabelText('activity_form.description'),
          newActivity.description
        )
        await userEvent.click(screen.getByRole('button', { name: /save/i }))
      })

      await waitFor(() => {
        expect(useCaseSpy.execute).toHaveBeenCalledTimes(1)
      })
    })

    it('should show an error if update request fails', async () => {
      jest.useFakeTimers().setSystemTime(new Date('2023-06-07'))
      const activityToEdit = ActivityMother.minutesBillableActivityWithoutEvidence()
      const projectRole = ProjectRoleMother.projectRoleInMinutes()
      const newActivity = {
        ...activityToEdit,
        description: ' Description changed'
      }
      const { useCaseSpy, onSubmitError, useResolveSpy } = setup(activityToEdit, [projectRole])

      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })

      useCaseSpy.execute.mockImplementation(() => {
        return Promise.reject()
      })

      await act(async () => {
        await user.type(screen.getByLabelText('activity_form.description'), newActivity.description)
        await user.click(screen.getByRole('button', { name: /save/i }))
      })

      await waitFor(() => {
        expect(useCaseSpy.execute).toHaveBeenCalledTimes(1)
      })

      expect(useCaseSpy.execute).toHaveBeenCalledWith(
        {
          id: 1,
          description: 'Minutes activity Description changed',
          evidence: undefined,
          billable: true,
          hasEvidences: false,
          interval: {
            end: new Date('2023-06-07T13:00:00.000Z'),
            start: new Date('2023-06-07T09:00:00.000Z')
          },
          projectRoleId: 1
        },
        {
          errorMessage: useResolveSpy.get,
          showToastError: true,
          successMessage: 'activity_form.update_activity_notification'
        }
      )
      expect(onSubmitError).toHaveBeenCalledTimes(1)
    })
  })

  describe('Delete an activity', () => {
    it('should delete the activity', async () => {
      const activityToDelete = ActivityMother.minutesBillableActivityWithoutEvidence()

      const { onCloseSpy, useCaseSpy, useResolveSpy } = setup(activityToDelete)

      await act(async () => {
        await userEvent.click(screen.getByText('actions.remove'))
      })

      const removeModalButton = await screen.findByText('activity_form.remove_activity')

      await act(async () => {
        await userEvent.click(removeModalButton)
      })

      await waitForElementToBeRemoved(removeModalButton)

      await waitFor(() => {
        expect(useCaseSpy.execute).toHaveBeenCalledWith(1, {
          successMessage: 'activity_form.remove_activity_notification',
          showToastError: true,
          errorMessage: useResolveSpy.get
        })
        expect(onCloseSpy).toHaveBeenCalled()
      })
    })

    it('should close the modal if delete request fails', async () => {
      const activityToDelete = ActivityMother.minutesBillableActivityWithoutEvidence()

      const { useCaseSpy, onCloseSpy, useResolveSpy } = setup(activityToDelete)

      await act(async () => {
        await userEvent.click(screen.getByText('actions.remove'))
      })

      const removeModalButton = await screen.findByText('activity_form.remove_activity')

      await act(async () => {
        await userEvent.click(removeModalButton)
      })

      await waitForElementToBeRemoved(removeModalButton)

      useCaseSpy.execute.mockImplementation(() => {
        return Promise.reject()
      })

      await waitFor(() => {
        expect(useCaseSpy.execute).toHaveBeenCalledWith(1, {
          successMessage: 'activity_form.remove_activity_notification',
          showToastError: true,
          errorMessage: useResolveSpy.get
        })
        expect(onCloseSpy).toHaveBeenCalled()
        expect(removeModalButton).not.toBeInTheDocument()
      })
    })

    it('should NOT delete the activity if the user cancel the delete operation', async () => {
      const activityToDelete = ActivityMother.minutesBillableActivityWithoutEvidence()

      const { onCloseSpy } = setup(activityToDelete)

      await act(async () => {
        await userEvent.click(screen.getByText('actions.remove'))
      })

      const noModalButton = await screen.findByText('actions.cancel')

      await act(async () => {
        await userEvent.click(noModalButton)
      })

      await waitForElementToBeRemoved(noModalButton)

      await waitFor(() => {
        expect(onCloseSpy).not.toHaveBeenCalled()
        expect(screen.getByText('actions.remove')).toBeInTheDocument()
      })
    })
  })

  describe('With recent roles section', () => {
    it('should update the billable field selecting another recent role', async () => {
      const projectRole = ProjectRoleMother.projectRoles()
      setup(undefined, projectRole)

      // Billable field is not checked because by default gets the billable value of the last recent role
      expect(screen.getByLabelText('activity_form.billable')).toBeChecked()

      const billableRecentRoleElement = screen.getByLabelText(/Project in days 2/i)

      await act(async () => {
        await userEvent.click(billableRecentRoleElement)
      })

      await waitFor(() => {
        expect(screen.getByLabelText('activity_form.billable')).not.toBeChecked()
      })
    })

    it('should reset the state of billable field and select combos when the user toggles recent roles on and off', async () => {
      const projectRole = ProjectRoleMother.projectRoles()
      setup(undefined, projectRole)

      await act(async () => {
        // Show selects
        await userEvent.click(screen.getByText('activity_form.add_role'))

        // Select organization, project and role
        await userEvent.type(screen.getByTestId('organization_field'), 'Test organization')
        await userEvent.type(screen.getByTestId('project_field'), 'Developer')
        await userEvent.type(screen.getByTestId('projectRole_field'), 'Scrum master')

        // Back to recent roles
        await userEvent.click(screen.getByText('activity_form.back_to_recent_roles'))
      })

      // Expect that last recent role is selected and billable field is not checked
      expect(screen.getByTestId('role_1')).toBeChecked()
      expect(screen.getByLabelText('activity_form.billable')).toBeChecked()

      await act(async () => {
        // Show select combos again
        await userEvent.click(screen.getByText('activity_form.add_role'))
      })

      // Expect that the select fields are empty
      expect(screen.getByTestId('organization_field')).toHaveValue('')
      expect(screen.getByTestId('project_field')).toHaveValue('')
      expect(screen.getByTestId('projectRole_field')).toHaveValue('')
    }, 10_000)
  })

  describe('Without recent roles section', () => {
    it('should update billable field selecting the role', async () => {
      const activity = ActivityMother.minutesBillableActivityWithoutEvidence()
      setup(activity)

      await act(async () => {
        await userEvent.click(screen.getByText('activity_form.add_role'))
        await selectComboboxOption('organization_field', 'Test organization')
        await selectComboboxOption('project_field', 'Billable project')
        await selectComboboxOption('projectRole_field', 'Project in minutes')
      })

      expect(screen.getByLabelText('activity_form.billable')).toBeChecked()
    })

    it('should display select combos when the user makes his first-ever imputation', async () => {
      setup()
      await act(async () => {
        await userEvent.click(screen.getByText('activity_form.add_role'))
      })
      expect(screen.getByText('activity_form.select_role')).toBeInTheDocument()
    })

    it('should create activity selecting a role', async () => {
      const today = new Date()

      const { useCaseSpy, useResolveSpy } = setup()
      await act(async () => {})

      await act(async () => {
        await userEvent.type(screen.getByLabelText('activity_form.description'), 'Lorem ipsum')
        await userEvent.click(screen.getByText('activity_form.add_role'))
        await selectComboboxOption('organization_field', 'Test organization')
        await selectComboboxOption('project_field', 'Billable project')
        await selectComboboxOption('projectRole_field', 'Project in minutes')
        await userEvent.click(screen.getByRole('button', { name: /save/i }))
      })

      await waitFor(() => {
        expect(useCaseSpy.execute).toHaveBeenCalledTimes(1)
      })

      expect(useCaseSpy.execute).toHaveBeenCalledWith(
        {
          billable: true,
          description: 'Lorem ipsum',
          hasEvidences: false,
          evidence: undefined,
          interval: {
            end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 13, 0, 0),
            start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0, 0)
          },
          projectRoleId: 1
        },
        {
          errorMessage: useResolveSpy.get,
          showToastError: true,
          successMessage: 'activity_form.create_activity_notification'
        }
      )
    })

    it('should reset project and project role if organization changes', async () => {
      setup()

      await setValuesInActivityFormCombos()

      await act(async () => {
        await selectComboboxOption('organization_field', 'New Test organization')
      })

      const projectInput = screen.getByTestId('project_field')
      const projectRoleInput = screen.getByTestId('projectRole_field')

      expect(projectInput).not.toHaveValue('Billable project')
      expect(projectRoleInput).not.toHaveValue('Project in minutes')
    })

    it('should reset project role if project changes', async () => {
      setup()

      await setValuesInActivityFormCombos()

      await act(async () => {
        await selectComboboxOption('project_field', 'No billable project')
      })

      const organizationInput = screen.getByTestId('organization_field')
      const projectRoleInput = screen.getByTestId('projectRole_field')

      expect(organizationInput).toHaveValue('Test organization')
      expect(projectRoleInput).not.toHaveValue('Project in minutes')
    })

    it('should not reset project and project role if selected organization is the same', async () => {
      setup()

      await setValuesInActivityFormCombos()

      await act(async () => {
        await selectComboboxOption('organization_field', 'Test organization')
      })

      const projectInput = screen.getByTestId('project_field')
      const projectRoleInput = screen.getByTestId('projectRole_field')

      expect(projectInput).toHaveValue('Billable project')
      expect(projectRoleInput).toHaveValue('Project in minutes')
    })

    it('should not reset project role if selected project is the same', async () => {
      setup()

      await setValuesInActivityFormCombos()

      await act(async () => {
        await selectComboboxOption('project_field', 'Billable project')
      })

      const organizationInput = screen.getByTestId('organization_field')
      const projectRoleInput = screen.getByTestId('projectRole_field')

      expect(organizationInput).toHaveValue('Test organization')
      expect(projectRoleInput).toHaveValue('Project in minutes')
    })

    it('should reset project and project role if selected organization is empty', async () => {
      setup()

      await setValuesInActivityFormCombos()

      await act(async () => {
        await userEvent.clear(screen.getByTestId('organization_field'))
      })

      const projectInput = screen.getByTestId('project_field')
      const projectRoleInput = screen.getByTestId('projectRole_field')

      expect(projectInput).not.toHaveValue('Billable project')
      expect(projectRoleInput).not.toHaveValue('Project in minutes')
    })

    it('should reset project role if selected project is empty', async () => {
      setup()

      await setValuesInActivityFormCombos()

      await act(async () => {
        await userEvent.clear(screen.getByTestId('project_field'))
      })

      const organizationInput = await screen.getByTestId('organization_field')
      const projectRoleInput = await screen.getByTestId('projectRole_field')

      expect(organizationInput).toHaveValue('Test organization')
      expect(projectRoleInput).not.toHaveValue('Project in minutes')
    })
  })

  describe('Image actions', () => {
    it('should upload an image and perform actions', async () => {
      setup()

      const file = new File(['(⌐□_□)'], 'test.jpg', {
        type: 'image/jpg'
      })

      const uploadImgButton = screen.getByTestId('upload_img')
      await act(async () => {
        await userEvent.upload(uploadImgButton, file)
      })

      const openImgButton = await screen.findByTestId('open-file')
      expect(openImgButton).toBeInTheDocument()

      const deleteImgButton = screen.getByTestId('delete-file')
      await act(async () => {
        await userEvent.click(deleteImgButton)
      })

      expect(deleteImgButton).not.toBeInTheDocument()
      expect(openImgButton).not.toBeInTheDocument()
      expect(uploadImgButton).toBeInTheDocument()
    })

    it('should open the file correctly', async () => {
      setup()

      const file = new File(['(⌐□_□)'], 'test.jpg', {
        type: 'image/jpg'
      })

      const uploadImgButton = screen.getByTestId('upload_img')
      await act(async () => {
        await userEvent.upload(uploadImgButton, file)
      })

      const openImgButton = await screen.findByTestId('open-file')
      global.URL.createObjectURL = jest.fn()
      const writeMock = jest.fn()
      const openMock = jest.fn().mockReturnValue({
        document: {
          write: writeMock
        }
      })
      window.open = openMock
      await act(async () => {
        await userEvent.click(openImgButton)
      })

      await waitFor(() => {
        expect(openMock).toHaveBeenCalledTimes(1)
        expect(writeMock).toHaveBeenCalled()
      })
    })
  })
})

function setup(
  activity: Activity | undefined = undefined,
  projectRole: ProjectRole[] | undefined = undefined
) {
  const date = chrono.now()
  const onCloseSpy = jest.fn()
  const onSubmit = jest.fn()
  const onSubmitError = jest.fn()
  const onAfterSubmit = jest.fn()
  const executeSpy = jest.fn()
  const useCaseSpy = {
    execute: executeSpy.mockReturnValue({
      then: jest.fn(),
      catch: jest.fn()
    })
  }

  const useResolveSpy = {
    get: jest.fn()
  }

  useCaseSpy.execute.mockImplementation(() => {
    return Promise.resolve()
  })
  ;(useGetUseCase as jest.Mock).mockImplementation((arg) => {
    if (arg.prototype.key === 'GetProjectsQry') {
      return {
        isLoading: false,
        executeUseCase: jest.fn().mockResolvedValue(LiteProjectMother.projects())
      }
    }
    if (arg.prototype.key === 'GetProjectRolesQry') {
      return {
        isLoading: false,
        executeUseCase: jest.fn().mockResolvedValue(ProjectRoleMother.projectRoles())
      }
    }
    if (arg.prototype.key === 'GetDaysForActivityDaysPeriodQry') {
      return {
        isLoading: false,
        executeUseCase: jest.fn().mockResolvedValue(1)
      }
    }
    return {
      isLoading: false,
      useCase: useCaseSpy
    }
  })
  ;(useExecuteUseCaseOnMount as jest.Mock).mockImplementation((arg) => {
    if (arg.prototype.key === 'GetRecentProjectRolesQry') {
      return { result: projectRole ? projectRole : undefined }
    }
    if (arg.prototype.key === 'GetOrganizationsQry') {
      return { result: OrganizationMother.organizations() }
    }
  })
  ;(useResolve as jest.Mock).mockReturnValue(useResolveSpy)

  const renderResult = render(
    <>
      <ActivityForm
        date={date}
        activity={activity}
        settings={UserSettingsMother.userSettings()}
        onSubmit={onSubmit}
        onSubmitError={onSubmitError}
        onAfterSubmit={onAfterSubmit}
        recentRoles={ProjectRoleMother.projectRoles()}
      />
      {activity && <RemoveActivityButton activity={activity} onDeleted={onCloseSpy} />}
      <SubmitButton formId={ACTIVITY_FORM_ID}>Save</SubmitButton>
    </>
  )

  return {
    ...renderResult,
    onCloseSpy,
    useCaseSpy,
    useResolveSpy,
    onSubmit,
    onSubmitError,
    onAfterSubmit
  }
}

async function selectComboboxOption(
  label: 'organization_field' | 'project_field' | 'projectRole_field',
  optionText: string
) {
  const option = await screen.findByText(optionText)
  await act(async () => {
    await userEvent.click(option)
  })

  expect(screen.getByTestId(label)).toHaveValue(optionText)
}

async function setValuesInActivityFormCombos() {
  await act(async () => {
    await userEvent.click(screen.getByText('activity_form.add_role'))
    await selectComboboxOption('organization_field', 'Test organization')
    await selectComboboxOption('project_field', 'Billable project')
    await selectComboboxOption('projectRole_field', 'Project in minutes')
  })
}
