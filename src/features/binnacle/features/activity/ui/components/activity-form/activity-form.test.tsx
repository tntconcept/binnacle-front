import { Activity } from '../../../domain/activity'
import SubmitButton from 'shared/components/FormFields/SubmitButton'
import chrono from 'shared/utils/chrono'
import { render, screen, userEvent, waitFor } from 'test-utils/app-test-utils'
import { ProjectRoleMother } from 'test-utils/mothers/project-role-mother'
import { ACTIVITY_FORM_ID, ActivityForm } from './activity-form'
import { UserSettingsMother } from '../../../../../../../test-utils/mothers/user-settings-mother'
import { useGetUseCase } from '../../../../../../../shared/arch/hooks/use-get-use-case'
import RemoveActivityButton from './components/remove-activity-button'
import { useExecuteUseCaseOnMount } from '../../../../../../../shared/arch/hooks/use-execute-use-case-on-mount'
import { act } from 'react-dom/test-utils'
import { useResolve } from '../../../../../../../shared/di/use-resolve'
import { ActivityMother } from '../../../../../../../test-utils/mothers/activity-mother'
import { ProjectRole } from '../../../../project-role/domain/project-role'
import { waitForElementToBeRemoved } from '@testing-library/react'

jest.mock('../../../../../../../shared/di/use-resolve')
jest.mock('../../../../../../../shared/arch/hooks/use-get-use-case')
jest.mock('../../../../../../../shared/arch/hooks/use-execute-use-case-on-mount')

describe('ActivityForm', () => {
  describe('Create an activity', () => {
    it('should create an activity', async () => {
      const { useCaseSpy, useResolveSpy } = setup()
      const today = new Date()

      act(() => {
        userEvent.type(screen.getByLabelText('activity_form.description'), 'Lorem ipsum')
        userEvent.click(screen.getByRole('button', { name: /save/i }))
      })

      await waitFor(() => {
        expect(useCaseSpy.execute).toHaveBeenCalledTimes(1)
      })

      expect(useCaseSpy.execute).toHaveBeenCalledWith(
        {
          billable: true,
          description: 'Lorem ipsum',
          hasEvidences: false,
          imageFile: undefined,
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

    it('should error if create request fails', async () => {
      const { useCaseSpy, setIsLoadingFormSpy } = setup()

      useCaseSpy.execute.mockImplementation(() => {
        return Promise.reject(setIsLoadingFormSpy(false))
      })

      act(() => {
        userEvent.type(screen.getByLabelText('activity_form.description'), 'Lorem ipsum')
        userEvent.click(screen.getByRole('button', { name: /save/i }))
      })

      await waitFor(() => {
        expect(useCaseSpy.execute).toHaveBeenCalledTimes(1)
      })

      expect(useCaseSpy.execute).toHaveBeenCalled()
      expect(setIsLoadingFormSpy).toHaveBeenCalledWith(false)
    })
  })
  //
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
      assertRoleCardContainText(recentRoleCard, activity.projectRole.name)
      assertRoleCardContainText(recentRoleCard, activity.organization.name)
      assertRoleCardContainText(recentRoleCard, 'No billable project')
    })
    //
    it('should update an activity using recent roles list', async () => {
      const activityToEdit = ActivityMother.minutesBillableActivityWithoutEvidence()
      const projectRole = ProjectRoleMother.projectRoleInMinutes()

      const newActivity = {
        ...activityToEdit,
        description: 'Description changed'
      }

      const { useCaseSpy } = setup(activityToEdit, [projectRole])

      // Check fields
      expect(screen.getByTestId('startTime_field')).toHaveValue('10:00')
      expect(screen.getByTestId('endTime_field')).toHaveValue('14:00')
      expect(screen.getByTestId('role_1')).toBeChecked()
      expect(screen.getByLabelText('activity_form.billable')).toBeChecked()
      expect(screen.getByLabelText('activity_form.description')).toHaveValue(
        activityToEdit.description
      )

      // Change fields
      userEvent.type(screen.getByLabelText('activity_form.description'), newActivity.description)

      userEvent.click(screen.getByRole('button', { name: /save/i }))

      await waitFor(() => {
        expect(useCaseSpy.execute).toHaveBeenCalledTimes(1)
      })
    })

    it('should error if update request fails', async () => {
      const activityToEdit = ActivityMother.minutesBillableActivityWithoutEvidence()
      const projectRole = ProjectRoleMother.projectRoleInMinutes()

      const newActivity = {
        ...activityToEdit,
        description: 'Description changed'
      }

      const { useCaseSpy, setIsLoadingFormSpy } = setup(activityToEdit, [projectRole])

      useCaseSpy.execute.mockImplementation(() => {
        return Promise.reject(setIsLoadingFormSpy(false))
      })

      // Change fields
      userEvent.type(screen.getByLabelText('activity_form.description'), newActivity.description)

      userEvent.click(screen.getByRole('button', { name: /save/i }))

      await waitFor(() => {
        expect(useCaseSpy.execute).toHaveBeenCalledTimes(1)
      })

      expect(useCaseSpy.execute).toHaveBeenCalled()
      expect(setIsLoadingFormSpy).toHaveBeenCalledWith(false)
    })
  })

  describe('Delete an activity', () => {
    it('should delete the activity', async () => {
      const activityToDelete = ActivityMother.minutesBillableActivityWithoutEvidence()

      const { onCloseSpy, useCaseSpy } = setup(activityToDelete)

      userEvent.click(screen.getByText('actions.remove'))

      const yesModalButton = await screen.findByText('activity_form.remove_activity')
      userEvent.click(yesModalButton)

      await waitForElementToBeRemoved(yesModalButton)

      await waitFor(() => {
        expect(useCaseSpy.execute).toHaveBeenCalledWith(1, {
          successMessage: 'activity_form.remove_activity_notification'
        })
      })

      expect(onCloseSpy).toHaveBeenCalled()
    })

    it('should not close the modal if delete request fails', async () => {
      const activityToDelete = ActivityMother.minutesBillableActivityWithoutEvidence()

      const { useCaseSpy, onCloseSpy } = setup(activityToDelete)

      useCaseSpy.execute.mockImplementation(() => {
        return Promise.reject()
      })

      userEvent.click(screen.getByText('actions.remove'))

      const yesModalButton = await screen.findByText('activity_form.remove_activity')
      userEvent.click(yesModalButton)

      await waitFor(() => {
        expect(useCaseSpy.execute).toHaveBeenCalledWith(1, {
          successMessage: 'activity_form.remove_activity_notification'
        })
      })

      expect(yesModalButton).toBeInTheDocument()

      expect(onCloseSpy).not.toHaveBeenCalled()
    })

    it('should NOT delete the activity if the user cancel the delete operation', async () => {
      const activityToDelete = ActivityMother.minutesBillableActivityWithoutEvidence()

      const { onCloseSpy } = setup(activityToDelete)

      userEvent.click(screen.getByText('actions.remove'))

      const noModalButton = await screen.findByText('actions.cancel')
      userEvent.click(noModalButton)

      await waitForElementToBeRemoved(noModalButton)

      expect(onCloseSpy).not.toHaveBeenCalled()
      expect(screen.getByText('actions.remove')).toBeInTheDocument()
    })
  })

  describe('With recent roles section', function () {
    it('should update the billable field selecting another recent role', async () => {
      const projectRole = ProjectRoleMother.projectRoles()
      setup(undefined, projectRole)

      // Billable field is not checked because by default gets the billable value of the last recent role
      expect(screen.getByLabelText('activity_form.billable')).toBeChecked()

      const billableRecentRoleElement = screen.getByLabelText(/Project in days 2/i)
      userEvent.click(billableRecentRoleElement)

      expect(screen.getByLabelText('activity_form.billable')).not.toBeChecked()
    })

    it('should reset the state of billable field and select combos when the user toggles recent roles on and off', async () => {
      const projectRole = ProjectRoleMother.projectRoles()
      setup(undefined, projectRole)

      // Show selects
      userEvent.click(screen.getByText('activity_form.add_role'))

      // Select organization, project and role
      userEvent.type(screen.getByTestId('organization_field'), 'Test organization')
      userEvent.type(screen.getByTestId('project_field'), 'Developer')
      userEvent.type(screen.getByTestId('projectRole_field'), 'Scrum master')

      // Back to recent roles
      userEvent.click(screen.getByText('activity_form.back_to_recent_roles'))

      // Expect that last recent role is selected and billable field is not checked
      expect(screen.getByTestId('role_1')).toBeChecked()
      expect(screen.getByLabelText('activity_form.billable')).toBeChecked()

      // Show select combos again
      userEvent.click(screen.getByText('activity_form.add_role'))

      // Expect that the select fields are empty
      expect(screen.getByTestId('organization_field')).toHaveValue('')
      expect(screen.getByTestId('project_field')).toHaveValue('')
      expect(screen.getByTestId('projectRole_field')).toHaveValue('')
    }, 10_000)
  })

  describe('Without recent roles section', () => {
    // it('should update billable field selecting the role', async () => {
    //   setup()
    //
    //   expect(screen.getByLabelText('activity_form.billable')).not.toBeChecked()
    //
    //   await selectComboboxOption('activity_form.organization', 'Viajes XL')
    //   await selectComboboxOption('activity_form.project', 'Marketing')
    //   await waitFor(() => expect(combosRepository.getProjectRoles).toHaveBeenCalled())
    //
    //   expect(screen.getByLabelText('activity_form.billable')).toBeChecked()
    // })
    // it('should display select combos when the user makes his first-ever imputation', async () => {
    //   setup()
    //
    //   expect(screen.getByText('activity_form.select_role')).toBeInTheDocument()
    // })
    //
    //     it('should create activity selecting a role', async () => {
    //       const submitActivityFormAction = mock<SubmitActivityFormAction>()
    //       container.registerInstance(SubmitActivityFormAction, submitActivityFormAction)
    //       submitActivityFormAction.execute.mockResolvedValue()
    //
    //       const { mockOnAfterSubmit } = setup()
    //
    //       userEvent.type(screen.getByLabelText('activity_form.start_time'), '10:00')
    //       userEvent.type(screen.getByLabelText('activity_form.end_time'), '10:30')
    //       userEvent.type(screen.getByLabelText('activity_form.description'), 'Lorem ipsum')
    //
    //       await selectComboboxOption('activity_form.organization', 'Viajes XL')
    //       await selectComboboxOption('activity_form.project', 'Marketing')
    //       await selectComboboxOption('activity_form.role', 'Senior')
    //
    //       userEvent.click(screen.getByRole('button', { name: /save/i }))
    //
    //       await waitFor(() => {
    //         expect(mockOnAfterSubmit).toHaveBeenCalledTimes(1)
    //       })
    //
    //       expect(submitActivityFormAction.execute).toHaveBeenCalledWith({
    //         activityId: undefined,
    //         activityDate: new Date('2020-06-06'),
    //         values: {
    //           startTime: '10:00',
    //           endTime: '10:30',
    //           description: 'Lorem ipsum',
    //           billable: true,
    //           organization: { id: 1, name: 'Viajes XL' },
    //           project: { billable: true, id: 1, name: 'Marketing', open: true },
    //           role: { id: 1, name: 'Senior', requireEvidence: false },
    //           recentRole: undefined,
    //           imageBase64: null,
    //           showRecentRole: false
    //         }
    //       })
    //     })
  })
  //
  describe('Image actions', () => {
    it('should upload an image and perform actions', async () => {
      setup()

      const file = new File(['(⌐□_□)'], 'test.jpg', {
        type: 'image/jpg'
      })

      const uploadImgButton = screen.getByTestId('upload_img')
      userEvent.upload(uploadImgButton, file)

      const openImgButton = await screen.findByTestId('open-file')
      expect(openImgButton).toBeInTheDocument()

      const deleteImgButton = screen.getByTestId('delete-file')
      userEvent.click(deleteImgButton)

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
      userEvent.upload(uploadImgButton, file)

      const openImgButton = await screen.findByTestId('open-file')
      global.URL.createObjectURL = jest.fn()
      const writeMock = jest.fn()
      const openMock = jest.fn().mockReturnValue({
        document: {
          write: writeMock
        }
      })
      window.open = openMock
      userEvent.click(openImgButton)

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
  const setIsLoadingFormSpy = jest.fn()
  const executeSpy = jest.fn()
  const useCaseSpy = {
    execute: executeSpy.mockReturnValue({
      catch: jest.fn()
    })
  }

  const useResolveSpy = {
    get: jest.fn()
  }

  ;(useGetUseCase as jest.Mock).mockReturnValue({
    isLoading: false,
    useCase: useCaseSpy
  })
  ;(useExecuteUseCaseOnMount as jest.Mock).mockReturnValue({
    result: projectRole ? projectRole : undefined
  })
  ;(useResolve as jest.Mock).mockReturnValue(useResolveSpy)

  render(
    <>
      <ActivityForm
        date={date}
        activity={activity}
        settings={UserSettingsMother.userSettings()}
        onSubmit={() => setIsLoadingFormSpy}
        onSubmitError={() => setIsLoadingFormSpy}
        onAfterSubmit={() => setIsLoadingFormSpy}
        recentRoles={ProjectRoleMother.projectRoles()}
      />
      {activity && <RemoveActivityButton activity={activity} onDeleted={onCloseSpy} />}
      <SubmitButton formId={ACTIVITY_FORM_ID}>Save</SubmitButton>
    </>
  )

  return {
    onCloseSpy,
    setIsLoadingFormSpy,
    useCaseSpy,
    useResolveSpy
  }
}

// async function selectComboboxOption(
//   label: 'activity_form.organization' | 'activity_form.project' | 'activity_form.role',
//   optionText: string
// ) {
//   // userEvent.type(screen.getByLabelText(label), optionText)
//   const option = await screen.findByText(optionText)
//   userEvent.click(option)
//
//   expect(screen.getByLabelText(label)).toHaveValue(optionText)
//   // expect(screen.getByLabelText(label)).toHaveAttribute('aria-expanded', 'false')
// }
