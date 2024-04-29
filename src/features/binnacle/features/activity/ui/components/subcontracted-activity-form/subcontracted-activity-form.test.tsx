import { SubmitSubcontractedActivityButton } from '../../../../../../../shared/components/form-fields/submit-subcontracted-activity-button'
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
import { SubcontractedActivityMother } from '../../../../../../../test-utils/mothers/subcontracted-activity-mother'
import { UserSettingsMother } from '../../../../../../../test-utils/mothers/user-settings-mother'
import { SubcontractedActivity } from '../../../domain/subcontracted-activity'
import {
  SUBCONTRACTED_ACTIVITY_FORM_ID,
  SubcontractedActivityForm
} from './subcontracted-activity-form'
import { RemoveSubcontractedActivityButton } from './components/remove-subcontracted-activity-button'

jest.mock('../../../../../../../shared/di/use-resolve')
jest.mock('../../../../../../../shared/arch/hooks/use-get-use-case')
jest.mock('../../../../../../../shared/arch/hooks/use-execute-use-case-on-mount')

describe.skip('SubcontractedActivityForm', () => {
  describe('Create a subcontracted activity', () => {
    it('should create a subcontracted activity', async () => {
      const { useCaseSpy, useResolveSpy, onAfterSubmit, onSubmit } = setup()

      await act(async () => {
        await userEvent.type(
          screen.getByLabelText('subcontracted_activity_form.description'),
          'Lorem ipsum'
        )
        await userEvent.click(screen.getByRole('button', { name: /save/i }))
      })

      await waitFor(() => {
        expect(onSubmit).toBeCalledTimes(1)
        expect(useCaseSpy.execute).toHaveBeenCalledTimes(1)
      })

      expect(useCaseSpy.execute).toHaveBeenCalledWith(
        {
          description: 'Lorem ipsum',
          projectRoleId: 1,
          duration: 4000,
          month: '2024-07'
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
        await userEvent.type(
          screen.getByLabelText('subcontracted_activity_form.description'),
          'Lorem ipsum'
        )
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
    it('should update a subcontracted activity', async () => {
      jest.useFakeTimers().setSystemTime(new Date('2024-04-24'))
      const activityToEdit = SubcontractedActivityMother.activity()
      const newActivity = {
        ...activityToEdit,
        description: ' Description changed'
      }

      const { useCaseSpy, onSubmit, useResolveSpy } = setup(activityToEdit)

      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })

      useCaseSpy.execute.mockImplementation(() => {
        return Promise.reject()
      })

      await act(async () => {
        await user.type(screen.getByLabelText('activity_form.description'), newActivity.description)
        await user.click(screen.getByRole('button', { name: /save/i }))
      })

      await waitFor(() => {
        expect(useCaseSpy.execute).toHaveBeenCalledWith(1, {
          successMessage: 'activity_form.update_activity_notification',
          showToastError: false,
          errorMessage: useResolveSpy.get
        })
        expect(onSubmit).toHaveBeenCalled()
      })
    })

    it('should show an error if update request fails', async () => {
      jest.useFakeTimers().setSystemTime(new Date('2024-06-07'))
      const activityToEdit = SubcontractedActivityMother.activity()
      const newActivity = {
        ...activityToEdit,
        description: ' Description changed'
      }
      const { useCaseSpy, onSubmitError, useResolveSpy } = setup(activityToEdit)

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
          description: 'Subcontracted activity Description changed',
          month: '2024-04',
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

  describe('Delete a subcontracted activity', () => {
    it('should delete the subcontracted activity', async () => {
      const activityToDelete = SubcontractedActivityMother.activity()

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
      const activityToDelete = SubcontractedActivityMother.activity()

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
      const activityToDelete = SubcontractedActivityMother.minutesBillableActivityWithoutEvidence()

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

  describe('Without recent roles section', () => {
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

  function setup(activity: SubcontractedActivity | undefined = undefined) {
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
      if (arg.prototype.key === 'GetOrganizationsQry') {
        return { result: OrganizationMother.organizations() }
      }
    })
    ;(useResolve as jest.Mock).mockReturnValue(useResolveSpy)

    const renderResult = render(
      <>
        <SubcontractedActivityForm
          subcontractedActivity={activity}
          settings={UserSettingsMother.userSettings()}
          onSubmit={onSubmit}
          onSubmitError={onSubmitError}
          onAfterSubmit={onAfterSubmit}
        />
        {activity && (
          <RemoveSubcontractedActivityButton
            subcontractedActivity={activity}
            onDeleted={onCloseSpy}
          />
        )}
        <SubmitSubcontractedActivityButton formId={SUBCONTRACTED_ACTIVITY_FORM_ID}>
          Save
        </SubmitSubcontractedActivityButton>
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
})
