import React, { Suspense } from 'react'
import { ActivityForm } from 'pages/binnacle/ActivityForm'
import {
  fireEvent,
  render,
  waitFor,
  waitForElementToBeRemoved,
  screen
} from '@testing-library/react'
import {
  buildActivity,
  buildOrganization,
  buildProject,
  buildProjectRole,
  buildRecentRole
} from 'utils/generateTestMocks'
import { IActivity } from 'api/interfaces/IActivity'
import { BinnacleResourcesContext } from 'core/features/BinnacleResourcesProvider'
import { fetchOrganizations } from 'api/OrganizationAPI'
import { fetchProjectsByOrganization } from 'api/ProjectsAPI'
import { fetchRolesByProject } from 'api/RoleAPI'
import {
  createActivity,
  deleteActivityById,
  fetchActivityImage,
  updateActivity
} from 'api/ActivitiesAPI'
import { isTimeOverlappingWithPreviousActivities } from 'pages/binnacle/ActivityForm/utils'
import { ActivityFormLogic } from 'pages/binnacle/ActivityForm/ActivityFormLogic'
import { userEvent } from 'test-utils/app-test-utils'
import RemoveActivityButton from 'pages/binnacle/ActivityForm/RemoveActivityButton'
import chrono from 'services/Chrono'

jest.mock('api/ActivitiesAPI')
jest.mock('api/OrganizationAPI')
jest.mock('api/ProjectsAPI')
jest.mock('api/RoleAPI')

const setupComboboxes = (projectBillable: boolean = false) => {
  const organization = buildOrganization()
  const project = buildProject({ billable: projectBillable })
  const projectRole = buildProjectRole()

  // @ts-ignore
  fetchOrganizations.mockResolvedValue([organization])
  // @ts-ignore
  fetchProjectsByOrganization.mockResolvedValue([project])
  // @ts-ignore
  fetchRolesByProject.mockResolvedValue([projectRole])

  return {
    organization,
    project,
    projectRole
  }
}

const renderActivityForm = (activity?: IActivity, date: Date = new Date()) => {
  const updateCalendarResources = jest.fn()
  const afterSubmit = jest.fn()

  const Providers: React.FC = (props) => {
    return (
      <Suspense fallback={null}>
        <BinnacleResourcesContext.Provider
          value={{
            // @ts-ignore
            activitiesReader: jest.fn(() => ({
              activities: [],
              recentRoles: []
            })),
            // @ts-ignore
            holidayReader: jest.fn(() => ({
              publicHolidays: [],
              privateHolidays: []
            })),
            changeMonth: jest.fn(),
            selectedMonth: date,
            updateCalendarResources: updateCalendarResources,
            fetchTimeResource: jest.fn()
          }}
        >
          {props.children}
        </BinnacleResourcesContext.Provider>
      </Suspense>
    )
  }

  const utils = render(
    <ActivityFormLogic
      date={date}
      onAfterSubmit={afterSubmit}
      activity={activity}
      lastEndTime={undefined}
    >
      {(formik, utils) => (
        <>
          <ActivityForm formik={formik} utils={utils} />
          {utils.activity && (
            <RemoveActivityButton activity={utils.activity} onDeleted={afterSubmit} />
          )}
          <button type="button" onClick={formik.handleSubmit as any} data-testid="save_activity">
            Save
          </button>
        </>
      )}
    </ActivityFormLogic>,
    { wrapper: Providers }
  )

  const selectComboboxOption = async (comboboxTestId: string, optionText: string) => {
    userEvent.type(screen.getByTestId(comboboxTestId), optionText)

    userEvent.click(screen.getByTestId(comboboxTestId))

    const optionElement = await screen.findByText(optionText)

    userEvent.click(optionElement)

    await waitFor(() => {
      expect(screen.getByTestId(comboboxTestId)).toHaveAttribute('aria-expanded', 'false')
    })
  }

  return {
    ...utils,
    updateCalendarResources,
    date,
    afterSubmit,
    selectComboboxOption
  }
}

describe('ActivityForm', () => {
  afterEach(jest.resetAllMocks)

  describe('create a new activity', () => {
    it('should show the last recent role selected', function() {
      const recentRoles = [
        {
          id: 100,
          name: 'Developer',
          projectName: 'Marketing',
          projectBillable: false,
          date: new Date()
        }
      ]

      const Wrapper: React.FC = ({ children }) => {
        return (
          // @ts-ignore
          <BinnacleResourcesContext.Provider
            value={{
              // @ts-ignore
              activitiesReader: jest.fn(() => ({
                activities: [],
                recentRoles: recentRoles
              })),
              updateCalendarResources: jest.fn()
            }}
          >
            {children}
          </BinnacleResourcesContext.Provider>
        )
      }

      const result = render(
        <ActivityFormLogic
          date={new Date()}
          activity={undefined}
          lastEndTime={undefined}
          onAfterSubmit={jest.fn()}
        >
          {(formik, utils) => (
            <>
              <ActivityForm formik={formik} utils={utils} />
              <button onClick={formik.handleSubmit as any} data-testid="save_activity">
                Save
              </button>
            </>
          )}
        </ActivityFormLogic>,
        { wrapper: Wrapper }
      )

      expect(result.getByTestId('role_100')).toBeChecked()
    })

    it('should display select entities when the user makes his first-ever imputation', async () => {
      const organization = buildOrganization()

      // @ts-ignore
      fetchOrganizations.mockResolvedValue([organization])

      const { getByText } = renderActivityForm()

      await waitFor(() => {
        expect(fetchOrganizations).toHaveBeenCalled()
      })

      expect(getByText('activity_form.organization')).toBeInTheDocument()
      expect(getByText('activity_form.project')).toBeInTheDocument()
      expect(getByText('activity_form.role')).toBeInTheDocument()
    })

    it('should create activity', async () => {
      const { organization, project, projectRole } = setupComboboxes()
      const activityToCreate = buildActivity({
        hasImage: false,
        imageFile: undefined,
        startDate: new Date('2020-02-07 09:00'),
        duration: 60,
        organization,
        project,
        projectRole
      })

      // @ts-ignore
      createActivity.mockResolvedValue(activityToCreate)

      const {
        getByLabelText,
        getByTestId,
        afterSubmit,
        updateCalendarResources,
        selectComboboxOption
      } = renderActivityForm(undefined, new Date('2020-02-07'))

      fireEvent.change(getByLabelText('activity_form.start_time'), {
        target: { value: chrono(activityToCreate.startDate).format(chrono.TIME_FORMAT) }
      })

      fireEvent.change(getByLabelText('activity_form.end_time'), {
        target: {
          value: chrono(activityToCreate.startDate)
            .plus(activityToCreate.duration, 'minute')
            .format(chrono.TIME_FORMAT)
        }
      })
      fireEvent.change(getByLabelText('activity_form.description'), {
        target: { value: activityToCreate.description }
      })

      await selectComboboxOption('organization_combobox', organization.name)

      await selectComboboxOption('project_combobox', project.name)

      await selectComboboxOption('role_combobox', projectRole.name)

      userEvent.click(getByTestId('save_activity'))

      await waitFor(() => expect(createActivity).toHaveBeenCalled())

      expect(afterSubmit).toHaveBeenCalled()
      expect(updateCalendarResources).toHaveBeenCalled()
    })
  })

  it('should edit an activity', async () => {
    const { organization, project, projectRole } = setupComboboxes()
    const activityToEdit = buildActivity({
      hasImage: false,
      imageFile: undefined,
      organization,
      project,
      projectRole,
      startDate: new Date('2020-10-10 09:00')
    })
    const newActivity = {
      ...activityToEdit,
      description: 'Description changed'
    }

    // @ts-ignore
    updateActivity.mockResolvedValue(newActivity)

    const {
      getByLabelText,
      getByTestId,
      afterSubmit,
      updateCalendarResources
    } = renderActivityForm(activityToEdit)

    userEvent.type(getByLabelText('activity_form.description'), newActivity.description)

    userEvent.click(getByTestId('save_activity'))

    await waitFor(() => {
      expect(updateActivity).toHaveBeenCalled()
    })

    expect(afterSubmit).toHaveBeenCalled()
    expect(updateCalendarResources).toHaveBeenCalled()
  })

  it('should validate fields', async () => {
    setupComboboxes()

    const { getByLabelText, getByTestId, findByText, getAllByText } = renderActivityForm()

    // set end time before start time (by default is 9:00)
    fireEvent.change(getByLabelText('activity_form.end_time'), {
      target: { value: '07:30' }
    })

    userEvent.click(getByTestId('save_activity'))

    await findByText('form_errors.end_time_greater')

    fireEvent.change(getByLabelText('activity_form.start_time'), {
      target: { value: '' }
    })

    fireEvent.change(getByLabelText('activity_form.end_time'), {
      target: { value: '' }
    })

    userEvent.click(getByTestId('save_activity'))

    await waitFor(() => {
      expect(getAllByText('form_errors.field_required').length).toBe(3)
    })

    expect(getAllByText('form_errors.select_an_option').length).toBe(1)
  })

  it('should delete the activity', async () => {
    const { organization, project, projectRole } = setupComboboxes()
    const activityToDelete = buildActivity({
      hasImage: false,
      imageFile: undefined,
      organization,
      project,
      projectRole
    })

    // @ts-ignore
    deleteActivityById.mockResolvedValue(activityToDelete)

    const { updateCalendarResources, afterSubmit } = renderActivityForm(activityToDelete)

    userEvent.click(screen.getByText('actions.remove'))

    const yesModalButton = await screen.findByText('activity_form.remove_activity')
    userEvent.click(yesModalButton)

    await waitForElementToBeRemoved(yesModalButton)

    expect(afterSubmit).toHaveBeenCalled()
    expect(updateCalendarResources).toHaveBeenCalled()
  })

  it('should NOT delete the activity if the user abort delete operation', async () => {
    const { organization, project, projectRole } = setupComboboxes()
    const activityToDelete = buildActivity({
      hasImage: false,
      imageFile: undefined,
      organization,
      project,
      projectRole
    })

    const { afterSubmit } = renderActivityForm(activityToDelete)

    userEvent.click(screen.getByText('actions.remove'))

    const noModalButton = await screen.findByText('actions.cancel')
    userEvent.click(noModalButton)

    await waitFor(() => {
      expect(noModalButton).not.toBeInTheDocument()
    })

    expect(afterSubmit).not.toHaveBeenCalled()
    expect(screen.getByText('actions.remove')).toBeInTheDocument()
  })

  it('should update the billable field selecting a project that is billable from recent roles list', async () => {
    const recentRoleBillable = buildRecentRole({
      projectBillable: true,
      name: 'ROLE BILLABLE'
    })

    const recentRoleUnbillable = buildRecentRole({
      projectBillable: false,
      name: 'Role NO BILLABLE'
    })

    const recentRoles = [recentRoleUnbillable, recentRoleBillable]

    const Wrapper: React.FC = ({ children }) => {
      return (
        <BinnacleResourcesContext.Provider
          value={{
            // @ts-ignore
            activitiesReader: jest.fn(() => ({
              activities: [],
              recentRoles: recentRoles
            })),
            updateCalendarResources: jest.fn()
          }}
        >
          {children}
        </BinnacleResourcesContext.Provider>
      )
    }

    render(
      <ActivityFormLogic
        date={new Date()}
        activity={undefined}
        lastEndTime={undefined}
        onAfterSubmit={jest.fn()}
      >
        {(formik, utils) => (
          <>
            <ActivityForm formik={formik} utils={utils} />
            <button onClick={formik.handleSubmit as any} data-testid="save_activity">
              Save
            </button>
          </>
        )}
      </ActivityFormLogic>,

      { wrapper: Wrapper }
    )

    // Billable field is not checked because by default gets the billable value of the last imputed role
    expect(screen.getByLabelText('activity_form.billable')).not.toBeChecked()

    const billableRecentRoleElement = screen.getByLabelText(new RegExp(recentRoleBillable.name))
    userEvent.click(billableRecentRoleElement)

    expect(screen.getByLabelText('activity_form.billable')).toBeChecked()
  })

  it('should update billable selecting a project from the combobox field', async () => {
    const { organization, project } = setupComboboxes(true)

    const { selectComboboxOption } = renderActivityForm()

    await waitFor(() => {
      expect(fetchOrganizations).toHaveBeenCalled()
    })

    expect(screen.getByLabelText('activity_form.billable')).not.toBeChecked()

    await selectComboboxOption('organization_combobox', organization.name)

    await waitFor(() => {
      expect(fetchProjectsByOrganization).toHaveBeenCalled()
    })

    await selectComboboxOption('project_combobox', project.name)

    await waitFor(() => {
      expect(fetchRolesByProject).toHaveBeenCalled()
    })

    expect(screen.getByLabelText('activity_form.billable')).toBeChecked()
  })

  it("should display select entities filled with the activity's data when it's role has not been found in frequent roles list", async () => {
    const { organization, project, projectRole } = setupComboboxes()
    const activity = buildActivity({
      organization,
      project,
      projectRole
    })

    const { getByTestId } = renderActivityForm(activity)

    await waitFor(() => {
      expect(fetchOrganizations).toHaveBeenCalled()
      expect(fetchProjectsByOrganization).toHaveBeenCalled()
      expect(fetchRolesByProject).toHaveBeenCalled()
    })

    expect(getByTestId('organization_combobox')).toHaveValue(activity.organization.name)
    expect(getByTestId('project_combobox')).toHaveValue(activity.project.name)
    expect(getByTestId('role_combobox')).toHaveValue(activity.projectRole.name)
  })

  it('should upload an image and perform actions', async () => {
    setupComboboxes()

    const result = renderActivityForm()

    const file = new File(['(⌐□_□)'], 'test.jpg', {
      type: 'image/jpg'
    })

    const uploadImgButton = result.getByTestId('upload_img')

    Object.defineProperty(uploadImgButton, 'files', {
      value: [file]
    })

    fireEvent.change(uploadImgButton)

    const openImgButton = await result.findByTestId('open-image')

    expect(openImgButton).toBeInTheDocument()

    const openMock = jest.fn()
    window.open = openMock
    userEvent.click(openImgButton)

    expect(openMock).toHaveBeenCalled()

    const deleteImgButton = result.getByTestId('delete-image')
    userEvent.click(deleteImgButton)

    expect(deleteImgButton).not.toBeInTheDocument()
    expect(openImgButton).not.toBeInTheDocument()
    expect(uploadImgButton).toBeInTheDocument()
  })

  it('should download the image base64 when the user wants to see the image', async () => {
    const { organization, project, projectRole } = setupComboboxes()
    const activity = buildActivity({
      hasImage: true,
      organization,
      project,
      projectRole
    })

    // @ts-ignore
    fetchActivityImage.mockResolvedValue('(⌐□_□)')

    const { findByTestId } = renderActivityForm(activity)

    const openImgButton = await findByTestId('open-image')

    const openMock = jest.fn()
    window.open = openMock
    userEvent.click(openImgButton)

    await waitFor(() => {
      expect(fetchActivityImage).toHaveBeenCalled()
    })

    expect(openMock).toHaveBeenCalled()
  })
})

test('overlaps', () => {
  const intervals_1 = [
    {
      start: new Date(2020, 1, 20, 9, 0, 0),
      end: new Date(2020, 1, 20, 13, 0, 0)
    },
    {
      start: new Date(2020, 1, 20, 14, 0, 0),
      end: new Date(2020, 1, 20, 18, 0, 0)
    }
  ]
  const overlaps_1 = isTimeOverlappingWithPreviousActivities(
    '09:00',
    '13:00',
    new Date(2020, 1, 20),
    intervals_1
  )

  expect(overlaps_1).toBeTruthy()

  const intervals_2 = [
    {
      start: new Date(2020, 1, 20, 9, 0, 0),
      end: new Date(2020, 1, 20, 13, 0, 0)
    },
    {
      start: new Date(2020, 1, 20, 14, 0, 0),
      end: new Date(2020, 1, 20, 18, 0, 0)
    }
  ]
  const overlaps_2 = isTimeOverlappingWithPreviousActivities(
    '10:00',
    '10:00',
    new Date(2020, 1, 20),
    intervals_2
  )

  expect(overlaps_2).toBeTruthy()

  const intervals_3 = [
    {
      start: new Date(2020, 1, 20, 9, 0, 0),
      end: new Date(2020, 1, 20, 13, 0, 0)
    },
    {
      start: new Date(2020, 1, 20, 14, 0, 0),
      end: new Date(2020, 1, 20, 18, 0, 0)
    }
  ]
  const overlaps_3 = isTimeOverlappingWithPreviousActivities(
    '13:00',
    '14:00',
    new Date(2020, 1, 20),
    intervals_3
  )

  expect(overlaps_3).toBeFalsy()

  const intervals_4 = [
    {
      start: new Date(2020, 1, 20, 9, 0, 0),
      end: new Date(2020, 1, 20, 13, 0, 0)
    },
    {
      start: new Date(2020, 1, 20, 14, 0, 0),
      end: new Date(2020, 1, 20, 18, 0, 0)
    }
  ]
  const overlaps_4 = isTimeOverlappingWithPreviousActivities(
    '15:00',
    '14:00',
    new Date(2020, 1, 20),
    intervals_4
  )

  expect(overlaps_4).toBeFalsy()
})
