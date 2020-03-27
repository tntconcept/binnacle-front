import React from "react"
import ActivityForm from "core/forms/ActivityForm/ActivityForm"
import {fireEvent, render, waitFor, waitForElementToBeRemoved} from "@testing-library/react"
import fetchMock from "fetch-mock/es5/client"
import {BinnacleDataContext, BinnacleDataProvider} from "core/contexts/BinnacleContext/BinnacleDataProvider"
import endpoints from "api/endpoints"
import {SettingsProvider} from "core/contexts/SettingsContext/SettingsContext"
import {
  buildActivity,
  buildOrganization,
  buildProject,
  buildProjectRole,
  buildRecentRole
} from "utils/generateTestMocks"
import {initialBinnacleState} from "core/contexts/BinnacleContext/BinnacleReducer"
import {addMinutes, lightFormat} from "date-fns"
import {BinnacleActions} from "core/contexts/BinnacleContext/BinnacleActions"


jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key })
}));

const Providers: React.FC = ({ children }) => {
  return (
    <SettingsProvider>
      <BinnacleDataProvider>{children}</BinnacleDataProvider>
    </SettingsProvider>
  );
};

const selectComboboxOption = async (
  ui: any,
  comboboxTestId: string,
  optionText: string
) => {
  fireEvent.change(ui.getByTestId(comboboxTestId), {
    target: { value: optionText }
  });
  fireEvent.click(ui.getByTestId(comboboxTestId));

  const optionElement = await ui.findByText(optionText)

  fireEvent.click(optionElement);
};

describe("ActivityForm", () => {

  afterEach(fetchMock.reset)

  describe("create a new activity", () => {
    it("should show the last activity role selected", function() {
      const Wrapper: React.FC = ({ children }) => {
        return (
          <SettingsProvider>
            <BinnacleDataContext.Provider
              value={{
                dispatch: jest.fn(),
                state: {
                  ...initialBinnacleState,
                  recentRoles: [
                    {
                      id: 100,
                      name: "Developer",
                      projectName: "Marketing",
                      projectBillable: false,
                      date: new Date()
                    }
                  ],
                  lastImputedRole: {
                    id: 100,
                    name: "Developer",
                    projectName: "Marketing",
                    projectBillable: false,
                    date: new Date()
                  }
                }
              }}
            >
              {children}
            </BinnacleDataContext.Provider>
          </SettingsProvider>
        );
      };

      const result = render(
        <ActivityForm
          date={new Date()}
          activity={undefined}
          lastEndTime={undefined}
          onAfterSubmit={jest.fn()}
        />,
        { wrapper: Wrapper }
      );

      expect(result.getByTestId("role_100")).toBeChecked();
    });

    it("should display select entities when the user makes his first-ever imputation", async () => {
      fetchMock
        .getOnce(`path:/${endpoints.organizations}`, [
          {
            id: 1,
            name: "Adidas"
          },
          {
            id: 2,
            name: "Puma"
          }
        ])
        .getOnce(`end:/${endpoints.organizations}/1/projects`, [
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
        .getOnce(`end:/${endpoints.projects}/10/roles`, [
          {
            id: 100,
            name: "Developer"
          },
          {
            id: 200,
            name: "Pixel perfect"
          }
        ]);

      const result = render(
        <ActivityForm
          date={new Date()}
          activity={undefined}
          lastEndTime={undefined}
          onAfterSubmit={jest.fn()}
        />,
        { wrapper: Providers }
      );

      expect(
        result.getByText("activity_form.organization")
      ).toBeInTheDocument();
      expect(result.getByText("activity_form.project")).toBeInTheDocument();
      expect(result.getByText("activity_form.role")).toBeInTheDocument();
    });

    it("should create activity", async () => {
      const organization = buildOrganization();
      const project = buildProject({ billable: false });
      const projectRole = buildProjectRole();
      const activityToCreate = buildActivity({
        hasImage: false,
        imageFile: undefined,
        startDate: new Date("2020-02-07 09:00"),
        duration: 60,
        organization,
        project,
        projectRole
      });

      fetchMock
        .getOnce(`end:/${endpoints.organizations}`, [organization])
        .getOnce(
          `end:/${endpoints.organizations}/${organization.id}/projects`,
          [project]
        )
        .getOnce(`end:/${endpoints.projects}/${project.id}/roles`, [
          projectRole
        ]);
      fetchMock.postOnce("end:/" + endpoints.activities, activityToCreate);

      const afterSubmit = jest.fn();
      const binnacleDispatch = jest.fn();
      const date = new Date("2020-02-07");
      const form = render(
        <SettingsProvider>
          <BinnacleDataContext.Provider
            value={{ state: initialBinnacleState, dispatch: binnacleDispatch }}
          >
            <ActivityForm date={date} onAfterSubmit={afterSubmit} />
          </BinnacleDataContext.Provider>
        </SettingsProvider>
      );

      fireEvent.change(form.getByLabelText("activity_form.start_time"), {
        target: { value: lightFormat(activityToCreate.startDate, "HH:mm") }
      });

      fireEvent.change(form.getByLabelText("activity_form.end_time"), {
        target: {
          value: lightFormat(
            addMinutes(activityToCreate.startDate, activityToCreate.duration),
            "HH:mm"
          )
        }
      });
      fireEvent.change(form.getByLabelText("activity_form.description"), {
        target: { value: activityToCreate.description }
      });

      await selectComboboxOption(
        form,
        "organization_combobox",
        organization.name
      );

      await selectComboboxOption(form, "project_combobox", project.name);

      await selectComboboxOption(form, "role_combobox", projectRole.name);

      fireEvent.click(form.getByTestId("save_activity"));

      await waitFor(() => expect(fetchMock.called("end:/" + endpoints.activities)).toBeTruthy())

      expect(afterSubmit).toHaveBeenCalled();
      expect(binnacleDispatch).toHaveBeenNthCalledWith(
        1,
        BinnacleActions.createActivity(activityToCreate)
      );
      expect(binnacleDispatch).toHaveBeenNthCalledWith(
        2,
        BinnacleActions.addRecentRole(
          buildRecentRole({
            id: projectRole.id,
            name: projectRole.name,
            projectName: project.name,
            projectBillable: project.billable,
            date: date
          })
        )
      );
    });
  });

  it("should edit an activity", async () => {
    const organization = buildOrganization();
    const project = buildProject({ billable: true });
    const projectRole = buildProjectRole();
    const activityToEdit = buildActivity({
      hasImage: false,
      imageFile: undefined,
      organization,
      project,
      projectRole
    });
    const expectedActivityResult = {
      ...activityToEdit,
      description: "Description changed"
    };

    fetchMock
      .get(`end:/${endpoints.organizations}`, [organization])
      .getOnce(`end:/${endpoints.organizations}/${organization.id}/projects`, [
        project
      ])
      .getOnce(`end:/${endpoints.projects}/${project.id}/roles`, [projectRole]);
    fetchMock.put(`end:/${endpoints.activities}`, expectedActivityResult);

    const afterSubmit = jest.fn();
    const binnacleDispatch = jest.fn();
    const date = new Date();
    const form = render(
      <SettingsProvider>
        <BinnacleDataContext.Provider
          value={{ state: initialBinnacleState, dispatch: binnacleDispatch }}
        >
          <ActivityForm
            date={date}
            activity={activityToEdit}
            onAfterSubmit={afterSubmit}
          />
        </BinnacleDataContext.Provider>
      </SettingsProvider>
    );

    fireEvent.change(form.getByLabelText("activity_form.description"), {
      target: { value: expectedActivityResult.description }
    });

    fireEvent.click(form.getByTestId("save_activity"));

    await waitFor(() => {
      expect(fetchMock.called("end:/" + endpoints.activities)).toBeTruthy()
    });

    expect(afterSubmit).toHaveBeenCalled();
    expect(binnacleDispatch).toHaveBeenNthCalledWith(
      1,
      BinnacleActions.updateActivity(expectedActivityResult)
    );
    expect(binnacleDispatch).toHaveBeenNthCalledWith(
      2,
      BinnacleActions.addRecentRole(
        buildRecentRole({
          id: projectRole.id,
          name: projectRole.name,
          projectName: project.name,
          projectBillable: project.billable,
          date: date
        })
      )
    );
  });

  it("should validate fields", async () => {
    const organization = buildOrganization();
    const project = buildProject({ billable: true });
    const projectRole = buildProjectRole();

    fetchMock
      .get(`end:/${endpoints.organizations}`, [organization])
      .getOnce(`end:/${endpoints.organizations}/${organization.id}/projects`, [
        project
      ])
      .getOnce(`end:/${endpoints.projects}/${project.id}/roles`, [projectRole]);

    const afterSubmit = jest.fn();
    const date = new Date();

    const result = render(
      <ActivityForm date={date} onAfterSubmit={afterSubmit} />,
      { wrapper: Providers }
    );

    // set end time before start time (by default is 9:00)
    fireEvent.change(result.getByLabelText("activity_form.end_time"), {
      target: { value: "07:30" }
    });

    fireEvent.click(result.getByTestId("save_activity"));

    await result.findByText("form_errors.end_time_greater")

    fireEvent.change(result.getByLabelText("activity_form.start_time"), {
      target: { value: "" }
    });

    fireEvent.change(result.getByLabelText("activity_form.end_time"), {
      target: { value: "" }
    });

    fireEvent.click(result.getByTestId("save_activity"));

    await waitFor(() => {
      expect(result.getAllByText("form_errors.field_required").length).toBe(3);
    })

    expect(result.getAllByText("form_errors.select_an_option").length).toBe(1);

  });

  it("should delete the activity", async () => {
    const organization = buildOrganization();
    const project = buildProject({ billable: true });
    const projectRole = buildProjectRole();
    const activityToDelete = buildActivity({
      hasImage: false,
      imageFile: undefined,
      organization,
      project,
      projectRole
    });
    fetchMock
      .getOnce(`end:/${endpoints.organizations}`, [organization])
      .getOnce(`end:/${endpoints.organizations}/${organization.id}/projects`, [
        project
      ])
      .getOnce(`end:/${endpoints.projects}/${project.id}/roles`, [projectRole]);

    fetchMock.deleteOnce(
      `end:/${endpoints.activities}/${activityToDelete.id}`,
      activityToDelete
    );

    const afterSubmit = jest.fn();
    const binnacleDispatch = jest.fn();
    const form = render(
      <SettingsProvider>
        <BinnacleDataContext.Provider
          value={{ state: initialBinnacleState, dispatch: binnacleDispatch }}
        >
          <ActivityForm
            date={new Date()}
            activity={activityToDelete}
            onAfterSubmit={afterSubmit}
          />
        </BinnacleDataContext.Provider>
      </SettingsProvider>
    );

    fireEvent.click(form.getByText("actions.remove"));

    const yesModalButton = await form.findByTestId("yes_modal_button");
    fireEvent.click(yesModalButton);

    await waitForElementToBeRemoved(yesModalButton)

    expect(binnacleDispatch).toHaveBeenCalledWith(BinnacleActions.deleteActivity(activityToDelete));
    expect(afterSubmit).toHaveBeenCalled();
  });

  it("should NOT delete the activity if the user abort delete operation", async () => {
    const organization = buildOrganization();
    const project = buildProject({ billable: true });
    const projectRole = buildProjectRole();
    const activityToDelete = buildActivity({
      hasImage: false,
      imageFile: undefined,
      organization,
      project,
      projectRole
    });
    fetchMock
      .get(`end:/${endpoints.organizations}`, [organization])
      .getOnce(`end:/${endpoints.organizations}/${organization.id}/projects`, [
        project
      ])
      .getOnce(`end:/${endpoints.projects}/${project.id}/roles`, [projectRole]);

    const afterSubmit = jest.fn();
    const form = render(
      <ActivityForm
        date={new Date()}
        activity={activityToDelete}
        onAfterSubmit={afterSubmit}
      />,
      { wrapper: Providers }
    );

    fireEvent.click(form.getByText("actions.remove"));

    const noModalButton = await form.findByTestId("no_modal_button")
    fireEvent.click(noModalButton);

    await waitFor(() => {
      expect(noModalButton).not.toBeInTheDocument()
    })

    expect(afterSubmit).not.toHaveBeenCalled();
    expect(form.getByText("actions.remove")).toBeInTheDocument();
  });

  it("should update the billable field selecting a project that is billable from recent roles list", async () => {
    const recentRoleUnbillable = buildRecentRole({projectBillable: false, name: "Role NO BILLABLE"})
    const recentRoleBillable = buildRecentRole({projectBillable: true, name: "ROLE BILLABLE"})
    const Wrapper: React.FC = ({ children }) => {
      return (
        <SettingsProvider>
          <BinnacleDataContext.Provider
            value={{
              dispatch: jest.fn(),
              state: {
                ...initialBinnacleState,
                recentRoles: [recentRoleUnbillable, recentRoleBillable],
                lastImputedRole: recentRoleUnbillable
              }
            }}
          >
            {children}
          </BinnacleDataContext.Provider>
        </SettingsProvider>
      );
    };

    const result = render(
      <ActivityForm
        date={new Date()}
        activity={undefined}
        lastEndTime={undefined}
        onAfterSubmit={jest.fn()}
      />,
      { wrapper: Wrapper }
    );

    // Billable field is not checked because by default gets the billable value of the last imputed role
    expect(result.getByTestId("billable_checkbox")).not.toBeChecked();

    const billableRecentRoleElement = result.getByLabelText(new RegExp(recentRoleBillable.name))
    fireEvent.click(billableRecentRoleElement)

    expect(result.getByTestId("billable_checkbox")).toBeChecked();
  });

  it("should update billable selecting a project from the combobox field", async () => {
    const organization = buildOrganization();
    const project = buildProject({ billable: true });
    const projectRole = buildProjectRole();
    fetchMock
      .get(`end:/${endpoints.organizations}`, [organization])
      .getOnce(`end:/${endpoints.organizations}/${organization.id}/projects`, [
        project
      ])
      .getOnce(`end:/${endpoints.projects}/${project.id}/roles`, [projectRole]);


    const result = render(
      <ActivityForm
        date={new Date()}
        activity={undefined}
        lastEndTime={undefined}
        onAfterSubmit={jest.fn()}
      />,
      { wrapper: Providers }
    );

    expect(result.getByTestId("billable_checkbox")).not.toBeChecked();

    await selectComboboxOption(result, "organization_combobox", organization.name)

    await selectComboboxOption(result, "project_combobox", project.name)

    expect(result.getByTestId("billable_checkbox")).toBeChecked();
  });

  it("should display select entities filled with the activity's data when it's role has not been found in frequent roles list", async () => {
    const activity = buildActivity()

    const result = render(
      <ActivityForm
        date={new Date()}
        activity={activity}
        lastEndTime={undefined}
        onAfterSubmit={jest.fn()}
      />,
      { wrapper: Providers }
    );

    expect(result.getByTestId("organization_combobox")).toHaveValue(activity.organization.name);
    expect(result.getByTestId("project_combobox")).toHaveValue(activity.project.name);
    expect(result.getByTestId("role_combobox")).toHaveValue(activity.projectRole.name);
  });

  describe.skip("Image section", () => {
    it("should upload an image", function() {
      throw Error("not implemented yet");
    });

    it("should download an image", function() {
      throw Error("not implemented yet");
    });
  });
});
