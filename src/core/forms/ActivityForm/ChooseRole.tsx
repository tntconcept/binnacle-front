import React from "react"
import styles from "core/forms/ActivityForm/ActivityForm.module.css"
import {useTranslation} from "react-i18next"
import {useQuery} from "react-query"
import Combobox, {IOption} from "core/components/Combobox"
import {UseComboboxState} from "downshift"
import {ORGANIZATION_ENDPOINT, PROJECT_ENDPOINT, PROJECT_ROLE_ENDPOINT} from "services/endpoints"
import {IOrganization} from "interfaces/IOrganization"
import {IProject} from "interfaces/IProject"
import {IProjectRole} from "interfaces/IProjectRole"
import {fetchClient} from "services/fetchClient"

const fetchOrganizations = async () =>
  await fetchClient
    .url(ORGANIZATION_ENDPOINT)
    .get()
    .json<IOrganization[]>();

const fetchProjects = async ({ organizationId }: any) =>
  await fetchClient
    .url(PROJECT_ENDPOINT + "/" + organizationId)
    .get()
    .json<IProject[]>();

const fetchProjectRoles = async ({ projectId }: any) =>
  await fetchClient
    .url(PROJECT_ROLE_ENDPOINT + "/" + projectId)
    .get()
    .json<IProjectRole[]>();

interface IChooseRole {
  formik: any;
}

const ChooseRole: React.FC<IChooseRole> = props => {
  const { t } = useTranslation();

  const organizations = useQuery<IOrganization[], {}>(
    "organizations",
    fetchOrganizations
  );

  const organizationDataExists =
    organizations.data !== null && props.formik.values.organization;
  const organizationId = props.formik.values.organization
    ? props.formik.values.organization.id
    : organizationDataExists ? organizations.data![0].id : null;

  const projects = useQuery<IProject[], { organizationId: number }>(
    organizationDataExists && ["projects", { organizationId: organizationId }],
    fetchProjects
  );

  const projectDataExists =
    projects.data !== null && props.formik.values.project;
  const projectId = props.formik.values.project
    ? props.formik.values.project.id
    : projectDataExists ? projects.data![0].id : null;

  const roles = useQuery<IProjectRole[], { projectId: number }>(
    projectDataExists && ["roles", { projectId: projectId }],
    fetchProjectRoles
  );

  const handleOrganizationSelect = (
    changes: Partial<UseComboboxState<IOption>>
  ) => {
    formik.setFieldValue("organization", changes.selectedItem);
  };

  const handleProjectSelect = (changes: Partial<UseComboboxState<IOption>>) => {
    formik.setFieldValue(
      "billable",
      // @ts-ignore
      changes.selectedItem.billable ? "yes" : "no"
    );
    formik.setFieldValue("project", changes.selectedItem);
  };

  const handleProjectRoleSelect = (
    changes: Partial<UseComboboxState<IOption>>
  ) => {
    formik.setFieldValue("role", changes.selectedItem);
  };

  const { formik } = props;

  return (
    <div className={styles.entitiesContainer}>
      <Combobox
        label={t("activity_form.organization")}
        name="organization"
        options={organizations.data || []}
        initialSelectedItem={formik.values.organization}
        onSelect={handleOrganizationSelect}
        isLoading={organizations.isLoading}
      >
        {formik.errors.organization && formik.touched.organization ? (
          <div>{formik.errors.organization}</div>
        ) : null}
      </Combobox>
      <Combobox
        label={t("activity_form.project")}
        name="project"
        options={projects.data || []}
        initialSelectedItem={formik.values.project}
        onSelect={handleProjectSelect}
        isLoading={projects.isLoading}
      >
        {formik.errors.project && formik.touched.project ? (
          <div>{formik.errors.project}</div>
        ) : null}
      </Combobox>
      <Combobox
        label={t("activity_form.role")}
        name="role"
        options={roles.data || []}
        initialSelectedItem={formik.values.role}
        onSelect={handleProjectRoleSelect}
        isLoading={roles.isLoading}
      >
        {formik.errors.role && formik.touched.role ? (
          <div>{formik.errors.role}</div>
        ) : null}
      </Combobox>
    </div>
  );
};

export default ChooseRole;
