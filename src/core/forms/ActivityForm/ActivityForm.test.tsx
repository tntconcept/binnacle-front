import React from "react"
import ActivityForm from "core/forms/ActivityForm/ActivityForm"
import {fireEvent, render, waitForDomChange} from "@testing-library/react"
import fetchMock from "fetch-mock"
import {IProjectRole} from "interfaces/IProjectRole"
import {IActivity} from "interfaces/IActivity"

jest.mock('react-i18next', () => ({
  useTranslation: () => ({t: (key: string) => key})
}))

describe("ActivityForm", () => {

  const baseActivity: IActivity = {
    startDate: new Date(2020, 0, 2, 9, 0, 0),
    duration: 180,
    description: "Is Billable",
    billable: true,
    id: 1,
    userId: 200,
    organization: {
      id: 1000,
      name: "Organization Test"
    },
    project: {
      id: 2000,
      name: "Project Test",
      billable: true,
      open: true
    },
    projectRole: {
      id: 3000,
      name: "Role Test"
    }
  }

  beforeEach(fetchMock.restore)

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

    it("should display select entities when the user makes his first-ever imputation", function () {
      const result = render(
        <ActivityForm
          activity={undefined}
          initialSelectedRole={undefined}
          initialStartTime={undefined}
        />
      )

      expect(
        result.getByText("activity_form.organization")
      ).toBeInTheDocument()
      expect(result.getByText("activity_form.project")).toBeInTheDocument()
      expect(result.getByText("activity_form.role")).toBeInTheDocument()
    })

    it("should create activity correctly", function () {
      throw Error("not implemented yet")
    })
  })

  it("should edit an activity", function () {
    const result = render(<ActivityForm activity={baseActivity}/>)

    /*  fireEvent.change(result.getByLabelText("Hora inicio"),{ target: { value: '07:30' } })
        fireEvent.change(result.getByLabelText("Hora fin"),{ target: { value: '13:00' } })
  
  
  
        result.debug()*/

    throw Error("not implemented yet")
  })

  it("should validate fields", async () => {
    const result = render(<ActivityForm/>)

    fireEvent.change(result.getByLabelText("activity_form.end_time"), {
      target: {value: "07:30"}
    })
    fireEvent.click(result.getByTestId("save_activity"))

    await waitForDomChange()

    expect(
      result.getByText("form_errors.end_time_greater")
    ).toBeInTheDocument()
    expect(result.getAllByText("form_errors.field_required").length).toBe(4)
  })

  it("should ask before deleting the activity", function () {
    throw Error("not implemented yet")
  })

  it("should not delete the activity if the user selects no", function () {
    throw Error("not implemented yet")
  })

  it("should update billable selecting a project from frequent roles list", function () {

    // For now frequentRolesList is not implemented yet
    console.warn("Removes this warn when frequentRolesList is already implemented")

    // initialSelectedRole -> activity -> undefined
    const result = render(
      <ActivityForm
        activity={{
          ...baseActivity, projectRole: {
            id: 15,
            name: "React developer"
          }
        }}
        initialStartTime={undefined}
        initialSelectedRole={undefined}
      />
    )

    expect(result.getByTestId("billable_no")).toBeChecked()

    fireEvent.change(result.getByTestId("role_10"), {})

    result.debug()

    throw Error("not implemented yet")
  })

  describe("Entities section", () => {
    it("should update billable selecting a project from select field", async () => {
      fetchMock
        .getOnce("/api/organization", [
          {
            id: 1,
            name: "Adidas"
          },
          {
            id: 2,
            name: "Puma"
          }
        ])
        .getOnce("/api/project/1", [
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
        .getOnce("/api/role/10", [
          {
            id: 100,
            name: "Developer",
            open: true,
            billable: true
          },
          {
            id: 200,
            name: "Pixel perfect",
            open: true,
            billable: false
          }
        ])

      const result = render(
        <ActivityForm
          activity={undefined}
          initialSelectedRole={undefined}
          initialStartTime={undefined}
        />
      )

      await waitForDomChange()

      fireEvent.change(
        result.getByTestId("activity_form.organization_combobox"),
        {target: {value: "Adi"}}
      )

      fireEvent.click(result.getByText("Adidas"))

      fireEvent.change(
        result.getByTestId("activity_form.project_combobox"),
        {target: {value: "Marke"}}
      )

      fireEvent.click(result.getByText("Marketing"))

      await waitForDomChange()

      expect(result.getByTestId("billable_yes")).toBeChecked()
    })

    it("should display select entities filled with the activity's data when it's role has not been found in frequent roles list", async () => {
      fetchMock
        .getOnce("/api/organization", [
          {
            id: 1,
            name: "Adidas"
          },
          {
            id: 2,
            name: "Puma"
          }
        ])
        .getOnce("/api/project/1000", [
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
        .getOnce("/api/role/2000", [
          {
            id: 100,
            name: "Developer",
            open: true,
            billable: true
          },
          {
            id: 200,
            name: "Pixel perfect",
            open: true,
            billable: false
          }
        ])

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

      await waitForDomChange()

      expect(result.getByTestId("activity_form.organization_combobox")).toHaveValue("Organization Test")
      expect(result.getByTestId("activity_form.project_combobox")).toHaveValue("Project Test")
      expect(result.getByTestId("activity_form.role_combobox")).toHaveValue("Role Test")
    })
  })

  describe("Image section", () => {
    it("should upload an image", function () {
      throw Error("not implemented yet")
    })

    it("should download an image", function () {
      throw Error("not implemented yet")
    })
  })
})
