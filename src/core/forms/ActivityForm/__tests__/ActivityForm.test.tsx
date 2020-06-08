import React, {Suspense} from "react"
import ActivityForm from "core/forms/ActivityForm/ActivityForm"
import {fireEvent, render, waitFor, waitForElementToBeRemoved} from "@testing-library/react"
import fetchMock from "fetch-mock/es5/client"
import endpoints from "api/endpoints"
import {SettingsProvider} from "core/contexts/SettingsContext/SettingsContext"
import {
  buildActivity,
  buildOrganization,
  buildProject,
  buildProjectRole,
  buildRecentRole
} from "utils/generateTestMocks"
import {addMinutes, lightFormat} from "date-fns"
import {IActivity} from "api/interfaces/IActivity"
import {CalendarResourcesContext} from "core/contexts/CalendarResourcesContext"

jest.mock("react-i18next", () => ({
  useTranslation: () => ({t: (key: string) => key})
}))

const setupComboboxes = (projectBillable: boolean = false) => {
  const organization = buildOrganization()
  const project = buildProject({billable: projectBillable})
  const projectRole = buildProjectRole()

  fetchMock
    .getOnce(`end:/${endpoints.organizations}`, [organization])
    .getOnce(`end:/${endpoints.organizations}/${organization.id}/projects`, [
      project
    ])
    .getOnce(`end:/${endpoints.projects}/${project.id}/roles`, [projectRole])

  return {
    organization,
    project,
    projectRole
  }
}

const renderActivityForm = (activity?: IActivity, date: Date = new Date()) => {
  const updateCalendarResources = jest.fn()
  const afterSubmit = jest.fn()
  const utils = render(
    <Suspense fallback={null}>
      <SettingsProvider>
        <CalendarResourcesContext.Provider value={{
          // @ts-ignore
          activitiesReader: jest.fn(() => ({
            activities: [],
            recentRoles: []
          })),
          // @ts-ignore
          holidayReader: jest.fn(() => ({
            publicHolidays: [],
            privateHolidays: [],
          })),
          // @ts-ignore
          timeResource: jest.fn(),
          changeMonth: jest.fn(),
          selectedMonth: date,
          updateCalendarResources: updateCalendarResources,
          fetchTimeResource: jest.fn()
        }}>
          <ActivityForm
            date={date}
            onAfterSubmit={afterSubmit}
            activity={activity}
            lastEndTime={undefined}
          />
        </CalendarResourcesContext.Provider>
      </SettingsProvider>
    </Suspense>
  )

  const selectComboboxOption = async (
    comboboxTestId: string,
    optionText: string
  ) => {
    fireEvent.change(utils.getByTestId(comboboxTestId), {
      target: {value: optionText}
    })
    fireEvent.click(utils.getByTestId(comboboxTestId))

    const optionElement = await utils.findByText(optionText)

    fireEvent.click(optionElement)
  }

  return {
    ...utils,
    updateCalendarResources,
    date,
    afterSubmit,
    selectComboboxOption
  }
}

describe("ActivityForm", () => {
  afterEach(fetchMock.reset)

  describe("create a new activity", () => {
    it("should show the last recent role selected", function () {
      const recentRoles = [
        {
          id: 100,
          name: "Developer",
          projectName: "Marketing",
          projectBillable: false,
          date: new Date()
        }
      ]

      const Wrapper: React.FC = ({children}) => {
        return (
          <SettingsProvider>
            // @ts-ignore
            <CalendarResourcesContext.Provider value={{
              // @ts-ignore
              activitiesReader: jest.fn(() => ({
                activities: [],
                recentRoles: recentRoles
              })),
              updateCalendarResources: jest.fn(),
            }}>
              {children}
            </CalendarResourcesContext.Provider>
          </SettingsProvider>
        )
      }

      const result = render(
        <ActivityForm
          date={new Date()}
          activity={undefined}
          lastEndTime={undefined}
          onAfterSubmit={jest.fn()}
        />,
        {wrapper: Wrapper}
      )

      expect(result.getByTestId("role_100")).toBeChecked()
    })

    it("should display select entities when the user makes his first-ever imputation", async () => {
      const organization = buildOrganization()
      fetchMock.getOnce(`end:/${endpoints.organizations}`, [organization])

      const {getByText} = renderActivityForm()

      await waitFor(() => {
        expect(fetchMock.called(`end:/${endpoints.organizations}`)).toBe(true)
      })

      expect(getByText("activity_form.organization")).toBeInTheDocument()
      expect(getByText("activity_form.project")).toBeInTheDocument()
      expect(getByText("activity_form.role")).toBeInTheDocument()
    })

    it("should create activity", async () => {
      const {organization, project, projectRole} = setupComboboxes()
      const activityToCreate = buildActivity({
        hasImage: false,
        imageFile: undefined,
        startDate: new Date("2020-02-07 09:00"),
        duration: 60,
        organization,
        project,
        projectRole
      })

      fetchMock.postOnce("end:/" + endpoints.activities, activityToCreate)

      const {
        getByLabelText,
        getByTestId,
        afterSubmit,
        updateCalendarResources,
        selectComboboxOption
      } = renderActivityForm(undefined, new Date("2020-02-07"))

      fireEvent.change(getByLabelText("activity_form.start_time"), {
        target: {value: lightFormat(activityToCreate.startDate, "HH:mm")}
      })

      fireEvent.change(getByLabelText("activity_form.end_time"), {
        target: {
          value: lightFormat(
            addMinutes(activityToCreate.startDate, activityToCreate.duration),
            "HH:mm"
          )
        }
      })
      fireEvent.change(getByLabelText("activity_form.description"), {
        target: {value: activityToCreate.description}
      })

      await selectComboboxOption("organization_combobox", organization.name)

      await selectComboboxOption("project_combobox", project.name)

      await selectComboboxOption("role_combobox", projectRole.name)

      fireEvent.click(getByTestId("save_activity"))

      await waitFor(() =>
        expect(fetchMock.called("end:/" + endpoints.activities)).toBeTruthy()
      )

      expect(afterSubmit).toHaveBeenCalled()
      expect(updateCalendarResources).toHaveBeenCalled()
    })
  })

  it("should edit an activity", async () => {
    const {organization, project, projectRole} = setupComboboxes()
    const activityToEdit = buildActivity({
      hasImage: false,
      imageFile: undefined,
      organization,
      project,
      projectRole
    })
    const newActivity = {
      ...activityToEdit,
      description: "Description changed"
    }

    fetchMock
      .putOnce(`end:/${endpoints.activities}`, newActivity)

    const {getByLabelText, getByTestId, afterSubmit, updateCalendarResources} = renderActivityForm(activityToEdit)

    fireEvent.change(getByLabelText("activity_form.description"), {
      target: {value: newActivity.description}
    })

    fireEvent.click(getByTestId("save_activity"))

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toContain(endpoints.activities)
    })

    expect(afterSubmit).toHaveBeenCalled()
    expect(updateCalendarResources).toHaveBeenCalled()
  })

  it("should validate fields", async () => {
    setupComboboxes()

    const {
      getByLabelText,
      getByTestId,
      findByText,
      getAllByText
    } = renderActivityForm()

    // set end time before start time (by default is 9:00)
    fireEvent.change(getByLabelText("activity_form.end_time"), {
      target: {value: "07:30"}
    })

    fireEvent.click(getByTestId("save_activity"))

    await findByText("form_errors.end_time_greater")

    fireEvent.change(getByLabelText("activity_form.start_time"), {
      target: {value: ""}
    })

    fireEvent.change(getByLabelText("activity_form.end_time"), {
      target: {value: ""}
    })

    fireEvent.click(getByTestId("save_activity"))

    await waitFor(() => {
      expect(getAllByText("form_errors.field_required").length).toBe(3)
    })

    expect(getAllByText("form_errors.select_an_option").length).toBe(1)
  })

  it("should delete the activity", async () => {
    const {organization, project, projectRole} = setupComboboxes()
    const activityToDelete = buildActivity({
      hasImage: false,
      imageFile: undefined,
      organization,
      project,
      projectRole
    })
    fetchMock.deleteOnce(
      `end:/${endpoints.activities}/${activityToDelete.id}`,
      activityToDelete
    )

    const {
      getByText,
      findByTestId,
      updateCalendarResources,
      afterSubmit
    } = renderActivityForm(activityToDelete)

    fireEvent.click(getByText("actions.remove"))

    const yesModalButton = await findByTestId("yes_modal_button")
    fireEvent.click(yesModalButton)

    await waitForElementToBeRemoved(yesModalButton)

    expect(afterSubmit).toHaveBeenCalled()
    expect(updateCalendarResources).toHaveBeenCalled()
  })

  it("should NOT delete the activity if the user abort delete operation", async () => {
    const {organization, project, projectRole} = setupComboboxes()
    const activityToDelete = buildActivity({
      hasImage: false,
      imageFile: undefined,
      organization,
      project,
      projectRole
    })

    const {getByText, findByTestId, afterSubmit} = renderActivityForm(activityToDelete)

    fireEvent.click(getByText("actions.remove"))

    const noModalButton = await findByTestId("no_modal_button")
    fireEvent.click(noModalButton)

    await waitFor(() => {
      expect(noModalButton).not.toBeInTheDocument()
    })

    expect(afterSubmit).not.toHaveBeenCalled()
    expect(getByText("actions.remove")).toBeInTheDocument()
  })

  it("should update the billable field selecting a project that is billable from recent roles list", async () => {
    const recentRoleBillable = buildRecentRole({
      projectBillable: true,
      name: "ROLE BILLABLE"
    })

    const recentRoleUnbillable = buildRecentRole({
      projectBillable: false,
      name: "Role NO BILLABLE"
    })

    const recentRoles = [recentRoleUnbillable, recentRoleBillable]

    const Wrapper: React.FC = ({children}) => {
      return (
        <SettingsProvider>
          <CalendarResourcesContext.Provider value={{
            // @ts-ignore
            activitiesReader: jest.fn(() => ({
              activities: [],
              recentRoles: recentRoles
            })),
            updateCalendarResources: jest.fn(),
          }}>
            {children}
          </CalendarResourcesContext.Provider>
        </SettingsProvider>
      )
    }

    const result = render(
      <ActivityForm
        date={new Date()}
        activity={undefined}
        lastEndTime={undefined}
        onAfterSubmit={jest.fn()}
      />,
      {wrapper: Wrapper}
    )

    // Billable field is not checked because by default gets the billable value of the last imputed role
    expect(result.getByTestId("billable_checkbox")).not.toBeChecked()

    const billableRecentRoleElement = result.getByLabelText(
      new RegExp(recentRoleBillable.name)
    )
    fireEvent.click(billableRecentRoleElement)

    expect(result.getByTestId("billable_checkbox")).toBeChecked()
  })

  it("should update billable selecting a project from the combobox field", async () => {
    const {organization, project} = setupComboboxes(true)

    const {getByTestId, selectComboboxOption} = renderActivityForm()

    expect(getByTestId("billable_checkbox")).not.toBeChecked()

    await selectComboboxOption("organization_combobox", organization.name)

    await selectComboboxOption("project_combobox", project.name)

    expect(getByTestId("billable_checkbox")).toBeChecked()

    await waitFor(() => {
      expect(fetchMock.done()).toBe(true)
    })
  })

  it("should display select entities filled with the activity's data when it's role has not been found in frequent roles list", async () => {
    const {organization, project, projectRole} = setupComboboxes()
    const activity = buildActivity({
      organization,
      project,
      projectRole
    })

    const {getByTestId} = renderActivityForm(activity)

    await waitFor(() => {
      expect(fetchMock.done()).toBe(true)
    })

    expect(getByTestId("organization_combobox")).toHaveValue(
      activity.organization.name
    )
    expect(getByTestId("project_combobox")).toHaveValue(activity.project.name)
    expect(getByTestId("role_combobox")).toHaveValue(activity.projectRole.name)
  })

  it("should upload an image and perform actions", async () => {
    setupComboboxes()

    const result = renderActivityForm()

    const file = new File(["(⌐□_□)"], "test.jpg", {
      type: "image/jpg"
    })

    const uploadImgButton = result.getByTestId('upload_img')

    Object.defineProperty(uploadImgButton, "files", {
      value: [file]
    })

    fireEvent.change(uploadImgButton)

    const openImgButton = await result.findByTestId("open-image")

    expect(openImgButton).toBeInTheDocument()

    const openMock = jest.fn()
    window.open = openMock
    fireEvent.click(openImgButton)

    expect(openMock).toHaveBeenCalled()

    const deleteImgButton = result.getByTestId("delete-image")
    fireEvent.click(deleteImgButton)

    expect(deleteImgButton).not.toBeInTheDocument()
    expect(openImgButton).not.toBeInTheDocument()
    expect(uploadImgButton).toBeInTheDocument()
  })

  it("should download the image base64 when the user wants to see the image", async () => {
    const {organization, project, projectRole} = setupComboboxes()
    const activity = buildActivity({
      hasImage: true,
      organization,
      project,
      projectRole
    })

    fetchMock.getOnce(
      `end:/${endpoints.activities}/${activity.id}/image`,
      "(⌐□_□)"
    )

    const {findByTestId} = renderActivityForm(activity)

    const openImgButton = await findByTestId("open-image")

    const openMock = jest.fn()
    window.open = openMock
    fireEvent.click(openImgButton)

    await waitFor(() => {
      expect(
        fetchMock.called(`end:/${endpoints.activities}/${activity.id}/image`)
      ).toBeTruthy()
    })

    expect(openMock).toHaveBeenCalled()
  })
})
