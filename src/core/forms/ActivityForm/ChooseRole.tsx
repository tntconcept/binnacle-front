import React from "react"
import styles from "core/forms/ActivityForm/ActivityForm.module.css"
import {useTranslation} from "react-i18next"
import {useQuery} from "react-query"
import Combobox, {IOption} from "core/components/TextField/Combobox"
import {UseComboboxState} from "downshift"
import {ORGANIZATIONS_ENDPOINT, PROJECTS_ENDPOINT} from "services/endpoints"
import {IOrganization} from "interfaces/IOrganization"
import {IProject} from "interfaces/IProject"
import {IProjectRole} from "interfaces/IProjectRole"
import {fetchClient} from "services/fetchClient"
import Index from "core/components/FieldMessage"

const fetchOrganizations = async () =>
  await fetchClient
    .url(ORGANIZATIONS_ENDPOINT)
    .get()
    .json<IOrganization[]>()

const fetchProjectsByOrganization = async ({organizationId}: any) =>
  await fetchClient
    .url(`${ORGANIZATIONS_ENDPOINT}/${organizationId}/projects`)
    .get()
    .json<IProject[]>()

const fetchRolesByProject = async ({projectId}: any) =>
  await fetchClient
    .url(`${PROJECTS_ENDPOINT}/${projectId}/roles`)
    .get()
    .json<IProjectRole[]>()

interface IChooseRole {
  formik: any;
}

const ChooseRole: React.FC<IChooseRole> = props => {
  const {t} = useTranslation()

  const organizations = useQuery<IOrganization[], {}>(
    "organizations",
    fetchOrganizations
  )

  const organizationDataExists =
    organizations.data !== null && props.formik.values.organization
  const organizationId = props.formik.values.organization
    ? props.formik.values.organization.id
    : organizationDataExists ? organizations.data![0].id : null

  const projects = useQuery<IProject[], { organizationId: number }>(
    organizationDataExists && ["projects", {organizationId: organizationId}],
    fetchProjectsByOrganization
  )

  const projectDataExists =
    projects.data !== null && props.formik.values.project
  const projectId = props.formik.values.project
    ? props.formik.values.project.id
    : projectDataExists ? projects.data![0].id : null

  const roles = useQuery<IProjectRole[], { projectId: number }>(
    projectDataExists && ["roles", {projectId: projectId}],
    fetchRolesByProject
  )

  const handleOrganizationSelect = (
    changes: Partial<UseComboboxState<IOption>>
  ) => {
    formik.setFieldValue("organization", changes.selectedItem)
  }

  const handleProjectSelect = (changes: Partial<UseComboboxState<IOption>>) => {

    if (changes.selectedItem) {
      formik.setValues({
        ...formik.values,
        // @ts-ignore
        billable: changes.selectedItem.billable ? "yes" : "no",
        project: changes.selectedItem
      })
    }
  }

  const handleProjectRoleSelect = (
    changes: Partial<UseComboboxState<IOption>>
  ) => {
    formik.setFieldValue("role", changes.selectedItem)
  }

  const {formik} = props

  const projectsDisabled = organizations.isLoading || organizations.error !== null
  const rolesDisabled = projects.isLoading || projects.error !== null

  const checkOrganizationError = () => {
    if (formik.errors.organization && formik.touched.organization) {
      return formik.errors.organization
    }

    if (organizations.error) {
      return 'Error: Failed to fetch'
    }
  }

  return (
    <div className={styles.entitiesContainer}>
      <Combobox
        label={t("activity_form.organization")}
        name="organization"
        options={organizations.data || []}
        initialSelectedItem={formik.values.organization}
        onSelect={handleOrganizationSelect}
        isLoading={organizations.isLoading}
        hasError={organizations.error}
        isDisabled={organizations.error !== null}
      >
        {checkOrganizationError() ?
          <Index text={checkOrganizationError()} isError={checkOrganizationError()}/> : null}
      </Combobox>
      <Combobox
        label={t("activity_form.project")}
        name="project"
        options={projects.data || []}
        initialSelectedItem={formik.values.project}
        onSelect={handleProjectSelect}
        isLoading={projects.isLoading}
        hasError={projects.error}
        isDisabled={projectsDisabled}
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
        hasError={roles.error}
        isDisabled={projectsDisabled || rolesDisabled}
      >
        {formik.errors.role && formik.touched.role ? (
          <div>{formik.errors.role}</div>
        ) : null}
      </Combobox>
    </div>
  )
}

export default ChooseRole
