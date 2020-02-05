import React from "react"
import ActivityForm from "core/forms/ActivityForm/ActivityForm"
import {fireEvent, render, wait, waitForDomChange, waitForElement} from "@testing-library/react"
// @ts-ignore
import fetchMock from "fetch-mock/es5/client"
import {IProjectRole} from "interfaces/IProjectRole"
import {IActivity} from "interfaces/IActivity"
import {ORGANIZATION_ENDPOINT, PROJECT_ENDPOINT, PROJECT_ROLE_ENDPOINT} from "services/endpoints"

jest.mock('react-i18next', () => ({
  useTranslation: () => ({t: (key: string) => key})
}))

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: jest.fn(),
  }),
}));

describe("ActivityForm", () => {

  const baseActivity: IActivity = {
    startDate: new Date(2020, 0, 2, 9, 0, 0),
    duration: 180,
    description: "Is Billable",
    billable: true,
    id: 1,
    userId: 200,
    organization: {
      id: 1,
      name: "Puma"
    },
    project: {
      id: 10,
      name: "Marketing",
      billable: true,
      open: true
    },
    projectRole: {
      id: 200,
      name: "Pixel perfect"
    }
  }

  beforeEach(() => {
    fetchMock
      .getOnce(`path:${ORGANIZATION_ENDPOINT}`, [
        {
          id: 1,
          name: "Adidas"
        },
        {
          id: 2,
          name: "Puma"
        }
      ])
      .getOnce(`end:${PROJECT_ENDPOINT}/1`, [
        {
          id: 10,
          name: "Marketing",
          open: true,
          billable: true
        },
        {
          id: 20,
          name: "User experience",
          open: true,
          billable: false
        }
      ])
      .getOnce(`end:${PROJECT_ROLE_ENDPOINT}/10`, [
        {
          id: 100,
          name: "Developer"
        },
        {
          id: 200,
          name: "Pixel perfect",
        }
      ])
  })
  afterEach(fetchMock.restore)

  describe("create a new activity", () => {
    it("should show the last activity role selected", function () {
      const lastSelectedRole: IProjectRole = {id: 15, name: "React developer"}

      const result = render(
        <ActivityForm
          activity={undefined}
          initialSelectedRole={lastSelectedRole}
          initialStartTime={undefined}
        />
      )

      expect(result.getByTestId("role_15")).toBeChecked()
    })

    it("should display select entities when the user makes his first-ever imputation", async () => {
      const result = render(
        <ActivityForm
          activity={undefined}
          initialSelectedRole={undefined}
          initialStartTime={undefined}
        />
      )

      await waitForDomChange()

      expect(
        result.getByText("activity_form.organization")
      ).toBeInTheDocument()
      expect(result.getByText("activity_form.project")).toBeInTheDocument()
      expect(result.getByText("activity_form.role")).toBeInTheDocument()
    })

    it("should create activity correctly", async () => {
      fetchMock.post('end:/api/activities', {foo: true})

      const form = render(<ActivityForm />)

      fireEvent.change(form.getByLabelText("activity_form.start_time"), {target: {value: '10:00'}})
      fireEvent.change(form.getByLabelText("activity_form.end_time"), {target: {value: '13:30'}})
      fireEvent.change(form.getByLabelText("activity_form.description"), {target: {value: "Lorem ipsum."}})

      // await waitForDomChange()

      fireEvent.change(
        form.getByTestId("organization_combobox"),
        {target: {value: "Adidas"}}
      )
      fireEvent.click(form.getByText("Adidas"))

      await waitForDomChange()

      fireEvent.change(
        form.getByTestId("project_combobox"),
        {target: {value: "Mark"}}
      )

      fireEvent.click(form.getByText("Marketing"))

      await waitForDomChange()

      fireEvent.change(
        form.getByTestId("role_combobox"),
        {target: {value: "Pixel"}}
      )
      fireEvent.click(form.getByText("Pixel perfect"))

      // await waitForDomChange()

      fireEvent.click(form.getByTestId("save_activity"))

      await wait()

      expect(JSON.parse(fetchMock.lastOptions().body)).toMatchSnapshot()
    })
  })

  it("should edit an activity", async () => {
    fetchMock.put('end:/api/activities', {foo: true})

    const form = render(<ActivityForm activity={baseActivity}/>)

    const newDescription = "Activity Test Description"

    fireEvent.change(form.getByLabelText("activity_form.description"), {target: {value: newDescription}})

    fireEvent.click(form.getByTestId("save_activity"))

    await wait()

    expect(JSON.parse(fetchMock.lastOptions().body).activity.description).toBe(newDescription)
  })

  it("should validate fields correctly", async () => {
    const result = render(<ActivityForm />)

    // set end time before start time (by default is 9:00)
    fireEvent.change(result.getByLabelText("activity_form.end_time"), {
      target: {value: "07:30"}
    })

    fireEvent.click(result.getByTestId("save_activity"))

    await waitForDomChange()

    expect(result.getByText("form_errors.end_time_greater")).toBeInTheDocument()

    fireEvent.change(result.getByLabelText("activity_form.start_time"), {
      target: {value: ""}
    })

    fireEvent.change(result.getByLabelText("activity_form.end_time"), {
      target: {value: ""}
    })

    fireEvent.click(result.getByTestId("save_activity"))

    await waitForDomChange()

    // One for each select
    expect(result.getAllByText("form_errors.select_an_option").length).toBe(3)

    // Start time, End time and Description
    expect(result.getAllByText("form_errors.field_required").length).toBe(3)

  })

  it("should delete the activity correctly", async () => {
    fetchMock.delete('end:/api/activities/1', {})

    const form = render(<ActivityForm activity={baseActivity} />)

    fireEvent.click(form.getByText('actions.remove'))

    const yesModalButton = await waitForElement(() => form.getByTestId('yes_modal_button'));

    fireEvent.click(yesModalButton)

    await wait()

    expect(fetchMock.lastCall()).toContainEqual("http://localhost:8080/api/activities/1")
  })

  it("should not delete the activity if the user selects no", async () => {
    const form = render(<ActivityForm activity={baseActivity} />)

    fireEvent.click(form.getByText('actions.remove'))

    const noModalButton = await waitForElement(() => form.getByTestId('no_modal_button'));

    fireEvent.click(noModalButton);

    await wait()

    expect(noModalButton).not.toBeInTheDocument()
    expect(form.getByText('actions.remove')).toBeInTheDocument()
  })

  it("should update billable selecting a project from frequent roles list", () => {
    // For now frequentRolesList is mocked
    console.warn("Removes this warning when frequentRolesList is implemented")

    // initialSelectedRole -> activity -> undefined
    const result = render(
      <ActivityForm
        activity={{
          ...baseActivity,
          billable: false,
          projectRole: {
            id: 15,
            name: "React developer"
          }
        }}
        initialStartTime={undefined}
        initialSelectedRole={undefined}
      />
    )

    expect(result.getByTestId("billable_no")).toBeChecked()
    fireEvent.click(result.getByTestId("role_10"), {target: {value: "NobodyKnows"}})

    expect(result.getByTestId("billable_yes")).toBeChecked()
  })


  it("should update billable selecting a project from select field", async () => {
    const result = render(
      <ActivityForm
        activity={undefined}
        initialSelectedRole={undefined}
        initialStartTime={undefined}
      />
    )

    // await waitForDomChange()

    fireEvent.change(
      result.getByTestId("organization_combobox"),
      {target: {value: "Adi"}}
    )

    fireEvent.click(result.getByText("Adidas"))

    await waitForDomChange()

    fireEvent.change(
      result.getByTestId("project_combobox"),
      {target: {value: "Marke"}}
    )

    fireEvent.click(result.getByText("Marketing"))

    await waitForDomChange()

    expect(result.getByTestId("billable_yes")).toBeChecked()
  })

  it("should display select entities filled with the activity's data when it's role has not been found in frequent roles list", async () => {
    const result = render(
      <ActivityForm
        activity={baseActivity}
        initialStartTime="09:00"
        initialSelectedRole={{
          id: 500,
          name: "Role used in another activity"
        }}
      />
    )

    // await waitForDomChange()

    expect(result.getByTestId("organization_combobox")).toHaveValue("Puma")
    expect(result.getByTestId("project_combobox")).toHaveValue("Marketing")
    expect(result.getByTestId("role_combobox")).toHaveValue("Pixel perfect")
  })

  describe.skip("Image section", () => {
    it("should upload an image", function () {
      throw Error("not implemented yet")
    })

    it("should download an image", function () {
      throw Error("not implemented yet")
    })
  })
})
